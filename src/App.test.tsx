import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

describe("App shell", () => {
  it("renders the portfolio identity and mock content integration", () => {
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

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Engineering & Software",
      }),
    ).toBeInTheDocument();
  });
});
