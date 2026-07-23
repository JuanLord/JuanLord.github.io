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

export function createSeedDocument(
  existing?: Partial<StudioDocument>,
): StudioDocument {
  const document = {
    schemaVersion: 1,
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
  };

  return JSON.parse(JSON.stringify(document), (key, value) =>
    key === "status" && !validStatuses.has(value)
      ? "placeholder"
      : typeof value === "string"
        ? value.replace(legacyContentPattern, "placeholder")
        : value,
  ) as StudioDocument;
}
