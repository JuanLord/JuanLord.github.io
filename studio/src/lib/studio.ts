import type {
  CreativeEmbed,
  CreativeEmbedProvider,
  Coordinates,
} from "../../../src/types/content";
import type {
  ApiMessage,
  StudioBootstrap,
  StudioDocument,
  ValidationIssue,
} from "../types";

const providerHosts: Record<CreativeEmbedProvider, string[]> = {
  spotify: ["open.spotify.com"],
  strava: ["www.strava.com", "strava.com", "strava-embeds.com"],
  youtube: ["www.youtube.com", "youtube.com", "youtu.be"],
  vimeo: ["vimeo.com", "www.vimeo.com", "player.vimeo.com"],
  soundcloud: ["soundcloud.com", "www.soundcloud.com", "w.soundcloud.com"],
};

async function requestJson<T extends object>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body instanceof Blob
        ? {}
        : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  const payload = (await response.json()) as T | ApiMessage;
  if (!response.ok) {
    throw new Error(
      typeof payload === "object" && "message" in payload
        ? payload.message
        : "Request failed.",
    );
  }

  return payload as T;
}

export function loadStudio(): Promise<StudioBootstrap> {
  return requestJson<StudioBootstrap>("/api/studio/bootstrap");
}

export function saveStudioDocument(
  document: StudioDocument,
): Promise<ApiMessage> {
  return requestJson<ApiMessage>("/api/studio/content", {
    method: "PUT",
    body: JSON.stringify(document),
  });
}

export function publishStudioDocument(
  document: StudioDocument,
): Promise<ApiMessage> {
  return requestJson<ApiMessage>("/api/studio/publish", {
    method: "POST",
    body: JSON.stringify(document),
  });
}

export async function uploadTripPhoto(
  tripSlug: string,
  file: File,
): Promise<import("../../../src/types/content").TripPhoto> {
  return requestJson(
    `/api/studio/media?tripSlug=${encodeURIComponent(tripSlug)}`,
    {
      method: "POST",
      body: file,
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "X-File-Name": encodeURIComponent(file.name),
      },
    },
  );
}

