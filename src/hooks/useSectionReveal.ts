import { RefObject, useEffect } from "react";
import gsap from "gsap";

export const useSectionReveal = (
  containerRef: RefObject<HTMLElement>,
  selector: string,
  options?: {
    y?: number;
    stagger?: number;
    duration?: number;
    ease?: string;
    threshold?: number;
  }
): void => {
  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const items = Array.from(element.querySelectorAll<HTMLElement>(selector));
    if (items.length === 0) {
      return;
    }

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: options?.y ?? 30 });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }

          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: options?.duration ?? 0.8,
            stagger: options?.stagger ?? 0.15,
            ease: options?.ease ?? "power2.out"
          });
          observer.disconnect();
        });
      },
      {
        threshold: options?.threshold ?? 0.22
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    containerRef,
    selector,
    options?.duration,
    options?.ease,
    options?.stagger,
    options?.threshold,
    options?.y
  ]);
};
