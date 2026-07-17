import {
  getProjectBySlug,
  getProjectsByCategory,
  isPlaceholderHref,
  validateMockContent,
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

  it("identifies links that should not become live controls", () => {
    expect(isPlaceholderHref("https://example.com/demo")).toBe(true);
    expect(isPlaceholderHref("/resume/mock.pdf")).toBe(true);
    expect(isPlaceholderHref("https://github.com/JuanLord")).toBe(false);
  });

  it("keeps generated mock content internally consistent", () => {
    expect(validateMockContent()).toEqual([]);
  });
});
