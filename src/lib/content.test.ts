import {
  formatDateRange,
  formatYearMonth,
  getHikeBySlug,
  getNextProject,
  getPhotoLocationSections,
  getPhotoTripBySlug,
  getProjectBySlug,
  getProjectsByCategory,
  isPlaceholderHref,
  validateContent,
} from "./content";
import { hikes, photoTrips } from "../content";

describe("content utilities", () => {
  it("filters projects by category", () => {
    const softwareProjects = getProjectsByCategory("software");

    expect(softwareProjects).not.toHaveLength(0);
    expect(
      softwareProjects.every(({ category }) => category === "software"),
    ).toBe(true);
  });

  it("looks up projects by slug", () => {
    expect(getProjectBySlug("telemetry-workbench")?.title).toBe(
      "Telemetry Workbench",
    );
    expect(getProjectBySlug("missing-project")).toBeUndefined();
  });

  it("cycles to the next project", () => {
    expect(getNextProject("autonomous-sorting-system").slug).toBe(
      "telemetry-workbench",
    );
    expect(getNextProject("field-notes-platform").slug).toBe(
      "autonomous-sorting-system",
    );
  });

  it("looks up creative trip and hike records by slug", () => {
    expect(getPhotoTripBySlug(photoTrips[0].slug)?.title).toBe(
      photoTrips[0].title,
    );
    expect(getPhotoTripBySlug("missing-trip")).toBeUndefined();
    expect(getHikeBySlug(hikes[0].slug)?.trail).toBe(hikes[0].trail);
    expect(getHikeBySlug("missing-hike")).toBeUndefined();
  });

  it("groups trip photos into named locations and a trip-wide fallback", () => {
    const photos = photoTrips[0].photos.slice(0, 3);
    const sections = getPhotoLocationSections({
      ...photoTrips[0],
      locations: [
        { id: "trailhead", name: "Trailhead", coordinates: [-121, 48] },
        { id: "camp", name: "Camp", coordinates: [-121.1, 48.1] },
      ],
      photos: [
        { ...photos[0], locationId: "trailhead" },
        { ...photos[1], locationId: "camp" },
        { ...photos[2], locationId: undefined },
      ],
    });

    expect(sections.map(({ name }) => name)).toEqual([
      "Trailhead",
      "Camp",
      "Across the trip",
    ]);
    expect(
      sections.map(({ photos: sectionPhotos }) => sectionPhotos.length),
    ).toEqual([1, 1, 1]);
  });

  it("identifies links that should not become live controls", () => {
    expect(isPlaceholderHref("https://example.com/demo")).toBe(true);
    expect(isPlaceholderHref("/resume/placeholder.pdf")).toBe(true);
    expect(isPlaceholderHref("https://github.com/JuanLord")).toBe(false);
  });

  it("formats experience dates consistently", () => {
    expect(formatYearMonth("2025-05")).toBe("May 2025");
    expect(formatDateRange("2024-09", "2025-04")).toBe("Sep 2024 - Apr 2025");
  });

  it("keeps placeholder content internally consistent", () => {
    expect(validateContent()).toEqual([]);
  });
});
