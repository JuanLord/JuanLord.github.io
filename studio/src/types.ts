import type {
  CreativeProfile,
  CreativeProject,
  Hike,
  PhotoTrip,
  TravelPlace,
} from "../../src/types/content";

export interface StudioDocument {
  schemaVersion: 1;
  updatedAt: string;
  creativeProfile: CreativeProfile;
  photoTrips: PhotoTrip[];
  places: TravelPlace[];
  hikes: Hike[];
  creativeProjects: CreativeProject[];
}

export type StudioSection =
  "overview" | "photography" | "places" | "hikes" | "projects" | "settings";

export interface StorageStatus {
  configured: boolean;
  bucketName?: string;
  publicBaseUrl?: string;
  missing: string[];
}

export interface StudioBootstrap {
  document: StudioDocument | null;
  storage: StorageStatus;
  draftPath: string;
}

export interface ValidationIssue {
  level: "error" | "warning";
  section: Exclude<StudioSection, "overview" | "settings">;
  recordSlug?: string;
  message: string;
}

export interface ApiMessage {
  message: string;
}
