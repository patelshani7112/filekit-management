/**
 * Delete PDF Pages Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Delete PDF Pages page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/organize-manage-pdf/DeletePdfPagesPage.tsx
 */

import { 
  Upload, Trash2, FileSearch, Download,
  Scissors, Merge, Archive, RotateCw, FileCog,
  FileType, FileImage, Lock, Unlock, FileEdit, FileSignature
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Delete PDF Pages",
  description: "Remove unwanted pages from your PDF in seconds. Upload your file, select the pages you want to delete, and download a clean, optimized PDF – free, secure, and with no watermarks.",
  subline: "PDF files only • Max 10 files • Max size 50MB per file • Delete pages in bulk",
};

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Your PDF",
    description: "Drag and drop your PDF file or select it from your device. We support PDF files up to 50 MB.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Select Pages to Delete",
    description: "View all pages as thumbnails. Click to select one or many pages you want to remove from the document.",
    icon: Trash2,
    iconBgColor: "from-red-400 to-red-500",
  },
  {
    number: 3,
    title: "Review & Confirm",
    description: "Preview your pages, undo selections, and make sure only the pages you don't need are marked for deletion.",
    icon: FileSearch,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Clean PDF",
    description: "Click Delete Pages & Download to get a new PDF without the removed pages — ready to share, print, or archive.",
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
    description: "Extract pages into separate PDF files",
    icon: Scissors,
    href: "/split-pdf",
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files into one",
    icon: Merge,
    href: "/merge-pdf",
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
    name: "Organize PDF",
    description: "Reorder and manage pages",
    icon: FileCog,
    href: "/organize-pdf",
  },
  {
    name: "PDF to Word",
    description: "Convert PDF to editable Word",
    icon: FileType,
    href: "/pdf-to-word",
  },
  {
    name: "PDF to Image",
    description: "Convert PDF pages to images",
    icon: FileImage,
    href: "/pdf-to-image",
  },
  {
    name: "Sign PDF",
    description: "Add signature to PDF",
    icon: FileSignature,
    href: "/sign-pdf",
  },
  {
    name: "Protect PDF",
    description: "Add password to PDF",
    icon: Lock,
    href: "/protect-pdf",
  },
  {
    name: "Unlock PDF",
    description: "Remove password from PDF",
    icon: Unlock,
    href: "/unlock-pdf",
  },
  {
    name: "Edit PDF",
    description: "Edit text and images in PDF",
    icon: FileEdit,
    href: "/edit-pdf",
  },
  {
    name: "Extract Pages",
    description: "Extract specific pages from PDF",
    icon: Scissors,
    href: "/extract-pdf-pages",
  },
];

/**
 * Use Cases
 */
export const USE_CASES = [
  "Remove blank or duplicate pages from scanned documents",
  "Delete cover pages, intros, or ad pages from reports",
  "Trim long PDFs before emailing them",
  "Clean up invoices, receipts, or statements",
  "Remove pages with outdated or sensitive information",
  "Prepare a shorter version of a document for clients or students",
];

export const USE_CASES_TITLE = "Popular Uses for Deleting PDF Pages";

/**
 * SEO Content Sections
 */
export const SEO_CONTENT = {
  definition: {
    title: "What Is a Delete PDF Pages Tool?",
    content: "A Delete PDF Pages tool lets you remove unwanted pages from your PDF file without needing expensive or complex software. It is perfect for cleaning up scanned PDFs, removing blank or duplicate pages, cutting off cover pages, or trimming long documents so they are easier to share and read.",
  },
  
  howItWorks: {
    title: "How to Delete PDF Pages",
    subtitle: "Follow these simple steps",
    introText: "Deleting PDF pages with WorkflowPro is fast and easy. Here's how it works:",
  },
  
  footer: {
    title: "About WorkflowPro's Delete PDF Pages Tool",
    content: "WorkflowPro's Delete PDF Pages tool makes it easy to clean up your documents. Whether you are removing blank pages, duplicate pages, or content you no longer need, our online tool helps you create a smaller, more professional PDF in just a few clicks. Use it for school work, business documents, client reports, invoices, and more – without installing any software and without leaving your browser.",
  },
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "How do I delete pages from a PDF?",
    answer: "Upload your PDF, select the pages you want to remove, and click Delete Pages & Download. We create a new PDF without those pages.",
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes, WorkflowPro lets you delete pages from your PDF for free with no signup and no watermarks added to your file.",
  },
  {
    question: "Are my files safe and private?",
    answer: "Yes. Your files are processed securely, and we do not permanently store your documents. You stay in control of your data.",
  },
  {
    question: "Can I delete multiple pages at once?",
    answer: "Absolutely. You can select multiple pages and delete them in a single click, instead of removing pages one by one.",
  },
  {
    question: "Can I undo if I select the wrong page?",
    answer: "Yes. Before downloading, you can unselect pages or reload your original PDF and start again.",
  },
  {
    question: "Do I need to install any software?",
    answer: "No. The Delete PDF Pages tool runs in your browser on desktop, laptop, tablet, or phone.",
  },
];

/**
 * UI Labels & Buttons
 */
export const UI_LABELS = {
  // Settings Sidebar
  deleteSettings: "Delete Pages Settings",
  sourceFiles: "Source Files",
  outputSettings: "Output Settings",
  fileName: "Filename",
  fileNamePlaceholder: "cleaned.pdf",
  mergeAfterDeletion: "Merge all files into one PDF",
  mergeHelpText: "Combine all files after deleting pages",
  
  // Info Text
  instructionTitle: "Click on pages to select them for bulk deletion, or use the action buttons on each page card to rotate, duplicate, or delete individual pages.",
  pagesTotal: "pages total",
  
  // Actions
  rotate: "Rotate",
  duplicate: "Duplicate",
  delete: "Delete",
  preview: "Preview",
  
  // Success
  successTitle: "PDF Pages Deleted Successfully!",
  successDescription: "Your cleaned PDF is ready for download",
  
  // Buttons
  processButton: "Process PDF",
  deleteAnother: "Delete Pages from Another PDF",
  
  // Security badges
  securityBadges: [
    "✓ 100% Secure & Private",
    "✓ No Watermarks",
    "✓ Unlimited Usage",
  ],
  
  // Navigation Warning
  navigationWarning: {
    title: "Unsaved Changes",
    description: "You have uploaded files but haven't completed the deletion process. If you leave now, your work will be lost.",
    stay: "Stay on Page",
    leave: "Leave Anyway",
  },
  
  // Processing
  processing: {
    title: "Deleting Pages...",
    description: "Removing selected pages from your PDF",
  },
  
  // Preview Dialog
  preview: {
    title: "Page Preview",
    description: "View the selected PDF page in detail",
  },
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
  noPagesSelected: "Please select at least one page to delete",
  allPagesSelected: "Cannot delete all pages. At least one page must remain",
  invalidPdfFile: "Failed to read PDF file",
};

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have uploaded files that haven't been processed yet. If you leave now, all your work will be lost.";
