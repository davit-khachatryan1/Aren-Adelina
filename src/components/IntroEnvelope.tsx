import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { siteConfig } from "../config/siteConfig";

interface IntroEnvelopeProps {
  onOpened: () => void;
  onOpenStart?: () => void;
  onRevealReady?: () => void;
}

export const IntroEnvelope = ({
  onOpened,
  onOpenStart,
  onRevealReady
}: IntroEnvelopeProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const topPartRef = useRef<HTMLDivElement>(null);
  const bottomPartRef = useRef<HTMLDivElement>(null);
  const leftPartRef = useRef<HTMLDivElement>(null);
  const rightPartRef = useRef<HTMLDivElement>(null);
  const topTextRef = useRef<HTMLParagraphElement>(null);
  const bottomTextRef = useRef<HTMLParagraphElement>(null);
  const sealCalloutRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pulseRef = useRef<gsap.core.Timeline | null>(null);
  const revealTriggeredRef = useRef(false);
  const [isOpened, setIsOpened] = useState(false);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
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
    pulseRef.current = pulse;

    return () => {
      pulse.kill();
      pulseRef.current = null;
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  const handleOpen = () => {
    if (isOpened) {
      return;
    }

    setIsOpened(true);
    onOpenStart?.();
    revealTriggeredRef.current = false;
    pulseRef.current?.kill();
    pulseRef.current = null;

    const triggerRevealReady = () => {
      if (revealTriggeredRef.current) {
        return;
      }
      revealTriggeredRef.current = true;
      onRevealReady?.();
    };

    if (prefersReducedMotion) {
      triggerRevealReady();
      onOpened();
      return;
    }

    const sealFadeOutDuration = isTestMode ? 0 : 2.24;
    const copyRotateOutDuration = isTestMode ? 0 : 1.92;
    const topDepthDuration = isTestMode ? 0 : 1.12;
    const topOpenDuration = isTestMode ? 0 : 4.64;
    const bottomDuration = isTestMode ? 0 : 4.8;
    const sideFadeDuration = isTestMode ? 0 : 4.2;
    const photoRevealDuration = isTestMode ? 0 : 3.2;
    const introFadeDuration = isTestMode ? 0 : 0.88;

    gsap.set([leftPartRef.current, rightPartRef.current], {
      xPercent: 0,
      rotateY: 0,
      opacity: 1
    });
    gsap.set(topPartRef.current, {
      rotateX: 0,
      yPercent: 0,
      z: 0,
      transformOrigin: "50% 100%"
    });
    gsap.set(bottomPartRef.current, {
      rotateX: 0,
      yPercent: 0,
      z: 0,
      transformOrigin: "50% 0%"
    });
    gsap.set([topTextRef.current, sealCalloutRef.current, bottomTextRef.current, sealRef.current], {
      rotation: 0,
      rotateX: 0,
      rotateY: 0,
      yPercent: 0,
      opacity: 1,
      filter: "none",
      transformOrigin: "50% 50%"
    });

    const timeline = gsap.timeline({
      defaults: {
        ease: "power2.inOut"
      },
      onComplete: onOpened
    });
    timelineRef.current = timeline;

    timeline
      .addLabel("copyOut")
      .to(
        sealRef.current,
        {
          autoAlpha: 0,
          duration: sealFadeOutDuration,
          ease: "sine.out"
        },
        "copyOut"
      )
      .to(
        topTextRef.current,
        {
          rotation: 4,
          rotateY: 10,
          yPercent: -6,
          opacity: 0,
          filter: "blur(6px)",
          duration: isTestMode ? 0 : copyRotateOutDuration - 0.04,
          ease: "sine.out"
        },
        "copyOut+=0.14"
      )
      .to(
        sealCalloutRef.current,
        {
          rotation: 7,
          rotateY: 12,
          xPercent: -3,
          yPercent: -5,
          opacity: 0,
          filter: "blur(6px)",
          duration: isTestMode ? 0 : copyRotateOutDuration - 0.06,
          ease: "sine.out"
        },
        "copyOut+=0.22"
      )
      .to(
        bottomTextRef.current,
        {
          rotation: -3,
          rotateY: 8,
          yPercent: 10,
          opacity: 0,
          filter: "blur(7px)",
          duration: copyRotateOutDuration,
          ease: "sine.out"
        },
        "copyOut+=0.30"
      )
      .addLabel("open", "copyOut+=2.28")
      .to(
        topPartRef.current,
        {
          z: 34,
          rotateX: -12,
          yPercent: -6,
          transformOrigin: "50% 100%",
          duration: topDepthDuration,
          ease: "power2.out"
        },
        "open"
      )
      .to(
        topPartRef.current,
        {
          z: 0,
          rotateX: -104,
          yPercent: -92,
          transformOrigin: "50% 100%",
          duration: topOpenDuration,
          ease: "power3.inOut"
        },
        "open+=0.2"
      )
      .to(
        bottomPartRef.current,
        {
          yPercent: 100,
          transformOrigin: "50% 0%",
          duration: bottomDuration,
          ease: "power1.inOut"
        },
        "open+=0.16"
      )
      .to(
        leftPartRef.current,
        {
          opacity: 0,
          duration: sideFadeDuration,
          ease: "power1.inOut"
        },
        "open+=0.22"
      )
      .to(
        rightPartRef.current,
        {
          opacity: 0,
          duration: sideFadeDuration,
          ease: "power1.inOut"
        },
        "open+=0.22"
      )
      .to(
        photoRef.current,
        {
          opacity: 0.75,
          duration: photoRevealDuration
        },
        "open+=0.42"
      )
      .call(triggerRevealReady, undefined, "open+=2.72")
      .to(
        rootRef.current,
        {
          opacity: 0,
          duration: introFadeDuration,
          delay: 0.18,
          ease: "power2.out"
        },
        "open+=5.2"
      );

    if (isTestMode) {
      timeline.progress(1);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`intro-envelope ${isOpened ? "is-opened" : ""}`}
      data-testid="intro-envelope"
      aria-hidden={isOpened}
    >
      <div
        ref={photoRef}
        className="intro-photo"
        style={{ backgroundImage: `url(${siteConfig.heroImage})` }}
      />

      <p ref={bottomTextRef} className="envelope-bottom-text">
        {siteConfig.intro.footer}
      </p>

      <div className="envelope">
        <div ref={leftPartRef} className="envelope-side-part envelope-left-part">
          <div className="envelope-shape-shadow-wrapper">
            <div className="envelope-shape-wrapper-side">
              <div className="envelope-shape-overlay" />
            </div>
          </div>
        </div>

        <div ref={rightPartRef} className="envelope-side-part envelope-right-part">
          <div className="envelope-shape-shadow-wrapper">
            <div className="envelope-shape-wrapper-side">
              <div className="envelope-shape-overlay" />
            </div>
          </div>
        </div>

        <div ref={bottomPartRef} className="envelope-bottom-part">
          <div className="envelope-shape-shadow-wrapper">
            <div className="envelope-shape-wrapper-bottom">
              <img
                alt=""
                aria-hidden
                className="texture-image"
                src="/assets/images/paper_texture.jpg"
              />
              <div className="envelope-shape-overlay" />
            </div>
          </div>
        </div>

        <div ref={topPartRef} className="envelope-top-part">
          <div className="envelope-shape-shadow-wrapper">
            <div className="envelope-shape-wrapper-top">
              <img
                alt="Wedding couple"
                className="texture-image"
                src="/assets/images/paper_texture.jpg"
              />
              <div className="envelope-shape-overlay" />
            </div>
          </div>
          <p ref={topTextRef} className="envelope-top-text">
            {siteConfig.intro.title}
          </p>

          <div className="envelope-seal-anchor">
            <button
              ref={sealRef}
              type="button"
              className="envelope-seal-button"
              onClick={handleOpen}
              data-testid="open-envelope"
            >
              <img
                alt="Envelope button"
                className="envelope-seal-image"
                src="/assets/images/red_seal.png"
              />
            </button>
          </div>

          <div ref={sealCalloutRef} className="seal-callout" aria-hidden="true">
            <p className="seal-callout-text">
              Բացել
              <br />
              այստեղ
            </p>
            <span className="seal-callout-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};
