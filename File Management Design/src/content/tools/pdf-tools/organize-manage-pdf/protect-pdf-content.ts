/**
 * Protect PDF Tool - Content Configuration
 * 
 * Centralized content for the Protect PDF tool page.
 * Structure mirrors unlock-pdf-content.ts for consistency.
 */

import { 
  Unlock, Merge, Split, Archive,
  Upload, Lock, Download, Shield
} from "lucide-react";

/**
 * Hero Section Content
 */
export const HERO_CONTENT = {
  title: "Protect PDF with Password",
  description: "Add password protection to your PDF files online for free. Secure your documents with strong encryption in seconds – no signup required.",
};

/**
 * Feature Highlights
 */
export const FEATURES = [
  {
    title: "🔒 Strong Encryption",
    description: "Industry-standard AES-256 encryption",
  },
  {
    title: "⚡ Instant Protection",
    description: "Add password security in seconds",
  },
  {
    title: "🎯 100% Private",
    description: "Your files never leave your device",
  },
  {
    title: "💯 Free Forever",
    description: "No signup, no watermarks, unlimited use",
  },
];

/**
 * Why Choose Content
 */
export const WHY_CHOOSE_CONTENT = {
  title: "Why Choose WorkflowPro for PDF Protection?",
  subtitle: "The most secure and user-friendly PDF protection tool online",
  introText: "WorkflowPro delivers fast, private, and secure PDF encryption trusted by professionals, students, and businesses. No signup required.",
  features: [
    {
      title: "Military-Grade Encryption",
      description: "Your PDFs are protected with AES-256 bit encryption, the same standard used by governments and financial institutions worldwide.",
    },
    {
      title: "100% Client-Side Processing",
      description: "All encryption happens in your browser. Your files and passwords never touch our servers, ensuring complete privacy and security.",
    },
    {
      title: "No File Size Limits",
      description: "Protect PDFs of any size – from single-page documents to large reports and presentations without restrictions.",
    },
    {
      title: "Cross-Platform Compatible",
      description: "Protected PDFs work on all devices and PDF readers including Adobe Acrobat, Chrome, Safari, and mobile apps.",
    },
  ],
};

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload PDF File",
    description: "Click or drag & drop your PDF file to begin. Your file is processed locally in your browser for maximum security.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Set Password",
    description: "Enter a strong password to protect your PDF. Choose a password that's easy to remember but hard to guess.",
    icon: Lock,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 3,
    title: "Protect & Download",
    description: "Click 'Protect PDF' and download your password-protected file instantly. The original file remains unchanged.",
    icon: Shield,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
  {
    name: "Unlock PDF",
    description: "Remove password protection from PDFs",
    href: "/unlock-pdf",
    icon: Unlock,
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into one",
    href: "/merge-pdf",
    icon: Merge,
  },
  {
    name: "Split PDF",
    description: "Extract pages from PDF",
    href: "/split-pdf",
    icon: Split,
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size",
    href: "/compress-pdf",
    icon: Archive,
  },
];

/**
 * Use Cases
 */
export const USE_CASES = [
  "Protect sensitive business documents, contracts, and agreements with password encryption before sharing",
  "Secure financial statements, invoices, and tax documents with password protection for privacy",
  "Add password protection to personal documents like resumes, medical records, and legal papers",
  "Protect exam papers, answer keys, and proprietary educational content from unauthorized access",
  "Share password-protected proposals, designs, and reports with clients for added security",
  "Secure legal contracts, NDAs, and sensitive legal documents before electronic distribution",
];

export const USE_CASES_TITLE = "When to Protect Your PDFs";

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
  invalidFileType: "Please upload only PDF files (.pdf)",
  fileTooLarge: `File size exceeds ${UPLOAD_CONFIG.maxFileSize}MB limit`,
  noPassword: "Please enter a password to protect the PDF",
  weakPassword: "Password should be at least 6 characters long",
  passwordMismatch: "Passwords do not match",
};

/**
 * UI Labels
 */
export const UI_LABELS = {
  // Upload step
  uploadTitle: "Upload PDF to Protect",
  replaceFile: "Replace File",
  continueToProtect: "Continue to Protect",
  
  // Edit step
  protectSettings: "Protection Settings",
  setPassword: "Set Password",
  passwordPlaceholder: "Enter a strong password",
  confirmPassword: "Confirm Password",
  confirmPasswordPlaceholder: "Re-enter your password",
  showPassword: "Show Password",
  hidePassword: "Hide Password",
  protectButton: "Protect PDF",
  
  // Password strength
  weak: "Weak",
  medium: "Medium",
  strong: "Strong",
  veryStrong: "Very Strong",
  
  // Processing
  protecting: "Protecting PDF...",
  encrypting: "Applying encryption...",
  finalizing: "Finalizing protection...",
  
  // Success
  successTitle: "PDF Protected Successfully!",
  successMessage: "Your PDF has been encrypted and is ready to download.",
  protectAnother: "Protect Another PDF",
  
  // File list
  sourceFile: "Source File",
  protectionStatus: "Protection Status",
  unprotected: "Unprotected",
  protected: "Protected",
  
  // Instructions
  instructions: "Instructions",
  step1: "Upload a PDF file you want to protect",
  step2: "Set a strong password for the PDF",
  step3: "Confirm your password",
  step4: "Click 'Protect PDF' to apply encryption",
  step5: "Download your password-protected PDF file",
};