export function deleteTripPhoto(keys: string[]): Promise<ApiMessage> {
  return requestJson<ApiMessage>("/api/studio/media", {
    method: "DELETE",
    body: JSON.stringify({ keys }),
  });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isValidCoordinates(coordinates: Coordinates): boolean {
  const [longitude, latitude] = coordinates;
  return (
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
}

export function normalizeEmbed(
  provider: CreativeEmbedProvider,
  sourceValue: string,
  title: string,
): CreativeEmbed {
  const sourceUrl = sourceValue.trim();
  if (!sourceUrl) return { provider, title, placeholder: true };

  let url: URL;
  try {
    url = new URL(sourceUrl);
  } catch {
    return { provider, title, sourceUrl, placeholder: true };
  }

  if (
    url.protocol !== "https:" ||
    !providerHosts[provider].includes(url.hostname)
  ) {
    return { provider, title, sourceUrl, placeholder: true };
  }

  let embedUrl: string | undefined;
  const segments = url.pathname.split("/").filter(Boolean);

  if (provider === "spotify") {
    const offset = segments[0] === "embed" ? 1 : 0;
    const mediaType = segments[offset];
    const mediaId = segments[offset + 1];
    if (
      ["album", "artist", "episode", "playlist", "show", "track"].includes(
        mediaType,
      ) &&
      mediaId
    ) {
      embedUrl = `https://open.spotify.com/embed/${mediaType}/${mediaId}`;
    }
  }

  if (provider === "strava") {
    const activityIndex = segments.findIndex((part) => part === "activities");
    const routeIndex = segments.findIndex((part) => part === "routes");
    if (activityIndex >= 0 && segments[activityIndex + 1]) {
      embedUrl = `https://strava-embeds.com/activity/${segments[activityIndex + 1]}`;
    } else if (routeIndex >= 0 && segments[routeIndex + 1]) {
      embedUrl = `https://strava-embeds.com/route/${segments[routeIndex + 1]}`;
    } else if (url.hostname === "strava-embeds.com") {
      embedUrl = url.toString();
    }
  }

  if (provider === "youtube") {
    const videoId =
      url.hostname === "youtu.be"
        ? segments[0]
        : url.searchParams.get("v") ||
          (segments[0] === "embed" ? segments[1] : undefined);
    if (videoId) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
  }

  if (provider === "vimeo") {
    const videoId = [...segments].reverse().find((part) => /^\d+$/.test(part));
    if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  if (provider === "soundcloud") {
    embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(sourceUrl)}`;
  }

  return {
    provider,
    title,
    sourceUrl,
    embedUrl,
    placeholder: !embedUrl,
  };
}

function duplicateSlugs(items: { slug: string }[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const item of items) {
    if (seen.has(item.slug)) duplicates.add(item.slug);
    seen.add(item.slug);
  }
  return [...duplicates];
}

export function validateStudioDocument(
  document: StudioDocument,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (issue: ValidationIssue) => issues.push(issue);
  const recordLevel = (status: "mock" | "draft" | "published") =>
    status === "draft" ? "warning" : "error";

  for (const slug of duplicateSlugs(document.photoTrips)) {
    add({
      level: "error",
      section: "photography",
      recordSlug: slug,
      message: `Duplicate photography slug: ${slug}.`,
    });
  }

  for (const slug of duplicateSlugs(document.places)) {
    add({
      level: "error",
      section: "places",
      recordSlug: slug,
      message: `Duplicate place slug: ${slug}.`,
    });
  }

  for (const slug of duplicateSlugs(document.hikes)) {
    add({
      level: "error",
      section: "hikes",
      recordSlug: slug,
      message: `Duplicate hike slug: ${slug}.`,
    });
  }

  for (const trip of document.photoTrips) {
    if (!trip.title || !trip.slug || !trip.location || !trip.country) {
      add({
        level: recordLevel(trip.status),
        section: "photography",
        recordSlug: trip.slug,
        message: "Trip needs a title, slug, location, and country.",
      });
    }
    if (!isValidCoordinates(trip.coordinates)) {
      add({
        level: recordLevel(trip.status),
        section: "photography",
        recordSlug: trip.slug,
        message: "Trip coordinates must be valid longitude and latitude.",
      });
    }
    if (trip.photos.length < 50) {
      add({
        level: "warning",
        section: "photography",
        recordSlug: trip.slug,
        message: `${trip.title || "Trip"} currently has ${trip.photos.length} of its planned 50-100 photos.`,
      });
    }
    for (const photo of trip.photos) {
      if (!photo.alt.trim() || !photo.caption.trim()) {
        add({
          level: "warning",
          section: "photography",
          recordSlug: trip.slug,
          message: `${trip.title || "Trip"} has photos missing alt text or captions.`,
        });
        break;
      }
    }
    if (trip.soundtrack.sourceUrl && trip.soundtrack.placeholder) {
      add({
        level: "warning",
        section: "photography",
        recordSlug: trip.slug,
        message: "Spotify URL could not be converted to an embed.",
      });
    }
  }

  for (const place of document.places) {
    if (!place.title || !place.slug || !isValidCoordinates(place.coordinates)) {
      add({
        level: recordLevel(place.status),
        section: "places",
        recordSlug: place.slug,
        message: "Place needs a title, slug, and valid coordinates.",
      });
    }
  }

  for (const hike of document.hikes) {
    if (
      !hike.trail ||
      !hike.slug ||
      hike.distanceMiles <= 0 ||
      hike.movingHours <= 0 ||
      !isValidCoordinates(hike.coordinates)
    ) {
      add({
        level: recordLevel(hike.status),
        section: "hikes",
        recordSlug: hike.slug,
        message:
          "Hike needs a trail name, slug, metrics, and valid coordinates.",
      });
    }
    if (hike.route.points.length < 2) {
      add({
        level: "warning",
        section: "hikes",
        recordSlug: hike.slug,
        message: `${hike.trail || "Hike"} needs a GPX route or at least two route points.`,
      });
    }
  }

  for (const project of document.creativeProjects) {
    if (!project.title || !project.slug || !project.role) {
      add({
        level: recordLevel(project.status),
        section: "projects",
        recordSlug: project.slug,
        message: "Creative project needs a title, slug, and role.",
      });
    }
  }

  return issues;
}
