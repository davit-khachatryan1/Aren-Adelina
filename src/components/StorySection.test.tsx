import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "../config/siteConfig";
import { StorySection } from "./StorySection";

const setViewportWidth = (width: number): void => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width
  });
};

const dispatchResize = (): void => {
  window.dispatchEvent(new Event("resize"));
};

describe("StorySection animation mode", () => {
  beforeEach(() => {
    setViewportWidth(390);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sets desktop scroll mode for wide screens", async () => {
    setViewportWidth(1400);
    dispatchResize();

    render(<StorySection />);

    await waitFor(() => {
      expect(screen.getByTestId("story-section")).toHaveAttribute(
        "data-scroll-mode",
        "desktop-scroll"
      );
    });

    expect(screen.queryByTestId("story-slider")).not.toBeInTheDocument();
  });

  it("uses mobile reveal mode for small screens", async () => {
    setViewportWidth(390);
    dispatchResize();

    render(<StorySection />);

    await waitFor(() => {
      expect(screen.getByTestId("story-section")).toHaveAttribute(
        "data-scroll-mode",
        "mobile-reveal"
      );
    });
  });

  it("renders mobile slider dots and switches slides on dot click", async () => {
    const user = userEvent.setup();
    render(<StorySection />);

    const slider = screen.getByTestId("story-slider");
    const dots = screen.getAllByRole("button", { name: /Սահել լուսանկար/i });
    const leftCards = slider.querySelectorAll(".story-slide-card-left");
    const rightCards = slider.querySelectorAll(".story-slide-card-right");

    expect(slider).toBeInTheDocument();
    expect(dots).toHaveLength(siteConfig.storyImages.length);
    expect(leftCards).toHaveLength(siteConfig.storyImages.length);
    expect(rightCards).toHaveLength(siteConfig.storyImages.length);
    expect(dots[0]).toHaveClass("is-active");
    expect(dots[0]).toHaveAttribute("aria-pressed", "true");
    expect(dots[1]).toHaveAttribute("aria-pressed", "false");

    await user.click(dots[1]);

    expect(dots[1]).toHaveClass("is-active");
    expect(dots[1]).toHaveAttribute("aria-pressed", "true");
    expect(dots[0]).toHaveAttribute("aria-pressed", "false");
  });

  it("advances slides on swipe gesture on mobile", () => {
    render(<StorySection />);

    const slider = screen.getByTestId("story-slider").querySelector(".story-slider");
    const dots = screen.getAllByRole("button", { name: /Սահել լուսանկար/i });

    expect(slider).not.toBeNull();
    expect(dots[0]).toHaveClass("is-active");

    fireEvent.touchStart(slider as Element, {
      touches: [{ clientX: 220 }]
    });
    fireEvent.touchMove(slider as Element, {
      touches: [{ clientX: 120 }]
    });
    fireEvent.touchEnd(slider as Element);

    expect(dots[1]).toHaveClass("is-active");
  });

  it("autoplay advances and wraps the active slide on mobile", () => {
    vi.useFakeTimers();
    render(<StorySection />);

    const dots = screen.getAllByRole("button", { name: /Սահել լուսանկար/i });

    expect(dots[0]).toHaveClass("is-active");

    for (let index = 1; index < siteConfig.storyImages.length; index += 1) {
      act(() => {
        vi.advanceTimersByTime(3500);
      });

      expect(dots[index]).toHaveClass("is-active");
    }

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(dots[0]).toHaveClass("is-active");
  });
});
