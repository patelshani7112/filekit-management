/**
 * ExtractPdfPagesPage Component
 * 
 * Purpose: Allow users to extract specific pages from PDF files
 * 
 * Architecture:
 * - Uses component-based architecture with EditPageLayout for edit mode
 * - Content externalized to /content/tools/pdf-tools/organize-manage-pdf/extract-pdf-content.ts
 * - Same 3-column layout structure as Merge PDF and Delete PDF pages
 * - SEO sections: Definition, How It Works, Why Choose, Use Cases, FAQ, Footer
 * - Ad integration: No side ads in edit mode (fullWidth + showInlineAd)
 * 
 * Components:
 * - EditPageLayout: Full-screen edit mode with sidebar for PDF manipulation
 * - ToolPageLayout: 3-column layout wrapper (content + 2 side ads)
 * - ToolPageHero: Hero section with title and description
 * - FileUploader: Upload interface
 * - ToolSuccessSection: Success page with download options
 * - RelatedToolsSection: Related tools grid
 * - HowItWorksSteps: Step-by-step guide
 * - WhyChooseSection: Why choose WorkflowPro
 * - ToolDefinitionSection: What is this tool
 * - UseCasesSection: Use cases
 * - ToolFAQSection: FAQs
 * - ToolSEOFooter: SEO footer
 * - NavigationBlocker: Warn before leaving
 * - ProcessingModal: Show processing progress
 * - MobileStickyAd: Mobile sticky ad
 */

import { useState, useRef } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import {
  ToolPageLayout,
  ToolPageHero,
  FileUploader,
  FileList,
  ProcessButton,
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
  ToolSuccessSection,
  SuccessHeader,
  ProcessingModal,
} from "../../../components/tool";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "../../../components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { motion } from "motion/react";
import { cn } from "../../../components/ui/utils";
import {
  Upload,
  FileText,
  Download,
  Copy,
  Scissors,
  FilePlus,
  Trash2,
  Eye,
  RotateCw,
  FileCopy,
  Merge,
  FileType,
  Archive,
  FileCog,
  RefreshCw,
  Split,
  FileMinus,
  Lock,
  Unlock,
  FileEdit,
  FileSignature,
  Image,
  FileImage,
  Search,
  BookOpen,
  FileSpreadsheet,
  Presentation,
  Check,
  ZoomIn,
  ZoomOut,
  GripVertical,
} from "lucide-react";
import { ExtractPdfSidebarCompact } from "../../../components/extract-pdf/ExtractPdfSidebarCompact";

/**
 * Import all content from centralized content file
 */
import {
  HERO_CONTENT,
  HOW_IT_WORKS_STEPS,
  RELATED_TOOLS,
  USE_CASES,
  USE_CASES_TITLE,
  SEO_CONTENT,
  FAQ_ITEMS,
  UI_LABELS,
  UPLOAD_CONFIG,
  VALIDATION_MESSAGES,
  NAVIGATION_BLOCKER_MESSAGE,
} from "../../../content/tools/pdf-tools/organize-manage-pdf/extract-pdf-content";

type Step = "upload" | "edit" | "processing" | "complete";

type SelectionMode = "visual" | "range" | "list" | "pattern";
type PatternType = "all" | "odd" | "even" | "everyNth" | "firstN" | "lastN";
type OutputMode = "single" | "separatePages" | "separateRanges";

interface PageInfo {
  fileId: string;
  fileName: string;
  pageNumber: number;
  thumbnail: string;
  rotation?: number;
  selected: boolean;
}

