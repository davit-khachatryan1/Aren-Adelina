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
    const sealButton = screen.getByTestId("open-envelope");
    expect(sealButton).toBeInTheDocument();
    expect(sealButton.closest(".envelope-seal-anchor")).not.toBeNull();
    expect(container.querySelector(".top-content")).not.toBeInTheDocument();
    expect(container.querySelector(".seal-button-text")).not.toBeInTheDocument();

    const textureImages = container.querySelectorAll(
      'img.texture-image[src="/assets/images/paper_texture.jpg"]'
    );
    expect(textureImages).toHaveLength(2);
    expect(container.querySelectorAll(".envelope-side-part img.texture-image")).toHaveLength(0);
  });

  it("opens once and calls onOpenStart before onRevealReady and onOpened", async () => {
    const user = userEvent.setup();
    const onOpenStart = vi.fn();
    const onRevealReady = vi.fn();
    const onOpened = vi.fn();

    render(
      <IntroEnvelope
        onOpenStart={onOpenStart}
        onRevealReady={onRevealReady}
        onOpened={onOpened}
      />
    );

    const button = screen.getByTestId("open-envelope");
    await user.click(button);
    await user.click(button);

    expect(onOpenStart).toHaveBeenCalledTimes(1);
    expect(onRevealReady).toHaveBeenCalledTimes(1);
    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onOpenStart.mock.invocationCallOrder[0]).toBeLessThan(
      onRevealReady.mock.invocationCallOrder[0]
    );
    expect(onRevealReady.mock.invocationCallOrder[0]).toBeLessThan(
      onOpened.mock.invocationCallOrder[0]
    );
    expect(screen.getByTestId("intro-envelope")).toHaveClass("is-opened");
    expect(screen.getByTestId("intro-envelope")).toHaveAttribute("aria-hidden", "true");
  });

  it("cascades the copy exit while side flaps still fade only", async () => {
    const user = userEvent.setup();
    const tweenCalls: Array<{
      position?: string;
      target: HTMLElement;
      vars: Record<string, unknown>;
    }> = [];
    const setSpy = vi.spyOn(gsap, "set");
    const timelineSpy = vi.spyOn(gsap, "timeline").mockImplementation(config => {
      const isPulse = config?.repeat === -1;
      const timeline = {
        addLabel: vi.fn(() => timeline),
        to: vi.fn((target: unknown, vars: Record<string, unknown>, position?: string) => {
          if (!isPulse && target instanceof HTMLElement) {
            tweenCalls.push({ position, target, vars });
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
      expect(setSpy).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          rotation: 0,
          rotateX: 0,
          rotateY: 0,
          yPercent: 0,
          opacity: 1,
          filter: "none",
          transformOrigin: "50% 50%"
        })
      );

      const sideTweens = tweenCalls.filter(
        ({ target }) =>
          target.classList.contains("envelope-left-part") ||
          target.classList.contains("envelope-right-part")
      );
      const topTweens = tweenCalls.filter(({ target }) =>
        target.classList.contains("envelope-top-part")
      );
      const bottomTweens = tweenCalls.filter(({ target }) =>
        target.classList.contains("envelope-bottom-part")
      );
      const sealTweens = tweenCalls.filter(({ target }) =>
        target.classList.contains("envelope-seal-button")
      );
      const titleTween = tweenCalls.find(({ target }) =>
        target.classList.contains("envelope-top-text")
      );
      const calloutTween = tweenCalls.find(({ target }) =>
        target.classList.contains("seal-callout")
      );
      const footerTween = tweenCalls.find(({ target }) =>
        target.classList.contains("envelope-bottom-text")
      );

      expect(sideTweens).toHaveLength(2);
      sideTweens.forEach(vars => {
        expect(vars.vars.opacity).toBe(0);
        expect(vars.vars.xPercent).toBeUndefined();
        expect(vars.vars.rotateY).toBeUndefined();
      });

      expect(sealTweens).toHaveLength(1);
      expect(sealTweens[0]).toEqual(
        expect.objectContaining({
          position: "copyOut",
          vars: expect.objectContaining({
            autoAlpha: 0,
            duration: 0,
            ease: "sine.out"
          })
        })
      );
      expect(sealTweens[0]?.vars.scale).toBeUndefined();
      expect(sealTweens[0]?.vars.rotation).toBeUndefined();
      expect(sealTweens[0]?.vars.rotateX).toBeUndefined();
      expect(sealTweens[0]?.vars.rotateY).toBeUndefined();
      expect(sealTweens[0]?.vars.yPercent).toBeUndefined();
      expect(sealTweens[0]?.vars.filter).toBeUndefined();

      expect(titleTween).toEqual(
        expect.objectContaining({
          position: "copyOut+=0.14",
          vars: expect.objectContaining({
            rotation: 4,
            rotateY: 10,
            yPercent: -6,
            opacity: 0,
            filter: "blur(6px)",
            duration: 0,
            ease: "sine.out"
          })
        })
      );
      expect(calloutTween).toEqual(
        expect.objectContaining({
          position: "copyOut+=0.22",
          vars: expect.objectContaining({
            rotation: 7,
            rotateY: 12,
            xPercent: -3,
            yPercent: -5,
            opacity: 0,
            filter: "blur(6px)",
            duration: 0,
            ease: "sine.out"
          })
        })
      );
      expect(footerTween).toEqual(
        expect.objectContaining({
          position: "copyOut+=0.30",
          vars: expect.objectContaining({
            rotation: -3,
            rotateY: 8,
            yPercent: 10,
            opacity: 0,
            filter: "blur(7px)",
            duration: 0,
            ease: "sine.out"
          })
        })
      );

      expect(topTweens).toHaveLength(2);
      expect(topTweens[0]).toEqual(
        expect.objectContaining({
          position: "open",
          vars: expect.objectContaining({
            z: 34,
            rotateX: -12,
            yPercent: -6
          })
        })
      );
      expect(topTweens[1]).toEqual(
        expect.objectContaining({
          position: "open+=0.2",
          vars: expect.objectContaining({
            z: 0,
            rotateX: -104,
            yPercent: -92
          })
        })
      );

      expect(bottomTweens).toHaveLength(1);
      expect(bottomTweens[0]).toEqual(
        expect.objectContaining({
          position: "open+=0.16",
          vars: expect.objectContaining({
            yPercent: 100,
            duration: 0
          })
        })
      );
    } finally {
      timelineSpy.mockRestore();
      setSpy.mockRestore();
    }
  });
});
