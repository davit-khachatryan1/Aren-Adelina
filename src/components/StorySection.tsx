import { CSSProperties, useMemo, useRef } from "react";
import { siteConfig } from "../config/siteConfig";
import { useStoryScrollAnimation } from "../hooks/useStoryScrollAnimation";

const fallbackStoryImage = {
  src: "/assets/images/hero-couple.jpg",
  alt: "Զույգի լուսանկար",
  desktopObjectPosition: "50% 35%",
  mobileObjectPosition: "50% 30%",
  layer: "primary" as const
};

export const StorySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);

  const primaryImage = useMemo(
    () =>
      siteConfig.storyImages.find(image => image.layer === "primary") ??
      siteConfig.storyImages[0] ??
      fallbackStoryImage,
    []
  );

  const secondaryImage = useMemo(
    () =>
      siteConfig.storyImages.find(image => image.layer === "secondary") ??
      siteConfig.storyImages[1] ??
      primaryImage,
    [primaryImage]
  );

  const mode = useStoryScrollAnimation({
    sectionRef,
    textRef,
    primaryCardRef: primaryRef,
    secondaryCardRef: secondaryRef
  });

  return (
    <section
      ref={sectionRef}
      id="story"
      className="story-section"
      data-section="story"
      data-scroll-mode={mode}
      data-testid="story-section"
    >
      <div className="story-gallery" data-testid="story-gallery">
        <figure
          ref={primaryRef}
          className="story-card story-card-primary"
          style={
            {
              "--story-mobile-pos": primaryImage.mobileObjectPosition,
              "--story-desktop-pos": primaryImage.desktopObjectPosition
            } as CSSProperties
          }
        >
          <img src={primaryImage.src} alt={primaryImage.alt} loading="lazy" />
        </figure>

        <figure
          ref={secondaryRef}
          className="story-card story-card-secondary"
          style={
            {
              "--story-mobile-pos": secondaryImage.mobileObjectPosition,
              "--story-desktop-pos": secondaryImage.desktopObjectPosition
            } as CSSProperties
          }
        >
          <img src={secondaryImage.src} alt={secondaryImage.alt} loading="lazy" />
        </figure>
      </div>

      <div ref={textRef} className="story-text">
        <h2>{siteConfig.story.title}</h2>
        <p>{siteConfig.story.description}</p>
      </div>
    </section>
  );
};
