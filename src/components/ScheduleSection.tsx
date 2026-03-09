import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../config/siteConfig";
import { useSectionReveal } from "../hooks/useSectionReveal";

export const ScheduleSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [openMapChooserId, setOpenMapChooserId] = useState<string | null>(null);

  useSectionReveal(sectionRef, ".schedule-reveal", {
    y: 30,
    stagger: 0.2,
    duration: 0.92,
    ease: "power2.out",
    threshold: 0.26
  });

  useEffect(() => {
    if (openMapChooserId === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMapChooserId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openMapChooserId]);

  return (
    <section
      ref={sectionRef}
      id="schedule"
      className="schedule-section"
      data-section="schedule"
    >
      <h2 className="schedule-title schedule-reveal">{siteConfig.scheduleTitle}</h2>

      <div className="event-list">
        {siteConfig.events.map(event => {
          const hasGoogle = Boolean(event.mapLinks.google);
          const hasYandex = Boolean(event.mapLinks.yandex);
          const hasMultipleProviders = hasGoogle && hasYandex;
          const singleProviderUrl = event.mapLinks.google ?? event.mapLinks.yandex ?? "";
          const chooserId = `map-options-${event.id}`;
          const isChooserOpen = openMapChooserId === event.id;

          return (
            <article key={event.id} className="event-card schedule-reveal">
              <p className="event-kicker">{event.title}</p>
              <img className="event-icon" src={event.icon} alt="" aria-hidden />
              <p className="event-time">{event.time}</p>
              <p className="event-venue">{event.venue}</p>
              <p className="event-address">{event.address}</p>
              {hasMultipleProviders ? (
                <div className="map-button-stack">
                  <button
                    type="button"
                    className={`map-button ${isChooserOpen ? "is-open" : ""}`}
                    aria-expanded={isChooserOpen}
                    aria-controls={chooserId}
                    onClick={() => {
                      setOpenMapChooserId(current => (current === event.id ? null : event.id));
                    }}
                  >
                    Ուղղել հասցեն
                  </button>
                  {isChooserOpen ? (
                    <div className="map-chooser" id={chooserId}>
                      <a
                        className="map-provider-link"
                        href={event.mapLinks.google}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setOpenMapChooserId(null)}
                      >
                        Google Maps
                      </a>
                      <a
                        className="map-provider-link"
                        href={event.mapLinks.yandex}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setOpenMapChooserId(null)}
                      >
                        Yandex Maps
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : (
                <a className="map-button" href={singleProviderUrl} target="_blank" rel="noreferrer">
                  Ուղղել հասցեն
                </a>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
