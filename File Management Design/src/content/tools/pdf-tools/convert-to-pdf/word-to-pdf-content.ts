/**
 * Word to PDF Tool - Content Configuration
 * 
 * Centralized content for the Word to PDF converter tool page.
 */

import { 
  Upload, FileType, Download, RefreshCw,
  FileText, FilePlus, Archive, FileImage
} from "lucide-react";

/**
 * Hero Section Content
 */
export const HERO_CONTENT = {
  title: "Word to PDF Converter",
  description: "Convert Word documents (.doc, .docx) to PDF online for free. Perfect formatting preservation, no signup required – fast, secure, and easy to use.",
};

/**
 * Feature Highlights
 */
export const FEATURES = [
  {
    title: "📄 Perfect Formatting",
    description: "Preserves all formatting, fonts, and images",
  },
  {
    title: "⚡ Instant Conversion",
    description: "Convert Word to PDF in seconds",
  },
  {
    title: "🎯 100% Private",
    description: "Your files never leave your device",
  },
  {
    title: "💯 Free Forever",
    description: "No signup, no watermarks, unlimited use",
  },
];

/**
 * Why Choose Content
 */
export const WHY_CHOOSE_CONTENT = {
  title: "Why Choose WorkflowPro for Word to PDF Conversion?",
  subtitle: "The most reliable and feature-rich Word to PDF converter online",
  introText: "WorkflowPro delivers fast, accurate, and secure Word to PDF conversion trusted by professionals, students, and businesses worldwide. No signup required.",
  features: [
    {
      title: "Perfect Format Preservation",
      description: "Our advanced conversion engine ensures that all formatting, fonts, images, tables, and layouts from your Word document are perfectly preserved in the PDF output.",
    },
    {
      title: "100% Client-Side Processing",
      description: "All conversion happens in your browser. Your Word documents never touch our servers, ensuring complete privacy and security for sensitive files.",
    },
    {
      title: "Multiple File Support",
      description: "Convert multiple Word documents to PDF at once. Upload up to 10 files and get them all converted in a single batch.",
    },
    {
      title: "Universal Compatibility",
      description: "Supports both .doc and .docx formats. Output PDFs work on all devices and PDF readers including Adobe Acrobat, Chrome, and mobile apps.",
    },
  ],
};

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Word Files",
    description: "Select one or more Word documents (.doc or .docx) from your device. Drag and drop or click to browse.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Configure Settings",
    description: "Choose conversion options like preserving formatting and embedding fonts for best results.",
    icon: FileType,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 3,
    title: "Convert & Download",
    description: "Click 'Convert to PDF' and download your converted PDF files instantly with perfect formatting.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
  {
    name: "PDF to Word",
    description: "Convert PDF back to Word",
    href: "/pdf-to-word",
    icon: FileText,
  },
  {
    name: "Excel to PDF",
    description: "Convert Excel to PDF",
    href: "/excel-to-pdf",
    icon: FileText,
  },
  {
    name: "PowerPoint to PDF",
    description: "Convert PPT to PDF",
    href: "/powerpoint-to-pdf",
    icon: FileText,
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size",
    href: "/compress-pdf",
    icon: Archive,
  },
];

/**
 * Use Cases
 */
export const USE_CASES = [
  "Convert resumes and cover letters to PDF for job applications",
  "Share professional reports and documents in PDF format",
  "Convert contracts and agreements to PDF for signing",
  "Create PDF versions of academic papers and essays",
  "Convert business proposals and presentations to PDF",
  "Archive Word documents in universal PDF format for long-term storage",
];

export const USE_CASES_TITLE = "Common Use Cases for Word to PDF Conversion";

/**
 * Upload Configuration
 */
export const UPLOAD_CONFIG = {
  accept: ".doc,.docx,.rtf,.odt",
  allowMultiple: true,
  maxFiles: 10,
  maxFileSize: 50, // MB
  fileTypeLabel: "Word Documents",
  helperText: ".doc, .docx, .rtf, and .odt files · Up to 10 files · 50MB each",
};

/**
 * Output Format Categories
 */
