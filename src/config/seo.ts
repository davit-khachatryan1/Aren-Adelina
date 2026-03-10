import type { WeddingConfig } from "../types/site";
import { siteConfig } from "./siteConfig";

export type SeoPageTarget = "index" | "share";

const templateTokens = {
  canonicalUrl: "__CANONICAL_URL__",
  pageUrl: "__PAGE_URL__",
  siteDomain: "__SITE_DOMAIN__",
  siteName: "__SITE_NAME__",
  seoTitle: "__SEO_TITLE__",
  seoDescription: "__SEO_DESCRIPTION__",
  seoImageUrl: "__SEO_IMAGE_URL__",
  seoImageAlt: "__SEO_IMAGE_ALT__",
  robotsContent: "__ROBOTS_CONTENT__",
  googlebotContent: "__GOOGLEBOT_CONTENT__",
  seoStructuredData: "__SEO_STRUCTURED_DATA__",
} as const;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escapeJsonForHtml = (value: unknown) =>
  JSON.stringify(value, null, 6).replaceAll("<", "\\u003c");

export const buildSeoMetadata = (
  config: WeddingConfig = siteConfig,
  target: SeoPageTarget = "index",
) => {
  const siteUrl = new URL(config.siteUrl).toString();
  const pageUrl =
    target === "share"
      ? new URL(config.seo.shareUrl ?? "share.html", siteUrl).toString()
      : siteUrl;
  const imageUrl =
    target === "share" ? config.seo.shareImageUrl ?? config.seo.imageUrl : config.seo.imageUrl;
  const robots =
    target === "share"
      ? "noindex,nofollow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  return {
    siteUrl,
    canonicalUrl: siteUrl,
    pageUrl,
    siteDomain: new URL(pageUrl).hostname,
    siteName: config.coupleNames,
    title: config.seo.title,
    description: config.seo.description,
    imageUrl,
    imageAlt: config.seo.imageAlt,
    robots,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: config.seo.title,
      url: pageUrl,
      description: config.seo.description,
      inLanguage: "hy-AM",
      image: imageUrl,
      isPartOf: {
        "@type": "WebSite",
        name: config.coupleNames,
        url: siteUrl,
      },
    },
  };
};

export const applyIndexSeoMetadata = (
  html: string,
  config: WeddingConfig = siteConfig,
  target: SeoPageTarget = "index",
): string => {
  const metadata = buildSeoMetadata(config, target);
  const replacements = [
    [templateTokens.canonicalUrl, escapeHtml(metadata.canonicalUrl)],
    [templateTokens.pageUrl, escapeHtml(metadata.pageUrl)],
    [templateTokens.siteDomain, escapeHtml(metadata.siteDomain)],
    [templateTokens.siteName, escapeHtml(metadata.siteName)],
    [templateTokens.seoTitle, escapeHtml(metadata.title)],
    [templateTokens.seoDescription, escapeHtml(metadata.description)],
    [templateTokens.seoImageUrl, escapeHtml(metadata.imageUrl)],
    [templateTokens.seoImageAlt, escapeHtml(metadata.imageAlt)],
    [templateTokens.robotsContent, escapeHtml(metadata.robots)],
    [templateTokens.googlebotContent, escapeHtml(metadata.robots)],
    [templateTokens.seoStructuredData, escapeJsonForHtml(metadata.structuredData)],
  ] as const;

  return replacements.reduce(
    (output, [token, value]) => output.replaceAll(token, value),
    html,
  );
};
