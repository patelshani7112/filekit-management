// src/seo/homeJsonLd.ts
import { BASE_URL } from "./seoConfig";

export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": `${BASE_URL}/`,
      "name": "WorkflowPro",
      "description":
        "WorkflowPro is a free all-in-one online toolkit to convert, edit, compress, merge, and manage PDF, image, video, audio, and document files directly in your browser.",
      "inLanguage": "en",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${BASE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "WorkflowPro",
      "url": `${BASE_URL}/`,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    {
      "@type": "WebPage",
      "@id": `${BASE_URL}/#home`,
      "url": `${BASE_URL}/`,
      "name": "WorkflowPro – Free PDF, Image, Video, Audio and File Tools",
      "isPartOf": {
        "@id": `${BASE_URL}/#website`
      },
      "about": {
        "@id": `${BASE_URL}/#organization`
      },
      "description":
        "Convert, compress, edit, merge, split and manage PDF, image, video, audio and document files with 150+ free online tools. No signup, no limits, no watermarks.",
      "inLanguage": "en",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "@id": `${BASE_URL}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${BASE_URL}/`
          }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is WorkflowPro?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WorkflowPro is a free online platform offering 150+ tools to convert, compress, edit, and manage PDF, image, video, audio, and document files instantly in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Is WorkflowPro free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, WorkflowPro is completely free to use with no watermarks, no file size limits and no account required."
          }
        },
        {
          "@type": "Question",
          "name": "How secure is WorkflowPro?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WorkflowPro uses local browser processing where possible, meaning your files stay on your device and are not permanently stored on servers."
          }
        },
        {
          "@type": "Question",
          "name": "Do my files stay private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Files processed with WorkflowPro are kept private. Conversions are designed to run in the browser, and any temporary data used for processing is not used for training or advertising."
          }
        },
        {
          "@type": "Question",
          "name": "Does WorkflowPro work on mobile?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. WorkflowPro is fully responsive and works on all major desktop and mobile browsers, including phones and tablets."
          }
        }
      ]
    },
    // Example featured tools as SoftwareApplication entities
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/merge-pdf/#app`,
      "name": "Merge PDF – WorkflowPro",
      "operatingSystem": "Web",
      "applicationCategory": "Utility",
      "url": `${BASE_URL}/merge-pdf`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description":
        "Merge multiple PDF files into a single document online for free using WorkflowPro. No signup, no watermark."
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/pdf-to-word/#app`,
      "name": "PDF to Word Converter – WorkflowPro",
      "operatingSystem": "Web",
      "applicationCategory": "Utility",
      "url": `${BASE_URL}/pdf-to-word`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description":
        "Convert PDF files to editable Word documents (DOCX) quickly and accurately with the free WorkflowPro PDF to Word tool."
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/jpg-to-png/#app`,
      "name": "JPG to PNG Converter – WorkflowPro",
      "operatingSystem": "Web",
      "applicationCategory": "Utility",
      "url": `${BASE_URL}/jpg-to-png`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description":
        "Convert JPG images to PNG format online with lossless quality using the free WorkflowPro JPG to PNG converter."
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/mp4-to-mp3/#app`,
      "name": "MP4 to MP3 Converter – WorkflowPro",
      "operatingSystem": "Web",
      "applicationCategory": "Utility",
      "url": `${BASE_URL}/mp4-to-mp3`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description":
        "Extract audio from MP4 videos and save it as MP3 using the free WorkflowPro MP4 to MP3 converter."
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/compress-pdf/#app`,
      "name": "Compress PDF – WorkflowPro",
      "operatingSystem": "Web",
      "applicationCategory": "Utility",
      "url": `${BASE_URL}/compress-pdf`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description":
        "Reduce PDF file size online without losing quality using the free WorkflowPro Compress PDF tool."
    }
  ]
};
