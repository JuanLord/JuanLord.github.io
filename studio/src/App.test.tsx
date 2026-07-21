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
      vi.fn().mockResolvedValue(
        jsonResponse({
          document: createSeedDocument(),
          draftPath: ".portfolio-studio/content.json",
          storage: {
            configured: false,
            missing: ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID"],
          },
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the archive overview and record counts", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", { name: "Portfolio Studio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("6", { selector: ".stat-panel strong" }),
    ).toBeVisible();
    expect(screen.getByText("R2 not configured")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /publish source/i }),
    ).toBeEnabled();
  });

  it("opens photography and storage management views", async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByRole("heading", { name: "Portfolio Studio" });
    await user.click(screen.getByRole("button", { name: "Photography" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Photography" }),
    ).toBeVisible();
    expect(screen.getByText("R2 setup required")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Storage" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Storage" }),
    ).toBeVisible();
    expect(screen.getByText("Missing environment values")).toBeVisible();
    expect(screen.getByText(/R2_ACCOUNT_ID/)).toBeVisible();
  });
});
