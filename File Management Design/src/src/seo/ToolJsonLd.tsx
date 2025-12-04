// src/seo/ToolJsonLd.tsx
import { useEffect } from "react";
import { getSeoEntry, getCanonicalUrl } from "./seoConfig";

type ToolJsonLdProps = { path: string };

/**
 * ToolJsonLd Component
 * 
 * Adds structured data (JSON-LD) for tool pages without using react-helmet-async.
 * Uses native DOM manipulation to inject JSON-LD script.
 */
export function ToolJsonLd({ path }: ToolJsonLdProps) {
  const seo = getSeoEntry(path);
  
  useEffect(() => {
    if (!seo || seo.type !== "tool") return;

    const url = getCanonicalUrl(seo.path);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: seo.title,
      applicationCategory: "Utility",
      operatingSystem: "Web",
      url,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: seo.description,
    };

    // Add or update JSON-LD script
    let script = document.querySelector('script[type="application/ld+json"][data-tool-jsonld]');
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-tool-jsonld", "true");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    // Cleanup function to remove the script when component unmounts
    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"][data-tool-jsonld]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [seo]);

  if (!seo || seo.type !== "tool") return null;

  return null;
}