/**
 * SEO Content
 */
export const SEO_CONTENT = {
  definition: {
    title: "What is PDF Password Protection?",
    content: `PDF password protection is a security feature that encrypts a PDF file and requires a password to open it. This prevents unauthorized access to sensitive information contained in the document.

When you protect a PDF with a password, the entire file is encrypted using strong cryptographic algorithms (typically AES-256). This means that without the correct password, the file contents cannot be read or accessed, even if someone obtains a copy of the file.

WorkflowPro's PDF protection tool adds military-grade encryption to your files instantly and completely free. All processing happens in your browser, ensuring your files and passwords remain completely private and never touch our servers.`,
  },
  
  howItWorks: {
    title: "How to Protect a PDF with Password",
    subtitle: "Secure your PDF files in 3 simple steps",
    introText: "Follow these steps to add password protection to your PDF files:",
  },
  
  footer: {
    title: "Secure Your PDF Files with Password Protection",
    content: `Protecting your PDF files with a password is essential for maintaining document security and privacy. Whether you're sharing confidential business documents, financial reports, legal contracts, or personal information, password protection ensures that only authorized individuals can access your files.

WorkflowPro's free PDF protection tool makes it easy to add strong encryption to your documents in seconds. Our tool uses industry-standard AES-256 encryption, the same level of security used by governments and financial institutions worldwide.

**Key Benefits:**
- **Complete Privacy:** All encryption happens in your browser – your files never leave your device
- **Strong Security:** Military-grade AES-256 encryption protects your documents
- **Universal Compatibility:** Protected PDFs work on all devices and PDF readers
- **No Cost:** Completely free with no signup required
- **No Watermarks:** Clean, professional output without any branding

**Perfect For:**
- Business professionals securing confidential documents
- Financial advisors protecting client information
- Legal professionals securing sensitive contracts
- Educators protecting exam materials and answer keys
- Individuals securing personal documents and records

**Security Note:** Remember your password! Once a PDF is password-protected, you'll need the password to open it. If you forget the password, the file cannot be recovered.

Start protecting your PDF files today with WorkflowPro – the trusted choice for secure, private, and free PDF encryption.`,
  },
};

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = 
  "You have an unsaved PDF. Are you sure you want to leave? Your progress will be lost.";

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "Is PDF password protection secure?",
    answer: "Yes, WorkflowPro uses industry-standard AES-256 encryption to protect your PDFs. This is the same military-grade encryption used by governments and financial institutions. All encryption happens in your browser, ensuring your files and passwords never touch our servers.",
  },
  {
    question: "Can I protect multiple PDFs at once?",
    answer: "Currently, you can protect one PDF file at a time. After protecting a file, you can upload another one to process.",
  },
  {
    question: "What happens if I forget the password?",
    answer: "If you forget the password, there is no way to recover or open the protected PDF. Make sure to remember your password or store it securely. We recommend using a password manager for important documents.",
  },
  {
    question: "Will the protected PDF work on all devices?",
    answer: "Yes, password-protected PDFs created with WorkflowPro are compatible with all major PDF readers including Adobe Acrobat, Chrome, Safari, Firefox, and mobile PDF apps on iOS and Android.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Each PDF can be up to 100MB in size.",
  },
  {
    question: "Do you store my files or passwords?",
    answer: "No, we never store your files or passwords. All PDF encryption happens directly in your browser using JavaScript. Your files and passwords remain completely private and never leave your device.",
  },
  {
    question: "Can I remove the password later?",
    answer: "Yes, you can use our 'Unlock PDF' tool to remove password protection from a PDF. You'll need to enter the correct password to unlock it.",
  },
  {
    question: "What makes a strong password?",
    answer: "A strong password should be at least 8-12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters. Avoid using common words, personal information, or predictable patterns.",
  },
  {
    question: "Is this tool really free?",
    answer: "Yes, WorkflowPro's PDF protection tool is completely free with no hidden costs. You can protect unlimited PDFs without any signup or subscription. There are no watermarks added to your files.",
  },
  {
    question: "How long does the protection process take?",
    answer: "Protection is nearly instant – typically taking just 2-5 seconds depending on file size. Large files may take a few seconds longer.",
  },
];