/**
 * Sign PDF Content
 * 
 * All content for the Sign PDF tool page
 */

import {
  FileEdit,
  Droplet,
  EyeOff,
  Lock,
  Merge,
  Archive,
  Upload,
  PenTool,
  MousePointer,
  Download,
} from "lucide-react";

export const HERO_CONTENT = {
  title: "Sign PDF Online - Free Digital PDF Signature Tool",
  description: "Add your digital signature to PDF documents quickly and securely. Draw, type, or upload your signature. No registration required.",
};

export const FEATURES = [
  {
    title: "Multiple Signature Options",
    description: "Draw with mouse/touch, type text, or upload signature images",
  },
  {
    title: "Secure & Private",
    description: "All files processed in your browser. Nothing uploaded to servers.",
  },
  {
    title: "Professional Quality",
    description: "High-quality signatures embedded directly into PDFs",
  },
  {
    title: "Easy Positioning",
    description: "Drag and resize signatures anywhere on your document",
  },
];

export const WHY_CHOOSE_CONTENT = {
  title: "Why Choose WorkflowPro for Signing PDFs?",
  subtitle: "The fastest and most secure way to sign PDF documents online",
  introText: "WorkflowPro provides professional PDF signing capabilities with complete privacy. Sign contracts, forms, and documents in seconds without any software installation.",
};

export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Your PDF",
    description: "Select the PDF document you need to sign. Supports files up to 50MB.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Create Your Signature",
    description: "Draw with your mouse/finger, type your name, or upload an existing signature image.",
    icon: PenTool,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Position & Customize",
    description: "Place your signature anywhere on the document. Resize and adjust as needed.",
    icon: MousePointer,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Signed PDF",
    description: "Get your professionally signed PDF instantly. Ready to send or submit.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

export const RELATED_TOOLS = [
  {
    name: "Edit PDF",
    description: "Add text, images, and shapes to PDFs",
    icon: FileEdit,
    href: "/edit-pdf",
  },
  {
    name: "Watermark PDF",
    description: "Add text or image watermarks",
    icon: Droplet,
    href: "/watermark-pdf",
  },
  {
    name: "Redact PDF",
    description: "Permanently remove sensitive information",
    icon: EyeOff,
    href: "/redact-pdf",
  },
  {
    name: "Protect PDF",
    description: "Add password protection to PDFs",
    icon: Lock,
    href: "/protect-pdf",
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into one",
    icon: Merge,
    href: "/merge-pdf",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size",
    icon: Archive,
    href: "/compress-pdf",
  },
];

export const USE_CASES_TITLE = "Common Use Cases for PDF Signing";

// Use cases for signing PDF documents - array of strings
export const USE_CASES = [
  "Sign business contracts, NDAs, and employment agreements digitally without printing",
  "Add legally binding signatures to legal forms, affidavits, and court documents",
  "Sign loan applications, tax forms, and financial documents securely online",
  "Sign lease agreements, purchase contracts, and property documents electronically",
  "Sign consent forms, HIPAA documents, and medical release forms digitally",
  "Sign recommendation letters, transcripts, and educational forms quickly",
];

export const UPLOAD_CONFIG = {
  acceptedTypes: [".pdf"],
  maxFiles: 10,
  maxFileSize: 50, // MB
  fileTypeLabel: "PDF",
  helperText: "Upload up to 10 PDF files to add your signature (max 50MB each)",
};

export const VALIDATION_MESSAGES = {
  maxFilesReached: (max: number) => `Maximum ${max} files allowed. Please remove some files to upload more.`,
  invalidFileType: (count: number) => `${count} file${count > 1 ? 's were' : ' was'} rejected. Only PDF files are supported.`,
  fileSizeExceeded: (count: number, maxSize: number) => `${count} file${count > 1 ? 's exceed' : ' exceeds'} the ${maxSize}MB size limit.`,
  invalidPdfFile: "This PDF file appears to be corrupted or invalid.",
};

