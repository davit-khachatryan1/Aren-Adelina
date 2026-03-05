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

    const scrollSpy = vi.spyOn(Element.prototype, "scrollIntoView");
    await user.click(screen.getByTestId("rsvp-cta"));

    expect(scrollSpy).toHaveBeenCalledTimes(1);
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
