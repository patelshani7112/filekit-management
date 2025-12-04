/**
 * Repair PDF Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Repair PDF page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/repair/RepairPdfPage.tsx
 */

import { 
  Lock, Zap, Wrench, Upload, Settings, Download,
  FileEdit, Split, RefreshCw, FileType, FileImage,
  FileMinus, Hash, FileSignature, FileKey, LockOpen, FileCog,
  Image, Video, Music, FileCheck, Archive, Merge, RotateCw,
  AlertTriangle, CheckCircle, XCircle, Info, Shield
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Repair PDF",
  description: "Fix corrupted, damaged, or unreadable PDF files instantly. Our advanced repair engine recovers broken PDFs and restores your important documents — completely free and secure.",
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
    description: "Repair corrupted PDFs in seconds. Advanced algorithms fix common issues instantly.",
  },
  {
    icon: Wrench,
    title: "Advanced Recovery",
    description: "Automatically detects and fixes structural errors, missing headers, broken references, and more.",
  },
];

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Corrupted PDF",
    description: "Select the damaged or unreadable PDF file from your device. Our tool accepts even severely corrupted files.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Analyze Issues",
    description: "Our repair engine scans the PDF structure and identifies errors, corruption, and missing data.",
    icon: Settings,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Auto-Repair",
    description: "Advanced algorithms automatically fix common issues including broken headers, missing references, and structural errors.",
    icon: Wrench,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Fixed PDF",
    description: "Download your repaired PDF with a detailed report of what was fixed. Your document is ready to use.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
  {
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality",
    icon: Archive,
    href: "/compress-pdf",
  },
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
    name: "PDF Validator",
    description: "Check and validate PDF file integrity",
    icon: FileCheck,
    href: "/pdf-validator",
  },
  {
    name: "Unlock PDF",
    description: "Remove password protection from PDF",
    icon: LockOpen,
    href: "/unlock-pdf",
  },
  {
    name: "Protect PDF",
    description: "Add password protection to your PDF",
    icon: FileKey,
    href: "/protect-pdf",
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
];

/**
 * Use Cases
 */
export const USE_CASES = [
  "Recover important documents that won't open",
  "Fix PDFs damaged during download or transfer",
  "Repair files with missing or corrupted pages",
  "Restore PDFs with broken internal structure",
  "Fix files that show 'file is damaged' errors",
  "Repair scanned documents with encoding issues",
  "Recover PDFs from crashed applications",
  "Fix files with missing fonts or images",
  "Repair contract and legal documents",
  "Restore academic papers and research files",
];

export const USE_CASES_TITLE = "Popular Uses for Repairing PDFs";

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  maxFiles: 5,
  maxFileSize: 50, // MB
  acceptedTypes: [".pdf"],
  fileTypeLabel: "PDF",
  helperText: "PDF files only · Up to 5 files · 50MB each",
  skipValidation: true, // Accept broken/corrupted files
};

/**
 * Repair Options
 */
export const REPAIR_OPTIONS = {
  fixStructure: {
    label: "Fix Structure",
    description: "Repair PDF file structure and headers",
    value: "fixStructure",
    icon: Wrench,
    default: true,
  },
  recoverContent: {
    label: "Recover Content",
    description: "Attempt to recover missing or damaged content",
    value: "recoverContent",
    icon: FileCheck,
    default: true,
  },
  rebuildXref: {
    label: "Rebuild Cross-References",
    description: "Reconstruct internal document references",
    value: "rebuildXref",
    icon: RefreshCw,
    default: true,
  },
  fixEncoding: {
    label: "Fix Encoding",
    description: "Repair text encoding issues",
    value: "fixEncoding",
    icon: FileType,
    default: false,
  },
};

/**
 * Issue Types (detected during scan)
 */
export const ISSUE_TYPES = {
  corruptedHeader: {
    label: "Corrupted Header",
    icon: AlertTriangle,
    severity: "high",
    description: "PDF file header is damaged or missing",
  },
  missingXref: {
    label: "Missing Cross-References",
    icon: AlertTriangle,
    severity: "high",
    description: "Document reference table is incomplete",
  },
  brokenPages: {
    label: "Broken Pages",
    icon: XCircle,
    severity: "medium",
    description: "One or more pages cannot be read",
  },
  encodingErrors: {
    label: "Encoding Errors",
    icon: Info,
    severity: "low",
    description: "Text encoding issues detected",
  },
  missingResources: {
    label: "Missing Resources",
    icon: AlertTriangle,
    severity: "medium",
    description: "Fonts, images, or other resources are missing",
  },
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  maxFilesReached: (max: number) => `Maximum ${max} files allowed. Please remove some files before adding more.`,
  invalidFileType: (count: number) => `Only PDF files are allowed. ${count} invalid file(s) removed.`,
  fileSizeExceeded: (count: number, max: number) => `${count} file(s) exceed ${max}MB limit and were removed.`,
  limitReached: (added: number, max: number, current: number) => `Only ${added} file(s) added. Maximum ${max} files allowed (you have ${current} already).`,
  tooCorrupted: "This file is too severely damaged to repair. Try recovering from a backup.",
  noIssuesFound: "No issues detected. This PDF appears to be healthy.",
};

