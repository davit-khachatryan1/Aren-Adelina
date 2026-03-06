import { RefObject } from "react";
import { siteConfig } from "../config/siteConfig";
import { CountdownParts } from "../types/site";

interface HeroSectionProps {
  sectionRef: RefObject<HTMLElement>;
  countdown: CountdownParts;
  onScrollDown: () => void;
  heroReady: boolean;
}

const countdownLabels = ["Օր", "Ժամ", "Րոպե", "Վայրկյան"];

export const HeroSection = ({
  sectionRef,
  countdown,
  onScrollDown,
  heroReady
}: HeroSectionProps) => {
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section"
      data-section="hero"
      style={{ backgroundImage: `url(${siteConfig.heroImage})` }}
    >
      <div className="hero-overlay" />
      <div
        className={`hero-content ${heroReady ? "is-visible" : "is-hidden"}`}
        data-testid="hero-content"
      >
        <h1 className="hero-title">{siteConfig.coupleNames}</h1>
        <p className="hero-date">{siteConfig.weddingDateLabel}</p>
        <p className="hero-subtitle">Հարսանիքին մնացել է</p>

        <div className="countdown" aria-live="polite">
          {[countdown.days, countdown.hours, countdown.minutes, countdown.seconds].map(
            (value, index) => (
              <div key={countdownLabels[index]} className="countdown-cell">
                <span className="countdown-value">{String(value).padStart(2, "0")}</span>
                <span className="countdown-label">{countdownLabels[index]}</span>
              </div>
            )
          )}
        </div>
      </div>

      <button
        type="button"
        className="scroll-down"
        onClick={onScrollDown}
        aria-label="Սահել ներքև"
      >
        ˅
      </button>
    </section>
  );
};
