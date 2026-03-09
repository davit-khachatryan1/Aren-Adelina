import { RefObject, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type StoryScrollMode =
  | "desktop-scroll"
  | "mobile-reveal"
  | "reduced-motion";

interface StoryScrollAnimationOptions {
  sectionRef: RefObject<HTMLElement>;
  galleryRef: RefObject<HTMLElement>;
  textRef: RefObject<HTMLElement>;
  primaryCardRef: RefObject<HTMLElement>;
  secondaryCardRef: RefObject<HTMLElement>;
}

const DESKTOP_MIN_WIDTH = 1024;

export const useStoryScrollAnimation = ({
  sectionRef,
  galleryRef,
  textRef,
  primaryCardRef,
  secondaryCardRef
}: StoryScrollAnimationOptions): StoryScrollMode => {
  const [mode, setMode] = useState<StoryScrollMode>("mobile-reveal");

  useEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    const text = textRef.current;
    const primary = primaryCardRef.current;
    const secondary = secondaryCardRef.current;

    if (!section || !gallery || !text) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const isTestMode = import.meta.env.MODE === "test";

    const mobileNodes = [text, gallery];

    if (prefersReducedMotion) {
      setMode("reduced-motion");
      if (isTestMode) {
        return;
      }

      gsap.fromTo(
        mobileNodes,
        {
          opacity: 0,
          y: 12
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.07,
          ease: "power1.out"
        }
      );
      return;
    }

    if (isDesktop) {
      if (!primary || !secondary) {
        return;
      }

      setMode("desktop-scroll");
      if (isTestMode) {
        return;
      }

      const context = gsap.context(() => {
        gsap.set(text, { opacity: 0, x: -36, y: 12 });
        gsap.set(primary, { opacity: 0, y: 58, x: -18, scale: 0.93 });
        gsap.set(secondary, { opacity: 0, y: 28, x: 56, scale: 0.9 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              end: "top 46%",
              scrub: 0.45,
              invalidateOnRefresh: true
            }
          })
          .to(text, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.34
          })
          .to(
            primary,
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.33
            },
            "<+0.02"
          )
          .to(
            secondary,
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.33
            },
            "<+0.06"
          );

        gsap
          .timeline({
            defaults: {
              ease: "none"
            },
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true
            }
          })
          .fromTo(primary, { y: 0, x: 0 }, { y: -44, x: -24, duration: 1 })
          .fromTo(secondary, { y: 0, x: 0 }, { y: 34, x: 24, duration: 1 }, "<");
      }, section);

      return () => {
        context.revert();
      };
    }

    setMode("mobile-reveal");
    if (isTestMode) {
      return;
    }

    gsap.set(mobileNodes, { opacity: 0, y: 28 });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }

          gsap.to(mobileNodes, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: "power2.out"
          });

          observer.disconnect();
        });
      },
      {
        threshold: 0.28
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [sectionRef, galleryRef, textRef, primaryCardRef, secondaryCardRef]);

  return mode;
};
