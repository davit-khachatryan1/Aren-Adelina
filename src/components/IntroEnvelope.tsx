import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { siteConfig } from "../config/siteConfig";

interface IntroEnvelopeProps {
  onOpened: () => void;
}

export const IntroEnvelope = ({ onOpened }: IntroEnvelopeProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const [isOpened, setIsOpened] = useState(false);

  const prefersReducedMotion = useMemo(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const isTestMode = import.meta.env.MODE === "test";

  useEffect(() => {
    if (!sealRef.current) {
      return;
    }

    const pulse = gsap.timeline({ repeat: -1 });
    pulse
      .to(sealRef.current, {
        scale: 1.04,
        duration: 1.25,
        ease: "sine.inOut"
      })
      .to(sealRef.current, {
        scale: 1,
        duration: 1.25,
        ease: "sine.inOut"
      });

    return () => {
      pulse.kill();
    };
  }, []);

  const handleOpen = () => {
    if (isOpened) {
      return;
    }

    setIsOpened(true);

    if (prefersReducedMotion || isTestMode) {
      onOpened();
      return;
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: "power2.inOut"
      },
      onComplete: onOpened
    });

    timeline
      .to(sealRef.current, {
        scale: 0.9,
        duration: 0.1
      })
      .to(sealRef.current, {
        scale: 1.05,
        duration: 0.12
      })
      .to(sealRef.current, {
        scale: 1,
        duration: 0.12
      })
      .to(
        ".intro-copy",
        {
          opacity: 0,
          duration: 0.45
        },
        "-=0.2"
      )
      .to(
        topRef.current,
        {
          rotateX: -87,
          yPercent: -58,
          transformOrigin: "50% 0%",
          duration: 1.05
        },
        "open"
      )
      .to(
        bottomRef.current,
        {
          rotateX: 88,
          yPercent: 58,
          transformOrigin: "50% 100%",
          duration: 1.05
        },
        "open"
      )
      .to(
        leftRef.current,
        {
          xPercent: -86,
          rotateY: -72,
          transformOrigin: "0% 50%",
          duration: 1.05
        },
        "open"
      )
      .to(
        rightRef.current,
        {
          xPercent: 86,
          rotateY: 72,
          transformOrigin: "100% 50%",
          duration: 1.05
        },
        "open"
      )
      .to(
        ".intro-photo",
        {
          opacity: 0.68,
          duration: 0.9
        },
        "open+=0.25"
      )
      .to(
        rootRef.current,
        {
          opacity: 0,
          duration: 0.8,
          delay: 0.1
        },
        "-=0.2"
      );
  };

  return (
    <div
      ref={rootRef}
      className={`intro-envelope ${isOpened ? "is-opened" : ""}`}
      data-testid="intro-envelope"
      aria-hidden={isOpened}
    >
      <div className="intro-photo" style={{ backgroundImage: `url(${siteConfig.heroImage})` }} />

      <div className="intro-copy intro-top-copy">{siteConfig.intro.title}</div>
      <div className="intro-copy intro-middle-copy">{siteConfig.intro.tapHint}</div>
      <div className="intro-copy intro-arrow-copy">↘</div>
      <div className="intro-copy intro-footer-copy">{siteConfig.intro.footer}</div>

      <div className="envelope" aria-hidden>
        <div ref={topRef} className="envelope-panel panel-top" />
        <div ref={leftRef} className="envelope-panel panel-left" />
        <div ref={rightRef} className="envelope-panel panel-right" />
        <div ref={bottomRef} className="envelope-panel panel-bottom" />
      </div>

      <button
        ref={sealRef}
        type="button"
        className="wax-seal"
        onClick={handleOpen}
        data-testid="open-envelope"
      >
        hyoor
      </button>
    </div>
  );
};
