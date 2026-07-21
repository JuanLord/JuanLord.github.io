import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { createServer as createHttpServer } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { createServer as createViteServer, loadEnv } from "vite";

const studioDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(studioDirectory, "..");
const draftDirectory = resolve(repositoryRoot, ".portfolio-studio");
const draftPath = resolve(draftDirectory, "content.json");
const env = loadEnv("studio", repositoryRoot, "");
const port = Number(env.STUDIO_PORT || 4174);

const r2Config = {
  accountId: env.R2_ACCOUNT_ID,
  accessKeyId: env.R2_ACCESS_KEY_ID,
  secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  bucketName: env.R2_BUCKET_NAME,
  publicBaseUrl: env.R2_PUBLIC_BASE_URL?.replace(/\/$/, ""),
};

const r2Fields = {
  R2_ACCOUNT_ID: r2Config.accountId,
  R2_ACCESS_KEY_ID: r2Config.accessKeyId,
  R2_SECRET_ACCESS_KEY: r2Config.secretAccessKey,
  R2_BUCKET_NAME: r2Config.bucketName,
  R2_PUBLIC_BASE_URL: r2Config.publicBaseUrl,
};
const missingR2Fields = Object.entries(r2Fields)
  .filter(([, value]) => !value)
  .map(([key]) => key);
if (r2Config.publicBaseUrl) {
  try {
    if (new URL(r2Config.publicBaseUrl).protocol !== "https:") {
      missingR2Fields.push("R2_PUBLIC_BASE_URL");
    }
  } catch {
    missingR2Fields.push("R2_PUBLIC_BASE_URL");
  }
}

const s3 =
  missingR2Fields.length === 0
    ? new S3Client({
        region: "auto",
        endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: r2Config.accessKeyId,
          secretAccessKey: r2Config.secretAccessKey,
        },
      })
    : null;

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

async function readBody(request, maxBytes) {
  const chunks = [];
  let total = 0;
  for await (const chunk of request) {
    total += chunk.length;
    if (total > maxBytes) throw new Error("Request is larger than allowed.");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readJson(request) {
  const body = await readBody(request, 10 * 1024 * 1024);
  return JSON.parse(body.toString("utf8"));
}

function assertStudioDocument(document) {
  if (
    !document ||
    document.schemaVersion !== 1 ||
    !Array.isArray(document.photoTrips) ||
    !Array.isArray(document.places) ||
    !Array.isArray(document.hikes) ||
    !Array.isArray(document.creativeProjects) ||
    !document.creativeProfile
  ) {
    throw new Error("Studio document has an unsupported structure.");
  }
}

async function atomicWrite(path, contents) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, contents, "utf8");
  await rename(temporaryPath, path);
}

function typedModule(importLine, exportName, value, typeExpression) {
  return `${importLine}\n\nexport const ${exportName}: ${typeExpression} = ${JSON.stringify(value, null, 2)};\n`;
}

function createMapPoints(document) {
  return [
    ...document.photoTrips.map((trip) => ({
      id: `map-photo-${trip.slug}`,
      label: `${trip.title} photo folder`,
      coordinates: trip.coordinates,
      kind: "photography",
      to: `/creative/photography/${trip.slug}`,
    })),
    ...document.hikes.map((hike) => ({
      id: `map-hike-${hike.slug}`,
      label: `${hike.trail} hike`,
      coordinates: hike.coordinates,
      kind: "hike",
      to: `/creative/travel/hikes/${hike.slug}`,
    })),
  ];
}

function createPublicDocument(document) {
  const photoTrips = document.photoTrips
    .filter((trip) => trip.status !== "draft")
    .map((trip) => ({
      ...trip,
      photos: trip.photos.filter((photo) => photo.status !== "draft"),
    }));
  const hikes = document.hikes.filter((hike) => hike.status !== "draft");
  const photoTripSlugs = new Set(photoTrips.map((trip) => trip.slug));
  const hikeSlugs = new Set(hikes.map((hike) => hike.slug));

  return {
    ...document,
    photoTrips,
    hikes: hikes.map((hike) => ({
      ...hike,
      relatedPhotoTripSlug: photoTripSlugs.has(hike.relatedPhotoTripSlug)
        ? hike.relatedPhotoTripSlug
        : undefined,
    })),
    places: document.places
      .filter((place) => place.status !== "draft")
      .map((place) => ({
        ...place,
        relatedPhotoTripSlug: photoTripSlugs.has(place.relatedPhotoTripSlug)
          ? place.relatedPhotoTripSlug
          : undefined,
        relatedHikeSlug: hikeSlugs.has(place.relatedHikeSlug)
          ? place.relatedHikeSlug
          : undefined,
      })),
    creativeProjects: document.creativeProjects.filter(
      (project) => project.status !== "draft",
    ),
  };
}

