import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const AUDIO_PREF_KEY = "wedding_audio_pref";

type AudioPreference = "on" | "off";

const readPreference = (): AudioPreference => {
  if (typeof window === "undefined") {
    return "on";
  }
  const pref = window.localStorage.getItem(AUDIO_PREF_KEY);
  return pref === "off" ? "off" : "on";
};

const persistPreference = (pref: AudioPreference): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(AUDIO_PREF_KEY, pref);
};

export const useAudioController = (source: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [preference, setPreference] = useState<AudioPreference>(() =>
    readPreference()
  );

  useEffect(() => {
    const audio = new Audio(source);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [source]);

  const play = useCallback(async () => {
    if (!audioRef.current) {
      return false;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const unlockAndMaybePlay = useCallback(async () => {
    setIsUnlocked(true);
    if (preference === "on") {
      await play();
    }
  }, [play, preference]);

  const toggle = useCallback(async () => {
    if (!isUnlocked) {
      await unlockAndMaybePlay();
      return;
    }

    if (isPlaying) {
      pause();
      setPreference("off");
      persistPreference("off");
      return;
    }

    const didPlay = await play();
    if (didPlay) {
      setPreference("on");
      persistPreference("on");
    }
  }, [isUnlocked, isPlaying, pause, play, unlockAndMaybePlay]);

  useEffect(() => {
    persistPreference(preference);
  }, [preference]);

  return useMemo(
    () => ({
      isPlaying,
      isUnlocked,
      unlockAndMaybePlay,
      toggle,
      pause,
      play
    }),
    [isPlaying, isUnlocked, unlockAndMaybePlay, toggle, pause, play]
  );
};
