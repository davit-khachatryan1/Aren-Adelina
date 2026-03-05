import { AudioControl } from "./AudioControl";

interface TopControlsProps {
  showAudioControl: boolean;
  isPlaying: boolean;
  onAudioToggle: () => void;
  onRsvpClick: () => void;
  ctaLabel: string;
}

export const TopControls = ({
  showAudioControl,
  isPlaying,
  onAudioToggle,
  onRsvpClick,
  ctaLabel
}: TopControlsProps) => {
  return (
    <div className="top-controls" data-testid="top-controls">
      {showAudioControl ? (
        <div className="audio-pill-wrapper">
          <AudioControl isPlaying={isPlaying} onToggle={onAudioToggle} />
        </div>
      ) : null}

      <button
        type="button"
        className="cta-pill"
        onClick={onRsvpClick}
        data-testid="rsvp-cta"
      >
        {ctaLabel}
      </button>
    </div>
  );
};
