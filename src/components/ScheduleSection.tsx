import { useRef } from "react";
import { siteConfig } from "../config/siteConfig";
import { useSectionReveal } from "../hooks/useSectionReveal";

const GOOGLE_MAPS_ICON = "/assets/icons/google-maps.svg";
const YANDEX_MAPS_ICON = "/assets/icons/yandex-maps.svg";

export const ScheduleSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal(sectionRef, ".schedule-reveal", {
    y: 30,
    stagger: 0.2,
    duration: 0.92,
    ease: "power2.out",
    threshold: 0.26
  });

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

          return (
            <article key={event.id} className="event-card schedule-reveal">
              <p className="event-kicker">{event.title}</p>
              <img className="event-icon" src={event.icon} alt="" aria-hidden />
              <p className="event-time">{event.time}</p>
              <p className="event-venue">{event.venue}</p>
              <p className="event-address">{event.address}</p>
              <div className="map-address-actions">
                <p className="map-address-label">հասցեն</p>
                <div className="map-icon-row">
                  {hasGoogle ? (
                    <a
                      className="map-icon-link"
                      href={event.mapLinks.google}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Google Maps"
                    >
                      <img src={GOOGLE_MAPS_ICON} alt="" width={28} height={28} />
                    </a>
                  ) : null}
                  {hasYandex ? (
                    <a
                      className="map-icon-link"
                      href={event.mapLinks.yandex}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Yandex Maps"
                    >
                      <img src={YANDEX_MAPS_ICON} alt="" width={28} height={28} />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
