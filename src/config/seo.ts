import type { WeddingConfig } from "../types/site";
import { siteConfig } from "./siteConfig";

const templateTokens = {
  siteUrl: "__SITE_URL__",
  siteDomain: "__SITE_DOMAIN__",
  siteName: "__SITE_NAME__",
  seoTitle: "__SEO_TITLE__",
  seoDescription: "__SEO_DESCRIPTION__",
  seoImageUrl: "__SEO_IMAGE_URL__",
  seoImageAlt: "__SEO_IMAGE_ALT__",
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

export const buildSeoMetadata = (config: WeddingConfig = siteConfig) => {
  const siteUrl = new URL(config.siteUrl).toString();

  return {
    siteUrl,
    siteDomain: new URL(siteUrl).hostname,
    siteName: config.coupleNames,
    title: config.seo.title,
    description: config.seo.description,
    imageUrl: config.seo.imageUrl,
    imageAlt: config.seo.imageAlt,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: config.seo.title,
      url: siteUrl,
      description: config.seo.description,
      inLanguage: "hy-AM",
      image: config.seo.imageUrl,
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
): string => {
  const metadata = buildSeoMetadata(config);
  const replacements = [
    [templateTokens.siteUrl, escapeHtml(metadata.siteUrl)],
    [templateTokens.siteDomain, escapeHtml(metadata.siteDomain)],
    [templateTokens.siteName, escapeHtml(metadata.siteName)],
    [templateTokens.seoTitle, escapeHtml(metadata.title)],
    [templateTokens.seoDescription, escapeHtml(metadata.description)],
    [templateTokens.seoImageUrl, escapeHtml(metadata.imageUrl)],
    [templateTokens.seoImageAlt, escapeHtml(metadata.imageAlt)],
    [templateTokens.seoStructuredData, escapeJsonForHtml(metadata.structuredData)],
  ] as const;

  return replacements.reduce(
    (output, [token, value]) => output.replaceAll(token, value),
    html,
  );
};
