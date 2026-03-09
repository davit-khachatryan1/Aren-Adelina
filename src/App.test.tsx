import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App integration", () => {
  it("locks body scroll until intro envelope is opened", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByTestId("open-envelope"));

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("auto");
    });
  });

  it("scrolls to RSVP when top CTA is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByLabelText("Հայերեն")).not.toBeInTheDocument();
    expect(document.querySelector(".app-shell")).toHaveAttribute("data-hero-ready", "false");

    await user.click(screen.getByTestId("open-envelope"));

    await waitFor(() => {
      expect(document.querySelector(".app-shell")).toHaveAttribute("data-hero-ready", "true");
      expect(screen.getByTestId("hero-content")).toHaveClass("is-visible");
    });

    const scrollSpy = vi.spyOn(Element.prototype, "scrollIntoView");
    await user.click(screen.getByTestId("rsvp-cta"));

    expect(scrollSpy).toHaveBeenCalledTimes(1);
  });

  it("scrolls to the story section when the hero down icon is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId("open-envelope"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Սահել ներքև" })).toHaveClass("is-visible");
    });

    const storySection = document.getElementById("story");
    const scrollSpy = vi.spyOn(Element.prototype, "scrollIntoView");

    await user.click(screen.getByRole("button", { name: "Սահել ներքև" }));

    expect(storySection).not.toBeNull();
    expect(scrollSpy).toHaveBeenCalledTimes(1);
    expect(scrollSpy.mock.instances[0]).toBe(storySection);
  });

  it("does not play audio before interaction and starts after opening envelope", async () => {
    const user = userEvent.setup();
    const playSpy = vi.spyOn(Audio.prototype, "play");

    render(<App />);

    expect(playSpy).not.toHaveBeenCalled();

    await user.click(screen.getByTestId("open-envelope"));

    await waitFor(() => {
      expect(playSpy).toHaveBeenCalledTimes(1);
    });
  });
});
