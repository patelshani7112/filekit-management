/**
 * Unlock PDF Tool - Content Configuration
 * 
 * This file contains all hardcoded text content for the Unlock PDF page.
 * Organized in a centralized location for easy management and future i18n support.
 * 
 * Path mirrors: /pages/pdf-tools/organize-manage-pdf/UnlockPdfPage.tsx
 */

import { 
  LockOpen, Zap, Shield, Upload, Settings, Download,
  FileEdit, Archive, Split, RefreshCw, FileType, FileImage,
  FileMinus, Hash, FileSignature, FileKey, Lock, FileCog,
  Image, Video, Music, FileCheck, FileText, Droplets, GripVertical,
  RotateCw, Key
} from "lucide-react";

/**
 * Page Hero Content
 */
export const HERO_CONTENT = {
  title: "Unlock PDF",
  description: "Remove password protection from PDF files instantly with WorkflowPro's secure PDF unlocker. Upload your password-protected PDF, enter the password, and unlock it for editing and printing — completely free and watermark-free.",
  subline: "Remove PDF password protection securely in your browser",
};

/**
 * Feature Highlights
 */
export const FEATURES = [
  {
    icon: Lock,
    title: "100% Secure",
    description: "Your files are processed locally in your browser. Passwords and files never leave your device.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Unlock password-protected PDFs in seconds. No waiting, no queues, instant results.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your sensitive documents and passwords remain completely private. No server uploads, no data collection.",
  },
];

/**
 * Why Choose WorkflowPro - Custom for Unlock PDF
 */
export const WHY_CHOOSE_CONTENT = {
  title: "Why Choose WorkflowPro?",
  subtitle: "The most powerful and user-friendly PDF unlocker available online",
  introText: "WorkflowPro delivers fast, private, and watermark-free PDF unlocking trusted by professionals, students, and businesses. No signup required.",
};

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Your Locked PDF",
    description: "Select the password-protected PDF file from your device or drag and drop it into the upload area.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Enter Password",
    description: "Type in the password that protects your PDF. The password will be used only to unlock the document.",
    icon: Key,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Unlock PDF",
    description: "Click the unlock button and we'll remove the password protection from your PDF file instantly.",
    icon: LockOpen,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download",
    description: "Download your unlocked PDF file. It's now accessible without any password protection.",
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
    description: "Add password protection to PDFs",
    icon: Lock,
    href: "/protect-pdf",
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
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality",
    icon: Archive,
    href: "/compress-pdf",
  },
  {
    name: "Rotate PDF",
    description: "Change PDF page orientation",
    icon: RotateCw,
    href: "/rotate-pdf",
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
    name: "Organize PDF",
    description: "Reorder, rotate, and manage PDF pages",
    icon: GripVertical,
    href: "/organize-pdf",
  },
];

/**
 * Use Cases
 */
export const USE_CASES_TITLE = "When You Need to Unlock a PDF";

export const USE_CASES = [
  "Remove password protection to edit, annotate, or modify PDF content",
  "Unlock PDFs with printing restrictions for meetings or personal use",
  "Access password-protected contracts, invoices, or business documents",
  "Remove restrictions from archived or older documents",
  "Unlock PDFs for merging with other documents",
  "Remove protection from forms to fill them out or modify data",
  "Access legally obtained documents when the password is forgotten",
  "Unlock PDFs for text extraction or data analysis",
];

/**
 * Upload Configuration
 */
export const UPLOAD_CONFIG = {
  acceptedTypes: [".pdf"],
  allowMultiple: false,
  maxFiles: 1,
  maxFileSize: 100, // MB
  fileTypeLabel: "PDF Files",
  helperText: "PDF files only · 1 file · 100MB each",
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  invalidFileType: "Only PDF files are allowed",
  fileTooLarge: `File size exceeds ${UPLOAD_CONFIG.maxFileSize}MB limit`,
  noPassword: "Please enter a password to unlock the PDF",
  incorrectPassword: "Incorrect password. Please try again.",
  noFilesUploaded: "Please upload at least one PDF file",
};

/**
 * UI Labels
 */
