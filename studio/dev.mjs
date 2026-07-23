import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
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
const usagePath = resolve(draftDirectory, "r2-usage.json");
const resumePath = resolve(
  repositoryRoot,
  "public/resume/juan-varela-resume.pdf",
);
const env = loadEnv("studio", repositoryRoot, "");
const port = Number(env.STUDIO_PORT || 4174);

function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const r2Config = {
  accountId: env.R2_ACCOUNT_ID,
  accessKeyId: env.R2_ACCESS_KEY_ID,
  secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  bucketName: env.R2_BUCKET_NAME,
  publicBaseUrl: env.R2_PUBLIC_BASE_URL?.replace(/\/$/, ""),
  maxStorageBytes:
    positiveNumber(env.R2_MAX_STORAGE_GB, 9) * 1024 * 1024 * 1024,
  maxClassAOperations: Math.floor(
    positiveNumber(env.R2_MAX_CLASS_A_OPERATIONS, 900_000),
  ),
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
    const publicUrl = new URL(r2Config.publicBaseUrl);
    if (
      publicUrl.protocol !== "https:" ||
      publicUrl.hostname.endsWith(".r2.cloudflarestorage.com")
    ) {
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

function assertStudioDocument(document, allowLegacy = false) {
  if (
    !document ||
    document.schemaVersion !== 1 ||
    !Array.isArray(document.photoTrips) ||
    !Array.isArray(document.places) ||
    !Array.isArray(document.hikes) ||
    !Array.isArray(document.creativeProjects) ||
    !document.creativeProfile ||
    (!allowLegacy &&
      (!document.profile ||
        !Array.isArray(document.experience) ||
        !Array.isArray(document.education) ||
        !Array.isArray(document.certifications) ||
        !Array.isArray(document.skills) ||
        !Array.isArray(document.developerProjects)))
  ) {
    throw new Error("Studio document has an unsupported structure.");
  }
}

async function atomicWrite(path, contents) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, contents);
  await rename(temporaryPath, path);
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

async function readUsageRecord() {
  let record;
  try {
    record = JSON.parse(await readFile(usagePath, "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  if (!record || record.month !== currentMonth()) {
    return {
      month: currentMonth(),
      classAOperations: 0,
      storageBytes: Number(record?.storageBytes) || 0,
      measuredAt: record?.measuredAt,
    };
  }

  return {
    month: currentMonth(),
    classAOperations: Number(record.classAOperations) || 0,
    storageBytes: Number(record.storageBytes) || 0,
    measuredAt: record.measuredAt,
  };
}

async function writeUsageRecord(record) {
  await atomicWrite(usagePath, `${JSON.stringify(record, null, 2)}\n`);
}

async function reserveClassAOperations(count) {
  const record = await readUsageRecord();
  if (record.classAOperations + count > r2Config.maxClassAOperations) {
    throw new Error(
      `R2 upload paused: the local ${r2Config.maxClassAOperations.toLocaleString()} Class A operation limit has been reached for ${record.month}.`,
    );
  }
  record.classAOperations += count;
  await writeUsageRecord(record);
  return record;
}

async function measureBucketStorage() {
  if (!s3) return readUsageRecord();
  let continuationToken;
  let storageBytes = 0;

  do {
    await reserveClassAOperations(1);
    const page = await s3.send(
      new ListObjectsV2Command({
        Bucket: r2Config.bucketName,
        ContinuationToken: continuationToken,
      }),
    );
    storageBytes += (page.Contents || []).reduce(
      (total, object) => total + (object.Size || 0),
      0,
    );
    continuationToken = page.IsTruncated
      ? page.NextContinuationToken
      : undefined;
  } while (continuationToken);

  const record = await readUsageRecord();
  record.storageBytes = storageBytes;
  record.measuredAt = new Date().toISOString();
  await writeUsageRecord(record);
  return record;
}

function createStorageUsage(record) {
  return {
    storageBytes: record.storageBytes,
    maxStorageBytes: r2Config.maxStorageBytes,
    classAOperations: record.classAOperations,
    maxClassAOperations: r2Config.maxClassAOperations,
    month: record.month,
    measuredAt: record.measuredAt,
    classBHardLimitAvailable: false,
  };
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
    experience: document.experience.filter(
      (record) => record.status !== "draft",
    ),
    education: document.education.filter((record) => record.status !== "draft"),
    certifications: document.certifications.filter(
      (record) => record.status !== "draft",
    ),
    developerProjects: document.developerProjects.filter(
      (project) => project.status !== "draft",
    ),
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
      resolve(repositoryRoot, "src/content/profile.ts"),
      [
        'import type { Certification, Education, Experience, Profile, SkillGroup } from "../types/content";',
        "",
        `export const profile: Profile = ${JSON.stringify(publicDocument.profile, null, 2)};`,
        "",
        `export const experience: Experience[] = ${JSON.stringify(publicDocument.experience, null, 2)};`,
        "",
        `export const education: Education[] = ${JSON.stringify(publicDocument.education, null, 2)};`,
        "",
        `export const certifications: Certification[] = ${JSON.stringify(publicDocument.certifications, null, 2)};`,
        "",
        `export const skills: SkillGroup[] = ${JSON.stringify(publicDocument.skills, null, 2)};`,
        "",
      ].join("\n"),
    ],
    [
      resolve(repositoryRoot, "src/content/projects.ts"),
      typedModule(
        'import type { Project } from "../types/content";',
        "projects",
        publicDocument.developerProjects,
        "Project[]",
      ),
    ],
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

  const usage = await measureBucketStorage();
  const projectedStorage =
    usage.storageBytes + display.data.length + thumbnail.data.length;
  if (projectedStorage > r2Config.maxStorageBytes) {
    throw new Error(
      `R2 upload paused: this upload would exceed the local ${(r2Config.maxStorageBytes / 1024 ** 3).toFixed(1)} GB storage limit.`,
    );
  }
  await reserveClassAOperations(2);

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

async function uploadResume(request, response) {
  const contentType = request.headers["content-type"]?.split(";")[0];
  if (contentType !== "application/pdf") {
    sendJson(response, 415, { message: "Choose a PDF resume." });
    return;
  }

  const resume = await readBody(request, 10 * 1024 * 1024);
  if (
    resume.length < 5 ||
    resume.subarray(0, 5).toString("ascii") !== "%PDF-"
  ) {
    sendJson(response, 415, {
      message: "The selected file is not a valid PDF.",
    });
    return;
  }

  await atomicWrite(resumePath, resume);
  sendJson(response, 201, {
    message: "Resume uploaded to public/resume/juan-varela-resume.pdf.",
    href: "/resume/juan-varela-resume.pdf",
    size: resume.length,
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
      assertStudioDocument(document, true);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }

    const usage = await readUsageRecord();
    sendJson(response, 200, {
      document,
      draftPath: ".portfolio-studio/content.json",
      storage: {
        configured: Boolean(s3),
        bucketName: r2Config.bucketName || undefined,
        publicBaseUrl: r2Config.publicBaseUrl || undefined,
        missing: missingR2Fields,
        usage: createStorageUsage(usage),
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
      message:
        "Portfolio source updated. Commit and push the generated files to deploy with GitHub Pages.",
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/studio/media") {
    await uploadPhoto(request, response, url);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/studio/resume") {
    await uploadResume(request, response);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/studio/r2/usage") {
    if (!s3) {
      sendJson(response, 503, { message: "R2 is not configured." });
      return;
    }
    const usage = await measureBucketStorage();
    sendJson(response, 200, createStorageUsage(usage));
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
