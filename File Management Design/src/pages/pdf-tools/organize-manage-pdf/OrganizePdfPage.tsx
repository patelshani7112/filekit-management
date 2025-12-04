/**
 * Organize PDF Page - Advanced Version
 * 
 * Purpose: Comprehensive PDF organization tool with advanced features
 * 
 * Architecture:
 * - Uses component-based architecture with content externalized
 * - Content centralized in /content/tools/pdf-tools/organize-manage-pdf/organize-pdf-content.ts
 * - Same 3-column layout structure as other PDF tools
 * - Edit mode keeps unique toolbar and advanced features
 * - SEO sections: Definition, How It Works, Why Choose, Use Cases, FAQ, Footer
 * 
 * Features:
 * - Upload up to 10 PDF files
 * - Multi-select pages (Ctrl+Click, Shift+Click)
 * - Comprehensive toolbar with all actions
 * - Page management (reorder, rotate, delete, duplicate, etc.)
 * - Advanced operations (sort, reverse, insert, replace, extract, etc.)
 * - Page preview with zoom and metadata
 * - Export options
 * - Auto-tools (remove blanks, auto-rotate, etc.)
 */

import { useState, useRef, useEffect } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import {
  ToolPageLayout,
  ToolPageHero,
  FileUploader,
  FileListWithValidation,
  RelatedToolsSection,
  HowItWorksSteps,
  WhyChooseSection,
  ToolFAQSection,
  ToolDefinitionSection,
  UseCasesSection,
  ToolSEOFooter,
  MobileStickyAd,
  NavigationBlocker,
  ToolSuccessSection,
  SuccessHeader,
  ProcessingModal,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
import { getPdfInfo } from "../../../utils/pdfUtils";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";

/**
 * Import all content from centralized content file
 */
import {
  HERO_CONTENT,
  UPLOAD_CONFIG,
  HOW_IT_WORKS_STEPS,
  RELATED_TOOLS,
  USE_CASES,
  USE_CASES_TITLE,
  SEO_CONTENT,
  FAQ_ITEMS,
  UI_LABELS,
  VALIDATION_MESSAGES,
  NAVIGATION_BLOCKER_MESSAGE,
} from "../../../content/tools/pdf-tools/organize-manage-pdf/organize-pdf-content";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { Slider } from "../../../components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../../components/ui/dropdown-menu";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  FileCog, Upload, Download, RotateCw, RotateCcw, Trash2, Copy, GripVertical, Eye, ZoomIn, ZoomOut,
  FileText, ArrowLeft, Merge, Split, Scissors, Archive, Lock, Unlock, FileEdit, FileSignature,
  FileImage, Search, BookOpen, FileSpreadsheet, Presentation, FileType, Image, FileMinus, Settings,
  Check, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Move, ArrowUp, ArrowDown, 
  ArrowUpToLine, ArrowDownToLine, Shuffle, SortAsc, SortDesc, Plus, FilePlus2,
  Scissors as ScissorsIcon, Combine, FlipVertical, FlipHorizontal, Maximize, Minimize, Crop,
  Type, Shapes, Highlighter, Sparkles, Wand2, Filter, Layers,
  Square, Circle, Triangle, PenTool, Eraser, Droplet, Info, MoreVertical, RefreshCw, Replace, Hash
} from "lucide-react";



// ========================================
// 🎯 TYPE DEFINITIONS
// ========================================

type Step = "upload" | "edit" | "processing" | "complete";

interface PageInfo {
  id: string;
  fileIndex: number;
  fileName: string;
  pageNumber: number; // Original page number in the file
  displayIndex: number; // Current display position
  thumbnail: string;
  rotation: number;
  isBlank?: boolean;
  orientation?: "portrait" | "landscape";
  width?: number;
  height?: number;
}

type ThumbnailSize = "small" | "medium" | "large";
type SortMode = "original" | "ascending" | "descending" | "orientation" | "size";

// ========================================
// 🎨 MAIN COMPONENT
// ========================================

