import { describe, expect, it } from "vitest";
import { assertWeddingConfig, siteConfig } from "./siteConfig";

describe("siteConfig", () => {
  it("passes config assertions for default config", () => {
    expect(assertWeddingConfig(siteConfig)).toBe(siteConfig);
  });

  it("throws when story images are insufficient", () => {
    expect(() =>
      assertWeddingConfig({
        ...siteConfig,
        storyImages: []
      })
    ).toThrowError(/At least two story images/);
  });

  it("throws when a story image src is missing", () => {
    expect(() =>
      assertWeddingConfig({
        ...siteConfig,
        storyImages: [
          {
            ...siteConfig.storyImages[0],
            src: " "
          },
          siteConfig.storyImages[1]
        ]
      })
    ).toThrowError(/Each story image must include src/);
  });
});
