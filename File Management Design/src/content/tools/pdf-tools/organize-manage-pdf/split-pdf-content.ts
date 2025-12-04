/**
 * Split PDF Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Split PDF page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/organize-manage-pdf/SplitPdfPage.tsx
 */

import { 
  Upload, Settings, Grid3x3, Download, Lock, Unlock, Merge, Archive,
  RotateCw, FileCog, FileMinus, FileType, FileImage, FileSignature,
  FileEdit, Scissors, Plus, Image, Eye, FileText, Repeat
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Split PDF",
  description: "Split a PDF into multiple smaller files in seconds. Upload your PDF, choose page ranges or specific pages, and download clean, separate documents — free, fast, and secure.",
  subline: "PDF files only • Max 10 files • Max size 50MB per file • No watermarks",
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
    icon: Grid3x3,
    title: "Visual Preview",
    description: "See all pages in a grid view before splitting. Select, organize, and preview exactly what you need.",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Download split PDFs individually or as a single ZIP file. Choose what works best for you.",
  },
];

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Your PDF",
    description: "Drag and drop your PDF into the upload area or select it from your device. You can upload a single file or multiple PDFs.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Choose How to Split",
    description: "Select a split mode: by page range (e.g., 1–3, 4–8), every N pages, or specific page numbers. Preview all pages before confirming.",
    icon: Settings,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Preview Your Ranges",
    description: "Use the visual page grid to confirm which pages will go into each output file. Adjust ranges and selections until it looks perfect.",
    icon: Grid3x3,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Split & Download",
    description: 'Click "Split PDF" to generate your new files. Download each file separately or grab all split PDFs at once.',
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files into one",
    href: "/merge-pdf",
    icon: Merge,
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size",
    href: "/compress-pdf",
    icon: Archive,
  },
  {
    name: "Rotate PDF",
    description: "Rotate PDF pages",
    href: "/rotate-pdf",
    icon: RotateCw,
  },
  {
    name: "Delete PDF Pages",
    description: "Remove unwanted pages",
    href: "/delete-pages",
    icon: FileMinus,
  },
  {
    name: "Organize PDF",
    description: "Reorder and manage pages",
    href: "/organize-pdf",
    icon: FileCog,
  },
  {
    name: "PDF to Word",
    description: "Convert PDF to editable Word",
    href: "/pdf-to-word",
    icon: FileType,
  },
  {
    name: "PDF to Image",
    description: "Convert PDF pages to images",
    href: "/pdf-to-image",
    icon: FileImage,
  },
  {
    name: "Protect PDF",
    description: "Add password to PDF",
    href: "/protect-pdf",
    icon: Lock,
  },
  {
    name: "Unlock PDF",
    description: "Remove password from PDF",
    href: "/unlock-pdf",
    icon: Unlock,
  },
  {
    name: "Sign PDF",
    description: "Add signature to PDF",
    href: "/sign-pdf",
    icon: FileSignature,
  },
  {
    name: "Edit PDF",
    description: "Edit text and images in PDF",
    href: "/edit-pdf",
    icon: FileEdit,
  },
  {
    name: "Extract Pages",
    description: "Extract specific pages from PDF",
    href: "/extract-pages",
    icon: Scissors,
  },
  {
    name: "Add Page Numbers",
    description: "Add page numbers to PDF",
    href: "/add-page-numbers",
    icon: Plus,
  },
  {
    name: "Watermark PDF",
    description: "Add watermark to PDF",
    href: "/watermark-pdf",
    icon: Image,
  },
  {
    name: "PDF Reader",
    description: "View and read PDF files",
    href: "/pdf-reader",
    icon: Eye,
  },
  {
    name: "Word to PDF",
    description: "Convert Word to PDF",
    href: "/word-to-pdf",
    icon: FileText,
  },
  {
    name: "Image to PDF",
    description: "Convert images to PDF",
    href: "/image-to-pdf",
    icon: Image,
  },
  {
    name: "PDF to Excel",
    description: "Convert PDF to Excel",
    href: "/pdf-to-excel",
    icon: FileType,
  },
  {
    name: "PDF to PowerPoint",
    description: "Convert PDF to PPT",
    href: "/pdf-to-ppt",
    icon: FileType,
  },
  {
    name: "Repair PDF",
    description: "Fix corrupted PDF files",
    href: "/repair-pdf",
    icon: Repeat,
  },
];

/**
 * Use Cases
 */
export const USE_CASES = [
  "Extract specific pages from a contract or agreement",
  "Split a large PDF report into separate chapters",
  "Separate grouped invoices into one file per client",
  "Send only the needed pages instead of the full document",
  "Create smaller PDFs that are easier to share or upload",
  "Split scanned PDFs into separate documents for archiving",
];