export default function ExtractPdfPagesPage() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");
  
  // Edit step state
  const [pdfPages, setPdfPages] = useState<PageInfo[]>([]);
  const [pagesToExtract, setPagesToExtract] = useState<number[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  
  // Selection mode state
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("visual");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [manualList, setManualList] = useState("");
  const [patternType, setPatternType] = useState<PatternType>("all");
  const [everyNthValue, setEveryNthValue] = useState("2");
  const [firstNValue, setFirstNValue] = useState("5");
  const [lastNValue, setLastNValue] = useState("5");
  
  // Output options
  const [outputMode, setOutputMode] = useState<OutputMode>("single");
  
  // Processing state
  const [progress, setProgress] = useState(0);
  
  // Success state
  const [outputFileName, setOutputFileName] = useState("");
  const [outputFileSize, setOutputFileSize] = useState(0);
  const [extractedPageCount, setExtractedPageCount] = useState(0);

  // Preview modal state (COPIED FROM SPLIT PDF)
  const [previewPage, setPreviewPage] = useState<number | null>(null);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [previewPan, setPreviewPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle file upload
  const handleFileUpload = (uploadedFiles: File[]) => {
    const maxFiles = UPLOAD_CONFIG.maxFiles;
    const maxFileSize = UPLOAD_CONFIG.maxFileSize; // MB
    const acceptedTypes = UPLOAD_CONFIG.acceptedTypes;
    const currentFileCount = files.length;
    const availableSlots = maxFiles - currentFileCount;
    
    // Clear previous validation messages
    setValidationMessage("");
    
    // Check if adding files would exceed the limit
    if (currentFileCount >= maxFiles) {
      setValidationMessage(`Maximum ${maxFiles} files allowed. Please remove some files before adding more.`);
      setValidationType("warning");
      return;
    }
    
    // Validate file types
    const invalidFiles = uploadedFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return !acceptedTypes.includes(ext);
    });
    
    if (invalidFiles.length > 0) {
      setValidationMessage(`Only PDF files are allowed. ${invalidFiles.length} invalid file(s) removed.`);
      setValidationType("error");
      uploadedFiles = uploadedFiles.filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return acceptedTypes.includes(ext);
      });
    }
    
    // Validate file sizes
    const oversizedFiles = uploadedFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setValidationMessage(`${oversizedFiles.length} file(s) exceed ${maxFileSize}MB limit and were removed.`);
      setValidationType("error");
      uploadedFiles = uploadedFiles.filter(file => file.size <= maxFileSize * 1024 * 1024);
    }
    
    // If uploading more files than available slots, take only what fits
    const filesToAdd = availableSlots < uploadedFiles.length 
      ? uploadedFiles.slice(0, availableSlots)
      : uploadedFiles;
    
    // Show warning if some files were excluded
    if (filesToAdd.length < uploadedFiles.length) {
      setValidationMessage(`Only ${filesToAdd.length} file(s) added. Maximum ${maxFiles} files allowed (you have ${currentFileCount} already).`);
      setValidationType("warning");
    }
    
    if (filesToAdd.length === 0) return;
    
    const startIndex = files.length;
    
    // Add files to state
    setFiles((prev) => [...prev, ...filesToAdd]);

    // Simulate upload progress for each new file
    filesToAdd.forEach((file, index) => {
      const fileIndex = startIndex + index;
      const fileKey = `${fileIndex}_${file.name}_${file.size}`;
      
      // Initialize progress at 0
      setUploadProgress((prev) => ({ ...prev, [fileKey]: 0 }));

      // Simulate upload with random duration between 800ms-1.5s
      const uploadDuration = 800 + Math.random() * 700;
      const steps = 100;
      const intervalTime = uploadDuration / steps;

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 1;
        setUploadProgress((prev) => ({ ...prev, [fileKey]: currentProgress }));

        if (currentProgress >= 100) {
          clearInterval(interval);
          // Remove progress after completion (with a slight delay)
          setTimeout(() => {
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[fileKey];
              return newProgress;
            });
          }, 300);
        }
      }, intervalTime);
    });
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    // Clear validation message when file is removed
    setValidationMessage("");
  };

  // Handle file reorder
  const handleReorderFiles = (fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  };

  // Handle clear all
  const handleClearAll = () => {
    setFiles([]);
    setUploadProgress({});
    // Clear validation message when all files are cleared
    setValidationMessage("");
  };

  // Handle continue to edit
  const handleContinueToEdit = () => {
    // Simulate PDF page loading
    const mockPages: PageInfo[] = [];
    files.forEach((file, fileIndex) => {
      // Simulate 3-10 pages per PDF
      const pageCount = Math.floor(Math.random() * 8) + 3;
      for (let i = 0; i < pageCount; i++) {
        mockPages.push({
          fileId: file.name,
          fileName: file.name,
          pageNumber: i + 1,
          thumbnail: `https://via.placeholder.com/200x280/f3f4f6/6366f1?text=Page+${i + 1}`,
          selected: false,
        });
      }
    });
    
    setPdfPages(mockPages);
    setCurrentStep("edit");
  };

  // Handle back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
    setPagesToExtract([]);
  };

  // Handle extract pages (process)
  const handleExtractPages = () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Move to complete step
          setTimeout(() => {
            setExtractedPageCount(pagesToExtract.length);
            setOutputFileName(outputMode === "separatePages" ? "extracted-pages.zip" : "extracted-pages.pdf");
            setOutputFileSize(Math.floor(Math.random() * 5000000) + 500000);
            setCurrentStep("complete");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Handle start over
  const handleStartOver = () => {
    setCurrentStep("upload");
    setFiles([]);
    setUploadProgress({});
    setPdfPages([]);
    setPagesToExtract([]);
    setSelectionMode("visual");
    setRangeStart("");
    setRangeEnd("");
    setManualList("");
    setPatternType("all");
    setEveryNthValue("2");
    setFirstNValue("5");
    setLastNValue("5");
    setOutputMode("single");
    setProgress(0);
  };

  // Toggle page selection with Shift+Click support
  const togglePageSelection = (index: number, shiftKey: boolean = false) => {
    if (shiftKey && lastSelectedIndex !== null) {
      // Shift+Click: Select range
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      
      setPagesToExtract((prev) => {
        const newSelection = new Set(prev);
        range.forEach((i) => newSelection.add(i));
        return Array.from(newSelection).sort((a, b) => a - b);
      });
    } else {
      // Regular click: Toggle single page
      setPagesToExtract((prev) => {
        if (prev.includes(index)) {
          return prev.filter((i) => i !== index);
        } else {
          return [...prev, index].sort((a, b) => a - b);
        }
      });
    }
    setLastSelectedIndex(index);
  };

  // Select all pages
  const selectAllPages = () => {
    setPagesToExtract(pdfPages.map((_, index) => index));
  };

  // Deselect all pages
  const deselectAllPages = () => {
    setPagesToExtract([]);
    setLastSelectedIndex(null);
  };

  // Page action handlers (COPIED FROM SPLIT PDF)
  const handleRotatePage = (index: number) => {
    setPdfPages((prev) =>
      prev.map((page, i) =>
        i === index
          ? { ...page, rotation: ((page.rotation || 0) + 90) % 360 }
          : page
      )
    );
  };

  const handleDuplicatePage = (index: number) => {
    const pageToDuplicate = pdfPages[index];
    const newPage = { ...pageToDuplicate };
    setPdfPages((prev) => [
      ...prev.slice(0, index + 1),
      newPage,
      ...prev.slice(index + 1),
    ]);
  };

  const handleDeletePage = (index: number) => {
    setPdfPages((prev) => prev.filter((_, i) => i !== index));
    // Also remove from selected pages if it was selected
    setPagesToExtract((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
  };

  // Preview modal handlers (COPIED FROM SPLIT PDF)
  const handlePreviewPage = (index: number) => {
    setPreviewPage(index);
    setPreviewZoom(100);
    setPreviewPan({ x: 0, y: 0 });
  };

  const handleClosePreview = () => {
    setPreviewPage(null);
    setPreviewZoom(100);
    setPreviewPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setPreviewZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setPreviewZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (previewZoom > 100) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - previewPan.x, y: e.clientY - previewPan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && previewZoom > 100) {
      setPreviewPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Apply range selection
  const applyRangeSelection = () => {
    const start = parseInt(rangeStart);
    const end = parseInt(rangeEnd);
    
    if (isNaN(start) || isNaN(end) || start < 1 || end > pdfPages.length || start > end) {
      alert("Invalid page range. Please check your inputs.");
      return;
    }
    
    const range = Array.from({ length: end - start + 1 }, (_, i) => (start - 1) + i);
    setPagesToExtract(range);
  };

  // Apply manual list selection
  const applyManualListSelection = () => {
    try {
      const pages: number[] = [];
      const parts = manualList.split(",").map((s) => s.trim());
      
      for (const part of parts) {
        if (part.includes("-")) {
          // Range like "5-10"
          const [start, end] = part.split("-").map((n) => parseInt(n.trim()));
          if (isNaN(start) || isNaN(end) || start < 1 || end > pdfPages.length || start > end) {
            throw new Error(`Invalid range: ${part}`);
          }
          for (let i = start; i <= end; i++) {
            pages.push(i - 1);
          }
        } else {
          // Single page like "5"
          const pageNum = parseInt(part);
          if (isNaN(pageNum) || pageNum < 1 || pageNum > pdfPages.length) {
            throw new Error(`Invalid page number: ${part}`);
          }
          pages.push(pageNum - 1);
        }
      }
      
      setPagesToExtract(Array.from(new Set(pages)).sort((a, b) => a - b));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Invalid format. Use format like: 1, 3, 5-8, 10");
    }
  };

  // Apply pattern selection
  const applyPatternSelection = () => {
    let selectedPages: number[] = [];
    
    switch (patternType) {
      case "all":
        selectedPages = pdfPages.map((_, i) => i);
        break;
      case "odd":
        selectedPages = pdfPages
          .map((_, i) => i)
          .filter((i) => (i + 1) % 2 === 1);
        break;
      case "even":
        selectedPages = pdfPages
          .map((_, i) => i)
          .filter((i) => (i + 1) % 2 === 0);
        break;
      case "everyNth":
        const nthValue = parseInt(everyNthValue);
        if (isNaN(nthValue) || nthValue < 1) {
          alert("Invalid value for Every Nth page");
          return;
        }
        selectedPages = pdfPages
          .map((_, i) => i)
          .filter((i) => (i + 1) % nthValue === 0);
        break;
      case "firstN":
        const firstN = parseInt(firstNValue);
        if (isNaN(firstN) || firstN < 1 || firstN > pdfPages.length) {
          alert("Invalid value for First N pages");
          return;
        }
        selectedPages = Array.from({ length: firstN }, (_, i) => i);
        break;
      case "lastN":
        const lastN = parseInt(lastNValue);
        if (isNaN(lastN) || lastN < 1 || lastN > pdfPages.length) {
          alert("Invalid value for Last N pages");
          return;
        }
        selectedPages = Array.from({ length: lastN }, (_, i) => pdfPages.length - lastN + i);
        break;
    }
    
    setPagesToExtract(selectedPages);
  };

  // Navigation blocker
  const hasUnsavedWork = (files.length > 0 || pdfPages.length > 0) && currentStep !== "processing";

  return (
    <>
      {/* SEO */}
      <SeoHead path="/extract-pdf-pages" />
      <ToolJsonLd path="/extract-pdf-pages" />
      
      {/* Navigation Blocker */}
      <NavigationBlocker when={hasUnsavedWork} message={NAVIGATION_BLOCKER_MESSAGE} />

      {/* Processing Modal */}
      {currentStep === "processing" && (
        <ProcessingModal
          isOpen={true}
          progress={progress}
          title="Extracting Pages..."
          description="Please wait while we extract the selected pages from your PDF."
          icon={Scissors}
        />
      )}

      {/* UPLOAD STEP */}
      {currentStep === "upload" && (
        <>
          <ToolPageHero
            title={HERO_CONTENT.title}
            description={HERO_CONTENT.description}
            icon={Copy}
          />

          <ToolPageLayout>
            {/* Mobile Sticky Ad */}
            <MobileStickyAd topOffset={64} height={100} />

            {/* File Uploader */}
            <FileUploader
              onFilesSelected={handleFileUpload}
              acceptedTypes=".pdf"
              multiple={true}
              maxFiles={UPLOAD_CONFIG.maxFiles}
              maxFileSize={UPLOAD_CONFIG.maxFileSize}
              fileTypeLabel={UPLOAD_CONFIG.fileTypeLabel}
              helperText={UPLOAD_CONFIG.helperText}
              validationMessage={validationMessage}
              validationType={validationType}
            />

            {/* File List */}
            {files.length > 0 && (
              <FileList
                files={files}
                onRemove={handleRemoveFile}
                onReorder={handleReorderFiles}
                onClearAll={handleClearAll}
                onContinue={handleContinueToEdit}
                continueText="Continue to Extract Pages"
                continueDisabled={files.length < 1}
                showReorder={false}
                uploadProgress={uploadProgress}
              />
            )}

            {/* Related Tools Section */}
            <RelatedToolsSection tools={RELATED_TOOLS} />

            {/* Tool Definition Section */}
            <ToolDefinitionSection
              title={SEO_CONTENT.definition.title}
              content={SEO_CONTENT.definition.content}
            />

            {/* How to Use Section */}
            <HowItWorksSteps
              title={SEO_CONTENT.howItWorks.title}
              subtitle={SEO_CONTENT.howItWorks.subtitle}
              introText={SEO_CONTENT.howItWorks.introText}
              steps={HOW_IT_WORKS_STEPS}
            />

            {/* Why Choose Us Section */}
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

            {/* Tool FAQ Section */}
            <ToolFAQSection faqs={FAQ_ITEMS} />

            {/* Tool SEO Footer */}
            <ToolSEOFooter
              title={SEO_CONTENT.footer.title}
              content={SEO_CONTENT.footer.content}
            />
          </ToolPageLayout>
        </>
      )}

      {/* EDIT STEP - Select pages to extract */}
      {currentStep === "edit" && (
        <>
          {/* Hidden file input for adding more files */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              const newFiles = Array.from(e.target.files || []);
              if (newFiles.length > 0) {
                handleFileUpload(newFiles);
                // Generate mock pages for new files
                const mockPages: PageInfo[] = [];
                newFiles.forEach((file) => {
                  const pageCount = Math.floor(Math.random() * 8) + 3;
                  for (let i = 0; i < pageCount; i++) {
                    mockPages.push({
                      fileId: file.name,
                      fileName: file.name,
                      pageNumber: i + 1,
                      thumbnail: `https://via.placeholder.com/200x280/f3f4f6/6366f1?text=Page+${i + 1}`,
                      selected: false,
                    });
                  }
                });
                setPdfPages([...pdfPages, ...mockPages]);
              }
              e.target.value = ''; // Reset input
            }}
          />
          
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
              <ExtractPdfSidebarCompact
                uploadedFiles={files.map(f => ({ name: f.name, size: f.size }))}
                onAddFiles={() => fileInputRef.current?.click()}
                onRemoveFile={handleRemoveFile}
                onReorderFiles={(reordered) => {
                  const reorderedFileNames = reordered.map(f => f.name);
                  setFiles(prev => {
                    const sorted = [...prev].sort((a, b) => {
                      return reorderedFileNames.indexOf(a.name) - reorderedFileNames.indexOf(b.name);
                    });
                    return sorted;
                  });
                }}
                selectedPagesCount={pagesToExtract.length}
                totalPagesCount={pdfPages.length}
                mergeIntoOne={outputMode === "single"}
                setMergeIntoOne={(value) => setOutputMode(value ? "single" : "separatePages")}
                onSelectAll={selectAllPages}
                onClearSelection={deselectAllPages}
                handleExtract={handleExtractPages}
                isProcessing={false}
              />
            }
          >
            {/* Pages Grid - COPIED FROM SPLIT PDF */}
            {pdfPages.length === 0 ? (
              /* Empty state - should never happen but good fallback */
              <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Pages Loaded</h3>
                  <p className="text-muted-foreground">Please go back and upload files again.</p>
                </div>
              </div>
            ) : (
              <div className="border-2 border-pink-200 rounded-lg p-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {pdfPages.map((page, index) => {
                    const isSelected = pagesToExtract.includes(index);

                    return (
                      <div
                        key={index}
                        className="group relative"
                      >
                        {/* Page Card */}
                        <div
                          className={cn(
                            "bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all relative cursor-pointer",
                            isSelected 
                              ? "border-purple-500 shadow-lg" 
                              : "border-gray-200 hover:border-purple-300"
                          )}
                          onClick={(e) => {
                            // Only toggle selection if not clicking the selection circle
                            if (!(e.target as HTMLElement).closest('.selection-circle')) {
                              togglePageSelection(index, e.shiftKey);
                            }
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            handlePreviewPage(index);
                          }}
                        >
                          {/* Selection Circle - Top Left (MATCHING DELETE PDF PAGES) */}
                          <div 
                            className="selection-circle absolute top-1.5 left-1.5 z-10 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPagesToExtract((prev) =>
                                prev.includes(index)
                                  ? prev.filter((i) => i !== index)
                                  : [...prev, index]
                              );
                            }}
                          >
                            <div 
                              className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shadow-md",
                                isSelected
                                  ? "bg-purple-500 border-purple-500"
                                  : "bg-white/95 border-gray-300 hover:border-purple-400"
                              )}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Purple Overlay for Selected Pages */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-purple-500/10 pointer-events-none z-[1]" />
                          )}

                          {/* Page Thumbnail */}
                          <div 
                            className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t flex items-center justify-center relative p-4"
                            style={{ transform: `rotate(${page.rotation || 0}deg)` }}
                          >
                            {/* Document lines to simulate PDF page */}
                            <div className="w-full space-y-2">
                              <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                              <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                              <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
                              <div className="h-1.5 bg-gray-300 rounded w-2/3"></div>
                              <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                              <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                            </div>
                          </div>

                          {/* Page Info Footer */}
                          <div className="p-2.5 bg-white border-t border-gray-200">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                  Page {page.pageNumber}
                                </div>
                                <div className="text-xs text-gray-500 truncate" title={page.fileName}>
                                  {page.fileName}
                                </div>
                              </div>
                              {/* Page Number Badge */}
                              <div className="flex-shrink-0">
                                <div className={cn(
                                  "w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md",
                                  isSelected
                                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                    : "bg-gradient-to-br from-purple-500 to-pink-500"
                                )}>
                                  {page.pageNumber}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </EditPageLayout>
        </>
      )}

      {/* SUCCESS STEP */}
      {currentStep === "complete" ? (
        <>
          <SuccessHeader 
            icon={Copy}
            title="Pages Extracted Successfully!"
            description="Your selected pages have been extracted and are ready for download."
          />

          <ToolPageLayout>
            {/* Success Section - Use ToolSuccessSection Component */}
            <ToolSuccessSection
              files={{
                url: "#",
                name: outputFileName,
                size: `${(outputFileSize / (1024 * 1024)).toFixed(2)} MB`,
                type: "pdf",
                pages: extractedPageCount
              }}
              fileInfo={{
                "Pages Extracted": extractedPageCount,
                "Output Format": outputMode === "separatePages" ? "Separate PDFs" : "Single PDF",
                "Original Files": files.length
              }}
              onReset={handleStartOver}
              resetButtonText="Extract More Pages"
              icon={Copy}
            />

            {/* Related Tools Section */}
            <RelatedToolsSection tools={RELATED_TOOLS} />
          </ToolPageLayout>
        </>
      ) : null}

      {/* Preview Modal */}
      {previewPage !== null && (
        <Dialog open={true} onOpenChange={handleClosePreview}>
          <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0">
            <VisuallyHidden.Root>
              <DialogTitle>Page Preview</DialogTitle>
              <DialogDescription>Preview of the selected PDF page</DialogDescription>
            </VisuallyHidden.Root>
            
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Page {pdfPages[previewPage]?.pageNumber || previewPage + 1}</h3>
                  <p className="text-sm text-muted-foreground">{pdfPages[previewPage]?.fileName}</p>
                </div>
              </div>
              
              {/* Zoom Controls - Fixed width to prevent movement */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={previewZoom <= 50}
                  className="h-9 w-9 flex-shrink-0"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium w-14 text-center flex-shrink-0">{previewZoom}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={previewZoom >= 200}
                  className="h-9 w-9 flex-shrink-0"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Preview Content */}
            <div 
              className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: previewZoom > 100 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <div
                className="bg-white shadow-2xl"
                style={{
                  width: `${300 * (previewZoom / 100)}px`,
                  height: `${400 * (previewZoom / 100)}px`,
                  transform: `translate(${previewPan.x}px, ${previewPan.y}px) rotate(${pdfPages[previewPage]?.rotation || 0}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                  {/* Document lines to simulate PDF page */}
                  <div className="w-full space-y-4">
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-300 rounded w-11/12"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}