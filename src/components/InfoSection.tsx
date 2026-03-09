import { useRef } from "react";
import { siteConfig } from "../config/siteConfig";
import { useSectionReveal } from "../hooks/useSectionReveal";

export const InfoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, ".info-reveal", {
    y: 22,
    stagger: 0.13,
    duration: 0.7,
    ease: "power1.out",
    threshold: 0.2
  });

  return (
    <section ref={sectionRef} id="info" className="info-section" data-section="info">
      <h2 className="info-title info-reveal">{siteConfig.info.title}</h2>
      {siteConfig.info.paragraphs.map(paragraph => (
        <p key={paragraph} className="info-paragraph info-reveal">
          {paragraph}
        </p>
      ))}
{/* 
    <div className="info-title info-reveal">
    Սիրով Արեն և Ադելինա
    </div> */}
    </section>
  );
};
