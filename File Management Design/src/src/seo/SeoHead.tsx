// src/seo/SeoHead.tsx
import { useEffect } from "react";
import { getSeoEntry, getCanonicalUrl, BASE_URL } from "./seoConfig";

type SeoHeadProps = { path: string };

/**
 * SeoHead Component
 * 
 * Manages SEO meta tags for pages without using react-helmet-async.
 * Uses native DOM manipulation to update meta tags.
 */
export function SeoHead({ path }: SeoHeadProps) {
  const seo = getSeoEntry(path) ?? getSeoEntry("/")!;
  const url = getCanonicalUrl(seo.path);
  const ogImage = seo.ogImage ?? `${BASE_URL}/og/default.png`;

  useEffect(() => {
    // Update document title
    document.title = seo.title;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        const [attr, value] = selector.match(/\[(.*?)=['"](.*)['"]/)?.slice(1, 3) || [];
        if (attr && value) {
          element.setAttribute(attr, value);
        }
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper function to update canonical link
    const updateCanonicalLink = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    // Update all meta tags
    updateMetaTag('meta[name="description"]', seo.description);
    updateCanonicalLink(url);

    // Open Graph tags
    updateMetaTag('meta[property="og:type"]', "website");
    updateMetaTag('meta[property="og:url"]', url);
    updateMetaTag('meta[property="og:title"]', seo.title);
    updateMetaTag('meta[property="og:description"]', seo.description);
    updateMetaTag('meta[property="og:image"]', ogImage);

    // Twitter tags
    updateMetaTag('meta[name="twitter:card"]', "summary_large_image");
    updateMetaTag('meta[name="twitter:title"]', seo.title);
    updateMetaTag('meta[name="twitter:description"]', seo.description);
    updateMetaTag('meta[name="twitter:image"]', ogImage);
  }, [seo, url, ogImage]);

  return null;
}
