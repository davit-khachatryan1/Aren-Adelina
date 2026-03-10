import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { siteConfig } from "./config/siteConfig";
import { applyIndexSeoMetadata, buildSeoMetadata } from "./config/seo";

const expectedSeo = buildSeoMetadata(siteConfig, "index");
const expectedShareSeo = buildSeoMetadata(siteConfig, "share");
const expectedAssetPath = resolve(
  process.cwd(),
  "public/assets/social/og-card.jpg"
);

const loadDocument = (filename = "index.html", target: "index" | "share" = "index") => {
  const template = readFileSync(resolve(process.cwd(), filename), "utf8");
  const html = applyIndexSeoMetadata(template, siteConfig, target);
  const document = new DOMParser().parseFromString(html, "text/html");

  return { document, html };
};

describe("SEO metadata", () => {
  it("keeps one consistent title and canonical URL", () => {
    const { document, html } = loadDocument();
    const canonical = document.querySelector('link[rel="canonical"]');
    const titles = document.querySelectorAll("title");

    expect(titles).toHaveLength(1);
    expect(document.title).toBe(expectedSeo.title);
    expect(canonical?.getAttribute("href")).toBe(expectedSeo.siteUrl);
    expect(html).not.toContain("Հարսանեկան Հրավեր");
    expect(html).not.toContain("__SEO_");
    expect(html).not.toContain("__SITE_");
  });

  it("uses the absolute production and image URLs for social cards", () => {
    const { document } = loadDocument();
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogImageUrl = document.querySelector('meta[property="og:image:url"]');
    const ogImageSecureUrl = document.querySelector(
      'meta[property="og:image:secure_url"]'
    );
    const ogImageWidth = document.querySelector(
      'meta[property="og:image:width"]'
    );
    const ogImageHeight = document.querySelector(
      'meta[property="og:image:height"]'
    );
    const imageSrc = document.querySelector('link[rel="image_src"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    const twitterDomain = document.querySelector('meta[name="twitter:domain"]');

    expect(ogUrl?.getAttribute("content")).toBe(expectedSeo.siteUrl);
    expect(ogImage?.getAttribute("content")).toBe(expectedSeo.imageUrl);
    expect(ogImageUrl?.getAttribute("content")).toBe(expectedSeo.imageUrl);
    expect(ogImageSecureUrl?.getAttribute("content")).toBe(expectedSeo.imageUrl);
    expect(ogImageWidth?.getAttribute("content")).toBe("1200");
    expect(ogImageHeight?.getAttribute("content")).toBe("630");
    expect(imageSrc?.getAttribute("href")).toBe(expectedSeo.imageUrl);
    expect(twitterImage?.getAttribute("content")).toBe(expectedSeo.imageUrl);
    expect(twitterUrl?.getAttribute("content")).toBe(expectedSeo.siteUrl);
    expect(twitterDomain?.getAttribute("content")).toBe(expectedSeo.siteDomain);
  });

  it("adds crawl directives and structured data for search engines", () => {
    const { document } = loadDocument();
    const robots = document.querySelector('meta[name="robots"]');
    const googlebot = document.querySelector('meta[name="googlebot"]');
    const googleVerification = document.querySelector(
      'meta[name="google-site-verification"]'
    );
    const alternate = document.querySelector(
      'link[rel="alternate"][hreflang="hy-AM"]'
    );
    const structuredData = document.querySelector(
      'script[type="application/ld+json"]'
    );
    const parsedStructuredData = JSON.parse(structuredData?.textContent ?? "{}");

    expect(robots?.getAttribute("content")).toContain("index,follow");
    expect(googlebot?.getAttribute("content")).toContain("index,follow");
    expect(googleVerification?.getAttribute("content")).toBe(
      "pfDEZSr_kkRj2yRC7Rz0X8OD1__Kc3J5DJ84IRpX3co"
    );
    expect(alternate?.getAttribute("href")).toBe(expectedSeo.siteUrl);
    expect(parsedStructuredData["@context"]).toBe(expectedSeo.structuredData["@context"]);
    expect(parsedStructuredData["@type"]).toBe(expectedSeo.structuredData["@type"]);
    expect(parsedStructuredData.name).toBe(expectedSeo.structuredData.name);
    expect(parsedStructuredData.url).toBe(expectedSeo.structuredData.url);
    expect(parsedStructuredData.image).toBe(expectedSeo.structuredData.image);
  });

  it("keeps title and description aligned across SEO card tags", () => {
    const { document, html } = loadDocument();
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');

    expect(description?.getAttribute("content")).toBe(expectedSeo.description);
    expect(ogTitle?.getAttribute("content")).toBe(expectedSeo.title);
    expect(ogDescription?.getAttribute("content")).toBe(expectedSeo.description);
    expect(twitterTitle?.getAttribute("content")).toBe(expectedSeo.title);
    expect(twitterDescription?.getAttribute("content")).toBe(expectedSeo.description);
    expect(html).not.toContain("și");
  });

  it("ships a dedicated share page with a fresh share URL and image URL", () => {
    const { document, html } = loadDocument("share.html", "share");
    const canonical = document.querySelector('link[rel="canonical"]');
    const robots = document.querySelector('meta[name="robots"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');

    expect(canonical?.getAttribute("href")).toBe(expectedShareSeo.canonicalUrl);
    expect(robots?.getAttribute("content")).toContain("noindex,nofollow");
    expect(ogUrl?.getAttribute("content")).toBe(expectedShareSeo.pageUrl);
    expect(twitterUrl?.getAttribute("content")).toBe(expectedShareSeo.pageUrl);
    expect(ogImage?.getAttribute("content")).toBe(expectedShareSeo.imageUrl);
    expect(html).not.toContain("__SEO_");
    expect(html).not.toContain("__PAGE_");
  });

  it("ships a local social card asset for the metadata image", () => {
    const assetStats = statSync(expectedAssetPath);

    expect(assetStats.isFile()).toBe(true);
    expect(assetStats.size).toBeGreaterThan(0);
  });
});