export const UI_LABELS = {
  // Upload step
  uploadTitle: "Upload Password-Protected PDF",
  addMoreFiles: "Replace File",
  continueToUnlock: "Continue to Unlock",
  
  // Edit step
  unlockSettings: "Unlock Settings",
  enterPassword: "Enter Password",
  passwordPlaceholder: "Enter PDF password",
  showPassword: "Show Password",
  hidePassword: "Hide Password",
  applyToAll: "Apply to All Files",
  unlockButton: "Unlock PDF",
  unlockAllButton: "Unlock PDF",
  
  // Processing
  unlocking: "Unlocking PDF...",
  verifyingPassword: "Verifying password...",
  removingProtection: "Removing protection...",
  
  // Success
  successTitle: "PDF Unlocked Successfully!",
  successMessage: "Your PDF has been unlocked and is ready to download.",
  unlockAnother: "Unlock Another PDF",
  
  // File list
  sourceFiles: "Source File",
  password: "Password",
  status: "Status",
  locked: "Locked",
  unlocked: "Unlocked",
  
  // Instructions
  instructions: "Instructions",
  step1: "Upload a password-protected PDF file",
  step2: "Enter the password for the file",
  step3: "Click 'Unlock PDF' to remove password protection",
  step4: "Download your unlocked PDF file",
};

/**
 * SEO Content
 */
export const SEO_CONTENT = {
  definition: {
    title: "What is PDF Unlocking?",
    content: `PDF unlocking is the process of removing password protection from PDF documents. Many PDFs are secured with passwords to prevent unauthorized access, editing, or printing. When you have the correct password, you can use our tool to remove this protection, making the PDF freely accessible without requiring a password for every access. This is useful when you need to edit, print, or share documents but don't want the inconvenience of password protection.

Our unlock PDF tool works entirely in your browser for maximum security. Your password and document never leave your device, ensuring complete privacy. The tool supports both user passwords (open passwords) and owner passwords (permissions passwords), allowing you to unlock PDFs for viewing, editing, copying, and printing.`,
  },
  
  howItWorks: {
    title: "How to Unlock a Password-Protected PDF",
    subtitle: "Remove PDF password protection in 4 easy steps",
    introText: "Follow this simple guide to unlock your password-protected PDF files quickly and securely:",
  },
  
  footer: {
    title: "Professional PDF Unlocking Made Simple",
    content: `WorkflowPro's Unlock PDF tool is designed for professionals, students, and anyone who needs to remove password protection from PDF files quickly and securely. Unlike other tools that upload your sensitive documents to remote servers, our tool processes everything locally in your browser, ensuring your passwords and files remain completely private.

Whether you need to unlock a single PDF or batch unlock multiple files, our tool handles it all with ease. Simply upload your password-protected PDFs, enter the passwords, and download the unlocked files — no registration, no software installation, and no hidden fees.

Our tool supports all types of PDF security, including user passwords and owner passwords. It works with PDFs from any source, whether created by Adobe Acrobat, Microsoft Word, or any other PDF creator. The unlocked PDFs maintain 100% of their original quality and formatting.

Try our free PDF unlocking tool today and experience the easiest way to remove password protection from your PDF documents.`,
  },
};

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have unsaved work. Are you sure you want to leave? All progress will be lost.";

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "Is it legal to unlock password-protected PDFs?",
    answer: "Yes, it's legal to unlock PDFs if you have the password and own the rights to the document. You should only unlock PDFs that you created or have permission to unlock.",
  },
  {
    question: "Is my password safe when unlocking PDFs?",
    answer: "Absolutely. All unlocking happens locally in your browser. Your password and PDF never leave your device, ensuring complete privacy and security.",
  },
  {
    question: "What if I don't know the password?",
    answer: "You must have the correct password to unlock a PDF. Our tool cannot crack or bypass passwords without the correct credentials. Contact the document owner if you need the password.",
  },
  {
    question: "Can I unlock multiple PDFs at once?",
    answer: "Currently, you can unlock one PDF file at a time. After unlocking, you can upload another file to process.",
  },
  {
    question: "Will the unlocked PDF lose quality?",
    answer: "No, the PDF quality remains 100% intact. We only remove the password protection; all content, formatting, and quality are preserved.",
  },
  {
    question: "What types of PDF passwords can be removed?",
    answer: "We can remove both user passwords (open passwords) and owner passwords (permissions passwords). You must provide the correct password in both cases.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Each PDF can be up to 100MB in size.",
  },
  {
    question: "Do I need to install any software?",
    answer: "No installation required! Our tool works directly in your web browser on any device — Windows, Mac, Linux, iOS, or Android.",
  },
  {
    question: "Is WorkflowPro free?",
    answer: "Yes — free to use with no watermarks or limitations on the number of files you can unlock.",
  },
  {
    question: "Can I unlock PDFs on mobile devices?",
    answer: "Yes! Our tool is fully responsive and works perfectly on smartphones and tablets.",
  },
];