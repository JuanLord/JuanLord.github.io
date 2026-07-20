import {
  creativeProjects,
  hikes,
  photoTrips,
  places,
  projects,
} from "../content";
import type {
  Coordinates,
  Hike,
  PhotoTrip,
  Project,
  ProjectCategory,
} from "../types/content";

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

export function getPhotoTripBySlug(slug: string): PhotoTrip | undefined {
  return photoTrips.find((trip) => trip.slug === slug);
}

export function getHikeBySlug(slug: string): Hike | undefined {
  return hikes.find((hike) => hike.slug === slug);
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
  if (startDate === endDate) return formatYearMonth(startDate);
  return `${formatYearMonth(startDate)} - ${formatYearMonth(endDate)}`;
}

function hasValidCoordinates([longitude, latitude]: Coordinates): boolean {
  return (
    longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90
  );
}

export function validateContent(): string[] {
  const issues: string[] = [];
  const projectSlugs = projects.map((project) => project.slug);
  const photoTripSlugs = photoTrips.map((trip) => trip.slug);
  const hikeSlugs = hikes.map((hike) => hike.slug);

  if (new Set(projectSlugs).size !== projectSlugs.length) {
    issues.push("Project slugs must be unique.");
  }

  if (new Set(photoTripSlugs).size !== photoTripSlugs.length) {
    issues.push("Photo trip slugs must be unique.");
  }

  if (new Set(hikeSlugs).size !== hikeSlugs.length) {
    issues.push("Hike slugs must be unique.");
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

  for (const trip of photoTrips) {
    if (trip.photoCount < 50 || trip.photoCount > 100) {
      issues.push(`Photo trip ${trip.slug} must plan for 50-100 photos.`);
    }

    if (trip.previewSlots < 1 || trip.previewSlots > 12) {
      issues.push(`Photo trip ${trip.slug} needs 1-12 preview slots.`);
    }

    if (trip.soundtrack.provider !== "spotify") {
      issues.push(`Photo trip ${trip.slug} needs a Spotify soundtrack.`);
    }

    if (!hasValidCoordinates(trip.coordinates)) {
      issues.push(`Photo trip ${trip.slug} has invalid coordinates.`);
    }

    if (trip.photos.length > trip.photoCount) {
      issues.push(`Photo trip ${trip.slug} exceeds its planned photo count.`);
    }

    for (const photo of trip.photos) {
      if (!photo.src || !photo.alt || !photo.caption) {
        issues.push(`Photo ${photo.id} needs a real source and metadata.`);
      }
    }
  }

  for (const hike of hikes) {
    if (
      hike.distanceMiles <= 0 ||
      hike.elevationFeet <= 0 ||
      !hike.difficulty ||
      hike.movingHours <= 0 ||
      hike.route.points.length < 2
    ) {
      issues.push(`Hike ${hike.slug} needs complete trail details.`);
    }

    if (!hasValidCoordinates(hike.coordinates)) {
      issues.push(`Hike ${hike.slug} has invalid coordinates.`);
    }
  }

  for (const place of places) {
    if (!hasValidCoordinates(place.coordinates)) {
      issues.push(`Place ${place.slug} has invalid coordinates.`);
    }

    if (
      place.relatedPhotoTripSlug &&
      !photoTripSlugs.includes(place.relatedPhotoTripSlug)
    ) {
      issues.push(`Place ${place.slug} links to a missing photo trip.`);
    }

    if (place.relatedHikeSlug && !hikeSlugs.includes(place.relatedHikeSlug)) {
      issues.push(`Place ${place.slug} links to a missing hike.`);
    }
  }

  for (const creativeProject of creativeProjects) {
    if (
      !creativeProject.role ||
      creativeProject.tools.length === 0 ||
      !creativeProject.embed.title
    ) {
      issues.push(
        `Creative project ${creativeProject.slug} needs complete production details.`,
      );
    }
  }

  return issues;
}
