import { RefObject, useEffect, useState } from "react";
import gsap from "gsap";

export type StoryScrollMode =
  | "desktop-reveal"
  | "mobile-reveal"
  | "reduced-motion";

interface StoryScrollAnimationOptions {
  sectionRef: RefObject<HTMLElement>;
  galleryRef: RefObject<HTMLElement>;
  textRef: RefObject<HTMLElement>;
}

const DESKTOP_MIN_WIDTH = 1024;

export const useStoryScrollAnimation = ({
  sectionRef,
  galleryRef,
  textRef
}: StoryScrollAnimationOptions): StoryScrollMode => {
  const [mode, setMode] = useState<StoryScrollMode>("mobile-reveal");

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let isCancelled = false;

    const section = sectionRef.current;
    const gallery = galleryRef.current;
    const text = textRef.current;
    const desktopCards = Array.from(
      gallery?.querySelectorAll<HTMLElement>(".story-card-desktop") ?? []
    );

    if (!section || !gallery || !text) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const isTestMode = import.meta.env.MODE === "test";

    const mobileNodes = [text, gallery];
    const desktopNodes = desktopCards.length > 0 ? [text, ...desktopCards] : [text, gallery];

    const initAnimation = async () => {
      if (prefersReducedMotion) {
        setMode("reduced-motion");
        if (isTestMode || isCancelled) {
          return;
        }

        gsap.fromTo(
          isDesktop ? desktopNodes : mobileNodes,
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
        setMode("desktop-reveal");
        if (isTestMode) {
          return;
        }

        gsap.set(text, { opacity: 0, y: 18 });
        gsap.set(desktopCards, { opacity: 0, y: 34, scale: 0.98 });

        observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) {
                return;
              }

              gsap
                .timeline()
                .to(text, {
                  opacity: 1,
                  y: 0,
                  duration: 0.48,
                  ease: "power2.out"
                })
                .to(
                  desktopCards,
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.72,
                    stagger: 0.08,
                    ease: "power2.out"
                  },
                  "<+0.08"
                );

              observer?.disconnect();
            });
          },
          {
            threshold: 0.2
          }
        );

        observer.observe(section);
        return;
      }

      setMode("mobile-reveal");
      if (isTestMode) {
        return;
      }

      gsap.set(mobileNodes, { opacity: 0, y: 28 });

      observer = new IntersectionObserver(
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

            observer?.disconnect();
          });
        },
        {
          threshold: 0.28
        }
      );

      observer.observe(section);
    };

    void initAnimation();

    return () => {
      isCancelled = true;
      observer?.disconnect();
    };
  }, [sectionRef, galleryRef, textRef]);

  return mode;
};
