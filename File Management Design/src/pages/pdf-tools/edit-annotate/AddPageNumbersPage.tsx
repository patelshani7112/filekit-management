/**
 * Add Page Numbers to PDF Page
 * 
 * Purpose: Add professional page numbers to PDF documents
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
  ProcessButton,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { 
  FileText, 
  Hash,
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
} from "../../../content/tools/pdf-tools/edit-annotate/add-page-numbers-content";

// Processing steps
type ProcessStep = "upload" | "edit" | "processing" | "complete";

interface AddPageNumbersPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

interface PdfPage {
  fileIndex: number;
  fileName: string;
  pageNumber: number;
  rotation: number;
}

export default function AddPageNumbersPage({ onWorkStateChange }: AddPageNumbersPageProps = {}) {
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
  
  // Page number settings
  const [numberPosition, setNumberPosition] = useState("bottom-center");
  const [startingNumber, setStartingNumber] = useState("1");
  const [numberFormat, setNumberFormat] = useState("1");
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [color, setColor] = useState("#000000");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [outputFileName, setOutputFileName] = useState("numbered.pdf");
  const [startFromPage, setStartFromPage] = useState("1"); // Start numbering from which page
  const [isSourceFilesOpen, setIsSourceFilesOpen] = useState(false); // Collapsed by default
  
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
  };

  // Go to edit step
  const handleContinueToEdit = () => {
    setCurrentStep("edit");
  };

  // Back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  // Process files
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }
    const blob = new Blob([`Page numbers added to ${files.length} file(s)`], { type: "application/pdf" });
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
  };

  // Format page number
  const formatPageNumber = (num: number, format: string): string => {
    switch (format) {
      case "i":
        return toRoman(num).toLowerCase();
      case "I":
        return toRoman(num);
      case "a":
        return toAlphabetic(num).toLowerCase();
      case "A":
        return toAlphabetic(num);
      case "1":
      default:
        return num.toString();
    }
  };

  const toRoman = (num: number): string => {
    const romanMap: [number, string][] = [
      [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ];
    let result = "";
    for (const [value, letter] of romanMap) {
      while (num >= value) {
        result += letter;
        num -= value;
      }
    }
    return result;
  };

  const toAlphabetic = (num: number): string => {
    let result = "";
    while (num > 0) {
      const remainder = (num - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      num = Math.floor((num - 1) / 26);
    }
    return result;
  };

  const getPositionStyles = (position: string): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: "absolute",
      fontSize: `${fontSize}px`,
      fontFamily: fontFamily,
      color: color,
      userSelect: "none",
    };

    const marginX = 20;
    const marginY = 20;

    switch (position) {
      case "top-left":
        return { ...baseStyles, top: `${marginY}px`, left: `${marginX}px` };
      case "top-center":
        return { ...baseStyles, top: `${marginY}px`, left: "50%", transform: "translateX(-50%)" };
      case "top-right":
        return { ...baseStyles, top: `${marginY}px`, right: `${marginX}px` };
      case "bottom-left":
        return { ...baseStyles, bottom: `${marginY}px`, left: `${marginX}px` };
      case "bottom-center":
        return { ...baseStyles, bottom: `${marginY}px`, left: "50%", transform: "translateX(-50%)" };
      case "bottom-right":
        return { ...baseStyles, bottom: `${marginY}px`, right: `${marginX}px` };
      default:
        return { ...baseStyles, bottom: `${marginY}px`, left: "50%", transform: "translateX(-50%)" };
    }
  };

  // Calculate if we should block navigation
  const hasUnsavedWork = (files.length > 0 || pdfPages.length > 0) && currentStep !== "complete";

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/add-page-numbers-to-pdf" />
      <ToolJsonLd path="/add-page-numbers-to-pdf" />
      
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
                <h3 className="font-semibold text-lg">{UI_LABELS.pageNumberSettings}</h3>
                
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
                  <button
                    onClick={() => setIsSourceFilesOpen(!isSourceFilesOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-3 hover:text-purple-600 transition-colors"
                  >
                    <span>{UI_LABELS.sourceFiles}</span>
                    {isSourceFilesOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isSourceFilesOpen && (
                    <div ref={fileListRef} className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
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
                  )}
                </div>

                {/* Position */}
                <div>
                  <Label htmlFor="position">{UI_LABELS.position}</Label>
                  <Select value={numberPosition} onValueChange={setNumberPosition}>
                    <SelectTrigger id="position"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(UI_LABELS.positions).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Format */}
                <div>
                  <Label htmlFor="format">{UI_LABELS.format}</Label>
                  <Select value={numberFormat} onValueChange={setNumberFormat}>
                    <SelectTrigger id="format"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(UI_LABELS.formats).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Starting Number */}
                <div>
                  <Label htmlFor="start">{UI_LABELS.startingNumber}</Label>
                  <Input id="start" type="number" value={startingNumber} onChange={(e) => setStartingNumber(e.target.value)} />
                </div>
                
                {/* Start from Page - Optional */}
                <div>
                  <Label htmlFor="startFromPage" className="text-sm">
                    Start from page <span className="text-gray-500 text-xs">(optional)</span>
                  </Label>
                  <Input 
                    id="startFromPage" 
                    type="number" 
                    min="1"
                    max={pdfPages.length}
                    value={startFromPage} 
                    onChange={(e) => setStartFromPage(e.target.value)} 
                    placeholder="1"
                    className="bg-purple-50/50 border-purple-200 focus:border-purple-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave as 1 to start from first page</p>
                </div>

                {/* Prefix and Suffix */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="prefix">{UI_LABELS.prefix}</Label>
                    <Input id="prefix" placeholder="Page " value={prefix} onChange={(e) => setPrefix(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="suffix">{UI_LABELS.suffix}</Label>
                    <Input id="suffix" placeholder="" value={suffix} onChange={(e) => setSuffix(e.target.value)} />
                  </div>
                </div>

                {/* Font Settings */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">{UI_LABELS.fontSettings}</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="fontFamily">{UI_LABELS.font}</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger id="fontFamily"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Courier">Courier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fontSize">{UI_LABELS.fontSize}: {fontSize}px</Label>
                      <Input id="fontSize" type="range" min="8" max="48" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <Label htmlFor="color">{UI_LABELS.color}</Label>
                      <div className="flex gap-2">
                        <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-10 p-1 cursor-pointer" />
                        <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Output Settings */}
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

                {/* Apply Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  <Hash className="w-4 h-4 mr-2" />
                  {UI_LABELS.addPageNumbers}
                </GradientButton>
              </div>
            </>
          }
        >
          {/* Pages Grid with Responsive Layout - Matches MergePdfPage */}
          <div className="border-2 border-pink-200 rounded-lg p-6 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 place-items-center">
              {pdfPages.map((page, index) => {
                // Determine if this page should have a number
                const startPage = parseInt(startFromPage) || 1;
                const shouldShowNumber = (index + 1) >= startPage;
                
                // Calculate the page number (only for pages after startFromPage)
                const pageNumberOffset = index - (startPage - 1);
                const currentPageNum = parseInt(startingNumber) + pageNumberOffset;
                const formattedNumber = formatPageNumber(currentPageNum, numberFormat);
                const displayNumber = shouldShowNumber ? `${prefix}${formattedNumber}${suffix}` : "";

                return (
                  <div key={index} className="w-full max-w-[200px]">
                    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-400 hover:shadow-lg transition-all relative">
                      {/* Page Thumbnail */}
                      <div
                        className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t flex items-center justify-center relative p-3"
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

                        {/* Page Number Preview - Only show if shouldShowNumber */}
                        {shouldShowNumber && (
                          <div style={getPositionStyles(numberPosition)}>
                            {displayNumber}
                          </div>
                        )}
                      </div>

                      {/* Page Info Footer */}
                      <div className="p-2 bg-white border-t border-gray-200">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 mb-0.5">
                              Page {index + 1}
                              {shouldShowNumber && <span className="text-purple-500 ml-1">({displayNumber})</span>}
                            </div>
                            <div className="text-[10px] text-gray-500 truncate" title={page.fileName}>
                              {page.fileName}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ${shouldShowNumber ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gray-400'}`}>
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
                  resetButtonText={UI_LABELS.numberAnother} 
                  icon={Hash} 
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
                  introText="These tools work well with page numbering and help you manage your PDF documents."
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
                <WhyChooseSection {...WHY_CHOOSE_WORKFLOWPRO} features={FEATURES} />

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
        icon={Hash} 
      />
    </>
  );
}