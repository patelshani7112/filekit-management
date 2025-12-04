/**
 * Redact PDF Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Redact PDF page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/edit-annotate/RedactPdfPage.tsx
 */

import { 
  Lock, Zap, Shield, Upload, Settings, Download,
  FileEdit, Archive, Split, RefreshCw, FileType, FileImage,
  FileMinus, Hash, FileSignature, FileKey, LockOpen, FileCog,
  Image, Video, Music, FileCheck, FileText, Droplets, GripVertical,
  RotateCw
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Redact PDF",
  description: "Permanently remove sensitive information from your PDFs with WorkflowPro's secure redaction tool. Black out confidential text, numbers, images, or entire sections — completely free and privacy-focused.",
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
    description: "Redact sensitive content in seconds. No waiting, no queues, instant results every time.",
  },
  {
    icon: Shield,
    title: "Permanent Removal",
    description: "Redacted content is permanently removed from the PDF, not just covered up. Truly secure redaction.",
  },
];

/**
 * Why Choose WorkflowPro - Custom for Redact PDF
 */
export const WHY_CHOOSE_CONTENT = {
  title: "Why Choose WorkflowPro?",
  subtitle: "The most powerful and user-friendly PDF redaction tool available online",
  introText: "WorkflowPro delivers fast, private, and secure PDF redaction trusted by legal professionals, government agencies, and businesses. No signup required.",
};

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Your PDF",
    description: "Select the PDF file containing sensitive information from your device or drag and drop it into the upload area.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Mark Areas to Redact",
    description: "Click and drag to draw black boxes over sensitive text, images, or information you want to permanently remove.",
    icon: Settings,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Review Redactions",
    description: "Review all marked areas across all pages. Add or remove redaction boxes as needed before finalizing.",
    icon: Shield,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Redacted PDF",
    description: "Click to permanently apply redactions and download your secured PDF with sensitive content removed.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
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
    name: "Edit PDF",
    description: "Add text, images, and annotations to your PDF",
    icon: FileEdit,
    href: "/edit-pdf",
  },
  {
    name: "Watermark PDF",
    description: "Add text or image watermark to PDF",
    icon: Droplets,
    href: "/watermark-pdf",
  },
  {
    name: "Sign PDF",
    description: "Add your digital signature to PDF",
    icon: FileSignature,
    href: "/sign-pdf",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality",
    icon: Archive,
    href: "/compress-pdf",
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into one",
    icon: FileText,
    href: "/merge-pdf",
  },
  {
    name: "Split PDF",
    description: "Extract pages from your PDF",
    icon: Split,
    href: "/split-pdf",
  },
  {
    name: "Delete PDF Pages",
    description: "Remove unwanted pages from your PDF",
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
    name: "Organize PDF",
    description: "Reorder, rotate, and manage PDF pages",
    icon: GripVertical,
    href: "/organize-pdf",
  },
  {
    name: "Add Page Numbers",
    description: "Insert page numbers to your PDF document",
    icon: Hash,
    href: "/add-page-numbers-to-pdf",
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
    name: "Image to PDF",
    description: "Convert JPG, PNG, and other images to PDF",
    icon: Image,
    href: "/image-to-pdf",
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
  "Remove social security numbers from documents",
  "Redact personal information in legal documents",
  "Black out confidential data in contracts",
  "Protect privacy in medical records",
  "Remove sensitive financial information",
  "Redact names and addresses from forms",
  "Secure classified government documents",
  "Remove proprietary information from reports",
];

