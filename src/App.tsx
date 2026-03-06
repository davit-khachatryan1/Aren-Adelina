import { useEffect, useMemo, useRef, useState } from "react";
import { HeroSection } from "./components/HeroSection";
import { InfoSection } from "./components/InfoSection";
import { IntroEnvelope } from "./components/IntroEnvelope";
import { RsvpSection } from "./components/RsvpSection";
import { ScheduleSection } from "./components/ScheduleSection";
import { StorySection } from "./components/StorySection";
import { TopControls } from "./components/TopControls";
import { assertWeddingConfig, siteConfig } from "./config/siteConfig";
import { useAudioController } from "./hooks/useAudioController";
import { useCountdown } from "./hooks/useCountdown";

const validatedConfig = assertWeddingConfig(siteConfig);

const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }
  element.scrollIntoView({ behavior: "smooth", block: "start" });
};

const App = () => {
  const heroRef = useRef<HTMLElement>(null);
  const countdown = useCountdown(validatedConfig.weddingDateISO);
  const audio = useAudioController(validatedConfig.musicFile);

  const [introComplete, setIntroComplete] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [heroIsVisible, setHeroIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = introComplete ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [introComplete]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        setHeroIsVisible(entries.some(entry => entry.isIntersecting));
      },
      {
        threshold: 0.35
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const showAudioControl = useMemo(
    () => introComplete && heroIsVisible,
    [introComplete, heroIsVisible]
  );

  const handleIntroOpened = () => {
    setIntroComplete(true);
    void audio.unlockAndMaybePlay();
  };

  return (
    <div
      className="app-shell"
      data-intro-complete={introComplete ? "true" : "false"}
      data-hero-ready={heroReady ? "true" : "false"}
    >
      <TopControls
        showAudioControl={showAudioControl}
        isPlaying={audio.isPlaying}
        onAudioToggle={() => {
          void audio.toggle();
        }}
        onRsvpClick={() => scrollToSection("rsvp")}
        ctaLabel={validatedConfig.ctaLabel}
      />

      {!introComplete ? (
        <IntroEnvelope onRevealReady={() => setHeroReady(true)} onOpened={handleIntroOpened} />
      ) : null}

      <HeroSection
        sectionRef={heroRef}
        countdown={countdown}
        heroReady={heroReady}
        onScrollDown={() => scrollToSection("story")}
      />
      <StorySection />
      <ScheduleSection />
      <RsvpSection />
      <InfoSection />
    </div>
  );
};

export default App;
