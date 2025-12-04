/**
 * Rotate PDF Page
 * 
 * Purpose: Rotate PDF pages to correct orientation
 * Structure: Matches MergePdfPage.tsx exactly, using same components and layout
 */

import { useState, useEffect, useRef } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import {
  ToolPageLayout,
  ToolPageHero,
  FileUploader,
  FileListWithValidation,
  ToolSuccessSection,
  SuccessHeader,
  RelatedToolsSection,
  HowItWorksSteps,
  WhyChooseSection,
  ToolFAQSection,
  ToolDefinitionSection,
  UseCasesSection,
  ToolSEOFooter,
  MobileStickyAd,
  EditPageLayout,
  NavigationBlocker,
  ProcessingModal,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
import { getPdfInfo } from "../../../utils/pdfUtils";
import { simulateRealisticProgress } from "../../../utils/uploadProgress";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { GradientButton } from "../../../components/ui/gradient-button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { 
  FileText, 
  RotateCw,
  RotateCcw,
  GripVertical,
  X,
  FilePlus,
  Archive,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Import all content from centralized content file
import {
  HERO_CONTENT,
  FEATURES,
  WHY_CHOOSE_CONTENT,
  HOW_IT_WORKS_STEPS,
  RELATED_TOOLS,
  USE_CASES,
  USE_CASES_TITLE,
  UPLOAD_CONFIG,
  VALIDATION_MESSAGES,
  UI_LABELS,
  SEO_CONTENT,
  NAVIGATION_BLOCKER_MESSAGE,
  FAQ_ITEMS,
} from "../../../content/tools/pdf-tools/organize-manage-pdf/rotate-pdf-content";

// Processing steps
type ProcessStep = "upload" | "edit" | "processing" | "complete";

interface RotatePdfPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

interface PdfPage {
  fileIndex: number;
  fileName: string;
  pageNumber: number;
  rotation: number;
}

export default function RotatePdfPage({ onWorkStateChange }: RotatePdfPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<ProcessStep>("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [processedFileName, setProcessedFileName] = useState("");
  const [pdfPages, setPdfPages] = useState<PdfPage[]>([]);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");
  
  // Selection state
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [outputFileName, setOutputFileName] = useState("rotated.pdf");
  
  // Collapsible state for Source Files section
  const [isSourceFilesOpen, setIsSourceFilesOpen] = useState(false);
  
  // Refs
  const fileListRef = useRef<HTMLDivElement>(null);
  
  // Convert RELATED_TOOLS from content file to component format with onClick handlers
  const relatedTools = RELATED_TOOLS.map(tool => ({
    ...tool,
    onClick: () => window.location.href = tool.href,
  }));

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = (files.length > 0 || pdfPages.length > 0) && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, pdfPages.length, currentStep, onWorkStateChange]);

  // Handle file selection with PDF validation
  const handleFilesSelected = async (newFiles: File[]) => {
    const { maxFiles, maxFileSize } = UPLOAD_CONFIG;
    const currentFileCount = files.length;
    const availableSlots = maxFiles - currentFileCount;
    
    // Clear previous validation messages
    setValidationMessage("");
    
    // Check file count limit
    if (currentFileCount >= maxFiles) {
      setValidationMessage(VALIDATION_MESSAGES.maxFilesReached(maxFiles));
      setValidationType("warning");
      return;
    }
    
    // Validate file types (PDF only)
    const invalidFiles = newFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return ext !== '.pdf';
    });
    
    if (invalidFiles.length > 0) {
      setValidationMessage(VALIDATION_MESSAGES.invalidFileType(invalidFiles.length));
      setValidationType("error");
      newFiles = newFiles.filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return ext === '.pdf';
      });
    }
    
    // Validate file sizes
    const oversizedFiles = newFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setValidationMessage(VALIDATION_MESSAGES.fileSizeExceeded(oversizedFiles.length, maxFileSize));
      setValidationType("error");
      newFiles = newFiles.filter(file => file.size <= maxFileSize * 1024 * 1024);
    }
    
    // Check available slots
    const filesToAdd = availableSlots < newFiles.length 
      ? newFiles.slice(0, availableSlots)
      : newFiles;
    
    if (filesToAdd.length < newFiles.length) {
      setValidationMessage(VALIDATION_MESSAGES.limitReached(filesToAdd.length, maxFiles, currentFileCount));
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
      uploadProgress: 0,
    }));
    
    setFileValidationInfo((prev) => [...prev, ...newValidationInfo]);

    // Validate each PDF file with progress animation
    filesToAdd.forEach(async (file, index) => {
      const fileIndex = startIndex + index;
      
      const minAnimationDuration = 1200;
      
      // Start progress animation
      const cancelProgress = simulateRealisticProgress(minAnimationDuration, (progress) => {
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          if (updated[fileIndex]) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              uploadProgress: progress,
            };
          }
          return updated;
        });
      });
      
      try {
        // Get PDF info
        const pdfInfo = await getPdfInfo(file);
        
        // Wait for minimum animation duration
        const elapsed = Date.now();
        const remaining = minAnimationDuration - elapsed;
        if (remaining > 0) {
          await new Promise(resolve => setTimeout(resolve, remaining));
        }
      
        // Cancel progress
        cancelProgress();
      
        // Update validation info
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: pdfInfo.isValid,
            pageCount: pdfInfo.pageCount,
            error: pdfInfo.error,
            uploadProgress: 100,
          };
          return updated;
        });
        
        // Generate pages for this PDF
        if (pdfInfo.isValid && pdfInfo.pageCount > 0) {
          const newPages: PdfPage[] = [];
          for (let i = 0; i < pdfInfo.pageCount; i++) {
            newPages.push({
              fileIndex,
              fileName: file.name,
              pageNumber: i + 1,
              rotation: 0,
            });
          }
          setPdfPages((prev) => [...prev, ...newPages]);
        }
      } catch (error) {
        // Cancel progress
        cancelProgress();
        
        // Handle unexpected errors
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: false,
            pageCount: 0,
            error: VALIDATION_MESSAGES.invalidPdfFile,
          };
          return updated;
        });
      }
    });
  };

  // Remove file
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileValidationInfo((prev) => prev.filter((_, i) => i !== index));
    setPdfPages((prev) => prev.filter((p) => p.fileIndex !== index).map((p) => ({
      ...p,
      fileIndex: p.fileIndex > index ? p.fileIndex - 1 : p.fileIndex,
    })));
  };

  // Retry validation for a specific file
  const handleRetryValidation = async (index: number) => {
    const file = files[index];
    
    setFileValidationInfo((prev) => {
      const updated = [...prev];
      updated[index] = {
        file,
        isValidating: true,
        isValid: false,
        pageCount: 0,
        uploadProgress: 0,
      };
      return updated;
    });

    const minAnimationDuration = 1200;
    
    const cancelProgress = simulateRealisticProgress(minAnimationDuration, (progress) => {
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            uploadProgress: progress,
          };
        }
        return updated;
      });
    });
    
    try {
      const pdfInfo = await getPdfInfo(file);
      
      const elapsed = Date.now();
      const remaining = minAnimationDuration - elapsed;
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
      
      cancelProgress();
      
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: pdfInfo.isValid,
          pageCount: pdfInfo.pageCount,
          error: pdfInfo.error,
          uploadProgress: 100,
        };
        return updated;
      });
    } catch (error) {
      cancelProgress();
      
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: false,
          pageCount: 0,
          error: VALIDATION_MESSAGES.invalidPdfFile,
        };
        return updated;
      });
    }
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setPdfPages([]);
    setValidationMessage("");
    setSelectedPages([]);
  };

  // Go to edit step
  const handleContinueToEdit = () => {
    setCurrentStep("edit");
  };

  // Back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  // Rotate page
  const handleRotatePage = (pageIndex: number, direction: "right" | "left") => {
    setPdfPages((prev) => {
      const updated = [...prev];
      const rotationChange = direction === "right" ? 90 : -90;
      updated[pageIndex] = {
        ...updated[pageIndex],
        rotation: (updated[pageIndex].rotation + rotationChange) % 360,
      };
      return updated;
    });
  };

  // Rotate all pages
  const handleRotateAll = (direction: "right" | "left") => {
    setPdfPages((prev) => {
      const rotationChange = direction === "right" ? 90 : -90;
      return prev.map((page) => ({
        ...page,
        rotation: (page.rotation + rotationChange) % 360,
      }));
    });
  };

  // Rotate selected pages
  const handleRotateSelected = (direction: "right" | "left") => {
    if (selectedPages.length === 0) return;
    
    setPdfPages((prev) => {
      const rotationChange = direction === "right" ? 90 : -90;
      return prev.map((page, index) => {
        if (selectedPages.includes(index)) {
          return {
            ...page,
            rotation: (page.rotation + rotationChange) % 360,
          };
        }
        return page;
      });
    });
  };

  // Toggle page selection
  const handleTogglePageSelection = (pageIndex: number) => {
    setSelectedPages((prev) => {
      if (prev.includes(pageIndex)) {
        return prev.filter((i) => i !== pageIndex);
      }
      return [...prev, pageIndex];
    });
  };

  // Select all pages
  const handleSelectAll = () => {
    setSelectedPages(pdfPages.map((_, index) => index));
  };

  // Deselect all pages
  const handleDeselectAll = () => {
    setSelectedPages([]);
  };

  // Process files
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);
    
    // Simulate processing with realistic progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    const blob = new Blob([`Rotated PDF with ${pdfPages.length} pages`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setProcessedFileName(outputFileName);
    setCurrentStep("complete");
  };

  // Reset
  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setFileValidationInfo([]);
    setPdfPages([]);
    setCurrentStep("upload");
    setProgress(0);
    setDownloadUrl("");
    setProcessedFileName("");
    setSelectedPages([]);
  };

  // Calculate if we should block navigation
  const hasUnsavedWork = (files.length > 0 || pdfPages.length > 0) && currentStep !== "complete";

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/rotate-pdf" />
      <ToolJsonLd path="/rotate-pdf" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message={NAVIGATION_BLOCKER_MESSAGE}
        onSamePageClick={handleReset}
      />

      {/* Edit Step - Special Layout without side ads */}
      {currentStep === "edit" ? (
        <EditPageLayout
          fullWidth={true}
          showInlineAd={true}
          onBack={handleBackToUpload}
          totalPages={pdfPages.length}
          totalSize={(() => {
            const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
            if (totalBytes < 1024) return `${totalBytes} B`;
            if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
            return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
          })()}
          sidebar={
            <>
              {/* Header with Title and Add Button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">{UI_LABELS.rotateSettings}</h3>
                
                {/* Add More Files Button */}
                <input
                  type="file"
                  id="addMoreFiles"
                  accept=".pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    if (newFiles.length > 0) {
                      handleFilesSelected(newFiles);
                    }
                    e.target.value = '';
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-500 hover:text-white transition-colors"
                  onClick={() => document.getElementById('addMoreFiles')?.click()}
                  disabled={files.length >= UPLOAD_CONFIG.maxFiles}
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  {UI_LABELS.addFiles}
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Source Files - Collapsible */}
                <div>
                  {/* Collapsible Header */}
                  <button
                    onClick={() => setIsSourceFilesOpen(!isSourceFilesOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-3 hover:text-purple-600 transition-colors"
                  >
                    <span>{UI_LABELS.sourceFiles}</span>
                    {isSourceFilesOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  
                  {/* Collapsible Content */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isSourceFilesOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div ref={fileListRef} className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {files.map((file, fileIndex) => (
                        <div
                          key={fileIndex}
                          className="flex items-center gap-2 text-xs p-3 rounded-lg border-2 bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all group"
                        >
                          <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-purple-500 flex-shrink-0" />
                          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="flex-1 truncate text-gray-700" title={file.name}>
                            {file.name}
                          </span>
                          <div className="text-xs text-gray-500 font-medium">
                            ({pdfPages.filter(p => p.fileIndex === fileIndex).length})
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(fileIndex);
                            }}
                            className="h-6 w-6 p-0 hover:bg-red-100 text-gray-400 hover:text-destructive flex-shrink-0"
                            title={UI_LABELS.removeFile}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions - Always Visible */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    {/* Rotate All */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => handleRotateAll("right")}
                      >
                        <RotateCw className="w-4 h-4" />
                        Rotate All Right
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => handleRotateAll("left")}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Rotate All Left
                      </Button>
                    </div>

                    {/* Selection Controls */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handleSelectAll}
                      >
                        {UI_LABELS.selectAll}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handleDeselectAll}
                      >
                        {UI_LABELS.deselectAll}
                      </Button>
                    </div>

                    {/* Rotate Selected */}
                    {selectedPages.length > 0 && (
                      <div className="p-3 bg-purple-50 border-2 border-purple-200 rounded-lg">
                        <div className="text-xs font-medium text-purple-700 mb-2">
                          {selectedPages.length} page(s) selected
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={() => handleRotateSelected("right")}
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            Rotate Right
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={() => handleRotateSelected("left")}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Rotate Left
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Output Settings - Always Visible */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">{UI_LABELS.outputSettings}</h4>
                  <div className="space-y-2">
                    <Label htmlFor="outputFileName" className="text-xs text-gray-600">{UI_LABELS.fileName}</Label>
                    <Input
                      id="outputFileName"
                      type="text"
                      value={outputFileName}
                      onChange={(e) => setOutputFileName(e.target.value)}
                      placeholder={UI_LABELS.fileNamePlaceholder}
                      className="text-sm bg-purple-50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                    
                    <div className="flex items-center justify-between pt-3 pb-1">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">{pdfPages.length} pages</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Archive className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">
                            {(() => {
                              const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
                              if (totalBytes < 1024) return `${totalBytes} B`;
                              if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
                              return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  {UI_LABELS.rotatePdf}
                </GradientButton>
              </div>
            </>
          }
        >
          {/* Pages Grid with Responsive Layout */}
          <div className="border-2 border-pink-200 rounded-lg p-6 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 place-items-center">
              {pdfPages.map((page, index) => {
                const isSelected = selectedPages.includes(index);
                
                return (
                  <div key={index} className="w-full max-w-[200px]">
                    <div 
                      className={`bg-white border-2 rounded-xl overflow-hidden hover:border-purple-400 hover:shadow-lg transition-all relative cursor-pointer ${
                        isSelected ? 'border-purple-500 shadow-lg ring-2 ring-purple-300' : 'border-gray-200'
                      }`}
                      onClick={() => handleTogglePageSelection(index)}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Page Thumbnail */}
                      <div
                        className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t flex items-center justify-center relative p-3 transition-transform duration-300"
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      >
                        {/* Document lines */}
                        <div className="w-full space-y-1">
                          <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-1 bg-gray-300 rounded w-full"></div>
                          <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                          <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                          <div className="h-1 bg-gray-300 rounded w-full"></div>
                          <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                        </div>

                        {/* Rotation Indicator */}
                        {page.rotation !== 0 && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                            {page.rotation}°
                          </div>
                        )}
                      </div>

                      {/* Page Info Footer */}
                      <div className="p-2 bg-white border-t border-gray-200">
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 mb-0.5">
                              Page {index + 1}
                            </div>
                            <div className="text-[10px] text-gray-500 truncate" title={page.fileName}>
                              {page.fileName}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                              {index + 1}
                            </div>
                          </div>
                        </div>

                        {/* Rotation Buttons */}
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRotatePage(index, "left");
                            }}
                            className="flex-1 px-2 py-1.5 bg-gray-100 hover:bg-purple-100 rounded text-xs font-medium text-gray-700 hover:text-purple-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Left
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRotatePage(index, "right");
                            }}
                            className="flex-1 px-2 py-1.5 bg-gray-100 hover:bg-purple-100 rounded text-xs font-medium text-gray-700 hover:text-purple-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <RotateCw className="w-3 h-3" />
                            Right
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </EditPageLayout>
      ) : (
        <>
          {/* Success Header - Only on complete step */}
          {currentStep === "complete" && (
            <SuccessHeader 
              title={UI_LABELS.successTitle} 
              description={UI_LABELS.successDescription} 
            />
          )}
          
          {/* Hero - Only on upload step */}
          {currentStep !== "complete" && (
            <ToolPageHero 
              title={HERO_CONTENT.title} 
              description={HERO_CONTENT.description} 
            />
          )}

          {/* Main Tool Page Layout */}
          <ToolPageLayout>
            {/* Mobile Sticky Ad - Only on upload step */}
            {currentStep === "upload" && <MobileStickyAd topOffset={64} height={100} />}
            
            {/* Main Tool Card */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {/* Upload Step */}
              {currentStep === "upload" && (
                <>
                  <FileUploader 
                    onFilesSelected={handleFilesSelected} 
                    acceptedTypes={UPLOAD_CONFIG.acceptedTypes.join(',')} 
                    multiple={true} 
                    maxFiles={UPLOAD_CONFIG.maxFiles} 
                    maxFileSize={UPLOAD_CONFIG.maxFileSize} 
                    fileTypeLabel={UPLOAD_CONFIG.fileTypeLabel} 
                    helperText={UPLOAD_CONFIG.helperText} 
                    validationMessage={validationMessage} 
                    validationType={validationType} 
                  />
                  {files.length > 0 && (
                    <FileListWithValidation 
                      files={fileValidationInfo} 
                      onRemove={handleRemoveFile} 
                      onContinue={handleContinueToEdit} 
                      continueText={UI_LABELS.continueToEdit} 
                      showReorder={false}
                      onClearAll={handleClearAll}
                      onRetry={handleRetryValidation}
                    />
                  )}
                </>
              )}

              {/* Complete Step */}
              {currentStep === "complete" && (
                <ToolSuccessSection 
                  files={{ url: downloadUrl, name: processedFileName, type: "pdf" as const }} 
                  onReset={handleReset} 
                  resetButtonText={UI_LABELS.rotateAnother} 
                  icon={RotateCw} 
                />
              )}
            </div>

            {/* Related Tools Section - Show on complete step */}
            {currentStep === "complete" && (
              <RelatedToolsSection 
                tools={relatedTools}
                introText="Continue working with your PDFs or explore other powerful tools."
              />
            )}

            {/* Show these sections if NOT on complete step */}
            {currentStep !== "complete" && (
              <>
                {/* Related Tools Section - Inside layout during upload */}
                <RelatedToolsSection 
                  tools={relatedTools}
                  introText="These tools work well with rotating PDFs and help you manage your documents."
                />

                {/* Tool Definition Section */}
                <ToolDefinitionSection
                  title={SEO_CONTENT.definition.title}
                  description={SEO_CONTENT.definition.content}
                />

                {/* How to Use Section */}
                <HowItWorksSteps 
                  title={SEO_CONTENT.howItWorks.title}
                  subtitle={SEO_CONTENT.howItWorks.subtitle}
                  introText={SEO_CONTENT.howItWorks.introText}
                  steps={HOW_IT_WORKS_STEPS} 
                />

                {/* Why Choose Section */}
                <WhyChooseSection 
                  title={WHY_CHOOSE_WORKFLOWPRO.title}
                  subtitle="The most powerful and user-friendly PDF rotator available online"
                  introText="WorkflowPro delivers fast, private, and watermark-free PDF rotation trusted by professionals, students, and businesses. No signup required."
                  features={WHY_CHOOSE_WORKFLOWPRO.features} 
                />

                {/* Use Cases Section */}
                <UseCasesSection 
                  useCases={USE_CASES}
                  title={USE_CASES_TITLE}
                />

                {/* FAQ Section */}
                <ToolFAQSection faqs={FAQ_ITEMS} />

                {/* SEO Footer */}
                <ToolSEOFooter 
                  title={SEO_CONTENT.footer.title}
                  content={SEO_CONTENT.footer.content}
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
        title={UI_LABELS.processing.title} 
        description={UI_LABELS.processing.description} 
        icon={RotateCw} 
      />
    </>
  );
}