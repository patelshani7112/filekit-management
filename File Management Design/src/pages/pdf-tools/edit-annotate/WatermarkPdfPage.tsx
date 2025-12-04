/**
 * Watermark PDF Page
 * 
 * Purpose: Add text or image watermarks to PDF files
 */

import { useState, useEffect } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import { ToolPageLayout } from "../../../components/tool/layout/ToolPageLayout";
import { WatermarkEditorLayout } from "../../../components/watermark/WatermarkEditorLayout";
import { WatermarkToolbar } from "../../../components/watermark/WatermarkToolbar";
import { PageThumbnails } from "../../../components/watermark/PageThumbnails";
import { WatermarkCanvas } from "../../../components/watermark/WatermarkCanvas";
import { WatermarkSettingsPanel } from "../../../components/watermark/WatermarkSettingsPanel";
import { ToolPageHero } from "../../../components/tool/layout/ToolPageHero";
import { FileUploader } from "../../../components/tool/file-management/FileUploader";
import { FileListWithValidation, FileValidationInfo } from "../../../components/tool/file-management/FileListWithValidation";
import { NavigationBlocker } from "../../../components/tool/processing/NavigationBlocker";
import { ProcessingModal } from "../../../components/tool/processing/ProcessingModal";
import { SuccessHeader } from "../../../components/tool/success/SuccessHeader";
import { ToolSuccessSection } from "../../../components/tool/success/ToolSuccessSection";
import { RelatedToolsSection } from "../../../components/tool/seo-sections/RelatedToolsSection";
import { HowItWorksSteps } from "../../../components/tool/seo-sections/HowItWorksSteps";
import { WhyChooseSection } from "../../../components/tool/seo-sections/WhyChooseSection";
import { ToolFAQSection } from "../../../components/tool/seo-sections/ToolFAQSection";
import { ToolDefinitionSection } from "../../../components/tool/seo-sections/ToolDefinitionSection";
import { UseCasesSection } from "../../../components/tool/seo-sections/UseCasesSection";
import { ToolSEOFooter } from "../../../components/tool/seo-sections/ToolSEOFooter";
import { MobileStickyAd } from "../../../components/tool/ads/MobileStickyAd";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Droplets } from "lucide-react";
import { getPdfInfo } from "../../../utils/pdfUtils";
import * as CONTENT from "../../../content/tools/pdf-tools/edit-annotate/watermark-pdf-content";

