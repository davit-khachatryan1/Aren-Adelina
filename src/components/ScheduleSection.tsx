import { useRef } from "react";
import { siteConfig } from "../config/siteConfig";
import { useSectionReveal } from "../hooks/useSectionReveal";

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
        {siteConfig.events.map(event => (
          <article key={event.id} className="event-card schedule-reveal">
            <p className="event-kicker">{event.title}</p>
            <img className="event-icon" src={event.icon} alt="" aria-hidden />
            <p className="event-time">{event.time}</p>
            <p className="event-venue">{event.venue}</p>
            <p className="event-address">{event.address}</p>
            <a className="map-button" href={event.mapUrl} target="_blank" rel="noreferrer">
              Ուղղել հասցեն
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};
