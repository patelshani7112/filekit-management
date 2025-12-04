/**
 * Rotate PDF Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Rotate PDF page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/organize-manage-pdf/RotatePdfPage.tsx
 */

import { 
  Lock, Zap, RotateCw, Upload, Settings, Download,
  FileEdit, Archive, Split, RefreshCw, FileType, FileImage,
  FileMinus, Hash, FileSignature, FileKey, LockOpen, FileCog,
  Image, Video, Music, FileCheck, FileText, Droplets, GripVertical
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Rotate PDF",
  description: "Rotate PDF pages instantly with WorkflowPro's fast and secure PDF rotator. Upload your PDF, rotate pages clockwise or counterclockwise to the correct orientation — completely free and watermark-free.",
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
    description: "Rotate PDF pages in seconds. No waiting, no queues, instant results every time.",
  },
  {
    icon: RotateCw,
    title: "Flexible Rotation",
    description: "Rotate individual pages or all pages at once. 90°, 180°, or 270° clockwise rotation options.",
  },
];

/**
 * Why Choose WorkflowPro - Custom for Rotate PDF
 */
export const WHY_CHOOSE_CONTENT = {
  title: "Why Choose WorkflowPro?",
  subtitle: "The most powerful and user-friendly PDF rotator available online",
  introText: "WorkflowPro delivers fast, private, and watermark-free PDF rotation trusted by professionals, students, and businesses. No signup required.",
};

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Your PDF",
    description: "Select the PDF file you want to rotate from your device or drag and drop it into the upload area.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Select Pages to Rotate",
    description: "Choose which pages need rotation. You can rotate individual pages or all pages at once with a single click.",
    icon: Settings,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Rotate Pages",
    description: "Click the rotate button to turn pages 90° clockwise. Keep clicking to rotate 180° or 270° as needed.",
    icon: RotateCw,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download",
    description: "Click to save your rotated PDF and download it instantly with all pages in the correct orientation.",
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
    name: "Organize PDF",
    description: "Reorder, rotate, and manage PDF pages",
    icon: GripVertical,
    href: "/organize-pdf",
  },
  {
    name: "Delete PDF Pages",
    description: "Remove unwanted pages from your PDF",
    icon: FileMinus,
    href: "/delete-pdf-pages",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality",
    icon: Archive,
    href: "/compress-pdf",
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
    name: "Sign PDF",
    description: "Add your digital signature to PDF",
    icon: FileSignature,
    href: "/sign-pdf",
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
  "Fix scanned documents with wrong orientation",
  "Correct pages after scanning or importing",
  "Prepare documents for printing in correct orientation",
  "Fix landscape pages in portrait documents",
  "Rotate individual pages without affecting others",
  "Correct orientation of photos converted to PDF",
  "Fix upside-down or sideways pages quickly",
  "Prepare presentations with mixed orientations",
];

export const USE_CASES_TITLE = "Popular Uses for Rotating PDFs";

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
  rotateSettings: "Rotate Settings",
  sourceFiles: "Source Files",
  outputSettings: "Output Settings",
  fileName: "Filename",
  fileNamePlaceholder: "rotated.pdf",
  removeFile: "Remove file",
  addFiles: "Add Files",
  
  // Actions
  rotateRight: "Rotate Right",
  rotateLeft: "Rotate Left",
  rotateAll: "Rotate All Pages",
  resetRotation: "Reset Rotation",
  selectAll: "Select All",
  deselectAll: "Deselect All",
  
  // Success
  successTitle: "PDF Rotated Successfully!",
  successDescription: "Your PDF pages have been rotated to the correct orientation",
  
  // Buttons
  continueToEdit: "Continue to Rotate",
  rotatePdf: "Rotate PDF",
  rotateAnother: "Rotate Another PDF",
  
  // Processing
  processing: {
    title: "Rotating PDF...",
    description: "Adjusting page orientations in your PDF",
  },
  
  // Page Info
  pageInfo: (index: number, total: number) => `Page ${index} of ${total}`,
  rotation: (degrees: number) => `${degrees}°`,
  selected: "Selected",
};

/**
 * SEO Content Sections
 */
export const SEO_CONTENT = {
  definition: {
    title: "What is PDF Rotation?",
    content: "PDF rotation allows you to change the orientation of pages in your PDF document. Whether you have scanned documents, photos, or mixed-orientation files, WorkflowPro's Rotate PDF tool lets you quickly fix page orientations by rotating them 90°, 180°, or 270° clockwise. You can rotate individual pages or all pages at once, ensuring your document displays correctly for reading and printing.",
  },
  
  howItWorks: {
    title: "How It Works",
    subtitle: "Rotate your PDF pages in four simple steps",
    introText: "Follow these simple steps to rotate your PDF pages quickly and securely.",
  },
  
  footer: {
    title: "About WorkflowPro's Rotate PDF Tool",
    content: "WorkflowPro's Rotate PDF tool helps you fix page orientations in PDF files quickly and securely. Perfect for scanned documents, photos, mixed-orientation files, and any PDF that needs orientation correction — fast, simple, and always free.",
  },
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "How do I rotate pages in a PDF?",
    answer: "Upload your PDF, select the pages you want to rotate, and click the rotate button. Each click rotates the page 90° clockwise.",
  },
  {
    question: "Can I rotate individual pages or all pages?",
    answer: "Yes! You can rotate individual pages one at a time, select multiple pages, or use the 'Rotate All' button to rotate every page at once.",
  },
  {
    question: "What rotation angles are supported?",
    answer: "You can rotate pages in 90° increments: 90°, 180°, or 270° clockwise. Click the rotate button multiple times to achieve the desired angle.",
  },
  {
    question: "Will this modify my original PDF?",
    answer: "No, we create a new PDF with rotated pages. Your original file remains completely untouched.",
  },
  {
    question: "Are my files secure?",
    answer: "Absolutely! All processing happens locally in your browser. Your PDF never leaves your device, ensuring complete privacy.",
  },
  {
    question: "Can I rotate password-protected PDFs?",
    answer: "Yes, if you can open the PDF and provide the correct password, you can rotate its pages.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Yes, files up to 50MB are supported, which covers most standard PDF documents.",
  },
  {
    question: "Is this tool free?",
    answer: "Yes! WorkflowPro's Rotate PDF tool is completely free with no hidden charges or watermarks.",
  },
];

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have uploaded files that haven't been processed yet. If you leave now, all your work will be lost.";