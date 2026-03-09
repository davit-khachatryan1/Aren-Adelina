import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const expectedUrl = "https://aren-adelina.vercel.app/";
const expectedImage =
  "https://raw.githubusercontent.com/davit-khachatryan1/Aren-Adelina/refs/heads/main/public/assets/images/hero-couple.jpg";
const expectedTitle = "Արենի և Ադելինայի հարսանեկան հրավերք";
const expectedDescription =
  "Սիրով հրավիրում ենք ձեզ Արենի և Ադելինայի հարսանիքին՝ կիսելու մեզ հետ այս հատուկ օրը։";

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
    const twitterImage = document.querySelector('meta[name="twitter:image"]');

    expect(ogUrl?.getAttribute("content")).toBe(expectedUrl);
    expect(ogImage?.getAttribute("content")).toBe(expectedImage);
    expect(twitterImage?.getAttribute("content")).toBe(expectedImage);
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
});
