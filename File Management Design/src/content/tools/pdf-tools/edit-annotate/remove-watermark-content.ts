/**
 * Remove Watermark PDF - Content Configuration
 * 
 * Purpose: Centralized content for Remove Watermark PDF tool page
 * Used by: /pages/pdf-tools/edit-annotate/RemoveWatermarkPage.tsx
 * 
 * Structure:
 * - Hero content (title, description, subline)
 * - Features list
 * - Why choose content
 * - How it works steps
 * - Related tools
 * - Use cases
 * - FAQ
 * - Definition
 * - SEO Content Sections
 * - UI labels
 * 
 * Related Content Files:
 * - /content/tools/pdf-tools/edit-annotate/watermark-pdf-content.ts (Add Watermark)
 * - /content/tools/pdf-tools/edit-annotate/sign-pdf-content.ts (Sign PDF)
 */

import {
  FileText,
  Upload,
  Droplets,
  Download,
  Shield,
  Zap,
  Eye,
  Lock,
  Clock,
  RefreshCw,
  Edit,
  FileCheck,
} from "lucide-react";

/**
 * Hero Section Content
 */
export const HERO_CONTENT = {
  title: "Remove Watermark from PDF",
  description: "Easily remove watermarks, logos, stamps, and text overlays from your PDF documents. Upload your file, select areas to remove, and download a clean PDF – free, secure, and with no watermarks.",
  subline: "PDF files only • 1 file • Max size 100MB",
};

/**
 * Features List
 */
export const FEATURES = [
  {
    icon: Droplets,
    title: "Remove Any Watermark",
    description: "Remove text, image, or logo watermarks from any PDF document.",
  },
  {
    icon: Eye,
    title: "Visual Selection",
    description: "Click and drag to select watermark areas on each page.",
  },
  {
    icon: FileCheck,
    title: "Large File Support",
    description: "Upload PDF files up to 100MB in size.",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your files are processed securely and automatically deleted after processing.",
  },
  {
    icon: Zap,
    title: "Fast & Easy",
    description: "Remove watermarks in seconds with our simple, intuitive interface.",
  },
  {
    icon: Lock,
    title: "No Signup Required",
    description: "Use all features without creating an account or providing personal information.",
  },
];

/**
 * Why Choose WorkflowPro Content
 */
export const WHY_CHOOSE_CONTENT = {
  title: "Why Choose WorkflowPro for Removing Watermarks?",
  description: "WorkflowPro makes watermark removal simple, fast, and secure.",
  features: [
    {
      icon: Droplets,
      title: "Smart Detection",
      description: "Advanced algorithms help identify common watermark patterns.",
    },
    {
      icon: Eye,
      title: "Precise Control",
      description: "Manually select exactly which areas to remove from your PDF.",
    },
    {
      icon: FileCheck,
      title: "Clean Results",
      description: "Get professional-looking PDFs with watermarks cleanly removed.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your documents are processed locally and never stored on our servers.",
    },
  ],
};

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Your PDF",
    description: "Select a PDF file (up to 100MB) that contains watermarks you want to remove.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Select Watermark Areas",
    description: "Click and drag to select the watermark regions on each page. You can select multiple areas per page.",
    icon: Droplets,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Preview Changes",
    description: "Review your selections and adjust as needed. See which pages will be processed.",
    icon: Eye,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Clean PDF",
    description: "Download your watermark-free PDF instantly. Your original file remains unchanged.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
  {
    name: "Add Watermark",
    description: "Add watermarks to PDFs",
    icon: Droplets,
    href: "/watermark-pdf",
  },
  {
    name: "Redact PDF",
    description: "Permanently redact sensitive information",
    icon: Eye,
    href: "/redact-pdf",
  },
  {
    name: "Edit PDF",
    description: "Edit text and images in PDFs",
    icon: Edit,
    href: "/edit-pdf",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size",
    icon: RefreshCw,
    href: "/compress-pdf",
  },
];

/**
 * Use Cases
 */
export const USE_CASES_TITLE = "When to Remove Watermarks from PDFs";

export const USE_CASES = [
  "Remove draft watermarks from finalized documents",
  "Clean up confidential stamps after document approval",
  "Remove old company watermarks when rebranding",
  "Clean marketing materials for reprinting",
  "Remove digital watermarks before printing",
  "Clean templates for reuse across projects",
  "Remove outdated logos from legacy documents",
  "Clean scanned documents with unwanted marks",
];

/**
 * FAQ
 */
