/**
 * Add Page Numbers Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Add Page Numbers page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/edit-annotate/AddPageNumbersPage.tsx
 */

import { 
  Lock, Zap, Hash, Upload, Settings, Download,
  FileEdit, Archive, Split, RefreshCw, FileType, FileImage,
  FileMinus, FileSignature, FileKey, LockOpen, FileCog,
  Image, Video, Music, FileCheck, Droplets, FileText,
  RotateCw, Crop, GripVertical, Shield, Layers
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Add Page Numbers",
  description: "Add professional page numbers to your PDF documents instantly. Choose from multiple formats (1, 2, 3 or i, ii, iii), customize position, font, and styling — completely free and watermark-free.",
};

/**
 * Feature Highlights
 */
export const FEATURES = [
  {
    icon: Lock,
    title: "100% Secure",
    description: "Your files are processed locally in your browser. No upload to servers, complete privacy guaranteed.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Add page numbers to multiple PDFs in seconds. No waiting, no queues, instant results every time.",
  },
  {
    icon: Hash,
    title: "Custom Formats",
    description: "Choose from Arabic numerals, Roman numerals, or alphabetic page numbers with custom positioning.",
  },
];

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload PDFs",
    description: "Select one or more PDF files you want to add page numbers to. Drag and drop or click to browse your files.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Configure Numbers",
    description: "Choose position, format (1/i/I/a/A), starting number, font size, color, and add optional prefix/suffix text.",
    icon: Hash,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Preview & Adjust",
    description: "See real-time preview of page numbers on all pages. Make adjustments until everything looks perfect.",
    icon: Settings,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download",
    description: "Click to add page numbers and download your professionally numbered PDF files instantly.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
  {
    name: "Watermark PDF",
    description: "Add text or image watermarks",
    icon: Droplets,
    href: "/watermark-pdf",
  },
  {
    name: "Edit PDF",
    description: "Add text, images, and annotations",
    icon: FileEdit,
    href: "/edit-pdf",
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs",
    icon: FileText,
    href: "/merge-pdf",
  },
  {
    name: "Split PDF",
    description: "Extract pages from PDF",
    icon: Split,
    href: "/split-pdf",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size",
    icon: Archive,
    href: "/compress-pdf",
  },
  {
    name: "Rotate PDF",
    description: "Rotate PDF pages",
    icon: RotateCw,
    href: "/rotate-pdf",
  },
  {
    name: "Crop PDF",
    description: "Crop PDF pages",
    icon: Crop,
    href: "/crop-pdf",
  },
  {
    name: "Organize PDF",
    description: "Reorder PDF pages",
    icon: GripVertical,
    href: "/organize-pdf",
  },
  {
    name: "Delete PDF Pages",
    description: "Remove unwanted pages",
    icon: FileMinus,
    href: "/delete-pdf-pages",
  },
  {
    name: "Sign PDF",
    description: "Add digital signatures",
    icon: FileSignature,
    href: "/sign-pdf",
  },
  {
    name: "Protect PDF",
    description: "Add password protection",
    icon: FileKey,
    href: "/protect-pdf",
  },
  {
    name: "Unlock PDF",
    description: "Remove PDF passwords",
    icon: LockOpen,
    href: "/unlock-pdf",
  },
  {
    name: "PDF to Word",
    description: "Convert PDF to Word",
    icon: FileType,
    href: "/pdf-to-word",
  },
  {
    name: "Word to PDF",
    description: "Convert Word to PDF",
    icon: FileType,
    href: "/word-to-pdf",
  },
  {
    name: "PDF to JPG",
    description: "Convert PDF to images",
    icon: FileImage,
    href: "/pdf-to-jpg",
  },
  {
    name: "JPG to PDF",
    description: "Convert images to PDF",
    icon: Image,
    href: "/jpg-to-pdf",
  },
  {
    name: "Redact PDF",
    description: "Redact sensitive content",
    icon: Shield,
    href: "/redact-pdf",
  },
  {
    name: "Flatten PDF",
    description: "Flatten PDF layers",
    icon: Layers,
    href: "/flatten-pdf",
  },
];

/**
 * Use Cases
 */
export const USE_CASES = [
  "Add page numbers to research papers, theses, and dissertations for easy citation",
  "Number corporate reports and presentations for professional documentation",
  "Add navigation-friendly page numbers to ebooks and instruction manuals",
  "Number presentation handouts for audience reference during meetings",
  "Create indexed documents for legal and compliance requirements",
  "Add page numbers to academic textbooks and educational materials",
  "Number technical documentation and user manuals for easy navigation",
  "Professional formatting for business proposals and contracts",
];

