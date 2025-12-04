/**
 * Organize PDF Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Organize PDF page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/organize-manage-pdf/OrganizePdfPage.tsx
 */

import { 
  Upload, Settings, Wand2, Download, Merge, Split, Copy, FileMinus,
  RotateCw, Archive, FileEdit, FileText, FileSpreadsheet, FileType,
  Presentation, FileImage, Image, Unlock, Lock, FileSignature, Droplet,
  Hash, Search, FileCog
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Organize PDF Pages",
  description: "Advanced PDF organization tool with 50+ features. Reorder, rotate, delete, duplicate, sort, merge, split and more — all in one place.",
};

/**
 * Upload Configuration
 */
export const UPLOAD_CONFIG = {
  maxFiles: 10,
  maxFileSize: 50, // MB
  acceptedTypes: [".pdf"],
  fileTypeLabel: "PDF",
  helperText: "PDF files only · Up to 10 files · 50MB per file · Organize pages with ease",
};

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Your PDFs",
    description: "Upload up to 10 PDF files at once. Drag and drop or browse from your device.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Organize Pages",
    description: "Use our comprehensive toolbar to reorder, rotate, delete, sort, merge pages and much more.",
    icon: Settings,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Apply Advanced Features",
    description: "Multi-select pages, insert blanks, replace pages, auto-remove blanks, reverse order and more.",
    icon: Wand2,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Export & Download",
    description: "Choose your export format and download your organized PDF instantly. No watermarks.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
  { name: "Merge PDF", description: "Combine multiple PDFs into one", icon: Merge, href: "/merge-pdf" },
  { name: "Split PDF", description: "Split a PDF into smaller files", icon: Split, href: "/split-pdf" },
  { name: "Extract PDF Pages", description: "Extract specific pages from a PDF", icon: Copy, href: "/extract-pdf-pages" },
  { name: "Delete PDF Pages", description: "Remove unwanted pages from a PDF", icon: FileMinus, href: "/delete-pdf-pages" },
  { name: "Rotate PDF", description: "Fix page orientation in your PDF", icon: RotateCw, href: "/rotate-pdf" },
  { name: "Compress PDF", description: "Reduce your PDF file size", icon: Archive, href: "/compress-pdf" },
  { name: "PDF to Word", description: "Convert PDF to editable Word document", icon: FileEdit, href: "/pdf-to-word" },
  { name: "Word to PDF", description: "Convert Word documents to PDF", icon: FileText, href: "/word-to-pdf" },
  { name: "PDF to Excel", description: "Convert PDF to Excel spreadsheet", icon: FileSpreadsheet, href: "/pdf-to-excel" },
  { name: "Excel to PDF", description: "Convert Excel to PDF format", icon: FileType, href: "/excel-to-pdf" },
  { name: "PDF to PPT", description: "Convert PDF to PowerPoint presentation", icon: Presentation, href: "/pdf-to-ppt" },
  { name: "PPT to PDF", description: "Convert PowerPoint to PDF", icon: FileType, href: "/ppt-to-pdf" },
  { name: "PDF to Image", description: "Convert PDF pages to images", icon: FileImage, href: "/pdf-to-image" },
  { name: "Image to PDF", description: "Convert images to PDF document", icon: Image, href: "/image-to-pdf" },
  { name: "Unlock PDF", description: "Remove password from PDF", icon: Unlock, href: "/unlock-pdf" },
  { name: "Protect PDF", description: "Add password protection to PDF", icon: Lock, href: "/protect-pdf" },
  { name: "Sign PDF", description: "Add digital signature to PDF", icon: FileSignature, href: "/sign-pdf" },
  { name: "Watermark PDF", description: "Add watermark to PDF pages", icon: Droplet, href: "/watermark-pdf" },
  { name: "Number PDF Pages", description: "Add page numbers to PDF", icon: Hash, href: "/number-pdf-pages" },
  { name: "OCR PDF", description: "Extract text from scanned PDF", icon: Search, href: "/ocr-pdf" },
];

/**
 * Use Cases
 */
export const USE_CASES_TITLE = "Popular Ways to Use Organize PDF";
export const USE_CASES = [
  "Reorder and reorganize scanned documents",
  "Merge multiple PDFs and organize all pages",
  "Remove blank or duplicate pages automatically",
  "Sort pages by orientation or size",
  "Insert blank pages between sections",
  "Replace damaged or incorrect pages",
  "Extract specific pages into new files",
  "Split documents at specific points",
  "Rotate multiple pages at once",
  "Reverse entire document order",
];

/**
 * SEO Content
 */
export const SEO_CONTENT = {
  definition: {
    title: "What is an Advanced Organize PDF tool?",
    content: "An Advanced Organize PDF tool provides comprehensive control over your PDF documents. Beyond basic reordering, you can multi-select pages, insert blanks, replace pages, sort automatically, remove duplicates, reverse order, merge multiple PDFs, and export in various formats. WorkflowPro's Organize PDF tool combines 50+ features in one seamless interface.",
  },
  howItWorks: {
    title: "How to Organize PDF Pages",
    subtitle: "",
    introText: "",
  },
  footer: {
    title: "About WorkflowPro's Advanced Organize PDF Tool",
    content: "WorkflowPro's Organize PDF tool is the most comprehensive PDF organization solution available online. With 50+ features including multi-select, auto-tools, advanced sorting, page insertion, and more — all completely free and secure. No software installation required. Perfect for professionals, students, and anyone who works with PDF documents regularly.",
  },
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "How many PDF files can I upload?",
    answer: "You can upload up to 10 PDF files at once, with each file up to 50MB in size.",
  },
  {
    question: "Can I select multiple pages at once?",
    answer: "Yes! Use Ctrl+Click to select individual pages or Shift+Click to select a range. You can then apply actions to all selected pages.",
  },
  {
    question: "What advanced features are available?",
    answer: "We offer 50+ features including: multi-select, sort by various criteria, reverse order, insert blank pages, replace pages, auto-remove blanks, merge files, split documents, rotate multiple pages, duplicate pages, and much more.",
  },
  {
    question: "Is this tool really free?",
    answer: "Yes! All features are completely free with no watermarks, no signup required, and unlimited usage.",
  },
  {
    question: "Are my files secure?",
    answer: "Your files are processed securely in your browser and never uploaded to our servers. Complete privacy guaranteed.",
  },
  {
    question: "Can I insert pages from another PDF?",
    answer: "Yes! Use the 'Insert from PDF' feature to add pages from another PDF file at any position.",
  },
];

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have unsaved changes in your PDF organization. Are you sure you want to leave?";

/**
 * UI Labels and Messages
 */
export const UI_LABELS = {
  continueButton: "Continue to Organize",
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  maxFilesExceeded: (max: number) => `Maximum ${max} files allowed. Please remove some files before adding more.`,
  invalidFileType: (count: number) => `Only PDF files are allowed. ${count} invalid file(s) removed.`,
  fileSizeExceeded: (count: number, max: number) => `${count} file(s) exceed ${max}MB limit and were removed.`,
  limitedFilesAdded: (added: number, max: number, current: number) => 
    `Only ${added} file(s) added. Maximum ${max} files allowed (you have ${current} already).`,
};
