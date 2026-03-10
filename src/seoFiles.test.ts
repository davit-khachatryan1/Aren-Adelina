import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("SEO crawl files", () => {
  it("ships a permissive robots.txt with sitemap discovery", () => {
    const robotsTxt = readFileSync(resolve(process.cwd(), "public/robots.txt"), "utf8");

    expect(robotsTxt).toContain("User-agent: *");
    expect(robotsTxt).toContain("Allow: /");
    expect(robotsTxt).toContain("Sitemap: https://aren-adelina.vercel.app/sitemap.xml");
  });

  it("ships a homepage sitemap.xml", () => {
    const sitemapXml = readFileSync(resolve(process.cwd(), "public/sitemap.xml"), "utf8");

    expect(sitemapXml).toContain("<urlset");
    expect(sitemapXml).toContain("<loc>https://aren-adelina.vercel.app/</loc>");
  });

  it("ships the Google Search Console HTML verification file at the site root", () => {
    const verificationFile = readFileSync(
      resolve(process.cwd(), "public/googlee506bd8751764674.html"),
      "utf8"
    );

    expect(verificationFile.trim()).toBe(
      "google-site-verification: googlee506bd8751764674.html"
    );
  });
});
