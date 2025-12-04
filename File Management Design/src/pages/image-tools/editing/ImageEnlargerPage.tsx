/**
 * Image Enlarger Page
 * 
 * Purpose: Allow users to enlarge/upscale a single image file with AI enhancement
 * 
 * Features:
 * - Upload single image file (JPG, PNG, WEBP, GIF, BMP, TIFF)
 * - Live preview with current and target dimensions
 * - Multiple upscale options (2x, 3x, 4x, Custom)
 * - AI enhancement toggle for quality improvement
 * - Format conversion dropdown
 * - Process files with realistic progress
 * - Download enlarged high-quality image
 * 
 * How it works:
 * 1. User uploads image file
 * 2. Live preview shows original image with dimensions
 * 3. User selects upscale factor (2x, 3x, 4x, or custom)
 * 4. User optionally enables AI enhancement
 * 5. User clicks "Enlarge Image"
 * 6. File is processed (simulated with AI upscaling)
 * 7. User downloads the enlarged image
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
  ZoomIn, Sparkles, Info, TrendingUp, Zap
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
    title: "Choose Upscale Factor",
    description: "Select how much you want to enlarge your image: 2x, 3x, 4x, or enter a custom size.",
    icon: ZoomIn,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "AI Enhancement",
    description: "Our AI algorithm upscales your image while preserving quality and adding sharpness.",
    icon: Sparkles,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Download your enlarged high-quality image instantly in your preferred format.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

// All available image output formats
const IMAGE_OUTPUT_FORMATS = [
  { id: "original", name: "Keep Original", extension: "original", category: "Default", description: "No conversion" },
  { id: "png", name: "PNG", extension: "png", category: "Image", description: "High quality" },
  { id: "jpg", name: "JPG / JPEG", extension: "jpg", category: "Image", description: "Standard photo" },
  { id: "webp", name: "WEBP", extension: "webp", category: "Image", description: "Modern web format" },
  { id: "gif", name: "GIF", extension: "gif", category: "Image", description: "Animation support" },
  { id: "bmp", name: "BMP", extension: "bmp", category: "Image", description: "Bitmap format" },
  { id: "tiff", name: "TIFF", extension: "tiff", category: "Image", description: "Professional quality" },
];

// Upscale preset options
const UPSCALE_PRESETS = [
  { id: "2x", label: "2x (Double Size)", multiplier: 2 },
  { id: "3x", label: "3x (Triple Size)", multiplier: 3 },
  { id: "4x", label: "4x (Quadruple)", multiplier: 4 },
  { id: "custom", label: "Custom Size", multiplier: 0 },
];

interface ImageEnlargerPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function ImageEnlargerPage({ onWorkStateChange }: ImageEnlargerPageProps = {}) {
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
  
  // Upscale settings
  const [upscalePreset, setUpscalePreset] = useState("2x");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aiEnhancement, setAiEnhancement] = useState(true);
  
  // Format dropdown state
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [formatSearchQuery, setFormatSearchQuery] = useState("");
  
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

  // Calculate target dimensions based on preset or custom
  const getTargetDimensions = () => {
    if (upscalePreset === "custom") {
      const width = parseInt(customWidth) || originalWidth;
      const height = parseInt(customHeight) || originalHeight;
      return { width, height };
    }
    
    const preset = UPSCALE_PRESETS.find(p => p.id === upscalePreset);
    if (preset) {
      return {
        width: originalWidth * preset.multiplier,
        height: originalHeight * preset.multiplier,
      };
    }
    
    return { width: originalWidth, height: originalHeight };
  };

  const targetDimensions = getTargetDimensions();

  // Update custom dimensions when preset changes
  useEffect(() => {
    if (upscalePreset !== "custom" && originalWidth && originalHeight) {
      const preset = UPSCALE_PRESETS.find(p => p.id === upscalePreset);
      if (preset) {
        setCustomWidth(String(originalWidth * preset.multiplier));
        setCustomHeight(String(originalHeight * preset.multiplier));
      }
    }
  }, [upscalePreset, originalWidth, originalHeight]);

  // Handle custom width change with aspect ratio
  const handleCustomWidthChange = (value: string) => {
    setCustomWidth(value);
    if (maintainAspectRatio && originalWidth && originalHeight) {
      const width = parseInt(value) || 0;
      const height = Math.round((width / originalWidth) * originalHeight);
      setCustomHeight(String(height));
    }
  };

  // Handle custom height change with aspect ratio
  const handleCustomHeightChange = (value: string) => {
    setCustomHeight(value);
    if (maintainAspectRatio && originalWidth && originalHeight) {
      const height = parseInt(value) || 0;
      const width = Math.round((height / originalHeight) * originalWidth);
      setCustomWidth(String(width));
    }
  };

  // Update filename when format changes or file is uploaded
  useEffect(() => {
    if (files.length === 1) {
      const baseName = files[0].name.replace(/\.(jpg|jpeg|png|webp|gif|bmp|tiff|svg|ico|heic|avif)$/i, '');
      const ext = outputFormat === "original" 
        ? files[0].name.split('.').pop()?.toLowerCase() 
        : selectedFormat.extension;
      setOutputFileName(`${baseName}_enlarged.${ext}`);
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
        setCustomWidth(String(img.width * 2));
        setCustomHeight(String(img.height * 2));
      };
      img.src = url;
      
      return () => URL.revokeObjectURL(url);
    }
  }, [files]);
  
  // Related tools for this page
  const relatedTools = [
    {
      name: "Resize Image",
      description: "Change image dimensions",
      icon: Maximize2,
      onClick: () => window.location.href = "/resize-image",
    },
    {
      name: "Compress Image",
      description: "Reduce image file sizes",
      icon: Archive,
      onClick: () => window.location.href = "/compress-image",
    },
    {
      name: "Edit Image",
      description: "Advanced image editing tools",
      icon: FileEdit,
      onClick: () => window.location.href = "/edit-image",
    },
    {
      name: "Crop Image",
      description: "Crop and trim your images",
      icon: Crop,
      onClick: () => window.location.href = "/crop-image",
    },
    {
      name: "Remove Background",
      description: "AI background removal",
      icon: ZoomIn,
      onClick: () => window.location.href = "/remove-background",
    },
    {
      name: "Rotate Image",
      description: "Rotate and flip images",
      icon: RotateCw,
      onClick: () => window.location.href = "/rotate-image",
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
  ];

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

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
    setUpscalePreset("2x");
    setCustomWidth("");
    setCustomHeight("");
    setAiEnhancement(true);
  };

  // Go back to upload
  const handleBackToUpload = () => {
    handleRemoveFile();
  };

  // Process file (enlarge image)
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing with progress (longer for AI enhancement)
    const steps = aiEnhancement ? 80 : 40;
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, steps));
      setProgress(i);
    }
    
    const file = files[0];
    
    // Simulate larger file size after enlargement
    const sizeMultiplier = (targetDimensions.width * targetDimensions.height) / (originalWidth * originalHeight);
    const enlargedSize = Math.floor(file.size * sizeMultiplier * 1.2);
    
    // Determine output extension
    const ext = outputFormat === "original" 
      ? file.name.split('.').pop()?.toLowerCase() 
      : selectedFormat.extension;
    
    // Create a mock blob for download
    const mockImageContent = `Enlarged Image: ${file.name}\nOriginal: ${originalWidth}x${originalHeight}\nEnlarged: ${targetDimensions.width}x${targetDimensions.height}\nAI Enhancement: ${aiEnhancement ? 'Enabled' : 'Disabled'}\nOriginal Size: ${file.size} bytes\nEnlarged Size: ${enlargedSize} bytes`;
    const blob = new Blob([mockImageContent], { type: `image/${ext}` });
    const url = URL.createObjectURL(blob);
    
    setDownloadUrls([{
      url,
      fileName: outputFileName,
      originalSize: file.size,
      compressedSize: enlargedSize,
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
    setUpscalePreset("2x");
    setCustomWidth("");
    setCustomHeight("");
    setAiEnhancement(true);
  };

  // Check if we can process files (at least one valid file)
  const canProcess = fileValidationInfo.length > 0 && 
                     fileValidationInfo[0]?.isValid &&
                     !fileValidationInfo[0]?.isValidating &&
                     targetDimensions.width > 0 &&
                     targetDimensions.height > 0;

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
      <SeoHead path="/image-enlarger" />
      <ToolJsonLd path="/image-enlarger" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded a file that hasn't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleReset}
      />

      {/* Success Header - Full Width at Top (only on complete step) */}
      {currentStep === "complete" && (
        <SuccessHeader
          title="Image Enlarged Successfully!"
          description="Your high-quality enlarged image is ready to download"
        />
      )}

      {/* Header Section - Full Width Above Layout - Hide on Complete Step and Edit Step */}
      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Image Enlarger" 
          description="Enlarge and upscale images with AI enhancement. Increase resolution, improve quality, prepare images for print — completely free and secure."
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
                <h3 className="font-semibold">Upscale Settings</h3>
                
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
                {/* Dimension Comparison Card */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3 border-2 border-dashed border-purple-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Original Size</p>
                      <p className="text-sm font-bold text-gray-900">{originalWidth} × {originalHeight}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{(originalWidth * originalHeight / 1000000).toFixed(1)} MP</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Target Size</p>
                      <p className="text-sm font-bold text-purple-700">{targetDimensions.width} × {targetDimensions.height}</p>
                      <p className="text-xs text-purple-600 mt-0.5">{(targetDimensions.width * targetDimensions.height / 1000000).toFixed(1)} MP</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-purple-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Scale Factor:</span>
                      <span className="font-bold text-purple-700">
                        {((targetDimensions.width / originalWidth) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upscale Preset Options */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Upscale Preset</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {UPSCALE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setUpscalePreset(preset.id)}
                        className={`px-3 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-all ${
                          upscalePreset === preset.id
                            ? "border-purple-400 bg-purple-50 text-purple-700"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Dimensions */}
                {upscalePreset === "custom" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="customWidth" className="text-sm font-medium mb-1.5 block">
                        Custom Width (px)
                      </Label>
                      <Input
                        id="customWidth"
                        type="number"
                        value={customWidth}
                        onChange={(e) => handleCustomWidthChange(e.target.value)}
                        placeholder="Width in pixels"
                        className="text-sm h-9"
                        min={1}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customHeight" className="text-sm font-medium mb-1.5 block">
                        Custom Height (px)
                      </Label>
                      <Input
                        id="customHeight"
                        type="number"
                        value={customHeight}
                        onChange={(e) => handleCustomHeightChange(e.target.value)}
                        placeholder="Height in pixels"
                        className="text-sm h-9"
                        min={1}
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Maintain aspect ratio</span>
                    </label>
                  </div>
                )}

                {/* AI Enhancement Toggle */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiEnhancement}
                      onChange={(e) => setAiEnhancement(e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-bold text-purple-900">AI Enhancement</span>
                      </div>
                      <p className="text-xs text-purple-700 mt-1">
                        Use advanced AI to improve image quality, reduce noise, and enhance sharpness during upscaling.
                      </p>
                    </div>
                  </label>
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
                    placeholder="enlarged"
                    className="text-sm h-9"
                  />
                  <p className="text-xs text-gray-500 mt-1">File will be named: {outputFileName}</p>
                </div>

                {/* Enlarge Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!canProcess}
                >
                  <ZoomIn className="w-5 h-5 mr-2" />
                  Enlarge Image
                </GradientButton>

                {/* Tips Card */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-bold text-blue-900 mb-1">💡 Best Results</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Higher resolution originals produce better results</li>
                    <li>• AI enhancement improves quality significantly</li>
                    <li>• PNG format preserves maximum detail</li>
                  </ul>
                </div>
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
                <p className="text-sm font-bold text-purple-600">{originalWidth} × {originalHeight}</p>
              </div>

              <div 
                className="absolute top-4 right-4 bg-purple-100/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-md z-10 border-2 border-dashed border-purple-300"
              >
                <p className="text-xs text-purple-600">After Upscale</p>
                <p className="text-sm font-bold text-purple-700">{targetDimensions.width} × {targetDimensions.height}</p>
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

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-purple-900">Ready to Upscale</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Your image will be enlarged from {originalWidth}×{originalHeight} to {targetDimensions.width}×{targetDimensions.height}
                    {aiEnhancement && " with AI enhancement for superior quality"}. Perfect for printing, high-resolution displays, and professional use.
                  </p>
                </div>
              </div>
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
                  acceptedTypes=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff"
                  multiple={false}
                  maxFiles={1}
                  maxFileSize={50}
                  fileTypeLabel="Image"
                  helperText="JPG, PNG, WEBP, GIF, BMP, TIFF · 1 file · 50MB max"
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
                <ProcessingModal 
                  isOpen={true} 
                  progress={progress} 
                  title={aiEnhancement ? "Upscaling with AI Enhancement..." : "Upscaling Image..."} 
                  description={aiEnhancement ? "AI is enhancing quality and enlarging your image" : "Please wait while we enlarge your image"} 
                  icon={aiEnhancement ? Sparkles : ZoomIn} 
                />
                <RelatedToolsSection tools={relatedTools} introText="These tools work well with image enlargement." />
              </>
            )}

            {currentStep === "complete" && (
              <CompressSuccessSection
                files={downloadUrls}
                onReset={handleReset}
                resetButtonText="Enlarge Another Image"
                title="Image Enlarged Successfully!"
                description="Your high-quality enlarged image is ready to download"
                icon={ZoomIn}
              />
            )}
          </div>

          {currentStep === "complete" && <RelatedToolsSection tools={relatedTools} introText="Continue working with your images." />}

          {currentStep !== "complete" && (
            <>
              <RelatedToolsSection tools={relatedTools} introText="These tools work well with image enlargement." />
              <ToolDefinitionSection
                title="What Is Image Upscaling?"
                content="Image upscaling (enlarging) uses advanced AI algorithms to increase image resolution while preserving and even enhancing quality. Perfect for printing, high-resolution displays, professional photography, and design work — completely free, secure, and private."
              />
              <HowItWorksSteps title="How It Works" subtitle="Enlarge your image in four simple steps" introText="Follow these steps to upscale your image quickly and securely." steps={STEPS} />
              <WhyChooseSection title={WHY_CHOOSE_WORKFLOWPRO.title} subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} introText={WHY_CHOOSE_WORKFLOWPRO.introText} features={WHY_CHOOSE_WORKFLOWPRO.features} />
              <UseCasesSection
                title="Popular Uses for Image Upscaling"
                useCases={[
                  "Prepare low-resolution images for large format printing",
                  "Enhance old or small photos for modern displays",
                  "Upscale product images for e-commerce websites",
                  "Improve quality of social media profile pictures",
                  "Create high-resolution versions for professional use",
                  "Enlarge images for billboard and poster designs",
                  "Restore and enhance vintage photographs",
                  "Prepare images for 4K and 8K displays",
                  "Upscale artwork for digital galleries and portfolios",
                ]}
              />
              <ToolFAQSection
                faqs={[
                  { question: "How does AI enhancement improve image quality?", answer: "Our AI algorithm analyzes the image content and intelligently adds detail, reduces noise, enhances sharpness, and preserves edges during upscaling — resulting in superior quality compared to traditional methods." },
                  { question: "What's the maximum upscale factor?", answer: "You can use presets up to 4x, or enter custom dimensions for even larger sizes. However, extremely large upscales may take longer to process." },
                  { question: "Will my enlarged image look blurry?", answer: "With AI enhancement enabled, our algorithm minimizes blurriness by intelligently adding detail and sharpness. Higher resolution originals produce the best results." },
                  { question: "Does upscaling increase file size?", answer: "Yes, larger images naturally have bigger file sizes. However, you can use our Compress Image tool afterward to reduce the file size while maintaining quality." },
                  { question: "What format is best for enlarged images?", answer: "PNG is recommended for maximum quality preservation. However, JPG works well for photographs and creates smaller files." },
                  { question: "Is my image uploaded to a server?", answer: "No — all processing happens locally in your browser. Your files never leave your device." },
                ]}
              />
              <ToolSEOFooter
                title="About WorkflowPro's Image Enlarger Tool"
                content="WorkflowPro's image upscaler: AI-powered enhancement, multiple upscale presets, custom dimensions, format conversion, quality preservation — perfect for printing, professional use, design work. Fast, simple, always free."
              />
            </>
          )}
        </ToolPageLayout>
      )}
    </>
  );
}
