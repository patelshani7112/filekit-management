/**
 * Extract PDF Pages Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Extract PDF Pages page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/organize-manage-pdf/ExtractPdfPagesPage.tsx
 */

import {
  Upload, Download, Copy, FileType, Split, Merge, FileMinus, RotateCw,
  Archive, FileCog, FileEdit, FileSignature, Lock, Unlock, FileText,
  FileImage, FileSpreadsheet, Presentation, Image, Search, BookOpen
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Extract PDF Pages",
  description: "Quickly extract specific pages from any PDF file. Select single pages or page ranges and save them as a new, clean PDF — free, fast, and with no watermarks.",
};

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload your PDF",
    description: "Drag and drop your PDF or browse from your device. We support standard PDF files up to 100MB with full page previews.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Select the pages",
    description: "Click page thumbnails to select them or type page ranges like \"1–3, 5, 10–12\". You can also choose odd, even, or custom pages.",
    icon: Copy,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Choose output format",
    description: "Save all selected pages in one PDF or export each page or range as separate files. Rename the output to keep your documents organized.",
    icon: FileType,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Extract and download",
    description: "Click \"Extract Pages\" and download your new PDF instantly. No sign-up, no watermark, and your files stay secure and private.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
  {
    name: "Split PDF",
    description: "Split a PDF into smaller files",
    icon: Split,
    href: "/split-pdf",
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into one",
    icon: Merge,
    href: "/merge-pdf",
  },
  {
    name: "Delete PDF Pages",
    description: "Remove unwanted pages from a PDF",
    icon: FileMinus,
    href: "/delete-pdf-pages",
  },
  {
    name: "Rotate PDF",
    description: "Fix page orientation in your PDF",
    icon: RotateCw,
    href: "/rotate-pdf",
  },
  {
    name: "Compress PDF",
    description: "Reduce your PDF file size",
    icon: Archive,
    href: "/compress-pdf",
  },
  {
    name: "Organize PDF",
    description: "Reorder and manage PDF pages",
    icon: FileCog,
    href: "/organize-pdf",
  },
  {
    name: "Edit PDF",
    description: "Add text, images, and annotations",
    icon: FileEdit,
    href: "/edit-pdf",
  },
  {
    name: "Sign PDF",
    description: "Add digital signatures to PDFs",
    icon: FileSignature,
    href: "/sign-pdf",
  },
  {
    name: "Protect PDF",
    description: "Add password protection to PDFs",
    icon: Lock,
    href: "/protect-pdf",
  },
  {
    name: "Unlock PDF",
    description: "Remove password from PDFs",
    icon: Unlock,
    href: "/unlock-pdf",
  },
  {
    name: "PDF to Word",
    description: "Convert PDF to editable Word documents",
    icon: FileText,
    href: "/pdf-to-word",
  },
  {
    name: "PDF to JPG",
    description: "Convert PDF pages to JPG images",
    icon: FileImage,
    href: "/pdf-to-jpg",
  },
  {
    name: "PDF to Excel",
    description: "Convert PDF tables to Excel",
    icon: FileSpreadsheet,
    href: "/pdf-to-excel",
  },
  {
    name: "PDF to PPT",
    description: "Convert PDF to PowerPoint slides",
    icon: Presentation,
    href: "/pdf-to-ppt",
  },
  {
    name: "Word to PDF",
    description: "Convert Word documents to PDF",
    icon: FileType,
    href: "/word-to-pdf",
  },
  {
    name: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF",
    icon: FileSpreadsheet,
    href: "/excel-to-pdf",
  },
  {
    name: "PPT to PDF",
    description: "Convert PowerPoint to PDF",
    icon: Presentation,
    href: "/ppt-to-pdf",
  },
  {
    name: "JPG to PDF",
    description: "Convert images to PDF documents",
    icon: Image,
    href: "/jpg-to-pdf",
  },
  {
    name: "OCR PDF",
    description: "Extract text from scanned PDFs",
    icon: Search,
    href: "/ocr-pdf",
  },
  {
    name: "Read PDF",
    description: "View and read PDF files online",
    icon: BookOpen,
    href: "/read-pdf",
  },
];

/**
 * Use Cases
 */
export const USE_CASES_TITLE = "Popular Ways to Use Extract PDF Pages";
export const USE_CASES = [
  "Extract signed pages from contracts",
  "Save key chapters from long reports",
  "Pull invoices from monthly PDF statements",
  "Create a smaller PDF with only important pages",
  "Extract diagrams, charts, or reference pages",
  "Save form or application pages separately",
];

/**
 * SEO Content (Definition & Footer)
 */
