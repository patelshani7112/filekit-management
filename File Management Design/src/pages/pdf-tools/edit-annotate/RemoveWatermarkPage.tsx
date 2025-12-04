/**
 * Remove Watermark PDF Page
 * 
 * Purpose: Allow users to remove watermarks from PDF files
 * 
 * Features:
 * - Upload multiple PDF files (up to 10, 50MB each)
 * - Click and drag to select watermark areas on each page
 * - Apply removal to current page, all pages, or page range
 * - Batch processing support
 * - Download cleaned PDF files
 * 
 * Architecture:
 * - Uses component-based architecture with EditPageLayout for edit mode
 * - Content externalized to /content/tools/pdf-tools/edit-annotate/remove-watermark-content.ts
 * - Same 3-column layout structure as Merge PDF and Sign PDF pages
 * - Ads work on all devices (mobile + desktop) for all steps (upload, edit, complete)
 * 
 * How it works:
 * 1. User uploads PDF files
 * 2. User selects watermark areas by clicking and dragging on pages
 * 3. User chooses which pages to apply removal to
 * 4. User clicks "Remove Watermarks"
 * 5. Files are processed (simulated)
 * 6. User downloads the cleaned PDF files
 * 
 * Components:
 * - EditPageLayout: Full-screen edit mode with sidebar for watermark removal
 * - ToolPageLayout: 3-column layout wrapper (content + 2 side ads)
 * - ToolPageHero: Hero section with title and description
 * - FileUploader: Upload interface
 * - FileListWithValidation: Display uploaded files with validation
 * - ProcessingModal: Show progress during processing
 * - NavigationBlocker: Warn users before leaving with unsaved changes
 * - ToolSuccessSection: Success page with download options
 * - RelatedToolsSection: Related tools
 * - HowItWorksSteps: Step-by-step guide
 * - ToolFAQSection: FAQ section
 * - ToolDefinitionSection: Definition section
 * - UseCasesSection: Use cases section
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
import { AD_CONFIG } from "../../../src/config/adConfig";
import { Button } from "../../../components/ui/button";
import { GradientButton } from "../../../components/ui/gradient-button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { 
  FileText, 
  Droplets,
  X,
  Archive,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
  FilePlus,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight
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
  FAQ_ITEMS,
  DEFINITION,
  SEO_CONTENT,
  UI_LABELS,
  UPLOAD_CONFIG,
  VALIDATION_MESSAGES,
} from "../../../content/tools/pdf-tools/edit-annotate/remove-watermark-content";

// Processing steps for the tool
const PROCESSING_STEPS = [
  "Analyzing PDF structure...",
  "Detecting watermark areas...",
  "Removing selected regions...",
  "Optimizing document...",
  "Finalizing PDF...",
];

// Type definitions
interface WatermarkArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
  fileIndex: number;
}

interface PdfPage {
  fileIndex: number;
  fileName: string;
  pageNumber: number;
}

type CurrentStep = "upload" | "edit" | "complete";
type ApplyToPages = "current" | "all" | "range";

export default function RemoveWatermarkPage() {
  // Navigation state
  const [currentStep, setCurrentStep] = useState<CurrentStep>("upload");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // File management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidations, setFileValidations] = useState<FileValidationInfo[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const currentFile = files[currentFileIndex];

  // Validation state (for FileUploader component)
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Page management
  const [pdfPages, setPdfPages] = useState<PdfPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = pdfPages[currentPageIndex];
  const currentFilePages = pdfPages.filter(p => p.fileIndex === currentFileIndex);

  // Watermark area selection
  const [watermarkAreas, setWatermarkAreas] = useState<WatermarkArea[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [isDraggingArea, setIsDraggingArea] = useState(false);
  const [isDrawingArea, setIsDrawingArea] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentDrawArea, setCurrentDrawArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const pdfPreviewRef = useRef<HTMLDivElement>(null);

  // Removal settings
  const [applyToPages, setApplyToPages] = useState<ApplyToPages>("current");
  const [pageRangeStart, setPageRangeStart] = useState(1);
  const [pageRangeEnd, setPageRangeEnd] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentProcessingStep, setCurrentProcessingStep] = useState("");

  // UI state
  const [isSourceFileOpen, setIsSourceFileOpen] = useState(false);

  // Get current file pages with watermark areas
  const currentFileAreasCount = watermarkAreas.filter(
    area => area.fileIndex === currentFileIndex
  ).length;
  const currentPageAreasCount = watermarkAreas.filter(
    area => area.fileIndex === currentFileIndex && area.pageIndex === currentPageIndex
  ).length;

  // Total size formatted
  const totalSizeFormatted = (() => {
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    if (totalBytes < 1024) return `${totalBytes} B`;
    if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
    return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
  })();

  // Handle file selection
  const handleFilesSelected = async (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setHasUnsavedChanges(true);

    // Validate files
    const validations = await Promise.all(
      selectedFiles.map(async (file) => {
        const validation: FileValidationInfo = {
          file: file, // Include the File object
          name: file.name,
          size: file.size,
          isValidating: false, // Validation is complete at this point
          isValid: true,
          pageCount: 0, // Will be set below
          error: "",
          errorMessage: "",
        };

        // Validate file type
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          validation.isValid = false;
          validation.error = VALIDATION_MESSAGES.invalidFileType;
          validation.errorMessage = VALIDATION_MESSAGES.invalidFileType;
          return validation;
        }

        // Validate file size (convert MB to bytes for comparison)
        const maxSizeInBytes = UPLOAD_CONFIG.maxFileSize * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
          validation.isValid = false;
          validation.error = VALIDATION_MESSAGES.fileTooLarge;
          validation.errorMessage = VALIDATION_MESSAGES.fileTooLarge;
          return validation;
        }

        // Get PDF info (pages count)
        try {
          const pdfInfo = await getPdfInfo(file);
          validation.pageCount = pdfInfo.pages;
          validation.pages = pdfInfo.pages;
        } catch (error) {
          const mockPages = Math.floor(Math.random() * 10) + 1; // Mock pages
          validation.pageCount = mockPages;
          validation.pages = mockPages;
        }

        return validation;
      })
    );

    setFileValidations(validations);

    // Generate mock pages for valid files
    const allPages: PdfPage[] = [];
    validations.forEach((validation, fileIndex) => {
      if (validation.isValid && validation.pages) {
        for (let i = 0; i < validation.pages; i++) {
          allPages.push({
            fileIndex,
            fileName: validation.name,
            pageNumber: i + 1,
          });
        }
      }
    });
    setPdfPages(allPages);
  };

  // Handle removing a file
  const handleRemoveFile = (fileIndex: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    setFileValidations((prev) => prev.filter((_, i) => i !== fileIndex));
    setPdfPages((prev) =>
      prev
        .filter((p) => p.fileIndex !== fileIndex)
        .map((p) => ({
          ...p,
          fileIndex: p.fileIndex > fileIndex ? p.fileIndex - 1 : p.fileIndex,
        }))
    );
    setWatermarkAreas((prev) =>
      prev
        .filter((a) => a.fileIndex !== fileIndex)
        .map((a) => ({
          ...a,
          fileIndex: a.fileIndex > fileIndex ? a.fileIndex - 1 : a.fileIndex,
        }))
    );

    // Adjust current file index if needed
    if (currentFileIndex >= fileIndex && currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }

    setHasUnsavedChanges(true);
  };

  // Handle proceeding to edit
  const handleProceedToEdit = () => {
    const validFiles = fileValidations.filter(v => v.isValid);
    if (validFiles.length === 0) {
      return;
    }
    setCurrentStep("edit");
    setCurrentFileIndex(0);
    setCurrentPageIndex(0);
  };

  // Handle going back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
    setCurrentPageIndex(0);
    setHasUnsavedChanges(false);
  };

  // Drawing watermark area selection
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pdfPreviewRef.current) return;

    const rect = pdfPreviewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawingArea(true);
    setDrawStart({ x, y });
    setCurrentDrawArea(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingArea || !drawStart || !pdfPreviewRef.current) return;

    const rect = pdfPreviewRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = currentX - drawStart.x;
    const height = currentY - drawStart.y;

    setCurrentDrawArea({
      x: width > 0 ? drawStart.x : currentX,
      y: height > 0 ? drawStart.y : currentY,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const handleMouseUp = () => {
    if (!isDrawingArea || !currentDrawArea || !drawStart) {
      setIsDrawingArea(false);
      setDrawStart(null);
      setCurrentDrawArea(null);
      return;
    }

    // Only create area if it's large enough (at least 10x10 pixels)
    if (currentDrawArea.width > 10 && currentDrawArea.height > 10) {
      const newArea: WatermarkArea = {
        id: `area-${Date.now()}-${Math.random()}`,
        x: currentDrawArea.x,
        y: currentDrawArea.y,
        width: currentDrawArea.width,
        height: currentDrawArea.height,
        pageIndex: currentPageIndex,
        fileIndex: currentFileIndex,
      };

      setWatermarkAreas((prev) => [...prev, newArea]);
      setHasUnsavedChanges(true);
    }

    setIsDrawingArea(false);
    setDrawStart(null);
    setCurrentDrawArea(null);
  };

  // Remove selected area
  const handleRemoveArea = (areaId: string) => {
    setWatermarkAreas((prev) => prev.filter((a) => a.id !== areaId));
    setHasUnsavedChanges(true);
  };

  // Clear all areas on current page
  const handleClearCurrentPageAreas = () => {
    setWatermarkAreas((prev) =>
      prev.filter(
        (a) => !(a.fileIndex === currentFileIndex && a.pageIndex === currentPageIndex)
      )
    );
    setHasUnsavedChanges(true);
  };

  // Clear all areas
  const handleClearAllAreas = () => {
    setWatermarkAreas([]);
    setHasUnsavedChanges(true);
  };

  // Navigate to previous file
  const handlePreviousFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
      setCurrentPageIndex(0);
    }
  };

  // Navigate to next file
  const handleNextFile = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
      setCurrentPageIndex(0);
    }
  };

  // Navigate to previous page
  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentFileIndex > 0) {
      // Go to previous file's last page
      setCurrentFileIndex(currentFileIndex - 1);
      const prevFilePages = pdfPages.filter(p => p.fileIndex === currentFileIndex - 1);
      setCurrentPageIndex(pdfPages.indexOf(prevFilePages[prevFilePages.length - 1]));
    }
  };

  // Navigate to next page
  const handleNextPage = () => {
    const currentFilePages = pdfPages.filter(p => p.fileIndex === currentFileIndex);
    const currentPageInFile = currentFilePages.indexOf(currentPage);

    if (currentPageInFile < currentFilePages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (currentFileIndex < files.length - 1) {
      // Go to next file's first page
      setCurrentFileIndex(currentFileIndex + 1);
      const nextFilePages = pdfPages.filter(p => p.fileIndex === currentFileIndex + 1);
      setCurrentPageIndex(pdfPages.indexOf(nextFilePages[0]));
    }
  };

  // Process files
  const handleProcessFiles = async () => {
    if (watermarkAreas.length === 0) {
      alert(VALIDATION_MESSAGES.noAreasSelected);
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate realistic progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    // Simulate processing steps
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setCurrentProcessingStep(PROCESSING_STEPS[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    clearInterval(progressInterval);
    setProgress(100);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsProcessing(false);
    setCurrentStep("complete");
    setHasUnsavedChanges(false);
  };

  // Download results
  const handleDownload = () => {
    // Mock download
    console.log("Downloading cleaned PDF files...");
    alert(`Downloading ${files.length} cleaned PDF file(s)`);
  };

  // Start over
  const handleStartOver = () => {
    setCurrentStep("upload");
    setFiles([]);
    setFileValidations([]);
    setPdfPages([]);
    setWatermarkAreas([]);
    setCurrentFileIndex(0);
    setCurrentPageIndex(0);
    setHasUnsavedChanges(false);
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
    setFileValidations([]);
    setPdfPages([]);
    setWatermarkAreas([]);
    setCurrentFileIndex(0);
    setCurrentPageIndex(0);
    setHasUnsavedChanges(false);
  };

  // Retry validation for a specific file
  const handleRetryValidation = async (fileIndex: number) => {
    const file = files[fileIndex];
    if (!file) return;

    // Re-validate the file
    const validation: FileValidationInfo = {
      file: file,
      name: file.name,
      size: file.size,
      isValidating: true,
      isValid: true,
      pageCount: 0,
      error: "",
      errorMessage: "",
    };

    // Update validation state to show validating
    setFileValidations((prev) =>
      prev.map((v, i) => (i === fileIndex ? validation : v))
    );

    // Simulate validation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      validation.isValid = false;
      validation.error = VALIDATION_MESSAGES.invalidFileType;
      validation.errorMessage = VALIDATION_MESSAGES.invalidFileType;
      validation.isValidating = false;
      setFileValidations((prev) =>
        prev.map((v, i) => (i === fileIndex ? validation : v))
      );
      return;
    }

    // Validate file size
    if (file.size > UPLOAD_CONFIG.maxFileSize * 1024 * 1024) {
      validation.isValid = false;
      validation.error = VALIDATION_MESSAGES.fileTooLarge;
      validation.errorMessage = VALIDATION_MESSAGES.fileTooLarge;
      validation.isValidating = false;
      setFileValidations((prev) =>
        prev.map((v, i) => (i === fileIndex ? validation : v))
      );
      return;
    }

    // Get PDF info (pages count)
    try {
      const pdfInfo = await getPdfInfo(file);
      validation.pageCount = pdfInfo.pages;
      validation.pages = pdfInfo.pages;
    } catch (error) {
      const mockPages = Math.floor(Math.random() * 10) + 1;
      validation.pageCount = mockPages;
      validation.pages = mockPages;
    }

    validation.isValidating = false;

    // Update validation state
    setFileValidations((prev) =>
      prev.map((v, i) => (i === fileIndex ? validation : v))
    );

    // Re-generate pages for this file
    const allPages: PdfPage[] = [];
    fileValidations.forEach((v, i) => {
      if (i === fileIndex) {
        if (validation.isValid && validation.pages) {
          for (let j = 0; j < validation.pages; j++) {
            allPages.push({
              fileIndex: i,
              fileName: validation.name,
              pageNumber: j + 1,
            });
          }
        }
      } else {
        if (v.isValid && v.pages) {
          for (let j = 0; j < v.pages; j++) {
            allPages.push({
              fileIndex: i,
              fileName: v.name,
              pageNumber: j + 1,
            });
          }
        }
      }
    });
    setPdfPages(allPages);
  };

  return (
    <>
      <SeoHead
        title="Remove Watermark from PDF - Free Online Watermark Remover | WorkflowPro"
        description="Remove watermarks from PDF files online for free. Upload your PDF, select watermark areas, and download clean documents – no signup required, 100% secure."
        canonical="/remove-watermark-pdf"
      />
      <ToolJsonLd
        name="Remove Watermark from PDF"
        description={HERO_CONTENT.description}
        url="/remove-watermark-pdf"
      />

      <NavigationBlocker
        when={hasUnsavedChanges && currentStep === "edit"}
        message="You have unsaved changes. Are you sure you want to leave? All selected watermark areas will be lost."
      />

      <ProcessingModal
        isOpen={isProcessing}
        progress={progress}
        title="Removing Watermarks..."
        description="Processing your PDF files and removing selected watermark areas"
        icon={Droplets}
      />

      {currentStep === "edit" ? (
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex flex-col">
          {/* Horizontal Banner Ad - STICKY - Only show if ads enabled */}
          {AD_CONFIG.enabled && AD_CONFIG.topBannerAd.enabled && (
            <div className="bg-gray-100 border-b border-gray-200 py-2 md:py-4 sticky top-16 z-40">
              <div className="container mx-auto px-2 md:px-4 max-w-[1600px]">
                <div className="bg-white border border-gray-300 rounded-lg flex items-center justify-center h-[60px] md:h-[90px]">
                  <div className="text-center text-sm text-gray-500">
                    <div className="font-medium text-xs md:text-sm">Google AdSense</div>
                    <div className="text-xs text-gray-400 hidden md:block">728 × 90 - Horizontal Banner</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Toolbar */}
          <div className="container mx-auto px-2 md:px-4 max-w-[1600px] py-2 md:py-4">
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 md:px-4 py-2 shadow-sm">
              {/* Left: Back Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToUpload}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Upload</span>
              </Button>

              {/* Center: Page Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPageIndex === 0}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 px-2">
                  Page {currentPageIndex + 1} of {pdfPages.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPageIndex === pdfPages.length - 1}
                  className="h-8 px-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Right: Clear All Button */}
              {watermarkAreas.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllAreas}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3 mr-1.5" />
                  <span className="hidden sm:inline">Clear All ({watermarkAreas.length})</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              )}
            </div>
          </div>

          {/* Main 3-Column Layout */}
          <div className="container mx-auto px-2 md:px-4 max-w-[1600px] flex-1 pb-4 md:pb-8">
            <div className="flex flex-col lg:flex-row gap-2 md:gap-4 h-full lg:h-[calc(100vh-240px)]">
              
              {/* LEFT: Page Thumbnails Panel */}
              <div className="hidden lg:block lg:w-[10%] bg-white border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                <div className="h-full overflow-y-auto custom-scrollbar p-2">
                  <div className="text-xs font-medium text-gray-500 mb-2 px-1">PAGES</div>
                  <div className="space-y-2">
                    {pdfPages.map((page, index) => {
                      const pageAreas = watermarkAreas.filter(
                        area => area.pageIndex === index
                      );
                      const isActive = currentPageIndex === index;
                      
                      return (
                        <div
                          key={index}
                          onClick={() => setCurrentPageIndex(index)}
                          className={`relative cursor-pointer rounded-lg border-2 transition-all overflow-hidden group ${
                            isActive
                              ? 'border-purple-500 shadow-md'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          {/* Thumbnail Preview */}
                          <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 p-2">
                            <div className="bg-white h-full rounded shadow-sm p-1.5 space-y-0.5">
                              {[...Array(8)].map((_, i) => (
                                <div
                                  key={i}
                                  className="h-0.5 bg-gray-300 rounded"
                                  style={{ width: `${Math.random() * 30 + 60}%` }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {/* Page Number Badge */}
                          <div className="absolute bottom-1 left-1 bg-white px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-700 shadow-sm">
                            {index + 1}
                          </div>
                          
                          {/* Watermark Areas Indicator */}
                          {pageAreas.length > 0 && (
                            <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm">
                              {pageAreas.length}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CENTER: PDF Preview with Watermark Selection */}
              <div className="w-full lg:w-[65%] bg-white border border-gray-200 rounded-xl overflow-hidden flex-shrink-0 h-[400px] sm:h-[500px] md:h-[600px] lg:h-auto">
                <div className="h-full overflow-y-auto custom-scrollbar">
                  <div 
                    ref={pdfPreviewRef}
                    className="p-4 sm:p-8 min-h-full cursor-crosshair select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded p-4 sm:p-8 relative mx-auto max-w-[600px]">
                      {/* Mock PDF Page Content */}
                      <div className={`bg-white rounded shadow-lg p-6 sm:p-10 space-y-3 ${showPreview ? 'opacity-50' : ''}`}>
                        {[...Array(20)].map((_, i) => (
                          <div 
                            key={i} 
                            className="h-2.5 bg-gray-300 rounded"
                            style={{ width: `${Math.random() * 30 + 70}%` }}
                          />
                        ))}
                      </div>
                      
                      {/* Watermark Area Overlays */}
                      {watermarkAreas
                        .filter(area => area.pageIndex === currentPageIndex && area.fileIndex === currentFileIndex)
                        .map(area => (
                          <div
                            key={area.id}
                            className={`absolute border-2 transition-all ${
                              selectedAreaId === area.id ? 'border-red-500 bg-red-500/20' : 'border-red-400 bg-red-400/10'
                            } ${showPreview ? 'bg-white/90' : ''} cursor-pointer group`}
                            style={{
                              left: area.x,
                              top: area.y,
                              width: area.width,
                              height: area.height,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAreaId(area.id);
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveArea(area.id);
                              }}
                              className="absolute -top-7 right-0 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                            >
                              <X className="w-3 h-3 inline mr-1" />
                              Remove
                            </button>
                          </div>
                        ))}
                      
                      {/* Current drawing area */}
                      {isDrawingArea && currentDrawArea && (
                        <div
                          className="absolute border-2 border-dashed border-purple-500 bg-purple-500/20 pointer-events-none"
                          style={{
                            left: currentDrawArea.x,
                            top: currentDrawArea.y,
                            width: currentDrawArea.width,
                            height: currentDrawArea.height,
                          }}
                        />
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1 max-w-[600px] mx-auto">
                      <p className="font-medium">{UI_LABELS.instructions}:</p>
                      <p>• {UI_LABELS.step1}</p>
                      <p>• {UI_LABELS.step2}</p>
                      <p>• {UI_LABELS.step4}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Settings Panel */}
              <div className="w-full lg:w-[25%] bg-white border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                <div className="h-full overflow-y-auto custom-scrollbar p-3 md:p-4">
                  
                  <div className="space-y-3 md:space-y-4">
                    {/* Source Files Section - Only show if multiple files */}
                    {files.length > 1 && (
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* Header with Add Files button and toggle */}
                        <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 border-b border-gray-200">
                          <button
                            onClick={() => setIsSourceFileOpen(!isSourceFileOpen)}
                            className="flex items-center gap-1.5 md:gap-2 flex-1 text-left hover:text-purple-600 transition-colors"
                          >
                            <h3 className="font-semibold text-sm md:text-base">Source Files</h3>
                            {isSourceFileOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
                            )}
                          </button>
                          <input
                            type="file"
                            id="addMoreFilesWatermark"
                            accept=".pdf"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                              const newFiles = Array.from(e.target.files || []);
                              if (newFiles.length > 0) {
                                await handleFilesSelected([...files, ...newFiles]);
                              }
                              e.target.value = '';
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('addMoreFilesWatermark')?.click()}
                            disabled={files.length >= UPLOAD_CONFIG.maxFiles}
                            className="gap-1 md:gap-1.5 text-xs h-7 md:h-8 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-500 hover:text-white transition-colors"
                          >
                            <FilePlus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span className="hidden sm:inline">Add Files</span>
                          </Button>
                        </div>

                        {/* File List - Collapsible */}
                        {isSourceFileOpen && (
                          <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                            <div className="p-2 space-y-2">
                              {files.map((file, fileIndex) => {
                                const maxLength = 25;
                                const truncatedName = file.name.length > maxLength
                                  ? file.name.substring(0, maxLength) + "..."
                                  : file.name;

                                return (
                                  <div
                                    key={fileIndex}
                                    onClick={() => {
                                      setCurrentFileIndex(fileIndex);
                                      setCurrentPageIndex(0);
                                    }}
                                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all group cursor-pointer ${
                                      currentFileIndex === fileIndex
                                        ? 'bg-purple-100 border-purple-400'
                                        : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                                    }`}
                                  >
                                    <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 cursor-move" />
                                    <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm text-gray-700 truncate block" title={file.name}>
                                        {truncatedName}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-500 flex-shrink-0">
                                      ({pdfPages.filter(p => p.fileIndex === fileIndex).length})
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFile(fileIndex);
                                      }}
                                      className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                                    >
                                      <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <h3 className="font-semibold">{UI_LABELS.removalSettings}</h3>
                    
                    {/* Selection Instructions */}
                    <div className="border-b pb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">{UI_LABELS.selectionMode}</h4>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                        <p>• {UI_LABELS.step1}</p>
                        <p>• {UI_LABELS.step2}</p>
                        <p>• {UI_LABELS.step3}</p>
                      </div>
                    </div>

                    {/* Selected Areas */}
                    <div className="border-b pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">{UI_LABELS.watermarkAreas}</h4>
                        {currentPageAreasCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearCurrentPageAreas}
                            className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Clear Page
                          </Button>
                        )}
                      </div>
                      
                      {currentPageAreasCount === 0 ? (
                        <div className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-lg">
                          {UI_LABELS.noAreasSelected}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600 mb-2">
                            {currentPageAreasCount} {UI_LABELS.areasOnPage}
                          </div>
                          {watermarkAreas
                            .filter(a => a.fileIndex === currentFileIndex && a.pageIndex === currentPageIndex)
                            .map((area) => (
                              <div
                                key={area.id}
                                className="flex items-center gap-2 p-2 rounded bg-gray-50 border border-gray-200 text-xs"
                              >
                                <div className="flex-1 text-gray-700">
                                  Area {area.width.toFixed(0)}×{area.height.toFixed(0)}px
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveArea(area.id)}
                                  className="h-6 w-6 p-0 hover:bg-red-100 text-gray-400 hover:text-destructive"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Apply to Pages - Only if more than 1 page in current file */}
                    {currentFilePages.length > 1 && (
                      <div className="border-b pb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">{UI_LABELS.applyToPages}</h4>
                        
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="applyToPages"
                              value="current"
                              checked={applyToPages === "current"}
                              onChange={(e) => setApplyToPages(e.target.value as ApplyToPages)}
                              className="w-4 h-4 accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">
                              {UI_LABELS.currentPageOnly} (Page {(currentFilePages.indexOf(currentPage) || 0) + 1})
                            </span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="applyToPages"
                              value="all"
                              checked={applyToPages === "all"}
                              onChange={(e) => setApplyToPages(e.target.value as ApplyToPages)}
                              className="w-4 h-4 accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">
                              {UI_LABELS.allPages} ({currentFilePages.length} pages)
                            </span>
                          </label>
                          
                          <div>
                            <label className="flex items-center gap-2 cursor-pointer mb-2">
                              <input
                                type="radio"
                                name="applyToPages"
                                value="range"
                                checked={applyToPages === "range"}
                                onChange={(e) => setApplyToPages(e.target.value as ApplyToPages)}
                                className="w-4 h-4 accent-purple-600"
                              />
                              <span className="text-sm text-gray-700">{UI_LABELS.pageRange}</span>
                            </label>
                            {applyToPages === "range" && (
                              <div className="ml-6 flex items-center gap-2">
                                <Input
                                  type="number"
                                  min={1}
                                  max={currentFilePages.length}
                                  value={pageRangeStart}
                                  onChange={(e) => setPageRangeStart(parseInt(e.target.value) || 1)}
                                  className="w-16 h-8 text-xs"
                                />
                                <span className="text-xs text-gray-500">to</span>
                                <Input
                                  type="number"
                                  min={1}
                                  max={currentFilePages.length}
                                  value={pageRangeEnd}
                                  onChange={(e) => setPageRangeEnd(parseInt(e.target.value) || 1)}
                                  className="w-16 h-8 text-xs"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preview Mode */}
                    <div className="border-b pb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">{UI_LABELS.previewMode}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={!showPreview ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowPreview(false)}
                          className="flex-1"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          Original
                        </Button>
                        <Button
                          variant={showPreview ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowPreview(true)}
                          className="flex-1"
                        >
                          <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="mt-6 pt-4 border-t">
                    <GradientButton
                      onClick={handleProcessFiles}
                      variant="primary"
                      size="md"
                      className="w-full"
                      disabled={watermarkAreas.length === 0}
                    >
                      <Droplets className="w-4 h-4 mr-2" />
                      {UI_LABELS.removeWatermarks}
                    </GradientButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Success Header - Only on complete step */}
          {currentStep === "complete" && (
            <SuccessHeader
              title="Watermarks Removed Successfully!"
              message={`Your ${files.length} PDF file${files.length !== 1 ? 's have' : ' has'} been processed and cleaned.`}
            />
          )}
          
          {/* Hero - Only on upload step */}
          {currentStep !== "complete" && (
            <ToolPageHero
              title={HERO_CONTENT.title}
              description={HERO_CONTENT.description}
              subline={HERO_CONTENT.subline}
              Icon={Droplets}
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
                    multiple={UPLOAD_CONFIG.allowMultiple} 
                    maxFiles={UPLOAD_CONFIG.maxFiles} 
                    maxFileSize={UPLOAD_CONFIG.maxFileSize * 1024 * 1024} 
                    fileTypeLabel={UPLOAD_CONFIG.fileTypeLabel} 
                    helperText={UPLOAD_CONFIG.helperText} 
                    validationMessage={validationMessage} 
                    validationType={validationType} 
                  />
                  {files.length > 0 && (
                    <FileListWithValidation
                      files={fileValidations}
                      onRemove={(index) => handleRemoveFile(index)}
                      onContinue={handleProceedToEdit}
                      continueText="Select Watermark Areas"
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
                  files={{
                    name: files.length === 1 ? files[0].name.replace('.pdf', '_no_watermark.pdf') : `${files.length}_files_no_watermark.zip`,
                    url: '#',
                    type: 'pdf'
                  }}
                  fileInfo={{
                    'Size': totalSizeFormatted,
                    'Files Processed': files.length.toString(),
                    'Watermarks Removed': watermarkAreas.length.toString()
                  }}
                  onReset={handleStartOver}
                  resetButtonText="Remove More Watermarks"
                  icon={Droplets}
                />
              )}
            </div>

            {/* Related Tools Section - Show on complete step */}
            {currentStep === "complete" && (
              <RelatedToolsSection
                title="Try More PDF Tools"
                tools={RELATED_TOOLS}
              />
            )}

            {/* Show these sections if NOT on complete step */}
            {currentStep !== "complete" && (
              <>
                {/* Related Tools Section - Inside layout during upload */}
                <RelatedToolsSection
                  title="Related PDF Tools"
                  tools={RELATED_TOOLS}
                  introText="These tools work well with removing watermarks and help you edit your PDFs."
                />

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

                {/* Why Choose Section */}
                <WhyChooseSection
                  title={WHY_CHOOSE_WORKFLOWPRO.title}
                  subtitle="The most powerful and user-friendly PDF watermark remover available online"
                  introText="WorkflowPro delivers fast, private, and secure watermark removal trusted by professionals, students, and businesses. No signup required."
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
    </>
  );
}