export const USE_CASES_TITLE = "Popular Uses for PDF Redaction";

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  maxFiles: 1,
  maxFileSize: 50, // MB
  acceptedTypes: [".pdf"],
  fileTypeLabel: "PDF",
  helperText: "PDF files only · 1 file · 50MB max",
  minFilesRequired: 1,
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  maxFilesReached: (max: number) => `Maximum ${max} file allowed. Please remove the current file before adding another.`,
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
  redactionSettings: "Redaction Settings",
  sourceFile: "Source File",
  outputSettings: "Output Settings",
  fileName: "Filename",
  fileNamePlaceholder: "redacted.pdf",
  removeFile: "Remove file",
  
  // Redaction Tools
  drawRedactionBox: "Draw Redaction Box",
  selectTool: "Select Tool",
  deleteRedactionBox: "Delete Box",
  clearAllRedactions: "Clear All",
  redactionColor: "Redaction Color",
  
  // Actions
  selectAll: "Select All Pages",
  deselectAll: "Deselect All Pages",
  
  // Success
  successTitle: "PDF Redacted Successfully!",
  successDescription: "Your PDF has been permanently redacted and secured",
  
  // Buttons
  continueToEdit: "Continue to Redact",
  redactPdf: "Apply Redactions",
  redactAnother: "Redact Another PDF",
  
  // Processing
  processing: {
    title: "Redacting PDF...",
    description: "Permanently removing sensitive content from your PDF",
  },
  
  // Page Info
  pageInfo: (index: number, total: number) => `Page ${index} of ${total}`,
  redactionCount: (count: number) => `${count} redaction${count !== 1 ? 's' : ''}`,
  totalRedactions: (count: number) => `Total: ${count} redaction${count !== 1 ? 's' : ''}`,
};

/**
 * SEO Content Sections
 */
export const SEO_CONTENT = {
  definition: {
    title: "What is PDF Redaction?",
    content: "PDF redaction is the process of permanently removing sensitive or confidential information from a PDF document. Unlike simply covering text with a black box, proper redaction removes the underlying data completely, ensuring the information cannot be recovered. WorkflowPro's Redact PDF tool allows you to securely black out text, numbers, images, or entire sections of your PDF, making it ideal for legal documents, government forms, medical records, and any document containing private information.",
  },
  
  howItWorks: {
    title: "How It Works",
    subtitle: "Redact your PDF in four simple steps",
    introText: "Follow these simple steps to permanently remove sensitive information from your PDF securely.",
  },
  
  footer: {
    title: "About WorkflowPro's Redact PDF Tool",
    content: "WorkflowPro's Redact PDF tool helps you permanently remove sensitive information from PDF files quickly and securely. Perfect for legal documents, government forms, medical records, financial documents, and any PDF containing confidential data — fast, simple, and always free.",
  },
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "How do I redact information in a PDF?",
    answer: "Upload your PDF, draw black boxes over the sensitive text or images you want to remove, review all pages, and click 'Apply Redactions' to permanently remove the content.",
  },
  {
    question: "Is redaction permanent?",
    answer: "Yes! When you redact content with WorkflowPro, the underlying data is permanently removed from the PDF, not just covered up. The information cannot be recovered.",
  },
  {
    question: "What can I redact in a PDF?",
    answer: "You can redact any visible content including text, numbers, images, signatures, dates, addresses, social security numbers, account numbers, and any other sensitive information.",
  },
  {
    question: "Can I undo a redaction after downloading?",
    answer: "No, redactions are permanent once applied and downloaded. Always review your redactions carefully before finalizing.",
  },
  {
    question: "Are my files secure?",
    answer: "Absolutely! All processing happens locally in your browser. Your PDF never leaves your device, ensuring complete privacy and security.",
  },
  {
    question: "Can I redact password-protected PDFs?",
    answer: "Yes, if you can open the PDF and provide the correct password, you can redact its contents.",
  },
  {
    question: "What's the difference between redaction and deletion?",
    answer: "Redaction permanently removes content from specific areas you mark, while deletion removes entire pages. Use redaction when you need to keep the document structure but remove sensitive data.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Yes, files up to 50MB are supported, which covers most standard PDF documents.",
  },
  {
    question: "Is this tool free?",
    answer: "Yes, WorkflowPro's Redact PDF tool is completely free to use with no hidden charges or watermarks on your files.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account needed! Upload your PDF and start redacting immediately with zero friction.",
  },
];

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have unsaved redactions. Are you sure you want to leave? Your work will be lost.";
