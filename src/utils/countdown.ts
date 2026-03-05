import { CountdownParts } from "../types/site";

export const calculateCountdown = (
  targetISO: string,
  nowMs: number = Date.now()
): CountdownParts => {
  const targetMs = new Date(targetISO).getTime();
  const totalMs = Math.max(targetMs - nowMs, 0);

  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    isComplete: totalMs <= 0
  };
};
