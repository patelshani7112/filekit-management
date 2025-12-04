/**
 * Compress PNG Page
 * 
 * Purpose: Allow users to compress PNG image files with live before/after preview
 * 
 * Features:
 * - Upload single PNG file only
 * - Live before/after slider preview
 * - Compression quality slider (0-100%)
 * - Format conversion to other formats
 * - Process files with realistic progress
 * - Download compressed PNG
 * 
 * How it works:
 * 1. User uploads PNG file
 * 2. Live preview shows original vs compressed with draggable slider
 * 3. User adjusts compression level (0-100%)
 * 4. User selects output format (defaults to PNG)
 * 5. User clicks "Compress PNG"
 * 6. File is processed (simulated)
 * 7. User downloads the compressed PNG
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
  CompressSuccessSection,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
import { getImageInfo } from "../../../utils/imageUtils";
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
  FilePlus, ImageIcon, Maximize2, Crop, ChevronDown, Search, Check
} from "lucide-react";

// How it works steps for this tool
const STEPS = [
  {
    number: 1,
    title: "Upload Your PNG",
    description: "Select a PNG file from your device or drag and drop it into the upload area.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Adjust Quality & Format",
    description: "Use the slider to set compression level (0-100%) and select your desired output format.",
    icon: Settings,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Preview Changes",
    description: "See a live before/after preview with a draggable slider to compare original vs compressed quality.",
    icon: Archive,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Download your compressed PNG instantly. See exactly how much space you saved.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

// Available output formats for PNG
const PNG_OUTPUT_FORMATS = [
  { id: "png", name: "PNG", extension: "png", category: "Image", description: "Transparent image" },
  { id: "jpg", name: "JPG / JPEG", extension: "jpg", category: "Image", description: "Standard photo" },
  { id: "webp", name: "WEBP", extension: "webp", category: "Image", description: "Modern web" },
  { id: "gif", name: "GIF", extension: "gif", category: "Image", description: "Animation" },
  { id: "bmp", name: "BMP", extension: "bmp", category: "Image", description: "Bitmap" },
  { id: "tiff", name: "TIFF", extension: "tiff", category: "Image", description: "High quality" },
  { id: "avif", name: "AVIF", extension: "avif", category: "Image", description: "Next-gen format" },
];

interface CompressPNGPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function CompressPNGPage({ onWorkStateChange }: CompressPNGPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrls, setDownloadUrls] = useState<Array<{ url: string; fileName: string; originalSize: number; compressedSize: number }>>([]);
  const [compressionLevel, setCompressionLevel] = useState(80); // Default: 80% (0-100 scale)
  const [outputFormat, setOutputFormat] = useState("png"); // Default: PNG
  const [outputFileName, setOutputFileName] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [sliderPosition, setSliderPosition] = useState(50); // For before/after slider
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Format dropdown state
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [formatSearchQuery, setFormatSearchQuery] = useState("");
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Get selected format details
  const selectedFormat = PNG_OUTPUT_FORMATS.find(f => f.id === outputFormat) || PNG_OUTPUT_FORMATS[0];

  // Filter formats based on search
  const filteredFormats = PNG_OUTPUT_FORMATS.filter(format =>
    format.name.toLowerCase().includes(formatSearchQuery.toLowerCase()) ||
    format.description.toLowerCase().includes(formatSearchQuery.toLowerCase())
  );

  // Update filename when format changes or file is uploaded
  useEffect(() => {
    if (files.length === 1) {
      const baseName = files[0].name.replace(/\.png$/i, '');
      const ext = selectedFormat.extension;
      setOutputFileName(`${baseName}_compressed.${ext}`);
    }
  }, [outputFormat, files, selectedFormat]);

  // Create image preview URL when file is uploaded
  useEffect(() => {
    if (files.length === 1) {
      const url = URL.createObjectURL(files[0]);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [files]);
  
  // Related tools for this page
  const relatedTools = [
    {
      name: "Compress Image",
      description: "Compress any image format",
      icon: Archive,
      onClick: () => window.location.href = "/compress-image",
    },
    {
      name: "Compress JPG",
      description: "Compress JPG images only",
      icon: Archive,
      onClick: () => window.location.href = "/compress-jpg",
    },
    {
      name: "PNG to JPG",
      description: "Convert PNG images to JPG format",
      icon: FileType,
      onClick: () => window.location.href = "/png-to-jpg",
    },
    {
      name: "PNG to WEBP",
      description: "Convert PNG to modern WEBP format",
      icon: RefreshCw,
      onClick: () => window.location.href = "/png-to-webp",
    },
    {
      name: "Resize Image",
      description: "Change image dimensions and resolution",
      icon: Maximize2,
      onClick: () => window.location.href = "/resize-image",
    },
    {
      name: "Crop Image",
      description: "Crop and trim your images",
      icon: Crop,
      onClick: () => window.location.href = "/crop-image",
    },
    {
      name: "Rotate Image",
      description: "Rotate and flip images",
      icon: RotateCw,
      onClick: () => window.location.href = "/rotate-image",
    },
    {
      name: "Edit Image",
      description: "Advanced image editing tools",
      icon: FileEdit,
      onClick: () => window.location.href = "/edit-image",
    },
    {
      name: "Image to PDF",
      description: "Convert images to PDF documents",
      icon: FileText,
      onClick: () => window.location.href = "/image-to-pdf",
    },
    {
      name: "Compress PDF",
      description: "Reduce PDF file sizes",
      icon: Archive,
      onClick: () => window.location.href = "/compress-pdf",
    },
  ];

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

  // Handle slider drag for before/after comparison
  const handleSliderDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleSliderMouseDown = () => setIsDragging(true);
  const handleSliderMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percentage);
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Handle file selection with PNG validation
  const handleFilesSelected = async (newFiles: File[]) => {
    const maxFiles = 1; // Only one file at a time
    const maxFileSize = 50; // MB
    
    // Clear previous validation messages
    setValidationMessage("");
    
    // Take only the first file
    const fileToAdd = newFiles[0];
    if (!fileToAdd) return;
    
    // Validate file type (PNG only)
    const ext = '.' + fileToAdd.name.split('.').pop()?.toLowerCase();
    if (ext !== '.png') {
      setValidationMessage(`Only PNG files are allowed.`);
      setValidationType("error");
      return;
    }
    
    // Validate file size
    if (fileToAdd.size > maxFileSize * 1024 * 1024) {
      setValidationMessage(`File exceeds ${maxFileSize}MB limit.`);
      setValidationType("error");
      return;
    }
    
    // Replace existing file
    setFiles([fileToAdd]);

    // Create validation info
    const newValidationInfo: FileValidationInfo = {
      file: fileToAdd,
      isValidating: true,
      isValid: false,
      pageCount: 0,
    };
    
    setFileValidationInfo([newValidationInfo]);

    // Validate the image file
    try {
      // Get image info
      const imageInfo = await getImageInfo(fileToAdd);
      
      // Update validation info
      setFileValidationInfo([{
        file: fileToAdd,
        isValidating: false,
        isValid: imageInfo.isValid,
        pageCount: 1, // Images always have 1 "page"
        error: imageInfo.error,
      }]);

      // Auto-advance to edit mode if valid
      if (imageInfo.isValid) {
        setCurrentStep("edit");
      }
    } catch (error) {
      // Handle unexpected errors
      setFileValidationInfo([{
        file: fileToAdd,
        isValidating: false,
        isValid: false,
        pageCount: 0,
        error: "Failed to read PNG file",
      }]);
    }
  };

  // Remove file and go back to upload
  const handleRemoveFile = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
    setCurrentStep("upload");
  };

  // Go back to upload
  const handleBackToUpload = () => {
    handleRemoveFile();
  };

  // Process file (compress PNG)
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setProgress(i);
    }
    
    const file = files[0];
    
    // Calculate simulated compressed size based on compression level
    // Higher compression level = smaller file
    const compressionRatio = 1 - (compressionLevel / 100) * 0.7; // 0% = no compression, 100% = 70% reduction
    const compressedSize = Math.floor(file.size * compressionRatio);
    
    // Determine output extension
    const ext = selectedFormat.extension;
    
    // Create a mock blob for download
    const mockImageContent = `Compressed PNG: ${file.name}\nOriginal Size: ${file.size} bytes\nCompressed Size: ${compressedSize} bytes\nCompression Level: ${compressionLevel}%`;
    const blob = new Blob([mockImageContent], { type: `image/${ext}` });
    const url = URL.createObjectURL(blob);
    
    setDownloadUrls([{
      url,
      fileName: outputFileName,
      originalSize: file.size,
      compressedSize,
    }]);

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
    setCompressionLevel(80);
    setOutputFormat("png");
    setSliderPosition(50);
  };

  // Check if we can process files (at least one valid file)
  const canProcess = fileValidationInfo.length > 0 && 
                     fileValidationInfo[0]?.isValid &&
                     !fileValidationInfo[0]?.isValidating;

  // Calculate total file size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Calculate estimated compressed size
  const estimatedCompressedSize = Math.floor(totalSize * (1 - (compressionLevel / 100) * 0.7));

  // Calculate if we should block navigation
  const hasUnsavedWork = files.length > 0 && currentStep !== "complete";

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/compress-png" />
      <ToolJsonLd path="/compress-png" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded a PNG file that hasn't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleReset}
      />

      {/* Success Header - Full Width at Top (only on complete step) */}
      {currentStep === "complete" && (
        <SuccessHeader
          title="PNG Compressed Successfully!"
          description="Your PNG image has been compressed and is ready to download"
        />
      )}

      {/* Header Section - Full Width Above Layout - Hide on Complete Step and Edit Step */}
      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Compress PNG" 
          description="Reduce PNG file size without losing quality. Optimize your PNG graphics with transparency support for faster sharing, storage, and web publishing — completely free and secure."
        />
      )}

      {/* Edit Step - Special Layout without side ads and without header */}
      {currentStep === "edit" ? (
        <EditPageLayout
          fullWidth={true}
          showInlineAd={true}
          onBack={handleBackToUpload}
          totalPages={1}
          totalSize={formatFileSize(totalSize)}
          sidebar={
            <>
              {/* File Info Card - Simplified Version */}
              <div className="bg-white rounded-lg p-3 border border-gray-200 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate" title={files[0]?.name}>
                      {files[0]?.name.length > 20 ? files[0]?.name.substring(0, 20) + '...' : files[0]?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {files[0]?.type.split('/')[1]?.toUpperCase()} · {formatFileSize(files[0]?.size || 0)}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors flex-shrink-0"
                    title="Remove PNG"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Header with Title and Replace Button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Compress Settings</h3>
                
                {/* Replace Files Button */}
                <input
                  type="file"
                  id="replaceFiles"
                  accept=".png"
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
                  className="gap-1.5 text-xs h-8 bg-purple-500 hover:bg-purple-600 text-white border-purple-500 hover:border-purple-600 transition-colors"
                  onClick={() => document.getElementById('replaceFiles')?.click()}
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  Replace Files
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Compression Level */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Compression Level</h4>
                    <span className="text-sm font-bold text-purple-600">{compressionLevel}%</span>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Slider
                        value={[compressionLevel]}
                        onValueChange={(value) => setCompressionLevel(value[0])}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 bg-purple-50 p-3 rounded">
                      {compressionLevel === 0 && "No compression - Original quality"}
                      {compressionLevel > 0 && compressionLevel <= 25 && "Low Compression: Best quality, larger file size"}
                      {compressionLevel > 25 && compressionLevel <= 50 && "Medium Compression: Balanced quality and size"}
                      {compressionLevel > 50 && compressionLevel <= 75 && "High Compression: Smaller size, good quality"}
                      {compressionLevel > 75 && "Maximum Compression: Smallest size, acceptable quality"}
                    </p>
                  </div>
                </div>

                {/* Output Format - Dropdown */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Output Format</h4>
                  <div className="relative">
                    <button
                      onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{selectedFormat.name}</div>
                        <div className="text-xs text-gray-500">{selectedFormat.description}</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isFormatDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isFormatDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-purple-200 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden flex flex-col">
                        {/* Search Box */}
                        <div className="p-2 border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search formats..."
                              value={formatSearchQuery}
                              onChange={(e) => setFormatSearchQuery(e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-purple-400"
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Format List */}
                        <div className="overflow-y-auto max-h-64 custom-scrollbar">
                          {filteredFormats.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              No formats found
                            </div>
                          ) : (
                            filteredFormats.map((format) => (
                              <button
                                key={format.id}
                                onClick={() => {
                                  setOutputFormat(format.id);
                                  setIsFormatDropdownOpen(false);
                                  setFormatSearchQuery("");
                                }}
                                className={`w-full px-3 py-2 text-left hover:bg-purple-50 transition-colors flex items-center justify-between ${
                                  outputFormat === format.id ? 'bg-purple-100' : ''
                                }`}
                              >
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{format.name}</div>
                                  <div className="text-xs text-gray-500">{format.description}</div>
                                </div>
                                {outputFormat === format.id && (
                                  <Check className="w-4 h-4 text-purple-600" />
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Output Settings */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Output Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="outputFileName" className="text-xs text-gray-600 mb-2 block">
                        Filename Pattern
                      </Label>
                      <Input
                        id="outputFileName"
                        type="text"
                        value={outputFileName}
                        onChange={(e) => setOutputFileName(e.target.value)}
                        placeholder="compressed"
                        className="text-sm bg-purple-50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      />
                      <p className="text-xs text-gray-500 mt-1">Files will be named: {outputFileName}</p>
                    </div>

                    {/* Size Info */}
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Original Size:</span>
                        <span className="font-medium text-gray-900">{formatFileSize(totalSize)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Estimated Size:</span>
                        <span className="font-medium text-purple-600">{formatFileSize(estimatedCompressedSize)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Space Saved:</span>
                        <span className="font-medium text-green-600">
                          ~{Math.round((1 - estimatedCompressedSize / totalSize) * 100)}%
                        </span>
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
                  disabled={!canProcess}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Compress PNG
                </GradientButton>
              </div>
            </>
          }
        >
          {/* Before/After Image Preview with Slider */}
          <div className="border-2 border-pink-200 rounded-lg p-6 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {/* Before/After Preview with Slider */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {imagePreviewUrl ? (
                  <div
                    ref={sliderRef}
                    className="relative w-full h-full cursor-ew-resize select-none"
                    onMouseDown={handleSliderMouseDown}
                    onMouseUp={handleSliderMouseUp}
                    onMouseMove={(e) => isDragging && handleSliderDrag(e)}
                    onTouchStart={handleSliderMouseDown}
                    onTouchEnd={handleSliderMouseUp}
                    onTouchMove={(e) => isDragging && handleSliderDrag(e)}
                  >
                    {/* Base Image - Full container (this will be the compressed "After" side) */}
                    <div className="absolute inset-0">
                      <img
                        src={imagePreviewUrl}
                        alt="Compressed (After)"
                        className="w-full h-full object-contain"
                        style={{ 
                          filter: `blur(${compressionLevel / 100 * 3}px) brightness(${1 - compressionLevel / 100 * 0.15})`,
                          imageRendering: compressionLevel > 50 ? 'auto' : 'high-quality'
                        }}
                      />
                      {/* After Label - Right Side */}
                      <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                        After ({compressionLevel}%)
                      </div>
                    </div>

                    {/* Original Image - Clipped by slider position (this will be the "Before" side) */}
                    <div
                      className="absolute top-0 left-0 bottom-0 overflow-hidden"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <div className="absolute inset-0" style={{ width: `${sliderRef.current?.offsetWidth || 100}px` }}>
                        <img
                          src={imagePreviewUrl}
                          alt="Original (Before)"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {/* Before Label - Left Side */}
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                        Before (Original)
                      </div>
                    </div>

                    {/* Slider Line & Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl cursor-ew-resize z-10"
                      style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    >
                      {/* Slider Handle */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-purple-500 cursor-ew-resize hover:scale-110 transition-transform">
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-4 bg-purple-500 rounded-full"></div>
                          <div className="w-0.5 h-4 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                      <p className="text-sm">Loading preview...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Helper Text */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <strong>Tip:</strong> Drag the slider left and right to compare the original and compressed versions. 
                  Adjust the compression level above to see real-time changes. PNG supports transparency!
                </p>
              </div>
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
                acceptedTypes=".png"
                multiple={false}
                maxFiles={1}
                maxFileSize={50}
                fileTypeLabel="PNG"
                helperText="PNG · 1 file · 50MB max"
                validationMessage={validationMessage}
                validationType={validationType}
              />

              {/* Show uploaded file with validation status */}
              {files.length > 0 && fileValidationInfo.length > 0 && (
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {files[0].name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(files[0].size)}
                      </p>
                    </div>
                    {fileValidationInfo[0].isValidating && (
                      <div className="text-xs text-gray-500">Validating...</div>
                    )}
                    {!fileValidationInfo[0].isValidating && fileValidationInfo[0].isValid && (
                      <div className="text-xs text-green-600 font-medium">✓ Ready</div>
                    )}
                    {!fileValidationInfo[0].isValidating && !fileValidationInfo[0].isValid && (
                      <div className="text-xs text-red-600 font-medium">✗ Invalid</div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: Processing - Modal */}
          {currentStep === "processing" && (
            <>
              {/* Processing Modal */}
              <ProcessingModal
                isOpen={currentStep === "processing"}
                progress={progress}
                title="Compressing PNG..."
                description="Please wait while we compress your PNG image"
                icon={Archive}
              />

              {/* Show Related Tools during processing */}
              <RelatedToolsSection 
                tools={relatedTools}
                introText="These tools work well with PNG compression and help you manage or convert your images."
              />
            </>
          )}

          {/* STEP 3: Download */}
          {currentStep === "complete" && (
            <CompressSuccessSection
              files={downloadUrls}
              onReset={handleReset}
              resetButtonText="Compress Another PNG"
              title="PNG Compressed Successfully!"
              description="Your PNG image has been compressed and is ready to download"
              icon={Archive}
            />
          )}
        </div>

        {/* Related Tools Section - Show on complete step */}
        {currentStep === "complete" && (
          <RelatedToolsSection 
            tools={relatedTools}
            introText="Continue working with your PNG images or explore other powerful tools."
          />
        )}

        {/* Only show these sections if NOT on complete step */}
        {currentStep !== "complete" && (
          <>
            {/* Related Tools Section - Now inside layout, fits between ads */}
            <RelatedToolsSection 
              tools={relatedTools}
              introText="These tools work well with PNG compression and help you manage or convert your images."
            />

            {/* Tool Definition Section - Now inside layout, fits between ads */}
            <ToolDefinitionSection
              title="What Is PNG Compression?"
              content="PNG compression reduces the file size of PNG images by optimizing encoding and removing unnecessary data while preserving transparency. PNG is the most popular format for graphics, logos, and images requiring transparency. WorkflowPro processes your PNG files quickly while maintaining excellent visual quality, transparency support, and complete privacy."
            />

            {/* How to Use Section - Now inside layout, fits between ads */}
            <HowItWorksSteps 
              title="How It Works"
              subtitle="Compress your PNG file in four simple steps with our intuitive interface"
              introText="Follow these simple steps to reduce your PNG file size quickly and securely."
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
              title="Popular Uses for Compressing PNG Images"
              useCases={[
                "Optimize PNG logos and graphics for faster website loading",
                "Reduce email attachment sizes while preserving transparency",
                "Prepare PNG images for social media without losing quality",
                "Save storage space on your device or cloud storage",
                "Compress product images with transparent backgrounds",
                "Optimize blog post graphics for better SEO performance",
                "Reduce bandwidth usage for PNG image galleries",
                "Prepare transparent PNG images for mobile apps",
              ]}
            />

            {/* Tool FAQ Section - Now inside layout, fits between ads */}
            <ToolFAQSection
              faqs={[
                {
                  question: "How much can I compress PNG images?",
                  answer: "PNG compression is very effective. At 80% compression, most PNG images reduce by 50-70% while maintaining excellent visual quality and full transparency support. Higher compression levels save more space but may introduce visible artifacts. Results depend on the complexity of the original image.",
                },
                {
                  question: "Will compression affect PNG transparency?",
                  answer: "No! PNG compression preserves transparency perfectly. Your transparent backgrounds and alpha channels remain intact regardless of compression level. This makes it ideal for logos, icons, and graphics.",
                },
                {
                  question: "What's the difference between compression levels?",
                  answer: "0% = No compression (original quality). 25% = Light compression with minimal quality loss. 50% = Balanced compression. 75% = High compression with good quality. 100% = Maximum compression with acceptable quality for web use. We recommend 70-85% for most graphics.",
                },
                {
                  question: "Can I convert PNG to other formats?",
                  answer: "Yes! You can convert PNG to JPG (for smaller file size without transparency), WEBP (for better compression), GIF, BMP, TIFF, or AVIF during compression. Just select your desired output format from the dropdown.",
                },
                {
                  question: "Can I see the quality before downloading?",
                  answer: "Yes! Our before/after slider lets you compare the original and compressed versions in real-time. Drag the slider to see the exact quality difference before downloading.",
                },
                {
                  question: "Is there a file size limit?",
                  answer: "Yes, the maximum file size is 50MB per PNG image. You can compress one PNG at a time to ensure optimal quality and performance.",
                },
                {
                  question: "Are my PNG files secure during compression?",
                  answer: "Yes, all compression happens locally in your browser. PNG files are never uploaded to our servers, ensuring complete privacy.",
                },
                {
                  question: "What's the best compression level for PNG?",
                  answer: "For most PNG graphics, we recommend 70-85% compression. This provides excellent file size reduction while maintaining high visual quality and transparency. For web use, 80-90% works well. For print quality, stick to 50-70%.",
                },
                {
                  question: "Is WorkflowPro's PNG compression free?",
                  answer: "Yes — completely free with no watermarks, no limits, and no registration required.",
                },
              ]}
            />

            {/* SEO Footer - Now inside layout, fits between ads */}
            <ToolSEOFooter
              title="About WorkflowPro's Compress PNG Tool"
              content="WorkflowPro's Compress PNG tool helps you reduce PNG file sizes quickly and securely with a live before/after preview while preserving transparency. Perfect for graphic designers, web developers, and anyone working with PNG images. Adjustable compression levels (0-100%) with format conversion support. Choose your quality settings, see real-time previews, maintain transparency, and save storage space — fast, simple, and always free."
            />
          </>
        )}
      </ToolPageLayout>
      )}
    </>
  );
}