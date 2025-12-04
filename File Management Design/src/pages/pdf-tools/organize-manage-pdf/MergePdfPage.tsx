/**
 * Merge PDF Page
 * 
 * Purpose: Allow users to merge multiple PDF files into one
 * 
 * Features:
 * - Upload multiple PDF files
 * - Reorder files before merging
 * - Process files (mock - in real app, use PDF library)
 * - Download merged PDF
 * 
 * How it works:
 * 1. User uploads PDF files
 * 2. Files are displayed with reorder options
 * 3. User clicks "Merge PDFs"
 * 4. Files are processed (simulated)
 * 5. User downloads the merged PDF
 * 
 * Components used:
 * - ToolPageLayout: Page wrapper
 * - ToolHeader: Title and description
 * - FileUploader: Upload interface
 * - FileList: Display uploaded files
 * - ProcessButton: Merge button
 * - DownloadSection: Download result
 * - RelatedToolsSection: Related tools
 * - HowItWorksSteps: Step-by-step guide
 * - AdPlaceholder: Ad placeholder
 */

import { useState, useRef, useEffect } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import {
  ToolPageLayout,
  ToolPageHero,
  FileUploader,
  FileList,
  FileListWithValidation,
  ProcessButton,
  DownloadSection,
  ToolSuccessSection,
  SuccessHeader,
  RelatedToolsSection,
  HowItWorksSteps,
  WhyChooseSection,
  ToolFAQSection,
  ToolDefinitionSection,
  UseCasesSection,
  ToolSEOFooter,
  StickyAd,
  MobileStickyAd,
  EditPageLayout,
  NavigationBlocker,
  ProcessingModal,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
import { getPdfInfo } from "../../../utils/pdfUtils";
import { simulateRealisticProgress } from "../../../utils/uploadProgress";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { getGridClasses } from "../../../src/utils/gridUtils";
import { Button } from "../../../components/ui/button";
import { GradientButton } from "../../../components/ui/gradient-button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "../../../components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { 
  FileText, 
  RotateCw, 
  Copy, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  GripVertical, 
  X, 
  FilePlus,
  Archive,
  ChevronDown,
  ChevronUp
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
} from "../../../content/tools/pdf-tools/organize-manage-pdf/merge-pdf-content";

// Processing steps for the tool
type ProcessStep = "upload" | "edit" | "processing" | "complete";

interface MergePdfPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function MergePdfPage({ onWorkStateChange }: MergePdfPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [downloadUrl, setDownloadUrl] = useState("");
  const [processedFileName, setProcessedFileName] = useState("");
  const [pdfPages, setPdfPages] = useState<Array<{fileIndex: number, fileName: string, pageNumber: number, rotation: number}>>([]);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");
  
  // New state for edit step features
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "grouped">("all");
  const [fileFilter, setFileFilter] = useState<string>("all");
  const [thumbnailSize, setThumbnailSize] = useState<"small" | "medium" | "large">("medium");
  const [outputFileName, setOutputFileName] = useState("merged.pdf");
  const [previewPage, setPreviewPage] = useState<number | null>(null);
  const [previewZoom, setPreviewZoom] = useState(100); // Zoom level in percentage
  const [previewPan, setPreviewPan] = useState({ x: 0, y: 0 }); // Pan position when zoomed
  const [isDragging, setIsDragging] = useState(false); // Track if user is dragging
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Starting position of drag
  const [dragOverFileIndex, setDragOverFileIndex] = useState<number | null>(null);
  
  // Compress option state
  const [compressEnabled, setCompressEnabled] = useState(false);
  const [isSourceFilesOpen, setIsSourceFilesOpen] = useState(true); // Open by default
  
  // Ref for file list auto-scroll
  const fileListRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  
  // Convert RELATED_TOOLS from content file to component format with onClick handlers
  const relatedTools = RELATED_TOOLS.map(tool => ({
    ...tool,
    onClick: () => window.location.href = tool.href,
  }));

  // Notify parent component about work state changes
  useEffect(() => {
    // Only consider it "work in progress" if NOT in complete state
    // When complete, user can navigate freely without losing anything
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
      uploadProgress: 0,  // Start at 0%
    }));
    
    setFileValidationInfo((prev) => [...prev, ...newValidationInfo]);

    // Validate each PDF file with progress animation
    filesToAdd.forEach(async (file, index) => {
      const fileIndex = startIndex + index;
      
      // Track animation start time
      const animationStartTime = Date.now();
      const minAnimationDuration = 1200; // Minimum 1.2s to show progress (same range as Split PDF)
      
      // Start progress animation (0% → 100%)
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
        // Get PDF info (this might complete quickly)
        const pdfInfo = await getPdfInfo(file);
        
        // Ensure minimum animation duration has passed
        const elapsedTime = Date.now() - animationStartTime;
        const remainingTime = Math.max(0, minAnimationDuration - elapsedTime);
        
        // Wait for remaining time if needed
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        // Cancel progress animation
        cancelProgress();
        
        // Add a small delay to show the "Uploaded" state
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Update validation info with results
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: pdfInfo.isValid,
            pageCount: pdfInfo.pageCount,
            error: pdfInfo.error,
            uploadProgress: 100,  // Complete
          };
          return updated;
        });
      } catch (error) {
        // Ensure minimum animation duration has passed
        const elapsedTime = Date.now() - animationStartTime;
        const remainingTime = Math.max(0, minAnimationDuration - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        // Cancel progress animation
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

  // Remove a file from the list
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileValidationInfo((prev) => prev.filter((_, i) => i !== index));
    // Clear validation message when file is removed
    setValidationMessage("");
  };

  // Retry validation for a specific file
  const handleRetryValidation = async (index: number) => {
    const file = files[index];
    if (!file) return;

    // Set file to validating state with progress
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

    // Start progress animation
    const cancelProgress = simulateRealisticProgress(2000, (progress) => {
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
      // Get PDF info
      const pdfInfo = await getPdfInfo(file);
      
      // Cancel progress
      cancelProgress();
      
      // Update validation info
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
      // Cancel progress
      cancelProgress();
      
      // Handle unexpected errors
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

  // Reorder files (move from one index to another)
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
    // Clear validation message when all files are cleared
    setValidationMessage("");
  };

  // Go to edit step
  const handleContinueToEdit = () => {
    // Generate pages from validated PDF info
    const pages: Array<{fileIndex: number, fileName: string, pageNumber: number, rotation: number}> = [];
    fileValidationInfo.forEach((fileInfo, fileIndex) => {
      if (fileInfo.isValid) {
        // Use real page count from validation
        for (let i = 0; i < fileInfo.pageCount; i++) {
          pages.push({
            fileIndex,
            fileName: fileInfo.file.name,
            pageNumber: i + 1,
            rotation: 0,
          });
        }
      }
    });
    setPdfPages(pages);
    setCurrentStep("edit");
  };

  // Rotate a page
  const handleRotatePage = (pageIndex: number) => {
    setPdfPages((prev) =>
      prev.map((page, i) =>
        i === pageIndex ? { ...page, rotation: (page.rotation + 90) % 360 } : page
      )
    );
  };

  // Delete a page
  const handleDeletePage = (pageIndex: number) => {
    setPdfPages((prev) => prev.filter((_, i) => i !== pageIndex));
    setSelectedPages((prev) => prev.filter((i) => i !== pageIndex).map((i) => (i > pageIndex ? i - 1 : i)));
  };

  // Reorder pages
  const handleReorderPages = (fromIndex: number, toIndex: number) => {
    setPdfPages((prev) => {
      const newPages = [...prev];
      const [movedPage] = newPages.splice(fromIndex, 1);
      newPages.splice(toIndex, 0, movedPage);
      return newPages;
    });
  };

  // Go back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  // Process files (merge PDFs)
  // NOTE: This is a MOCK implementation
  // In production, you would use a PDF library like pdf-lib or similar
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing with progress
    // In real app: use pdf-lib to actually merge PDFs
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    // Create a mock blob for download
    // In real app: this would be the actual merged PDF
    const mockPdfContent = `Merged PDF containing ${files.length} files:\n${files.map(f => f.name).join("\n")}`;
    const blob = new Blob([mockPdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Set download info
    setDownloadUrl(url);
    setProcessedFileName(outputFileName);
    setCurrentStep("complete");
  };

  // Reset to upload more files
  const handleReset = () => {
    // Clean up old blob URL
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

    // Reset state
    setFiles([]);
    setCurrentStep("upload");
    setProgress(0);
    setDownloadUrl("");
    setProcessedFileName("");
  };

  // Duplicate a page
  const handleDuplicatePage = (pageIndex: number) => {
    setPdfPages((prev) => {
      const newPages = [...prev];
      const pageToDuplicate = { ...prev[pageIndex] };
      newPages.splice(pageIndex + 1, 0, pageToDuplicate);
      return newPages;
    });
  };

  // Toggle page selection
  const handleTogglePageSelection = (pageIndex: number) => {
    setSelectedPages((prev) => {
      if (prev.includes(pageIndex)) {
        return prev.filter((i) => i !== pageIndex);
      } else {
        return [...prev, pageIndex];
      }
    });
  };

  // Select all pages
  const handleSelectAllPages = () => {
    setSelectedPages(pdfPages.map((_, index) => index));
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedPages([]);
  };

  // Delete selected pages
  const handleDeleteSelected = () => {
    setPdfPages((prev) => prev.filter((_, i) => !selectedPages.includes(i)));
    setSelectedPages([]);
  };

  // Rotate selected pages
  const handleRotateSelected = (direction: "left" | "right") => {
    setPdfPages((prev) =>
      prev.map((page, i) =>
        selectedPages.includes(i)
          ? { ...page, rotation: direction === "right" ? (page.rotation + 90) % 360 : (page.rotation - 90 + 360) % 360 }
          : page
      )
    );
  };

  // Duplicate selected pages
  const handleDuplicateSelected = () => {
    const newPages = [...pdfPages];
    selectedPages.forEach((pageIndex) => {
      const pageToDuplicate = { ...pdfPages[pageIndex] };
      newPages.push(pageToDuplicate);
    });
    setPdfPages(newPages);
    setSelectedPages([]);
  };

  // Get filtered pages based on current filter
  const getFilteredPages = () => {
    if (fileFilter === "all") {
      return pdfPages.map((page, index) => ({ ...page, originalIndex: index }));
    }
    return pdfPages
      .map((page, index) => ({ ...page, originalIndex: index }))
      .filter((page) => page.fileName === fileFilter);
  };

  // Get thumbnail size class
  const getThumbnailSizeClass = () => {
    switch (thumbnailSize) {
      case "small":
        return "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6";
      case "large":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      default:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";
    }
  };

  // Handle mouse move over file list for auto-scroll
  const handleFileListMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = fileListRef.current;
    if (!container) return;

    // Only auto-scroll if we're dragging a page (check if pageIndex is in dataTransfer)
    const isDraggingPage = e.buttons === 1; // Left mouse button is pressed
    if (!isDraggingPage) return;

    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const scrollZone = 50; // pixels from edge to trigger scroll
    const scrollSpeed = 5; // pixels per interval

    // Clear existing scroll interval
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }

    // Scroll up if near top
    if (y < scrollZone && y >= 0) {
      scrollIntervalRef.current = window.setInterval(() => {
        if (container.scrollTop > 0) {
          container.scrollTop -= scrollSpeed;
        }
      }, 16); // ~60fps
    }
    // Scroll down if near bottom
    else if (y > rect.height - scrollZone && y <= rect.height) {
      scrollIntervalRef.current = window.setInterval(() => {
        if (container.scrollTop < container.scrollHeight - container.clientHeight) {
          container.scrollTop += scrollSpeed;
        }
      }, 16); // ~60fps
    }
  };

  // Stop auto-scroll when mouse leaves file list
  const handleFileListMouseLeave = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  // Navigation guard - warn user before leaving if files are uploaded but not processed
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Show warning if files are uploaded but not yet downloaded/completed
      if ((files.length > 0 || pdfPages.length > 0) && currentStep !== "complete") {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
        return ""; // Required for some browsers
      }
    };

    // Add event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [files.length, pdfPages.length, currentStep]);

  // Intercept link clicks for navigation warning
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Check if work in progress
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
    
    return () => {
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [files.length, pdfPages.length, currentStep]);

  // Calculate if we should block navigation
  const hasUnsavedWork = (files.length > 0 || pdfPages.length > 0) && currentStep !== "complete";

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/merge-pdf" />
      <ToolJsonLd path="/merge-pdf" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message={NAVIGATION_BLOCKER_MESSAGE}
        onSamePageClick={handleReset}
      />

      {/* Edit Step - Special Layout without side ads and without header */}
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
                <h3 className="font-semibold text-lg">{UI_LABELS.mergeSettings}</h3>
                
                {/* Add More Files Button - Compact */}
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
                      // Generate mock pages for new files
                      const newPages: Array<{fileIndex: number, fileName: string, pageNumber: number, rotation: number}> = [];
                      newFiles.forEach((file, idx) => {
                        const fileIndex = files.length + idx;
                        const pageCount = Math.floor(Math.random() * 5) + 1;
                        for (let i = 0; i < pageCount; i++) {
                          newPages.push({
                            fileIndex,
                            fileName: file.name,
                            pageNumber: i + 1,
                            rotation: 0,
                          });
                        }
                      });
                      setPdfPages([...pdfPages, ...newPages]);
                    }
                    e.target.value = ''; // Reset input
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-500 hover:text-white transition-colors"
                  onClick={() => document.getElementById('addMoreFiles')?.click()}
                  disabled={files.length >= 10}
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  Add Files
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Source Files - Collapsible */}
                <div>
                  {/* Collapsible Header */}
                  <div 
                    className="flex items-center justify-between cursor-pointer select-none mb-3"
                    onClick={() => setIsSourceFilesOpen(!isSourceFilesOpen)}
                  >
                    <h4 className="text-sm font-medium text-gray-700">Source Files</h4>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      {isSourceFilesOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* File List - Only show when open */}
                  {isSourceFilesOpen && (
                    <div 
                      ref={fileListRef}
                      onMouseMove={handleFileListMouseMove}
                      onMouseLeave={handleFileListMouseLeave}
                      className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar"
                    >
                    {files.map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("fileIndex", fileIndex.toString());
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          const pageIndex = e.dataTransfer.getData("pageIndex");
                          // If dragging a page, show drop zone effect
                          if (pageIndex) {
                            e.dataTransfer.dropEffect = "copy";
                            setDragOverFileIndex(fileIndex);
                          } else {
                            e.dataTransfer.dropEffect = "move";
                          }
                        }}
                        onDragLeave={() => {
                          setDragOverFileIndex(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverFileIndex(null);
                          
                          const fromFileIndexStr = e.dataTransfer.getData("fileIndex");
                          const fromPageIndexStr = e.dataTransfer.getData("pageIndex");
                          
                          // If dropping a page onto a file
                          if (fromPageIndexStr && !fromFileIndexStr) {
                            const pageIndex = parseInt(fromPageIndexStr);
                            if (!isNaN(pageIndex)) {
                              // Move page to this file
                              setPdfPages((prev) => {
                                const newPages = [...prev];
                                newPages[pageIndex] = {
                                  ...newPages[pageIndex],
                                  fileIndex: fileIndex,
                                  fileName: file.name,
                                };
                                
                                // Sort pages by fileIndex and then by their position
                                return newPages.sort((a, b) => {
                                  if (a.fileIndex !== b.fileIndex) return a.fileIndex - b.fileIndex;
                                  return 0; // Keep original order within file
                                });
                              });
                            }
                          }
                          // If dropping a file onto another file (reorder files)
                          else if (fromFileIndexStr) {
                            const fromFileIndex = parseInt(fromFileIndexStr);
                            if (fromFileIndex !== fileIndex) {
                              handleReorderFiles(fromFileIndex, fileIndex);
                              
                              // Also reorder all pages from those files
                              const newPages = [...pdfPages];
                              const fromFilePages = newPages.filter(p => p.fileIndex === fromFileIndex);
                              const toFilePages = newPages.filter(p => p.fileIndex === fileIndex);
                              const otherPages = newPages.filter(p => p.fileIndex !== fromFileIndex && p.fileIndex !== fileIndex);
                              
                              // Update fileIndex for swapped files
                              fromFilePages.forEach(p => p.fileIndex = fileIndex);
                              toFilePages.forEach(p => p.fileIndex = fromFileIndex);
                              
                              // Recombine in new order
                              const reorderedPages = [...otherPages];
                              if (fromFileIndex < fileIndex) {
                                reorderedPages.push(...toFilePages, ...fromFilePages);
                              } else {
                                reorderedPages.push(...fromFilePages, ...toFilePages);
                              }
                              
                              setPdfPages(reorderedPages.sort((a, b) => {
                                if (a.fileIndex !== b.fileIndex) return a.fileIndex - b.fileIndex;
                                return a.pageNumber - b.pageNumber;
                              }));
                            }
                          }
                        }}
                        className={`flex items-center gap-2 text-xs p-3 rounded-lg border-2 transition-all group cursor-move ${
                          dragOverFileIndex === fileIndex
                            ? 'bg-purple-100 border-purple-400 shadow-lg scale-105'
                            : 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                        }`}
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
                            // Remove file and its pages
                            setFiles((prev) => prev.filter((_, i) => i !== fileIndex));
                            setPdfPages((prev) => prev.filter((p) => p.fileIndex !== fileIndex).map((p) => ({
                              ...p,
                              fileIndex: p.fileIndex > fileIndex ? p.fileIndex - 1 : p.fileIndex,
                            })));
                          }}
                          className="h-6 w-6 p-0 hover:bg-red-100 text-gray-400 hover:text-destructive flex-shrink-0"
                          title={UI_LABELS.removeFile}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                        {dragOverFileIndex === fileIndex && (
                          <div className="absolute inset-0 flex items-center justify-center bg-purple-500/10 rounded-lg pointer-events-none">
                            <span className="text-xs font-medium text-purple-600">Drop page here</span>
                          </div>
                        )}
                      </div>
                    ))}
                    </div>
                  )}
                </div>

                {/* Output Settings */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">{UI_LABELS.outputSettings}</h4>
                  <div className="space-y-2">
                    <Label htmlFor="outputFileName" className="text-xs text-gray-600">
                      {UI_LABELS.fileName}
                    </Label>
                    <Input
                      id="outputFileName"
                      type="text"
                      value={outputFileName}
                      onChange={(e) => setOutputFileName(e.target.value)}
                      placeholder={UI_LABELS.fileNamePlaceholder}
                      className="text-sm bg-purple-50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                    
                    {/* Compress PDF Option */}
                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <Checkbox
                        checked={compressEnabled}
                        onCheckedChange={setCompressEnabled}
                        className="border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Compress PDF after merge</span>
                    </label>
                    
                    {/* Compression Stats - Only show when compress is enabled */}
                    {compressEnabled && (
                      <div className="space-y-2 pt-3 pb-1">
                        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                          <span className="text-green-600 font-medium">After Compression:</span>
                          <span className="font-medium text-green-700">
                            {(() => {
                              const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
                              const compressedBytes = totalBytes * 0.4; // Mock: 60% compression
                              if (compressedBytes < 1024) return `${compressedBytes.toFixed(0)} B`;
                              if (compressedBytes < 1024 * 1024) return `${(compressedBytes / 1024).toFixed(1)} KB`;
                              return `${(compressedBytes / (1024 * 1024)).toFixed(2)} MB`;
                            })()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Merge Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Merge PDF
                </GradientButton>
              </div>
            </>
          }
        >
          {/* Files Grid with + Buttons Between - Responsive Grid */}
          <div className="border-2 border-pink-200 rounded-lg p-6 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 place-items-center">
              {files.map((file, fileIndex) => {
                const filePagesCount = fileValidationInfo[fileIndex]?.pageCount || 
                  pdfPages.filter(p => p.fileIndex === fileIndex).length;
                const fileSize = file.size;
                const fileSizeStr = 
                  fileSize < 1024 ? `${fileSize} B` :
                  fileSize < 1024 * 1024 ? `${(fileSize / 1024).toFixed(1)} KB` :
                  `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;

                return (
                  <div key={fileIndex} className="w-full flex flex-col items-center gap-3">
                    {/* File Card */}
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("fileIndex", fileIndex.toString());
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIndex = parseInt(e.dataTransfer.getData("fileIndex"));
                        if (fromIndex !== fileIndex && !isNaN(fromIndex)) {
                          handleReorderFiles(fromIndex, fileIndex);
                          // Reorder pages to match file order
                          const newPages = [...pdfPages];
                          newPages.forEach(page => {
                            if (page.fileIndex === fromIndex) page.fileIndex = fileIndex;
                            else if (page.fileIndex === fileIndex) page.fileIndex = fromIndex;
                          });
                          setPdfPages(newPages.sort((a, b) => {
                            if (a.fileIndex !== b.fileIndex) return a.fileIndex - b.fileIndex;
                            return a.pageNumber - b.pageNumber;
                          }));
                        }
                      }}
                      className="group relative w-full max-w-[200px] bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-400 hover:shadow-xl transition-all cursor-move"
                    >
                      {/* Action Buttons at TOP RIGHT - Always Visible */}
                      <div className="absolute top-2 right-2 z-10 flex gap-1 bg-white/95 backdrop-blur-sm rounded-lg p-1 shadow-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Rotate ALL pages in this file
                            setPdfPages((prev) => 
                              prev.map(page => 
                                page.fileIndex === fileIndex
                                  ? { ...page, rotation: (page.rotation + 90) % 360 }
                                  : page
                              )
                            );
                          }}
                          className="h-7 w-7 p-0 hover:bg-purple-500 hover:text-white transition-colors"
                          title="Rotate entire file"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Duplicate entire file and its pages
                            const newFile = file;
                            setFiles((prev) => [...prev, newFile]);
                            const filePagesToDuplicate = pdfPages.filter(p => p.fileIndex === fileIndex);
                            const duplicatedPages = filePagesToDuplicate.map(page => ({
                              ...page,
                              fileIndex: files.length, // New file index
                            }));
                            setPdfPages((prev) => [...prev, ...duplicatedPages]);
                            setFileValidationInfo((prev) => [...prev, prev[fileIndex]]);
                          }}
                          className="h-7 w-7 p-0 hover:bg-purple-500 hover:text-white transition-colors"
                          title="Duplicate entire file"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Delete entire file and its pages
                            setFiles((prev) => prev.filter((_, i) => i !== fileIndex));
                            setPdfPages((prev) => 
                              prev
                                .filter((p) => p.fileIndex !== fileIndex)
                                .map((p) => ({
                                  ...p,
                                  fileIndex: p.fileIndex > fileIndex ? p.fileIndex - 1 : p.fileIndex,
                                }))
                            );
                            setFileValidationInfo((prev) => prev.filter((_, i) => i !== fileIndex));
                          }}
                          className="h-7 w-7 p-0 hover:bg-red-500 hover:text-white text-red-500 transition-colors"
                          title="Delete entire file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {/* Drag Handle at TOP LEFT */}
                      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/95 backdrop-blur-sm rounded p-1 shadow-md">
                          <GripVertical className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                      </div>

                      {/* File Preview/Thumbnail */}
                      <div className="aspect-[3/4] bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col items-center justify-center p-4 relative">
                        {/* File Icon */}
                        <div className="mb-2">
                          <FileText className="w-12 h-12 text-purple-500" />
                        </div>
                        
                        {/* File Name */}
                        <div className="text-center w-full px-1">
                          <h3 className="font-semibold text-xs text-gray-900 truncate mb-0.5" title={file.name}>
                            {file.name}
                          </h3>
                          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
                            <span>{filePagesCount} pages</span>
                            <span>•</span>
                            <span>{fileSizeStr}</span>
                          </div>
                        </div>

                        {/* Pages Preview Row */}
                        <div className="mt-2 flex gap-1">
                          {pdfPages
                            .filter(p => p.fileIndex === fileIndex)
                            .slice(0, 3)
                            .map((page, idx) => (
                              <div 
                                key={idx}
                                className="w-5 h-7 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center"
                                style={{ transform: `rotate(${page.rotation}deg)` }}
                              >
                                <div className="space-y-0.5 w-3">
                                  <div className="h-0.5 bg-gray-300 rounded"></div>
                                  <div className="h-0.5 bg-gray-300 rounded"></div>
                                  <div className="h-0.5 bg-gray-300 rounded"></div>
                                </div>
                              </div>
                            ))}
                          {filePagesCount > 3 && (
                            <div className="w-5 h-7 bg-gray-100 border border-gray-200 rounded shadow-sm flex items-center justify-center text-[9px] text-gray-500">
                              +{filePagesCount - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* File Order Number */}
                      <div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
                        <span className="text-xs font-medium text-gray-700">
                          File {fileIndex + 1} of {files.length}
                        </span>
                      </div>
                    </div>

                    {/* + Button Between Files - Show on large screens only */}
                    {fileIndex < files.length - 1 && (fileIndex + 1) % 5 !== 0 && (
                      <button
                        onClick={() => document.getElementById('addMoreFiles')?.click()}
                        className="hidden lg:flex absolute -right-7 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all items-center justify-center"
                        title="Add file here"
                      >
                        <FilePlus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Final + Button at End */}
              <div className="w-full flex flex-col items-center gap-3">
                <button
                  onClick={() => document.getElementById('addMoreFiles')?.click()}
                  className="w-full max-w-[200px] aspect-[3/4] rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50 hover:bg-purple-100 transition-all flex flex-col items-center justify-center group"
                  title="Add more files"
                >
                  <FilePlus className="w-8 h-8 text-purple-500 group-hover:text-purple-600 mb-2" />
                  <span className="text-sm text-purple-600 font-medium">Add Files</span>
                </button>
              </div>
            </div>
          </div>
        </EditPageLayout>
      ) : (
        /* All Other Steps - Normal Layout with Side Ads and Header */
        <>
          {/* Success Header - Full Width at Top (only on complete step) */}
          {currentStep === "complete" && (
            <SuccessHeader
              title={UI_LABELS.successTitle}
              description={UI_LABELS.successDescription(pdfPages.length)}
            />
          )}

          {/* Header Section - Full Width Above Layout - Hide on Complete Step */}
          {currentStep !== "complete" && (
            <ToolPageHero 
              title={HERO_CONTENT.title}
              description={HERO_CONTENT.description}
            />
          )}

          <ToolPageLayout>
            {/* Mobile Sticky Ad Banner - Shows only on mobile/tablet, above upload section */}
            {currentStep === "upload" && <MobileStickyAd topOffset={64} height={100} />}

            {/* Main Tool Area */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {/* STEP 1: Upload Files */}
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

                  {/* Show uploaded files */}
                  {files.length > 0 && (
                    <FileListWithValidation
                      files={fileValidationInfo}
                      onRemove={handleRemoveFile}
                      onReorder={handleReorderFiles}
                      onClearAll={handleClearAll}
                      onContinue={handleContinueToEdit}
                      continueText="Continue to Merge"
                      continueDisabled={files.length < 2}
                      showReorder={true}
                      onRetry={handleRetryValidation}
                    />
                  )}

                  {/* Helper text */}
                  {files.length === 1 && (
                    <p className="text-sm text-center text-muted-foreground">
                      Please add at least 2 PDF files to merge
                    </p>
                  )}
                </>
              )}

              {/* STEP 3: Processing */}
              {currentStep === "processing" && (
                <ProcessButton
                  onClick={() => {}}
                  isProcessing={true}
                  processingText="Merging PDFs..."
                  progress={progress}
                />
              )}

              {/* STEP 4: Download */}
              {currentStep === "complete" && (
                <ToolSuccessSection
                  files={{
                    url: downloadUrl,
                    name: processedFileName,
                    type: "pdf" as const,
                    pages: pdfPages.length
                  }}
                  fileInfo={{
                    "Total Pages": pdfPages.length,
                    "File Size": "473 MB"
                  }}
                  onReset={handleReset}
                  resetButtonText={UI_LABELS.mergeAnother}
                  previewTitle={UI_LABELS.previewTitle}
                  icon={FileText}
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

            {/* Only show these sections if NOT on complete step */}
            {currentStep !== "complete" && (
              <>
                {/* Related Tools Section - Now inside layout, fits between ads */}
                <RelatedToolsSection 
                  tools={relatedTools}
                  introText="These tools work well with PDF merging and help you manage or convert your documents."
                />

                {/* Tool Definition Section - Now inside layout, fits between ads */}
                <ToolDefinitionSection
                  title={SEO_CONTENT.definition.title}
                  content={SEO_CONTENT.definition.content}
                />

                {/* How to Use Section - Now inside layout, fits between ads */}
                <HowItWorksSteps 
                  title={SEO_CONTENT.howItWorks.title}
                  subtitle={SEO_CONTENT.howItWorks.subtitle}
                  introText={SEO_CONTENT.howItWorks.introText}
                  steps={HOW_IT_WORKS_STEPS} 
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
                  title={USE_CASES_TITLE}
                  useCases={USE_CASES}
                />

                {/* Tool FAQ Section - Now inside layout, fits between ads */}
                <ToolFAQSection faqs={FAQ_ITEMS} />

                {/* Tool SEO Footer - Now inside layout, fits between ads */}
                <ToolSEOFooter
                  title={SEO_CONTENT.footer.title}
                  content={SEO_CONTENT.footer.content}
                />
              </>
            )}
          </ToolPageLayout>
        </>
      )}

      {/* Page Preview Modal */}
      <Dialog open={previewPage !== null} onOpenChange={() => {
        setPreviewPage(null);
        setPreviewZoom(100); // Reset zoom when closing
        setPreviewPan({ x: 0, y: 0 }); // Reset pan
      }}>
        <DialogContent className="max-w-6xl p-3 sm:p-4 max-h-[98vh]">
          <VisuallyHidden.Root>
            <DialogTitle>{UI_LABELS.preview.title}</DialogTitle>
            <DialogDescription>
              {UI_LABELS.preview.description}
            </DialogDescription>
          </VisuallyHidden.Root>
          {previewPage !== null && pdfPages[previewPage] && (
            <div className="space-y-4">
              {/* Zoom Controls - Centered at Top */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreviewZoom((prev) => Math.max(50, prev - 25));
                    if (previewZoom - 25 <= 100) {
                      setPreviewPan({ x: 0, y: 0 }); // Reset pan when zooming out to 100% or less
                    }
                  }}
                  disabled={previewZoom <= 50}
                  className="h-9 w-9 p-0 rounded-full hover:bg-purple-50 hover:border-purple-300"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <div className="bg-gray-100 px-4 py-1.5 rounded-md min-w-[70px] text-center">
                  <span className="font-medium text-gray-700">
                    {previewZoom}%
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewZoom((prev) => Math.min(200, prev + 25))}
                  disabled={previewZoom >= 200}
                  className="h-9 w-9 p-0 rounded-full hover:bg-purple-50 hover:border-purple-300"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* Preview Container - Scrollable/Pannable */}
              <div 
                className="bg-gray-100 rounded-xl overflow-auto relative"
                style={{ 
                  height: '700px',
                  cursor: previewZoom > 100 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
                onMouseDown={(e) => {
                  if (previewZoom > 100) {
                    setIsDragging(true);
                    setDragStart({ 
                      x: e.clientX - previewPan.x, 
                      y: e.clientY - previewPan.y 
                    });
                  }
                }}
                onMouseMove={(e) => {
                  if (isDragging && previewZoom > 100) {
                    setPreviewPan({
                      x: e.clientX - dragStart.x,
                      y: e.clientY - dragStart.y
                    });
                  }
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                <div className="w-full h-full flex items-center justify-center p-4">
                  <div
                    className="bg-white shadow-2xl rounded-lg p-12 sm:p-16 w-full max-w-2xl transition-transform duration-200 select-none"
                    style={{ 
                      transform: `rotate(${pdfPages[previewPage].rotation}deg) scale(${previewZoom / 100}) translate(${previewPan.x / (previewZoom / 100)}px, ${previewPan.y / (previewZoom / 100)}px)`,
                      transformOrigin: 'center center'
                    }}
                  >
                    {/* Simulated PDF Content */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-4/5"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-2/3"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-4/5"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 sm:h-2.5 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions - Clean, Simple Design */}
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    handleRotatePage(previewPage);
                  }}
                  className="gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Rotate
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    handleDuplicatePage(previewPage);
                    setPreviewPage(null);
                  }}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    handleDeletePage(previewPage);
                    setPreviewPage(null);
                  }}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Navigation Warning Modal */}
      <Dialog open={showNavigationWarning} onOpenChange={() => setShowNavigationWarning(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{UI_LABELS.navigationWarning.title}</DialogTitle>
            <DialogDescription>
              {UI_LABELS.navigationWarning.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNavigationWarning(false)}
            >
              {UI_LABELS.navigationWarning.stay}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setShowNavigationWarning(false);
                if (pendingNavigation) {
                  window.location.href = pendingNavigation;
                }
              }}
            >
              {UI_LABELS.navigationWarning.leave}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Processing Modal - Centered */}
      <ProcessingModal
        isOpen={currentStep === "processing"}
        progress={progress}
        title={UI_LABELS.processing.title}
        description={UI_LABELS.processing.description}
        icon={FileText}
      />
    </>
  );
}