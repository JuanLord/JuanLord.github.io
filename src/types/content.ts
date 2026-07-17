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
  location: string;
  availability: string;
  email: ExternalLink;
  github: ExternalLink;
  linkedin: ExternalLink;
  resume: ExternalLink;
  status: ContentStatus;
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

export interface Photo {
  id: string;
  location: string;
  date: string;
  caption: string;
  media: MediaAsset;
  status: ContentStatus;
}

export interface Hike {
  id: string;
  trail: string;
  location: string;
  date: string;
  distanceMiles: number;
  elevationFeet: number;
  summary: string;
  media: MediaAsset;
  status: ContentStatus;
}

export interface MusicProject {
  id: string;
  title: string;
  year: number;
  format: "audio" | "video";
  description: string;
  mediaLink: ExternalLink;
  cover: MediaAsset;
  status: ContentStatus;
}
