import { useEffect, useMemo, useState } from "react";
import { calculateCountdown } from "../utils/countdown";
import { CountdownParts } from "../types/site";

const tickNow = () => Date.now();

export const useCountdown = (targetISO: string): CountdownParts => {
  const [now, setNow] = useState<number>(() => tickNow());

  useEffect(() => {
    let timeoutId: number | null = null;
    let intervalId: number | null = null;

    const startInterval = () => {
      intervalId = window.setInterval(() => {
        setNow(tickNow());
      }, 1000);
    };

    const msToNextSecond = 1000 - (Date.now() % 1000);
    timeoutId = window.setTimeout(() => {
      setNow(tickNow());
      startInterval();
    }, msToNextSecond);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  return useMemo(() => calculateCountdown(targetISO, now), [targetISO, now]);
};
