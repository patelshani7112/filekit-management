/**
 * Excel to PDF Tool - Content Configuration
 * 
 * Centralized content for the Excel to PDF converter tool page.
 */

import { 
  Upload, FileType, Download, RefreshCw,
  FileText, FilePlus, Archive, FileImage
} from "lucide-react";

/**
 * Hero Section Content
 */
export const HERO_CONTENT = {
  title: "Excel to PDF Converter",
  description: "Convert Excel spreadsheets (.xls, .xlsx, .xlsm) to PDF online for free. Perfect formatting preservation, no signup required – fast, secure, and easy to use.",
};

/**
 * Feature Highlights
 */
export const FEATURES = [
  {
    title: "📊 Perfect Layout",
    description: "Preserves all formatting, formulas, and charts",
  },
  {
    title: "⚡ Instant Conversion",
    description: "Convert Excel to PDF in seconds",
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
  title: "Why Choose WorkflowPro for Excel to PDF Conversion?",
  subtitle: "The most reliable and feature-rich Excel to PDF converter online",
  introText: "WorkflowPro delivers fast, accurate, and secure Excel to PDF conversion trusted by professionals, students, and businesses worldwide. No signup required.",
  features: [
    {
      icon: "⚡",
      title: "Lightning-Fast Conversion",
      description: "Convert Excel spreadsheets to PDF in seconds with our optimized conversion engine. No waiting, no delays.",
    },
    {
      icon: "🔒",
      title: "100% Secure & Private",
      description: "All conversions happen in your browser. Your Excel files never leave your device, ensuring complete privacy and security.",
    },
    {
      icon: "🎨",
      title: "Perfect Formatting Preservation",
      description: "Maintains all formatting, formulas, charts, images, and styles exactly as they appear in your original Excel file.",
    },
    {
      icon: "📱",
      title: "Works on Any Device",
      description: "Convert Excel to PDF on desktop, tablet, or mobile. Our responsive design works seamlessly across all devices.",
    },
    {
      icon: "💯",
      title: "Completely Free",
      description: "No hidden costs, no subscriptions, no watermarks. Unlimited conversions, forever free.",
    },
    {
      icon: "🚀",
      title: "No Software Installation",
      description: "Works entirely in your browser. No downloads, no installations, no registration required.",
    },
  ],
};

/**
 * How It Works Steps
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Excel Files",
    description: "Click to upload or drag and drop your Excel files (.xls, .xlsx, .xlsm). You can convert multiple files at once.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Configure Settings",
    description: "Choose your output format (PDF by default), adjust conversion options, and customize settings like preserving formatting and embedding fonts.",
    icon: FileType,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Convert to PDF",
    description: "Click the convert button and watch as your Excel files are instantly converted to PDF with perfect formatting.",
    icon: RefreshCw,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Your PDF",
    description: "Download your converted PDF files individually or as a zip archive. Your original files remain unchanged.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

/**
 * Related Tools
 */
export const RELATED_TOOLS = [
  {
    name: "Word to PDF",
    description: "Convert Word documents to PDF",
    icon: FileText,
    href: "/word-to-pdf",
    color: "blue",
  },
  {
    name: "PDF to Excel",
    description: "Extract data from PDF to Excel",
    icon: FileType,
    href: "/pdf-to-excel",
    color: "green",
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into one",
    icon: FilePlus,
    href: "/merge-pdf",
    color: "purple",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size",
    icon: Archive,
    href: "/compress-pdf",
    color: "orange",
  },
];

/**
 * Use Cases
 */
export const USE_CASES_TITLE = "When to Use Excel to PDF Converter";

export const USE_CASES = [
  "Convert financial spreadsheets, budgets, and forecasts to PDF for professional presentations",
  "Transform sales reports, performance dashboards, and KPI tracking into shareable PDFs",
  "Convert Excel invoices, receipts, and billing statements for professional documentation",
  "Transform grade sheets, attendance records, and educational data for secure sharing",
  "Convert inventory lists, stock reports, and product catalogs to PDF for easy distribution",
  "Transform project timelines, task lists, and resource allocation sheets for team collaboration",
  "Convert business analytics, charts, and data visualizations to PDF for presentations",
  "Transform expense tracking sheets and financial statements into PDF for record-keeping",
  "Convert customer databases and contact lists to PDF for offline access and sharing",
  "Transform product pricing sheets and quotations to PDF for client proposals",
];

/**
 * Upload Configuration
 */
export const UPLOAD_CONFIG = {
  acceptedTypes: ".xls,.xlsx,.xlsm,.xlsb,.xltx,.xltm",
  maxFiles: 10,
  maxFileSize: 50, // MB
  allowMultiple: true,
  fileTypeLabel: "Excel Files",
  helperText: "Supports .xls, .xlsx, .xlsm, and other Excel formats. Max 50MB per file.",
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  invalidFileType: (count: number) => 
    count === 1 
      ? "Invalid file type. Please upload Excel files only (.xls, .xlsx, .xlsm)."
      : `${count} files are not valid Excel files. Please upload .xls, .xlsx, or .xlsm files only.`,
  fileTooLarge: (count: number, maxSize: number) => 
    count === 1 
      ? `File exceeds the ${maxSize}MB size limit.` 
      : `${count} files exceed the ${maxSize}MB size limit.`,
  maxFilesReached: (maxFiles: number) => 
    `Maximum ${maxFiles} files allowed. Please remove some files before adding more.`,
  tooManyFiles: (maxFiles: number) => 
    `Only the first ${maxFiles} files were added. Maximum ${maxFiles} files allowed.`,
  limitReached: (added: number, maxFiles: number, current: number) =>
    `Added ${added} files. You can only upload ${maxFiles} files at a time (${current} already uploaded).`,
  invalidExcelFile: "Invalid Excel file. The file may be corrupted or in an unsupported format.",
};

/**
 * UI Labels
 */
export const UI_LABELS = {
  // Upload step
  uploadTitle: "Upload Excel Files",
  replaceFile: "Add More Files",
  continueToConvert: "Continue to Convert",
  
  // Edit step
  conversionSettings: "Conversion Settings",
  outputFilename: "Output Filename",
  preserveFormatting: "Preserve Formatting",
  embedFonts: "Embed Fonts",
  convertButton: "Convert to PDF",
  
  // Processing
  converting: "Converting to PDF...",
  processing: "Processing spreadsheets...",
  finalizing: "Finalizing conversion...",
  
  // Success
  successTitle: "Your PDF is Ready!",
  successMessage: "Your Excel spreadsheets have been converted to PDF.",
  convertAnother: "Convert More Files",
  
  // File list
  sourceFiles: "Source Files",
  readyToConvert: "Ready to Convert",
};

/**
 * SEO Content
 */
export const SEO_CONTENT = {
  definition: {
    title: "What is Excel to PDF Conversion?",
    content: `
      <p>Excel to PDF conversion is the process of transforming Microsoft Excel spreadsheets (.xls, .xlsx, .xlsm) into Portable Document Format (PDF) files. This conversion preserves the layout, formatting, charts, and formulas of your Excel spreadsheets while creating a universal document format that can be viewed on any device without requiring Excel software.</p>
      
      <p>PDF is the industry standard for sharing documents because it maintains consistent formatting across all platforms and devices. When you convert Excel to PDF, you ensure that your spreadsheets look exactly the same for everyone who views them, regardless of whether they have Excel installed or what operating system they're using.</p>
      
      <p>WorkflowPro's Excel to PDF converter maintains perfect fidelity to your original spreadsheet, preserving all formatting, charts, images, and cell styles. The conversion happens entirely in your browser, ensuring your sensitive financial or business data remains completely private and secure.</p>
    `,
  },
  howItWorks: {
    title: "How to Convert Excel to PDF",
    subtitle: "Simple 4-step process to convert your Excel files",
    introText: "Converting Excel spreadsheets to PDF has never been easier. Follow these simple steps to transform your .xls or .xlsx files into professional PDF documents in seconds.",
  },
  footer: {
    title: "Professional Excel to PDF Conversion Made Easy",
    content: `
      <p>WorkflowPro's Excel to PDF converter is designed for professionals, students, and businesses who need reliable, fast, and secure spreadsheet conversion. Whether you're converting financial reports, invoices, data analysis, or any other Excel spreadsheet, our tool delivers perfect results every time.</p>
      
      <p>Unlike desktop software that requires installation and updates, our web-based converter works instantly in your browser. There's no software to download, no registration required, and no limitations on the number of files you can convert. Your Excel files are processed locally in your browser, ensuring complete privacy and security for your sensitive data.</p>
      
      <p>Our advanced conversion engine preserves all aspects of your Excel spreadsheets including formatting, formulas, charts, images, cell styles, and conditional formatting. Whether you're converting simple data tables or complex financial models with multiple sheets, WorkflowPro ensures your PDFs look exactly like your original Excel files.</p>
      
      <p>Start converting your Excel files to PDF today – completely free, with no registration required, and with the confidence that your data remains 100% private and secure.</p>
    `,
  },
};

/**
 * FAQ Items
 */
export const FAQ_ITEMS = [
  {
    question: "What Excel formats can I convert to PDF?",
    answer: "WorkflowPro supports all major Excel formats including .xls (Excel 97-2003), .xlsx (Excel 2007 and later), .xlsm (Excel Macro-Enabled), .xlsb (Excel Binary), and .xltx (Excel Template). Our converter handles single and multi-sheet workbooks with perfect formatting preservation.",
  },
  {
    question: "Will my Excel charts and graphs be preserved in the PDF?",
    answer: "Yes! All charts, graphs, images, and visual elements in your Excel spreadsheet are perfectly preserved in the converted PDF. The conversion maintains the exact appearance of your charts including colors, styles, and data labels.",
  },
  {
    question: "Can I convert password-protected Excel files?",
    answer: "Currently, password-protected Excel files need to be unlocked before conversion. If your Excel file is password-protected, you'll need to remove the password in Excel first, then convert it to PDF using our tool.",
  },
  {
    question: "How many Excel files can I convert at once?",
    answer: "You can convert up to 10 Excel files at once. Each file can be up to 50MB in size. If you need to convert more files, simply process them in batches or convert them again after completing the first batch.",
  },
  {
    question: "Does the converter preserve Excel formulas?",
    answer: "The PDF format displays the calculated results of your Excel formulas. While formulas themselves cannot be preserved in PDF (as PDF is a static format), the values calculated by your formulas will appear exactly as they do in Excel.",
  },
  {
    question: "Can I convert Excel files with multiple sheets?",
    answer: "Yes! When you convert an Excel workbook with multiple sheets, each sheet is converted to a separate page in the PDF, maintaining the exact layout and formatting of each worksheet.",
  },
  {
    question: "Is my Excel data secure during conversion?",
    answer: "Absolutely! All conversions happen locally in your browser. Your Excel files never leave your device and are never uploaded to any server. This ensures complete privacy and security for your sensitive financial or business data.",
  },
  {
    question: "What's the maximum file size for Excel conversion?",
    answer: "Each Excel file can be up to 50MB in size. This is sufficient for most spreadsheets, including those with extensive data, charts, and images. If your file exceeds this limit, consider splitting it into smaller workbooks.",
  },
  {
    question: "Can I merge multiple Excel files into one PDF?",
    answer: "Yes! When converting multiple Excel files, you have the option to merge them into a single PDF document or download them as separate PDF files. The merge option combines all spreadsheets into one continuous PDF.",
  },
  {
    question: "Does the converter work on mobile devices?",
    answer: "Yes! WorkflowPro's Excel to PDF converter is fully responsive and works on all devices including smartphones, tablets, and desktop computers. The interface adapts to your screen size for optimal usability.",
  },
];

/**
 * Output Formats
 */
export const OUTPUT_FORMATS = [
  // Document Formats
  { id: "pdf", name: "PDF", extension: "pdf", category: "Document", description: "Portable Document Format" },
  { id: "docx", name: "Word", extension: "docx", category: "Document", description: "Microsoft Word Document" },
  { id: "doc", name: "Word 97-2003", extension: "doc", category: "Document", description: "Legacy Word Format" },
  { id: "odt", name: "ODT", extension: "odt", category: "Document", description: "OpenDocument Text" },
  { id: "rtf", name: "RTF", extension: "rtf", category: "Document", description: "Rich Text Format" },
  { id: "txt", name: "Text", extension: "txt", category: "Document", description: "Plain Text" },
  
  // Image Formats
  { id: "jpg", name: "JPG / JPEG", extension: "jpg", category: "Image", description: "JPEG Image" },
  { id: "png", name: "PNG", extension: "png", category: "Image", description: "Portable Network Graphics" },
  { id: "gif", name: "GIF", extension: "gif", category: "Image", description: "Graphics Interchange Format" },
  { id: "bmp", name: "BMP", extension: "bmp", category: "Image", description: "Bitmap Image" },
  { id: "tiff", name: "TIFF", extension: "tiff", category: "Image", description: "Tagged Image File Format" },
  { id: "webp", name: "WebP", extension: "webp", category: "Image", description: "Modern Web Image Format" },
  { id: "svg", name: "SVG", extension: "svg", category: "Image", description: "Scalable Vector Graphics" },
  
  // Spreadsheet Formats
  { id: "xlsx", name: "Excel", extension: "xlsx", category: "Spreadsheet", description: "Microsoft Excel" },
  { id: "xls", name: "Excel 97-2003", extension: "xls", category: "Spreadsheet", description: "Legacy Excel Format" },
  { id: "csv", name: "CSV", extension: "csv", category: "Spreadsheet", description: "Comma Separated Values" },
  { id: "ods", name: "ODS", extension: "ods", category: "Spreadsheet", description: "OpenDocument Spreadsheet" },
  { id: "tsv", name: "TSV", extension: "tsv", category: "Spreadsheet", description: "Tab Separated Values" },
  
  // Archive Formats
  { id: "zip", name: "ZIP", extension: "zip", category: "Archive", description: "ZIP Archive" },
  { id: "rar", name: "RAR", extension: "rar", category: "Archive", description: "RAR Archive" },
  { id: "7z", name: "7Z", extension: "7z", category: "Archive", description: "7-Zip Archive" },
  
  // Other Formats
  { id: "html", name: "HTML", extension: "html", category: "Web", description: "Web Page" },
  { id: "xml", name: "XML", extension: "xml", category: "Data", description: "Extensible Markup Language" },
  { id: "json", name: "JSON", extension: "json", category: "Data", description: "JavaScript Object Notation" },
];

export const OUTPUT_FORMAT_CATEGORIES = ["Document", "Image", "Spreadsheet", "Archive", "Web", "Data"];

/**
 * Navigation Blocker Message
 */
export const NAVIGATION_BLOCKER_MESSAGE = "You have unsaved changes. Are you sure you want to leave?";