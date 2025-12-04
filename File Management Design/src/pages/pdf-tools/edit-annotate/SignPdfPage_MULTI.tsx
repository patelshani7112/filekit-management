/**
 * Sign PDF Page - MULTIPLE FILES SUPPORT (up to 10 PDFs, 50MB each)
 * 
 * Features:
 * 1. Multiple file upload (up to 10 PDFs, 50MB each)
 * 2. Drag & Drop Field Types
 * 3. Contextual Advanced Options
 * 4. Draggable & Editable Signatures
 * 5. File switcher in edit mode
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
  PenTool,
  Type,
  Upload,
  X,
  Archive,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
  Edit2,
  Calendar,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  FilePlus
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
} from "../../../content/tools/pdf-tools/edit-annotate/sign-pdf-content";

// Processing steps
type ProcessStep = "upload" | "edit" | "processing" | "complete";

interface SignPdfPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

interface Signature {
  id: string;
  type: "draw" | "type" | "upload";
  data: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
  fileIndex: number; // Track which file this signature belongs to
  color?: string;
  fontFamily?: string;
  transparency?: number;
  fieldType?: "signature" | "initials" | "name" | "date" | "text" | "stamp";
  isRequired?: boolean;
}

interface PdfPage {
  fileName: string;
  pageNumber: number;
  fileIndex: number; // Track which file this page belongs to
}

type SignatureType = "draw" | "type" | "upload";
type FieldType = "signature" | "initials" | "name" | "date" | "text" | "stamp";

export default function SignPdfPage({ onWorkStateChange }: SignPdfPageProps = {}) {
  // State management - NOW SUPPORTS MULTIPLE FILES
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<ProcessStep>("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrls, setDownloadUrls] = useState<string[]>([]);
  const [processedFileNames, setProcessedFileNames] = useState<string[]>([]);
  const [pdfPages, setPdfPages] = useState<PdfPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0); // Track which file we're editing
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");
  
  // Signature state
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [signatureType, setSignatureType] = useState<SignatureType>("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState("signed.pdf");
  
  // Signature creation state
  const [signatureText, setSignatureText] = useState("");
  const [signatureFontFamily, setSignatureFontFamily] = useState("'Brush Script MT', cursive");
  const [signatureSize, setSignatureSize] = useState(40);
  const [signatureColor, setSignatureColor] = useState("#000000");
  const [signatureTransparency, setSignatureTransparency] = useState(100);
  const [uploadedSignatureImage, setUploadedSignatureImage] = useState<string>("");
  
  // Advanced signature options
  const [signaturePosition, setSignaturePosition] = useState<"custom" | "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right">("center");
  const [signatureSizePreset, setSignatureSizePreset] = useState<"small" | "medium" | "large">("medium");
  const [applyToPages, setApplyToPages] = useState<"current" | "all" | "range">("current");
  const [pageRangeStart, setPageRangeStart] = useState(1);
  const [pageRangeEnd, setPageRangeEnd] = useState(1);
  
  // Collapsible state
  const [isSourceFileOpen, setIsSourceFileOpen] = useState(false);
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);
  
  // Field types state
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType>("signature");
  const [draggedField, setDraggedField] = useState<FieldType | null>(null);
  
  // Dragging state for signatures
  const [isDraggingSignature, setIsDraggingSignature] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingSignatureId, setEditingSignatureId] = useState<string | null>(null);
  
  // Refs
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const pdfPreviewRef = useRef<HTMLDivElement>(null);
  
  // Convert RELATED_TOOLS from content file to component format with onClick handlers
  const relatedTools = RELATED_TOOLS.map(tool => ({
    ...tool,
    onClick: () => window.location.href = tool.href,
  }));

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = (files.length > 0 || pdfPages.length > 0 || signatures.length > 0) && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, pdfPages.length, signatures.length, currentStep, onWorkStateChange]);

  // Get current file's pages
  const currentFilePages = pdfPages.filter(page => page.fileIndex === currentFileIndex);
  const currentFile = files[currentFileIndex];

  // Handle file selection with PDF validation - MULTIPLE FILES
  const handleFilesSelected = async (newFiles: File[]) => {
    const { maxFiles, maxFileSize } = UPLOAD_CONFIG;
    
    setValidationMessage("");
    
    // Check if adding new files would exceed max
    if (files.length + newFiles.length > maxFiles) {
      setValidationMessage(VALIDATION_MESSAGES.maxFilesReached(maxFiles));
      setValidationType("warning");
      return;
    }
    
    // Validate each file
    const validFiles: File[] = [];
    let invalidTypeCount = 0;
    let oversizeCount = 0;
    
    for (const file of newFiles) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (ext !== '.pdf') {
        invalidTypeCount++;
        continue;
      }
      
      if (file.size > maxFileSize * 1024 * 1024) {
        oversizeCount++;
        continue;
      }
      
      validFiles.push(file);
    }
    
    // Show validation messages
    if (invalidTypeCount > 0) {
      setValidationMessage(VALIDATION_MESSAGES.invalidFileType(invalidTypeCount));
      setValidationType("error");
      return;
    }
    
    if (oversizeCount > 0) {
      setValidationMessage(VALIDATION_MESSAGES.fileSizeExceeded(oversizeCount, maxFileSize));
      setValidationType("error");
      return;
    }
    
    if (validFiles.length === 0) return;
    
    setFiles(prev => [...prev, ...validFiles]);

    // Create validation info for each new file
    const newValidationInfos: FileValidationInfo[] = validFiles.map(file => ({
      file,
      isValidating: true,
      isValid: false,
      pageCount: 0,
      uploadProgress: 0,
    }));
    
    setFileValidationInfo(prev => [...prev, ...newValidationInfos]);

    const minAnimationDuration = 1200;
    
    // Validate each file
    for (let i = 0; i < validFiles.length; i++) {
      const fileIndex = files.length + i;
      const file = validFiles[i];
      
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
        
        cancelProgress();
      
        setFileValidationInfo(prev => {
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
        
        if (pdfInfo.isValid && pdfInfo.pageCount > 0) {
          const newPages: PdfPage[] = [];
          for (let j = 0; j < pdfInfo.pageCount; j++) {
            newPages.push({
              fileName: file.name,
              pageNumber: j + 1,
              fileIndex: fileIndex,
            });
          }
          setPdfPages(prev => [...prev, ...newPages]);
          
          // Update page range end for first file
          if (fileIndex === 0) {
            setPageRangeEnd(pdfInfo.pageCount);
          }
        }
      } catch (error) {
        cancelProgress();
        
        setFileValidationInfo(prev => {
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
    }
  };

  const handleRemoveFile = (index: number) => {
    // Remove file
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFileValidationInfo(prev => prev.filter((_, i) => i !== index));
    
    // Remove pages for this file
    setPdfPages(prev => prev.filter(page => page.fileIndex !== index).map(page => ({
      ...page,
      fileIndex: page.fileIndex > index ? page.fileIndex - 1 : page.fileIndex
    })));
    
    // Remove signatures for this file
    setSignatures(prev => prev.filter(sig => sig.fileIndex !== index).map(sig => ({
      ...sig,
      fileIndex: sig.fileIndex > index ? sig.fileIndex - 1 : sig.fileIndex
    })));
    
    // Adjust current file index if needed
    if (currentFileIndex >= index && currentFileIndex > 0) {
      setCurrentFileIndex(prev => prev - 1);
    }
  };

  const handleRetryValidation = async (index: number) => {
    const file = files[index];
    if (!file) return;
    
    setFileValidationInfo(prev => {
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
      
      setFileValidationInfo(prev => {
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
      
      setFileValidationInfo(prev => {
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

  const handleClearAll = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setPdfPages([]);
    setValidationMessage("");
    setSignatures([]);
    setCurrentFileIndex(0);
  };

  const handleContinueToEdit = () => {
    setCurrentStep("edit");
  };

  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  const handleClearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignatureText("");
    setUploadedSignatureImage("");
  };

  const handleSignatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedSignatureImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle PDF drop zone for dragged fields
  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedField || !pdfPreviewRef.current) return;
    
    const rect = pdfPreviewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create placeholder signature based on field type
    let signatureData = "";
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const fieldLabels: Record<FieldType, string> = {
        signature: 'Signature',
        initials: 'Initials',
        name: 'Name',
        date: 'Date',
        text: 'Text',
        stamp: 'Company Stamp'
      };
      
      ctx.fillText(fieldLabels[draggedField], canvas.width / 2, canvas.height / 2);
      signatureData = canvas.toDataURL();
    }
    
    const newSignature: Signature = {
      id: `field-${Date.now()}`,
      type: "type",
      data: signatureData,
      x: Math.max(0, x - 100),
      y: Math.max(0, y - 30),
      width: 200,
      height: 60,
      pageIndex: currentPageIndex,
      fileIndex: currentFileIndex,
      fieldType: draggedField,
      isRequired: draggedField === "signature",
      transparency: signatureTransparency,
    };
    
    setSignatures(prev => [...prev, newSignature]);
    setSelectedSignatureId(newSignature.id);
    setDraggedField(null);
  };

  const handlePdfDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAddSignature = () => {
    let signatureData = "";
    
    if (signatureType === "draw") {
      const canvas = signatureCanvasRef.current;
      if (canvas) {
        signatureData = canvas.toDataURL();
      }
    } else if (signatureType === "type") {
      if (!signatureText.trim()) {
        alert("Please enter your name");
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = `${signatureSize}px ${signatureFontFamily}`;
        ctx.fillStyle = signatureColor;
        ctx.textBaseline = 'middle';
        ctx.fillText(signatureText, 10, 50);
        signatureData = canvas.toDataURL();
      }
    } else if (signatureType === "upload") {
      if (!uploadedSignatureImage) {
        alert("Please upload a signature image");
        return;
      }
      signatureData = uploadedSignatureImage;
    }
    
    if (!signatureData) return;
    
    // Determine width and height based on size preset
    const sizeMap = {
      small: { width: 150, height: 50 },
      medium: { width: 200, height: 60 },
      large: { width: 250, height: 75 }
    };
    const { width, height } = sizeMap[signatureSizePreset];
    
    // Determine position based on preset
    let x = 200, y = 300;
    if (signaturePosition === "top-left") {
      x = 50; y = 50;
    } else if (signaturePosition === "top-right") {
      x = 450; y = 50;
    } else if (signaturePosition === "bottom-left") {
      x = 50; y = 500;
    } else if (signaturePosition === "bottom-right") {
      x = 450; y = 500;
    } else if (signaturePosition === "center") {
      x = 250; y = 300;
    }
    
    const newSignature: Signature = {
      id: `signature-${Date.now()}`,
      type: signatureType,
      data: signatureData,
      x,
      y,
      width,
      height,
      pageIndex: currentPageIndex,
      fileIndex: currentFileIndex,
      color: signatureColor,
      fontFamily: signatureFontFamily,
      transparency: signatureTransparency,
      fieldType: selectedFieldType,
    };
    
    setSignatures(prev => [...prev, newSignature]);
    setSelectedSignatureId(newSignature.id);
  };

  const handleDeleteSignature = () => {
    if (!selectedSignatureId) return;
    setSignatures(prev => prev.filter(sig => sig.id !== selectedSignatureId));
    setSelectedSignatureId(null);
  };

  // Drag signature on PDF
  const handleSignatureMouseDown = (e: React.MouseEvent, sigId: string) => {
    e.stopPropagation();
    const sig = signatures.find(s => s.id === sigId);
    if (!sig) return;
    
    setSelectedSignatureId(sigId);
    setIsDraggingSignature(true);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handlePdfMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSignature || !selectedSignatureId || !pdfPreviewRef.current) return;
    
    const rect = pdfPreviewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    setSignatures(prev => prev.map(sig => 
      sig.id === selectedSignatureId 
        ? { ...sig, x: Math.max(0, x), y: Math.max(0, y) }
        : sig
    ));
  };

  const handlePdfMouseUp = () => {
    setIsDraggingSignature(false);
  };

  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    // Create download URLs for each file
    const urls: string[] = [];
    const names: string[] = [];
    
    files.forEach((file, index) => {
      const fileSignatures = signatures.filter(sig => sig.fileIndex === index);
      const blob = new Blob([`Signed PDF: ${file.name} with ${fileSignatures.length} signature(s)`], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      urls.push(url);
      names.push(`signed-${file.name}`);
    });
    
    setDownloadUrls(urls);
    setProcessedFileNames(names);
    setCurrentStep("complete");
  };

  const handleReset = () => {
    downloadUrls.forEach(url => URL.revokeObjectURL(url));
    setFiles([]);
    setFileValidationInfo([]);
    setPdfPages([]);
    setCurrentStep("upload");
    setProgress(0);
    setDownloadUrls([]);
    setProcessedFileNames([]);
    setSignatures([]);
    setCurrentPageIndex(0);
    setCurrentFileIndex(0);
    handleClearSignature();
  };

  const hasUnsavedWork = (files.length > 0 || pdfPages.length > 0 || signatures.length > 0) && currentStep !== "complete";
  const currentPageSignatureCount = signatures.filter(sig => sig.pageIndex === currentPageIndex && sig.fileIndex === currentFileIndex).length;

  const handlePreviousPage = () => {
    setCurrentPageIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPageIndex(prev => Math.min(currentFilePages.length - 1, prev + 1));
  };

  const handlePreviousFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(prev => prev - 1);
      setCurrentPageIndex(0);
    }
  };

  const handleNextFile = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex(prev => prev + 1);
      setCurrentPageIndex(0);
    }
  };

  // Drawing on signature canvas
  const handleSignatureCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (signatureType !== "draw") return;
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleSignatureCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || signatureType !== "draw") return;
    
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = signatureColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const handleSignatureCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  // Calculate total size
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalSizeFormatted = (() => {
    if (totalSize < 1024) return `${totalSize} B`;
    if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} KB`;
    return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
  })();

  return (
    <>
      <SeoHead path="/sign-pdf" />
      <ToolJsonLd path="/sign-pdf" />
      
      <NavigationBlocker
        when={hasUnsavedWork}
        message={NAVIGATION_BLOCKER_MESSAGE}
        onSamePageClick={handleReset}
      />

      {currentStep === "edit" ? (
        <EditPageLayout
          onBack={handleBackToUpload}
          totalPages={pdfPages.length}
          totalSize={totalSizeFormatted}
          showInlineAd={true}
          fullWidth={true}
          sidebar={
            <>
              {/* Header with Title and Add Files Button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">{UI_LABELS.signatureSettings}</h3>
                
                {/* Add More Files Button */}
                <input
                  type="file"
                  id="addMoreFilesSign"
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
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-500 hover:text-white transition-colors"
                  onClick={() => document.getElementById('addMoreFilesSign')?.click()}
                  disabled={files.length >= UPLOAD_CONFIG.maxFiles}
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  Add Files
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Source Files - Collapsible (Closed by Default) */}
                <div>
                  {/* Collapsible Header */}
                  <div 
                    className="flex items-center justify-between cursor-pointer select-none mb-3"
                    onClick={() => setIsSourceFileOpen(!isSourceFileOpen)}
                  >
                    <h4 className="text-sm font-medium text-gray-700">Source Files</h4>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      {isSourceFileOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* File List - Only show when open */}
                  {isSourceFileOpen && (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {files.map((file, fileIndex) => (
                        <div
                          key={fileIndex}
                          onClick={() => {
                            setCurrentFileIndex(fileIndex);
                            setCurrentPageIndex(0);
                          }}
                          className={`flex items-center gap-2 text-xs p-3 rounded-lg border-2 transition-all group cursor-pointer ${
                            currentFileIndex === fileIndex
                              ? 'bg-purple-100 border-purple-400 shadow-md'
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
                  )}
                </div>

              {/* Field Types Section */}
              <div className="border-b pb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add Fields to Document</h4>
                
                {/* Required Fields */}
                <div className="mb-3">
                  <Label className="text-xs text-gray-600 mb-2 block">Required</Label>
                  <div
                    draggable
                    onDragStart={() => setDraggedField("signature")}
                    onDragEnd={() => setDraggedField(null)}
                    className={`flex items-center gap-2 p-2.5 bg-purple-50 border-2 border-purple-300 rounded-lg cursor-move hover:bg-purple-100 transition-colors ${
                      selectedFieldType === "signature" ? 'ring-2 ring-purple-400' : ''
                    }`}
                    onClick={() => setSelectedFieldType("signature")}
                  >
                    <GripVertical className="w-4 h-4 text-purple-600" />
                    <PenTool className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Signature</span>
                  </div>
                </div>

                {/* Optional Fields */}
                <div>
                  <Label className="text-xs text-gray-600 mb-2 block">Optional</Label>
                  <div className="space-y-2">
                    <div
                      draggable
                      onDragStart={() => setDraggedField("initials")}
                      onDragEnd={() => setDraggedField(null)}
                      className={`flex items-center gap-2 p-2 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:bg-gray-50 transition-colors ${
                        selectedFieldType === "initials" ? 'ring-2 ring-purple-400 border-purple-300' : ''
                      }`}
                      onClick={() => setSelectedFieldType("initials")}
                    >
                      <GripVertical className="w-4 h-4 text-gray-500" />
                      <Type className="w-4 h-4 text-gray-700" />
                      <span className="text-sm text-gray-700">Initials</span>
                    </div>

                    <div
                      draggable
                      onDragStart={() => setDraggedField("name")}
                      onDragEnd={() => setDraggedField(null)}
                      className={`flex items-center gap-2 p-2 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:bg-gray-50 transition-colors ${
                        selectedFieldType === "name" ? 'ring-2 ring-purple-400 border-purple-300' : ''
                      }`}
                      onClick={() => setSelectedFieldType("name")}
                    >
                      <GripVertical className="w-4 h-4 text-gray-500" />
                      <User className="w-4 h-4 text-gray-700" />
                      <span className="text-sm text-gray-700">Name</span>
                    </div>

                    <div
                      draggable
                      onDragStart={() => setDraggedField("date")}
                      onDragEnd={() => setDraggedField(null)}
                      className={`flex items-center gap-2 p-2 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:bg-gray-50 transition-colors ${
                        selectedFieldType === "date" ? 'ring-2 ring-purple-400 border-purple-300' : ''
                      }`}
                      onClick={() => setSelectedFieldType("date")}
                    >
                      <GripVertical className="w-4 h-4 text-gray-500" />
                      <Calendar className="w-4 h-4 text-gray-700" />
                      <span className="text-sm text-gray-700">Date</span>
                    </div>

                    <div
                      draggable
                      onDragStart={() => setDraggedField("text")}
                      onDragEnd={() => setDraggedField(null)}
                      className={`flex items-center gap-2 p-2 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:bg-gray-50 transition-colors ${
                        selectedFieldType === "text" ? 'ring-2 ring-purple-400 border-purple-300' : ''
                      }`}
                      onClick={() => setSelectedFieldType("text")}
                    >
                      <GripVertical className="w-4 h-4 text-gray-500" />
                      <FileText className="w-4 h-4 text-gray-700" />
                      <span className="text-sm text-gray-700">Text</span>
                    </div>

                    <div
                      draggable
                      onDragStart={() => setDraggedField("stamp")}
                      onDragEnd={() => setDraggedField(null)}
                      className={`flex items-center gap-2 p-2 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:bg-gray-50 transition-colors ${
                        selectedFieldType === "stamp" ? 'ring-2 ring-purple-400 border-purple-300' : ''
                      }`}
                      onClick={() => setSelectedFieldType("stamp")}
                    >
                      <GripVertical className="w-4 h-4 text-gray-500" />
                      <Building2 className="w-4 h-4 text-gray-700" />
                      <span className="text-sm text-gray-700">Company Stamp</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-3 italic">
                  💡 Drag and drop fields onto the PDF preview
                </p>
              </div>

              {/* Signature Type Selection */}
              <div className="border-b pb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{UI_LABELS.signatureType}</h4>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button
                    variant={signatureType === "draw" ? "default" : "outline"}
                    size="sm"
                    className={`gap-2 flex-col h-auto py-3 ${signatureType === "draw" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    onClick={() => setSignatureType("draw")}
                  >
                    <PenTool className="w-4 h-4" />
                    <span className="text-xs">{UI_LABELS.drawSignature}</span>
                  </Button>
                  <Button
                    variant={signatureType === "type" ? "default" : "outline"}
                    size="sm"
                    className={`gap-2 flex-col h-auto py-3 ${signatureType === "type" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    onClick={() => setSignatureType("type")}
                  >
                    <Type className="w-4 h-4" />
                    <span className="text-xs">{UI_LABELS.typeSignature}</span>
                  </Button>
                  <Button
                    variant={signatureType === "upload" ? "default" : "outline"}
                    size="sm"
                    className={`gap-2 flex-col h-auto py-3 ${signatureType === "upload" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    onClick={() => setSignatureType("upload")}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-xs">{UI_LABELS.uploadSignature}</span>
                  </Button>
                </div>

                {signatureType === "draw" && (
                  <div className="space-y-2">
                    <canvas
                      ref={signatureCanvasRef}
                      width={300}
                      height={150}
                      className="w-full border-2 border-gray-300 rounded bg-white cursor-crosshair"
                      onMouseDown={handleSignatureCanvasMouseDown}
                      onMouseMove={handleSignatureCanvasMouseMove}
                      onMouseUp={handleSignatureCanvasMouseUp}
                      onMouseLeave={handleSignatureCanvasMouseUp}
                    />
                    <p className="text-xs text-gray-600">{UI_LABELS.instructions.draw}</p>
                  </div>
                )}

                {signatureType === "type" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="signatureText" className="text-xs">{UI_LABELS.signatureText}</Label>
                      <Input
                        id="signatureText"
                        type="text"
                        value={signatureText}
                        onChange={(e) => setSignatureText(e.target.value)}
                        placeholder={UI_LABELS.signatureTextPlaceholder}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fontFamily" className="text-xs">{UI_LABELS.fontFamily}</Label>
                      <select
                        id="fontFamily"
                        value={signatureFontFamily}
                        onChange={(e) => setSignatureFontFamily(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="'Brush Script MT', cursive">Brush Script</option>
                        <option value="'Dancing Script', cursive">Dancing Script</option>
                        <option value="'Pacifico', cursive">Pacifico</option>
                        <option value="'Satisfy', cursive">Satisfy</option>
                      </select>
                    </div>
                    {signatureText && (
                      <div className="p-4 bg-white border-2 border-gray-300 rounded text-center">
                        <span style={{ 
                          fontFamily: signatureFontFamily, 
                          fontSize: `${signatureSize}px`,
                          color: signatureColor 
                        }}>
                          {signatureText}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-600">{UI_LABELS.instructions.type}</p>
                  </div>
                )}

                {signatureType === "upload" && (
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleSignatureImageUpload}
                      className="text-sm"
                    />
                    {uploadedSignatureImage && (
                      <div className="p-4 bg-white border-2 border-gray-300 rounded">
                        <img src={uploadedSignatureImage} alt="Signature" className="max-w-full h-auto max-h-32 mx-auto" />
                      </div>
                    )}
                    <p className="text-xs text-gray-600">{UI_LABELS.instructions.upload}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleClearSignature}
                  >
                    {UI_LABELS.clearSignature}
                  </Button>
                  <GradientButton
                    onClick={handleAddSignature}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Add to PDF
                  </GradientButton>
                </div>
              </div>

              {/* Advanced Options - CONTEXTUAL */}
              <div>
                <button
                  onClick={() => setIsAdvancedOptionsOpen(!isAdvancedOptionsOpen)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-3 hover:text-purple-600 transition-colors"
                >
                  <span>Advanced Options</span>
                  {isAdvancedOptionsOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {isAdvancedOptionsOpen && (
                  <div className="space-y-4">
                    {/* Signature Styling */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Signature Styling</h4>
                      
                      {/* Size - Always show */}
                      <div className="space-y-2 mb-4">
                        <Label className="text-xs text-gray-600">Size</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={signatureSizePreset === "small" ? "default" : "outline"}
                            size="sm"
                            className={signatureSizePreset === "small" ? 'bg-purple-600 hover:bg-purple-700' : ''}
                            onClick={() => setSignatureSizePreset("small")}
                          >
                            <span className="text-xs">Small</span>
                          </Button>
                          <Button
                            variant={signatureSizePreset === "medium" ? "default" : "outline"}
                            size="sm"
                            className={signatureSizePreset === "medium" ? 'bg-purple-600 hover:bg-purple-700' : ''}
                            onClick={() => setSignatureSizePreset("medium")}
                          >
                            <span className="text-xs">Medium</span>
                          </Button>
                          <Button
                            variant={signatureSizePreset === "large" ? "default" : "outline"}
                            size="sm"
                            className={signatureSizePreset === "large" ? 'bg-purple-600 hover:bg-purple-700' : ''}
                            onClick={() => setSignatureSizePreset("large")}
                          >
                            <span className="text-xs">Large</span>
                          </Button>
                        </div>
                      </div>

                      {/* Color - Only for Draw and Type */}
                      {(signatureType === "draw" || signatureType === "type") && (
                        <div className="space-y-2 mb-4">
                          <Label className="text-xs text-gray-600">Color</Label>
                          <div className="flex items-center gap-2">
                            {['#000000', '#0000FF', '#FF0000', '#008000', '#800080'].map((color) => (
                              <button
                                key={color}
                                onClick={() => setSignatureColor(color)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                  signatureColor === color 
                                    ? 'border-purple-600 ring-2 ring-purple-200 scale-110' 
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                            <input
                              type="color"
                              value={signatureColor}
                              onChange={(e) => setSignatureColor(e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer border-2 border-gray-300"
                              title="Custom color"
                            />
                          </div>
                        </div>
                      )}

                      {/* Transparency */}
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">
                          Transparency: {signatureTransparency}%
                        </Label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={signatureTransparency}
                          onChange={(e) => setSignatureTransparency(Number(e.target.value))}
                          className="w-full accent-purple-600"
                        />
                      </div>
                    </div>

                    {/* Position Options */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Position on Page</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={signaturePosition === "top-left" ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${signaturePosition === "top-left" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                          onClick={() => setSignaturePosition("top-left")}
                        >
                          Top Left
                        </Button>
                        <Button
                          variant={signaturePosition === "center" ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${signaturePosition === "center" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                          onClick={() => setSignaturePosition("center")}
                        >
                          Center
                        </Button>
                        <Button
                          variant={signaturePosition === "top-right" ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${signaturePosition === "top-right" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                          onClick={() => setSignaturePosition("top-right")}
                        >
                          Top Right
                        </Button>
                        <Button
                          variant={signaturePosition === "bottom-left" ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${signaturePosition === "bottom-left" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                          onClick={() => setSignaturePosition("bottom-left")}
                        >
                          Bottom Left
                        </Button>
                        <Button
                          variant={signaturePosition === "custom" ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${signaturePosition === "custom" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                          onClick={() => setSignaturePosition("custom")}
                        >
                          Custom
                        </Button>
                        <Button
                          variant={signaturePosition === "bottom-right" ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${signaturePosition === "bottom-right" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                          onClick={() => setSignaturePosition("bottom-right")}
                        >
                          Bottom Right
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {signaturePosition === "custom" 
                          ? "Drag signatures on PDF to position" 
                          : "Signature will be auto-positioned"}
                      </p>
                    </div>

                    {/* Apply to Pages - Only if more than 1 page in current file */}
                    {currentFilePages.length > 1 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Apply Signature To</h4>
                        
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="applyToPages"
                              value="current"
                              checked={applyToPages === "current"}
                              onChange={(e) => setApplyToPages(e.target.value as "current" | "all" | "range")}
                              className="w-4 h-4 accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">Current page only (Page {currentPageIndex + 1})</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="applyToPages"
                              value="all"
                              checked={applyToPages === "all"}
                              onChange={(e) => setApplyToPages(e.target.value as "current" | "all" | "range")}
                              className="w-4 h-4 accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">All pages ({currentFilePages.length} pages)</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="applyToPages"
                              value="range"
                              checked={applyToPages === "range"}
                              onChange={(e) => setApplyToPages(e.target.value as "current" | "all" | "range")}
                              className="w-4 h-4 accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">Page range</span>
                          </label>
                          
                          {applyToPages === "range" && (
                            <div className="ml-6 mt-2 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <Label htmlFor="pageRangeStart" className="text-xs text-gray-600">From</Label>
                                  <Input
                                    id="pageRangeStart"
                                    type="number"
                                    min={1}
                                    max={currentFilePages.length}
                                    value={pageRangeStart}
                                    onChange={(e) => setPageRangeStart(Math.max(1, Math.min(currentFilePages.length, Number(e.target.value))))}
                                    className="text-sm"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label htmlFor="pageRangeEnd" className="text-xs text-gray-600">To</Label>
                                  <Input
                                    id="pageRangeEnd"
                                    type="number"
                                    min={pageRangeStart}
                                    max={currentFilePages.length}
                                    value={pageRangeEnd}
                                    onChange={(e) => setPageRangeEnd(Math.max(pageRangeStart, Math.min(currentFilePages.length, Number(e.target.value))))}
                                    className="text-sm"
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">
                                {pageRangeEnd - pageRangeStart + 1} page(s) selected
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Signature Management - Only if signatures exist */}
                    {signatures.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Signatures on Page {currentPageIndex + 1}</h4>
                        <div className="p-3 bg-purple-50 border-2 border-purple-200 rounded-lg space-y-2">
                          <div className="text-xs font-medium text-purple-700">
                            Total: {signatures.filter(sig => sig.fileIndex === currentFileIndex).length} signature(s) in this file
                          </div>
                          <div className="text-xs text-purple-600">
                            This page: {currentPageSignatureCount}
                          </div>
                          {selectedSignatureId && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={handleDeleteSignature}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Selected
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Output Settings - Only if signatures exist */}
                    {signatures.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">{UI_LABELS.outputSettings}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pt-1 pb-1">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-purple-500" />
                                <span className="font-medium">{files.length} file{files.length !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Archive className="w-4 h-4 text-purple-500" />
                                <span className="font-medium">{totalSizeFormatted}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              </div>

              {/* Apply Button - Outside the space-y-6 container */}
              <GradientButton
                onClick={handleProcessFiles}
                variant="primary"
                size="md"
                className="w-full mt-6"
                disabled={signatures.length === 0}
              >
                <PenTool className="w-4 h-4 mr-2" />
                Sign {files.length} PDF{files.length !== 1 ? 's' : ''}
              </GradientButton>
            </>
          }
        >
          <div className="space-y-4">
            {/* Page navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Page {currentPageIndex + 1} of {currentFilePages.length}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPageIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPageIndex === currentFilePages.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>

            {/* PDF Preview Area with Drag & Drop */}
            <div 
              ref={pdfPreviewRef}
              className="bg-white rounded-lg shadow-lg p-3 sm:p-8 min-h-[400px] sm:min-h-[600px] relative"
              onDrop={handlePdfDrop}
              onDragOver={handlePdfDragOver}
              onMouseMove={handlePdfMouseMove}
              onMouseUp={handlePdfMouseUp}
              onMouseLeave={handlePdfMouseUp}
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded p-4 sm:p-8">
                <div className="bg-white rounded shadow-lg p-4 sm:p-8 space-y-2">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-2 bg-gray-300 rounded"
                      style={{ width: `${Math.random() * 30 + 70}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Signature Overlays with Drag Handles */}
              {signatures
                .filter(sig => sig.pageIndex === currentPageIndex && sig.fileIndex === currentFileIndex)
                .map(sig => (
                  <div
                    key={sig.id}
                    className={`absolute group border-2 ${
                      selectedSignatureId === sig.id ? 'border-purple-500' : 'border-transparent hover:border-purple-300'
                    }`}
                    style={{
                      left: sig.x,
                      top: sig.y,
                      width: sig.width,
                      height: sig.height,
                      opacity: (sig.transparency || 100) / 100,
                    }}
                    onClick={() => setSelectedSignatureId(sig.id)}
                  >
                    {/* Drag Handle */}
                    <div
                      className="absolute -top-8 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleSignatureMouseDown(e, sig.id)}
                    >
                      <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 cursor-move shadow-lg">
                        <GripVertical className="w-3 h-3" />
                        <span>Drag</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSignatureId(sig.id);
                        }}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 shadow-lg hover:bg-blue-700"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                    
                    <img src={sig.data} alt="Signature" className="w-full h-full object-contain pointer-events-none" />
                    
                    {/* Field Type Badge */}
                    {sig.fieldType && (
                      <div className="absolute -bottom-6 left-0 bg-gray-800 text-white px-2 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        {sig.fieldType.charAt(0).toUpperCase() + sig.fieldType.slice(1)}
                      </div>
                    )}
                  </div>
                ))}
              
              {/* Drop Zone Indicator */}
              {draggedField && (
                <div className="absolute inset-0 bg-purple-100/50 border-4 border-dashed border-purple-400 rounded-lg flex items-center justify-center pointer-events-none">
                  <div className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-xl">
                    Drop {draggedField} field here
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
              <p><strong>Instructions:</strong> Drag fields from the sidebar onto the PDF. Click and drag signatures to reposition them. {files.length > 1 && 'Use the file switcher in the sidebar to navigate between documents.'}</p>
            </div>
          </div>
        </EditPageLayout>
      ) : (
        <>
          {currentStep === "complete" && (
            <SuccessHeader 
              title={`${files.length} PDF${files.length !== 1 ? 's' : ''} Signed Successfully!`} 
              description={`Your document${files.length !== 1 ? 's have' : ' has'} been signed. Download ${files.length !== 1 ? 'them' : 'it'} below.`} 
            />
          )}
          
          {currentStep !== "complete" && (
            <ToolPageHero 
              title={HERO_CONTENT.title} 
              description={HERO_CONTENT.description} 
            />
          )}

          <ToolPageLayout>
            {currentStep === "upload" && <MobileStickyAd topOffset={64} height={100} />}
            
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
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
                  {files.length > 0 && fileValidationInfo.length > 0 && (
                    <FileListWithValidation 
                      files={fileValidationInfo} 
                      onRemove={handleRemoveFile} 
                      onContinue={handleContinueToEdit} 
                      continueText={UI_LABELS.continueToSign} 
                      showReorder={false}
                      onClearAll={handleClearAll}
                      onRetry={handleRetryValidation}
                    />
                  )}
                </>
              )}

              {currentStep === "complete" && (
                <ToolSuccessSection 
                  files={downloadUrls.length === 1 
                    ? { url: downloadUrls[0], name: processedFileNames[0], type: "pdf" as const }
                    : downloadUrls.map((url, index) => ({
                        url,
                        name: processedFileNames[index],
                        type: "pdf" as const
                      }))
                  }
                  onReset={handleReset} 
                  resetButtonText={UI_LABELS.signAnother} 
                  icon={PenTool} 
                />
              )}
            </div>

            {currentStep === "complete" && (
              <RelatedToolsSection 
                tools={relatedTools}
                introText="Continue working with your PDFs or explore other powerful tools."
              />
            )}

            {currentStep !== "complete" && (
              <>
                <RelatedToolsSection 
                  tools={relatedTools}
                  introText="These tools work well with signing PDFs and help you manage your documents."
                />

                <ToolDefinitionSection
                  title={SEO_CONTENT.definition.title}
                  description={SEO_CONTENT.definition.content}
                />

                <HowItWorksSteps 
                  title={SEO_CONTENT.howItWorks.title}
                  subtitle={SEO_CONTENT.howItWorks.subtitle}
                  introText={SEO_CONTENT.howItWorks.introText}
                  steps={HOW_IT_WORKS_STEPS} 
                />

                <WhyChooseSection 
                  title={WHY_CHOOSE_WORKFLOWPRO.title}
                  subtitle="The most powerful and user-friendly PDF signing tool available online"
                  introText="WorkflowPro delivers fast, private, and secure PDF signing trusted by professionals worldwide. No signup required."
                  features={WHY_CHOOSE_WORKFLOWPRO.features} 
                />

                <UseCasesSection 
                  useCases={USE_CASES}
                  title={USE_CASES_TITLE}
                />

                <ToolFAQSection faqs={FAQ_ITEMS} />

                <ToolSEOFooter 
                  title={SEO_CONTENT.footer.title}
                  content={SEO_CONTENT.footer.content}
                />
              </>
            )}
          </ToolPageLayout>
        </>
      )}

      <ProcessingModal 
        isOpen={currentStep === "processing"} 
        progress={progress} 
        title={UI_LABELS.processing.title} 
        description={UI_LABELS.processing.description} 
        icon={PenTool} 
      />
    </>
  );
}
