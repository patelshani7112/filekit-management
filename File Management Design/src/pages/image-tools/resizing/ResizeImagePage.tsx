/**
 * Resize Image Page
 * 
 * Purpose: Allow users to resize a single image file with live preview
 * 
 * Features:
 * - Upload single image file (JPG, PNG, WEBP, GIF, BMP, TIFF)
 * - Live before/after preview
 * - Custom width and height inputs
 * - Maintain aspect ratio toggle
 * - Preset dimension options (Instagram, Facebook, Twitter, etc.)
 * - Percentage scaling
 * - Format conversion dropdown
 * - Process files with realistic progress
 * - Download resized image
 * 
 * How it works:
 * 1. User uploads image file
 * 2. Live preview shows original dimensions
 * 3. User sets new dimensions or selects preset
 * 4. User selects output format (defaults to original)
 * 5. User clicks "Resize Image"
 * 6. File is processed (simulated)
 * 7. User downloads the resized image
 */

import { useState, useEffect } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import {
  ToolPageLayout,
  ToolPageHero,
  FileUploader,
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
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { GradientButton } from "../../../components/ui/gradient-button";
import { 
  Upload, Download, X, FilePlus, ImageIcon, Maximize2, Archive, FileEdit,
  RefreshCw, FileType, FileText, RotateCw, Crop, ChevronDown, Search, Check,
  Maximize, Lock, Unlock
} from "lucide-react";

// How it works steps for this tool
const STEPS = [
  {
    number: 1,
    title: "Upload Your Image",
    description: "Select an image file from your device or drag and drop it into the upload area.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Set New Dimensions",
    description: "Enter custom width and height, use presets, or scale by percentage. Toggle aspect ratio lock.",
    icon: Maximize2,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Preview Changes",
    description: "See a live preview of your resized image with new dimensions displayed.",
    icon: Maximize,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Download your resized image instantly in your preferred format.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

// All available image output formats
const IMAGE_OUTPUT_FORMATS = [
  { id: "original", name: "Keep Original", extension: "original", category: "Default", description: "No conversion" },
  { id: "jpg", name: "JPG / JPEG", extension: "jpg", category: "Image", description: "Standard photo" },
  { id: "png", name: "PNG", extension: "png", category: "Image", description: "Transparent image" },
  { id: "webp", name: "WEBP", extension: "webp", category: "Image", description: "Modern web" },
  { id: "gif", name: "GIF", extension: "gif", category: "Image", description: "Animation" },
  { id: "bmp", name: "BMP", extension: "bmp", category: "Image", description: "Bitmap" },
  { id: "tiff", name: "TIFF", extension: "tiff", category: "Image", description: "High quality" },
];

// Dimension presets
const DIMENSION_PRESETS = [
  { name: "Instagram Post", width: 1080, height: 1080, description: "1:1 Square" },
  { name: "Instagram Story", width: 1080, height: 1920, description: "9:16 Vertical" },
  { name: "Facebook Post", width: 1200, height: 630, description: "1.91:1" },
  { name: "Twitter Post", width: 1200, height: 675, description: "16:9" },
  { name: "YouTube Thumbnail", width: 1280, height: 720, description: "16:9 HD" },
  { name: "LinkedIn Post", width: 1200, height: 627, description: "1.91:1" },
  { name: "HD 720p", width: 1280, height: 720, description: "16:9" },
  { name: "HD 1080p", width: 1920, height: 1080, description: "16:9" },
  { name: "4K", width: 3840, height: 2160, description: "16:9" },
];

interface ResizeImagePageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function ResizeImagePage({ onWorkStateChange }: ResizeImagePageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrls, setDownloadUrls] = useState<Array<{ url: string; fileName: string; originalSize: number; compressedSize: number }>>([]);
  const [outputFormat, setOutputFormat] = useState("original");
  const [outputFileName, setOutputFileName] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  
  // Original image dimensions
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  
  // New dimensions
  const [newWidth, setNewWidth] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [scalePercentage, setScalePercentage] = useState(100);
  
  // Format dropdown state
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [formatSearchQuery, setFormatSearchQuery] = useState("");
  
  // Presets dropdown state
  const [isPresetsDropdownOpen, setIsPresetsDropdownOpen] = useState(false);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Get selected format details
  const selectedFormat = IMAGE_OUTPUT_FORMATS.find(f => f.id === outputFormat) || IMAGE_OUTPUT_FORMATS[0];

  // Filter formats based on search
  const filteredFormats = IMAGE_OUTPUT_FORMATS.filter(format =>
    format.name.toLowerCase().includes(formatSearchQuery.toLowerCase()) ||
    format.description.toLowerCase().includes(formatSearchQuery.toLowerCase())
  );

  // Update filename when format changes or file is uploaded
  useEffect(() => {
    if (files.length === 1) {
      const baseName = files[0].name.replace(/\.(jpg|jpeg|png|webp|gif|bmp|tiff|svg|ico|heic|avif)$/i, '');
      const ext = outputFormat === "original" 
        ? files[0].name.split('.').pop()?.toLowerCase() 
        : selectedFormat.extension;
      setOutputFileName(`${baseName}_resized.${ext}`);
    }
  }, [outputFormat, files, selectedFormat]);

  // Create image preview URL when file is uploaded
  useEffect(() => {
    if (files.length === 1) {
      const url = URL.createObjectURL(files[0]);
      setImagePreviewUrl(url);
      
      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setNewWidth(img.width);
        setNewHeight(img.height);
      };
      img.src = url;
      
      return () => URL.revokeObjectURL(url);
    }
  }, [files]);
  
  // Related tools for this page
  const relatedTools = [
    {
      name: "Compress Image",
      description: "Reduce image file sizes",
      icon: Archive,
      onClick: () => window.location.href = "/compress-image",
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
      name: "Convert Image",
      description: "Convert between image formats",
      icon: RefreshCw,
      onClick: () => window.location.href = "/convert-image",
    },
    {
      name: "Edit Image",
      description: "Advanced image editing tools",
      icon: FileEdit,
      onClick: () => window.location.href = "/edit-image",
    },
    {
      name: "JPG to PNG",
      description: "Convert JPG images to PNG format",
      icon: FileType,
      onClick: () => window.location.href = "/jpg-to-png",
    },
    {
      name: "PNG to JPG",
      description: "Convert PNG images to JPG format",
      icon: FileType,
      onClick: () => window.location.href = "/png-to-jpg",
    },
    {
      name: "Image to PDF",
      description: "Convert images to PDF documents",
      icon: FileText,
      onClick: () => window.location.href = "/image-to-pdf",
    },
  ];

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

  // Handle width change
  const handleWidthChange = (value: number) => {
    setNewWidth(value);
    if (maintainAspectRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setNewHeight(Math.round(value * ratio));
    }
    // Update percentage
    if (originalWidth > 0) {
      setScalePercentage(Math.round((value / originalWidth) * 100));
    }
  };

  // Handle height change
  const handleHeightChange = (value: number) => {
    setNewHeight(value);
    if (maintainAspectRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setNewWidth(Math.round(value * ratio));
    }
    // Update percentage
    if (originalHeight > 0) {
      setScalePercentage(Math.round((value / originalHeight) * 100));
    }
  };

  // Handle percentage change
  const handlePercentageChange = (value: number) => {
    setScalePercentage(value);
    setNewWidth(Math.round((originalWidth * value) / 100));
    setNewHeight(Math.round((originalHeight * value) / 100));
  };

  // Apply preset dimensions
  const applyPreset = (preset: typeof DIMENSION_PRESETS[0]) => {
    setNewWidth(preset.width);
    setNewHeight(preset.height);
    setMaintainAspectRatio(false);
    // Update percentage based on width
    if (originalWidth > 0) {
      setScalePercentage(Math.round((preset.width / originalWidth) * 100));
    }
  };

  // Handle file selection with image validation
  const handleFilesSelected = async (newFiles: File[]) => {
    const maxFileSize = 50; // MB
    
    // Clear previous validation messages
    setValidationMessage("");
    
    // Take only the first file
    const fileToAdd = newFiles[0];
    if (!fileToAdd) return;
    
    // Validate file type (images only)
    const ext = '.' + fileToAdd.name.split('.').pop()?.toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'].includes(ext)) {
      setValidationMessage(`Only image files are allowed.`);
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
        pageCount: 1,
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
        error: "Failed to read image file",
      }]);
    }
  };

  // Remove file and go back to upload
  const handleRemoveFile = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
    setCurrentStep("upload");
    setScalePercentage(100);
  };

  // Go back to upload
  const handleBackToUpload = () => {
    handleRemoveFile();
  };

  // Process file (resize image)
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setProgress(i);
    }
    
    const file = files[0];
    
    // Calculate simulated resized size (estimate based on dimension change)
    const dimensionRatio = (newWidth * newHeight) / (originalWidth * originalHeight);
    const resizedSize = Math.floor(file.size * dimensionRatio);
    
    // Determine output extension
    const ext = outputFormat === "original" 
      ? file.name.split('.').pop()?.toLowerCase() 
      : selectedFormat.extension;
    
    // Create a mock blob for download
    const mockImageContent = `Resized Image: ${file.name}\nOriginal Dimensions: ${originalWidth}x${originalHeight}\nNew Dimensions: ${newWidth}x${newHeight}\nOriginal Size: ${file.size} bytes\nResized Size: ${resizedSize} bytes`;
    const blob = new Blob([mockImageContent], { type: `image/${ext}` });
    const url = URL.createObjectURL(blob);
    
    setDownloadUrls([{
      url,
      fileName: outputFileName,
      originalSize: file.size,
      compressedSize: resizedSize,
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
    setOutputFormat("original");
    setScalePercentage(100);
  };

  // Check if we can process files (at least one valid file)
  const canProcess = fileValidationInfo.length > 0 && 
                     fileValidationInfo[0]?.isValid &&
                     !fileValidationInfo[0]?.isValidating &&
                     newWidth > 0 &&
                     newHeight > 0;

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
      <SeoHead path="/resize-image" />
      <ToolJsonLd path="/resize-image" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded a file that hasn't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleReset}
      />

      {/* Success Header - Full Width at Top (only on complete step) */}
      {currentStep === "complete" && (
        <SuccessHeader
          title="Image Resized Successfully!"
          description="Your image has been resized and is ready to download"
        />
      )}

      {/* Header Section - Full Width Above Layout - Hide on Complete Step and Edit Step */}
      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Resize Image" 
          description="Change image dimensions with precision. Resize by pixels or percentage, use presets for social media, maintain aspect ratio — completely free and secure."
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
              <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate" title={files[0]?.name}>
                      {files[0]?.name.length > 20 ? files[0]?.name.substring(0, 20) + '...' : files[0]?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {originalWidth} × {originalHeight} · {formatFileSize(files[0]?.size || 0)}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors flex-shrink-0"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Header with Title and Replace Button */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Resize Settings</h3>
                
                {/* Replace Files Button */}
                <input
                  type="file"
                  id="replaceFiles"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff"
                  className="hidden"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    if (newFiles.length > 0) {
                      handleFilesSelected(newFiles);
                    }
                    e.target.value = ''; // Reset input
                  }}
                />
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-purple-400 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium transition-all"
                  onClick={() => document.getElementById('replaceFiles')?.click()}
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  Replace File
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Original Dimensions Info */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Original Dimensions</p>
                  <p className="font-bold text-gray-900">{originalWidth} × {originalHeight} px</p>
                  <p className="text-xs text-gray-500 mt-1">Aspect Ratio: {(originalWidth / originalHeight).toFixed(2)}:1</p>
                </div>

                {/* Custom Dimensions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Custom Dimensions</Label>
                    <button
                      onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 border-dashed text-xs font-medium transition-all hover:border-gray-400 ${
                        maintainAspectRatio 
                          ? "border-gray-300 bg-gray-50 text-gray-700" 
                          : "border-gray-300 bg-white text-gray-600"
                      }`}
                      title={maintainAspectRatio ? "Click to unlock aspect ratio" : "Click to lock aspect ratio"}
                    >
                      {maintainAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{maintainAspectRatio ? "Keep Proportions" : "Free Resize"}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="newWidth" className="text-xs text-gray-600 mb-1 block">
                        Width (px)
                      </Label>
                      <Input
                        id="newWidth"
                        type="number"
                        value={newWidth}
                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                        min={1}
                        className="text-sm h-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newHeight" className="text-xs text-gray-600 mb-1 block">
                        Height (px)
                      </Label>
                      <Input
                        id="newHeight"
                        type="number"
                        value={newHeight}
                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                        min={1}
                        className="text-sm h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Scale by Percentage */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Scale by Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={scalePercentage}
                      onChange={(e) => handlePercentageChange(Number(e.target.value))}
                      min={1}
                      max={1000}
                      className="text-sm h-9 flex-1"
                    />
                    <span className="text-sm font-medium text-gray-700">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">100% = original size</p>
                </div>

                {/* Dimension Presets */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Presets</Label>
                  <div className="relative">
                    <button
                      onClick={() => setIsPresetsDropdownOpen(!isPresetsDropdownOpen)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-purple-400 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Select Preset</div>
                        <div className="text-xs text-gray-500">Choose from popular presets</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isPresetsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isPresetsDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-purple-200 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden">
                        {/* Preset List */}
                        <div className="overflow-y-auto max-h-64 custom-scrollbar">
                          {DIMENSION_PRESETS.map((preset, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                applyPreset(preset);
                                setIsPresetsDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-purple-50 transition-colors"
                            >
                              <div className="text-sm font-medium text-gray-900">{preset.name}</div>
                              <div className="text-xs text-gray-500">{preset.width} × {preset.height} • {preset.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Output Format - Dropdown */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Output Format</Label>
                  <div className="relative">
                    <button
                      onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-purple-400 transition-colors flex items-center justify-between text-left"
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

                {/* Output Filename */}
                <div>
                  <Label htmlFor="outputFileName" className="text-sm font-medium mb-2 block">
                    Filename Pattern
                  </Label>
                  <Input
                    id="outputFileName"
                    type="text"
                    value={outputFileName}
                    onChange={(e) => setOutputFileName(e.target.value)}
                    placeholder="resized"
                    className="text-sm h-9"
                  />
                  <p className="text-xs text-gray-500 mt-1">File will be named: {outputFileName}</p>
                </div>

                {/* Resize Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!canProcess}
                >
                  <Maximize2 className="w-5 h-5 mr-2" />
                  Resize Image
                </GradientButton>
              </div>
            </>
          }
        >
          {/* Main Preview Area */}
          <div className="space-y-4">
            {/* Preview Image */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 flex items-center justify-center min-h-[400px] relative overflow-hidden">
              <div 
                className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-md z-10"
              >
                <p className="text-xs text-gray-600">Preview</p>
                <p className="text-sm font-bold text-purple-600">{newWidth} × {newHeight} px</p>
              </div>
              
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{
                    maxHeight: '500px',
                    width: 'auto',
                    height: 'auto',
                  }}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Loading preview...</p>
                </div>
              )}
            </div>
          </div>
        </EditPageLayout>
      ) : (
        <ToolPageLayout>
          {currentStep === "upload" && <MobileStickyAd topOffset={64} height={100} />}

          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            {currentStep === "upload" && (
              <>
                <FileUploader
                  onFilesSelected={handleFilesSelected}
                  acceptedTypes="image/*"
                  multiple={false}
                  maxFiles={1}
                  maxFileSize={50}
                  fileTypeLabel="Image"
                  helperText="JPG, PNG, GIF, WEBP, BMP, TIFF · 1 file · 50MB max"
                  validationMessage={validationMessage}
                  validationType={validationType}
                />

                {files.length > 0 && fileValidationInfo.length > 0 && (
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{files[0].name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(files[0].size)}</p>
                      </div>
                      {fileValidationInfo[0].isValidating && <div className="text-xs text-gray-500">Validating...</div>}
                      {!fileValidationInfo[0].isValidating && fileValidationInfo[0].isValid && <div className="text-xs text-green-600 font-medium">✓ Ready</div>}
                      {!fileValidationInfo[0].isValidating && !fileValidationInfo[0].isValid && <div className="text-xs text-red-600 font-medium">✗ Invalid</div>}
                    </div>
                  </div>
                )}
              </>
            )}

            {currentStep === "processing" && (
              <>
                <ProcessingModal isOpen={true} progress={progress} title="Resizing Image..." description="Please wait while we resize your image" icon={Maximize2} />
                <RelatedToolsSection tools={relatedTools} introText="These tools work well with image resizing." />
              </>
            )}

            {currentStep === "complete" && (
              <CompressSuccessSection
                files={downloadUrls}
                onReset={handleReset}
                resetButtonText="Resize Another Image"
                title="Image Resized Successfully!"
                description="Your image has been resized and is ready to download"
                icon={Maximize2}
              />
            )}
          </div>

          {currentStep === "complete" && <RelatedToolsSection tools={relatedTools} introText="Continue working with your images." />}

          {currentStep !== "complete" && (
            <>
              <RelatedToolsSection tools={relatedTools} introText="These tools work well with image resizing." />
              <ToolDefinitionSection
                title="What Is Image Resizing?"
                content="Image resizing allows you to change the dimensions (width and height) of your images while maintaining quality. Perfect for social media, web publishing, email attachments, or reducing file size — completely free, secure, and private."
              />
              <HowItWorksSteps title="How It Works" subtitle="Resize your image in four simple steps" introText="Follow these steps to resize your image quickly and securely." steps={STEPS} />
              <WhyChooseSection title={WHY_CHOOSE_WORKFLOWPRO.title} subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} introText={WHY_CHOOSE_WORKFLOWPRO.introText} features={WHY_CHOOSE_WORKFLOWPRO.features} />
              <UseCasesSection
                title="Popular Uses for Image Resizing"
                useCases={[
                  "Resize images for social media (Instagram, Facebook, Twitter)",
                  "Reduce image dimensions for faster website loading",
                  "Create thumbnails from large images",
                  "Fit images to specific size requirements",
                  "Scale images for email attachments",
                  "Prepare images for printing at specific sizes",
                  "Optimize images for mobile devices",
                  "Batch resize product photos for e-commerce",
                  "Create consistent image sizes for galleries",
                ]}
              />
              <ToolFAQSection
                faqs={[
                  { question: "What image formats can I resize?", answer: "You can resize JPG, PNG, WEBP, GIF, BMP, and TIFF images with a 50MB max file size." },
                  { question: "Can I maintain the aspect ratio?", answer: "Yes! Toggle the aspect ratio lock to automatically adjust height when you change width (and vice versa)." },
                  { question: "What are the dimension presets?", answer: "We offer popular presets for Instagram, Facebook, Twitter, YouTube, LinkedIn, and standard HD/4K sizes for quick resizing." },
                  { question: "Can I resize by percentage?", answer: "Yes! Use the percentage scale option to resize relative to the original size (e.g., 50% = half size, 200% = double size)." },
                  { question: "Does resizing reduce quality?", answer: "Scaling down (making smaller) preserves quality well. Scaling up (making larger) may reduce sharpness." },
                  { question: "Is my image uploaded to a server?", answer: "No — all resizing happens locally in your browser. Your files never leave your device." },
                ]}
              />
              <ToolSEOFooter
                title="About WorkflowPro's Resize Image Tool"
                content="WorkflowPro's image resizer: change dimensions by pixels or percentage, maintain aspect ratio, use social media presets (Instagram, Facebook, Twitter, YouTube), convert formats, live preview — perfect for web optimization, social media, email attachments. Fast, simple, always free."
              />
            </>
          )}
        </ToolPageLayout>
      )}
    </>
  );
}