/**
 * Watermark PDF Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Watermark PDF page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/edit-annotate/WatermarkPdfPage.tsx
 */

import { 
  Lock, Zap, Droplets, Upload, Settings, Download,
  FileEdit, Split, RefreshCw, FileType, FileImage,
  FileMinus, Hash, FileSignature, FileKey, LockOpen, FileCog,
  Image, Video, Music, FileCheck, Archive, Merge, RotateCw,
  Crop, GripVertical, FileStack, Layers, Shield, FileText
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Add Watermark",
  description: "Add text or image watermarks to protect your PDF documents. Customize position, opacity, and style to create professional watermarks — completely free and secure.",
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
    description: "Add watermarks to PDFs in seconds. No waiting, no queues, instant results every time.",
  },
  {
    icon: Droplets,
    title: "Fully Customizable",
    description: "Control text, position, opacity, rotation, and more. Create professional watermarks that match your brand.",
  },
];

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload PDFs",
    description: "Select one or more PDF files to add watermarks. Drag and drop or click to browse.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Configure Watermark",
    description: "Customize watermark text, position, opacity, rotation, and style. Preview changes in real-time.",
    icon: Droplets,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Adjust Settings",
    description: "Fine-tune placement, choose pages to watermark, and set advanced options like blend modes and patterns.",
    icon: Settings,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Download your watermarked PDFs instantly. All files are processed and ready for use.",
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
    description: "Add text, images, and annotations",
    icon: FileEdit,
    href: "/edit-pdf",
  },
  {
    name: "Add Page Numbers",
    description: "Add page numbers to PDFs",
    icon: FileText,
    href: "/add-page-numbers-to-pdf",
  },
  {
    name: "Remove Watermark",
    description: "Remove watermarks from PDFs",
    icon: Droplets,
    href: "/remove-watermark-pdf",
  },
  {
    name: "Protect PDF",
    description: "Add password protection",
    icon: Lock,
    href: "/protect-pdf",
  },
  {
    name: "Sign PDF",
    description: "Add digital signatures",
    icon: FileSignature,
    href: "/sign-pdf",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size",
    icon: Archive,
    href: "/compress-pdf",
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs",
    icon: Merge,
    href: "/merge-pdf",
  },
  {
    name: "Split PDF",
    description: "Extract pages from PDF",
    icon: Split,
    href: "/split-pdf",
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
    icon: FileCog,
    href: "/organize-pdf",
  },
  {
    name: "Extract Pages",
    description: "Extract specific pages",
    icon: FileText,
    href: "/extract-pdf-pages",
  },
  {
    name: "Delete Pages",
    description: "Remove unwanted pages",
    icon: FileMinus,
    href: "/delete-pdf-pages",
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
  "Add copyright notices to protect intellectual property and documents",
  "Add company logos or names to maintain brand consistency across documents",
  "Mark documents as 'DRAFT', 'CONFIDENTIAL', or 'APPROVED' for clarity",
  "Add watermarks to PDF portfolios to prevent unauthorized use",
  "Protect design documents and presentations from copying",
  "Add professional branding to client-facing PDF materials",
  "Label internal documents with department or team names",
  "Add timestamps or version numbers to document revisions",
  "Create security watermarks for sensitive business documents",
  "Add promotional watermarks to marketing materials and brochures",
];

export const USE_CASES_TITLE = "Popular Uses for PDF Watermarks";

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
 * Watermark Types
 */
export const WATERMARK_TYPES = {
  text: {
    value: "text",
    label: "Text Watermark",
    description: "Add custom text as a watermark",
    icon: FileText,
  },
  image: {
    value: "image",
    label: "Image Watermark",
    description: "Upload an image as a watermark",
    icon: Image,
  },
  pattern: {
    value: "pattern",
    label: "Pattern Watermark",
    description: "Create repeating pattern watermarks",
    icon: GripVertical,
  },
};

/**
 * Watermark Positions
 */
export const WATERMARK_POSITIONS = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "center", label: "Center" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
];

/**
 * Font Families
 */
export const FONT_FAMILIES = [
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Impact", label: "Impact" },
];

/**
 * Repeat Modes
 */
export const REPEAT_MODES = [
  { value: "none", label: "No Repeat" },
  { value: "diagonal", label: "Diagonal Pattern" },
  { value: "grid", label: "Grid Pattern" },
  { value: "horizontal", label: "Horizontal Pattern" },
  { value: "vertical", label: "Vertical Pattern" },
];

/**
 * Apply To Options
 */
export const APPLY_TO_OPTIONS = [
  { value: "all", label: "All Pages" },
  { value: "current", label: "Current Page" },
  { value: "range", label: "Page Range" },
];

/**
 * Default Watermark Settings
 */
export const DEFAULT_WATERMARK_SETTINGS = {
  type: "text" as "text" | "image" | "pattern",
  // Text settings
  text: "CONFIDENTIAL",
  fontFamily: "Arial",
  fontSize: 24,
  fontWeight: "normal" as "normal" | "bold",
  color: "#000000",
  letterSpacing: 0,
  lineHeight: 1.5,
  textShadow: false,
  // Image settings
  imageUrl: "",
  imageSize: 100,
  keepAspectRatio: true,
  blendMode: "normal",
  // Common settings
  opacity: 50,
  rotation: 0,
  alignment: "center",
  xOffset: 0,
  yOffset: 0,
  x: 50, // For canvas positioning
  y: 50, // For canvas positioning
  // Pattern settings
  repeatMode: "none" as "none" | "diagonal" | "grid" | "horizontal" | "vertical",
  spacing: 30,
  patternAngle: 0,
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  // Apply settings
  applyTo: "all" as "current" | "all" | "range",
  pageRange: "",
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
  noWatermarkText: "Please enter watermark text",
  noWatermarkImage: "Please upload a watermark image",
  invalidPageRange: "Invalid page range format. Use format like: 1-3, 5, 7-9",
};

