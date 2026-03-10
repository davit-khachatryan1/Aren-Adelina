import { AudioControl } from "./AudioControl";

interface SectionLink {
  id: string;
  label: string;
}

interface TopControlsProps {
  showAudioControl: boolean;
  isPlaying: boolean;
  onAudioToggle: () => void;
  onRsvpClick: () => void;
  onSectionClick: (id: string) => void;
  sectionLinks: SectionLink[];
  ctaLabel: string;
}

export const TopControls = ({
  showAudioControl,
  isPlaying,
  onAudioToggle,
  onRsvpClick,
  onSectionClick,
  sectionLinks,
  ctaLabel
}: TopControlsProps) => {
  return (
    <div className="top-controls" data-testid="top-controls">
      <nav className="section-nav" aria-label="Page sections">
        {sectionLinks.map(link => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="section-nav-link"
            onClick={event => {
              event.preventDefault();
              onSectionClick(link.id);
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {showAudioControl ? (
        <div className="audio-pill-wrapper">
          <AudioControl isPlaying={isPlaying} onToggle={onAudioToggle} />
        </div>
      ) : null}

      <a
        href="#rsvp"
        className="cta-pill"
        data-testid="rsvp-cta"
        onClick={event => {
          event.preventDefault();
          onRsvpClick();
        }}
      >
        {ctaLabel}
      </a>
    </div>
  );
};
