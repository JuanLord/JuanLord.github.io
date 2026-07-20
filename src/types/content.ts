export type ContentStatus = "mock" | "draft" | "published";

export type ProjectCategory = "engineering" | "software";

export interface ExternalLink {
  label: string;
  href: string;
  placeholder?: boolean;
}

export interface MediaAsset {
  alt: string;
  aspectRatio: `${number}/${number}`;
  placeholder: boolean;
  src?: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio: string[];
  location: string;
  availability: string;
  email: ExternalLink;
  github: ExternalLink;
  linkedin: ExternalLink;
  resume: ExternalLink;
  status: ContentStatus;
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
}

export interface Experience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
  highlights: string[];
  status: ContentStatus;
}

export interface Education {
  id: string;
  institution: string;
  credential: string;
  field: string;
  startYear: number;
  endYear: number;
  status: ContentStatus;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: number;
  status: ContentStatus;
}

export interface ProjectDetails {
  problem: string;
  role: string;
  constraints: string[];
  approach: string[];
  outcome: string;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
  summary: string;
  techStack: string[];
  featured: boolean;
  media: MediaAsset;
  links: ExternalLink[];
  details: ProjectDetails;
  status: ContentStatus;
}

export type Coordinates = [longitude: number, latitude: number];

export type CreativeEmbedProvider =
  "spotify" | "strava" | "youtube" | "vimeo" | "soundcloud";

export interface CreativeEmbed {
  provider: CreativeEmbedProvider;
  title: string;
  embedUrl?: string;
  sourceUrl?: string;
  placeholder: boolean;
}

export interface TripPhoto {
  id: string;
  src?: string;
  thumbnailSrc?: string;
  alt: string;
  caption: string;
  date: string;
  width?: number;
  height?: number;
  status: ContentStatus;
}

export interface PhotoTrip {
  slug: string;
  title: string;
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  summary: string;
  story: string;
  coordinates: Coordinates;
  photoCount: number;
  previewSlots: number;
  photos: TripPhoto[];
  soundtrack: CreativeEmbed;
  status: ContentStatus;
}

export interface TravelPlace {
  slug: string;
  title: string;
  location: string;
  country: string;
  kind: "city" | "nature" | "landmark";
  coordinates: Coordinates;
  visited: string;
  summary: string;
  relatedPhotoTripSlug?: string;
  relatedHikeSlug?: string;
  status: ContentStatus;
}

export interface HikeRoute {
  points: Coordinates[];
  strava: CreativeEmbed;
  placeholder: boolean;
}

export interface Hike {
  slug: string;
  trail: string;
  location: string;
  country: string;
  date: string;
  coordinates: Coordinates;
  distanceMiles: number;
  elevationFeet: number;
  movingHours: number;
  difficulty: "Easy" | "Moderate" | "Strenuous";
  summary: string;
  route: HikeRoute;
  relatedPhotoTripSlug?: string;
  status: ContentStatus;
}

export interface CreativeProject {
  slug: string;
  title: string;
  year: number;
  kind: "short-film" | "music";
  description: string;
  role: string;
  tools: string[];
  embed: CreativeEmbed;
  status: ContentStatus;
}

export interface CreativeProfile {
  eyebrow: string;
  title: string;
  introduction: string;
  reflection: string;
  status: ContentStatus;
}

export interface CreativeMapPoint {
  id: string;
  label: string;
  coordinates: Coordinates;
  kind: "photography" | "hike";
  to: string;
}
