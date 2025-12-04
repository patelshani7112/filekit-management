/**
 * Merge PDF Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Merge PDF page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/organize-manage-pdf/MergePdfPage.tsx
 */

import { 
  Lock, Zap, Shuffle, Upload, Settings, Download,
  FileEdit, Archive, Split, RefreshCw, FileType, FileImage,
  FileMinus, Hash, FileSignature, FileKey, LockOpen, FileCog,
  Image, Video, Music, FileCheck
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Merge PDF",
  description: "Merge PDF files instantly with WorkflowPro's fast and secure PDF combiner. Upload multiple PDFs, reorder pages, and join everything into one clean document — completely free and watermark-free.",
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
    description: "Merge multiple PDFs in seconds. No waiting, no queues, instant results every time.",
  },
  {
    icon: Shuffle,
    title: "Easy Reordering",
    description: "Simply drag and reorder your PDFs before merging. Get them in the exact order you want.",
  },
];

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Select Your PDFs",
    description: "Upload multiple PDF files from your device or drag and drop them into the upload area. Add as many files as you need.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Arrange & Organize",
    description: "Drag and drop to reorder your files in any sequence. Get them in the perfect order before merging.",
    icon: Settings,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Configure Settings",
    description: "Review your file order and make any final adjustments. Everything is ready for the perfect merge.",
    icon: Settings,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Merge & Download",
    description: "Click merge and watch the progress in real-time. Download your combined PDF file instantly when ready.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
  {
    name: "Edit PDF",
    description: "Add text, images, and annotations to your PDF",
    icon: FileEdit,
    href: "/edit-pdf",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality",
    icon: Archive,
    href: "/compress-pdf",
  },
  {
    name: "Split PDF",
    description: "Extract pages from your PDF",
    icon: Split,
    href: "/split-pdf",
  },
  {
    name: "Convert to PDF",
    description: "Convert Word, Excel, PowerPoint, and images to PDF",
    icon: RefreshCw,
    href: "/convert-to-pdf",
  },
  {
    name: "PDF to Word",
    description: "Convert PDF to editable Word document",
    icon: FileType,
    href: "/pdf-to-word",
  },
  {
    name: "PDF to Image",
    description: "Convert PDF pages to JPG or PNG images",
    icon: FileImage,
    href: "/pdf-to-image",
  },
  {
    name: "Rotate PDF",
    description: "Rotate PDF pages to the correct orientation",
    icon: RefreshCw,
    href: "/rotate-pdf",
  },
  {
    name: "Delete PDF Pages",
    description: "Remove unwanted pages from your PDF",
    icon: FileMinus,
    href: "/delete-pdf-pages",
  },
  {
    name: "Add Page Numbers",
    description: "Insert page numbers to your PDF document",
    icon: Hash,
    href: "/add-page-numbers-to-pdf",
  },
  {
    name: "Watermark PDF",
    description: "Add text or image watermark to PDF",
    icon: FileSignature,
    href: "/watermark-pdf",
  },
  {
    name: "Protect PDF",
    description: "Add password protection to your PDF",
    icon: FileKey,
    href: "/protect-pdf",
  },
  {
    name: "Unlock PDF",
    description: "Remove password protection from PDF",
    icon: LockOpen,
    href: "/unlock-pdf",
  },
  {
    name: "Organize PDF",
    description: "Reorder, rotate, and manage PDF pages",
    icon: FileCog,
    href: "/organize-pdf",
  },
  {
    name: "Image to PDF",
    description: "Convert JPG, PNG, and other images to PDF",
    icon: Image,
    href: "/image-to-pdf",
  },
  {
    name: "Sign PDF",
    description: "Add your digital signature to PDF",
    icon: FileSignature,
    href: "/sign-pdf",
  },
  {
    name: "Compress Image",
    description: "Reduce image file size without losing quality",
    icon: Image,
    href: "/compress-image",
  },
  {
    name: "Resize Image",
    description: "Change image dimensions and size",
    icon: Image,
    href: "/resize-image",
  },
  {
    name: "Video Converter",
    description: "Convert video files to different formats",
    icon: Video,
    href: "/video-converter",
  },
  {
    name: "Audio Converter",
    description: "Convert audio files to MP3, WAV, and more",
    icon: Music,
    href: "/audio-converter",
  },
  {
    name: "PDF Validator",
    description: "Check and validate PDF file integrity",
    icon: FileCheck,
    href: "/pdf-validator",
  },
];

/**
 * Use Cases
 */