export const USE_CASES_TITLE = "Common Use Cases for PDF Splitting";

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  accept: ".pdf",
  maxFiles: 10,
  maxFileSize: 50, // MB
  helperText: "PDF files only · Up to 10 files · 50MB each",
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  maxFilesReached: (max: number) => `Maximum ${max} file${max > 1 ? 's' : ''} allowed.`,
  invalidFileType: (count: number) => `${count} file${count > 1 ? 's' : ''} rejected. Only PDF files are supported.`,
  fileSizeExceeded: (count: number, maxSize: number) => `${count} file${count > 1 ? 's' : ''} exceed the ${maxSize}MB size limit.`,
  limitReached: (added: number, max: number, current: number) => `Added ${added} file${added > 1 ? 's' : ''}. Maximum ${max} files allowed (${current + added}/${max}).`,
  invalidPdfFile: "Invalid or corrupted PDF file. Please upload a valid PDF.",
  noFilesSelected: "Please upload at least one PDF file to split.",
  tooManyFiles: (max: number) => `You can only upload up to ${max} files at once.`,
  fileTooLarge: (fileName: string, maxSize: number) => `File "${fileName}" exceeds the ${maxSize}MB size limit.`,
};

/**
 * UI Labels
 */
export const UI_LABELS = {
  // Sidebar
  splitSettings: "Split Settings",
  splitMode: "Split Mode",
  allPages: "All Pages (One per file)",
  pageRanges: "Page Ranges",
  everyNPages: "Every N Pages",
  extractPages: "Extract Specific Pages",
  advancedMode: "Advanced Mode",
  customRanges: "Custom Ranges",
  
  // Split mode descriptions
  allPagesDesc: "Each page becomes a separate file",
  pageRangesDesc: "Define ranges like '1-5, 8-10'",
  everyNDesc: "Split every N pages into files",
  extractDesc: "Select specific pages to extract",
  
  // Settings
  pagesPerFile: "Pages per File",
  outputFileName: "Output File Name",
  fileNamePlaceholder: "split-output",
  outputFormat: "Output Format",
  individualPDFs: "Individual PDFs",
  zipArchive: "ZIP Archive",
  
  // Buttons
  processButton: "Split PDF",
  backToUpload: "Back to Upload",
  splitAnother: "Split Another PDF",
  addMoreFiles: "Add Files",
  removeFile: "Remove file",
  clearAll: "Clear All",
  continueToSplit: "Continue to Split",
  
  // Preview
  previewTitle: "Preview Split PDF",
  selectedPages: "Selected Pages",
  allPagesLabel: "All Pages",
  
  // File info
  totalPages: "Total Pages",
  totalSize: "Total Size",
  outputFiles: "Output Files",
};

/**
 * SEO Content
 */
export const SEO_CONTENT = {
  definition: {
    title: "What Is a PDF Splitter?",
    content: "A PDF splitter is a tool that lets you extract pages from a PDF and save them as new, separate files. It is perfect for sending only part of a document, separating chapters, splitting invoices by client, or breaking down large PDFs into smaller, easier-to-share files.",
  },
  howItWorks: {
    title: "How to Split a PDF",
    subtitle: "Follow these simple steps",
    introText: "Splitting PDFs with WorkflowPro is fast and easy. Here's how it works:",
  },
  footer: {
    title: "About WorkflowPro's Split PDF Tool",
    content: "WorkflowPro's Split PDF tool is designed to make PDF page extraction fast, accurate, and stress-free. Whether you are separating a long contract, splitting chapters of an ebook, or pulling out a few pages from a report, our online PDF splitter helps you create smaller, more focused documents in seconds. Because the tool works directly in your browser, you do not need to install any software or create an account. Simply upload your file, choose how you want to split it, and download your new PDFs. It is the easiest way to split PDF files for school, work, or personal use.",
  },
};

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = {
  title: "Leave this page?",
  message: "You have uploaded files that haven't been processed yet. If you leave now, your progress will be lost.",
  confirmText: "Leave Page",
  cancelText: "Stay on Page",
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "How do I split a PDF into multiple files?",
    answer: "Upload your PDF, choose a split mode (page ranges, every N pages, or specific pages), preview the selection, and click Split PDF. You can then download each new file.",
  },
  {
    question: "Can I split only selected pages from my PDF?",
    answer: "Yes. Use the specific pages mode to pick exact page numbers (for example: 1, 3, 7–10). Only those pages will be included in the output file.",
  },
  {
    question: "Is your Split PDF tool free to use?",
    answer: "Yes. WorkflowPro's Split PDF tool is free to use with no watermarks or registration required.",
  },
  {
    question: "Are my PDF files secure?",
    answer: "Yes. Your PDFs are processed securely and are never publicly shared. This makes the tool safe for personal, school, and business documents.",
  },
  {
    question: "Can I upload multiple PDFs at once?",
    answer: "You can upload and split multiple PDF files, up to 10 at a time. Each file can be processed with its own split settings.",
  },
  {
    question: "Will splitting a PDF reduce the quality?",
    answer: "No. Splitting a PDF only separates the pages; it does not compress or change the content, so the quality stays the same as the original file.",
  },
  {
    question: "Do I need to install any software?",
    answer: "No installation is required. Everything runs in your browser on any device.",
  },
];