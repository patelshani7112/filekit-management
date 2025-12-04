// src/seo/seoConfig.ts

export type PageType = "home" | "tool" | "category" | "static";

export interface SeoEntry {
  path: string;              // e.g. "/", "/merge-pdf"
  type: PageType;
  title: string;             // <title>
  description: string;       // <meta name="description">
  ogImage?: string;          // optional OG image URL
  // Fields for JSON-LD for tool pages:
  action?: string;           // Convert / Compress / Edit / Merge / Split
  fromFormat?: string;       // PDF, JPG, MP4, etc.
  toFormat?: string;         // Word (DOCX), PNG, MP3, etc.
  category?: string;         // PDF Tool, Image Tool, Video Tool, etc.
}

export const BASE_URL = "https://workflowpro.com";

/**
 * MASTER SEO LIST
 * Add ALL pages here (home, categories, tools, static pages).
 * This is the single source of truth for:
 * - titles
 * - meta descriptions
 * - canonical URLs
 * - JSON-LD
 * - sitemap.xml generation
 */
export const SEO_ENTRIES: SeoEntry[] = [
  // ---------------- HOME ----------------
  {
    path: "/",
    type: "home",
    title: "WorkflowPro – Free Online PDF, Image, Video & File Tools (150+ Tools)",
    description:
      "Convert, compress, edit, merge, split and manage your files with WorkflowPro. Free online tools for PDF, images, videos, audio, documents and more. No signup, no limits, 100% browser-based.",
    ogImage: `${BASE_URL}/og/home.png`,
  },

  // ------------- CATEGORY PAGES ----------
  {
    path: "/pdf-tools",
    type: "category",
    title: "PDF Tools – Edit, Convert, Merge & Compress PDF Online | WorkflowPro",
    description:
      "Use free online PDF tools to edit, merge, split, compress, convert and organize your PDF files. No signup or watermarks.",
    ogImage: `${BASE_URL}/og/pdf-tools.png`,
  },
  {
    path: "/image-tools",
    type: "category",
    title: "Image Tools – Convert, Resize & Compress Images Online | WorkflowPro",
    description:
      "Convert, resize, crop and compress images in JPG, PNG, WEBP, SVG and more formats with free online image tools.",
    ogImage: `${BASE_URL}/og/image-tools.png`,
  },
  {
    path: "/video-audio-tools",
    type: "category",
    title: "Video & Audio Tools – Convert, Extract & Edit Media Online | WorkflowPro",
    description:
      "Convert video and audio formats, extract MP3 from video, create GIFs and trim or crop clips with free browser-based tools.",
    ogImage: `${BASE_URL}/og/video-audio-tools.png`,
  },
  {
    path: "/compressors",
    type: "category",
    title: "Compressors – Compress PDF, Images, Video & Audio Online | WorkflowPro",
    description:
      "Compress PDF, JPG, PNG, MP4, MP3, WAV and more with high quality and smaller file sizes. Free online compression tools.",
    ogImage: `${BASE_URL}/og/compressors.png`,
  },
  {
    path: "/converters",
    type: "category",
    title: "File Converters – Convert Documents, Images & Media | WorkflowPro",
    description:
      "Convert documents, images, video and audio between dozens of file formats for free. Fast online file converters.",
    ogImage: `${BASE_URL}/og/converters.png`,
  },
  {
    path: "/all-tools",
    type: "category",
    title: "All Tools – 150+ Free Online File Tools | WorkflowPro",
    description:
      "Browse all WorkflowPro tools for PDFs, images, video, audio, documents, archives and more. Everything you need in one place.",
    ogImage: `${BASE_URL}/og/all-tools.png`,
  },

  // ------------- PDF TOOLS ----------
  {
    path: "/merge-pdf",
    type: "tool",
    title: "Merge PDF – Free Online PDF Merger | WorkflowPro",
    description:
      "Merge multiple PDF files into a single document online for free. Fast, secure and easy PDF merger with no signup or watermarks.",
    action: "Merge",
    fromFormat: "PDF",
    toFormat: "PDF",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/merge-pdf.png`,
  },
  {
    path: "/split-pdf",
    type: "tool",
    title: "Split PDF – Free Online PDF Splitter | WorkflowPro",
    description:
      "Split a PDF into individual pages or custom page ranges online for free. Simple and secure PDF splitter in your browser.",
    action: "Split",
    fromFormat: "PDF",
    toFormat: "PDF",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/split-pdf.png`,
  },
  {
    path: "/compress-pdf",
    type: "tool",
    title: "Compress PDF – Reduce PDF File Size Online | WorkflowPro",
    description:
      "Compress PDF files and reduce file size while keeping good quality. Free online PDF compressor with no limits.",
    action: "Compress",
    fromFormat: "PDF",
    toFormat: "PDF",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/compress-pdf.png`,
  },
  {
    path: "/pdf-to-word",
    type: "tool",
    title: "PDF to Word – Free Online PDF Converter | WorkflowPro",
    description:
      "Convert PDF files to editable Word (DOCX) documents online for free. Fast and accurate PDF to Word converter.",
    action: "Convert",
    fromFormat: "PDF",
    toFormat: "Word (DOCX)",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/pdf-to-word.png`,
  },
  {
    path: "/pdf-to-jpg",
    type: "tool",
    title: "PDF to JPG – Free Online PDF to Image Converter | WorkflowPro",
    description:
      "Convert PDF pages to high-quality JPG images online for free. Simple PDF to JPG converter in your browser.",
    action: "Convert",
    fromFormat: "PDF",
    toFormat: "JPG",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/pdf-to-jpg.png`,
  },
  {
    path: "/ocr-pdf",
    type: "tool",
    title: "OCR PDF – Extract Text from Scanned PDF Online | WorkflowPro",
    description:
      "Convert scanned PDF files to searchable and editable text using OCR technology. Free online OCR tool for PDF documents.",
    action: "OCR",
    fromFormat: "PDF",
    toFormat: "PDF (Searchable)",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/ocr-pdf.png`,
  },
  {
    path: "/edit-pdf",
    type: "tool",
    title: "Edit PDF – Free Online PDF Editor | WorkflowPro",
    description:
      "Edit PDF files online with text editing, annotations, and page management. Free browser-based PDF editor.",
    action: "Edit",
    fromFormat: "PDF",
    toFormat: "PDF",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/edit-pdf.png`,
  },
  {
    path: "/sign-pdf",
    type: "tool",
    title: "Sign PDF – Add Digital Signature to PDF Online | WorkflowPro",
    description:
      "Add digital signatures to PDF documents online for free. Secure and easy PDF signing tool in your browser.",
    action: "Sign",
    fromFormat: "PDF",
    toFormat: "PDF (Signed)",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/sign-pdf.png`,
  },
  {
    path: "/protect-pdf",
    type: "tool",
    title: "Protect PDF – Add Password Protection to PDF | WorkflowPro",
    description:
      "Add password protection and encryption to PDF files online for free. Secure your PDFs with strong passwords.",
    action: "Protect",
    fromFormat: "PDF",
    toFormat: "PDF (Protected)",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/protect-pdf.png`,
  },
  {
    path: "/unlock-pdf",
    type: "tool",
    title: "Unlock PDF – Remove PDF Password Online | WorkflowPro",
    description:
      "Remove password protection from PDF files online. Free PDF unlock tool for authorized users.",
    action: "Unlock",
    fromFormat: "PDF (Protected)",
    toFormat: "PDF",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/unlock-pdf.png`,
  },
  {
    path: "/rotate-pdf",
    type: "tool",
    title: "Rotate PDF – Rotate PDF Pages Online | WorkflowPro",
    description:
      "Rotate PDF pages online for free. Adjust page orientation and save rotated PDF documents.",
    action: "Rotate",
    fromFormat: "PDF",
    toFormat: "PDF",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/rotate-pdf.png`,
  },
  {
    path: "/pdf-to-excel",
    type: "tool",
    title: "PDF to Excel – Convert PDF to XLSX Online | WorkflowPro",
    description:
      "Convert PDF tables to Excel spreadsheets online for free. Extract data from PDF to editable XLSX format.",
    action: "Convert",
    fromFormat: "PDF",
    toFormat: "Excel (XLSX)",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/pdf-to-excel.png`,
  },
  {
    path: "/pdf-to-ppt",
    type: "tool",
    title: "PDF to PowerPoint – Convert PDF to PPT Online | WorkflowPro",
    description:
      "Convert PDF files to PowerPoint presentations online for free. Fast PDF to PPT converter.",
    action: "Convert",
    fromFormat: "PDF",
    toFormat: "PowerPoint (PPT)",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/pdf-to-ppt.png`,
  },
  {
    path: "/delete-pdf-pages",
    type: "tool",
    title: "Delete PDF Pages – Remove Unwanted Pages from PDF Online | WorkflowPro",
    description:
      "Delete pages from your PDF online for free. Upload your file, select the pages you want to remove, and download a clean, optimized PDF in seconds – no signup, no watermark, 100% secure.",
    action: "Delete",
    fromFormat: "PDF",
    toFormat: "PDF",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/delete-pdf-pages.png`,
  },
  {
    path: "/extract-pdf-pages",
    type: "tool",
    title: "Extract PDF Pages – Free Online PDF Page Extractor | WorkflowPro",
    description:
      "Extract specific pages from any PDF online for free. Select single pages or page ranges and save them as a new PDF — fast, secure, and with no watermarks.",
    action: "Extract",
    fromFormat: "PDF",
    toFormat: "PDF",
    category: "PDF Tool",
    ogImage: `${BASE_URL}/og/extract-pdf-pages.png`,
  },

  // ------------- IMAGE TOOLS ----------
  {
    path: "/jpg-to-png",
    type: "tool",
    title: "JPG to PNG – Free Image Converter | WorkflowPro",
    description:
      "Convert JPG images to PNG format online for free with high-quality output. No signup or watermarks.",
    action: "Convert",
    fromFormat: "JPG",
    toFormat: "PNG",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/jpg-to-png.png`,
  },
  {
    path: "/png-to-jpg",
    type: "tool",
    title: "PNG to JPG – Free Image Converter | WorkflowPro",
    description:
      "Convert PNG images to JPG online for free. Fast and easy PNG to JPG converter in your browser.",
    action: "Convert",
    fromFormat: "PNG",
    toFormat: "JPG",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/png-to-jpg.png`,
  },
  {
    path: "/edit-image",
    type: "tool",
    title: "Edit Image – Online Photo Editor | WorkflowPro",
    description:
      "Edit images online with cropping, rotation, filters and basic adjustments. Free browser-based photo editor.",
    action: "Edit",
    fromFormat: "Image",
    toFormat: "Image",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/edit-image.png`,
  },
  {
    path: "/resize-image",
    type: "tool",
    title: "Resize Image – Change Image Dimensions Online | WorkflowPro",
    description:
      "Resize images online for free. Change image dimensions, scale photos, and maintain aspect ratio.",
    action: "Resize",
    fromFormat: "Image",
    toFormat: "Image",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/resize-image.png`,
  },
  {
    path: "/resize-png",
    type: "tool",
    title: "Resize PNG – Change PNG Image Dimensions Online | WorkflowPro",
    description:
      "Resize PNG images online for free. Change PNG dimensions, scale photos, and maintain aspect ratio with transparency support.",
    action: "Resize",
    fromFormat: "PNG",
    toFormat: "PNG",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/resize-png.png`,
  },
  {
    path: "/rotate-image",
    type: "tool",
    title: "Rotate Image – Rotate & Flip Images Online | WorkflowPro",
    description:
      "Rotate images to any angle and flip horizontally or vertically online for free. Fix orientation and adjust photos easily.",
    action: "Rotate",
    fromFormat: "Image",
    toFormat: "Image",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/rotate-image.png`,
  },
  {
    path: "/flip-image",
    type: "tool",
    title: "Flip Image – Flip Images Horizontally & Vertically | WorkflowPro",
    description:
      "Flip images horizontally or vertically online for free. Create mirror effects and fix image orientation instantly.",
    action: "Flip",
    fromFormat: "Image",
    toFormat: "Image",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/flip-image.png`,
  },
  {
    path: "/remove-background",
    type: "tool",
    title: "Remove Background – AI Background Remover Online | WorkflowPro",
    description:
      "Remove image backgrounds automatically with AI online for free. Create transparent PNGs instantly for product photos and designs.",
    action: "Remove Background",
    fromFormat: "Image",
    toFormat: "PNG (Transparent)",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/remove-background.png`,
  },
  {
    path: "/image-enlarger",
    type: "tool",
    title: "Image Enlarger  AI Image Upscaler Online | WorkflowPro",
    description:
      "Enlarge and upscale images with AI enhancement online for free. Increase resolution up to 4x while preserving quality.",
    action: "Enlarge",
    fromFormat: "Image",
    toFormat: "High-Resolution Image",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/image-enlarger.png`,
  },
  {
    path: "/color-picker",
    type: "tool",
    title: "Color Picker – Pick Colors from Images Online | WorkflowPro",
    description:
      "Pick colors from any image and get color codes in HEX, RGB, HSL, and CMYK formats. Generate color palettes online for free.",
    action: "Pick Colors",
    fromFormat: "Image",
    toFormat: "Color Codes",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/color-picker.png`,
  },
  {
    path: "/add-watermark",
    type: "tool",
    title: "Add Watermark – Watermark Images Online | WorkflowPro",
    description:
      "Add text or image watermarks to photos online. Protect images with customizable watermarks including opacity, position, size and rotation.",
    action: "Watermark",
    fromFormat: "Image",
    toFormat: "Image (Watermarked)",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/add-watermark.png`,
  },
  {
    path: "/meme-generator",
    type: "tool",
    title: "Meme Generator – Create Memes Online Free | WorkflowPro",
    description:
      "Create funny memes with custom text. Add top and bottom text to images with classic meme styling including Impact font, stroke, and shadows.",
    action: "Generate",
    fromFormat: "Image",
    toFormat: "Meme",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/meme-generator.png`,
  },
  {
    path: "/compress-image",
    type: "tool",
    title: "Compress Image – Reduce Image File Size Online | WorkflowPro",
    description:
      "Compress JPG, PNG, and other image formats online for free. Reduce file size while maintaining quality.",
    action: "Compress",
    fromFormat: "Image",
    toFormat: "Image",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/compress-image.png`,
  },
  {
    path: "/convert-heic",
    type: "tool",
    title: "Convert HEIC – HEIC to JPG/PNG Converter | WorkflowPro",
    description:
      "Convert HEIC images from iPhone to JPG or PNG online for free. Fast HEIC converter for all devices.",
    action: "Convert",
    fromFormat: "HEIC",
    toFormat: "JPG/PNG",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/convert-heic.png`,
  },
  {
    path: "/png-to-webp",
    type: "tool",
    title: "PNG to WEBP – Convert Images to WEBP Online | WorkflowPro",
    description:
      "Convert PNG images to modern WEBP format online for free. Reduce file size with better compression.",
    action: "Convert",
    fromFormat: "PNG",
    toFormat: "WEBP",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/png-to-webp.png`,
  },
  {
    path: "/jpg-to-webp",
    type: "tool",
    title: "JPG to WEBP – Convert Images to WEBP Online | WorkflowPro",
    description:
      "Convert JPG images to WEBP format online for free. Modern image format with superior compression.",
    action: "Convert",
    fromFormat: "JPG",
    toFormat: "WEBP",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/jpg-to-webp.png`,
  },
  {
    path: "/image-to-word",
    type: "tool",
    title: "Image to Word – Extract Text from Images | WorkflowPro",
    description:
      "Convert images to Word documents with OCR technology. Extract text from JPG, PNG and other image formats.",
    action: "Convert",
    fromFormat: "Image",
    toFormat: "Word (DOCX)",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/image-to-word.png`,
  },
  {
    path: "/crop-image",
    type: "tool",
    title: "Crop Image – Online Image Cropping Tool | WorkflowPro",
    description:
      "Crop images online for free. Cut and trim photos to the perfect size with easy cropping tool.",
    action: "Crop",
    fromFormat: "Image",
    toFormat: "Image",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/crop-image.png`,
  },
  {
    path: "/webp-to-png",
    type: "tool",
    title: "WEBP to PNG – Convert WEBP to PNG Online | WorkflowPro",
    description:
      "Convert WEBP images to PNG format online for free. Fast and easy WEBP to PNG converter.",
    action: "Convert",
    fromFormat: "WEBP",
    toFormat: "PNG",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/webp-to-png.png`,
  },
  {
    path: "/webp-to-jpg",
    type: "tool",
    title: "WEBP to JPG – Convert WEBP to JPG Online | WorkflowPro",
    description:
      "Convert WEBP images to JPG format online for free. Simple WEBP to JPG converter in your browser.",
    action: "Convert",
    fromFormat: "WEBP",
    toFormat: "JPG",
    category: "Image Tool",
    ogImage: `${BASE_URL}/og/webp-to-jpg.png`,
  },

  // ------------- VIDEO & AUDIO TOOLS ----------
  {
    path: "/mp4-to-mp3",
    type: "tool",
    title: "MP4 to MP3 – Free Online Audio Extractor | WorkflowPro",
    description:
      "Extract MP3 audio from MP4 video files online for free. Fast MP4 to MP3 converter with no watermark.",
    action: "Convert",
    fromFormat: "MP4",
    toFormat: "MP3",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/mp4-to-mp3.png`,
  },
  {
    path: "/mp4-to-gif",
    type: "tool",
    title: "MP4 to GIF – Free Online Video to GIF Converter | WorkflowPro",
    description:
      "Convert MP4 videos to animated GIFs online for free. Create GIFs from video clips in your browser.",
    action: "Convert",
    fromFormat: "MP4",
    toFormat: "GIF",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/mp4-to-gif.png`,
  },
  {
    path: "/mov-to-mp4",
    type: "tool",
    title: "MOV to MP4 – Free Video Converter | WorkflowPro",
    description:
      "Convert MOV videos to MP4 format online for free. Fast MOV to MP4 converter for all devices.",
    action: "Convert",
    fromFormat: "MOV",
    toFormat: "MP4",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/mov-to-mp4.png`,
  },
  {
    path: "/video-to-gif",
    type: "tool",
    title: "Video to GIF – Create GIFs from Videos Online | WorkflowPro",
    description:
      "Convert videos to animated GIFs online for free. Create GIFs from MP4, AVI, MOV and other video formats.",
    action: "Convert",
    fromFormat: "Video",
    toFormat: "GIF",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/video-to-gif.png`,
  },
  {
    path: "/wav-to-mp3",
    type: "tool",
    title: "WAV to MP3 – Free Audio Converter | WorkflowPro",
    description:
      "Convert WAV audio files to MP3 format online for free. Fast and easy WAV to MP3 converter.",
    action: "Convert",
    fromFormat: "WAV",
    toFormat: "MP3",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/wav-to-mp3.png`,
  },
  {
    path: "/trim-video",
    type: "tool",
    title: "Trim Video – Cut Videos Online Free | WorkflowPro",
    description:
      "Trim and cut videos to the perfect length. Remove unwanted sections, create clips, and extract highlights with precise timeline control.",
    action: "Trim",
    fromFormat: "Video",
    toFormat: "Video (Trimmed)",
    category: "Video Tool",
    ogImage: `${BASE_URL}/og/trim-video.png`,
  },
  {
    path: "/mp4-to-webm",
    type: "tool",
    title: "MP4 to WEBM – Free Video Converter | WorkflowPro",
    description:
      "Convert MP4 videos to WEBM format online for free. Fast MP4 to WEBM converter for web optimization.",
    action: "Convert",
    fromFormat: "MP4",
    toFormat: "WEBM",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/mp4-to-webm.png`,
  },
  {
    path: "/compress-video",
    type: "tool",
    title: "Compress Video – Reduce Video File Size Online | WorkflowPro",
    description:
      "Compress video files online for free. Reduce MP4, MOV, AVI file sizes while maintaining quality.",
    action: "Compress",
    fromFormat: "Video",
    toFormat: "Video",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/compress-video.png`,
  },
  {
    path: "/video-converter",
    type: "tool",
    title: "Video Converter – Convert Video Formats Online | WorkflowPro",
    description:
      "Convert videos between different formats online for free. Support for MP4, MOV, AVI, WEBM and more.",
    action: "Convert",
    fromFormat: "Video",
    toFormat: "Video",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/video-converter.png`,
  },
  {
    path: "/mp3-to-wav",
    type: "tool",
    title: "MP3 to WAV – Free Audio Converter | WorkflowPro",
    description:
      "Convert MP3 audio files to WAV format online for free. High-quality MP3 to WAV converter.",
    action: "Convert",
    fromFormat: "MP3",
    toFormat: "WAV",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/mp3-to-wav.png`,
  },
  {
    path: "/compress-audio",
    type: "tool",
    title: "Compress Audio – Reduce Audio File Size Online | WorkflowPro",
    description:
      "Compress audio files online for free. Reduce MP3, WAV, and other audio format file sizes.",
    action: "Compress",
    fromFormat: "Audio",
    toFormat: "Audio",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/compress-audio.png`,
  },
  {
    path: "/avi-to-mp4",
    type: "tool",
    title: "AVI to MP4 – Free Video Converter | WorkflowPro",
    description:
      "Convert AVI videos to MP4 format online for free. Fast AVI to MP4 converter for all devices.",
    action: "Convert",
    fromFormat: "AVI",
    toFormat: "MP4",
    category: "Video & Audio Tool",
    ogImage: `${BASE_URL}/og/avi-to-mp4.png`,
  },
  {
    path: "/crop-video",
    type: "tool",
    title: "Crop Video – Crop Videos Online Free | WorkflowPro",
    description:
      "Crop and resize videos to any aspect ratio. Remove unwanted areas, adjust dimensions for YouTube (16:9), Instagram (1:1), TikTok (9:16) and more.",
    action: "Crop",
    fromFormat: "Video",
    toFormat: "Video (Cropped)",
    category: "Video Tool",
    ogImage: `${BASE_URL}/og/crop-video.png`,
  },

  // ------------- DOCUMENT CONVERTERS ----------
  {
    path: "/docx-to-doc",
    type: "tool",
    title: "DOCX to DOC – Convert Word Documents Online | WorkflowPro",
    description:
      "Convert DOCX files to DOC format online for free. Fast Word document converter for older versions.",
    action: "Convert",
    fromFormat: "DOCX",
    toFormat: "DOC",
    category: "Document Tool",
    ogImage: `${BASE_URL}/og/docx-to-doc.png`,
  },
  {
    path: "/doc-to-docx",
    type: "tool",
    title: "DOC to DOCX – Convert Word Documents Online | WorkflowPro",
    description:
      "Convert DOC files to modern DOCX format online for free. Fast Word document converter.",
    action: "Convert",
    fromFormat: "DOC",
    toFormat: "DOCX",
    category: "Document Tool",
    ogImage: `${BASE_URL}/og/doc-to-docx.png`,
  },
  {
    path: "/pptx-to-ppt",
    type: "tool",
    title: "PPTX to PPT – Convert PowerPoint Files Online | WorkflowPro",
    description:
      "Convert PPTX presentations to PPT format online for free. Fast PowerPoint converter for older versions.",
    action: "Convert",
    fromFormat: "PPTX",
    toFormat: "PPT",
    category: "Document Tool",
    ogImage: `${BASE_URL}/og/pptx-to-ppt.png`,
  },
  {
    path: "/ppt-to-pptx",
    type: "tool",
    title: "PPT to PPTX – Convert PowerPoint Files Online | WorkflowPro",
    description:
      "Convert PPT presentations to modern PPTX format online for free. Fast PowerPoint converter.",
    action: "Convert",
    fromFormat: "PPT",
    toFormat: "PPTX",
    category: "Document Tool",
    ogImage: `${BASE_URL}/og/ppt-to-pptx.png`,
  },
  {
    path: "/xlsx-to-xls",
    type: "tool",
    title: "XLSX to XLS – Convert Excel Files Online | WorkflowPro",
    description:
      "Convert XLSX spreadsheets to XLS format online for free. Fast Excel converter for older versions.",
    action: "Convert",
    fromFormat: "XLSX",
    toFormat: "XLS",
    category: "Document Tool",
    ogImage: `${BASE_URL}/og/xlsx-to-xls.png`,
  },
  {
    path: "/xls-to-xlsx",
    type: "tool",
    title: "XLS to XLSX – Convert Excel Files Online | WorkflowPro",
    description:
      "Convert XLS spreadsheets to modern XLSX format online for free. Fast Excel converter.",
    action: "Convert",
    fromFormat: "XLS",
    toFormat: "XLSX",
    category: "Document Tool",
    ogImage: `${BASE_URL}/og/xls-to-xlsx.png`,
  },
  {
    path: "/html-to-docx",
    type: "tool",
    title: "HTML to DOCX – Convert HTML to Word Online | WorkflowPro",
    description:
      "Convert HTML files to Word (DOCX) documents online for free. Fast HTML to DOCX converter.",
    action: "Convert",
    fromFormat: "HTML",
    toFormat: "DOCX",
    category: "Document Tool",
    ogImage: `${BASE_URL}/og/html-to-docx.png`,
  },
  {
    path: "/word-to-pdf",
    type: "tool",
    title: "Word to PDF – Convert DOCX to PDF Online | WorkflowPro",
    description:
      "Convert Word documents to PDF format online for free. Fast and accurate DOCX to PDF converter.",
    action: "Convert",
    fromFormat: "Word (DOCX)",
    toFormat: "PDF",
    category: "Document Tool",
    ogImage: `${BASE_URL}/og/word-to-pdf.png`,
  },
  {
    path: "/excel-to-pdf",
    type: "tool",
    title: "Excel to PDF – Convert XLSX to PDF Online | WorkflowPro",
    description:
      "Convert Excel spreadsheets to PDF format online for free. Fast XLSX to PDF converter.",
    action: "Convert",
    fromFormat: "Excel (XLSX)",
    toFormat: "PDF",
    category: "Document Tool",
    ogImage: `${BASE_URL}/og/excel-to-pdf.png`,
  },
  {
    path: "/ppt-to-pdf",
    type: "tool",
    title: "PowerPoint to PDF – Convert PPT to PDF Online | WorkflowPro",
    description:
      "Convert PowerPoint presentations to PDF format online for free. Fast PPT to PDF converter.",
    action: "Convert",
    fromFormat: "PowerPoint (PPT)",
    toFormat: "PDF",
    category: "Document Tool",
    ogImage: `${BASE_URL}/og/ppt-to-pdf.png`,
  },

  // ------------- ARCHIVE TOOLS ----------
  {
    path: "/rar-to-zip",
    type: "tool",
    title: "RAR to ZIP – Convert Archive Files Online | WorkflowPro",
    description:
      "Convert RAR archives to ZIP format online for free. Fast and secure RAR to ZIP converter.",
    action: "Convert",
    fromFormat: "RAR",
    toFormat: "ZIP",
    category: "Archive Tool",
    ogImage: `${BASE_URL}/og/rar-to-zip.png`,
  },
  {
    path: "/zip-to-rar",
    type: "tool",
    title: "ZIP to RAR – Convert Archive Files Online | WorkflowPro",
    description:
      "Convert ZIP archives to RAR format online for free. Fast and secure ZIP to RAR converter.",
    action: "Convert",
    fromFormat: "ZIP",
    toFormat: "RAR",
    category: "Archive Tool",
    ogImage: `${BASE_URL}/og/zip-to-rar.png`,
  },
  {
    path: "/archive-converter",
    type: "tool",
    title: "Archive Converter – Convert Archive Files Online | WorkflowPro",
    description:
      "Convert archive files between ZIP, RAR, 7Z and other formats online for free. Universal archive converter.",
    action: "Convert",
    fromFormat: "Archive",
    toFormat: "Archive",
    category: "Archive Tool",
    ogImage: `${BASE_URL}/og/archive-converter.png`,
  },
  {
    path: "/extract-zip",
    type: "tool",
    title: "Extract ZIP – Unzip Files Online | WorkflowPro",
    description:
      "Extract and unzip ZIP files online for free. View and download files from ZIP archives.",
    action: "Extract",
    fromFormat: "ZIP",
    toFormat: "Files",
    category: "Archive Tool",
    ogImage: `${BASE_URL}/og/extract-zip.png`,
  },
  {
    path: "/create-zip",
    type: "tool",
    title: "Create ZIP – Compress Files to ZIP Online | WorkflowPro",
    description:
      "Create ZIP archives from multiple files online for free. Compress and bundle files into ZIP format.",
    action: "Compress",
    fromFormat: "Files",
    toFormat: "ZIP",
    category: "Archive Tool",
    ogImage: `${BASE_URL}/og/create-zip.png`,
  },

  // ------------- UTILITY TOOLS ----------
  {
    path: "/unit-converter",
    type: "tool",
    title: "Unit Converter – Convert Units Online Free | WorkflowPro",
    description:
      "Convert between different units of measurement instantly. Length, weight, temperature, volume, area, speed, time, and digital storage conversions.",
    action: "Convert",
    fromFormat: "Unit",
    toFormat: "Unit",
    category: "Converter Tool",
    ogImage: `${BASE_URL}/og/unit-converter.png`,
  },
  {
    path: "/time-converter",
    type: "tool",
    title: "Time Zone Converter – Convert Time Zones Free | WorkflowPro",
    description:
      "Convert times between different time zones instantly. Support for 80+ time zones worldwide with DST awareness and live current time display.",
    action: "Convert",
    fromFormat: "Time Zone",
    toFormat: "Time Zone",
    category: "Converter Tool",
    ogImage: `${BASE_URL}/og/time-converter.png`,
  },
  {
    path: "/currency-converter",
    type: "tool",
    title: "Currency Converter – Convert Currency Online | WorkflowPro",
    description:
      "Convert currencies online with real-time exchange rates. Free currency converter for all major currencies.",
    action: "Convert",
    fromFormat: "Currency",
    toFormat: "Currency",
    category: "Utility Tool",
    ogImage: `${BASE_URL}/og/currency-converter.png`,
  },
  {
    path: "/base64-encoder",
    type: "tool",
    title: "Base64 Encoder – Encode to Base64 Online | WorkflowPro",
    description:
      "Encode text and files to Base64 format online for free. Fast and secure Base64 encoder.",
    action: "Encode",
    fromFormat: "Text/File",
    toFormat: "Base64",
    category: "Utility Tool",
    ogImage: `${BASE_URL}/og/base64-encoder.png`,
  },
  {
    path: "/base64-decoder",
    type: "tool",
    title: "Base64 Decoder – Decode Base64 Online | WorkflowPro",
    description:
      "Decode Base64 encoded text and files online for free. Fast and secure Base64 decoder.",
    action: "Decode",
    fromFormat: "Base64",
    toFormat: "Text/File",
    category: "Utility Tool",
    ogImage: `${BASE_URL}/og/base64-decoder.png`,
  },

  // ------------- STATIC PAGES ----------
  {
    path: "/privacy",
    type: "static",
    title: "Privacy Policy | WorkflowPro",
    description:
      "Read the WorkflowPro privacy policy to understand how we handle and protect your data.",
  },
  {
    path: "/terms",
    type: "static",
    title: "Terms of Use | WorkflowPro",
    description:
      "Review the WorkflowPro terms of use for information about using our free file tools.",
  },
  {
    path: "/help",
    type: "static",
    title: "Help Center | WorkflowPro",
    description:
      "Get help and support for WorkflowPro. Find answers to common questions and contact our support team.",
  },
];

// Helper: find entry by path
export function getSeoEntry(path: string): SeoEntry | undefined {
  return SEO_ENTRIES.find((entry) => entry.path === path);
}

// Helper: build full canonical URL
export function getCanonicalUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${clean}`;
}