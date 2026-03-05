import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StorySection } from "./StorySection";

const setViewportWidth = (width: number): void => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width
  });
};

describe("StorySection animation mode", () => {
  it("sets desktop scroll mode for wide screens", async () => {
    setViewportWidth(1400);

    render(<StorySection />);

    await waitFor(() => {
      expect(screen.getByTestId("story-section")).toHaveAttribute(
        "data-scroll-mode",
        "desktop-scroll"
      );
    });
  });

  it("uses mobile reveal mode for small screens", async () => {
    setViewportWidth(390);

    render(<StorySection />);

    await waitFor(() => {
      expect(screen.getByTestId("story-section")).toHaveAttribute(
        "data-scroll-mode",
        "mobile-reveal"
      );
    });
  });
});
