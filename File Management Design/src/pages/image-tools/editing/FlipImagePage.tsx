/**
 * Flip Image Page
 * 
 * Purpose: Allow users to flip a single image file horizontally or vertically with live preview
 * 
 * Features:
 * - Upload single image file (JPG, PNG, WEBP, GIF, BMP, TIFF)
 * - Live preview with flip applied
 * - Flip horizontal (mirror effect)
 * - Flip vertical (upside down)
 * - Flip both directions
 * - Format conversion dropdown
 * - Process files with realistic progress
 * - Download flipped image
 * 
 * How it works:
 * 1. User uploads image file
 * 2. Live preview shows original image
 * 3. User selects flip options (horizontal, vertical, or both)
 * 4. User selects output format (defaults to original)
 * 5. User clicks "Flip Image"
 * 6. File is processed (simulated)
 * 7. User downloads the flipped image
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
  RefreshCw, FileType, FileText, RotateCw, ChevronDown, Search, Check,
  FlipHorizontal, FlipVertical, Layers
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
    title: "Choose Flip Direction",
    description: "Select flip horizontal for mirror effect, flip vertical for upside down, or both.",
    icon: FlipHorizontal,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Preview Changes",
    description: "See a live preview of your flipped image with the flip direction displayed.",
    icon: ImageIcon,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Download your flipped image instantly in your preferred format.",
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

interface FlipImagePageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function FlipImagePage({ onWorkStateChange }: FlipImagePageProps = {}) {
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
  
  // Flip state
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
      setOutputFileName(`${baseName}_flipped.${ext}`);
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
      name: "Rotate Image",
      description: "Rotate images to any angle",
      icon: RotateCw,
      onClick: () => window.location.href = "/rotate-image",
    },
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
  ];

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

  // Handle flip toggles
  const handleFlipHorizontal = () => {
    setFlipHorizontal(!flipHorizontal);
  };

  const handleFlipVertical = () => {
    setFlipVertical(!flipVertical);
  };

  const handleFlipBoth = () => {
    const shouldFlipBoth = !flipHorizontal || !flipVertical;
    setFlipHorizontal(shouldFlipBoth);
    setFlipVertical(shouldFlipBoth);
  };

  const handleReset = () => {
    setFlipHorizontal(false);
    setFlipVertical(false);
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
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  // Go back to upload
  const handleBackToUpload = () => {
    handleRemoveFile();
  };

  // Process file (flip image)
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setProgress(i);
    }
    
    const file = files[0];
    
    // File size stays the same for flipping
    const flippedSize = file.size;
    
    // Determine output extension
    const ext = outputFormat === "original" 
      ? file.name.split('.').pop()?.toLowerCase() 
      : selectedFormat.extension;
    
    // Create a mock blob for download
    const mockImageContent = `Flipped Image: ${file.name}\nFlip Horizontal: ${flipHorizontal}\nFlip Vertical: ${flipVertical}\nOriginal Size: ${file.size} bytes\nFlipped Size: ${flippedSize} bytes`;
    const blob = new Blob([mockImageContent], { type: `image/${ext}` });
    const url = URL.createObjectURL(blob);
    
    setDownloadUrls([{
      url,
      fileName: outputFileName,
      originalSize: file.size,
      compressedSize: flippedSize,
    }]);

    setProgress(100);
    setCurrentStep("complete");
  };

  // Reset to upload more files
  const handleResetComplete = () => {
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
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  // Check if we can process files (at least one valid file and at least one flip selected)
  const canProcess = fileValidationInfo.length > 0 && 
                     fileValidationInfo[0]?.isValid &&
                     !fileValidationInfo[0]?.isValidating &&
                     (flipHorizontal || flipVertical);

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
      <SeoHead path="/flip-image" />
      <ToolJsonLd path="/flip-image" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded a file that hasn't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleResetComplete}
      />

      {/* Success Header - Full Width at Top (only on complete step) */}
      {currentStep === "complete" && (
        <SuccessHeader
          title="Image Flipped Successfully!"
          description="Your image has been flipped and is ready to download"
        />
      )}

      {/* Header Section - Full Width Above Layout - Hide on Complete Step and Edit Step */}
      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Flip Image" 
          description="Flip images horizontally or vertically online. Create mirror effects, fix orientation, prepare images for design — completely free and secure."
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
                <h3 className="font-semibold">Flip Settings</h3>
                
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
                {/* Current Flip Info */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Current Flip</p>
                  {!flipHorizontal && !flipVertical && (
                    <p className="font-bold text-gray-900">No flip applied</p>
                  )}
                  {(flipHorizontal || flipVertical) && (
                    <div className="space-y-1">
                      {flipHorizontal && (
                        <p className="text-sm font-medium text-purple-700">✓ Flipped Horizontally</p>
                      )}
                      {flipVertical && (
                        <p className="text-sm font-medium text-purple-700">✓ Flipped Vertically</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Flip Options */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Flip Direction</Label>
                  <div className="space-y-2">
                    <button
                      onClick={handleFlipHorizontal}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed text-sm font-medium transition-all ${
                        flipHorizontal
                          ? "border-purple-400 bg-purple-50 text-purple-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      Flip Horizontal (Mirror)
                    </button>
                    <button
                      onClick={handleFlipVertical}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed text-sm font-medium transition-all ${
                        flipVertical
                          ? "border-purple-400 bg-purple-50 text-purple-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <FlipVertical className="w-4 h-4" />
                      Flip Vertical (Upside Down)
                    </button>
                    <button
                      onClick={handleFlipBoth}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed text-sm font-medium transition-all ${
                        flipHorizontal && flipVertical
                          ? "border-purple-400 bg-purple-50 text-purple-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      Flip Both Directions
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                {(flipHorizontal || flipVertical) && (
                  <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset to Original
                  </button>
                )}

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
                    placeholder="flipped"
                    className="text-sm h-9"
                  />
                  <p className="text-xs text-gray-500 mt-1">File will be named: {outputFileName}</p>
                </div>

                {/* Flip Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!canProcess}
                >
                  <FlipHorizontal className="w-5 h-5 mr-2" />
                  Flip Image
                </GradientButton>

                {!flipHorizontal && !flipVertical && (
                  <p className="text-xs text-center text-gray-500">
                    Select at least one flip direction to continue
                  </p>
                )}
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
                {!flipHorizontal && !flipVertical && (
                  <p className="text-sm font-bold text-gray-500">Original</p>
                )}
                {(flipHorizontal || flipVertical) && (
                  <div className="space-y-0.5">
                    {flipHorizontal && (
                      <p className="text-xs font-medium text-purple-600">↔ Horizontal</p>
                    )}
                    {flipVertical && (
                      <p className="text-xs font-medium text-purple-600">↕ Vertical</p>
                    )}
                  </div>
                )}
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
                    transform: `scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
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
                <ProcessingModal isOpen={true} progress={progress} title="Flipping Image..." description="Please wait while we flip your image" icon={FlipHorizontal} />
                <RelatedToolsSection tools={relatedTools} introText="These tools work well with image flipping." />
              </>
            )}

            {currentStep === "complete" && (
              <CompressSuccessSection
                files={downloadUrls}
                onReset={handleResetComplete}
                resetButtonText="Flip Another Image"
                title="Image Flipped Successfully!"
                description="Your image has been flipped and is ready to download"
                icon={FlipHorizontal}
              />
            )}
          </div>

          {currentStep === "complete" && <RelatedToolsSection tools={relatedTools} introText="Continue working with your images." />}

          {currentStep !== "complete" && (
            <>
              <RelatedToolsSection tools={relatedTools} introText="These tools work well with image flipping." />
              <ToolDefinitionSection
                title="What Is Image Flipping?"
                content="Image flipping allows you to mirror your photos horizontally or vertically. Create mirror effects, fix orientation issues, prepare images for symmetrical designs, or create unique visual effects — completely free, secure, and private."
              />
              <HowItWorksSteps title="How It Works" subtitle="Flip your image in four simple steps" introText="Follow these steps to flip your image quickly and securely." steps={STEPS} />
              <WhyChooseSection title={WHY_CHOOSE_WORKFLOWPRO.title} subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} introText={WHY_CHOOSE_WORKFLOWPRO.introText} features={WHY_CHOOSE_WORKFLOWPRO.features} />
              <UseCasesSection
                title="Popular Uses for Image Flipping"
                useCases={[
                  "Create mirror effects for artistic photography",
                  "Fix horizontally reversed images from cameras",
                  "Prepare images for symmetrical design layouts",
                  "Flip selfies to match how you see yourself in mirror",
                  "Create matching pairs of images for design projects",
                  "Correct scanned images that are upside down",
                  "Design symmetrical logos and graphics",
                  "Prepare product photos for e-commerce catalogs",
                  "Create reflection effects for creative projects",
                ]}
              />
              <ToolFAQSection
                faqs={[
                  { question: "What's the difference between horizontal and vertical flip?", answer: "Horizontal flip creates a mirror image (left becomes right), while vertical flip turns the image upside down (top becomes bottom). You can apply both for a 180° rotation." },
                  { question: "Does flipping reduce image quality?", answer: "No! Flipping is a lossless operation. Your image quality remains exactly the same as the original." },
                  { question: "Can I see the result before downloading?", answer: "Yes! The live preview shows your flip effects in real-time before you process the image." },
                  { question: "Does the file size change after flipping?", answer: "No, flipping maintains the same file size as the original image." },
                  { question: "Can I flip and rotate at the same time?", answer: "Use our Rotate Image tool for rotation, or apply flip here first, download, then rotate the result." },
                  { question: "Is my image uploaded to a server?", answer: "No — all flipping happens locally in your browser. Your files never leave your device." },
                ]}
              />
              <ToolSEOFooter
                title="About WorkflowPro's Flip Image Tool"
                content="WorkflowPro's image flipper: flip horizontal (mirror), flip vertical (upside down), flip both, live preview, preserve quality, convert formats — perfect for creating effects, fixing orientation, design work. Fast, simple, always free."
              />
            </>
          )}
        </ToolPageLayout>
      )}
    </>
  );
}