export const SEO_CONTENT = {
  definition: {
    title: "What is an Extract PDF Pages tool?",
    content: "An Extract PDF Pages tool lets you choose specific pages from a PDF and save them as a new document. It's ideal for pulling out chapters, invoices, signed pages, forms, or any section you need without sharing or printing the whole file. WorkflowPro makes this quick, secure, and completely watermark-free.",
  },
  howItWorks: {
    title: "How It Works",
    subtitle: "Extract PDF pages in four simple steps with our intuitive interface",
    introText: "Follow these simple steps to extract your PDF pages quickly and securely.",
  },
  footer: {
    title: "About WorkflowPro's Extract PDF Pages tool",
    content: "WorkflowPro's Extract PDF Pages tool helps you save only the pages you actually need from any PDF. Ideal for business documents, contracts, reports, schoolwork, and invoices, this free online tool runs in your browser with no software to install, no signup, and no watermarks. Extract pages quickly, keep your files secure, and stay in control of your documents.",
  },
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "How do I extract pages from a PDF?",
    answer: "Upload your PDF, select the pages you need by clicking thumbnails or entering page ranges, then click \"Extract Pages\". We generate a new PDF that contains only those pages.",
  },
  {
    question: "Is this Extract PDF Pages tool free?",
    answer: "Yes. WorkflowPro's Extract PDF Pages tool is free to use, with no watermarks, no signup required, and no hidden fees.",
  },
  {
    question: "Can I extract pages as separate files?",
    answer: "Yes. You can save all selected pages in a single PDF or export each page or page range as separate files, depending on the options you choose.",
  },
  {
    question: "Are my PDF files safe and private?",
    answer: "Your files are handled securely and are never shared. Processing can be done directly in your browser so your PDFs stay private on your device.",
  },
  {
    question: "Can I extract pages from multiple PDFs?",
    answer: "This tool extracts pages from one PDF at a time. For multiple files, use Extract on each PDF or combine them first with our Merge PDF tool.",
  },
  {
    question: "What is the maximum PDF file size?",
    answer: "You can upload PDF files up to 100MB. For very large documents, compress the PDF first and then extract the pages you need.",
  },
  {
    question: "Do extracted PDFs have watermarks?",
    answer: "No. All extracted PDFs are clean and watermark-free, suitable for business, school, or personal use.",
  },
  {
    question: "Can I select non-consecutive pages?",
    answer: "Yes. You can select any combination of pages, like 2, 4, 7–9, and 11. Non-consecutive page selection is fully supported.",
  },
];

/**
 * UI Labels & Messages
 */
export const UI_LABELS = {
  // Button Labels
  uploadButton: "Choose Files",
  extractButton: "Extract Pages",
  downloadButton: "Download PDF",
  resetButton: "Extract From Another PDF",
  backButton: "Back to Upload",
  
  // Section Titles
  extractSettings: "Extract Settings",
  sourceFiles: "Source Files",
  pageSelection: "Page Selection",
  outputOptions: "Output Options",
  
  // Instructions
  selectPagesInstruction: "Click on pages to select them for extraction, or use the selection tools below to choose specific pages.",
  multipleSelectionHint: "Hold Shift and click to select multiple consecutive pages",
  
  // Selection Modes
  visualMode: "Visual Selection",
  rangeMode: "Page Range",
  listMode: "Page List",
  patternMode: "Pattern",
  
  // Definition Section (for ToolDefinitionSection component)
  definitionTitle: "What is an Extract PDF Pages tool?",
  definitionText: "An Extract PDF Pages tool lets you choose specific pages from a PDF and save them as a new document. It's ideal for pulling out chapters, invoices, signed pages, forms, or any section you need without sharing or printing the whole file. WorkflowPro makes this quick, secure, and completely watermark-free.",
};

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  maxFiles: 10,
  maxFileSize: 50, // MB
  acceptedTypes: [".pdf"],
  fileTypeLabel: "PDF",
  helperText: "PDF files only · Up to 10 files · 50MB each",
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  maxFilesExceeded: (max: number) => `Maximum ${max} files allowed. Please remove some files before adding more.`,
  invalidFileType: (count: number) => `Only PDF, DOCX, PPT, and image files are allowed. ${count} invalid file(s) removed.`,
  fileSizeExceeded: (count: number, max: number) => `${count} file(s) exceed ${max}MB limit and were removed.`,
  filesLimitReached: (added: number, max: number, current: number) => 
    `Only ${added} file(s) added. Maximum ${max} files allowed (you have ${current} already).`,
};

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have unsaved work. Are you sure you want to leave?";