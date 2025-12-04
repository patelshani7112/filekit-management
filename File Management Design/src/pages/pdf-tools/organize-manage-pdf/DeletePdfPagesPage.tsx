/**
 * Delete PDF Pages Page
 * 
 * Purpose: Allow users to remove unwanted pages from PDF files
 * 
 * Architecture:
 * - Uses component-based architecture with EditPageLayout for edit mode
 * - Content externalized to /content/tools/pdf-tools/organize-manage-pdf/delete-pdf-content.ts
 * - Same 3-column layout structure as Merge PDF and Split PDF pages
 * - SEO sections: Definition, How It Works, Why Choose, Use Cases, FAQ, Footer
 * - Ad integration: StickyAd (desktop side columns), MobileStickyAd (mobile top banner)
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
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "../../../components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn } from "../../../components/ui/utils";
import { 
  FileText, FileMinus, Archive, RotateCw, FileCog, Upload, Download, Trash2,
  Lock, Zap, Merge, FileEdit, FileImage, FileVideo, FileSignature, Unlock, Eye,
  Scissors, Plus, FileType, Image, Repeat, Settings, Split, FileSearch, Copy, X, FilePlus, Info,
  ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, GripVertical
} from "lucide-react";

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
} from "../../../content/tools/pdf-tools/organize-manage-pdf/delete-pdf-content";

type ProcessStep = "upload" | "edit" | "processing" | "complete";

export default function DeletePdfPagesPage() {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState<ProcessStep>("upload");
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [pdfPages, setPdfPages] = useState<Array<{
    fileIndex: number;
    fileName: string;
    pageNumber: number;
    selected: boolean;
    rotation?: number;
  }>>([]);
  const [pagesToDelete, setPagesToDelete] = useState<number[]>([]);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");
  
  // State for merge option
  const [mergeFiles, setMergeFiles] = useState(false);
  
  // State for collapsible Source Files section (hidden by default)
  const [isSourceFilesOpen, setIsSourceFilesOpen] = useState(false);
  
  // State for drag and drop in Source Files
  const [dragOverFileIndex, setDragOverFileIndex] = useState<number | null>(null);
  
  // State for preview modal
  const [previewPageIndex, setPreviewPageIndex] = useState<number | null>(null);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [previewPan, setPreviewPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle files selected from FileUploader
  const handleFilesSelected = (selectedFiles: File[]) => {
    const maxFiles = 15;
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
    const invalidFiles = selectedFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return ext !== '.pdf';
    });
    
    if (invalidFiles.length > 0) {
      setValidationMessage(`Only PDF files are allowed. ${invalidFiles.length} invalid file(s) removed.`);
      setValidationType("error");
      selectedFiles = selectedFiles.filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return ext === '.pdf';
      });
    }
    
    // Validate file sizes
    const oversizedFiles = selectedFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setValidationMessage(`${oversizedFiles.length} file(s) exceed ${maxFileSize}MB limit and were removed.`);
      setValidationType("error");
      selectedFiles = selectedFiles.filter(file => file.size <= maxFileSize * 1024 * 1024);
    }
    
    // Check available slots
    const filesToAdd = availableSlots < selectedFiles.length 
      ? selectedFiles.slice(0, availableSlots)
      : selectedFiles;
    
    if (filesToAdd.length < selectedFiles.length) {
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
  const handleReorderFiles = (startIndex: number, endIndex: number) => {
    const newFiles = Array.from(files);
    const [removed] = newFiles.splice(startIndex, 1);
    newFiles.splice(endIndex, 0, removed);
    setFiles(newFiles);
    
    // Update pdfPages to reflect new file indices
    setPdfPages((prev) => {
      return prev.map((page) => {
        let newFileIndex = page.fileIndex;
        
        // Update file indices based on the reorder
        if (page.fileIndex === startIndex) {
          newFileIndex = endIndex;
        } else if (startIndex < endIndex) {
          // Moving down: shift up the files in between
          if (page.fileIndex > startIndex && page.fileIndex <= endIndex) {
            newFileIndex = page.fileIndex - 1;
          }
        } else {
          // Moving up: shift down the files in between
          if (page.fileIndex >= endIndex && page.fileIndex < startIndex) {
            newFileIndex = page.fileIndex + 1;
          }
        }
        
        return { ...page, fileIndex: newFileIndex };
      });
    });
  };

  // Handle clear all files
  const handleClearAll = () => {
    setFiles([]);
    setUploadProgress({});
    // Clear validation message when all files are cleared
    setValidationMessage("");
  };

  // Handle continue to edit step
  const handleContinueToEdit = () => {
    // Simulate extracting pages from PDFs
    const allPages: Array<{
      fileIndex: number;
      fileName: string;
      pageNumber: number;
      selected: boolean;
    }> = [];

    files.forEach((file, fileIndex) => {
      // Mock: assume each PDF has 5-10 pages
      const pageCount = Math.floor(Math.random() * 6) + 5;
      for (let i = 0; i < pageCount; i++) {
        allPages.push({
          fileIndex,
          fileName: file.name,
          pageNumber: i + 1,
          selected: false,
        });
      }
    });

    setPdfPages(allPages);
    setCurrentStep("edit");
  };

  // Handle back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
    setPagesToDelete([]);
  };

  // Handle delete pages (process)
  const handleDeletePages = () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCurrentStep("complete");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Handle delete selected pages (stay on edit page)
  const handleDeleteSelectedPages = () => {
    // Remove the selected pages from pdfPages array
    const newPages = pdfPages.filter((_, index) => !pagesToDelete.includes(index));
    setPdfPages(newPages);
    // Clear selection
    setPagesToDelete([]);
  };

  // Handle process another file
  const handleProcessAnother = () => {
    setFiles([]);
    setPdfPages([]);
    setPagesToDelete([]);
    setCurrentStep("upload");
    setProgress(0);
    setUploadProgress({});
  };

  // Handle rotate individual page
  const handleRotatePage = (pageIndex: number) => {
    setPdfPages((prev) => 
      prev.map((page, i) => 
        i === pageIndex 
          ? { ...page, rotation: ((page.rotation || 0) + 90) % 360 }
          : page
      )
    );
  };

  // Handle duplicate individual page
  const handleDuplicatePage = (pageIndex: number) => {
    setPdfPages((prev) => {
      const newPages = [...prev];
      const pageToDuplicate = { ...prev[pageIndex] };
      newPages.splice(pageIndex + 1, 0, pageToDuplicate);
      return newPages;
    });
  };

  // Handle delete individual page
  const handleDeleteSinglePage = (pageIndex: number) => {
    setPdfPages((prev) => prev.filter((_, i) => i !== pageIndex));
    setPagesToDelete((prev) => prev.filter((i) => i !== pageIndex).map(i => i > pageIndex ? i - 1 : i));
  };

  // Handle page preview
  const handlePreviewPage = (pageIndex: number) => {
    setPreviewPageIndex(pageIndex);
    setPreviewZoom(100);
  };

  // Handle navigation in preview
  const handlePreviewNext = () => {
    if (previewPageIndex !== null && previewPageIndex < pdfPages.length - 1) {
      setPreviewPageIndex(previewPageIndex + 1);
    }
  };

  const handlePreviewPrevious = () => {
    if (previewPageIndex !== null && previewPageIndex > 0) {
      setPreviewPageIndex(previewPageIndex - 1);
    }
  };

  // Calculate if we should block navigation
  const hasUnsavedWork = (files.length > 0 || pdfPages.length > 0) && currentStep !== "processing";

  return (
    <>
      {/* SEO */}
      <SeoHead path="/delete-pdf-pages" />
      <ToolJsonLd path="/delete-pdf-pages" />
      
      {/* Navigation Blocker */}
      <NavigationBlocker when={hasUnsavedWork} message={NAVIGATION_BLOCKER_MESSAGE} />

      {/* Processing Modal */}
      {currentStep === "processing" && (
        <ProcessingModal
          isOpen={true}
          progress={progress}
          title="Deleting Pages..."
          description="Removing selected pages from your PDF. This will only take a moment."
          icon={Trash2}
        />
      )}

      {/* SUCCESS STEP */}
      {currentStep === "complete" ? (
        <>
          <SuccessHeader 
            icon={FileMinus}
            title="Pages Deleted Successfully!"
            description="Your PDF has been optimized and is ready for download."
          />

          <ToolPageLayout>
            {/* Success Section - Use ToolSuccessSection Component */}
            <ToolSuccessSection
              files={mergeFiles ? {
                // Single merged file
                url: "#",
                name: "cleaned.pdf",
                size: (() => {
                  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
                  if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
                  return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
                })(),
                type: "pdf" as const,
                pages: pdfPages.length - pagesToDelete.length,
              } : files.map((file, fileIndex) => {
                // Multiple separate files
                const filePages = pdfPages.filter(p => p.fileIndex === fileIndex);
                const deletedCount = pagesToDelete.filter(idx => pdfPages[idx]?.fileIndex === fileIndex).length;
                const remainingCount = filePages.length - deletedCount;
                
                return {
                  url: "#",
                  name: file.name,
                  size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
                  type: "pdf" as const,
                  pages: remainingCount
                };
              })}
              onReset={handleProcessAnother}
              resetButtonText="Delete From Another PDF"
              previewTitle={mergeFiles ? "Optimized PDF Preview" : "Optimized PDFs Preview"}
              downloadAllText="Download All as ZIP"
              icon={FileText}
              showDownloadAll={!mergeFiles} // Only show download all for multiple files
            />

            {/* Related Tools Section */}
            <RelatedToolsSection 
              tools={RELATED_TOOLS}
              introText="Continue optimizing your PDFs or explore other powerful tools."
            />
          </ToolPageLayout>
        </>
      ) : currentStep === "edit" ? (
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
                <h3 className="font-semibold text-lg">Delete Pages Settings</h3>
                
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
                      const newPages: Array<{fileIndex: number, fileName: string, pageNumber: number, rotation: number, selected: boolean}> = [];
                      newFiles.forEach((file, idx) => {
                        const fileIndex = files.length + idx;
                        const pageCount = Math.floor(Math.random() * 6) + 5;
                        for (let i = 0; i < pageCount; i++) {
                          newPages.push({
                            fileIndex,
                            fileName: file.name,
                            pageNumber: i + 1,
                            rotation: 0,
                            selected: false,
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
                  disabled={files.length >= 15}
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  Add Files
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Instructions - Simple info style with smaller text */}
                <div className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    Click on pages to select them for bulk deletion, or use the delete button on each page card to remove individual pages.
                  </p>
                </div>

                {/* Source Files Section - Collapsible */}
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
                    <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {files.map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", fileIndex.toString());
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                          setDragOverFileIndex(fileIndex);
                        }}
                        onDragLeave={() => {
                          setDragOverFileIndex(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
                          if (draggedIndex !== fileIndex) {
                            handleReorderFiles(draggedIndex, fileIndex);
                          }
                          setDragOverFileIndex(null);
                        }}
                        onDragEnd={() => {
                          setDragOverFileIndex(null);
                        }}
                        className={cn(
                          "flex items-center gap-2 text-xs p-3 rounded-lg border-2 transition-all cursor-move",
                          dragOverFileIndex === fileIndex
                            ? "border-purple-500 bg-purple-100 scale-105"
                            : "bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"
                        )}
                      >
                        <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
                            setPagesToDelete([]);
                          }}
                          className="h-6 w-6 p-0 hover:bg-red-100 text-gray-400 hover:text-destructive flex-shrink-0"
                          title="Remove file"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                    </div>
                  )}
                </div>

                {/* Stats - Only show when pages are selected for bulk deletion */}
                {pagesToDelete.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Pages:</span>
                      <span className="font-medium">{pdfPages.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Selected for Deletion:</span>
                      <span className="font-medium text-red-600">{pagesToDelete.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Will Remain:</span>
                      <span className="font-medium text-green-600">{pdfPages.length - pagesToDelete.length}</span>
                    </div>
                  </div>
                )}

                {/* Quick Actions - Only show when pages are selected */}
                {pagesToDelete.length > 0 && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagesToDelete(pdfPages.map((_, i) => i))}
                      className="w-full text-xs h-8"
                    >
                      Select All Pages
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagesToDelete([])}
                      className="w-full text-xs h-8"
                    >
                      Clear Selection
                    </Button>
                    
                    {/* Delete Button - Show right after Clear Selection */}
                    <Button
                      onClick={handleDeleteSelectedPages}
                      size="lg"
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white h-12"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete {pagesToDelete.length} Page{pagesToDelete.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                )}

                {/* Output Settings */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Output Settings</h4>
                  <div className="space-y-3">
                    {/* Merge files checkbox - Only show if multiple files */}
                    {files.length > 1 && (
                      <div className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <input
                          type="checkbox"
                          id="mergeFiles"
                          checked={mergeFiles}
                          onChange={(e) => setMergeFiles(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-purple-600 bg-white border-purple-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                        />
                        <label htmlFor="mergeFiles" className="flex-1 text-sm text-gray-700 cursor-pointer">
                          <span className="font-medium">Merge all files into one PDF</span>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Combine all files after deleting pages
                          </p>
                        </label>
                      </div>
                    )}

                    <Label htmlFor="outputFileName" className="text-xs text-gray-600">
                      Filename
                    </Label>
                    <Input
                      id="outputFileName"
                      type="text"
                      defaultValue="cleaned.pdf"
                      placeholder="cleaned.pdf"
                      className="text-sm bg-purple-50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                    
                    {/* Total Pages and Size Info */}
                    <div className="flex items-center justify-between pt-2 pb-1">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">{pdfPages.length} pages total</span>
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

                {/* Process Button - ALWAYS VISIBLE */}
                <Button
                  onClick={handleDeletePages}
                  size="lg"
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Process PDF
                </Button>
              </div>
            </>
          }
        >
          {/* Pages Grid - Scrollable with Pink Border */}
          <div className="border-2 border-pink-200 rounded-lg p-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {pdfPages.map((page, index) => {
                const isSelected = pagesToDelete.includes(index);
                
                // Long-press handling for mobile
                let pressTimer: NodeJS.Timeout | null = null;
                
                const handleTouchStart = (e: React.TouchEvent) => {
                  pressTimer = setTimeout(() => {
                    e.preventDefault();
                    handlePreviewPage(index);
                  }, 500); // 500ms long press
                };
                
                const handleTouchEnd = () => {
                  if (pressTimer) {
                    clearTimeout(pressTimer);
                  }
                };
                
                return (
                  <div
                    key={index}
                    className="group relative"
                  >
                    {/* Page Card */}
                    <div 
                      className={cn(
                        "bg-white border-2 rounded-lg overflow-hidden transition-all cursor-pointer relative",
                        isSelected
                          ? "border-red-500 shadow-lg"
                          : "border-gray-200 hover:border-purple-400 hover:shadow-lg"
                      )}
                      onClick={() => {
                        setPagesToDelete((prev) =>
                          prev.includes(index)
                            ? prev.filter((i) => i !== index)
                            : [...prev, index]
                        );
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handlePreviewPage(index);
                      }}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* Action Buttons at TOP - ONLY DELETE BUTTON */}
                      <div className="absolute top-1.5 right-1.5 z-10 bg-white/95 rounded p-0.5 shadow-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSinglePage(index);
                          }}
                          className="h-6 w-6 p-0 hover:bg-red-500 hover:text-white text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Selection Checkbox - Top Left Corner */}
                      <div 
                        className="absolute top-1.5 left-1.5 z-10 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPagesToDelete((prev) =>
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
                              ? "bg-red-500 border-red-500"
                              : "bg-white/95 border-gray-300 hover:border-red-400"
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

                      {/* Preview Button - Show on hover (desktop) - Moved to bottom left */}
                      <div className="absolute bottom-14 left-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewPage(index);
                          }}
                          className="h-6 w-6 p-0 bg-white/95 hover:bg-purple-500 hover:text-white transition-colors shadow-md rounded"
                          title="Preview (or double-click)"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Red Overlay for Selected Pages */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-red-500/10 pointer-events-none z-[1]" />
                      )}

                      {/* Page Thumbnail */}
                      <div 
                        className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t flex items-center justify-center relative p-3"
                        style={{ transform: `rotate(${page.rotation || 0}deg)` }}
                      >
                        {/* Document lines to simulate PDF page */}
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
                              Page {index + 1}
                            </div>
                            <div className="text-[10px] text-gray-500 truncate" title={page.fileName}>
                              {page.fileName}
                            </div>
                          </div>
                          {/* Page Number Badge */}
                          <div className="flex-shrink-0">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md",
                              isSelected
                                ? "bg-gradient-to-br from-red-500 to-pink-500"
                                : "bg-gradient-to-br from-purple-500 to-pink-500"
                            )}>
                              {index + 1}
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

          {/* Preview Modal */}
          <Dialog open={previewPageIndex !== null} onOpenChange={() => {
            setPreviewPageIndex(null);
            setPreviewZoom(100);
            setPreviewPan({ x: 0, y: 0 });
          }}>
            <DialogContent className="max-w-4xl p-4 sm:p-6 max-h-[95vh]">
              <VisuallyHidden.Root>
                <DialogTitle>Page Preview</DialogTitle>
                <DialogDescription>
                  View and edit the selected PDF page. You can zoom, rotate, duplicate, or delete this page.
                </DialogDescription>
              </VisuallyHidden.Root>
              {previewPageIndex !== null && pdfPages[previewPageIndex] && (
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

                  {/* Page Preview Container with Pan & Zoom */}
                  <div 
                    className="bg-gray-100 rounded-xl overflow-auto relative"
                    style={{ 
                      height: '500px',
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
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <div
                        className="bg-white shadow-2xl rounded-lg p-8 sm:p-12 w-full max-w-md transition-transform duration-200 select-none"
                        style={{ 
                          transform: `rotate(${pdfPages[previewPageIndex].rotation || 0}deg) scale(${previewZoom / 100}) translate(${previewPan.x / (previewZoom / 100)}px, ${previewPan.y / (previewZoom / 100)}px)`,
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

                  {/* Actions - Only Delete Button */}
                  <div className="flex flex-wrap gap-3 justify-center pt-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => {
                        handleDeleteSinglePage(previewPageIndex);
                        setPreviewPageIndex(null);
                      }}
                      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Page
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </EditPageLayout>
      ) : (
        <>
          {/* UPLOAD STEP */}
          <ToolPageHero
            title={HERO_CONTENT.title}
            description={HERO_CONTENT.description}
          />

          <ToolPageLayout>
            {/* Mobile Sticky Ad */}
            <MobileStickyAd topOffset={64} height={100} />

            <Card className="p-4 sm:p-6 lg:p-8 border-2 border-dashed border-gray-300">
              {/* File Uploader - Always visible */}
              <FileUploader
                onFilesSelected={handleFilesSelected}
                acceptedTypes=".pdf"
                multiple={true}
                maxFiles={UPLOAD_CONFIG.maxFiles}
                maxFileSize={UPLOAD_CONFIG.maxFileSize}
                fileTypeLabel="PDF"
                helperText="PDF files only · Up to 15 files · 50MB each"
                validationMessage={validationMessage}
                validationType={validationType}
              />

              {/* Show file list when files are uploaded */}
              {files.length > 0 && (
                <FileList
                  files={files}
                  onRemove={handleRemoveFile}
                  onReorder={handleReorderFiles}
                  onClearAll={handleClearAll}
                  onContinue={handleContinueToEdit}
                  continueText="Continue to Delete Pages"
                  continueDisabled={files.length < 1}
                  showReorder={false}
                  uploadProgress={uploadProgress}
                />
              )}
            </Card>

            {/* Only show these sections if NOT on complete or processing step */}
            {currentStep !== "complete" && currentStep !== "processing" && (
              <>
                {/* Related Tools */}
                <RelatedToolsSection 
                  tools={RELATED_TOOLS}
                  introText="These tools work great with PDF page management and optimization."
                />

                {/* Tool Definition Section */}
                <ToolDefinitionSection
                  title={SEO_CONTENT.definition.title}
                  content={SEO_CONTENT.definition.content}
                />

                {/* How It Works */}
                <HowItWorksSteps
                  title="How to Delete Pages from a PDF"
                  subtitle="Clean up your document in four simple steps"
                  introText="You don't need any special software to remove pages from a PDF. Just follow these steps in your browser."
                  steps={HOW_IT_WORKS_STEPS}
                />

                {/* Why Choose Section */}
                <WhyChooseSection
                  title="Why Use WorkflowPro to Delete PDF Pages?"
                  subtitle="A powerful, secure, and free PDF page deletion tool"
                  introText="WorkflowPro makes it easy to remove unwanted pages and optimize your PDFs."
                  features={WHY_CHOOSE_WORKFLOWPRO.features}
                />

                {/* Use Cases Section */}
                <UseCasesSection
                  title={USE_CASES_TITLE}
                  useCases={USE_CASES}
                />

                {/* FAQ Section */}
                <ToolFAQSection
                  faqs={FAQ_ITEMS}
                />

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
    </>
  );
}