export default function OrganizePdfPage() {
  // ====== Step Management ======
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // ====== Validation ======
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // ====== Page Management ======
  const [pdfPages, setPdfPages] = useState<PageInfo[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  // ====== View Settings ======
  const [thumbnailSize, setThumbnailSize] = useState<ThumbnailSize>("large");

  // ====== Output Settings ======
  const [outputFileName, setOutputFileName] = useState("organized.pdf");

  // ====== Processing ======
  const [progress, setProgress] = useState(0);

  // ====== Preview Modal ======
  const [previewPage, setPreviewPage] = useState<PageInfo | null>(null);
  const [previewZoom, setPreviewZoom] = useState(100);

  // ====== Dialogs ======
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [insertBlankDialogOpen, setInsertBlankDialogOpen] = useState(false);
  const [insertPdfDialogOpen, setInsertPdfDialogOpen] = useState(false);
  const [replacePageDialogOpen, setReplacePageDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // ====== Drag and Drop ======
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);

  // ====== Success ======
  const [outputFileSize, setOutputFileSize] = useState(0);

  // ========================================
  // 📤 FILE UPLOAD HANDLERS
  // ========================================

  const handleFileUpload = async (uploadedFiles: File[]) => {
    const maxFileSize = UPLOAD_CONFIG.maxFileSize; // MB
    const maxFiles = UPLOAD_CONFIG.maxFiles;

    setValidationMessage("");

    if (files.length + uploadedFiles.length > maxFiles) {
      setValidationMessage(VALIDATION_MESSAGES.maxFilesExceeded(maxFiles));
      setValidationType("error");
      return;
    }

    const validFiles: File[] = [];
    const newValidationInfo: FileValidationInfo[] = [];
    
    for (const file of uploadedFiles) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!UPLOAD_CONFIG.acceptedTypes.includes(ext)) {
        setValidationMessage(VALIDATION_MESSAGES.invalidFileType(1));
        setValidationType("error");
        continue;
      }

      if (file.size > maxFileSize * 1024 * 1024) {
        setValidationMessage(VALIDATION_MESSAGES.fileSizeExceeded(1, maxFileSize));
        setValidationType("error");
        continue;
      }

      validFiles.push(file);
      
      // Add to validation info with initial validating state
      newValidationInfo.push({
        file,
        isValidating: true,
        isValid: false,
        pageCount: 0,
      });
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      setFileValidationInfo((prev) => [...prev, ...newValidationInfo]);
      
      // Validate each PDF
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const globalIndex = files.length + i;
        
        try {
          const pdfInfo = await getPdfInfo(file);
          
          setFileValidationInfo((prev) => {
            const updated = [...prev];
            updated[globalIndex] = {
              file,
              isValidating: false,
              isValid: true,
              pageCount: pdfInfo.pageCount,
            };
            return updated;
          });
        } catch (error) {
          setFileValidationInfo((prev) => {
            const updated = [...prev];
            updated[globalIndex] = {
              file,
              isValidating: false,
              isValid: false,
              pageCount: 0,
              error: error instanceof Error ? error.message : "Failed to read PDF",
            };
            return updated;
          });
        }
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileValidationInfo((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorderFiles = (fromIndex: number, toIndex: number) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);

    const newValidationInfo = [...fileValidationInfo];
    const [movedInfo] = newValidationInfo.splice(fromIndex, 1);
    newValidationInfo.splice(toIndex, 0, movedInfo);
    setFileValidationInfo(newValidationInfo);
  };

  const handleClearAll = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
  };

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
      };
      return updated;
    });

    try {
      const pdfInfo = await getPdfInfo(file);
      
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: true,
          pageCount: pdfInfo.pageCount,
        };
        return updated;
      });
    } catch (error) {
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: false,
          pageCount: 0,
          error: error instanceof Error ? error.message : "Failed to read PDF",
        };
        return updated;
      });
    }
  };

  // ========================================
  // 🎬 STEP NAVIGATION
  // ========================================

  const handleContinueToEdit = () => {
    if (files.length === 0) return;

    // Generate mock pages from all files
    const allPages: PageInfo[] = [];
    let globalPageId = 0;

    files.forEach((file, fileIndex) => {
      const pageCount = Math.floor(Math.random() * 8) + 5; // 5-12 pages per file

      for (let i = 0; i < pageCount; i++) {
        const isPortrait = Math.random() > 0.3;
        allPages.push({
          id: `page-${globalPageId++}`,
          fileIndex,
          fileName: file.name,
          pageNumber: i + 1,
          displayIndex: allPages.length,
          thumbnail: `https://via.placeholder.com/200x280/f3f4f6/6366f1?text=Page+${i + 1}`,
          rotation: 0,
          isBlank: Math.random() < 0.05, // 5% chance of blank page
          orientation: isPortrait ? "portrait" : "landscape",
          width: isPortrait ? 612 : 792,
          height: isPortrait ? 792 : 612,
        });
      }
    });

    setPdfPages(allPages);
    setOutputFileName(files[0].name.replace('.pdf', '-organized.pdf'));
    setCurrentStep("edit");
  };

  const handleBackToUpload = () => {
    setCurrentStep("upload");
    setSelectedPages(new Set());
  };

  // ========================================
  // 📄 PAGE SELECTION HANDLERS
  // ========================================

  const handlePageClick = (pageId: string, index: number, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Ctrl+Click: Toggle selection
      setSelectedPages((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(pageId)) {
          newSet.delete(pageId);
        } else {
          newSet.add(pageId);
        }
        return newSet;
      });
      setLastSelectedIndex(index);
    } else if (event.shiftKey && lastSelectedIndex !== null) {
      // Shift+Click: Select range
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const newSet = new Set(selectedPages);
      
      for (let i = start; i <= end; i++) {
        if (pdfPages[i]) {
          newSet.add(pdfPages[i].id);
        }
      }
      setSelectedPages(newSet);
    } else {
      // Regular click: Toggle selection
      setSelectedPages((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(pageId)) {
          newSet.delete(pageId);
        } else {
          newSet.add(pageId);
        }
        return newSet;
      });
      setLastSelectedIndex(index);
    }
  };

  const handleSelectAll = () => {
    setSelectedPages(new Set(pdfPages.map(p => p.id)));
  };

  const handleDeselectAll = () => {
    setSelectedPages(new Set());
    setLastSelectedIndex(null);
  };

  // ========================================
  // 🔧 PAGE MANIPULATION HANDLERS
  // ========================================

  const handleRotatePage = (pageId: string, direction: "left" | "right" = "right") => {
    setPdfPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? { 
              ...page, 
              rotation: direction === "right" 
                ? (page.rotation + 90) % 360 
                : (page.rotation - 90 + 360) % 360 
            }
          : page
      )
    );
  };

  const handleRotateSelected = (direction: "left" | "right" = "right") => {
    setPdfPages((prev) =>
      prev.map((page) =>
        selectedPages.has(page.id)
          ? { 
              ...page, 
              rotation: direction === "right" 
                ? (page.rotation + 90) % 360 
                : (page.rotation - 90 + 360) % 360 
            }
          : page
      )
    );
  };

  const handleDuplicatePage = (pageId: string) => {
    const pageIndex = pdfPages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) return;

    const pageToDuplicate = pdfPages[pageIndex];
    const newPage = {
      ...pageToDuplicate,
      id: `page-${Date.now()}-${Math.random()}`,
      displayIndex: pageIndex + 1,
    };

    setPdfPages((prev) => [
      ...prev.slice(0, pageIndex + 1),
      newPage,
      ...prev.slice(pageIndex + 1),
    ]);
  };

  const handleDuplicateSelected = () => {
    const selectedIds = Array.from(selectedPages);
    const newPages: PageInfo[] = [];

    selectedIds.forEach((pageId) => {
      const page = pdfPages.find((p) => p.id === pageId);
      if (page) {
        newPages.push({
          ...page,
          id: `page-${Date.now()}-${Math.random()}-${pageId}`,
        });
      }
    });

    setPdfPages((prev) => [...prev, ...newPages]);
  };

  const handleDeletePage = (pageId: string) => {
    if (pdfPages.length <= 1) {
      alert("You must keep at least one page in the PDF.");
      return;
    }
    setPdfPages((prev) => prev.filter((p) => p.id !== pageId));
    setSelectedPages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(pageId);
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    if (pdfPages.length - selectedPages.size < 1) {
      alert("You must keep at least one page in the PDF.");
      return;
    }
    setPdfPages((prev) => prev.filter((p) => !selectedPages.has(p.id)));
    setSelectedPages(new Set());
  };

  // ========================================
  // 🔀 PAGE REORDERING
  // ========================================

  const handleMoveToStart = () => {
    if (selectedPages.size === 0) return;

    const selected = pdfPages.filter((p) => selectedPages.has(p.id));
    const notSelected = pdfPages.filter((p) => !selectedPages.has(p.id));

    setPdfPages([...selected, ...notSelected]);
  };

  const handleMoveToEnd = () => {
    if (selectedPages.size === 0) return;

    const selected = pdfPages.filter((p) => selectedPages.has(p.id));
    const notSelected = pdfPages.filter((p) => !selectedPages.has(p.id));

    setPdfPages([...notSelected, ...selected]);
  };

  const handleReverseOrder = () => {
    setPdfPages((prev) => [...prev].reverse());
  };

  const handleReverseSelected = () => {
    if (selectedPages.size === 0) return;

    const selectedIndices = pdfPages
      .map((p, idx) => (selectedPages.has(p.id) ? idx : -1))
      .filter((idx) => idx !== -1);

    const selectedPagesArray = selectedIndices.map((idx) => pdfPages[idx]);
    selectedPagesArray.reverse();

    const newPages = [...pdfPages];
    selectedIndices.forEach((idx, i) => {
      newPages[idx] = selectedPagesArray[i];
    });

    setPdfPages(newPages);
  };

  const handleSortPages = (mode: SortMode) => {
    let sorted = [...pdfPages];

    switch (mode) {
      case "ascending":
        sorted.sort((a, b) => a.pageNumber - b.pageNumber);
        break;
      case "descending":
        sorted.sort((a, b) => b.pageNumber - a.pageNumber);
        break;
      case "orientation":
        sorted.sort((a, b) => {
          if (a.orientation === "portrait" && b.orientation === "landscape") return -1;
          if (a.orientation === "landscape" && b.orientation === "portrait") return 1;
          return 0;
        });
        break;
      case "size":
        sorted.sort((a, b) => (b.width! * b.height!) - (a.width! * a.height!));
        break;
    }

    setPdfPages(sorted);
    setSortDialogOpen(false);
  };

  // ========================================
  // 🤖 AUTO TOOLS
  // ========================================

  const handleRemoveBlankPages = () => {
    const nonBlank = pdfPages.filter((p) => !p.isBlank);
    if (nonBlank.length === 0) {
      alert("Cannot remove all pages. At least one page must remain.");
      return;
    }
    setPdfPages(nonBlank);
    setSelectedPages(new Set());
  };

  const handleAutoRotate = () => {
    // Mock: Rotate all landscape pages to portrait
    setPdfPages((prev) =>
      prev.map((page) =>
        page.orientation === "landscape"
          ? { ...page, rotation: (page.rotation + 90) % 360, orientation: "portrait" }
          : page
      )
    );
  };

  // ========================================
  // ➕ INSERT PAGES
  // ========================================

  const handleInsertBlankPage = (position: "start" | "end" | "after") => {
    const newPage: PageInfo = {
      id: `blank-${Date.now()}`,
      fileIndex: -1,
      fileName: "Blank Page",
      pageNumber: 0,
      displayIndex: 0,
      thumbnail: `https://via.placeholder.com/200x280/ffffff/cccccc?text=Blank`,
      rotation: 0,
      isBlank: true,
      orientation: "portrait",
      width: 612,
      height: 792,
    };

    if (position === "start") {
      setPdfPages((prev) => [newPage, ...prev]);
    } else if (position === "end") {
      setPdfPages((prev) => [...prev, newPage]);
    } else if (position === "after" && selectedPages.size === 1) {
      const selectedId = Array.from(selectedPages)[0];
      const index = pdfPages.findIndex((p) => p.id === selectedId);
      if (index !== -1) {
        setPdfPages((prev) => [
          ...prev.slice(0, index + 1),
          newPage,
          ...prev.slice(index + 1),
        ]);
      }
    }

    setInsertBlankDialogOpen(false);
  };

  // ========================================
  // 🖼️ DRAG AND DROP
  // ========================================

  const handleDragStart = (pageId: string) => {
    setDraggedPageId(pageId);
  };

  const handleDragOver = (e: React.DragEvent, targetPageId: string) => {
    e.preventDefault();

    if (!draggedPageId || draggedPageId === targetPageId) return;

    const draggedIndex = pdfPages.findIndex((p) => p.id === draggedPageId);
    const targetIndex = pdfPages.findIndex((p) => p.id === targetPageId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newPages = [...pdfPages];
    const [draggedPage] = newPages.splice(draggedIndex, 1);
    newPages.splice(targetIndex, 0, draggedPage);

    setPdfPages(newPages);
    setDraggedPageId(targetPageId);
  };

  const handleDragEnd = () => {
    setDraggedPageId(null);
  };

  // ========================================
  // 💾 SAVE AND PROCESS
  // ========================================

  const handleSavePdf = () => {
    setCurrentStep("processing");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const totalSize = files.reduce((sum, f) => sum + f.size, 0);
            setOutputFileSize(totalSize);
            setCurrentStep("complete");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleStartOver = () => {
    setCurrentStep("upload");
    setFiles([]);
    setPdfPages([]);
    setSelectedPages(new Set());
    setOutputFileName("organized.pdf");
    setValidationMessage("");
  };

  // ========================================
  // 🎨 THUMBNAIL SIZE CLASSES
  // ========================================

  const getThumbnailClass = () => {
    switch (thumbnailSize) {
      case "small":
        return "w-32 h-40";
      case "large":
        return "w-36 h-48";
      default:
        return "w-40 h-52";
    }
  };

  const getGridCols = () => {
    switch (thumbnailSize) {
      case "small":
        return "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";
      case "large":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
      default:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6";
    }
  };

  // ========================================
  // 🎨 JSX RENDERING
  // ========================================

  const hasUnsavedWork = (files.length > 0 || pdfPages.length > 0) && currentStep !== "processing";

  return (
    <>
      <SeoHead path="/organize-pdf" />
      <ToolJsonLd path="/organize-pdf" />
      <NavigationBlocker when={hasUnsavedWork} message={NAVIGATION_BLOCKER_MESSAGE} />

      {/* Processing Modal */}
      {currentStep === "processing" && (
        <ProcessingModal
          isOpen={true}
          progress={progress}
          title="Organizing PDF..."
          description="Please wait while we organize your PDF pages."
          icon={FileCog}
        />
      )}

      {/* ========================================
          UPLOAD STEP
      ======================================== */}
      {currentStep === "upload" && (
        <>
          <ToolPageHero
            title={HERO_CONTENT.title}
            description={HERO_CONTENT.description}
            icon={FileCog}
          />

          <ToolPageLayout>
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

            {/* Uploaded Files List with Validation */}
            {files.length > 0 && (
              <FileListWithValidation
                files={fileValidationInfo}
                onRemove={handleRemoveFile}
                onReorder={handleReorderFiles}
                onClearAll={handleClearAll}
                onContinue={handleContinueToEdit}
                continueText={UI_LABELS.continueButton}
                continueDisabled={false}
                showReorder={true}
                onRetry={handleRetryValidation}
              />
            )}

            <RelatedToolsSection tools={RELATED_TOOLS} />
            <HowItWorksSteps 
              steps={HOW_IT_WORKS_STEPS} 
              title={SEO_CONTENT.howItWorks.title || "How to Organize PDF Pages"}
              subtitle={SEO_CONTENT.howItWorks.subtitle}
              introText={SEO_CONTENT.howItWorks.introText}
            />
            <WhyChooseSection
              title={WHY_CHOOSE_WORKFLOWPRO.title}
              subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle}
              introText={WHY_CHOOSE_WORKFLOWPRO.introText}
              features={WHY_CHOOSE_WORKFLOWPRO.features}
            />
            <ToolDefinitionSection
              title={SEO_CONTENT.definition.title}
              content={SEO_CONTENT.definition.content}
            />
            <UseCasesSection
              title={USE_CASES_TITLE}
              useCases={USE_CASES}
            />
            <ToolFAQSection faqs={FAQ_ITEMS} />
            <ToolSEOFooter
              title={SEO_CONTENT.footer.title}
              content={SEO_CONTENT.footer.content}
            />
          </ToolPageLayout>
        </>
      )}

      {/* ========================================
          EDIT STEP - ADVANCED ORGANIZE
      ======================================== */}
      {currentStep === "edit" && (
        <div className="min-h-screen bg-gray-50 pb-2">
          {/* Toolbar - Desktop */}
          <div className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 py-2">
              {/* Main Toolbar Row */}
              <div className="flex items-center gap-1.5 flex-nowrap">
                {/* Back Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToUpload}
                  className="gap-1 text-xs h-8 flex-shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Upload
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Select All */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-8 px-2 flex-shrink-0"
                  title="Select All"
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>

                {/* Deselect */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="h-8 px-2 flex-shrink-0"
                  disabled={selectedPages.size === 0}
                  title="Deselect"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>

                {selectedPages.size > 0 && (
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    ({selectedPages.size})
                  </span>
                )}

                <div className="w-px h-6 bg-gray-300" />

                {/* Rotate Left */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRotateSelected("left")}
                  disabled={selectedPages.size === 0}
                  title="Rotate Left"
                  className="h-8 px-2 flex-shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>

                {/* Rotate Right */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRotateSelected("right")}
                  disabled={selectedPages.size === 0}
                  title="Rotate Right"
                  className="h-8 px-2 flex-shrink-0"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </Button>

                <div className="w-px h-6 bg-gray-300" />

                {/* Duplicate */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicateSelected}
                  disabled={selectedPages.size === 0}
                  title="Duplicate Selected"
                  className="h-8 px-2 flex-shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>

                {/* Delete */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={selectedPages.size === 0}
                  title="Delete Selected"
                  className="h-8 px-2 text-red-600 hover:bg-red-50 flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>

                <div className="w-px h-6 bg-gray-300" />

                {/* Move to Start */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMoveToStart}
                  disabled={selectedPages.size === 0}
                  title="Move to Start"
                  className="h-8 px-2 flex-shrink-0"
                >
                  <ArrowUpToLine className="w-3.5 h-3.5" />
                </Button>

                {/* Move to End */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMoveToEnd}
                  disabled={selectedPages.size === 0}
                  title="Move to End"
                  className="h-8 px-2 flex-shrink-0"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                </Button>

                <div className="w-px h-6 bg-gray-300" />

                {/* Sort */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortDialogOpen(true)}
                  className="text-xs h-8 gap-1 flex-shrink-0"
                  title="Sort Pages"
                >
                  <SortAsc className="w-3.5 h-3.5" />
                  Sort
                </Button>

                {/* Reverse */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1 flex-shrink-0" title="Reverse Pages">
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reverse
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={handleReverseOrder}>
                      <RefreshCw className="w-3.5 h-3.5 mr-2" />
                      Reverse All Pages
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleReverseSelected}
                      disabled={selectedPages.size === 0}
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-2" />
                      Reverse Selected Pages
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-px h-6 bg-gray-300" />

                {/* Insert */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-2 flex-shrink-0" title="Insert">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setInsertBlankDialogOpen(true)}>
                      <FilePlus2 className="w-3.5 h-3.5 mr-2" />
                      Insert Blank Page
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setInsertPdfDialogOpen(true)}>
                      <FileText className="w-3.5 h-3.5 mr-2" />
                      Insert from PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReplacePageDialogOpen(true)}>
                      <Replace className="w-3.5 h-3.5 mr-2" />
                      Replace Page
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Save PDF Button */}
                <Button
                  onClick={handleSavePdf}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-8 ml-auto gap-1 flex-shrink-0"
                  size="sm"
                >
                  Save PDF
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Toolbar - Horizontal Scroll */}
          <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="px-2 py-2">
              {/* Back Button - Always Visible */}
              <div className="mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToUpload}
                  className="gap-1 text-xs h-8 w-full"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Upload
                </Button>
              </div>

              {/* Scrollable Toolbar */}
              <div className="overflow-x-auto custom-scrollbar pb-2">
                <div className="flex items-center gap-2 min-w-max">
                  {/* Select All */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="h-9 px-3 flex-shrink-0 gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="text-xs">All</span>
                  </Button>

                  {/* Deselect */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                    className="h-9 px-3 flex-shrink-0 gap-1.5"
                    disabled={selectedPages.size === 0}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span className="text-xs">Clear</span>
                  </Button>

                  {selectedPages.size > 0 && (
                    <span className="text-xs text-white bg-purple-500 px-2 py-1 rounded-full flex-shrink-0">
                      {selectedPages.size}
                    </span>
                  )}

                  <div className="w-px h-6 bg-gray-300" />

                  {/* Rotate Left */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRotateSelected("left")}
                    disabled={selectedPages.size === 0}
                    className="h-9 px-3 flex-shrink-0 gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-xs">Left</span>
                  </Button>

                  {/* Rotate Right */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRotateSelected("right")}
                    disabled={selectedPages.size === 0}
                    className="h-9 px-3 flex-shrink-0 gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span className="text-xs">Right</span>
                  </Button>

                  <div className="w-px h-6 bg-gray-300" />

                  {/* Duplicate */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDuplicateSelected}
                    disabled={selectedPages.size === 0}
                    className="h-9 px-3 flex-shrink-0 gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-xs">Copy</span>
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteSelected}
                    disabled={selectedPages.size === 0}
                    className="h-9 px-3 text-red-600 hover:bg-red-50 flex-shrink-0 gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-xs">Delete</span>
                  </Button>

                  <div className="w-px h-6 bg-gray-300" />

                  {/* Move to Start */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMoveToStart}
                    disabled={selectedPages.size === 0}
                    className="h-9 px-3 flex-shrink-0 gap-1.5"
                  >
                    <ArrowUpToLine className="w-3.5 h-3.5" />
                    <span className="text-xs">Start</span>
                  </Button>

                  {/* Move to End */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMoveToEnd}
                    disabled={selectedPages.size === 0}
                    className="h-9 px-3 flex-shrink-0 gap-1.5"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span className="text-xs">End</span>
                  </Button>

                  <div className="w-px h-6 bg-gray-300" />

                  {/* Sort */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortDialogOpen(true)}
                    className="h-9 px-3 flex-shrink-0 gap-1.5"
                  >
                    <SortAsc className="w-3.5 h-3.5" />
                    <span className="text-xs">Sort</span>
                  </Button>

                  {/* Reverse */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 px-3 flex-shrink-0 gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="text-xs">Reverse</span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={handleReverseOrder}>
                        <RefreshCw className="w-3.5 h-3.5 mr-2" />
                        Reverse All Pages
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleReverseSelected}
                        disabled={selectedPages.size === 0}
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-2" />
                        Reverse Selected Pages
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="w-px h-6 bg-gray-300" />

                  {/* Insert */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 px-3 flex-shrink-0 gap-1.5">
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-xs">Insert</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setInsertBlankDialogOpen(true)}>
                        <FilePlus2 className="w-3.5 h-3.5 mr-2" />
                        Insert Blank Page
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setInsertPdfDialogOpen(true)}>
                        <FileText className="w-3.5 h-3.5 mr-2" />
                        Insert from PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setReplacePageDialogOpen(true)}>
                        <Replace className="w-3.5 h-3.5 mr-2" />
                        Replace Page
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          {/* Pages Grid/List - Scrollable Container */}
          <div className="container mx-auto px-2 md:px-4 pb-24 md:pb-2">
            <div 
              className="bg-white rounded-lg border border-gray-200 shadow-sm mt-4"
              style={{
                height: 'calc(100vh - 200px)',
                minHeight: '500px',
              }}
            >
              <div className="h-full overflow-y-auto overflow-x-hidden p-2 md:p-4 custom-scrollbar">
                {pdfPages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No Pages Loaded</h3>
                      <p className="text-muted-foreground">Please go back and upload files.</p>
                    </div>
                  </div>
                ) : (
                  <div className={`grid ${getGridCols()} gap-2 md:gap-4`}>
                    {pdfPages.map((page, index) => (
                      <div
                        key={page.id}
                        draggable
                        onDragStart={() => handleDragStart(page.id)}
                        onDragOver={(e) => handleDragOver(e, page.id)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => handlePageClick(page.id, index, e)}
                        className={`group relative cursor-pointer ${
                          draggedPageId === page.id ? 'opacity-50' : ''
                        }`}
                      >
                    <div
                      className={`bg-white rounded-lg overflow-hidden transition-all ${
                        selectedPages.has(page.id)
                          ? 'ring-4 ring-purple-500 shadow-lg'
                          : 'border-2 border-gray-200 hover:border-purple-400 hover:shadow-md'
                      }`}
                    >
                      {/* Drag Handle */}
                      <div className="absolute top-2 left-2 z-10 bg-white/90 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                      </div>

                      {/* Action Buttons - Top Right - Hidden on Mobile */}
                      <div className="hidden md:flex absolute top-2 right-2 z-10 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRotatePage(page.id, "right");
                          }}
                          className="h-7 w-7 p-0 bg-white hover:bg-blue-100 hover:text-blue-600 shadow-sm"
                          title="Rotate"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicatePage(page.id);
                          }}
                          className="h-7 w-7 p-0 bg-white hover:bg-green-100 hover:text-green-600 shadow-sm"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(page.id);
                          }}
                          className="h-7 w-7 p-0 bg-white hover:bg-red-100 hover:text-red-600 shadow-sm"
                          title="Delete"
                          disabled={pdfPages.length <= 1}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </div>

                      {/* Selection Checkbox */}
                      {selectedPages.has(page.id) && (
                        <div className="absolute top-2 right-2 z-20 bg-purple-500 text-white rounded-full p-1">
                          <Check className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                      )}

                      {/* Thumbnail */}
                      <div
                        className={`${getThumbnailClass()} bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative p-2 md:p-4`}
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setPreviewPage(page);
                        }}
                      >
                        {page.isBlank ? (
                          <div className="text-center">
                            <FilePlus2 className="w-6 h-6 md:w-8 md:h-8 text-gray-300 mx-auto mb-2" />
                            <span className="text-xs text-gray-400">Blank</span>
                          </div>
                        ) : (
                          <div className="w-full space-y-1 md:space-y-1.5">
                            <div className="h-0.5 md:h-1 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-0.5 md:h-1 bg-gray-300 rounded w-full"></div>
                            <div className="h-0.5 md:h-1 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-0.5 md:h-1 bg-gray-300 rounded w-2/3"></div>
                            <div className="h-0.5 md:h-1 bg-gray-300 rounded w-full"></div>
                            <div className="h-0.5 md:h-1 bg-gray-300 rounded w-4/5"></div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="p-1.5 md:p-2.5 bg-white border-t border-gray-200">
                        <div className="text-xs md:text-sm font-medium text-gray-900 mb-0.5 md:mb-1 text-center">
                          Page {index + 1}
                        </div>
                        <div className="text-xs text-gray-500 text-center truncate">
                          {page.fileName}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                  </div>
                )}
            </div>
          </div>
          </div>

          {/* Mobile Fixed Action Button - Positioned before footer */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-3 shadow-lg">
            <Button
              onClick={handleSavePdf}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 gap-2"
              size="lg"
            >
              Save PDF
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================
          SUCCESS STEP
      ======================================== */}
      {currentStep === "complete" && (
        <>
          <SuccessHeader
            icon={FileCog}
            title="PDF Organized Successfully!"
            description="Your PDF has been organized and is ready for download."
          />

          <ToolPageLayout>
            <ToolSuccessSection
              files={{
                url: "#",
                name: outputFileName,
                size: `${(outputFileSize / (1024 * 1024)).toFixed(2)} MB`,
                type: "pdf",
                pages: pdfPages.length,
              }}
              fileInfo={{
                "Total Pages": pdfPages.length,
                "Output Format": "PDF",
                "File Size": `${(outputFileSize / (1024 * 1024)).toFixed(2)} MB`,
              }}
              onReset={handleStartOver}
              resetButtonText="Organize Another PDF"
              icon={FileCog}
            />

            <RelatedToolsSection tools={RELATED_TOOLS} />
          </ToolPageLayout>
        </>
      )}

      {/* ========================================
          MODALS / DIALOGS
      ======================================== */}

      {/* Sort Dialog */}
      <Dialog open={sortDialogOpen} onOpenChange={setSortDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sort Pages</DialogTitle>
            <DialogDescription>
              Choose how you want to sort your PDF pages
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <button
              onClick={() => handleSortPages("ascending")}
              className="w-full flex items-center gap-3 p-4 text-left rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              <SortAsc className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Sort by Page Number (Ascending)</span>
            </button>
            <button
              onClick={() => handleSortPages("descending")}
              className="w-full flex items-center gap-3 p-4 text-left rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              <SortDesc className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Sort by Page Number (Descending)</span>
            </button>
            <button
              onClick={() => handleSortPages("orientation")}
              className="w-full flex items-center gap-3 p-4 text-left rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              <FlipVertical className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Sort by Orientation (Portrait First)</span>
            </button>
            <button
              onClick={() => handleSortPages("size")}
              className="w-full flex items-center gap-3 p-4 text-left rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              <Maximize className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Sort by Size (Largest First)</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Insert Blank Page Dialog */}
      <Dialog open={insertBlankDialogOpen} onOpenChange={setInsertBlankDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Blank Page</DialogTitle>
            <DialogDescription>
              Choose where to insert a blank page
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleInsertBlankPage("start")}
            >
              <ArrowUpToLine className="w-4 h-4 mr-2" />
              Insert at Start
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleInsertBlankPage("end")}
            >
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Insert at End
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleInsertBlankPage("after")}
              disabled={selectedPages.size !== 1}
            >
              <Plus className="w-4 h-4 mr-2" />
              Insert After Selected Page
              {selectedPages.size !== 1 && " (Select 1 page)"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {previewPage && (
        <Dialog open={true} onOpenChange={() => setPreviewPage(null)}>
          <DialogContent className="max-w-4xl h-[80vh] p-0">
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
                  <h3 className="font-semibold">
                    Page {pdfPages.findIndex((p) => p.id === previewPage.id) + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">{previewPage.fileName}</p>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewZoom(Math.max(50, previewZoom - 25))}
                  disabled={previewZoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium w-14 text-center">{previewZoom}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewZoom(Math.min(200, previewZoom + 25))}
                  disabled={previewZoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-8">
              <div
                className="bg-white shadow-2xl"
                style={{
                  width: `${300 * (previewZoom / 100)}px`,
                  height: `${400 * (previewZoom / 100)}px`,
                  transform: `rotate(${previewPage.rotation}deg)`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                  <div className="w-full space-y-4">
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Footer */}
            <div className="p-4 border-t bg-white">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Orientation</div>
                  <div className="font-medium">{previewPage.orientation}</div>
                </div>
                <div>
                  <div className="text-gray-500">Rotation</div>
                  <div className="font-medium">{previewPage.rotation}°</div>
                </div>
                <div>
                  <div className="text-gray-500">Size</div>
                  <div className="font-medium">
                    {previewPage.width} × {previewPage.height}
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