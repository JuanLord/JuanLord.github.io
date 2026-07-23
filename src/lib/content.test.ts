import {
  formatDateRange,
  formatYearMonth,
  getHikeBySlug,
  getNextProject,
  getPhotoTripBySlug,
  getProjectBySlug,
  getProjectsByCategory,
  isPlaceholderHref,
  validateContent,
} from "./content";

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
    expect(getPhotoTripBySlug("pacific-coast-weekend")?.photoCount).toBe(72);
    expect(getPhotoTripBySlug("missing-trip")).toBeUndefined();
    expect(getHikeBySlug("mount-tallac")?.distanceMiles).toBe(10.2);
    expect(getHikeBySlug("missing-hike")).toBeUndefined();
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