export default function WatermarkPdfPage({ onWorkStateChange }: { onWorkStateChange?: (hasWork: boolean) => void } = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [processedFileName, setProcessedFileName] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Editor state
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Watermark settings with comprehensive options
  const [watermarkSettings, setWatermarkSettings] = useState({
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
  });

  // Generate page thumbnails
  const pageThumbnails = fileValidationInfo.flatMap((info, fileIndex) => 
    Array.from({ length: info.pageCount }, (_, pageIndex) => ({
      pageNumber: fileIndex * 100 + pageIndex + 1, // Simple unique page numbering
      hasWatermark: watermarkSettings.applyTo === "all" || watermarkSettings.applyTo === "current",
    }))
  );

  const totalPages = pageThumbnails.length;

  useEffect(() => {
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

  const handleFilesSelected = async (newFiles: File[]) => {
    const maxFiles = 10;
    const maxFileSize = 50; // MB
    const currentFileCount = files.length;
    const availableSlots = maxFiles - currentFileCount;
    
    // Clear previous validation messages
    setValidationMessage("");
    
    // Check file count limit
    if (currentFileCount >= maxFiles) {
      setValidationMessage(`Maximum ${maxFiles} files allowed. Please remove some files before adding more.`);
      setValidationType("warning");
      return;
    }
    
    // Validate file types (PDF only)
    const invalidFiles = newFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return ext !== '.pdf';
    });
    
    if (invalidFiles.length > 0) {
      setValidationMessage(`Only PDF files are allowed. ${invalidFiles.length} invalid file(s) removed.`);
      setValidationType("error");
      newFiles = newFiles.filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return ext === '.pdf';
      });
    }
    
    // Validate file sizes
    const oversizedFiles = newFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setValidationMessage(`${oversizedFiles.length} file(s) exceed ${maxFileSize}MB limit and were removed.`);
      setValidationType("error");
      newFiles = newFiles.filter(file => file.size <= maxFileSize * 1024 * 1024);
    }
    
    // Check available slots
    const filesToAdd = availableSlots < newFiles.length 
      ? newFiles.slice(0, availableSlots)
      : newFiles;
    
    if (filesToAdd.length < newFiles.length) {
      setValidationMessage(`Only ${filesToAdd.length} file(s) added. Maximum ${maxFiles} files allowed (you have ${currentFileCount} already).`);
      setValidationType("warning");
    }
    
    if (filesToAdd.length === 0) return;
    
    const startIndex = files.length;
    
    // Add files to state
    setFiles((prev) => [...prev, ...filesToAdd]);

    // Create validation info for each file (initially validating)
    const newValidationInfo: FileValidationInfo[] = filesToAdd.map(file => ({
      file,
      isValidating: true,
      isValid: false,
      pageCount: 0,
    }));
    
    setFileValidationInfo((prev) => [...prev, ...newValidationInfo]);

    // Validate each PDF file
    filesToAdd.forEach(async (file, index) => {
      const fileIndex = startIndex + index;
      
      try {
        // Get PDF info
        const pdfInfo = await getPdfInfo(file);
        
        // Update validation info
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: pdfInfo.isValid,
            pageCount: pdfInfo.pageCount,
            error: pdfInfo.error,
          };
          return updated;
        });
      } catch (error) {
        // Handle unexpected errors
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: false,
            pageCount: 0,
            error: "Failed to read PDF file",
          };
          return updated;
        });
      }
    });
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileValidationInfo((prev) => prev.filter((_, i) => i !== index));
    setValidationMessage("");
  };

  const handleRemoveFileById = (fileId: string) => {
    const index = files.findIndex(file => file.name === fileId);
    if (index !== -1) {
      handleRemoveFile(index);
    }
  };

  const handleRetryValidation = async (index: number) => {
    const file = files[index];
    if (!file) return;

    // Set file to validating state
    setFileValidationInfo((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isValidating: true,
        isValid: false,
        error: undefined,
      };
      return updated;
    });

    try {
      // Get PDF info
      const pdfInfo = await getPdfInfo(file);
      
      // Update validation info
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: pdfInfo.isValid,
          pageCount: pdfInfo.pageCount,
          error: pdfInfo.error,
        };
        return updated;
      });
    } catch (error) {
      // Handle unexpected errors
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: false,
          pageCount: 0,
          error: "Failed to read PDF file",
        };
        return updated;
      });
    }
  };

  const handleClearAll = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
  };

  const handleContinueToEdit = () => setCurrentStep("edit");
  const handleBackToUpload = () => setCurrentStep("upload");

  // Editor handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setWatermarkSettings(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setWatermarkSettings(history[historyIndex + 1]);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(200, zoomLevel + 10));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(50, zoomLevel - 10));
  };

  const handleFitToScreen = () => {
    setZoomLevel(100);
  };

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  };

  const handlePageSelect = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleWatermarkPositionChange = (x: number, y: number) => {
    setWatermarkSettings((prev) => ({ ...prev, x, y }));
  };

  const handleWatermarkSettingsChange = (newSettings: Partial<typeof watermarkSettings>) => {
    setWatermarkSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleDeleteWatermark = () => {
    setWatermarkSettings((prev) => ({
      ...prev,
      text: "",
      imageUrl: "",
    }));
  };

  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }
    const file = files[0];
    const blob = new Blob([`Watermarked: ${file.name}`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setProcessedFileName(file.name.replace('.pdf', '_watermarked.pdf'));
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
  };

  const hasUnsavedWork = files.length > 0 && currentStep !== "complete";

  return (
    <>
      <SeoHead path="/watermark-pdf" />
      <ToolJsonLd path="/watermark-pdf" />
      <NavigationBlocker when={hasUnsavedWork} message="Unsaved work will be lost. Continue?" onSamePageClick={handleReset} />

      {currentStep === "edit" ? (
        <WatermarkEditorLayout
          toolbar={
            <WatermarkToolbar
              currentPage={currentPage}
              totalPages={totalPages}
              zoomLevel={zoomLevel}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitToScreen={handleFitToScreen}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              onDeleteWatermark={handleDeleteWatermark}
              onBackToUpload={handleBackToUpload}
            />
          }
          thumbnails={
            <PageThumbnails
              pages={pageThumbnails}
              currentPage={currentPage}
              onPageSelect={handlePageSelect}
            />
          }
          canvas={
            <WatermarkCanvas
              pageNumber={currentPage}
              totalPages={totalPages}
              zoomLevel={zoomLevel}
              watermarkSettings={watermarkSettings}
              onWatermarkPositionChange={handleWatermarkPositionChange}
            />
          }
          settingsPanel={
            <WatermarkSettingsPanel
              settings={watermarkSettings}
              onSettingsChange={handleWatermarkSettingsChange}
              onApplyWatermark={handleProcessFiles}
              uploadedFiles={files.map((file, index) => ({
                id: file.name, // Using file name as ID for simplicity
                name: file.name,
                size: file.size,
                pageCount: fileValidationInfo[index]?.pageCount || 0
              }))}
              onAddFiles={() => setCurrentStep("upload")}
              onRemoveFile={handleRemoveFileById}
            />
          }
        />
      ) : (
        <>
          {currentStep === "complete" && <SuccessHeader title={CONTENT.UI_LABELS.successTitle} description={CONTENT.UI_LABELS.successDescription} />}
          {currentStep !== "complete" && <ToolPageHero title={CONTENT.HERO_CONTENT.title} description={CONTENT.HERO_CONTENT.description} />}
          <ToolPageLayout>
            {currentStep === "upload" && <MobileStickyAd topOffset={64} height={100} />}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {currentStep === "upload" && (
                <>
                  <FileUploader 
                    onFilesSelected={handleFilesSelected} 
                    acceptedTypes={CONTENT.UPLOAD_CONFIG.acceptedTypes.join(',')} 
                    multiple={true} 
                    maxFiles={CONTENT.UPLOAD_CONFIG.maxFiles} 
                    maxFileSize={CONTENT.UPLOAD_CONFIG.maxFileSize} 
                    fileTypeLabel={CONTENT.UPLOAD_CONFIG.fileTypeLabel} 
                    helperText={CONTENT.UPLOAD_CONFIG.helperText} 
                    validationMessage={validationMessage} 
                    validationType={validationType} 
                  />
                  {files.length > 0 && (
                    <FileListWithValidation 
                      files={fileValidationInfo} 
                      onRemove={handleRemoveFile} 
                      onContinue={handleContinueToEdit} 
                      continueText={CONTENT.UI_LABELS.continueToAddWatermark} 
                      showReorder={false}
                      onClearAll={handleClearAll}
                      onRetry={handleRetryValidation}
                    />
                  )}
                </>
              )}
              {currentStep === "complete" && <ToolSuccessSection files={{ url: downloadUrl, name: processedFileName, type: "pdf" as const }} onReset={handleReset} resetButtonText={CONTENT.UI_LABELS.watermarkAnother} icon={Droplets} />}
            </div>

            {/* Related Tools Section - Show on complete step */}
            {currentStep === "complete" && (
              <RelatedToolsSection 
                tools={CONTENT.RELATED_TOOLS}
                introText="Continue working with your PDFs or explore other powerful tools."
              />
            )}

            {/* Show these sections if NOT on complete step */}
            {currentStep !== "complete" && (
              <>
                {/* Related Tools Section - Inside layout during upload */}\n                <RelatedToolsSection 
                  tools={CONTENT.RELATED_TOOLS}
                  introText="These tools work well with PDF watermarking and help you manage or secure your documents."
                />

                {/* Tool Definition Section */}
                <ToolDefinitionSection
                  title={CONTENT.SEO_CONTENT.definition.title}
                  description={CONTENT.SEO_CONTENT.definition.content}
                />

                {/* How to Use Section */}
                <HowItWorksSteps 
                  title={CONTENT.SEO_CONTENT.howItWorks.title}
                  subtitle={CONTENT.SEO_CONTENT.howItWorks.subtitle}
                  introText={CONTENT.SEO_CONTENT.howItWorks.introText}
                  steps={CONTENT.HOW_IT_WORKS_STEPS} 
                />

                {/* Why Choose Section */}
                <WhyChooseSection {...WHY_CHOOSE_WORKFLOWPRO} features={CONTENT.FEATURES} />

                {/* Use Cases Section */}
                <UseCasesSection 
                  useCases={CONTENT.USE_CASES}
                  title={CONTENT.USE_CASES_TITLE}
                />

                {/* FAQ Section */}
                <ToolFAQSection faqs={CONTENT.FAQ_ITEMS} />

                {/* SEO Footer */}
                <ToolSEOFooter 
                  title={CONTENT.SEO_CONTENT.footer.title}
                  content={CONTENT.SEO_CONTENT.footer.content}
                />
              </>
            )}
          </ToolPageLayout>
        </>
      )}
      <ProcessingModal isOpen={currentStep === "processing"} progress={progress} title={CONTENT.UI_LABELS.processing.title} description={CONTENT.UI_LABELS.processing.description} icon={Droplets} />
    </>
  );
}