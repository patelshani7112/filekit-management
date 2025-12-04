/**
 * Compress PDF Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Compress PDF page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/compress/CompressPdfPage.tsx
 */

import { 
  Lock, Zap, Gauge, Upload, Settings, Download,
  FileEdit, Split, RefreshCw, FileType, FileImage,
  FileMinus, Hash, FileSignature, FileKey, LockOpen, FileCog,
  Image, Video, Music, FileCheck, Archive, Merge, RotateCw,
  FileText
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Compress PDF",
  description: "Reduce PDF file size without losing quality. Our smart compression technology optimizes your PDFs for faster sharing and smaller storage — completely free and secure.",
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
    description: "Compress PDFs in seconds. No waiting, no queues, instant results every time.",
  },
  {
    icon: Gauge,
    title: "Quality Control",
    description: "Choose compression levels to balance file size and quality. Get the perfect result every time.",
  },
];

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload PDF",
    description: "Select the PDF file you want to compress from your device or drag and drop it into the upload area.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Choose Compression",
    description: "Select your preferred compression level: High (smaller size), Medium (balanced), or Low (better quality).",
    icon: Settings,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Process File",
    description: "Our smart compression engine optimizes your PDF while preserving quality. Watch the progress in real-time.",
    icon: Gauge,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Download your compressed PDF instantly. See exactly how much space you saved with detailed size comparison.",
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
    icon: Merge,
    href: "/merge-pdf",
  },
  {
    name: "Split PDF",
    description: "Extract pages from your PDF",
    icon: Split,
    href: "/split-pdf",
  },
  {
    name: "Edit PDF",
    description: "Add text, images, and annotations to your PDF",
    icon: FileEdit,
    href: "/edit-pdf",
  },
  {
    name: "Rotate PDF",
    description: "Rotate PDF pages to the correct orientation",
    icon: RotateCw,
    href: "/rotate-pdf",
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
    name: "Repair PDF",
    description: "Fix corrupted or damaged PDF files",
    icon: FileCheck,
    href: "/repair-pdf",
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
  "Reduce email attachment sizes for faster sending",
  "Optimize PDFs for web publishing and online sharing",
  "Save storage space on devices and cloud services",
  "Compress large reports and presentations for clients",
  "Shrink scanned documents without losing readability",
  "Optimize eBooks and digital publications",
  "Prepare PDFs for mobile viewing and download",
  "Reduce file sizes for archival and backup purposes",
  "Compress invoice batches for accounting systems",
  "Optimize manuals and documentation for distribution",
];

export const USE_CASES_TITLE = "Popular Uses for Compressing PDFs";

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  maxFiles: 1,
  maxFileSize: 100, // MB
  acceptedTypes: [".pdf"],
  fileTypeLabel: "PDF",
  helperText: "PDF files only · 1 file · 100MB max",
};

/**
 * Compression Levels
 */
export const COMPRESSION_LEVELS = {
  high: {
    label: "High Compression",
    description: "Smaller file size, slight quality reduction",
    value: "high",
    icon: Archive,
    estimatedReduction: "60-80%",
  },
  medium: {
    label: "Medium Compression",
    description: "Balanced size and quality",
    value: "medium",
    icon: Gauge,
    estimatedReduction: "40-60%",
  },
  low: {
    label: "Low Compression",
    description: "Better quality, moderate size reduction",
    value: "low",
    icon: FileText,
    estimatedReduction: "20-40%",
  },
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  maxFilesReached: "Only 1 file can be compressed at a time.",
  invalidFileType: "Only PDF files are allowed.",
  fileSizeExceeded: (max: number) => `File exceeds ${max}MB limit.`,
  invalidPdfFile: "Failed to read PDF file",
  alreadyCompressed: "This PDF appears to be already highly compressed. Further compression may not be effective.",
};

/**
 * UI Labels & Buttons
 */
export const UI_LABELS = {
  // Edit Page
  compressionSettings: "Compression Settings",
  compressionLevel: "Compression Level",
  selectLevel: "Select compression level",
  
  // Actions
  compress: "Compress PDF",
  processing: "Compressing...",
  
  // Success
  successTitle: "PDF Compressed Successfully!",
  successDescription: "Your PDF has been compressed and is ready to download",
  
  // Stats
  originalSize: "Original Size",
  compressedSize: "Compressed Size",
  savedSpace: "Space Saved",
  compressionRatio: "Compression Ratio",
  
  // Buttons
  compressAnother: "Compress Another PDF",
  previewTitle: "Compressed File Preview",
  
  // Navigation Warning
  navigationWarning: {
    title: "Unsaved Changes",
    description: "You have uploaded a file but haven't completed the compression. If you leave now, your work will be lost.",
    stay: "Stay on Page",
    leave: "Leave Anyway",
  },
  
  // Processing
  processing: {
    title: "Compressing PDF...",
    description: "Optimizing your PDF file size",
  },
};

/**
 * SEO Content Sections
 */
export const SEO_CONTENT = {
  definition: {
    title: "What Is PDF Compression?",
    content: "PDF compression reduces file size by optimizing images, removing redundant data, and applying efficient encoding. WorkflowPro's smart compression maintains quality while shrinking PDFs for faster sharing, smaller storage, and easier distribution. Perfect for emails, websites, and archival.",
  },
  
  howItWorks: {
    title: "How It Works",
    subtitle: "Compress your PDF files in four simple steps",
    introText: "Follow these simple steps to compress your PDF files quickly and efficiently.",
  },
  
  footer: {
    title: "About WorkflowPro's Compress PDF Tool",
    content: "WorkflowPro's Compress PDF tool helps you reduce PDF file sizes quickly and securely. Choose your compression level, optimize for web or email, and save storage space — fast, simple, and always free.",
  },
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "How much can I compress my PDF?",
    answer: "Compression results vary based on content. PDFs with many images can be compressed 60-80%, while text-heavy PDFs may see 20-40% reduction.",
  },
  {
    question: "Will compression reduce quality?",
    answer: "Our compression is optimized to minimize quality loss. Choose Low compression for best quality or High compression for maximum size reduction.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Yes, the maximum file size is 100MB. For larger files, consider splitting them first.",
  },
  {
    question: "Are my files secure during compression?",
    answer: "Yes, all compression happens locally in your browser. Files are never uploaded to our servers.",
  },
  {
    question: "Can I compress multiple PDFs at once?",
    answer: "Currently, you can compress one PDF at a time to ensure optimal quality and performance.",
  },
  {
    question: "What happens to password-protected PDFs?",
    answer: "You'll need to unlock the PDF first using our Unlock PDF tool before compressing it.",
  },
  {
    question: "Can I compress an already compressed PDF?",
    answer: "Yes, but results may vary. PDFs that are already heavily compressed may not reduce much further.",
  },
  {
    question: "Is WorkflowPro's compression free?",
    answer: "Yes — completely free with no watermarks, no limits, and no registration required.",
  },
];

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have uploaded a file that hasn't been processed yet. If you leave now, all your work will be lost.";
