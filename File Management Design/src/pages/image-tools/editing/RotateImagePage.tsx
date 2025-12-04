/**
 * Rotate Image Page
 * 
 * Purpose: Allow users to rotate and flip a single image file with live preview
 * 
 * Features:
 * - Upload single image file (JPG, PNG, WEBP, GIF, BMP, TIFF)
 * - Live preview with rotation applied
 * - Quick rotate buttons (90° left/right)
 * - Custom angle input (0-360°)
 * - Flip horizontal and vertical
 * - Format conversion dropdown
 * - Process files with realistic progress
 * - Download rotated image
 * 
 * How it works:
 * 1. User uploads image file
 * 2. Live preview shows original image
 * 3. User rotates using quick buttons or custom angle
 * 4. User can flip horizontally or vertically
 * 5. User selects output format (defaults to original)
 * 6. User clicks "Rotate Image"
 * 7. File is processed (simulated)
 * 8. User downloads the rotated image
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
  RefreshCw, FileType, FileText, RotateCw, RotateCcw, ChevronDown, Search, Check,
  FlipHorizontal, FlipVertical
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
    title: "Rotate & Flip",
    description: "Use quick rotate buttons (90° left/right), enter custom angle, or flip horizontally/vertically.",
    icon: RotateCw,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Preview Changes",
    description: "See a live preview of your rotated image with the rotation angle displayed.",
    icon: ImageIcon,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Download your rotated image instantly in your preferred format.",
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

interface RotateImagePageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function RotateImagePage({ onWorkStateChange }: RotateImagePageProps = {}) {
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
  
  // Rotation state
  const [rotationAngle, setRotationAngle] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  
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

  // Update filename when format changes or file is uploaded
  useEffect(() => {
    if (files.length === 1) {
      const baseName = files[0].name.replace(/\.(jpg|jpeg|png|webp|gif|bmp|tiff|svg|ico|heic|avif)$/i, '');
      const ext = outputFormat === "original" 
        ? files[0].name.split('.').pop()?.toLowerCase() 
        : selectedFormat.extension;
      setOutputFileName(`${baseName}_rotated.${ext}`);
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
      name: "Compress PNG",
      description: "Reduce PNG file sizes",
      icon: Archive,
      onClick: () => window.location.href = "/compress-png",
    },
    {
      name: "Compress JPG",
      description: "Reduce JPG file sizes",
      icon: Archive,
      onClick: () => window.location.href = "/compress-jpg",
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

  // Handle rotation
  const handleRotateLeft = () => {
    setRotationAngle((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  const handleCustomAngle = (value: number) => {
    // Normalize to 0-359
    const normalized = ((value % 360) + 360) % 360;
    setRotationAngle(normalized);
  };

  const handleFlipHorizontal = () => {
    setFlipHorizontal(!flipHorizontal);
  };

  const handleFlipVertical = () => {
    setFlipVertical(!flipVertical);
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
    setRotationAngle(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  // Go back to upload
  const handleBackToUpload = () => {
    handleRemoveFile();
  };

  // Process file (rotate image)
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setProgress(i);
    }
    
    const file = files[0];
    
    // File size stays roughly the same for rotation
    const rotatedSize = file.size;
    
    // Determine output extension
    const ext = outputFormat === "original" 
      ? file.name.split('.').pop()?.toLowerCase() 
      : selectedFormat.extension;
    
    // Create a mock blob for download
    const mockImageContent = `Rotated Image: ${file.name}\nRotation Angle: ${rotationAngle}°\nFlip Horizontal: ${flipHorizontal}\nFlip Vertical: ${flipVertical}\nOriginal Size: ${file.size} bytes\nRotated Size: ${rotatedSize} bytes`;
    const blob = new Blob([mockImageContent], { type: `image/${ext}` });
    const url = URL.createObjectURL(blob);
    
    setDownloadUrls([{
      url,
      fileName: outputFileName,
      originalSize: file.size,
      compressedSize: rotatedSize,
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
    setRotationAngle(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
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

  // Calculate if we should block navigation
  const hasUnsavedWork = files.length > 0 && currentStep !== "complete";

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/rotate-image" />
      <ToolJsonLd path="/rotate-image" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded a file that hasn't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleReset}
      />

      {/* Success Header - Full Width at Top (only on complete step) */}
      {currentStep === "complete" && (
        <SuccessHeader
          title="Image Rotated Successfully!"
          description="Your image has been rotated and is ready to download"
        />
      )}

      {/* Header Section - Full Width Above Layout - Hide on Complete Step and Edit Step */}
      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Rotate Image" 
          description="Rotate images to any angle and flip horizontally or vertically. Fix orientation, adjust photos, create effects — completely free and secure."
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
                <h3 className="font-semibold">Rotation Settings</h3>
                
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
                {/* Current Rotation Info */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Current Rotation</p>
                  <p className="font-bold text-gray-900">{rotationAngle}°</p>
                  {(flipHorizontal || flipVertical) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {flipHorizontal && "Flipped Horizontally"}
                      {flipHorizontal && flipVertical && " • "}
                      {flipVertical && "Flipped Vertically"}
                    </p>
                  )}
                </div>

                {/* Quick Rotate Buttons */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Quick Rotate</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleRotateLeft}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50 text-gray-700 text-sm font-medium transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Rotate Left 90°
                    </button>
                    <button
                      onClick={handleRotateRight}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50 text-gray-700 text-sm font-medium transition-all"
                    >
                      <RotateCw className="w-4 h-4" />
                      Rotate Right 90°
                    </button>
                  </div>
                </div>

                {/* Custom Angle */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Custom Angle</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={rotationAngle}
                      onChange={(e) => handleCustomAngle(Number(e.target.value))}
                      min={0}
                      max={359}
                      className="text-sm h-9 flex-1"
                    />
                    <span className="text-sm font-medium text-gray-700">°</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter angle from 0° to 359°</p>
                </div>

                {/* Flip Options */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Flip Image</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleFlipHorizontal}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed text-sm font-medium transition-all ${
                        flipHorizontal
                          ? "border-purple-400 bg-purple-50 text-purple-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      Horizontal
                    </button>
                    <button
                      onClick={handleFlipVertical}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed text-sm font-medium transition-all ${
                        flipVertical
                          ? "border-purple-400 bg-purple-50 text-purple-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <FlipVertical className="w-4 h-4" />
                      Vertical
                    </button>
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
                    placeholder="rotated"
                    className="text-sm h-9"
                  />
                  <p className="text-xs text-gray-500 mt-1">File will be named: {outputFileName}</p>
                </div>

                {/* Rotate Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!canProcess}
                >
                  <RotateCw className="w-5 h-5 mr-2" />
                  Rotate Image
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
                <p className="text-sm font-bold text-purple-600">Rotation: {rotationAngle}°</p>
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
                    transform: `rotate(${rotationAngle}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                    transition: 'transform 0.3s ease',
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
                <ProcessingModal isOpen={true} progress={progress} title="Rotating Image..." description="Please wait while we rotate your image" icon={RotateCw} />
                <RelatedToolsSection tools={relatedTools} introText="These tools work well with image rotation." />
              </>
            )}

            {currentStep === "complete" && (
              <CompressSuccessSection
                files={downloadUrls}
                onReset={handleReset}
                resetButtonText="Rotate Another Image"
                title="Image Rotated Successfully!"
                description="Your image has been rotated and is ready to download"
                icon={RotateCw}
              />
            )}
          </div>

          {currentStep === "complete" && <RelatedToolsSection tools={relatedTools} introText="Continue working with your images." />}

          {currentStep !== "complete" && (
            <>
              <RelatedToolsSection tools={relatedTools} introText="These tools work well with image rotation." />
              <ToolDefinitionSection
                title="What Is Image Rotation?"
                content="Image rotation allows you to change the orientation of your photos by rotating them to any angle and flipping them horizontally or vertically. Perfect for fixing sideways photos, creating artistic effects, or correcting camera orientation — completely free, secure, and private."
              />
              <HowItWorksSteps title="How It Works" subtitle="Rotate your image in four simple steps" introText="Follow these steps to rotate your image quickly and securely." steps={STEPS} />
              <WhyChooseSection title={WHY_CHOOSE_WORKFLOWPRO.title} subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} introText={WHY_CHOOSE_WORKFLOWPRO.introText} features={WHY_CHOOSE_WORKFLOWPRO.features} />
              <UseCasesSection
                title="Popular Uses for Image Rotation"
                useCases={[
                  "Fix sideways or upside-down photos from your camera",
                  "Rotate images for proper orientation in documents",
                  "Create artistic effects with custom rotation angles",
                  "Flip images horizontally for mirror effects",
                  "Correct scanned document orientation",
                  "Prepare images for printing in the correct orientation",
                  "Rotate product photos for e-commerce listings",
                  "Fix mobile phone photos taken in wrong orientation",
                  "Create symmetrical designs with flip tools",
                ]}
              />
              <ToolFAQSection
                faqs={[
                  { question: "Can I rotate images to any angle?", answer: "Yes! Use quick buttons for 90° rotations or enter a custom angle from 0° to 359° for precise control." },
                  { question: "What does flip horizontal/vertical do?", answer: "Flip horizontal creates a mirror image (left becomes right), while flip vertical flips the image upside down. You can use both together." },
                  { question: "Does rotation reduce image quality?", answer: "90° rotations preserve quality perfectly. Custom angles may have minimal quality impact due to pixel interpolation." },
                  { question: "Can I see the result before downloading?", answer: "Yes! The live preview shows your rotation and flip effects in real-time before you process the image." },
                  { question: "Does the file size change after rotation?", answer: "No, rotation typically maintains the same file size as the original image." },
                  { question: "Is my image uploaded to a server?", answer: "No — all rotation happens locally in your browser. Your files never leave your device." },
                ]}
              />
              <ToolSEOFooter
                title="About WorkflowPro's Rotate Image Tool"
                content="WorkflowPro's image rotator: rotate to any angle (90°, 180°, 270°, custom), flip horizontal and vertical, live preview, preserve quality, convert formats — perfect for fixing photo orientation, creating effects, preparing images. Fast, simple, always free."
              />
            </>
          )}
        </ToolPageLayout>
      )}
    </>
  );
}
