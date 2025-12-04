/**
 * Compress PDF Page
 * 
 * Purpose: Allow users to compress PDF files to reduce file size
 * 
 * Features:
 * - Upload multiple PDF files
 * - Compression quality settings
 * - Process files (mock - in real app, use PDF library)
 * - Download compressed PDFs
 * 
 * How it works:
 * 1. User uploads PDF files
 * 2. Files are displayed with size information
 * 3. User selects compression level
 * 4. User clicks "Compress PDFs"
 * 5. Files are processed (simulated)
 * 6. User downloads the compressed PDFs
 */

import { useState, useEffect } from "react";
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
  CompressSuccessSection,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
import { getPdfInfo } from "../../../utils/pdfUtils";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Slider } from "../../../components/ui/slider";
import { Input } from "../../../components/ui/input";
import { GradientButton } from "../../../components/ui/gradient-button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { 
  FileText, Lock, Zap, Archive, FileEdit, Split, RefreshCw, Upload, Settings, Download, 
  FileImage, FileType, FileCog, FileMinus, FileKey, FileSignature, 
  LockOpen, Merge, RotateCw, Minimize2, Trash2, GripVertical, Copy, ArrowLeft, X,
  FilePlus
} from "lucide-react";

// How it works steps for this tool
const STEPS = [
  {
    number: 1,
    title: "Upload Your PDFs",
    description: "Select one or multiple PDF files from your device or drag and drop them into the upload area.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Choose Quality",
    description: "Select your desired compression level - high quality for minimal size reduction or maximum compression for smallest files.",
    icon: Settings,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Compress Files",
    description: "Click compress and watch the progress in real-time. Our tool optimizes images and removes unnecessary data.",
    icon: Archive,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Results",
    description: "Download your compressed PDF files instantly. See exactly how much space you saved.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

// Compression quality levels
const COMPRESSION_LEVELS = [
  { value: 1, label: "Low Compression", description: "Best quality, larger file size" },
  { value: 2, label: "Medium Compression", description: "Balanced quality and size" },
  { value: 3, label: "High Compression", description: "Smaller size, good quality" },
  { value: 4, label: "Maximum Compression", description: "Smallest size, acceptable quality" },
];

interface CompressPdfPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function CompressPdfPage({ onWorkStateChange }: CompressPdfPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrls, setDownloadUrls] = useState<Array<{ url: string; fileName: string; originalSize: number; compressedSize: number }>>([]);
  const [compressionLevel, setCompressionLevel] = useState(2); // Default: Medium
  const [pdfPages, setPdfPages] = useState<Array<{fileIndex: number, fileName: string, pageNumber: number, rotation: number}>>([]);
  const [outputFileName, setOutputFileName] = useState("compressed.pdf");
  const [previewPage, setPreviewPage] = useState<number | null>(null);
  const [combineFiles, setCombineFiles] = useState(false); // New state for combine option
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Update filename when combine option changes
  useEffect(() => {
    if (combineFiles) {
      setOutputFileName("compressed.pdf");
    } else {
      // For individual files, we'll use filename pattern
      setOutputFileName("compressed.pdf");
    }
  }, [combineFiles]);
  
  // Related tools for this page
  const relatedTools = [
    {
      name: "Merge PDF",
      description: "Combine multiple PDF files into one",
      icon: Merge,
      onClick: () => window.location.href = "/merge-pdf",
    },
    {
      name: "Split PDF",
      description: "Extract pages from your PDF",
      icon: Split,
      onClick: () => window.location.href = "/split-pdf",
    },
    {
      name: "Edit PDF",
      description: "Add text, images, and annotations to your PDF",
      icon: FileEdit,
      onClick: () => window.location.href = "/edit-pdf",
    },
    {
      name: "Organize PDF",
      description: "Reorder, rotate, and manage PDF pages",
      icon: FileCog,
      onClick: () => window.location.href = "/organize-pdf",
    },
    {
      name: "Convert to PDF",
      description: "Convert Word, Excel, PowerPoint, and images to PDF",
      icon: RefreshCw,
      onClick: () => window.location.href = "/convert-to-pdf",
    },
    {
      name: "PDF to Word",
      description: "Convert PDF to editable Word document",
      icon: FileType,
      onClick: () => window.location.href = "/pdf-to-word",
    },
    {
      name: "PDF to Image",
      description: "Convert PDF pages to JPG or PNG images",
      icon: FileImage,
      onClick: () => window.location.href = "/pdf-to-image",
    },
    {
      name: "Rotate PDF",
      description: "Rotate PDF pages to the correct orientation",
      icon: RotateCw,
      onClick: () => window.location.href = "/rotate-pdf",
    },
    {
      name: "Delete PDF Pages",
      description: "Remove unwanted pages from your PDF",
      icon: FileMinus,
      onClick: () => window.location.href = "/delete-pdf-pages",
    },
    {
      name: "Watermark PDF",
      description: "Add text or image watermark to PDF",
      icon: FileSignature,
      onClick: () => window.location.href = "/watermark-pdf",
    },
    {
      name: "Protect PDF",
      description: "Add password protection to your PDF",
      icon: FileKey,
      onClick: () => window.location.href = "/protect-pdf",
    },
    {
      name: "Unlock PDF",
      description: "Remove password protection from PDF",
      icon: LockOpen,
      onClick: () => window.location.href = "/unlock-pdf",
    },
  ];

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

  // Handle file selection with PDF validation
  const handleFilesSelected = async (newFiles: File[]) => {
    const maxFiles = 10;
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
    const invalidFiles = newFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return ext !== '.pdf';
    });
    
    if (invalidFiles.length > 0) {
      setValidationMessage(`Only PDF files are allowed. ${invalidFiles.length} invalid file(s) removed.`);
      setValidationType("error");
      newFiles = newFiles.filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return ext === '.pdf';
      });
    }
    
    // Validate file sizes
    const oversizedFiles = newFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setValidationMessage(`${oversizedFiles.length} file(s) exceed ${maxFileSize}MB limit and were removed.`);
      setValidationType("error");
      newFiles = newFiles.filter(file => file.size <= maxFileSize * 1024 * 1024);
    }
    
    // Check available slots
    const filesToAdd = availableSlots < newFiles.length 
      ? newFiles.slice(0, availableSlots)
      : newFiles;
    
    if (filesToAdd.length < newFiles.length) {
      setValidationMessage(`Only ${filesToAdd.length} file(s) added. Maximum ${maxFiles} files allowed (you have ${currentFileCount} already).`);
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
    }));
    
    setFileValidationInfo((prev) => [...prev, ...newValidationInfo]);

    // Validate each PDF file
    filesToAdd.forEach(async (file, index) => {
      const fileIndex = startIndex + index;
      
      try {
        // Get PDF info
        const pdfInfo = await getPdfInfo(file);
        
        // Update validation info
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: pdfInfo.isValid,
            pageCount: pdfInfo.pageCount,
            error: pdfInfo.error,
          };
          return updated;
        });

        // If we're in edit mode and the file is valid, add its pages to pdfPages
        if (currentStep === "edit" && pdfInfo.isValid) {
          setPdfPages((prev) => {
            const newPages = [...prev];
            for (let i = 0; i < pdfInfo.pageCount; i++) {
              newPages.push({
                fileIndex,
                fileName: file.name,
                pageNumber: i + 1,
                rotation: 0,
              });
            }
            return newPages;
          });
        }
      } catch (error) {
        // Handle unexpected errors
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: false,
            pageCount: 0,
            error: "Failed to read PDF file",
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

    // Set file to validating state
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
      // Get PDF info
      const pdfInfo = await getPdfInfo(file);
      
      // Update validation info
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: pdfInfo.isValid,
          pageCount: pdfInfo.pageCount,
          error: pdfInfo.error,
        };
        return updated;
      });
    } catch (error) {
      // Handle unexpected errors
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: false,
          pageCount: 0,
          error: "Failed to read PDF file",
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

  // Go back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
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

  // Reorder pages
  const handleReorderPages = (fromIndex: number, toIndex: number) => {
    setPdfPages((prev) => {
      const newPages = [...prev];
      const [movedPage] = newPages.splice(fromIndex, 1);
      newPages.splice(toIndex, 0, movedPage);
      return newPages;
    });
  };

  // Process files (compress PDFs)
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing with progress
    const processedFiles: Array<{ url: string; fileName: string; originalSize: number; compressedSize: number }> = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progressPerFile = 100 / files.length;
      
      // Simulate compression progress for this file
      for (let j = 0; j <= 100; j += 20) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setProgress(Math.floor((i * progressPerFile) + (j * progressPerFile / 100)));
      }
      
      // Calculate simulated compressed size based on compression level
      const compressionRatio = compressionLevel === 1 ? 0.9 : 
                               compressionLevel === 2 ? 0.7 : 
                               compressionLevel === 3 ? 0.5 : 0.3;
      const compressedSize = Math.floor(file.size * compressionRatio);
      
      // Create a mock blob for download
      const mockPdfContent = `Compressed PDF: ${file.name}\nOriginal Size: ${file.size} bytes\nCompressed Size: ${compressedSize} bytes`;
      const blob = new Blob([mockPdfContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      processedFiles.push({
        url,
        fileName: file.name.replace('.pdf', '_compressed.pdf'),
        originalSize: file.size,
        compressedSize,
      });
    }

    // Set download info
    setDownloadUrls(processedFiles);
    setProgress(100);
    setCurrentStep("complete");
  };

  // Reset to upload more files
  const handleReset = () => {
    // Clean up old blob URLs
    downloadUrls.forEach(({ url }) => {
      URL.revokeObjectURL(url);
    });

    // Reset state
    setFiles([]);
    setFileValidationInfo([]);
    setCurrentStep("upload");
    setProgress(0);
    setDownloadUrls([]);
    setCompressionLevel(2);
  };

  // Check if we can process files (at least one valid file)
  const canProcess = fileValidationInfo.length > 0 && 
                     fileValidationInfo.some(info => info.isValid) &&
                     fileValidationInfo.every(info => !info.isValidating);

  // Calculate total file size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Calculate if we should block navigation
  const hasUnsavedWork = files.length > 0 && currentStep !== "complete";

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/compress-pdf" />
      <ToolJsonLd path="/compress-pdf" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded files that haven't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleReset}
      />

      {/* Success Header - Full Width at Top (only on complete step) */}
      {currentStep === "complete" && (
        <SuccessHeader
          title="PDFs Compressed Successfully!"
          description={`Your ${files.length} PDF file${files.length > 1 ? 's have' : ' has'} been compressed and ${files.length > 1 ? 'are' : 'is'} ready to download`}
        />
      )}

      {/* Header Section - Full Width Above Layout - Hide on Complete Step and Edit Step */}
      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Compress PDF" 
          description="Reduce PDF file size without losing quality. Optimize your PDFs for faster sharing, storage, and web publishing — completely free and secure."
        />
      )}

      {/* Edit Step - Special Layout without side ads and without header */}
      {currentStep === "edit" ? (
        <EditPageLayout
          fullWidth={true}
          showInlineAd={true}
          onBack={handleBackToUpload}
          totalPages={pdfPages.length}
          totalSize={formatFileSize(totalSize)}
          sidebar={
            <>
              {/* Header with Title and Add Button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Compress Settings</h3>
                
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
                {/* Compression Level */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Compression Level</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Slider
                        value={[compressionLevel]}
                        onValueChange={(value) => setCompressionLevel(value[0])}
                        min={1}
                        max={4}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                        <span>Max</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 bg-purple-50 p-3 rounded">
                      {COMPRESSION_LEVELS[compressionLevel - 1].label}: {COMPRESSION_LEVELS[compressionLevel - 1].description}
                    </p>
                  </div>
                </div>

                {/* Output Settings */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Output Settings</h4>
                  <div className="space-y-3">
                    {/* Combine Files Option - Only show if multiple files */}
                    {fileValidationInfo.filter(info => info.isValid).length > 1 && (
                      <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded border border-purple-200">
                        <input
                          type="checkbox"
                          id="combineFiles"
                          checked={combineFiles}
                          onChange={(e) => setCombineFiles(e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <Label htmlFor="combineFiles" className="text-xs font-medium text-gray-900 cursor-pointer">
                          Combine all files into one PDF
                        </Label>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="outputFileName" className="text-xs text-gray-600 mb-2 block">
                        Filename
                      </Label>
                      <Input
                        id="outputFileName"
                        type="text"
                        value={outputFileName}
                        onChange={(e) => setOutputFileName(e.target.value)}
                        placeholder="compressed.pdf"
                        className="text-sm bg-purple-50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>

                    {/* Total Size Info */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Archive className="w-4 h-4 text-purple-500" />
                        <span className="font-medium text-gray-900">{formatFileSize(totalSize)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compress Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Compress PDF
                </GradientButton>
              </div>
            </>
          }
        >
          {/* Files Grid with Action Buttons - Responsive Grid */}
          <div className="border-2 border-pink-200 rounded-lg p-6 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 place-items-center">
              {fileValidationInfo
                .filter((info) => info.isValid)
                .map((fileInfo, index) => {
                  const actualFileIndex = fileValidationInfo.findIndex(
                    (info) => info.file.name === fileInfo.file.name
                  );
                  const file = fileInfo.file;
                  const fileSize = file.size;
                  const fileSizeStr = 
                    fileSize < 1024 ? `${fileSize} B` :
                    fileSize < 1024 * 1024 ? `${(fileSize / 1024).toFixed(1)} KB` :
                    `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;

                  return (
                    <div key={index} className="w-full flex flex-col items-center gap-3">
                      {/* File Card */}
                      <div
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("fileIndex", actualFileIndex.toString());
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const fromIndex = parseInt(e.dataTransfer.getData("fileIndex"));
                          if (fromIndex !== actualFileIndex && !isNaN(fromIndex)) {
                            handleReorderFiles(fromIndex, actualFileIndex);
                          }
                        }}
                        className="group relative w-full max-w-[200px] bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-400 hover:shadow-xl transition-all cursor-move"
                      >
                        {/* Remove Button - Top Right */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(actualFileIndex);
                          }}
                          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-5 transition-colors"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* File Preview */}
                        <div className="aspect-[3/4] bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center relative p-8">
                          <FileText className="w-full h-full text-purple-300 opacity-60" />
                          
                          {/* File Number Badge - Bottom Right of Preview */}
                          <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg text-sm">
                            {index + 1}
                          </div>
                        </div>

                        {/* File Info */}
                        <div className="p-4 bg-white border-t border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate mb-2" title={file.name}>
                            {file.name}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{fileInfo.pageCount} page{fileInfo.pageCount !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{fileSizeStr}</span>
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
        /* All Other Steps - Normal Layout with Side Ads and Header */
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
                acceptedTypes=".pdf"
                multiple={true}
                maxFiles={10}
                maxFileSize={50}
                fileTypeLabel="PDF"
                helperText="PDF files only · Up to 10 files · 50MB each"
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
                  continueText="Continue to Edit"
                  continueDisabled={!canProcess}
                  showReorder={false}
                  onRetry={handleRetryValidation}
                />
              )}
            </>
          )}

          {/* STEP 2: Processing */}
          {currentStep === "processing" && (
            <ProcessButton
              onClick={() => {}}
              isProcessing={true}
              processingText="Compressing PDFs..."
              progress={progress}
            />
          )}

          {/* STEP 3: Download */}
          {currentStep === "complete" && (
            <CompressSuccessSection
              files={downloadUrls}
              onReset={handleReset}
              resetButtonText="Compress Another PDF"
              title="PDFs Compressed Successfully!"
              description={`Your ${files.length} PDF file${files.length > 1 ? 's have' : ' has'} been compressed and ${files.length > 1 ? 'are' : 'is'} ready to download`}
              icon={Archive}
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
              introText="These tools work well with PDF compression and help you manage or convert your documents."
            />

            {/* Tool Definition Section - Now inside layout, fits between ads */}
            <ToolDefinitionSection
              title="What Is PDF Compression?"
              content="PDF compression reduces the file size of a PDF document by optimizing images, removing redundant data, and applying compression algorithms. It makes PDFs easier to share via email, faster to download, and requires less storage space while maintaining readability and visual quality. WorkflowPro processes your PDFs quickly and keeps everything private."
            />

            {/* How to Use Section - Now inside layout, fits between ads */}
            <HowItWorksSteps 
              title="How It Works"
              subtitle="Compress your PDF files in four simple steps with our intuitive interface"
              introText="Follow these simple steps to reduce your PDF file size quickly and securely."
              steps={STEPS} 
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
              title="Popular Uses for Compressing PDFs"
              useCases={[
                "Reduce file size for email attachments",
                "Optimize PDFs for web publishing",
                "Save storage space for archived documents",
                "Share files faster on mobile devices",
                "Reduce cloud storage costs",
                "Compress documents before uploading",
              ]}
            />

            {/* Tool FAQ Section - Now inside layout, fits between ads */}
            <ToolFAQSection
              faqs={[
                {
                  question: "How much can I compress a PDF?",
                  answer: "Compression ratios vary by content. Image-heavy PDFs compress 50-70%, text-heavy PDFs compress 10-30%.",
                },
                {
                  question: "Will compression affect quality?",
                  answer: "Our tool maintains visual quality while reducing file size. Higher compression may result in minimal quality loss.",
                },
                {
                  question: "Can I compress multiple PDFs at once?",
                  answer: "Yes — upload and compress up to 10 PDF files simultaneously.",
                },
                {
                  question: "Is there a file size limit?",
                  answer: "Each PDF can be up to 50MB. You can upload up to 10 files at once.",
                },
                {
                  question: "Are my files secure?",
                  answer: "Yes, all compression happens in your browser. Files are never uploaded to our servers.",
                },
                {
                  question: "Do I need to install software?",
                  answer: "No — works online on all devices.",
                },
                {
                  question: "Is WorkflowPro free?",
                  answer: "Yes — free to use with no watermarks.",
                },
                {
                  question: "What formats are supported?",
                  answer: "Only PDF files; use our converters for other formats.",
                },
              ]}
            />

            {/* Tool SEO Footer - Now inside layout, fits between ads */}
            <ToolSEOFooter
              title="About WorkflowPro's Compress PDF Tool"
              content="WorkflowPro's Compress PDF tool helps you reduce PDF file sizes quickly and securely. Perfect for email attachments, web publishing, storage management, and more — fast, simple, and always free."
            />
          </>
        )}
      </ToolPageLayout>
      )}
      
      {/* Processing Modal - Centered */}
      <ProcessingModal
        isOpen={currentStep === "processing"}
        progress={progress}
        title="Compressing PDFs..."
        description="Optimizing your PDF files to reduce size while maintaining quality"
        icon={Archive}
      />
    </>
  );
}