/**
 * Edit PDF Page
 * 
 * Purpose: Allow users to edit PDF files by adding text, images, shapes, and annotations
 * 
 * Features:
 * - Full-screen PDF editor with horizontal toolbar
 * - Add text, images, shapes, highlights, and sticky notes
 * - Draw and annotate
 * - Form fields and signatures
 * - Undo/Redo functionality
 * - Zoom controls
 * - Page navigation
 * 
 * Steps:
 * 1. Upload: Select PDF file
 * 2. Edit: Full-screen editor (no header/footer)
 * 3. Complete: Download edited PDF
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Upload, FileEdit, Download, FileSignature, FileText, FileStack, 
  Split, Archive, RotateCw, Crop, GripVertical, Lock, Unlock, 
  FileType, FileImage, Shield, Layers 
} from 'lucide-react';
import { FileUploader } from '../../../components/tool/file-management/FileUploader';
import { FileListWithValidation } from '../../../components/tool/file-management/FileListWithValidation';
import { ToolPageLayout } from '../../../components/tool/layout/ToolPageLayout';
import { ToolPageHero } from '../../../components/tool/layout/ToolPageHero';
import { ToolSEOFooter } from '../../../components/tool/seo-sections/ToolSEOFooter';
import { SuccessHeader } from '../../../components/tool/success/SuccessHeader';
import { SeoHead } from '../../../src/seo/SeoHead';
import { ToolJsonLd } from '../../../src/seo/ToolJsonLd';
import { MobileStickyAd } from '../../../components/tool/ads/MobileStickyAd';
import { NavigationBlocker } from '../../../components/tool/processing/NavigationBlocker';
import { getPdfInfo } from '../../../utils/pdfUtils';
import { RelatedToolsSection } from '../../../components/tool/seo-sections/RelatedToolsSection';
import { ToolSuccessSection } from '../../../components/tool/success/ToolSuccessSection';
import { ToolDefinitionSection } from '../../../components/tool/seo-sections/ToolDefinitionSection';
import { HowItWorksSteps } from '../../../components/tool/seo-sections/HowItWorksSteps';
import { WhyChooseSection } from '../../../components/tool/seo-sections/WhyChooseSection';
import { UseCasesSection } from '../../../components/tool/seo-sections/UseCasesSection';
import { ToolFAQSection } from '../../../components/tool/seo-sections/ToolFAQSection';
import { ProcessingModal } from '../../../components/tool/processing/ProcessingModal';
import { PdfEditor } from '../../../components/pdf-editor/PdfEditor';
import { WHY_CHOOSE_WORKFLOWPRO } from '../../../src/config/whyChooseConfig';

export interface FileValidationInfo {
  file: File;
  isValidating: boolean;
  isValid: boolean;
  pageCount: number;
  error?: string;
}

const STEPS = [
  {
    number: 1,
    title: "Upload PDF",
    description: "Select the PDF file you want to edit and annotate.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Add Content",
    description: "Use our editing tools to add text, images, shapes, and annotations to your PDF.",
    icon: FileEdit,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Save Changes",
    description: "Review your edits and save the modified PDF.",
    icon: Download,
    iconBgColor: "from-blue-400 to-blue-500",
  },
];

const RELATED_TOOLS = [
  { name: "Add Watermark", description: "Add text or image watermarks", icon: FileSignature, onClick: () => window.location.href = "/watermark-pdf" },
  { name: "Add Page Numbers", description: "Add page numbers to PDFs", icon: FileText, onClick: () => window.location.href = "/add-page-numbers" },
  { name: "Merge PDF", description: "Combine multiple PDF files", icon: FileStack, onClick: () => window.location.href = "/merge-pdf" },
  { name: "Split PDF", description: "Extract pages from PDF", icon: Split, onClick: () => window.location.href = "/split-pdf" },
  { name: "Compress PDF", description: "Reduce PDF file size", icon: Archive, onClick: () => window.location.href = "/compress-pdf" },
  { name: "Rotate PDF", description: "Rotate PDF pages", icon: RotateCw, onClick: () => window.location.href = "/rotate-pdf" },
  { name: "Crop PDF", description: "Crop PDF pages", icon: Crop, onClick: () => window.location.href = "/crop-pdf" },
  { name: "Organize PDF", description: "Reorder PDF pages", icon: GripVertical, onClick: () => window.location.href = "/organize-pdf" },
  { name: "Extract Pages", description: "Extract specific pages", icon: FileText, onClick: () => window.location.href = "/extract-pdf-pages" },
  { name: "Delete Pages", description: "Remove unwanted pages", icon: FileText, onClick: () => window.location.href = "/delete-pdf-pages" },
  { name: "Sign PDF", description: "Add digital signatures", icon: FileSignature, onClick: () => window.location.href = "/sign-pdf" },
  { name: "Protect PDF", description: "Add password protection", icon: Lock, onClick: () => window.location.href = "/protect-pdf" },
  { name: "Unlock PDF", description: "Remove PDF passwords", icon: Unlock, onClick: () => window.location.href = "/unlock-pdf" },
  { name: "PDF to Word", description: "Convert PDF to Word", icon: FileType, onClick: () => window.location.href = "/pdf-to-word" },
  { name: "Word to PDF", description: "Convert Word to PDF", icon: FileType, onClick: () => window.location.href = "/word-to-pdf" },
  { name: "PDF to JPG", description: "Convert PDF to images", icon: FileImage, onClick: () => window.location.href = "/pdf-to-jpg" },
  { name: "JPG to PDF", description: "Convert images to PDF", icon: FileImage, onClick: () => window.location.href = "/jpg-to-pdf" },
  { name: "Redact PDF", description: "Redact sensitive content", icon: Shield, onClick: () => window.location.href = "/redact-pdf" },
  { name: "Compare PDF", description: "Compare two PDFs", icon: Layers, onClick: () => window.location.href = "/compare-pdf" },
  { name: "Flatten PDF", description: "Flatten PDF layers", icon: Layers, onClick: () => window.location.href = "/flatten-pdf" },
];

const FAQS = [
  {
    question: "Is it safe to edit PDFs with WorkflowPro?",
    answer: "Yes, absolutely! All PDF editing happens locally in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security."
  },
  {
    question: "Can I add text to existing PDFs?",
    answer: "Yes! Our PDF editor allows you to add custom text anywhere on your PDF pages. You can customize the font, size, color, and position of the text."
  },
  {
    question: "Can I insert images into my PDF?",
    answer: "Yes, you can easily add images to your PDF. Simply select the image tool, upload your image, and place it anywhere on the page."
  },
  {
    question: "What types of annotations can I add?",
    answer: "You can add text boxes, shapes (rectangles, circles, lines), highlights, drawings, and sticky notes to your PDF documents."
  },
  {
    question: "Will editing change the original PDF quality?",
    answer: "No, we preserve the original PDF quality while adding your edits on top. The underlying document remains unchanged."
  },
  {
    question: "Can I undo changes while editing?",
    answer: "Yes, our editor includes undo/redo functionality so you can easily revert any changes you make during the editing process."
  },
  {
    question: "Is there a file size limit for editing?",
    answer: "The maximum file size is 50MB. This allows for most PDFs while ensuring smooth editing performance."
  },
  {
    question: "Can I edit multiple PDFs at once?",
    answer: "Currently, you can edit one PDF at a time to ensure the best editing experience and performance."
  }
];

const USE_CASES = [
  "Add signatures, dates, or company logos to contracts and agreements",
  "Annotate textbooks and add notes to study materials",
  "Highlight important sections in educational documents",
  "Fill out PDF forms by adding text fields and checkboxes",
  "Add branding elements to PDF brochures and marketing materials",
  "Insert promotional text and images into business presentations",
  "Create interactive documents with clickable elements",
  "Mark up design documents with comments and feedback"
];

export default function EditPdfPage({ onWorkStateChange }: { onWorkStateChange?: (hasWork: boolean) => void } = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [processedFileName, setProcessedFileName] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Editing options
  const [textContent, setTextContent] = useState("");
  const [selectedTool, setSelectedTool] = useState<"text" | "image" | "shape" | "highlight">("text");

  useEffect(() => {
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

  const handleFilesSelected = async (newFiles: File[]) => {
    // Only allow 1 file for editing
    if (files.length >= 1) {
      setValidationMessage("Only 1 PDF file can be edited at a time.");
      setValidationType("warning");
      return;
    }

    const maxFileSize = 50;
    const file = newFiles[0];
    
    if (!file) return;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (ext !== '.pdf') {
      setValidationMessage("Only PDF files are allowed.");
      setValidationType("error");
      return;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      setValidationMessage(`File exceeds ${maxFileSize}MB limit.`);
      setValidationType("error");
      return;
    }

    // Accept file without deep validation - show as uploaded successfully
    setFiles([file]);
    setValidationMessage("");
    
    // Set as "valid" initially - actual validation happens on Continue
    const validationInfo: FileValidationInfo = {
      file,
      isValidating: false,
      isValid: true, // Accept as valid initially
      pageCount: 0, // Will be determined during actual validation
    };
    
    setFileValidationInfo([validationInfo]);
  };

  const handleRemoveFile = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
  };

  const handleContinueToEdit = async () => {
    // Validate PDF before allowing edit
    const file = files[0];
    if (!file) return;

    // Set validating state
    setFileValidationInfo([{
      file,
      isValidating: true,
      isValid: false,
      pageCount: 0,
    }]);

    try {
      // Perform actual PDF validation
      const pdfInfo = await getPdfInfo(file);
      
      if (!pdfInfo.isValid) {
        // PDF is corrupted or invalid - deny access
        setFileValidationInfo([{
          file,
          isValidating: false,
          isValid: false,
          pageCount: 0,
          error: pdfInfo.error || "Failed to read PDF file",
        }]);
        setValidationMessage("Cannot edit this PDF. The file appears to be corrupted or incomplete.");
        setValidationType("error");
        return;
      }

      // PDF is valid - update with page count and proceed
      setFileValidationInfo([{
        file,
        isValidating: false,
        isValid: true,
        pageCount: pdfInfo.pageCount,
      }]);
      
      setCurrentStep("edit");
    } catch (error) {
      // Unexpected error during validation
      setFileValidationInfo([{
        file,
        isValidating: false,
        isValid: false,
        pageCount: 0,
        error: "Failed to read PDF file",
      }]);
      setValidationMessage("Cannot edit this PDF. The file appears to be corrupted or incomplete.");
      setValidationType("error");
    }
  };

  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    const file = files[0];
    const mockPdfContent = `Edited PDF: ${file.name}`;
    const blob = new Blob([mockPdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setDownloadUrl(url);
    setProcessedFileName(file.name.replace('.pdf', '_edited.pdf'));
    setProgress(100);
    setCurrentStep("complete");
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setFileValidationInfo([]);
    setCurrentStep("upload");
    setProgress(0);
    setDownloadUrl("");
    setProcessedFileName("");
    setValidationMessage("");
  };

  const hasUnsavedWork = files.length > 0 && currentStep !== "complete";

  return (
    <>
      <SeoHead path="/edit-pdf" />
      <ToolJsonLd path="/edit-pdf" />
      <NavigationBlocker when={hasUnsavedWork} message="You have unsaved edits. Leave anyway?" onSamePageClick={handleReset} />

      {currentStep === "edit" ? (
        /* STEP 2: Edit Page - Full Screen PDF Editor - Rendered as Portal */
        createPortal(
          <PdfEditor
            fileName={files[0].name}
            totalPages={fileValidationInfo[0]?.pageCount || 1}
            onSave={handleProcessFiles}
            onExit={handleBackToUpload}
          />,
          document.body
        )
      ) : (
        /* All Other Steps - Normal Layout with Side Ads and Header */
        <>
          {/* Success Header - Full Width at Top (only on complete step) */}
          {currentStep === "complete" && (
            <SuccessHeader 
              title="PDF Edited Successfully!" 
              description="Your PDF has been edited and is ready to download" 
            />
          )}

          {/* Header Section - Full Width Above Layout - Hide on Complete Step */}
          {currentStep !== "complete" && (
            <ToolPageHero 
              title="Edit PDF" 
              description="Add text, images, shapes, and annotations to your PDF files — free and easy to use." 
            />
          )}

          <ToolPageLayout>
            {/* Mobile Sticky Ad Banner - Shows only on mobile/tablet, above upload section */}
            {currentStep === "upload" && <MobileStickyAd topOffset={64} height={100} />}

            {/* Main Tool Area */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {/* STEP 1: Upload File */}
              {currentStep === "upload" && (
                <>
                  <FileUploader
                    onFilesSelected={handleFilesSelected}
                    acceptedTypes=".pdf"
                    multiple={false}
                    maxFiles={1}
                    maxFileSize={50}
                    fileTypeLabel="PDF"
                    helperText="PDF files only · 1 file · 50MB max"
                    validationMessage={validationMessage}
                    validationType={validationType}
                  />
                  {files.length > 0 && (
                    <FileListWithValidation
                      files={fileValidationInfo}
                      onRemove={handleRemoveFile}
                      onContinue={handleContinueToEdit}
                      continueText="Continue to Edit"
                      continueDisabled={false}
                      showReorder={false}
                    />
                  )}
                </>
              )}

              {/* STEP 4: Download */}
              {currentStep === "complete" && (
                <ToolSuccessSection
                  files={{ url: downloadUrl, name: processedFileName, type: "pdf" as const }}
                  fileInfo={{ "Pages": fileValidationInfo[0]?.pageCount || 0 }}
                  onReset={handleReset}
                  resetButtonText="Edit Another PDF"
                  previewTitle="Edited PDF"
                  icon={FileEdit}
                />
              )}
            </div>

            {/* Related Tools Section - Show on complete step */}
            {currentStep === "complete" && (
              <RelatedToolsSection 
                tools={RELATED_TOOLS}
                introText="Continue working with your PDFs or explore other powerful tools."
              />
            )}

            {/* Only show these sections if NOT on complete step */}
            {currentStep !== "complete" && (
              <>
                {/* Related Tools Section - Now inside layout, fits between ads */}
                <RelatedToolsSection 
                  tools={RELATED_TOOLS}
                  introText="These tools work well with PDF editing and help you manage or convert your documents."
                />

                {/* Tool Definition Section - Now inside layout, fits between ads */}
                <ToolDefinitionSection
                  title="What is a PDF Editor?"
                  content="A PDF editor is a tool that allows you to modify, annotate, and enhance PDF documents without converting them to other formats. With WorkflowPro's PDF Editor, you can add text, insert images, draw shapes, highlight content, and create annotations directly on your PDF files. This makes it perfect for filling forms, marking up documents, adding signatures, or collaborating on shared files."
                />

                {/* How to Use Section - Now inside layout, fits between ads */}
                <HowItWorksSteps 
                  title="How It Works"
                  subtitle="Edit your PDF files in three simple steps with our intuitive interface"
                  introText="Follow these simple steps to edit your PDF files quickly and securely."
                  steps={STEPS} 
                />

                {/* Why Choose Us Section - Now inside layout, fits between ads */}
                <WhyChooseSection
                  title={WHY_CHOOSE_WORKFLOWPRO.title}
                  subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle}
                  introText={WHY_CHOOSE_WORKFLOWPRO.introText}
                  features={WHY_CHOOSE_WORKFLOWPRO.features}
                />

                {/* Use Cases Section - Now inside layout, fits between ads */}
                <UseCasesSection
                  title="Popular Uses for Editing PDFs"
                  useCases={USE_CASES}
                />

                {/* Tool FAQ Section - Now inside layout, fits between ads */}
                <ToolFAQSection
                  faqs={FAQS}
                />

                {/* SEO Footer - Now inside layout, fits between ads */}
                <ToolSEOFooter
                  title="About WorkflowPro's Edit PDF Tool"
                  content="WorkflowPro's Edit PDF tool helps you modify and annotate PDF files quickly and securely. Add text, images, shapes, and highlights to your documents — perfect for filling forms, marking up contracts, adding signatures, annotating reports, and more. Fast, simple, and always free."
                />
              </>
            )}
          </ToolPageLayout>
        </>
      )}

      {/* Processing Modal */}
      <ProcessingModal 
        isOpen={currentStep === "processing"} 
        progress={progress} 
        title="Editing PDF..." 
        description="Applying your changes" 
        icon={FileEdit} 
      />
    </>
  );
}
