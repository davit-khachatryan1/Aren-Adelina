import { createRef } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroSection } from "./HeroSection";

const countdown = {
  totalMs: 1,
  days: 10,
  hours: 9,
  minutes: 8,
  seconds: 7,
  isComplete: false
};

const setScrollY = (value: number) => {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value
  });
};

describe("HeroSection", () => {
  afterEach(() => {
    setScrollY(0);
  });

  it("renders the down icon button and calls onScrollDown when clicked", async () => {
    const user = userEvent.setup();
    const onScrollDown = vi.fn();

    setScrollY(0);

    render(
      <HeroSection
        sectionRef={createRef<HTMLElement>()}
        countdown={countdown}
        onScrollDown={onScrollDown}
        heroReady
      />
    );

    const button = screen.getByRole("button", { name: "Սահել ներքև" });
    const icon = button.querySelector(".scroll-down-icon");

    expect(button).toHaveClass("is-visible", "is-blinking");
    expect(icon).toHaveAttribute("src", "/assets/downicon.png");
    expect(icon).toHaveAttribute("alt", "");
    expect(icon).toHaveAttribute("aria-hidden", "true");

    await user.click(button);

    expect(onScrollDown).toHaveBeenCalledTimes(1);
  });

  it("stops blinking after scrolling down while remaining visible", () => {
    setScrollY(0);

    render(
      <HeroSection
        sectionRef={createRef<HTMLElement>()}
        countdown={countdown}
        onScrollDown={vi.fn()}
        heroReady
      />
    );

    const button = screen.getByRole("button", { name: "Սահել ներքև" });
    expect(button).toHaveClass("is-visible", "is-blinking");

    act(() => {
      setScrollY(120);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(button).toHaveClass("is-visible");
    expect(button).not.toHaveClass("is-blinking");
  });

  it("stays hidden and does not blink before the hero is ready", () => {
    setScrollY(0);

    render(
      <HeroSection
        sectionRef={createRef<HTMLElement>()}
        countdown={countdown}
        onScrollDown={vi.fn()}
        heroReady={false}
      />
    );

    const button = screen.getByRole("button", { name: "Սահել ներքև" });

    expect(button).toHaveClass("is-hidden");
    expect(button).not.toHaveClass("is-visible");
    expect(button).not.toHaveClass("is-blinking");
  });
});
