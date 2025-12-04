/**
 * Split PDF Page
 * 
 * Purpose: Allow users to split PDF files into separate pages or page ranges
 * 
 * Features:
 * - Upload PDF file(s)
 * - Select split mode (all pages, page ranges, or by page count)
 * - Preview pages in grid view
 * - Rotate, duplicate, delete pages
 * - Process and download split files
 * 
 * How it works:
 * 1. User uploads PDF file
 * 2. User continues to edit step
 * 3. User selects pages and split mode in sidebar
 * 4. User clicks "Split PDF"
 * 5. Processing happens (simulated)
 * 6. User downloads split files
 * 
 * Components used:
 * - ToolPageLayout: Page wrapper (upload/complete steps WITH sidebar ads)
 * - EditPageLayout: Edit step wrapper (NO sidebar ads, horizontal banner only)
 * - ToolPageHero: Title and description
 * - FileUploader: Upload interface
 * - FileListWithValidation: Display uploaded files with validation
 * - SplitPdfSidebarCompact: Split settings sidebar
 * - ToolSuccessSection: Download section
 * - RelatedToolsSection: Related tools
 * - HowItWorksSteps: Step-by-step guide
 * - WhyChooseSection: Why choose us
 * - ToolDefinitionSection: Tool definition
 * - UseCasesSection: Use cases
 * - ToolFAQSection: FAQs
 * - NavigationBlocker: Warn before leaving
 * - ProcessingModal: Show processing progress
 * - MobileStickyAd: Mobile sticky ad
 * - ToolSEOFooter: SEO footer
 */

import { useState, useRef, useEffect } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import {
  ToolPageLayout,
  ToolPageHero,
  FileUploader,
  FileListWithValidation,
  ToolSuccessSection,
  SuccessHeader,
  EditPageLayout,
  NavigationBlocker,
  RelatedToolsSection,
  HowItWorksSteps,
  WhyChooseSection,
  ToolFAQSection,
  ToolDefinitionSection,
  UseCasesSection,
  ProcessingModal,
  MobileStickyAd,
  ToolSEOFooter,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
import { SplitPdfSidebarCompact } from "../../../components/split-pdf/SplitPdfSidebarCompact";
import { getPdfInfo } from "../../../utils/pdfUtils";
import { simulateRealisticProgress } from "../../../utils/uploadProgress";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "../../../components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { 
  FileText, RotateCw, Copy, Trash2, Check, ZoomIn, ZoomOut, GripVertical, Scissors
} from "lucide-react";

// Import all content from centralized content file
import {
  HERO_CONTENT,
  FEATURES,
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
} from "../../../content/tools/pdf-tools/organize-manage-pdf/split-pdf-content";

// Processing steps for the tool
type ProcessStep = "upload" | "edit" | "processing" | "complete";

