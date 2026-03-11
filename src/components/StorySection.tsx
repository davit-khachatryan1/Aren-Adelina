import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
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
  const galleryRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isMobileSlider, setIsMobileSlider] = useState(false);

  const storyImages = useMemo(
    () => (siteConfig.storyImages.length > 0 ? siteConfig.storyImages : [fallbackStoryImage]),
    []
  );

  const sliderImages = useMemo(
    () => (storyImages.length >= 2 ? storyImages : [storyImages[0], storyImages[0]]),
    [storyImages]
  );

  const storySlides = useMemo(
    () =>
      sliderImages.map((front, index) => ({
        left: sliderImages[(index - 1 + sliderImages.length) % sliderImages.length] ?? front,
        front,
        right: sliderImages[(index + 1) % sliderImages.length] ?? front
      })),
    [sliderImages]
  );

  useEffect(() => {
    const syncMobileSlider = () => {
      const nextIsMobileSlider = window.innerWidth < 1024;
      setIsMobileSlider(current => {
        if (!current && nextIsMobileSlider) {
          setActiveSlideIndex(0);
        }
        return nextIsMobileSlider;
      });
    };

    syncMobileSlider();
    window.addEventListener("resize", syncMobileSlider);

    return () => {
      window.removeEventListener("resize", syncMobileSlider);
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobileSlider) {
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
      return;
    }

    autoplayRef.current = window.setInterval(() => {
      setActiveSlideIndex(current => (current + 1) % storySlides.length);
    }, 3500);

    return () => {
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [activeSlideIndex, isMobileSlider, storySlides.length]);

  const mode = useStoryScrollAnimation({
    sectionRef,
    galleryRef,
    textRef
  });

  const desktopCardVariants = [
    "hero",
    "accent",
    "top-right",
    "bottom-left",
    "bottom-right",
    "ribbon"
  ] as const;

  const goToSlide = (index: number) => {
    setActiveSlideIndex(index);
  };

  const goToNextSlide = () => {
    setActiveSlideIndex(current => (current + 1) % storySlides.length);
  };

  const goToPreviousSlide = () => {
    setActiveSlideIndex(current => (current - 1 + storySlides.length) % storySlides.length);
  };

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = event => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = event => {
    if (touchStartXRef.current === null) {
      return;
    }

    touchDeltaXRef.current = (event.touches[0]?.clientX ?? touchStartXRef.current) - touchStartXRef.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaXRef.current <= -48) {
      goToNextSlide();
    } else if (touchDeltaXRef.current >= 48) {
      goToPreviousSlide();
    }

    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  };

  return (
    <section
      ref={sectionRef}
      id="story"
      className="story-section"
      data-section="story"
      data-scroll-mode={mode}
      data-testid="story-section"
    >
      <div ref={textRef} className="story-text">
        <h2>{siteConfig.story.title}</h2>
        <p>{siteConfig.story.description}</p>
      </div>

      <div ref={galleryRef} className="story-gallery" data-testid="story-gallery">
        {!isMobileSlider ? (
          <div className="story-gallery-desktop">
            {storyImages.map((image, index) => (
              <figure
                key={`${image.src}-${index}`}
                className="story-card story-card-desktop"
                data-variant={desktopCardVariants[index % desktopCardVariants.length]}
                style={
                  {
                    "--story-desktop-pos": image.desktopObjectPosition
                  } as CSSProperties
                }
              >
                <img src={image.src} alt={image.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        ) : (
          <div
            className="story-gallery-mobile"
            data-testid="story-slider"
            aria-label="Մեր լուսանկարները"
          >
            <div
              className="story-slider"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="story-slider-track"
                style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
              >
                {storySlides.map((slide, index) => (
                  <div
                    key={`${slide.left.src}-${slide.front.src}-${slide.right.src}-${index}`}
                    className="story-slide"
                    data-active={index === activeSlideIndex ? "true" : "false"}
                  >
                    <figure
                      className="story-slide-card story-slide-card-left"
                      style={
                        {
                          "--story-mobile-pos": slide.left.mobileObjectPosition
                        } as CSSProperties
                      }
                    >
                      <img src={slide.left.src} alt={slide.left.alt} loading="lazy" />
                    </figure>

                    <figure
                      className="story-slide-card story-slide-card-front"
                      style={
                        {
                          "--story-mobile-pos": slide.front.mobileObjectPosition
                        } as CSSProperties
                      }
                    >
                      <img src={slide.front.src} alt={slide.front.alt} loading="lazy" />
                    </figure>

                    <figure
                      className="story-slide-card story-slide-card-right"
                      style={
                        {
                          "--story-mobile-pos": slide.right.mobileObjectPosition
                        } as CSSProperties
                      }
                    >
                      <img src={slide.right.src} alt={slide.right.alt} loading="lazy" />
                    </figure>
                  </div>
                ))}
              </div>
            </div>

            <div className="story-slider-dots">
              {storySlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`story-slider-dot ${index === activeSlideIndex ? "is-active" : ""}`}
                  aria-label={`Սահել լուսանկար ${index + 1}`}
                  aria-pressed={index === activeSlideIndex}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
