import { describe, expect, it } from "vitest";
import { rsvpSchema } from "./rsvpSchema";

describe("rsvpSchema", () => {
  it("accepts valid attending payload", () => {
    const parse = rsvpSchema.safeParse({
      attending: "yes",
      attendingParts: ["ceremony"],
      fullName: "Անուն Ազգանուն",
      guestCount: 2,
      note: ""
    });

    expect(parse.success).toBe(true);
  });

  it("requires at least one attending part when attending is yes", () => {
    const parse = rsvpSchema.safeParse({
      attending: "yes",
      attendingParts: [],
      fullName: "Անուն Ազգանուն",
      guestCount: 1
    });

    expect(parse.success).toBe(false);
  });

  it("rejects zero guest count when attending is yes", () => {
    const parse = rsvpSchema.safeParse({
      attending: "yes",
      attendingParts: ["party"],
      fullName: "Անուն Ազգանուն",
      guestCount: 0
    });

    expect(parse.success).toBe(false);
  });
});
