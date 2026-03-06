import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import gsap from "gsap";
import { siteConfig } from "../config/siteConfig";
import { IntroEnvelope } from "./IntroEnvelope";

describe("IntroEnvelope", () => {
  it("renders top invitation text and seal open button", () => {
    const { container } = render(<IntroEnvelope onOpened={vi.fn()} />);

    expect(screen.getByText(siteConfig.intro.title)).toBeInTheDocument();
    expect(
      screen.getByText((content, element) => {
        if (!element?.classList.contains("envelope-bottom-text")) {
          return false;
        }
        return (
          content.includes("Այս հրավերը Դուք պատահական չեք ստացել։") &&
          content.includes("Մեզ համար հատկապես կարևոր է")
        );
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((content, element) => {
        if (!element?.classList.contains("seal-callout-text")) {
          return false;
        }
        return content.includes("Բացել") && content.includes("այստեղ");
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId("open-envelope")).toBeInTheDocument();
    expect(container.querySelector(".top-content")).not.toBeInTheDocument();
    expect(container.querySelector(".seal-button-text")).not.toBeInTheDocument();

    const textureImages = container.querySelectorAll(
      'img.texture-image[src="/assets/images/paper_texture.jpg"]'
    );
    expect(textureImages).toHaveLength(2);
    expect(container.querySelectorAll(".envelope-side-part img.texture-image")).toHaveLength(0);
  });

  it("opens once and calls onRevealReady before onOpened", async () => {
    const user = userEvent.setup();
    const onRevealReady = vi.fn();
    const onOpened = vi.fn();

    render(<IntroEnvelope onRevealReady={onRevealReady} onOpened={onOpened} />);

    const button = screen.getByTestId("open-envelope");
    await user.click(button);
    await user.click(button);

    expect(onRevealReady).toHaveBeenCalledTimes(1);
    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onRevealReady.mock.invocationCallOrder[0]).toBeLessThan(
      onOpened.mock.invocationCallOrder[0]
    );
    expect(screen.getByTestId("intro-envelope")).toHaveClass("is-opened");
    expect(screen.getByTestId("intro-envelope")).toHaveAttribute("aria-hidden", "true");
  });

  it("animates side flaps with fade only (no slide/rotate tween)", async () => {
    const user = userEvent.setup();
    const sideTweens: Array<Record<string, unknown>> = [];
    const topTweens: Array<Record<string, unknown>> = [];
    const bottomTweens: Array<Record<string, unknown>> = [];
    const setSpy = vi.spyOn(gsap, "set");
    const timelineSpy = vi.spyOn(gsap, "timeline").mockImplementation(config => {
      const isPulse = config?.repeat === -1;
      const timeline = {
        to: vi.fn((target: unknown, vars: Record<string, unknown>) => {
          if (!isPulse && target instanceof HTMLElement) {
            if (
              target.classList.contains("envelope-left-part") ||
              target.classList.contains("envelope-right-part")
            ) {
              sideTweens.push(vars);
            }
            if (target.classList.contains("envelope-top-part")) {
              topTweens.push(vars);
            }
            if (target.classList.contains("envelope-bottom-part")) {
              bottomTweens.push(vars);
            }
          }
          return timeline;
        }),
        call: vi.fn(() => timeline),
        progress: vi.fn(() => timeline),
        kill: vi.fn()
      };
      return timeline as unknown as gsap.core.Timeline;
    });

    try {
      render(<IntroEnvelope onOpened={vi.fn()} />);
      await user.click(screen.getByTestId("open-envelope"));

      expect(setSpy).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          xPercent: 0,
          rotateY: 0,
          opacity: 1
        })
      );
      expect(sideTweens).toHaveLength(2);
      sideTweens.forEach(vars => {
        expect(vars.opacity).toBe(0);
        expect(vars.xPercent).toBeUndefined();
        expect(vars.rotateY).toBeUndefined();
      });

      expect(topTweens).toHaveLength(2);
      expect(topTweens[0]).toEqual(
        expect.objectContaining({
          z: 34,
          rotateX: -12,
          yPercent: -6
        })
      );
      expect(topTweens[1]).toEqual(
        expect.objectContaining({
          z: 0,
          rotateX: -104,
          yPercent: -92
        })
      );

      expect(bottomTweens).toHaveLength(1);
      expect(bottomTweens[0]).toEqual(
        expect.objectContaining({
          yPercent: 100,
          duration: 0
        })
      );
    } finally {
      timelineSpy.mockRestore();
      setSpy.mockRestore();
    }
  });
});