async function publishDocument(document) {
  const publicDocument = createPublicDocument(document);
  const creativeDirectory = resolve(repositoryRoot, "src/content/creative");
  const outputs = [
    [
      resolve(creativeDirectory, "photography.ts"),
      typedModule(
        'import type { PhotoTrip } from "../../types/content";',
        "photoTrips",
        publicDocument.photoTrips,
        "PhotoTrip[]",
      ),
    ],
    [
      resolve(creativeDirectory, "profile.ts"),
      typedModule(
        'import type { CreativeProfile } from "../../types/content";',
        "creativeProfile",
        publicDocument.creativeProfile,
        "CreativeProfile",
      ),
    ],
    [
      resolve(creativeDirectory, "projects.ts"),
      typedModule(
        'import type { CreativeProject } from "../../types/content";',
        "creativeProjects",
        publicDocument.creativeProjects,
        "CreativeProject[]",
      ),
    ],
    [
      resolve(creativeDirectory, "travel.ts"),
      [
        'import type { CreativeMapPoint, Hike, TravelPlace } from "../../types/content";',
        "",
        `export const places: TravelPlace[] = ${JSON.stringify(publicDocument.places, null, 2)};`,
        "",
        `export const hikes: Hike[] = ${JSON.stringify(publicDocument.hikes, null, 2)};`,
        "",
        `export const creativeMapPoints: CreativeMapPoint[] = ${JSON.stringify(createMapPoints(publicDocument), null, 2)};`,
        "",
      ].join("\n"),
    ],
  ];

  await Promise.all(
    outputs.map(([path, contents]) => atomicWrite(path, contents)),
  );
}

function safeSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uploadPhoto(request, response, url) {
  if (!s3) {
    sendJson(response, 503, {
      message: `R2 is not configured. Missing: ${missingR2Fields.join(", ")}.`,
    });
    return;
  }

  const tripSlug = safeSlug(url.searchParams.get("tripSlug") || "");
  if (!tripSlug) {
    sendJson(response, 400, { message: "A valid trip slug is required." });
    return;
  }

  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ]);
  const contentType = request.headers["content-type"]?.split(";")[0];
  if (!contentType || !allowedTypes.has(contentType)) {
    sendJson(response, 415, {
      message: "Use a JPEG, PNG, WebP, HEIC, or HEIF image.",
    });
    return;
  }

  const input = await readBody(request, 35 * 1024 * 1024);
  const originalName = decodeURIComponent(
    request.headers["x-file-name"] || "photograph",
  );
  const stem = safeSlug(originalName.replace(/\.[^.]+$/, "")) || "photograph";
  const id = `${Date.now()}-${randomUUID().slice(0, 8)}`;
  const baseKey = `photography/${tripSlug}/${id}-${stem}`;
  const storageKey = `${baseKey}-display.webp`;
  const thumbnailStorageKey = `${baseKey}-thumb.webp`;

  const source = sharp(input, {
    failOn: "error",
    limitInputPixels: 100_000_000,
  }).rotate();
  const [display, thumbnail] = await Promise.all([
    source
      .clone()
      .resize({
        width: 2200,
        height: 2200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 5 })
      .toBuffer({ resolveWithObject: true }),
    source
      .clone()
      .resize({
        width: 720,
        height: 720,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 76, effort: 5 })
      .toBuffer({ resolveWithObject: true }),
  ]);

  const upload = (Key, Body) =>
    s3.send(
      new PutObjectCommand({
        Bucket: r2Config.bucketName,
        Key,
        Body,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

  try {
    await Promise.all([
      upload(storageKey, display.data),
      upload(thumbnailStorageKey, thumbnail.data),
    ]);
  } catch (error) {
    await s3
      .send(
        new DeleteObjectsCommand({
          Bucket: r2Config.bucketName,
          Delete: {
            Objects: [{ Key: storageKey }, { Key: thumbnailStorageKey }],
          },
        }),
      )
      .catch(() => undefined);
    throw error;
  }

  sendJson(response, 201, {
    id,
    src: `${r2Config.publicBaseUrl}/${storageKey}`,
    thumbnailSrc: `${r2Config.publicBaseUrl}/${thumbnailStorageKey}`,
    storageKey,
    thumbnailStorageKey,
    alt: stem.replace(/-/g, " "),
    caption: "",
    date: new Date().toISOString().slice(0, 10),
    width: display.info.width,
    height: display.info.height,
    status: "draft",
  });
}

async function handleApi(request, response) {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  const host = request.headers.host?.split(":")[0];
  const origin = request.headers.origin;
  let trustedOrigin = true;
  if (origin) {
    try {
      trustedOrigin = ["127.0.0.1", "localhost"].includes(
        new URL(origin).hostname,
      );
    } catch {
      trustedOrigin = false;
    }
  }
  if (!["127.0.0.1", "localhost"].includes(host) || !trustedOrigin) {
    sendJson(response, 403, { message: "Studio requests must be local." });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/studio/bootstrap") {
    let document = null;
    try {
      document = JSON.parse(await readFile(draftPath, "utf8"));
      assertStudioDocument(document);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }

    sendJson(response, 200, {
      document,
      draftPath: ".portfolio-studio/content.json",
      storage: {
        configured: Boolean(s3),
        bucketName: r2Config.bucketName || undefined,
        publicBaseUrl: r2Config.publicBaseUrl || undefined,
        missing: missingR2Fields,
      },
    });
    return;
  }

  if (request.method === "PUT" && url.pathname === "/api/studio/content") {
    const document = await readJson(request);
    assertStudioDocument(document);
    document.updatedAt = new Date().toISOString();
    await atomicWrite(draftPath, `${JSON.stringify(document, null, 2)}\n`);
    sendJson(response, 200, { message: "Draft saved locally." });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/studio/publish") {
    const document = await readJson(request);
    assertStudioDocument(document);
    document.updatedAt = new Date().toISOString();
    await publishDocument(document);
    await atomicWrite(draftPath, `${JSON.stringify(document, null, 2)}\n`);
    sendJson(response, 200, {
      message: "Creative content published to src/content/creative.",
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/studio/media") {
    await uploadPhoto(request, response, url);
    return;
  }

  if (request.method === "DELETE" && url.pathname === "/api/studio/media") {
    if (!s3) {
      sendJson(response, 503, { message: "R2 is not configured." });
      return;
    }
    const { keys } = await readJson(request);
    if (
      !Array.isArray(keys) ||
      keys.length === 0 ||
      keys.some(
        (key) => typeof key !== "string" || !key.startsWith("photography/"),
      )
    ) {
      sendJson(response, 400, {
        message: "Valid photography keys are required.",
      });
      return;
    }
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: r2Config.bucketName,
        Delete: { Objects: keys.map((Key) => ({ Key })) },
      }),
    );
    sendJson(response, 200, { message: "R2 photo derivatives deleted." });
    return;
  }

  sendJson(response, 404, { message: "Studio API route not found." });
}

let vite;
const httpServer = createHttpServer(async (request, response) => {
  try {
    if (request.url?.startsWith("/api/studio/")) {
      await handleApi(request, response);
      return;
    }
    vite.middlewares(request, response, () => {
      response.statusCode = 404;
      response.end("Not found");
    });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, {
      message:
        error instanceof Error ? error.message : "Studio request failed.",
    });
  }
});

vite = await createViteServer({
  configFile: resolve(studioDirectory, "vite.config.ts"),
  server: {
    middlewareMode: true,
    hmr: { server: httpServer },
  },
  appType: "spa",
});

httpServer.listen(port, "127.0.0.1", () => {
  console.log(`\n  Portfolio Studio: http://127.0.0.1:${port}/`);
  console.log(`  Draft storage: ${draftPath}`);
  console.log(
    s3
      ? `  R2 bucket: ${r2Config.bucketName}`
      : `  R2 upload disabled. Missing: ${missingR2Fields.join(", ")}`,
  );
  console.log("");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    httpServer.closeAllConnections();
    await vite.close();
    httpServer.close(() => process.exit(0));
  });
}
