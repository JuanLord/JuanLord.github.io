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

  it("migrates legacy trips into named location sections", () => {
    const legacy = createSeedDocument();
    const trip = legacy.photoTrips[0];
    delete trip.locations;
    trip.photos = trip.photos.map((photo) => {
      const legacyPhoto = { ...photo };
      delete legacyPhoto.locationId;
      return legacyPhoto;
    });

    const migratedTrip = createSeedDocument(legacy).photoTrips[0];

    expect(migratedTrip.locations).toEqual([
      expect.objectContaining({
        name: trip.location,
        coordinates: trip.coordinates,
      }),
    ]);
    expect(
      migratedTrip.photos.every(
        ({ locationId }) => locationId === migratedTrip.locations?.[0].id,
      ),
    ).toBe(true);
  });

  it("normalizes profile links that begin with www", () => {
    const document = createSeedDocument();
    document.profile.linkedin.href = "www.linkedin.com/in/juanvar";

    expect(createSeedDocument(document).profile.linkedin.href).toBe(
      "https://www.linkedin.com/in/juanvar",
    );
  });

  it("does not impose a minimum album size", () => {
    const document = createSeedDocument();
    const issues = validateStudioDocument(document);

    expect(issues.filter(({ level }) => level === "error")).toEqual([]);
    expect(
      issues.some(({ message }) => message.includes("planned 50-100")),
    ).toBe(false);
  });

  it("blocks duplicate record slugs", () => {
    const document = createSeedDocument();
    document.hikes.push(structuredClone(document.hikes[0]));

    expect(validateStudioDocument(document)).toContainEqual(
      expect.objectContaining({
        level: "error",
        section: "hikes",
        recordSlug: document.hikes[0].slug,
      }),
    );
  });

  it("blocks duplicate professional project slugs", () => {
    const document = createSeedDocument();
    document.developerProjects = [
      {
        slug: "duplicate-project",
        title: "Duplicate project",
        category: "software",
        year: 2026,
        summary: "Project summary",
        techStack: ["TypeScript"],
        featured: false,
        media: {
          alt: "Project system view",
          aspectRatio: "16/10",
          placeholder: true,
        },
        links: [],
        details: {
          problem: "Problem",
          role: "Developer",
          constraints: [],
          approach: [],
          outcome: "Outcome",
        },
        status: "draft",
      },
    ];
    document.developerProjects.push(
      structuredClone(document.developerProjects[0]),
    );

    expect(validateStudioDocument(document)).toContainEqual(
      expect.objectContaining({
        level: "error",
        section: "developer-projects",
        recordSlug: document.developerProjects[0].slug,
      }),
    );
  });
});