export const USE_CASES_TITLE = "Popular Uses for Adding Page Numbers";

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  maxFiles: 10,
  maxFileSize: 50, // MB
  acceptedTypes: [".pdf"],
  fileTypeLabel: "PDF",
  helperText: "PDF files only · Up to 10 files · 50MB each",
  minFilesRequired: 1,
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  maxFilesReached: (max: number) => `Maximum ${max} files allowed. Please remove some files before adding more.`,
  invalidFileType: (count: number) => `Only PDF files are allowed. ${count} invalid file(s) removed.`,
  fileSizeExceeded: (count: number, max: number) => `${count} file(s) exceed ${max}MB limit and were removed.`,
  limitReached: (added: number, max: number, current: number) => `Only ${added} file(s) added. Maximum ${max} files allowed (you have ${current} already).`,
  invalidPdfFile: "Failed to read PDF file",
};

/**
 * UI Labels & Buttons
 */
export const UI_LABELS = {
  // Edit Page
  pageNumberSettings: "Page Number Settings",
  sourceFiles: "Source Files",
  outputSettings: "Output Settings",
  fileName: "Filename",
  fileNamePlaceholder: "numbered.pdf",
  removeFile: "Remove file",
  addFiles: "Add Files",
  
  // Page Number Settings
  position: "Position",
  format: "Format",
  startingNumber: "Starting Number",
  prefix: "Prefix",
  suffix: "Suffix",
  fontSettings: "Font Settings",
  font: "Font",
  fontSize: "Font Size",
  color: "Color",
  
  // Position Options
  positions: {
    "top-left": "Top Left",
    "top-center": "Top Center",
    "top-right": "Top Right",
    "bottom-left": "Bottom Left",
    "bottom-center": "Bottom Center",
    "bottom-right": "Bottom Right",
  },
  
  // Format Options
  formats: {
    "1": "1, 2, 3... (Arabic)",
    "i": "i, ii, iii... (Roman lowercase)",
    "I": "I, II, III... (Roman uppercase)",
    "a": "a, b, c... (Alphabetic lowercase)",
    "A": "A, B, C... (Alphabetic uppercase)",
  },
  
  // Actions
  continueToEdit: "Continue to Add Numbers",
  
  // Success
  successTitle: "Page Numbers Added!",
  successDescription: "Your PDFs now have professional page numbers",
  
  // Buttons
  addPageNumbers: "Add Page Numbers",
  numberAnother: "Number Another PDF",
  
  // Processing
  processing: {
    title: "Adding Page Numbers...",
    description: "Processing your PDFs with custom page numbers",
  },
};

/**
 * SEO Content Sections
 */
export const SEO_CONTENT = {
  definition: {
    title: "What are PDF Page Numbers?",
    content: "PDF page numbers are sequential identifiers added to each page of a PDF document to help readers navigate and reference specific pages. With WorkflowPro's Add Page Numbers tool, you can automatically add customized page numbers in various formats (Arabic, Roman numerals, alphabetic) and positions (top, bottom, left, right, center) to your PDF files. Perfect for academic papers, business reports, ebooks, manuals, and any document that needs professional pagination.",
  },
  
  howItWorks: {
    title: "How It Works",
    subtitle: "Add page numbers to your PDFs in four simple steps",
    introText: "Follow these simple steps to add professional page numbers to your PDF files quickly and securely.",
  },
  
  footer: {
    title: "About WorkflowPro's Add Page Numbers Tool",
    content: "WorkflowPro's Add Page Numbers tool helps you add professional page numbers to PDF files quickly and securely. Choose from multiple formats, customize positioning and styling, and download your numbered PDFs instantly — fast, simple, and always free.",
  },
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "Why add page numbers to PDFs?",
    answer: "Page numbers help readers navigate documents, make it easier to reference specific pages, and give your PDFs a professional appearance. They're essential for reports, manuals, ebooks, and academic papers.",
  },
  {
    question: "What page number formats are supported?",
    answer: "We support multiple formats including Arabic numerals (1, 2, 3), Roman numerals (i, ii, iii or I, II, III), and alphabetic (a, b, c or A, B, C).",
  },
  {
    question: "Can I choose where page numbers appear?",
    answer: "Yes! You can position page numbers in six locations: top-left, top-center, top-right, bottom-left, bottom-center, or bottom-right.",
  },
  {
    question: "Can I start numbering from a specific page?",
    answer: "Yes, you can set a custom starting number. For example, if you want to start from page 5, just set the starting number to 5.",
  },
  {
    question: "Will this modify my original PDF?",
    answer: "No, we create a new PDF with page numbers added. Your original file remains untouched.",
  },
  {
    question: "Can I add page numbers to large PDFs?",
    answer: "Yes, files up to 50MB are supported, which covers most documents including books and lengthy reports.",
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes! WorkflowPro's Add Page Numbers tool is completely free with no hidden charges.",
  },
  {
    question: "Are my files safe?",
    answer: "Absolutely! All processing happens locally in your browser. Your PDF never leaves your device.",
  },
];

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have uploaded files that haven't been processed yet. If you leave now, all your work will be lost.";
