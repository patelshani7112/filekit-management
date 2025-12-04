/**
 * Redact PDF Page
 * 
 * Purpose: Permanently remove sensitive information from PDFs
 * Structure: Matches RotatePdfPage.tsx exactly, using same components and layout
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
  NavigationBlocker,
  ProcessingModal,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
import { RedactionEditorLayout } from "../../../components/redaction/RedactionEditorLayout";
import { RedactionToolbar } from "../../../components/redaction/RedactionToolbar";
import { PageThumbnails } from "../../../components/redaction/PageThumbnails";
import { getPdfInfo } from "../../../utils/pdfUtils";
import { simulateRealisticProgress } from "../../../utils/uploadProgress";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { GradientButton } from "../../../components/ui/gradient-button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { 
  FileText, 
  Shield,
  X,
  Archive,
  ChevronDown,
  ChevronUp,
  Square,
  Trash2,
  MousePointer
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
} from "../../../content/tools/pdf-tools/edit-annotate/redact-pdf-content";

// Processing steps
type ProcessStep = "upload" | "edit" | "processing" | "complete";

interface RedactPdfPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

interface RedactionBox {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}

interface PdfPage {
  fileName: string;
  pageNumber: number;
  redactions: RedactionBox[];
}

type RedactionTool = "select" | "draw";

export default function RedactPdfPage({ onWorkStateChange }: RedactPdfPageProps = {}) {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<ProcessStep>("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [processedFileName, setProcessedFileName] = useState("");
  const [pdfPages, setPdfPages] = useState<PdfPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");
  
  // Redaction state
  const [redactionBoxes, setRedactionBoxes] = useState<RedactionBox[]>([]);
  const [selectedTool, setSelectedTool] = useState<RedactionTool>("select");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<RedactionBox | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState("redacted.pdf");
  const [redactionColor, setRedactionColor] = useState("#000000");
  
  // Collapsible state for Source File section
  const [isSourceFileOpen, setIsSourceFileOpen] = useState(false);
  
  // Editor state for toolbar
  const [zoomLevel, setZoomLevel] = useState(100);
  const [history, setHistory] = useState<RedactionBox[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Convert RELATED_TOOLS from content file to component format with onClick handlers
  const relatedTools = RELATED_TOOLS.map(tool => ({
    ...tool,
    onClick: () => window.location.href = tool.href,
  }));

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = (file !== null || pdfPages.length > 0) && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [file, pdfPages.length, currentStep, onWorkStateChange]);

  // Handle file selection with PDF validation
  const handleFilesSelected = async (newFiles: File[]) => {
    const { maxFiles, maxFileSize } = UPLOAD_CONFIG;
    
    // Clear previous validation messages
    setValidationMessage("");
    
    // Check if already has a file
    if (file !== null) {
      setValidationMessage(VALIDATION_MESSAGES.maxFilesReached(maxFiles));
      setValidationType("warning");
      return;
    }
    
    // Take only first file since maxFiles is 1
    const selectedFile = newFiles[0];
    
    // Validate file type (PDF only)
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== '.pdf') {
      setValidationMessage(VALIDATION_MESSAGES.invalidFileType(1));
      setValidationType("error");
      return;
    }
    
    // Validate file size
    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      setValidationMessage(VALIDATION_MESSAGES.fileSizeExceeded(1, maxFileSize));
      setValidationType("error");
      return;
    }
    
    // Add file to state
    setFile(selectedFile);

    // Create validation info for the file (initially validating)
    const newValidationInfo: FileValidationInfo = {
      file: selectedFile,
      isValidating: true,
      isValid: false,
      pageCount: 0,
      uploadProgress: 0,
    };
    
    setFileValidationInfo([newValidationInfo]);

    const minAnimationDuration = 1200;
    
    // Start progress animation
    const cancelProgress = simulateRealisticProgress(minAnimationDuration, (progress) => {
      setFileValidationInfo((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          uploadProgress: progress,
        };
        return updated;
      });
    });
    
    try {
      // Get PDF info
      const pdfInfo = await getPdfInfo(selectedFile);
      
      // Wait for minimum animation duration
      const elapsed = Date.now();
      const remaining = minAnimationDuration - elapsed;
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
    
      // Cancel progress
      cancelProgress();
    
      // Update validation info
      setFileValidationInfo([{
        file: selectedFile,
        isValidating: false,
        isValid: pdfInfo.isValid,
        pageCount: pdfInfo.pageCount,
        error: pdfInfo.error,
        uploadProgress: 100,
      }]);
      
      // Generate pages for this PDF
      if (pdfInfo.isValid && pdfInfo.pageCount > 0) {
        const newPages: PdfPage[] = [];
        for (let i = 0; i < pdfInfo.pageCount; i++) {
          newPages.push({
            fileName: selectedFile.name,
            pageNumber: i + 1,
            redactions: [],
          });
        }
        setPdfPages(newPages);
      }
    } catch (error) {
      // Cancel progress
      cancelProgress();
      
      // Handle unexpected errors
      setFileValidationInfo([{
        file: selectedFile,
        isValidating: false,
        isValid: false,
        pageCount: 0,
        error: VALIDATION_MESSAGES.invalidPdfFile,
      }]);
    }
  };

  // Remove file
  const handleRemoveFile = (index: number) => {
    setFile(null);
    setFileValidationInfo([]);
    setPdfPages([]);
    setRedactionBoxes([]);
  };

  // Retry validation for the file
  const handleRetryValidation = async (index: number) => {
    if (!file) return;
    
    setFileValidationInfo([{
      file,
      isValidating: true,
      isValid: false,
      pageCount: 0,
      uploadProgress: 0,
    }]);

    const minAnimationDuration = 1200;
    
    const cancelProgress = simulateRealisticProgress(minAnimationDuration, (progress) => {
      setFileValidationInfo((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          uploadProgress: progress,
        };
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
      
      setFileValidationInfo([{
        file,
        isValidating: false,
        isValid: pdfInfo.isValid,
        pageCount: pdfInfo.pageCount,
        error: pdfInfo.error,
        uploadProgress: 100,
      }]);
    } catch (error) {
      cancelProgress();
      
      setFileValidationInfo([{
        file,
        isValidating: false,
        isValid: false,
        pageCount: 0,
        error: VALIDATION_MESSAGES.invalidPdfFile,
      }]);
    }
  };

  // Clear all files
  const handleClearAll = () => {
    setFile(null);
    setFileValidationInfo([]);
    setPdfPages([]);
    setValidationMessage("");
    setRedactionBoxes([]);
  };

  // Go to edit step
  const handleContinueToEdit = () => {
    setCurrentStep("edit");
  };

  // Back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  // Canvas drawing handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool !== "draw") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentBox({
      pageIndex: currentPageIndex,
      x,
      y,
      width: 0,
      height: 0,
      id: `redaction-${Date.now()}`,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentBox) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    setCurrentBox({
      ...currentBox,
      width: currentX - currentBox.x,
      height: currentY - currentBox.y,
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox) return;
    
    // Only add if box has meaningful size
    if (Math.abs(currentBox.width) > 10 && Math.abs(currentBox.height) > 10) {
      setRedactionBoxes(prev => [...prev, currentBox]);
    }
    
    setIsDrawing(false);
    setCurrentBox(null);
  };

  // Draw redactions on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw existing redactions for current page
    const pageRedactions = redactionBoxes.filter(box => box.pageIndex === currentPageIndex);
    pageRedactions.forEach(box => {
      ctx.fillStyle = selectedBoxId === box.id ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(box.x, box.y, box.width, box.height);
      
      // Draw border
      ctx.strokeStyle = selectedBoxId === box.id ? '#ff0000' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
    
    // Draw current box being drawn
    if (currentBox && currentBox.pageIndex === currentPageIndex) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
    }
  }, [redactionBoxes, currentBox, currentPageIndex, selectedBoxId]);

  // Delete selected redaction box
  const handleDeleteSelectedBox = () => {
    if (!selectedBoxId) return;
    setRedactionBoxes(prev => prev.filter(box => box.id !== selectedBoxId));
    setSelectedBoxId(null);
  };

  // Clear all redactions
  const handleClearAllRedactions = () => {
    setRedactionBoxes([]);
    setSelectedBoxId(null);
  };

  // Canvas click handler for selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool !== "select") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find clicked box
    const pageRedactions = redactionBoxes.filter(box => box.pageIndex === currentPageIndex);
    const clickedBox = pageRedactions.find(box => 
      x >= box.x && x <= box.x + box.width &&
      y >= box.y && y <= box.y + box.height
    );
    
    if (clickedBox) {
      setSelectedBoxId(clickedBox.id);
    } else {
      setSelectedBoxId(null);
    }
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
    
    const blob = new Blob([`Redacted PDF with ${redactionBoxes.length} redactions`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setProcessedFileName(outputFileName);
    setCurrentStep("complete");
  };

  // Reset
  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setFileValidationInfo([]);
    setPdfPages([]);
    setCurrentStep("upload");
    setProgress(0);
    setDownloadUrl("");
    setProcessedFileName("");
    setRedactionBoxes([]);
    setCurrentPageIndex(0);
  };

  // Calculate if we should block navigation
  const hasUnsavedWork = (file !== null || pdfPages.length > 0 || redactionBoxes.length > 0) && currentStep !== "complete";

  // Get total redaction count
  const totalRedactionCount = redactionBoxes.length;
  const currentPageRedactionCount = redactionBoxes.filter(box => box.pageIndex === currentPageIndex).length;
  
  // Generate page thumbnails data
  const pageThumbnails = pdfPages.map((page, index) => ({
    pageNumber: page.pageNumber,
    redactionCount: redactionBoxes.filter(box => box.pageIndex === index).length,
  }));
  
  // Toolbar handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setRedactionBoxes(history[historyIndex - 1]);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setRedactionBoxes(history[historyIndex + 1]);
    }
  };
  
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));
  const handleZoomFit = () => setZoomLevel(100);
  
  const handlePreviousPage = () => setCurrentPageIndex(prev => Math.max(0, prev - 1));
  const handleNextPage = () => setCurrentPageIndex(prev => Math.min(pdfPages.length - 1, prev + 1));
  
  const handlePageSelect = (pageNumber: number) => {
    setCurrentPageIndex(pageNumber - 1);
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/redact-pdf" />
      <ToolJsonLd path="/redact-pdf" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message={NAVIGATION_BLOCKER_MESSAGE}
        onSamePageClick={handleReset}
      />

      {/* Edit Step - Special Layout without side ads */}
      {currentStep === "edit" ? (
        <RedactionEditorLayout
          toolbar={
            <RedactionToolbar
              currentPage={currentPageIndex + 1}
              totalPages={pdfPages.length}
              zoomLevel={zoomLevel}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              onBack={handleBackToUpload}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomFit={handleZoomFit}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          }
          thumbnails={
            <PageThumbnails
              pages={pageThumbnails}
              currentPage={currentPageIndex + 1}
              onPageSelect={handlePageSelect}
            />
          }
          canvas={
            <div className="p-6 space-y-4">
              {/* Canvas Area */}
              <div 
                ref={containerRef}
                className="relative bg-white rounded-lg shadow-lg overflow-hidden flex items-center justify-center min-h-[600px]"
              >
                {/* PDF Preview (Mock) */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                  <div className="w-full h-full bg-white rounded shadow-lg p-8 space-y-2">
                    {/* Document lines */}
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className="h-2 bg-gray-300 rounded"
                        style={{ width: `${Math.random() * 30 + 70}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Redaction Canvas */}
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="absolute inset-0"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onClick={handleCanvasClick}
                  style={{ cursor: selectedTool === "draw" ? "crosshair" : "pointer" }}
                />
              </div>

              {/* Tool Instructions */}
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                {selectedTool === "draw" ? (
                  <p><strong>Draw Mode:</strong> Click and drag to create redaction boxes over sensitive content.</p>
                ) : (
                  <p><strong>Select Mode:</strong> Click on a redaction box to select it, then use Delete button to remove it.</p>
                )}
              </div>
            </div>
          }
          settingsPanel={
            <div className="space-y-6">
              {/* Header with Title */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{UI_LABELS.redactionSettings}</h3>
              </div>
              
              {/* Source File - Collapsible */}
              <div>
                {/* Collapsible Header */}
                <button
                  onClick={() => setIsSourceFileOpen(!isSourceFileOpen)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-3 hover:text-purple-600 transition-colors"
                >
                  <span>{UI_LABELS.sourceFile}</span>
                  {isSourceFileOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                {/* Collapsible Content */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isSourceFileOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {file && (
                    <div className="p-3 rounded-lg border-2 bg-gray-50 border-gray-200">
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="flex-1 truncate text-gray-700" title={file.name}>
                          {file.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(0)}
                          className="h-6 w-6 p-0 hover:bg-red-100 text-gray-400 hover:text-destructive flex-shrink-0"
                          title={UI_LABELS.removeFile}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {pdfPages.length} page{pdfPages.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Redaction Tools - Always Visible */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Redaction Tools</h4>
                <div className="space-y-2">
                  {/* Tool Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedTool === "draw" ? "default" : "outline"}
                      size="sm"
                      className={`gap-2 ${selectedTool === "draw" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      onClick={() => setSelectedTool("draw")}
                    >
                      <Square className="w-4 h-4" />
                      Draw
                    </Button>
                    <Button
                      variant={selectedTool === "select" ? "default" : "outline"}
                      size="sm"
                      className={`gap-2 ${selectedTool === "select" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      onClick={() => setSelectedTool("select")}
                    >
                      <MousePointer className="w-4 h-4" />
                      Select
                    </Button>
                  </div>

                  {/* Delete Selected / Clear All */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={handleDeleteSelectedBox}
                      disabled={!selectedBoxId}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={handleClearAllRedactions}
                      disabled={redactionBoxes.length === 0}
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear All
                    </Button>
                  </div>

                  {/* Redaction Stats */}
                  {totalRedactionCount > 0 && (
                    <div className="p-3 bg-purple-50 border-2 border-purple-200 rounded-lg">
                      <div className="text-xs font-medium text-purple-700 mb-1">
                        {UI_LABELS.totalRedactions(totalRedactionCount)}
                      </div>
                      <div className="text-xs text-purple-600">
                        Current page: {currentPageRedactionCount}
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
                            if (!file) return "0 B";
                            const totalBytes = file.size;
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
                disabled={redactionBoxes.length === 0}
              >
                <Shield className="w-4 h-4 mr-2" />
                {UI_LABELS.redactPdf}
              </GradientButton>
            </div>
          }
        />
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
                    multiple={false}
                    maxFiles={UPLOAD_CONFIG.maxFiles} 
                    maxFileSize={UPLOAD_CONFIG.maxFileSize} 
                    fileTypeLabel={UPLOAD_CONFIG.fileTypeLabel} 
                    helperText={UPLOAD_CONFIG.helperText} 
                    validationMessage={validationMessage} 
                    validationType={validationType} 
                  />
                  {file && fileValidationInfo.length > 0 && (
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
                  resetButtonText={UI_LABELS.redactAnother} 
                  icon={Shield} 
                />
              )}
            </div>

            {/* Related Tools Section - Show on complete step */}
            {currentStep === "complete" && (
              <RelatedToolsSection 
                tools={relatedTools}
                introText="Continue working with your PDFs or explore other powerful security tools."
              />
            )}

            {/* Show these sections if NOT on complete step */}
            {currentStep !== "complete" && (
              <>
                {/* Related Tools Section - Inside layout during upload */}
                <RelatedToolsSection 
                  tools={relatedTools}
                  introText="These tools work well with redacting PDFs and help you secure your documents."
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
                  subtitle="The most powerful and user-friendly PDF redaction tool available online"
                  introText="WorkflowPro delivers fast, private, and secure PDF redaction trusted by legal professionals, government agencies, and businesses. No signup required."
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
        icon={Shield} 
      />
    </>
  );
}