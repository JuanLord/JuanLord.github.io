import type {
  Certification,
  CreativeProfile,
  CreativeProject,
  Education,
  Experience,
  Hike,
  PhotoTrip,
  Profile,
  Project,
  SkillGroup,
  TravelPlace,
} from "../../src/types/content";

export interface StudioDocument {
  schemaVersion: 1;
  updatedAt: string;
  profile: Profile;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: SkillGroup[];
  developerProjects: Project[];
  creativeProfile: CreativeProfile;
  photoTrips: PhotoTrip[];
  places: TravelPlace[];
  hikes: Hike[];
  creativeProjects: CreativeProject[];
}

export type StudioSection =
  | "overview"
  | "professional"
  | "developer-projects"
  | "photography"
  | "places"
  | "hikes"
  | "projects"
  | "settings";

export interface StorageUsage {
  storageBytes: number;
  maxStorageBytes: number;
  classAOperations: number;
  maxClassAOperations: number;
  month: string;
  measuredAt?: string;
  classBHardLimitAvailable: false;
}

export interface StorageStatus {
  configured: boolean;
  bucketName?: string;
  publicBaseUrl?: string;
  missing: string[];
  usage?: StorageUsage;
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