/**
 * UI Labels & Buttons
 */
export const UI_LABELS = {
  // Edit Page
  watermarkSettings: "Watermark Settings",
  watermarkType: "Watermark Type",
  textSettings: "Text Settings",
  imageSettings: "Image Settings",
  positionSettings: "Position & Appearance",
  advancedSettings: "Advanced Settings",
  
  // Text Settings
  watermarkText: "Watermark Text",
  textPlaceholder: "Enter watermark text...",
  fontFamily: "Font Family",
  fontSize: "Font Size",
  fontWeight: "Font Weight",
  textColor: "Text Color",
  letterSpacing: "Letter Spacing",
  lineHeight: "Line Height",
  
  // Image Settings
  uploadImage: "Upload Image",
  imageSize: "Image Size",
  keepAspectRatio: "Keep Aspect Ratio",
  
  // Position Settings
  position: "Position",
  opacity: "Opacity",
  rotation: "Rotation",
  xOffset: "Horizontal Offset",
  yOffset: "Vertical Offset",
  
  // Pattern Settings
  repeatMode: "Repeat Mode",
  spacing: "Spacing",
  patternAngle: "Pattern Angle",
  
  // Apply Settings
  applyTo: "Apply To",
  pageRange: "Page Range",
  pageRangePlaceholder: "e.g., 1-3, 5, 7-9",
  
  // Actions
  addWatermark: "Add Watermark",
  deleteWatermark: "Delete Watermark",
  backToUpload: "Back to Upload",
  processing: "Adding Watermark...",
  
  // Success
  successTitle: "Watermark Added Successfully!",
  successDescription: "Your PDF(s) have been watermarked and are ready to download",
  
  // Buttons
  watermarkAnother: "Watermark Another PDF",
  continueToAddWatermark: "Continue to Add Watermark",
  previewTitle: "Watermarked File Preview",
  
  // Navigation Warning
  navigationWarning: {
    title: "Unsaved Changes",
    description: "You have uploaded files but haven't completed the watermarking. If you leave now, your work will be lost.",
    stay: "Stay on Page",
    leave: "Leave Anyway",
  },
  
  // Processing
  processing: {
    title: "Adding Watermark...",
    description: "Processing your PDFs with watermarks",
  },
  
  // Preview Dialog
  preview: {
    title: "Watermark Preview",
    description: "Preview how the watermark will appear on your PDF pages.",
  },
};

/**
 * SEO Content Sections
 */
export const SEO_CONTENT = {
  definition: {
    title: "What is a PDF Watermark?",
    content: "A PDF watermark is text or an image overlay added to PDF documents to protect intellectual property, establish ownership, discourage unauthorized copying, and maintain brand identity. With WorkflowPro's watermark tool, you can easily add custom text watermarks with adjustable position and opacity to single or multiple PDF files at once. Perfect for marking documents as confidential, draft, or adding copyright notices.",
  },
  
  howItWorks: {
    title: "How It Works",
    subtitle: "Add watermarks to your PDF files in simple steps with our intuitive interface",
    introText: "Follow these simple steps to add watermarks to your PDF files quickly and securely.",
  },
  
  footer: {
    title: "About WorkflowPro's Watermark PDF Tool",
    content: "WorkflowPro's Watermark PDF tool helps you add professional watermarks to your PDF documents quickly and securely. Protect your intellectual property, establish ownership, and maintain brand consistency — fast, simple, and always free.",
  },
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "Why should I add a watermark to my PDF?",
    answer: "Watermarks protect your documents from unauthorized use, establish ownership, discourage copying, and add professional branding to your PDFs.",
  },
  {
    question: "Can I add custom text as a watermark?",
    answer: "Yes! You can add any custom text as a watermark, such as 'CONFIDENTIAL', 'DRAFT', your company name, copyright notice, or any other text.",
  },
  {
    question: "Can I control the watermark opacity?",
    answer: "Absolutely! You can adjust the watermark opacity from 10% to 100% to make it subtle or prominent based on your needs.",
  },
  {
    question: "Where can I position the watermark?",
    answer: "You can position the watermark in 7 different locations: top-left, top-center, top-right, center, bottom-left, bottom-center, or bottom-right. You can also fine-tune with custom offsets.",
  },
  {
    question: "Can I watermark multiple PDFs at once?",
    answer: "Yes! You can upload up to 10 PDF files and apply the same watermark settings to all of them at once.",
  },
  {
    question: "Will the watermark affect the original content?",
    answer: "No, the watermark is added as an overlay on top of your PDF content. The original content remains unchanged underneath.",
  },
  {
    question: "Is my PDF data secure?",
    answer: "Yes! All watermarking happens locally in your browser. Your files are never uploaded to our servers.",
  },
  {
    question: "What file size is supported?",
    answer: "Each PDF file can be up to 50MB in size, which covers most standard documents.",
  },
];

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have uploaded files that haven't been processed yet. If you leave now, all your work will be lost.";
