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

  it("throws when site URL is missing", () => {
    expect(() =>
      assertWeddingConfig({
        ...siteConfig,
        siteUrl: " "
      })
    ).toThrowError(/siteUrl is required/);
  });

  it("throws when SEO image URL is not absolute", () => {
    expect(() =>
      assertWeddingConfig({
        ...siteConfig,
        seo: {
          ...siteConfig.seo,
          imageUrl: "/assets/social/og-card.jpg"
        }
      })
    ).toThrowError(/seo.imageUrl must be an absolute URL/);
  });
});