export const USE_CASES = [
  "Combine scanned pages",
  "Merge contracts and agreements",
  "Join invoices and receipts",
  "Consolidate reports",
  "Merge presentation slides",
  "Combine homework or assignments",
  "Join legal documents",
  "Merge travel itineraries",
  "Consolidate medical records",
  "Combine project documentation",
];

export const USE_CASES_TITLE = "Popular Uses for Merging PDFs";

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  maxFiles: 10,
  maxFileSize: 50, // MB
  acceptedTypes: [".pdf"],
  fileTypeLabel: "PDF",
  helperText: "PDF files only · Up to 10 files · 50MB each",
  minFilesForMerge: 2,
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  maxFilesReached: (max: number) => `Maximum ${max} files allowed. Please remove some files before adding more.`,
  invalidFileType: (count: number) => `Only PDF files are allowed. ${count} invalid file(s) removed.`,
  fileSizeExceeded: (count: number, max: number) => `${count} file(s) exceed ${max}MB limit and were removed.`,
  limitReached: (added: number, max: number, current: number) => `Only ${added} file(s) added. Maximum ${max} files allowed (you have ${current} already).`,
  minFilesNotMet: (min: number) => `Please upload at least ${min} PDF files to merge.`,
  invalidPdfFile: "Failed to read PDF file",
};

/**
 * UI Labels & Buttons
 */
export const UI_LABELS = {
  // Edit Page
  mergeSettings: "Merge Settings",
  outputSettings: "Output Settings",
  fileName: "Filename",
  fileNamePlaceholder: "merged.pdf",
  removeFile: "Remove file",
  
  // Actions
  rotate: "Rotate",
  duplicate: "Duplicate",
  delete: "Delete",
  
  // Success
  successTitle: "PDF Merged Successfully!",
  successDescription: (pageCount: number) => `Your ${pageCount} pages have been combined into one PDF file`,
  
  // Buttons
  mergeAnother: "Merge Another PDF",
  previewTitle: "Merged File Preview",
  
  // Navigation Warning
  navigationWarning: {
    title: "Unsaved Changes",
    description: "You have uploaded files but haven't completed the merge process. If you leave now, your work will be lost.",
    stay: "Stay on Page",
    leave: "Leave Anyway",
  },
  
  // Processing
  processing: {
    title: "Merging PDFs...",
    description: "Combining your PDF files into one document",
  },
  
  // Preview Dialog
  preview: {
    title: "Page Preview",
    description: "View and edit the selected PDF page. You can zoom, rotate, duplicate, or delete this page.",
  },
};

/**
 * SEO Content Sections
 */
export const SEO_CONTENT = {
  definition: {
    title: "What Is a PDF Merger?",
    content: "A PDF Merger lets you combine multiple PDF files into one document. It's used to organize reports, merge receipts, join scanned pages, and create a single professional file. WorkflowPro processes your PDFs quickly and keeps everything private.",
  },
  
  howItWorks: {
    title: "How It Works",
    subtitle: "Merge your PDF files in four simple steps with our intuitive interface",
    introText: "Follow these simple steps to merge your PDF files quickly and securely.",
  },
  
  footer: {
    title: "About WorkflowPro's Merge PDF Tool",
    content: "WorkflowPro's Merge PDF tool helps you combine PDF files quickly and securely. Perfect for contracts, receipts, reports, schoolwork, and more — fast, simple, and always free.",
  },
};

/**
 * FAQ Items
 * Used in: ToolFAQSection component
 */
export const FAQ_ITEMS = [
  {
    question: "How do I merge multiple PDF files?",
    answer: "Upload your PDFs, arrange them, and click Merge.",
  },
  {
    question: "Is there a limit to how many PDFs I can merge?",
    answer: "No — merge unlimited files.",
  },
  {
    question: "Are my files secure?",
    answer: "Yes, they are processed privately and never stored.",
  },
  {
    question: "Can I reorder pages?",
    answer: "Yes — you can reorder, delete, rotate, or move pages.",
  },
  {
    question: "Do I need to install software?",
    answer: "No — works online on all devices.",
  },
  {
    question: "Is WorkflowPro free?",
    answer: "Yes — free to use with no watermarks.",
  },
  {
    question: "What formats are supported?",
    answer: "Only PDF files; use our converters for other formats.",
  },
  {
    question: "Can I merge password-protected PDFs?",
    answer: "Yes, if you provide the correct password.",
  },
];

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have uploaded files that haven't been processed yet. If you leave now, all your work will be lost.";