export const FAQ_ITEMS = [
  {
    question: "Is it legal to remove watermarks from PDFs?",
    answer: "You should only remove watermarks from PDFs that you own or have permission to modify. Removing watermarks from copyrighted material without permission may violate copyright laws. Always ensure you have the legal right to modify the documents.",
  },
  {
    question: "Will removing watermarks affect PDF quality?",
    answer: "Our tool carefully removes selected areas while preserving the rest of your document's quality. However, if the watermark overlaps important content, that content may be affected. Always preview your results before downloading.",
  },
  {
    question: "Can I remove watermarks from multiple pages at once?",
    answer: "Yes! You can select watermark areas on any page, and our tool will process all selected areas across your entire PDF document.",
  },
  {
    question: "What types of watermarks can be removed?",
    answer: "Our tool can remove text watermarks, image watermarks, logos, stamps, and overlay graphics. You manually select the areas to remove, giving you precise control over what gets removed.",
  },
  {
    question: "Is my PDF secure when removing watermarks?",
    answer: "Absolutely. Your files are processed securely in your browser using client-side technology. We never store your files on our servers, and they're automatically deleted after processing.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No! You can remove watermarks from PDFs without creating an account, signing up, or providing any personal information. Just upload your file and start removing watermarks.",
  },
  {
    question: "Can I undo a watermark removal?",
    answer: "During the editing process, you can deselect areas before processing. Once you download the processed PDF, the watermark removal is permanent in that file. Your original file remains unchanged, so you can always start over if needed.",
  },
  {
    question: "What's the maximum file size?",
    answer: "You can upload PDF files up to 100MB in size.",
  },
];

/**
 * Definition Section
 */
export const DEFINITION = {
  term: "PDF Watermark Removal",
  definition: "PDF watermark removal is the process of eliminating text, images, logos, or other overlay elements that have been added to a PDF document. Watermarks are typically used to indicate draft status, ownership, or confidentiality, and removing them is necessary when finalizing documents or repurposing content you own.",
};

/**
 * SEO Content Sections
 */
export const SEO_CONTENT = {
  definition: {
    title: "What is PDF Watermark Removal?",
    content: "PDF watermark removal is the process of eliminating unwanted text, images, logos, stamps, or overlay elements from PDF documents. Watermarks are often added to indicate draft status, ownership, copyright, or confidentiality. WorkflowPro's Remove Watermark tool lets you precisely select and remove these elements, giving you clean, professional PDFs ready for distribution, printing, or archiving.",
  },
  
  howItWorks: {
    title: "How It Works",
    subtitle: "Remove watermarks from your PDFs in four simple steps",
    introText: "Follow these simple steps to remove watermarks from your PDF files quickly and securely.",
  },
  
  footer: {
    title: "About WorkflowPro's Remove Watermark Tool",
    content: "WorkflowPro's Remove Watermark from PDF tool helps you eliminate unwanted watermarks, logos, stamps, and text overlays from your PDF documents. Perfect for cleaning up draft documents, removing trial watermarks, and preparing professional PDFs — fast, secure, and always free.",
  },
};

/**
 * UI Labels
 */
export const UI_LABELS = {
  // Sidebar
  removalSettings: "Removal Settings",
  sourceFile: "Source File",
  sourceFiles: "Source Files",
  removeFile: "Remove file",
  
  // Selection Mode
  selectionMode: "Selection Mode",
  clickAndDrag: "Click and drag to select watermark areas",
  
  // Watermark Areas
  watermarkAreas: "Selected Areas",
  noAreasSelected: "No areas selected yet",
  areasOnPage: "area(s) on this page",
  clearAllAreas: "Clear All",
  
  // Page Selection
  applyToPages: "Apply Removal To",
  currentPageOnly: "Current page only",
  allPages: "All pages in document",
  pageRange: "Page range",
  
  // Processing
  removeWatermarks: "Remove Watermarks",
  processing: "Removing Watermarks...",
  
  // Preview
  previewMode: "Preview Mode",
  showOriginal: "Show Original",
  showPreview: "Show Preview",
  
  // Instructions
  instructions: "How to Use",
  step1: "Click and drag on the PDF to select watermark areas",
  step2: "Multiple areas can be selected per page",
  step3: "Choose which pages to apply removal to",
  step4: "Click 'Remove Watermarks' to process",
};

/**
 * Upload Config
 */
export const UPLOAD_CONFIG = {
  maxFiles: 1,
  maxFileSize: 100, // MB
  acceptedTypes: [".pdf"],
  fileTypeLabel: "PDF",
  helperText: "PDF files only · 1 file · 100MB max",
  allowMultiple: false,
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  noFile: "Please upload a PDF file",
  tooManyFiles: "Only 1 file allowed at a time",
  fileTooLarge: "File size must be less than 100MB",
  invalidFileType: "Only PDF files are supported",
  noAreasSelected: "Please select at least one area to remove",
  maxFilesReached: (max: number) => `Maximum ${max} file allowed. Please remove the file before adding a new one.`,
  invalidFileType: (count: number) => `Only PDF files are allowed. ${count} invalid file(s) removed.`,
  fileSizeExceeded: (count: number, max: number) => `${count} file(s) exceed ${max}MB limit and were removed.`,
};