/**
 * UI Labels & Buttons
 */
export const UI_LABELS = {
  // Edit Page
  repairSettings: "Repair Settings",
  repairOptions: "Repair Options",
  issuesDetected: "Issues Detected",
  selectOptions: "Select repair methods",
  
  // Actions
  repair: "Repair PDF",
  processing: "Repairing...",
  analyzing: "Analyzing...",
  
  // Success
  successTitle: "PDF Repaired Successfully!",
  successDescription: (count: number) => `${count} file(s) have been repaired and are ready to download`,
  partialSuccess: (success: number, total: number) => `${success} of ${total} files repaired successfully`,
  
  // Stats
  issuesFound: "Issues Found",
  issuesFixed: "Issues Fixed",
  recoveryRate: "Recovery Rate",
  fileStatus: "File Status",
  
  // Status
  healthy: "Healthy",
  repaired: "Repaired",
  failed: "Failed",
  analyzing: "Analyzing",
  
  // Buttons
  repairAnother: "Repair Another PDF",
  previewTitle: "Repaired File Preview",
  viewReport: "View Repair Report",
  downloadAll: "Download All",
  
  // Navigation Warning
  navigationWarning: {
    title: "Unsaved Changes",
    description: "You have uploaded files but haven't completed the repair process. If you leave now, your work will be lost.",
    stay: "Stay on Page",
    leave: "Leave Anyway",
  },
  
  // Processing
  processing: {
    title: "Repairing PDF...",
    description: "Fixing errors and recovering content",
  },
  
  // Repair Report
  report: {
    title: "Repair Report",
    summary: "Summary",
    issuesDetected: "Issues Detected",
    actionsToken: "Actions Taken",
    result: "Result",
  },
};

/**
 * SEO Content Sections
 */
export const SEO_CONTENT = {
  definition: {
    title: "What Is PDF Repair?",
    content: "PDF repair recovers corrupted or damaged PDF files by fixing structural errors, rebuilding references, and recovering content. WorkflowPro's advanced repair tool handles common issues like broken headers, missing pages, encoding errors, and file corruption — helping you salvage important documents quickly and securely.",
  },
  
  howItWorks: {
    title: "How It Works",
    subtitle: "Repair your corrupted PDF files in four simple steps",
    introText: "Follow these simple steps to repair and recover your damaged PDF files.",
  },
  
  footer: {
    title: "About WorkflowPro's Repair PDF Tool",
    content: "WorkflowPro's Repair PDF tool helps you fix corrupted and damaged PDF files quickly and securely. Recover important documents, fix structural errors, and restore broken PDFs — fast, simple, and always free.",
  },
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "What types of PDF issues can be repaired?",
    answer: "Our tool can fix corrupted headers, missing cross-references, broken page structures, encoding errors, and damaged internal references. Severely corrupted files may have limited recovery.",
  },
  {
    question: "Is my data safe during repair?",
    answer: "Yes, absolutely. All repair processes happen locally in your browser. Your files are never uploaded to our servers.",
  },
  {
    question: "Can all corrupted PDFs be repaired?",
    answer: "Most common corruption issues can be fixed. However, severely damaged files or files with extensive data loss may not be fully recoverable.",
  },
  {
    question: "Will I lose any content during repair?",
    answer: "Our repair tool preserves as much original content as possible. In rare cases of severe corruption, some data may be unrecoverable.",
  },
  {
    question: "How long does repair take?",
    answer: "Most PDFs are repaired in 10-30 seconds. Larger or more severely damaged files may take longer.",
  },
  {
    question: "Can I repair password-protected PDFs?",
    answer: "Yes, but you'll need to provide the password. Use our Unlock PDF tool first if you've forgotten it.",
  },
  {
    question: "What causes PDF corruption?",
    answer: "Common causes include incomplete downloads, storage device errors, software crashes, virus infections, and improper file transfers.",
  },
  {
    question: "Is the repair tool free to use?",
    answer: "Yes — completely free with no limits, no watermarks, and no registration required.",
  },
];

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have uploaded files that haven't been processed yet. If you leave now, all your work will be lost.";
