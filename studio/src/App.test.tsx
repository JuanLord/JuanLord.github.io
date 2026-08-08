import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { createSeedDocument } from "./seed";

function jsonResponse(payload: unknown) {
  return {
    ok: true,
    json: async () => payload,
  } as Response;
}

describe("Portfolio Studio", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          jsonResponse({
            document: createSeedDocument(),
            draftPath: ".portfolio-studio/content.json",
            storage: {
              configured: false,
              missing: ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID"],
            },
          }),
        ),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the archive overview and record counts", async () => {
    const document = createSeedDocument();
    const photoCount = document.photoTrips.reduce(
      (total, trip) => total + trip.photos.length,
      0,
    );
    render(<App />);

    expect(
      await screen.findByRole("heading", { name: "Portfolio Studio" }),
    ).toBeInTheDocument();
    const photoTripStat = screen
      .getByText(`${photoCount} uploaded photos`)
      .closest("button");
    expect(photoTripStat).toBeVisible();
    expect(photoTripStat).toHaveTextContent(
      `${document.photoTrips.length}Photo trips`,
    );
    expect(screen.getByText("R2 not configured")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /prepare site update/i }),
    ).toBeEnabled();
  });

  it("opens photography and storage management views", async () => {
    const user = userEvent.setup();
    const photoCount = createSeedDocument().photoTrips.reduce(
      (total, trip) => total + trip.photos.length,
      0,
    );
    render(<App />);

    await screen.findByRole("heading", { name: "Portfolio Studio" });
    await user.click(screen.getByRole("button", { name: "Photography" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Photography" }),
    ).toBeVisible();
    expect(screen.getByText("R2 setup required")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Trip locations" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Add location" }));
    expect(screen.getByText("Location 02")).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "Publish all photos" }),
    );
    expect(
      screen.getByText(
        `${photoCount} photos marked published. Select Prepare site update to write the website files.`,
      ),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Storage" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Storage" }),
    ).toBeVisible();
    expect(screen.getByText("Missing environment values")).toBeVisible();
    expect(screen.getByText(/R2_ACCOUNT_ID/)).toBeVisible();
  });

  it("opens the professional profile and project editors", async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByRole("heading", { name: "Portfolio Studio" });
    await user.click(screen.getByRole("button", { name: "Profile & Resume" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Profile & Resume" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Upload PDF" })).toBeEnabled();

    await user.click(
      screen.getByRole("button", { name: "Professional Projects" }),
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Professional Projects",
      }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "New" }));
    expect(screen.getByLabelText("Technology stack")).toBeVisible();
  });

  it("imports GPX metadata into the hike editor", async () => {
    const user = userEvent.setup();
    const gpx = `<?xml version="1.0"?>
      <gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1">
        <trk><name>Imported Ridge Trail</name><desc>Imported description</desc><trkseg>
          <trkpt lat="48.0000" lon="-121.0000"><ele>1000</ele><time>2026-07-20T16:00:00Z</time></trkpt>
          <trkpt lat="48.0010" lon="-120.9990"><ele>1020</ele><time>2026-07-20T16:10:00Z</time></trkpt>
          <trkpt lat="48.0020" lon="-120.9980"><ele>1018</ele><time>2026-07-20T16:20:00Z</time></trkpt>
        </trkseg></trk>
      </gpx>`;
    render(<App />);

    await screen.findByRole("heading", { name: "Portfolio Studio" });
    await user.click(screen.getByRole("button", { name: "Hikes" }));
    await user.upload(
      screen.getByLabelText("Import GPX"),
      new File([gpx], "ridge-trail.gpx", { type: "application/gpx+xml" }),
    );

    expect(
      await screen.findByDisplayValue("Imported Ridge Trail"),
    ).toBeVisible();
    expect(screen.getByDisplayValue("Imported description")).toBeVisible();
    expect(screen.getByText(/3 map points imported/)).toBeVisible();
    expect(screen.getByLabelText("Distance (miles)")).not.toHaveValue(1);
    expect(screen.getByLabelText("Elevation gain (feet)")).toHaveValue(66);
  });
});