export const OUTPUT_FORMAT_CATEGORIES = [
  "Document",
  "Image",
  "Ebook",
  "Report",
  "Archive",
  "Media",
];

/**
 * Available Output Formats
 */
export const OUTPUT_FORMATS = [
  // ========================================
  // 📄 DOCUMENT FORMATS
  // ========================================
  {
    id: "pdf",
    name: "PDF",
    extension: "pdf",
    category: "Document",
    description: "Portable document",
  },
  {
    id: "pdfa",
    name: "PDF/A",
    extension: "pdf",
    category: "Document",
    description: "Archive standard",
  },
  {
    id: "docx",
    name: "DOCX",
    extension: "docx",
    category: "Document",
    description: "Word 2007+",
  },
  {
    id: "doc",
    name: "DOC",
    extension: "doc",
    category: "Document",
    description: "Word 97-2003",
  },
  {
    id: "rtf",
    name: "RTF",
    extension: "rtf",
    category: "Document",
    description: "Rich text",
  },
  {
    id: "txt",
    name: "TXT",
    extension: "txt",
    category: "Document",
    description: "Plain text",
  },
  {
    id: "odt",
    name: "ODT",
    extension: "odt",
    category: "Document",
    description: "OpenDocument",
  },
  {
    id: "html",
    name: "HTML",
    extension: "html",
    category: "Document",
    description: "Web page",
  },
  {
    id: "md",
    name: "MD",
    extension: "md",
    category: "Document",
    description: "Markdown",
  },
  {
    id: "tex",
    name: "TEX",
    extension: "tex",
    category: "Document",
    description: "LaTeX",
  },
  {
    id: "pptx",
    name: "PPTX",
    extension: "pptx",
    category: "Document",
    description: "PowerPoint 2007+",
  },
  {
    id: "ppt",
    name: "PPT",
    extension: "ppt",
    category: "Document",
    description: "PowerPoint 97-2003",
  },
  {
    id: "xlsx",
    name: "XLSX",
    extension: "xlsx",
    category: "Document",
    description: "Excel 2007+",
  },
  {
    id: "xls",
    name: "XLS",
    extension: "xls",
    category: "Document",
    description: "Excel 97-2003",
  },
  {
    id: "csv",
    name: "CSV",
    extension: "csv",
    category: "Document",
    description: "Data export",
  },
  {
    id: "ods",
    name: "ODS",
    extension: "ods",
    category: "Document",
    description: "Open spreadsheet",
  },
  {
    id: "odp",
    name: "ODP",
    extension: "odp",
    category: "Document",
    description: "Open presentation",
  },
  {
    id: "xps",
    name: "XPS",
    extension: "xps",
    category: "Document",
    description: "XML Paper",
  },
  {
    id: "ps",
    name: "PS",
    extension: "ps",
    category: "Document",
    description: "PostScript",
  },
  {
    id: "dvi",
    name: "DVI",
    extension: "dvi",
    category: "Document",
    description: "TeX output",
  },
  {
    id: "wps",
    name: "WPS",
    extension: "wps",
    category: "Document",
    description: "WPS Office",
  },
  {
    id: "log",
    name: "LOG",
    extension: "log",
    category: "Document",
    description: "Log file",
  },
  {
    id: "ini",
    name: "INI",
    extension: "ini",
    category: "Document",
    description: "Config",
  },
  {
    id: "yaml",
    name: "YAML / YML",
    extension: "yaml",
    category: "Document",
    description: "YAML config",
  },
  {
    id: "pub",
    name: "PUB",
    extension: "pub",
    category: "Document",
    description: "Publisher",
  },
  {
    id: "vsdx",
    name: "VSDX",
    extension: "vsdx",
    category: "Document",
    description: "Visio",
  },
  {
    id: "pages",
    name: "PAGES",
    extension: "pages",
    category: "Document",
    description: "Apple Pages",
  },
  {
    id: "key",
    name: "KEY",
    extension: "key",
    category: "Document",
    description: "Apple Keynote",
  },
  {
    id: "numbers",
    name: "NUMBERS",
    extension: "numbers",
    category: "Document",
    description: "Apple Numbers",
  },

  // ========================================
  // 🖼 IMAGE FORMATS
  // ========================================
  {
    id: "jpg",
    name: "JPG / JPEG",
    extension: "jpg",
    category: "Image",
    description: "Standard photo",
  },
  {
    id: "png",
    name: "PNG",
    extension: "png",
    category: "Image",
    description: "Transparent image",
  },
  {
    id: "webp",
    name: "WEBP",
    extension: "webp",
    category: "Image",
    description: "Modern web",
  },
  {
    id: "gif",
    name: "GIF",
    extension: "gif",
    category: "Image",
    description: "Animation",
  },
  {
    id: "bmp",
    name: "BMP",
    extension: "bmp",
    category: "Image",
    description: "Bitmap",
  },
  {
    id: "tiff",
    name: "TIFF",
    extension: "tiff",
    category: "Image",
    description: "High quality",
  },
  {
    id: "svg",
    name: "SVG",
    extension: "svg",
    category: "Image",
    description: "Vector",
  },
  {
    id: "eps",
    name: "EPS",
    extension: "eps",
    category: "Image",
    description: "Print vector",
  },
  {
    id: "ico",
    name: "ICO",
    extension: "ico",
    category: "Image",
    description: "Icon",
  },
  {
    id: "psd",
    name: "PSD",
    extension: "psd",
    category: "Image",
    description: "Photoshop",
  },
  {
    id: "ai",
    name: "AI",
    extension: "ai",
    category: "Image",
    description: "Illustrator",
  },
  {
    id: "raw",
    name: "RAW",
    extension: "raw",
    category: "Image",
    description: "Camera raw",
  },
  {
    id: "heic",
    name: "HEIC",
    extension: "heic",
    category: "Image",
    description: "iPhone photo",
  },
  {
    id: "heif",
    name: "HEIF",
    extension: "heif",
    category: "Image",
    description: "Efficient image",
  },
  {
    id: "cr2",
    name: "CR2",
    extension: "cr2",
    category: "Image",
    description: "Canon RAW",
  },
  {
    id: "nef",
    name: "NEF",
    extension: "nef",
    category: "Image",
    description: "Nikon RAW",
  },
  {
    id: "arw",
    name: "ARW",
    extension: "arw",
    category: "Image",
    description: "Sony RAW",
  },

  // ========================================
  // 📚 EBOOK FORMATS
  // ========================================
  {
    id: "epub",
    name: "EPUB",
    extension: "epub",
    category: "Ebook",
    description: "Standard ebook",
  },
  {
    id: "mobi",
    name: "MOBI",
    extension: "mobi",
    category: "Ebook",
    description: "Old Kindle",
  },
  {
    id: "azw3",
    name: "AZW3",
    extension: "azw3",
    category: "Ebook",
    description: "Kindle",
  },
  {
    id: "fb2",
    name: "FB2",
    extension: "fb2",
    category: "Ebook",
    description: "FictionBook",
  },
  {
    id: "cbz",
    name: "CBZ",
    extension: "cbz",
    category: "Ebook",
    description: "ComicBook ZIP",
  },
  {
    id: "cbr",
    name: "CBR",
    extension: "cbr",
    category: "Ebook",
    description: "ComicBook RAR",
  },

  // ========================================
  // 📊 REPORT / DATA FORMATS
  // ========================================
  {
    id: "csv-report",
    name: "CSV",
    extension: "csv",
    category: "Report",
    description: "Data table",
  },
  {
    id: "xlsx-report",
    name: "XLSX",
    extension: "xlsx",
    category: "Report",
    description: "Excel report",
  },
  {
    id: "tsv",
    name: "TSV",
    extension: "tsv",
    category: "Report",
    description: "Tab-separated",
  },
  {
    id: "json",
    name: "JSON",
    extension: "json",
    category: "Report",
    description: "JSON data",
  },
  {
    id: "xml",
    name: "XML",
    extension: "xml",
    category: "Report",
    description: "XML data",
  },
  {
    id: "sql",
    name: "SQL",
    extension: "sql",
    category: "Report",
    description: "Database",
  },
  {
    id: "parquet",
    name: "PARQUET",
    extension: "parquet",
    category: "Report",
    description: "Big data",
  },
  {
    id: "avro",
    name: "AVRO",
    extension: "avro",
    category: "Report",
    description: "Avro data",
  },
  {
    id: "yaml-report",
    name: "YAML / YML",
    extension: "yaml",
    category: "Report",
    description: "YAML data",
  },

  // ========================================
  // 📦 ARCHIVE FORMATS
  // ========================================
  {
    id: "zip",
    name: "ZIP",
    extension: "zip",
    category: "Archive",
    description: "ZIP archive",
  },
  {
    id: "rar",
    name: "RAR",
    extension: "rar",
    category: "Archive",
    description: "RAR archive",
  },
  {
    id: "7z",
    name: "7Z",
    extension: "7z",
    category: "Archive",
    description: "7-Zip",
  },

  // ========================================
  // 🎥 MEDIA FORMATS
  // ========================================
  {
    id: "mp3",
    name: "MP3",
    extension: "mp3",
    category: "Media",
    description: "Audio",
  },
  {
    id: "wav",
    name: "WAV",
    extension: "wav",
    category: "Media",
    description: "Audio wave",
  },
  {
    id: "mp4",
    name: "MP4",
    extension: "mp4",
    category: "Media",
    description: "Video",
  },
  {
    id: "mov",
    name: "MOV",
    extension: "mov",
    category: "Media",
    description: "QuickTime",
  },
  {
    id: "webm",
    name: "WEBM",
    extension: "webm",
    category: "Media",
    description: "Web video",
  },
];

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  invalidFileType: (count: number) => 
    count === 1 
      ? "Invalid file type. Please upload Word documents (.doc or .docx)."
      : `${count} files are not Word documents. Only .doc and .docx files are supported.`,
  fileTooLarge: (count: number, maxSize: number) => 
    count === 1
      ? `File size exceeds ${maxSize}MB limit.`
      : `${count} files exceed the ${maxSize}MB size limit.`,
  maxFilesReached: (maxFiles: number) => 
    `Maximum ${maxFiles} files allowed. Please remove some files before adding more.`,
  tooManyFiles: (maxFiles: number) => 
    `Only the first ${maxFiles} files were added. Maximum ${maxFiles} files allowed.`,
};

