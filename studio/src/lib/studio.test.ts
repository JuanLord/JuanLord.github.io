import { createSeedDocument } from "../seed";
import {
  isValidCoordinates,
  normalizeEmbed,
  slugify,
  validateStudioDocument,
} from "./studio";

describe("Portfolio Studio content utilities", () => {
  it("creates stable URL slugs", () => {
    expect(slugify("  Iceland: South Coast  ")).toBe("iceland-south-coast");
    expect(slugify("Point Reyes / July 2026")).toBe("point-reyes-july-2026");
  });

  it("normalizes supported public media URLs", () => {
    expect(
      normalizeEmbed(
        "spotify",
        "https://open.spotify.com/playlist/abc123?si=test",
        "Trip soundtrack",
      ),
    ).toMatchObject({
      embedUrl: "https://open.spotify.com/embed/playlist/abc123",
      placeholder: false,
    });

    expect(
      normalizeEmbed(
        "strava",
        "https://www.strava.com/activities/123456789",
        "Trail activity",
      ),
    ).toMatchObject({
      embedUrl: "https://strava-embeds.com/activity/123456789",
      placeholder: false,
    });

    expect(
      normalizeEmbed("youtube", "https://youtu.be/film-id", "Short film"),
    ).toMatchObject({
      embedUrl: "https://www.youtube-nocookie.com/embed/film-id",
      placeholder: false,
    });
  });

  it("rejects unrecognized providers and insecure URLs", () => {
    expect(
      normalizeEmbed("spotify", "http://open.spotify.com/track/abc", "Track")
        .placeholder,
    ).toBe(true);
    expect(
      normalizeEmbed("spotify", "https://example.com/track/abc", "Track")
        .placeholder,
    ).toBe(true);
  });

  it("checks coordinate bounds", () => {
    expect(isValidCoordinates([-122.4, 37.8])).toBe(true);
    expect(isValidCoordinates([181, 37.8])).toBe(false);
    expect(isValidCoordinates([-122.4, -91])).toBe(false);
  });

  it("treats incomplete mock galleries as warnings, not publish blockers", () => {
    const issues = validateStudioDocument(createSeedDocument());

    expect(issues.filter(({ level }) => level === "error")).toEqual([]);
    expect(
      issues.filter(({ section }) => section === "photography"),
    ).toHaveLength(6);
  });

  it("blocks duplicate record slugs", () => {
    const document = createSeedDocument();
    document.hikes.push(structuredClone(document.hikes[0]));

    expect(validateStudioDocument(document)).toContainEqual(
      expect.objectContaining({
        level: "error",
        section: "hikes",
        recordSlug: "mount-tallac",
      }),
    );
  });
});
