import {
  certifications,
  education,
  experience,
  hikes,
  musicProjects,
  photos,
  profile,
  projects,
} from "../content";
import type { Project, ProjectCategory } from "../types/content";

export function getProjectsByCategory(
  category: ProjectCategory | "all",
): Project[] {
  if (category === "all") return projects;
  return projects.filter((project) => project.category === category);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const currentIndex = projects.findIndex((project) => project.slug === slug);
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % projects.length;
  return projects[nextIndex];
}

export function isPlaceholderHref(href: string): boolean {
  return (
    href.includes("example.com") ||
    href.includes("placeholder") ||
    href.includes("/resume/")
  );
}

export function formatYearMonth(value: string): string {
  const [year, month] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateRange(startDate: string, endDate: string): string {
  return `${formatYearMonth(startDate)} - ${formatYearMonth(endDate)}`;
}

export function validateMockContent(): string[] {
  const issues: string[] = [];
  const projectSlugs = projects.map((project) => project.slug);

  if (new Set(projectSlugs).size !== projectSlugs.length) {
    issues.push("Project slugs must be unique.");
  }

  const collections = [
    experience,
    education,
    certifications,
    projects,
    photos,
    hikes,
    musicProjects,
  ];

  for (const collection of collections) {
    for (const item of collection) {
      if (item.status !== "mock") {
        issues.push(
          `Expected ${"id" in item ? item.id : item.slug} to be mock.`,
        );
      }
    }
  }

  if (profile.status !== "mock") {
    issues.push("Expected profile to be mock.");
  }

  for (const project of projects) {
    if (!project.media.alt || !project.media.aspectRatio) {
      issues.push(`Project ${project.slug} needs complete media metadata.`);
    }

    if (
      !project.details.problem ||
      !project.details.role ||
      project.details.constraints.length === 0 ||
      project.details.approach.length === 0 ||
      !project.details.outcome
    ) {
      issues.push(`Project ${project.slug} needs complete case-study details.`);
    }
  }

  return issues;
}
