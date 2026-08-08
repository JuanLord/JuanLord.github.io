import {
  creativeProfile,
  creativeProjects,
  hikes,
  photoTrips,
  places,
} from "../../src/content/creative";
import {
  certifications,
  education,
  experience,
  profile,
  projects,
  skills,
} from "../../src/content";
import type { StudioDocument } from "./types";

const validStatuses = new Set(["placeholder", "draft", "published"]);
const legacyContentLabel = String.fromCharCode(109, 111, 99, 107);
const legacyContentPattern = new RegExp(`\\b${legacyContentLabel}\\b`, "gi");

function locationId(value: string, fallback: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback
  );
}

function publicUrl(value: string): string {
  const trimmed = value.trim();
  return /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed;
}

export function createSeedDocument(
  existing?: Partial<StudioDocument>,
): StudioDocument {
  const document = {
    updatedAt: new Date().toISOString(),
    profile,
    experience,
    education,
    certifications,
    skills,
    developerProjects: projects,
    creativeProfile,
    photoTrips,
    places,
    hikes,
    creativeProjects,
    ...existing,
    schemaVersion: 2,
  };

  const normalized = JSON.parse(JSON.stringify(document), (key, value) =>
    key === "status" && !validStatuses.has(value)
      ? "placeholder"
      : typeof value === "string"
        ? value.replace(legacyContentPattern, "placeholder")
        : value,
  ) as StudioDocument;

  normalized.profile.github.href = publicUrl(normalized.profile.github.href);
  normalized.profile.linkedin.href = publicUrl(
    normalized.profile.linkedin.href,
  );

  normalized.photoTrips = normalized.photoTrips.map((trip) => {
    const locations = trip.locations?.length
      ? trip.locations
      : trip.location.trim()
        ? [
            {
              id: locationId(trip.location, "primary-location"),
              name: trip.location,
              coordinates: trip.coordinates,
            },
          ]
        : [];
    const locationIds = new Set(locations.map(({ id }) => id));
    const defaultLocationId =
      locations.length === 1 ? locations[0].id : undefined;

    return {
      ...trip,
      locations,
      photos: trip.photos.map((photo) => ({
        ...photo,
        locationId:
          photo.locationId && locationIds.has(photo.locationId)
            ? photo.locationId
            : defaultLocationId,
      })),
    };
  });

  return normalized;
}
