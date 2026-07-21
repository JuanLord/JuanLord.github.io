import {
  creativeProfile,
  creativeProjects,
  hikes,
  photoTrips,
  places,
} from "../../src/content/creative";
import type { StudioDocument } from "./types";

export function createSeedDocument(): StudioDocument {
  return structuredClone({
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    creativeProfile,
    photoTrips,
    places,
    hikes,
    creativeProjects,
  });
}
