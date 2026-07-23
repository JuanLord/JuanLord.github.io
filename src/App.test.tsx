import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

describe("App shell", () => {
  beforeEach(() => {
    window.location.hash = "#/";
  });

  it("renders the portfolio identity and placeholder content integration", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Juan Varela" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Telemetry Workbench")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Juan Varela, home" }),
    ).toBeInTheDocument();
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

  it("updates document metadata for routes and project case studies", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.title).toBe("Juan Varela | Developer & Engineer");

    await user.click(screen.getByRole("link", { name: "View projects" }));
    expect(document.title).toBe("Projects | Juan Varela");

    await user.click(
      screen.getByRole("link", {
        name: "View Telemetry Workbench case study",
      }),
    );
    expect(document.title).toBe("Telemetry Workbench | Juan Varela");
  });

  it("filters the project archive and keeps the filter in the URL", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/projects";
    render(<App />);

    expect(screen.getAllByRole("article")).toHaveLength(4);

    await user.click(screen.getByRole("button", { name: "Software" }));

    expect(window.location.hash).toContain("category=software");
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "Telemetry Workbench" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Autonomous Sorting System" }),
    ).not.toBeInTheDocument();
  });

  it("renders a complete project case study", () => {
    window.location.hash = "#/projects/telemetry-workbench";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Telemetry Workbench" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Product definition, interface architecture, data modeling, and frontend implementation.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Mixed test-file formats")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "View Adaptive Energy Monitor case study",
      }),
    ).toBeInTheDocument();

    const placeholderLinks = screen.getAllByRole("button", {
      name: /GitHub|Live demo/,
    });
    expect(placeholderLinks).toHaveLength(2);
    expect(
      placeholderLinks.every((button) => button.hasAttribute("disabled")),
    ).toBe(true);
    expect(
      placeholderLinks.every(
        (button) =>
          button.getAttribute("aria-describedby") ===
          "project-link-placeholder-note",
      ),
    ).toBe(true);
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

  it("renders scalable photography folders with Spotify placeholders", () => {
    window.location.hash = "#/creative/photography";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Trip folders" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pacific Coast Weekend" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "High Desert in Spring" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Tahoe Alpine Summer" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("status", { name: "Spotify media pending" }),
    ).toHaveLength(6);
    expect(document.querySelectorAll("img")).toHaveLength(0);
  });

  it("renders a photography trip folder and planned contact sheet", () => {
    window.location.hash = "#/creative/photography/pacific-coast-weekend";
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Pacific Coast Weekend",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("72 planned photographs")).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Pacific Coast Weekend photo collection pending real images",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "Spotify media pending" }),
    ).toBeInTheDocument();
    expect(document.title).toBe(
      "Pacific Coast Weekend | Juan Varela Photography",
    );
  });

  it("renders the travel map, places, and hike records", async () => {
    window.location.hash = "#/creative/travel";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Field atlas" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("img", {
        name: "World map of photography folders and hikes",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Point Reyes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Mount Tallac" }),
    ).toBeInTheDocument();
  });

  it("renders hike route data and an optional Strava embed state", () => {
    window.location.hash = "#/creative/travel/hikes/mount-tallac";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Mount Tallac" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Mount Tallac route preview" }),
    ).toBeInTheDocument();
    expect(screen.getByText("3,260 feet")).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "Strava media pending" }),
    ).toBeInTheDocument();
  });

  it("renders separate short-film and music project collections", () => {
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
    expect(
      screen.getByRole("heading", { name: "Light Between Trees" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "Spotify media pending" }),
    ).toBeInTheDocument();
  });

  it("renders the complete professional profile from placeholder content", () => {
    window.location.hash = "#/about";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "About & Experience" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Northstar Systems Lab")).toBeInTheDocument();
    expect(
      screen.getByText("Pacific Institute of Technology"),
    ).toBeInTheDocument();
    expect(screen.getByText("Technical Writing")).toBeInTheDocument();

    const resumeButtons = screen.getAllByRole("button", {
      name: "Download resume",
    });
    expect(resumeButtons).toHaveLength(2);
    expect(
      resumeButtons.every((button) => button.hasAttribute("disabled")),
    ).toBe(true);
    expect(
      resumeButtons.every(
        (button) =>
          button.getAttribute("aria-describedby") === "placeholder-action-note",
      ),
    ).toBe(true);
  });

  it("keeps live and placeholder contact methods distinct", () => {
    window.location.hash = "#/contact";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Contact" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/JuanLord",
    );
    expect(screen.getAllByText("Placeholder")).toHaveLength(2);
  });
});