/**
 * UI Labels
 */
export const UI_LABELS = {
  // Upload step
  uploadTitle: "Upload Word Documents",
  replaceFile: "Add More Files",
  continueToConvert: "Continue to Convert",
  
  // Edit step
  conversionSettings: "Conversion Settings",
  outputFilename: "Output Filename",
  preserveFormatting: "Preserve Formatting",
  embedFonts: "Embed Fonts",
  convertButton: "Convert to PDF",
  
  // Processing
  converting: "Converting to PDF...",
  processing: "Processing documents...",
  finalizing: "Finalizing conversion...",
  
  // Success
  successTitle: "Your PDF is Ready!",
  successMessage: "Your Word documents have been converted to PDF.",
  convertAnother: "Convert More Files",
  
  // File list
  sourceFiles: "Source Files",
  readyToConvert: "Ready to Convert",
};

/**
 * SEO Content
 */
export const SEO_CONTENT = {
  definition: {
    title: "What is Word to PDF Conversion?",
    content: `Word to PDF conversion is the process of transforming Microsoft Word documents (.doc and .docx files) into Portable Document Format (PDF) files. This conversion preserves the document's formatting, fonts, images, and layout while creating a universal file format that can be viewed on any device.

PDFs are the standard for sharing documents professionally because they maintain consistent formatting across all devices and operating systems. When you convert a Word document to PDF, the content becomes fixed and cannot be easily edited, making it ideal for final versions of documents, contracts, resumes, and reports.

WorkflowPro's Word to PDF converter uses advanced conversion technology to ensure that your documents are converted with perfect accuracy. All fonts, images, tables, headers, footers, and formatting are preserved exactly as they appear in your original Word document. The entire conversion process happens securely in your browser, ensuring that your sensitive documents remain completely private.`,
  },
  
  howItWorks: {
    title: "How to Convert Word to PDF",
    subtitle: "Convert your Word documents to PDF in 3 simple steps",
    introText: "Follow these steps to convert your Word files to PDF format:",
  },
  
  footer: {
    title: "Convert Word to PDF Online - Free & Secure",
    content: `Converting Word documents to PDF is essential for professional document sharing, job applications, and file archiving. PDF files maintain consistent formatting across all devices and platforms, making them the preferred format for sharing important documents.

WorkflowPro's free Word to PDF converter makes it easy to convert your .doc and .docx files to PDF format in seconds. Our converter preserves all formatting, fonts, images, tables, and layouts from your original Word document, ensuring that your PDF looks exactly as intended.

**Key Benefits:**
- **Perfect Formatting:** All fonts, images, tables, and layouts are preserved
- **Complete Privacy:** Conversion happens in your browser – files never uploaded
- **Batch Conversion:** Convert up to 10 Word documents at once
- **Universal Compatibility:** Output PDFs work on all devices and PDF readers
- **No Watermarks:** Clean, professional output without any branding
- **Free Forever:** No signup, subscriptions, or hidden costs

**Perfect For:**
- Job seekers converting resumes and cover letters for applications
- Students submitting assignments and papers in PDF format
- Business professionals sharing reports and proposals
- Anyone archiving documents in universal PDF format
- Freelancers sending invoices and contracts to clients
- Educators distributing course materials and handouts

**Why Convert Word to PDF?**
- **Universal Access:** PDFs can be opened on any device without Word installed
- **Consistent Formatting:** Documents look the same on all devices and operating systems
- **Professional Appearance:** PDFs are the standard for business communications
- **File Security:** PDFs can be password-protected and signed digitally
- **Smaller File Size:** PDFs are often smaller than Word documents
- **Print-Ready:** PDFs maintain exact formatting for printing

Start converting your Word documents to PDF today with WorkflowPro – the trusted choice for fast, accurate, and secure document conversion.`,
  },
};

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = 
  "You have uploaded files that haven't been converted yet. Are you sure you want to leave? Your progress will be lost.";

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "Is Word to PDF conversion free?",
    answer: "Yes, WorkflowPro's Word to PDF converter is completely free with no hidden costs. You can convert unlimited Word documents to PDF without any signup or subscription.",
  },
  {
    question: "Will the PDF look exactly like my Word document?",
    answer: "Yes, our converter preserves all formatting, fonts, images, tables, headers, footers, and page layouts. The PDF will look exactly like your original Word document.",
  },
  {
    question: "Can I convert both .doc and .docx files?",
    answer: "Yes, our converter supports both the older .doc format (Word 97-2003) and the modern .docx format (Word 2007 and later).",
  },
  {
    question: "How many Word files can I convert at once?",
    answer: "You can convert up to 10 Word documents in a single batch. If you need to convert more, you can process additional batches.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Each Word document can be up to 50MB in size. This is sufficient for most documents including those with many images.",
  },
  {
    question: "Do you store my Word documents?",
    answer: "No, we never store your files. All conversion happens directly in your browser using JavaScript. Your documents remain completely private and never leave your device.",
  },
  {
    question: "Will the PDF include all images from my Word document?",
    answer: "Yes, all images, charts, graphs, and graphics from your Word document are preserved in the PDF with the same quality and positioning.",
  },
  {
    question: "Can I convert password-protected Word documents?",
    answer: "You'll need to remove the password protection from your Word document before converting. Open the file in Word, remove the password, save it, and then convert to PDF.",
  },
  {
    question: "Will hyperlinks work in the converted PDF?",
    answer: "Yes, all hyperlinks, bookmarks, and internal references from your Word document are preserved as clickable links in the PDF.",
  },
  {
    question: "How long does the conversion take?",
    answer: "Conversion is nearly instant for most documents. Small files convert in 2-3 seconds, while larger files with many images may take 5-10 seconds.",
  },
];