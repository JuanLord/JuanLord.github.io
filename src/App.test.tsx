import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import {
  creativeProjects,
  experience,
  hikes,
  photoTrips,
  places,
  profile,
  projects,
} from "./content";

const publishedProjects = projects.filter(
  ({ status }) => status === "published",
);
const publishedTrips = photoTrips.filter(
  ({ status }) => status === "published",
);
const publishedHikes = hikes.filter(({ status }) => status === "published");
const publishedPlaces = places.filter(({ status }) => status === "published");
const publishedCreativeProjects = creativeProjects.filter(
  ({ status }) => status === "published",
);

describe("App shell", () => {
  beforeEach(() => {
    window.location.hash = "#/";
  });

  it("renders the portfolio identity without draft labels", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Juan Varela" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Juan Varela, home" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
  });

  it("opens and closes the mobile navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    await user.click(menuButton);

    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close navigation" }));
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
  });

  it("closes the mobile navigation with Escape", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
  });

  it("navigates between portfolio routes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("link", { name: "View projects" }));

    expect(window.scrollTo).toHaveBeenCalledWith({
      behavior: "auto",
      left: 0,
      top: 0,
    });
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Projects",
      }),
    ).toBeInTheDocument();
  });

  it("skips to the main content without changing the hash route", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/about";
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Skip to content" }));

    expect(window.location.hash).toBe("#/about");
    expect(screen.getByRole("main")).toHaveFocus();
  });

  it("updates document metadata for routes", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.title).toBe("Juan Varela | Developer & Engineer");

    await user.click(screen.getByRole("link", { name: "View projects" }));
    expect(document.title).toBe("Projects | Juan Varela");
  });

  it("filters the project archive and keeps the filter in the URL", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/projects";
    render(<App />);

    expect(screen.queryAllByRole("article")).toHaveLength(
      publishedProjects.length,
    );

    await user.click(screen.getByRole("button", { name: "Software" }));

    expect(window.location.hash).toContain("category=software");
    expect(screen.queryAllByRole("article")).toHaveLength(
      publishedProjects.filter(({ category }) => category === "software")
        .length,
    );
  });

  it("renders a published case study or the honest empty archive", () => {
    const project = publishedProjects[0];
    window.location.hash = project
      ? `#/projects/${project.slug}`
      : "#/projects";
    render(<App />);

    if (project) {
      expect(
        screen.getByRole("heading", { level: 1, name: project.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(project.details.problem)).toBeInTheDocument();
    } else {
      expect(
        screen.getByText("Project archive in progress."),
      ).toBeInTheDocument();
    }
  });

  it("handles an invalid project slug", () => {
    window.location.hash = "#/projects/not-a-project";
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Case study unavailable.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to projects" }),
    ).toHaveAttribute("href", "#/projects");
  });

  it("renders the routed creative index without synthetic imagery", () => {
    window.location.hash = "#/creative";
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Creative Field Notes",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Photography" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Travel & hiking" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Film & music" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Creative sections" }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll("img")).toHaveLength(0);
  });

  it("renders every published photography folder", () => {
    window.location.hash = "#/creative/photography";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Trip folders" }),
    ).toBeInTheDocument();
    for (const trip of publishedTrips) {
      expect(
        screen.getByRole("heading", { name: trip.title }),
      ).toBeInTheDocument();
    }
    expect(
      screen.getAllByRole("link", { name: /Open .* photo folder/ }),
    ).toHaveLength(publishedTrips.length);
  });

  it("renders a photography trip with a named location section", () => {
    const trip = publishedTrips[0];
    window.location.hash = `#/creative/photography/${trip.slug}`;
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: trip.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: trip.locations?.[0]?.name || trip.location,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(`${trip.photos.length} photographs`).length,
    ).toBeGreaterThan(0);
    expect(document.title).toBe(`${trip.title} | Juan Varela Photography`);
  });

  it("renders every real trip photo and supports lightbox navigation", async () => {
    const user = userEvent.setup();
    const trip = publishedTrips.find(({ photos }) => photos.length > 1);
    expect(trip).toBeDefined();
    const photoCount = trip?.photos.length ?? 0;
    window.location.hash = `#/creative/photography/${trip?.slug}`;
    render(<App />);

    expect(
      screen.getAllByText(`${photoCount} photographs`).length,
    ).toBeGreaterThan(1);
    const previewButtons = screen.getAllByRole("button", {
      name: /Preview photo/,
    });
    expect(previewButtons).toHaveLength(photoCount);

    await user.click(previewButtons[0]);
    expect(
      screen.getByRole("dialog", { name: `${trip?.title} photo preview` }),
    ).toBeInTheDocument();
    expect(screen.queryByText(trip!.photos[0].alt)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: trip!.photos[0].alt }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next photo" }));
    expect(
      screen.getByText(`02 / ${String(photoCount).padStart(2, "0")}`),
    ).toBeInTheDocument();
  });

  it("renders the travel map, places, and hike records", async () => {
    window.location.hash = "#/creative/travel";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Field atlas" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("region", {
        name: "Interactive world map of photography folders and hikes",
      }),
    ).toBeInTheDocument();
    for (const place of publishedPlaces) {
      expect(
        screen.getByRole("heading", { name: place.title }),
      ).toBeInTheDocument();
    }
  });

  it("renders hike route data on an interactive map", () => {
    const hike =
      publishedHikes.find(({ route }) => route.points.length > 1) ??
      publishedHikes[0];
    window.location.hash = `#/creative/travel/hikes/${hike.slug}`;
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: hike.trail }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", {
        name: `${hike.trail} interactive route map`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${hike.elevationFeet.toLocaleString()} feet`),
    ).toBeInTheDocument();
  });

  it("renders only published film and music projects", () => {
    window.location.hash = "#/creative/projects";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Creative projects" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Short films." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Music projects." }),
    ).toBeInTheDocument();
    for (const project of publishedCreativeProjects) {
      expect(
        screen.getByRole("heading", { name: project.title }),
      ).toBeInTheDocument();
    }
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
  });

  it("renders the professional profile without unpublished experience", () => {
    window.location.hash = "#/about";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "About & Experience" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Technical Writing")).toBeInTheDocument();
    for (const item of experience.filter(
      ({ status }) => status !== "published",
    )) {
      expect(screen.queryByText(item.organization)).not.toBeInTheDocument();
    }
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
  });

  it("renders live contact methods", () => {
    window.location.hash = "#/contact";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Contact" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/JuanLord",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      profile.linkedin.href,
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      profile.email.href,
    );
  });
});