interface SplitPdfPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function SplitPdfPage({ onWorkStateChange }: SplitPdfPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<ProcessStep>("upload");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");
  
  // Edit step state - PDF pages
  const [pdfPages, setPdfPages] = useState<Array<{
    pageNumber: number;
    fileName: string;
    selected: boolean;
    outputFile: number;
    rotation?: number;
  }>>([]);
  
  // Split mode settings
  const [splitMode, setSplitMode] = useState<"all" | "ranges" | "every" | "extract">("all");
  const [pageRangeInput, setPageRangeInput] = useState<string>("");
  const [pagesPerSplit, setPagesPerSplit] = useState<number | string>(1);
  const [numberOfParts, setNumberOfParts] = useState<number | string>("");
  const [specificPages, setSpecificPages] = useState<string>("");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  
  // Scissor split points - array of page indices after which to split
  const [splitPoints, setSplitPoints] = useState<number[]>([]);
  
  // Advanced mode settings
  const [oddEvenMode, setOddEvenMode] = useState<"all" | "odd" | "even">("all");
  const [maxFileSize, setMaxFileSize] = useState<number | string>("");
  const [maxPagesPerFile, setMaxPagesPerFile] = useState<number | string>("");
  const [filenamePattern, setFilenamePattern] = useState<string>("split-{n}");
  const [combineAfterSplit, setCombineAfterSplit] = useState<boolean>(false);
  const [combineFilesFirst, setCombineFilesFirst] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<"pdf" | "zip">("zip");
  
  // Output files
  const [outputFiles, setOutputFiles] = useState<Array<{id: number, name: string, pages: string}>>([]);
  
  // Preview modal state
  const [previewPage, setPreviewPage] = useState<number | null>(null);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [previewPan, setPreviewPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Navigation blocker
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  
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
    setFiles((prev) => [...prev, ...filesToAdd]);

    // Create validation info for each file
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
      const animationStartTime = Date.now();
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
        const pdfInfo = await getPdfInfo(file);
        
        // Ensure minimum animation duration
        const elapsedTime = Date.now() - animationStartTime;
        const remainingTime = Math.max(0, minAnimationDuration - elapsedTime);
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        cancelProgress();
        await new Promise(resolve => setTimeout(resolve, 200));
        
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
      } catch (error) {
        const elapsedTime = Date.now() - animationStartTime;
        const remainingTime = Math.max(0, minAnimationDuration - elapsedTime);
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        cancelProgress();
        
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

  // Remove a file from the list
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileValidationInfo((prev) => prev.filter((_, i) => i !== index));
    setValidationMessage("");
  };

  // Retry validation for a specific file
  const handleRetryValidation = async (index: number) => {
    const file = files[index];
    if (!file) return;

    setFileValidationInfo((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isValidating: true,
        isValid: false,
        error: undefined,
        uploadProgress: 0,
      };
      return updated;
    });

    const cancelProgress = simulateRealisticProgress(2000, (progress) => {
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = { ...updated[index], uploadProgress: progress };
        }
        return updated;
      });
    });

    try {
      const pdfInfo = await getPdfInfo(file);
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

  // Reorder files
  const handleReorderFiles = (fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
    setFileValidationInfo((prev) => {
      const newInfo = [...prev];
      const [movedInfo] = newInfo.splice(fromIndex, 1);
      newInfo.splice(toIndex, 0, movedInfo);
      return newInfo;
    });
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
  };

  // Go to edit step
  const handleContinueToEdit = () => {
    // Generate pages from validated PDF info
    const pages: Array<{pageNumber: number, fileName: string, selected: boolean, outputFile: number, rotation?: number}> = [];
    
    fileValidationInfo.forEach((fileInfo, fileIndex) => {
      if (fileInfo.isValid) {
        for (let i = 0; i < fileInfo.pageCount; i++) {
          pages.push({
            pageNumber: i + 1,
            fileName: fileInfo.file.name,
            selected: false,
            outputFile: 0,
            rotation: 0,
          });
        }
      }
    });
    
    setPdfPages(pages);
    setCurrentStep("edit");
  };

  // Go back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  // Rotate a page
  const handleRotatePage = (pageIndex: number) => {
    setPdfPages((prev) =>
      prev.map((page, i) =>
        i === pageIndex ? { ...page, rotation: ((page.rotation || 0) + 90) % 360 } : page
      )
    );
  };

  // Delete a page
  const handleDeletePage = (pageIndex: number) => {
    setPdfPages((prev) => prev.filter((_, i) => i !== pageIndex));
  };

  // Duplicate a page
  const handleDuplicatePage = (pageIndex: number) => {
    const pageToDuplicate = pdfPages[pageIndex];
    setPdfPages(prev => {
      const newPages = [...prev];
      newPages.splice(pageIndex + 1, 0, { ...pageToDuplicate });
      return newPages;
    });
  };

  // Toggle scissor split point
  const handleToggleScissor = (afterPageIndex: number) => {
    setSplitPoints(prev => {
      const exists = prev.includes(afterPageIndex);
      if (exists) {
        // Remove split point
        return prev.filter(p => p !== afterPageIndex);
      } else {
        // Add split point
        return [...prev, afterPageIndex].sort((a, b) => a - b);
      }
    });
  };

  // Process files (split PDFs)
  const handleSplit = async () => {
    setCurrentStep("processing");
    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    // Generate output files based on split mode
    let generatedFiles: Array<{id: number, name: string, pages: string}> = [];
    
    if (splitMode === "all") {
      generatedFiles = pdfPages.map((page, index) => ({
        id: index,
        name: `${filenamePattern.replace('{n}', (index + 1).toString())}`,
        pages: `${page.pageNumber}-${page.pageNumber}`,
      }));
    } else if (splitMode === "every" && typeof pagesPerSplit === 'number') {
      const numFiles = Math.ceil(pdfPages.length / pagesPerSplit);
      for (let i = 0; i < numFiles; i++) {
        const startPage = i * pagesPerSplit + 1;
        const endPage = Math.min((i + 1) * pagesPerSplit, pdfPages.length);
        generatedFiles.push({
          id: i,
          name: `${filenamePattern.replace('{n}', (i + 1).toString())}`,
          pages: `${startPage}-${endPage}`,
        });
      }
    } else if (splitMode === "extract") {
      const extractedPages = pdfPages.filter(p => p.selected);
      if (extractedPages.length > 0) {
        generatedFiles = [{
          id: 0,
          name: `${filenamePattern.replace('{n}', '1')}`,
          pages: extractedPages.map(p => p.pageNumber).join(', '),
        }];
      }
    }

    setOutputFiles(generatedFiles);
    setIsProcessing(false);
    setCurrentStep("complete");
  };

  // Reset to upload more files
  const handleProcessAnother = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setPdfPages([]);
    setOutputFiles([]);
    setCurrentStep("upload");
    setProgress(0);
    setIsProcessing(false);
    setSplitMode("all");
    setSelectedPages([]);
  };

  // Handle add files click (for edit step)
  const handleAddFilesClick = () => {
    document.getElementById('addMoreFiles')?.click();
  };

  // Navigation guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((files.length > 0 || pdfPages.length > 0) && currentStep !== "complete") {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [files.length, pdfPages.length, currentStep]);

  // Intercept link clicks for navigation warning
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      if ((files.length > 0 || pdfPages.length > 0) && currentStep !== "complete") {
        const target = e.target as HTMLElement;
        const link = target.closest("a");
        
        if (link && link.href && !link.href.startsWith("#")) {
          e.preventDefault();
          setPendingNavigation(link.href);
          setShowNavigationWarning(true);
        }
      }
    };

    document.addEventListener("click", handleLinkClick, true);
    return () => document.removeEventListener("click", handleLinkClick, true);
  }, [files.length, pdfPages.length, currentStep]);

  const hasUnsavedWork = (files.length > 0 || pdfPages.length > 0) && currentStep !== "complete";

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/split-pdf" />
      <ToolJsonLd path="/split-pdf" />
      
      {/* Navigation Blocker */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message={NAVIGATION_BLOCKER_MESSAGE}
        onSamePageClick={handleProcessAnother}
      />

      {/* Complete Step - Special Layout */}
      {currentStep === "complete" ? (
        <>
          <SuccessHeader
            title="PDF Split Successfully!"
            description={`Your PDF has been split into ${outputFiles.length} separate file${outputFiles.length > 1 ? 's' : ''}`}
          />
          
          <ToolPageLayout>
            {outputFiles.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                <ToolSuccessSection
                  files={outputFiles.length === 1 ? {
                    url: "#",
                    name: outputFiles[0].name + ".pdf",
                    type: "pdf" as const,
                    pages: outputFiles[0].pages.includes('-') 
                      ? parseInt(outputFiles[0].pages.split('-')[1]) - parseInt(outputFiles[0].pages.split('-')[0]) + 1
                      : outputFiles[0].pages.split(',').length
                  } : outputFiles.map((file, index) => {
                    const pageCount = file.pages.includes('-')
                      ? parseInt(file.pages.split('-')[1]) - parseInt(file.pages.split('-')[0]) + 1
                      : file.pages.split(',').length;
                    
                    return {
                      url: "#",
                      name: file.name + ".pdf",
                      type: "pdf" as const,
                      pages: pageCount
                    };
                  })}
                  fileInfo={{
                    "Total Pages": pdfPages.length,
                    "Files Created": outputFiles.length
                  }}
                  onReset={handleProcessAnother}
                  resetButtonText={UI_LABELS.splitAnother}
                  previewTitle={outputFiles.length === 1 ? "Split File Preview" : "Split Files Preview"}
                  downloadAllText="Download All Files"
                  icon={FileText}
                />
              </div>
            )}

            <RelatedToolsSection 
              tools={relatedTools}
              introText="Continue working with your PDFs or explore other powerful tools."
            />
          </ToolPageLayout>
        </>
      ) : currentStep === "edit" ? (
        // Edit Step - EditPageLayout (NO sidebar ads, horizontal banner only)
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
              {/* Hidden file input for adding more files */}
              <input
                type="file"
                id="addMoreFiles"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const newFiles = Array.from(e.target.files || []);
                  if (newFiles.length > 0) {
                    await handleFilesSelected(newFiles);
                  }
                  e.target.value = '';
                }}
              />

              <SplitPdfSidebarCompact
                splitMode={splitMode}
                setSplitMode={setSplitMode}
                pageRangeInput={pageRangeInput}
                setPageRangeInput={setPageRangeInput}
                pagesPerSplit={pagesPerSplit}
                setPagesPerSplit={setPagesPerSplit}
                numberOfParts={numberOfParts}
                setNumberOfParts={setNumberOfParts}
                specificPages={specificPages}
                setSpecificPages={setSpecificPages}
                selectedPages={selectedPages}
                setSelectedPages={setSelectedPages}
                oddEvenMode={oddEvenMode}
                setOddEvenMode={setOddEvenMode}
                maxFileSize={maxFileSize}
                setMaxFileSize={setMaxFileSize}
                maxPagesPerFile={maxPagesPerFile}
                setMaxPagesPerFile={setMaxPagesPerFile}
                filenamePattern={filenamePattern}
                setFilenamePattern={setFilenamePattern}
                combineAfterSplit={combineAfterSplit}
                setCombineAfterSplit={setCombineAfterSplit}
                outputFormat={outputFormat}
                setOutputFormat={setOutputFormat}
                pdfPages={pdfPages}
                setPdfPages={setPdfPages}
                handleSplit={handleSplit}
                isProcessing={isProcessing}
                outputFiles={outputFiles}
                setOutputFiles={setOutputFiles}
                uploadedFiles={files.map(f => ({ name: f.name, size: f.size }))}
                onAddFiles={handleAddFilesClick}
                onRemoveFile={handleRemoveFile}
                onReorderFiles={handleReorderFiles}
                combineFilesFirst={combineFilesFirst}
                setCombineFilesFirst={setCombineFilesFirst}
              />
            </>
          }
        >
          {/* Pages Grid - KEEP AS IS FROM ORIGINAL */}
          <div className="border-2 border-pink-200 rounded-lg p-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {pdfPages.map((page, index) => {
                const isSelected = splitMode === "extract" && page.selected;
                const outputFileNum = splitMode === "every" ? page.outputFile : -1;
                const hasScissorAfter = index < pdfPages.length - 1; // Show scissor after all pages except last
                const isScissorActive = splitPoints.includes(index); // Check if this split point is active
                const colors = [
                  "from-blue-500 to-blue-600",
                  "from-green-500 to-green-600", 
                  "from-orange-500 to-orange-600",
                  "from-purple-500 to-purple-600",
                  "from-pink-500 to-pink-600",
                  "from-indigo-500 to-indigo-600",
                ];
                const colorClass = colors[outputFileNum % colors.length];

                return (
                  <div
                    key={index}
                    className="group relative"
                  >
                    {/* Page Card */}
                    <div
                      className={`bg-white border-2 rounded-lg overflow-hidden hover:border-purple-400 hover:shadow-lg transition-all relative ${
                        isSelected 
                          ? "border-purple-500 shadow-lg ring-2 ring-purple-300"
                          : splitMode === "every"
                          ? "border-gray-300"
                          : "border-gray-200 hover:border-purple-300"
                      } ${splitMode === "extract" ? "cursor-pointer" : "cursor-pointer"}`}
                      onClick={(e) => {
                        if (!(e.target as HTMLElement).closest('button')) {
                          if (splitMode === "extract") {
                            const newSelected = !page.selected;
                            setPdfPages(prev => prev.map((p, i) => 
                              i === index ? { ...p, selected: newSelected } : p
                            ));
                            setSelectedPages(prev => 
                              newSelected 
                                ? [...prev, page.pageNumber].sort((a,b) => a-b)
                                : prev.filter(p => p !== page.pageNumber)
                            );
                          } else {
                            setPreviewPage(index);
                          }
                        }
                      }}
                    >
                      {/* Action Buttons at TOP */}
                      <div className="absolute top-1.5 right-1.5 z-10 flex gap-0.5 bg-white/95 rounded p-0.5 shadow-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRotatePage(index);
                          }}
                          className="h-6 w-6 p-0 hover:bg-purple-500 hover:text-white transition-colors"
                          title="Rotate"
                        >
                          <RotateCw className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicatePage(index);
                          }}
                          className="h-6 w-6 p-0 hover:bg-purple-500 hover:text-white transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(index);
                          }}
                          className="h-6 w-6 p-0 hover:bg-red-500 hover:text-white text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Selection Indicator */}
                      {splitMode === "extract" && isSelected && (
                        <div className="absolute top-1.5 left-1.5 z-10 bg-purple-500 rounded-full p-0.5 shadow-md">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {/* Page Thumbnail */}
                      <div 
                        className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t flex items-center justify-center relative p-3"
                        style={{ transform: `rotate(${page.rotation || 0}deg)` }}
                      >
                        <div className="w-full space-y-1">
                          <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-1 bg-gray-300 rounded w-full"></div>
                          <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                          <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                          <div className="h-1 bg-gray-300 rounded w-full"></div>
                          <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                        </div>
                      </div>

                      {/* Page Info Footer */}
                      <div className="p-2 bg-white border-t border-gray-200">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 mb-0.5">
                              Page {page.pageNumber}
                            </div>
                            <div className="text-[10px] text-gray-500 truncate" title={page.fileName}>
                              {page.fileName}
                            </div>
                          </div>
                          {/* File Number Badge (Every N Pages mode) */}
                          {splitMode === "every" && (
                            <div className="flex-shrink-0">
                              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                                {outputFileNum + 1}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Scissor Icon - Positioned vertically on RIGHT side of card */}
                    {hasScissorAfter && (
                      <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleScissor(index);
                          }}
                          className={`h-8 w-6 p-0 rounded-md shadow-md transition-all ${
                            isScissorActive 
                              ? "bg-pink-500 hover:bg-pink-600 text-white" 
                              : "bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800"
                          }`}
                          title={isScissorActive ? "Remove split" : "Split here"}
                        >
                          <Scissors className="w-4 h-4 rotate-90" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </EditPageLayout>
      ) : (
        // Upload Step - ToolPageLayout (WITH sidebar ads)
        <>
          <ToolPageHero
            title={HERO_CONTENT.title}
            description={HERO_CONTENT.description}
            features={FEATURES}
          />

          <ToolPageLayout>
            {/* Mobile Sticky Ad Banner - Shows only on mobile/tablet, above upload section */}
            <MobileStickyAd topOffset={64} height={100} />

            <div className="space-y-8">
              {/* Upload Interface */}
              <FileUploader
                acceptedTypes={UPLOAD_CONFIG.accept}
                onFilesSelected={handleFilesSelected}
                multiple={true}
                maxFiles={UPLOAD_CONFIG.maxFiles}
                maxFileSize={UPLOAD_CONFIG.maxFileSize}
                fileTypeLabel="PDF"
                helperText={UPLOAD_CONFIG.helperText}
                validationMessage={validationMessage}
                validationType={validationType}
              />

              {/* Show uploaded files */}
              {files.length > 0 && (
                <FileListWithValidation
                  files={fileValidationInfo}
                  onRemove={handleRemoveFile}
                  onReorder={handleReorderFiles}
                  onClearAll={handleClearAll}
                  onContinue={handleContinueToEdit}
                  continueText={UI_LABELS.continueToSplit}
                  continueDisabled={files.length === 0}
                  showReorder={true}
                  onRetry={handleRetryValidation}
                />
              )}
            </div>

            {/* Related Tools */}
            <RelatedToolsSection 
              tools={relatedTools}
              introText="These tools work great with PDF splitting and page management."
            />

            {/* Tool Definition Section */}
            <ToolDefinitionSection
              title={SEO_CONTENT.definition.title}
              content={SEO_CONTENT.definition.content}
            />

            {/* How It Works */}
            <HowItWorksSteps 
              title={SEO_CONTENT.howItWorks.title}
              subtitle={SEO_CONTENT.howItWorks.subtitle}
              introText={SEO_CONTENT.howItWorks.introText}
              steps={HOW_IT_WORKS_STEPS}
            />

            {/* Why Choose Section */}
            <WhyChooseSection
              title={WHY_CHOOSE_WORKFLOWPRO.title}
              subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle}
              introText={WHY_CHOOSE_WORKFLOWPRO.introText}
              features={WHY_CHOOSE_WORKFLOWPRO.features}
            />

            {/* Use Cases Section */}
            <UseCasesSection
              title={USE_CASES_TITLE}
              useCases={USE_CASES}
            />

            {/* FAQ Section */}
            <ToolFAQSection faqs={FAQ_ITEMS} />
          </ToolPageLayout>
        </>
      )}

      {/* Page Preview Modal - KEEP AS IS */}
      <Dialog open={previewPage !== null} onOpenChange={() => {
        setPreviewPage(null);
        setPreviewZoom(100);
        setPreviewPan({ x: 0, y: 0 });
      }}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <VisuallyHidden.Root>
            <DialogHeader>
              <DialogTitle>Page Preview</DialogTitle>
              <DialogDescription>Preview PDF page</DialogDescription>
            </DialogHeader>
          </VisuallyHidden.Root>
          
          {previewPage !== null && (
            <div className="flex flex-col h-full">
              {/* Preview Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold">
                    Page {pdfPages[previewPage]?.pageNumber}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {pdfPages[previewPage]?.fileName}
                  </span>
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewZoom(Math.max(50, previewZoom - 25))}
                    disabled={previewZoom <= 50}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[4rem] text-center">
                    {previewZoom}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewZoom(Math.min(200, previewZoom + 25))}
                    disabled={previewZoom >= 200}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-hidden bg-gray-100 relative">
                <div 
                  className="w-full h-full overflow-auto"
                  style={{ cursor: previewZoom > 100 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                  onMouseDown={(e) => {
                    if (previewZoom > 100) {
                      setIsDragging(true);
                      setDragStart({ x: e.clientX - previewPan.x, y: e.clientY - previewPan.y });
                    }
                  }}
                  onMouseMove={(e) => {
                    if (isDragging && previewZoom > 100) {
                      setPreviewPan({
                        x: e.clientX - dragStart.x,
                        y: e.clientY - dragStart.y,
                      });
                    }
                  }}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                >
                  <div 
                    className="min-h-full flex items-center justify-center p-8"
                    style={{
                      transform: `translate(${previewPan.x}px, ${previewPan.y}px)`,
                    }}
                  >
                    <div 
                      className="bg-white shadow-2xl"
                      style={{
                        width: `${3.5 * previewZoom}px`,
                        height: `${4.5 * previewZoom}px`,
                        transform: `rotate(${pdfPages[previewPage]?.rotation || 0}deg)`,
                      }}
                    >
                      {/* Simulated page content */}
                      <div className="w-full h-full p-8 space-y-2">
                        <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-300 rounded w-full"></div>
                        <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                        <div className="h-2 bg-gray-300 rounded w-full"></div>
                        <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Processing Modal */}
      <ProcessingModal
        isOpen={currentStep === "processing"}
        progress={progress}
        title="Splitting PDF..."
        description="Your PDF is being split into separate files"
        icon={Scissors}
      />

      {/* SEO Footer */}
      <ToolSEOFooter
        title={SEO_CONTENT.footer.title}
        content={SEO_CONTENT.footer.content}
      />
    </>
  );
}