// src/seo/SeoForRoute.tsx
import { useLocation } from "react-router-dom";
import { Seo } from "../components/Seo";
import { SEO_ENTRIES, SeoEntry, BASE_URL } from "./seoConfig";
import { homeJsonLd } from "./homeJsonLd";

function buildJsonLdForEntry(entry: SeoEntry): object | undefined {
  // Homepage → big @graph JSON-LD
  if (entry.type === "home") {
    return homeJsonLd;
  }

  // Tool pages → SoftwareApplication JSON-LD
  if (
    entry.type === "tool" &&
    entry.action &&
    entry.fromFormat &&
    entry.toFormat &&
    entry.category
  ) {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": entry.title,
      "operatingSystem": "Web",
      "applicationCategory": "UtilityApplication",
      "url": `${BASE_URL}${entry.path}`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": `${entry.action} ${entry.fromFormat} to ${entry.toFormat} online for free with WorkflowPro. Fast, secure and browser-based ${entry.category}.`
    };
  }

  // Category / static pages could have additional schema later
  return undefined;
}

export function SeoForRoute() {
  const location = useLocation();
  const cleanPath = location.pathname.split("?")[0]; // strip query params

  const entry = SEO_ENTRIES.find((e) => e.path === cleanPath);

  if (!entry) {
    // No SEO entry defined for this path
    return null;
  }

  const canonical =
    entry.path === "/" ? `${BASE_URL}/` : `${BASE_URL}${entry.path}`;

  const jsonLd = buildJsonLdForEntry(entry);

  return (
    <Seo
      title={entry.title}
      description={entry.description}
      canonical={canonical}
      ogImage={entry.ogImage}
      jsonLd={jsonLd}
    />
  );
}
