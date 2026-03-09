import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const expectedUrl = "https://aren-adelina.vercel.app/";
const expectedImage = "https://aren-adelina.vercel.app/assets/social/og-card.jpg";
const expectedTitle = "Արենի և Ադելինայի հարսանեկան հրավերք";
const expectedDescription =
  "Սիրով հրավիրում ենք ձեզ Արենի և Ադելինայի հարսանիքին՝ կիսելու մեզ հետ այս հատուկ օրը։";
const expectedStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: expectedTitle,
  url: expectedUrl,
  image: expectedImage
};
const expectedAssetPath = resolve(
  process.cwd(),
  "public/assets/social/og-card.jpg"
);

const loadDocument = () => {
  const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
  const document = new DOMParser().parseFromString(html, "text/html");

  return { document, html };
};

describe("SEO metadata", () => {
  it("keeps one consistent title and canonical URL", () => {
    const { document, html } = loadDocument();
    const canonical = document.querySelector('link[rel="canonical"]');
    const titles = document.querySelectorAll("title");

    expect(titles).toHaveLength(1);
    expect(document.title).toBe(expectedTitle);
    expect(canonical?.getAttribute("href")).toBe(expectedUrl);
    expect(html).not.toContain("Հարսանեկան Հրավեր");
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
    const twitterImage = document.querySelector('meta[name="twitter:image"]');

    expect(ogUrl?.getAttribute("content")).toBe(expectedUrl);
    expect(ogImage?.getAttribute("content")).toBe(expectedImage);
    expect(ogImageUrl?.getAttribute("content")).toBe(expectedImage);
    expect(ogImageSecureUrl?.getAttribute("content")).toBe(expectedImage);
    expect(ogImageWidth?.getAttribute("content")).toBe("1200");
    expect(ogImageHeight?.getAttribute("content")).toBe("630");
    expect(twitterImage?.getAttribute("content")).toBe(expectedImage);
  });

  it("adds crawl directives and structured data for search engines", () => {
    const { document } = loadDocument();
    const robots = document.querySelector('meta[name="robots"]');
    const googlebot = document.querySelector('meta[name="googlebot"]');
    const alternate = document.querySelector(
      'link[rel="alternate"][hreflang="hy-AM"]'
    );
    const structuredData = document.querySelector(
      'script[type="application/ld+json"]'
    );
    const parsedStructuredData = JSON.parse(structuredData?.textContent ?? "{}");

    expect(robots?.getAttribute("content")).toContain("index,follow");
    expect(googlebot?.getAttribute("content")).toContain("index,follow");
    expect(alternate?.getAttribute("href")).toBe(expectedUrl);
    expect(parsedStructuredData["@context"]).toBe(expectedStructuredData["@context"]);
    expect(parsedStructuredData["@type"]).toBe(expectedStructuredData["@type"]);
    expect(parsedStructuredData.name).toBe(expectedStructuredData.name);
    expect(parsedStructuredData.url).toBe(expectedStructuredData.url);
    expect(parsedStructuredData.image).toBe(expectedStructuredData.image);
  });

  it("keeps title and description aligned across SEO card tags", () => {
    const { document, html } = loadDocument();
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');

    expect(description?.getAttribute("content")).toBe(expectedDescription);
    expect(ogTitle?.getAttribute("content")).toBe(expectedTitle);
    expect(ogDescription?.getAttribute("content")).toBe(expectedDescription);
    expect(twitterTitle?.getAttribute("content")).toBe(expectedTitle);
    expect(twitterDescription?.getAttribute("content")).toBe(expectedDescription);
    expect(html).not.toContain("și");
  });

  it("ships a local social card asset for the metadata image", () => {
    const assetStats = statSync(expectedAssetPath);

    expect(assetStats.isFile()).toBe(true);
    expect(assetStats.size).toBeGreaterThan(0);
  });
});
