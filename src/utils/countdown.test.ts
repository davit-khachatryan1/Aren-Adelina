import { describe, expect, it } from "vitest";
import { calculateCountdown } from "./countdown";

describe("calculateCountdown", () => {
  it("returns correct values for future timestamp", () => {
    const now = new Date("2026-04-18T15:00:00+04:00").getTime();
    const result = calculateCountdown("2026-04-19T16:00:00+04:00", now);

    expect(result.days).toBe(1);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.isComplete).toBe(false);
  });

  it("handles exact one-second rollover", () => {
    const target = "2026-04-19T16:00:00+04:00";
    const oneSecondBefore = new Date("2026-04-19T15:59:59+04:00").getTime();
    const atTarget = new Date("2026-04-19T16:00:00+04:00").getTime();

    expect(calculateCountdown(target, oneSecondBefore).seconds).toBe(1);
    expect(calculateCountdown(target, atTarget).seconds).toBe(0);
    expect(calculateCountdown(target, atTarget).isComplete).toBe(true);
  });
});