export const UI_LABELS = {
  continueToSign: "Continue to Sign",
  signatureSettings: "Signature Settings",
  sourceFile: "Source File",
  removeFile: "Remove file",
  signatureType: "Signature Type",
  drawSignature: "Draw",
  typeSignature: "Type",
  uploadSignature: "Upload",
  signatureText: "Your Name",
  signatureTextPlaceholder: "Enter your name",
  fontFamily: "Font Style",
  signatureSize: "Signature Size",
  signatureColor: "Color",
  transparency: "Transparency",
  uploadImage: "Upload Image",
  clearSignature: "Clear",
  outputSettings: "Output Settings",
  fileName: "Filename",
  fileNamePlaceholder: "signed.pdf",
  signPdf: "Sign PDF",
  signAnother: "Sign Another PDF",
  successTitle: "PDF Signed Successfully!",
  successDescription: "Your document has been signed. Download it below.",
  processing: {
    title: "Signing Your PDF...",
    description: "Please wait while we apply your signature to the document.",
  },
  instructions: {
    draw: "Use your mouse or finger to draw your signature in the box below.",
    type: "Type your name and select a font style for your signature.",
    upload: "Upload an image file (PNG, JPG) of your signature.",
    position: "Click on the PDF to place your signature. Drag to reposition, resize with corners.",
  },
};

export const SEO_CONTENT = {
  definition: {
    title: "What is PDF Signing?",
    content: "PDF signing is the process of adding a digital signature to a PDF document to verify the signer's identity and ensure document authenticity. WorkflowPro's online PDF signing tool allows you to create and add signatures to PDFs directly in your browser without installing software. Your signature can be drawn, typed, or uploaded as an image, and is embedded into the PDF file for professional document signing.",
  },
  howItWorks: {
    title: "How to Sign a PDF Online",
    subtitle: "Follow these simple steps to add your signature",
    introText: "Signing PDFs online with WorkflowPro is fast and secure:",
  },
  footer: {
    title: "Sign PDFs Securely with WorkflowPro",
    content: "WorkflowPro's PDF signing tool provides a professional, secure way to sign documents online. Whether you need to sign business contracts, legal forms, or personal documents, our tool makes it easy. With multiple signature creation options (draw, type, upload), precise positioning controls, and complete browser-based processing, you can sign PDFs confidently knowing your documents remain private. No registration, no email required—just upload, sign, and download your signed PDF instantly. Perfect for remote work, digital contracts, and paperless workflows.",
  },
};

export const NAVIGATION_BLOCKER_MESSAGE = "You have an unsigned document. Are you sure you want to leave?";

export const FAQ_ITEMS = [
  {
    question: "Is my PDF secure when signing online?",
    answer: "Yes, absolutely secure. All signing happens directly in your browser using client-side JavaScript. Your PDF never leaves your device, and no data is uploaded to our servers. Your signature and document remain completely private.",
  },
  {
    question: "Are digital signatures legally binding?",
    answer: "Yes, digital signatures created with PDF signing tools are legally binding in most countries under laws like the ESIGN Act (USA) and eIDAS (EU). However, for certain legal or financial documents, you may need a certificate-based digital signature. Our tool creates standard electronic signatures suitable for most business documents.",
  },
  {
    question: "Can I sign multiple pages in one PDF?",
    answer: "Yes! After creating your signature, you can navigate through all pages of your PDF and add your signature to as many pages as needed. Each signature can be positioned and sized independently.",
  },
  {
    question: "What file formats are supported for signature upload?",
    answer: "You can upload signature images in PNG or JPG format. For best results, use a transparent PNG image with your signature on a clear background.",
  },
  {
    question: "Can I save my signature for future use?",
    answer: "Currently, signatures are not saved between sessions for privacy reasons. However, you can keep a signature image file on your device and upload it each time you need to sign a document.",
  },
  {
    question: "Will my signature look professional?",
    answer: "Yes! Our tool embeds high-quality signatures directly into your PDF. Whether drawn, typed, or uploaded, your signature will appear crisp and professional in the final document.",
  },
  {
    question: "Is there a limit to PDF file size?",
    answer: "You can sign up to 10 PDF files at once, with each file up to 50MB in size. This is sufficient for most documents, including multi-page contracts and forms.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account required! WorkflowPro's Sign PDF tool works instantly without registration, login, or email verification. Upload your PDF and start signing immediately.",
  },
];