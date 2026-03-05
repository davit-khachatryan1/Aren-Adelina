interface AudioControlProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioControl = ({ isPlaying, onToggle }: AudioControlProps) => (
  <button
    type="button"
    className="audio-control"
    onClick={onToggle}
    aria-label={isPlaying ? "Դադարեցնել երաժշտությունը" : "Միացնել երաժշտությունը"}
    data-testid="audio-control"
  >
    {isPlaying ? "❚❚" : "▶"}
  </button>
);
