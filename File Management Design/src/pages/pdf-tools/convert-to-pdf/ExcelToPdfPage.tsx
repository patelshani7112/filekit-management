/**
 * Excel to PDF Page
 * 
 * Purpose: Convert Excel spreadsheets (.xls, .xlsx, .xlsm) to PDF format
 * Two-mode flow: Upload Mode → Configure & Convert Mode
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
import { simulateRealisticProgress } from "../../../utils/uploadProgress";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { GradientButton } from "../../../components/ui/gradient-button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { 
  FileText, 
  FilePlus,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
  FileType,
  RefreshCw,
  Settings,
  X,
  Search,
  FileImage,
  File,
  BookOpen,
  FileBarChart,
  Archive,
  Music,
  GripVertical,
  FileSpreadsheet,
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
  OUTPUT_FORMATS,
  OUTPUT_FORMAT_CATEGORIES,
} from "../../../content/tools/pdf-tools/convert-to-pdf/excel-to-pdf-content";

// Processing steps
type ProcessStep = "upload" | "edit" | "processing" | "complete";

interface ExcelToPdfPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

interface ConvertedFile {
  fileName: string;
  originalName: string;
  sheetCount: number;
}

interface OutputFormat {
  id: string;
  name: string;
  extension: string;
  category: string;
  description?: string;
}

export default function ExcelToPdfPage({ onWorkStateChange }: ExcelToPdfPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<ProcessStep>("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [processedFileName, setProcessedFileName] = useState("");
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");
  
  // Settings state
  const [outputFileName, setOutputFileName] = useState("converted.pdf");
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [embedFonts, setEmbedFonts] = useState(true);
  const [mergeFiles, setMergeFiles] = useState(false);
  
  // Output format state
  const [selectedOutputFormat, setSelectedOutputFormat] = useState<OutputFormat>(OUTPUT_FORMATS[0]); // Default: PDF
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [formatSearchQuery, setFormatSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Document");
  
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
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

  // Update output filename extension when format changes
  useEffect(() => {
    if (files.length === 1) {
      const baseName = outputFileName.replace(/\.[^/.]+$/, "");
      setOutputFileName(`${baseName}.${selectedOutputFormat.extension}`);
    } else if (files.length > 1) {
      setOutputFileName(`converted-documents.zip`);
    }
  }, [selectedOutputFormat, files.length]);

  // Validate Excel file (check for .xls, .xlsx, .xlsm extension)
  const validateExcelFile = async (file: File): Promise<FileValidationInfo> => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['.xls', '.xlsx', '.xlsm', '.xlsb', '.xltx', '.xltm'];
    
    if (!validExtensions.includes(ext)) {
      return {
        file,
        isValidating: false,
        isValid: false,
        error: "Invalid file type. Only Excel files (.xls, .xlsx, .xlsm) are supported.",
        uploadProgress: 100,
      };
    }
    
    // Simulate validation - in real app, this would parse the spreadsheet
    return {
      file,
      isValidating: false,
      isValid: true,
      pageCount: Math.floor(Math.random() * 5) + 1, // Simulated sheet count
      uploadProgress: 100,
    };
  };

  // Handle file selection with Excel validation
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
    
    // Validate file types (Excel only)
    const invalidFiles = newFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return !['.xls', '.xlsx', '.xlsm', '.xlsb', '.xltx', '.xltm'].includes(ext);
    });
    
    if (invalidFiles.length > 0) {
      setValidationMessage(VALIDATION_MESSAGES.invalidFileType(invalidFiles.length));
      setValidationType("error");
      newFiles = newFiles.filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return ['.xls', '.xlsx', '.xlsm', '.xlsb', '.xltx', '.xltm'].includes(ext);
      });
    }
    
    // Validate file sizes
    const oversizedFiles = newFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setValidationMessage(VALIDATION_MESSAGES.fileTooLarge(oversizedFiles.length, maxFileSize));
      setValidationType("error");
      return;
    }
    
    // Limit to available slots
    const filesToAdd = newFiles.slice(0, availableSlots);
    
    if (newFiles.length > availableSlots) {
      setValidationMessage(VALIDATION_MESSAGES.tooManyFiles(maxFiles));
      setValidationType("warning");
    }
    
    // Add files to state
    setFiles(prev => [...prev, ...filesToAdd]);

    // Create validation info for each file (initially validating)
    const newValidationInfo: FileValidationInfo[] = filesToAdd.map(file => ({
      file,
      isValidating: true,
      isValid: false,
      pageCount: 0,
      uploadProgress: 0,
    }));
    
    setFileValidationInfo(prev => [...prev, ...newValidationInfo]);

    // Validate each Excel file with progress animation
    filesToAdd.forEach(async (file, index) => {
      const fileIndex = files.length + index;
      
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
        // Validate Excel file
        const validationResult = await validateExcelFile(file);
        
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
          updated[fileIndex] = validationResult;
          return updated;
        });
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
            error: "Failed to validate Excel file",
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
      const validationResult = await validateExcelFile(file);
      
      const elapsed = Date.now();
      const remaining = minAnimationDuration - elapsed;
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
    
      cancelProgress();
    
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = validationResult;
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
          error: "Failed to validate Excel file",
        };
        return updated;
      });
    }
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
  };

  // Proceed to edit mode
  const handleContinueToEdit = () => {
    // Only continue if we have valid files
    const validFiles = fileValidationInfo.filter(info => info.isValid);
    if (validFiles.length === 0) return;
    
    setCurrentStep("edit");
  };

  // Back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  // Process conversion
  const handleConvert = async () => {
    setCurrentStep("processing");
    
    // Simulate processing with progress
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 95) {
        currentProgress = 95;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 200);
    
    // Simulate conversion process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearInterval(progressInterval);
    setProgress(100);
    
    // Create converted files list
    const converted = fileValidationInfo
      .filter(info => info.isValid)
      .map(info => ({
        fileName: info.file.name.replace(/\.(xls|xlsx|xlsm|xlsb|xltx|xltm)$/i, `.${selectedOutputFormat.extension}`),
        originalName: info.file.name,
        sheetCount: info.pageCount || 1,
      }));
    
    setConvertedFiles(converted);
    
    // Set download info
    if (files.length === 1) {
      setProcessedFileName(converted[0].fileName);
    } else {
      setProcessedFileName("converted-documents.zip");
    }
    setDownloadUrl("#");
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentStep("complete");
  };

  // Reset to start
  const handleReset = () => {
    setCurrentStep("upload");
    setFiles([]);
    setFileValidationInfo([]);
    setProgress(0);
    setDownloadUrl("");
    setProcessedFileName("");
    setConvertedFiles([]);
    setValidationMessage("");
    setOutputFileName("converted.pdf");
    setPreserveFormatting(true);
    setEmbedFonts(true);
    setMergeFiles(false);
    setSelectedOutputFormat(OUTPUT_FORMATS[0]);
  };

  // Calculate total file size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalSizeFormatted = totalSize < 1024 * 1024
    ? `${(totalSize / 1024).toFixed(1)} KB`
    : `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;

  // Calculate total sheets
  const totalSheets = fileValidationInfo.reduce((sum, info) => sum + (info.pageCount || 0), 0);

  // Filter formats for modal
  const filteredFormats = OUTPUT_FORMATS.filter(format => {
    const matchesSearch = format.name.toLowerCase().includes(formatSearchQuery.toLowerCase()) ||
                         format.extension.toLowerCase().includes(formatSearchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || format.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Document": return File;
      case "Image": return FileImage;
      case "Spreadsheet": return FileSpreadsheet;
      case "Archive": return Archive;
      case "Web": return BookOpen;
      case "Data": return FileBarChart;
      default: return FileType;
    }
  };

  return (
    <>
      <SeoHead
        title="Excel to PDF Converter - Convert XLS & XLSX to PDF Free | WorkflowPro"
        description="Convert Excel spreadsheets to PDF online for free. Convert .xls and .xlsx files to PDF with perfect formatting in seconds – no signup required."
        canonical="/excel-to-pdf"
      />
      <ToolJsonLd
        name="Excel to PDF Converter"
        description={HERO_CONTENT.description}
        url="/excel-to-pdf"
      />

      <NavigationBlocker
        when={files.length > 0 && currentStep === "edit"}
        message={NAVIGATION_BLOCKER_MESSAGE}
      />

      <ProcessingModal
        isOpen={currentStep === "processing"}
        progress={progress}
        title={`Converting to ${selectedOutputFormat.name}...`}
        description={`Converting your Excel spreadsheets to ${selectedOutputFormat.name} format`}
        icon={RefreshCw}
      />



      {currentStep === "edit" ? (
        <EditPageLayout
          onBack={handleBackToUpload}
          totalPages={totalSheets}
          totalSize={totalSizeFormatted}
          showInlineAd={true}
          sidebar={
            <>
              {/* Header with Title and Replace Button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Conversion Settings</h3>
                
                {/* Replace File Button */}
                <input
                  type="file"
                  id="replaceFileExcel"
                  accept={UPLOAD_CONFIG.acceptedTypes}
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
                  onClick={() => document.getElementById('replaceFileExcel')?.click()}
                  disabled={files.length >= UPLOAD_CONFIG.maxFiles}
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  Add Files
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Configure how your Excel spreadsheets will be converted
              </p>
              
              <div className="space-y-6">
                {/* Source Files - Collapsible */}
                <div>
                  {/* Collapsible Header */}
                  <button
                    onClick={() => setIsSourceFilesOpen(!isSourceFilesOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-3 hover:text-purple-600 transition-colors"
                  >
                    <span>Source Files</span>
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
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs p-3 rounded-lg border-2 bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all group"
                        >
                          <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-purple-500 flex-shrink-0" />
                          <FileSpreadsheet className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="flex-1 truncate text-gray-700" title={file.name}>
                            {file.name}
                          </span>
                          <div className="text-xs text-gray-500 font-medium">
                            ({fileValidationInfo[index]?.pageCount || 1})
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(index);
                            }}
                            className="h-6 w-6 p-0 hover:bg-red-100 text-gray-400 hover:text-destructive flex-shrink-0"
                            title="Remove file"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Output Format Picker - Inline Expandable */}
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                  {/* Format Picker Header */}
                  <button
                    onClick={() => setIsOutputModalOpen(!isOutputModalOpen)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-gray-700">Output Format:</Label>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-100 rounded-md">
                        <FileType className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-700">{selectedOutputFormat.name}</span>
                      </div>
                    </div>
                    {isOutputModalOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {/* Expandable Format Picker Panel */}
                  {isOutputModalOpen && (
                    <div className="border-t border-gray-200 bg-white">
                      {/* Search Bar */}
                      <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search format..."
                            value={formatSearchQuery}
                            onChange={(e) => setFormatSearchQuery(e.target.value)}
                            className="pl-9 h-9 text-sm"
                          />
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="p-3 border-b border-gray-200">
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => setSelectedCategory("All")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              selectedCategory === "All"
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            All
                          </button>
                          {OUTPUT_FORMAT_CATEGORIES.map((category) => {
                            const Icon = getCategoryIcon(category);
                            return (
                              <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                  selectedCategory === category
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                                {category}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Format Grid */}
                      <div className="p-3 max-h-80 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                          {filteredFormats.map((format) => (
                            <button
                              key={format.id}
                              onClick={() => {
                                setSelectedOutputFormat(format);
                                setIsOutputModalOpen(false);
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                selectedOutputFormat.id === format.id
                                  ? "border-purple-500 bg-purple-50 shadow-md"
                                  : "border-gray-200 hover:border-purple-300 hover:shadow-sm"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <FileType className={`w-4 h-4 ${
                                  selectedOutputFormat.id === format.id ? "text-purple-600" : "text-gray-600"
                                }`} />
                                <span className={`text-sm ${
                                  selectedOutputFormat.id === format.id ? "text-purple-700" : "text-gray-900"
                                }`}>
                                  {format.name}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        {filteredFormats.length === 0 && (
                          <div className="text-center py-8">
                            <FileType className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No formats found matching "{formatSearchQuery}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Output Filename */}
                {files.length === 1 && (
                  <div className="space-y-2">
                    <Label htmlFor="outputFileName" className="text-sm font-medium text-gray-700">
                      Output Filename
                    </Label>
                    <Input
                      id="outputFileName"
                      type="text"
                      value={outputFileName}
                      onChange={(e) => setOutputFileName(e.target.value)}
                      placeholder={`converted.${selectedOutputFormat.extension}`}
                      className="text-sm h-11 bg-white border-2 border-gray-300 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                )}

                {/* Conversion Options */}
                <div className="p-4 border-2 border-purple-200 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Conversion Options</h4>
                  
                  {/* Preserve Formatting */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Preserve Formatting</p>
                      <p className="text-xs text-gray-500">Keep original spreadsheet formatting</p>
                    </div>
                    <button
                      onClick={() => setPreserveFormatting(!preserveFormatting)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preserveFormatting ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preserveFormatting ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Embed Fonts */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Embed Fonts</p>
                      <p className="text-xs text-gray-500">Ensure fonts display correctly</p>
                    </div>
                    <button
                      onClick={() => setEmbedFonts(!embedFonts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        embedFonts ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          embedFonts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Merge Files (only for multiple files) */}
                  {files.length > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Merge All Files</p>
                        <p className="text-xs text-gray-500">Combine into one {selectedOutputFormat.name}</p>
                      </div>
                      <button
                        onClick={() => setMergeFiles(!mergeFiles)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          mergeFiles ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            mergeFiles ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Ready to Convert Summary */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileType className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Ready to Convert
                      </h4>
                      <ul className="text-xs text-blue-700 leading-relaxed space-y-1">
                        <li>• {files.length} Excel {files.length === 1 ? 'file' : 'files'}</li>
                        <li>• {totalSheets} total {totalSheets === 1 ? 'sheet' : 'sheets'}</li>
                        <li>• {totalSizeFormatted} total size</li>
                        <li>• Output: <strong>{selectedOutputFormat.name}</strong> (.{selectedOutputFormat.extension})</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Convert Button */}
                <GradientButton
                  onClick={handleConvert}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Convert to {selectedOutputFormat.name}
                </GradientButton>
              </div>
            </>
          }
        >
          {/* Main Content Area - File Cards */}
          <div className="space-y-4 sm:space-y-6">
            {/* Section Title */}
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Files to Convert ({files.length})
              </h2>
            </div>

            {/* File Cards Grid - 2 columns on mobile, more on desktop (like Merge PDF) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 place-items-center">
              {fileValidationInfo.map((info, index) => {
                const fileSizeStr = info.file.size < 1024 * 1024
                  ? `${(info.file.size / 1024).toFixed(1)} KB`
                  : `${(info.file.size / (1024 * 1024)).toFixed(2)} MB`;

                return (
                  <div
                    key={index}
                    className="group relative w-full max-w-[200px] bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-400 hover:shadow-xl transition-all"
                  >
                    {/* Remove Button at TOP RIGHT */}
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                        className="h-7 w-7 p-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:bg-red-500 hover:text-white text-red-500 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {/* File Preview/Thumbnail */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center p-4 relative">
                      {/* File Icon */}
                      <div className="mb-3">
                        <FileSpreadsheet className="w-12 h-12 sm:w-14 sm:h-14 text-green-600" />
                      </div>
                      
                      {/* File Name */}
                      <div className="text-center w-full px-2">
                        <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate mb-1" title={info.file.name}>
                          {info.file.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                          <span>{info.pageCount || 1} {info.pageCount === 1 ? 'sheet' : 'sheets'}</span>
                          <span>•</span>
                          <span>{fileSizeStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Footer */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 sm:py-2.5 border-t border-gray-200">
                      {info.isValid ? (
                        <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-green-600">
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="font-medium">Ready to convert</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-red-600">
                          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="font-medium">Invalid file</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </EditPageLayout>
      ) : (
        <>
          {/* Success Header */}
          {currentStep === "complete" && (
            <SuccessHeader
              title={UI_LABELS.successTitle}
              message={files.length === 1 ? `Excel spreadsheet converted to ${selectedOutputFormat.name} successfully!` : `${files.length} Excel spreadsheets converted to ${selectedOutputFormat.name} successfully!`}
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
            {/* Mobile Sticky Ad */}
            {currentStep === "upload" && <MobileStickyAd topOffset={64} height={100} />}
            
            {/* Main Tool Card */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {/* Upload Step */}
              {currentStep === "upload" && (
                <>
                  <FileUploader 
                    onFilesSelected={handleFilesSelected} 
                    acceptedTypes={UPLOAD_CONFIG.acceptedTypes}
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
                      files={fileValidationInfo}
                      onRemove={handleRemoveFile}
                      onContinue={handleContinueToEdit}
                      continueText={UI_LABELS.continueToConvert}
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
                    name: processedFileName,
                    url: downloadUrl,
                    type: selectedOutputFormat.extension
                  }}
                  fileInfo={{
                    'Converted Files': `${convertedFiles.length} ${convertedFiles.length === 1 ? 'file' : 'files'}`,
                    'Total Sheets': `${convertedFiles.reduce((sum, f) => sum + f.sheetCount, 0)} sheets`,
                    'Format': selectedOutputFormat.name,
                  }}
                  onReset={handleReset}
                  resetButtonText={UI_LABELS.convertAnother}
                  icon={FileType}
                />
              )}
            </div>

            {/* Related Tools Section */}
            {currentStep === "complete" && (
              <RelatedToolsSection
                title="Try More Conversion Tools"
                tools={relatedTools}
              />
            )}

            {/* Show these sections if NOT on complete step */}
            {currentStep !== "complete" && (
              <>
                {/* Related Tools Section */}
                <RelatedToolsSection
                  title="Related Conversion Tools"
                  tools={relatedTools}
                  introText="Convert between different document and spreadsheet formats quickly and easily."
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
                  subtitle="The most powerful and user-friendly Excel to PDF converter available online"
                  introText="WorkflowPro delivers fast, accurate, and secure spreadsheet conversion trusted by professionals, students, and businesses. No signup required."
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
