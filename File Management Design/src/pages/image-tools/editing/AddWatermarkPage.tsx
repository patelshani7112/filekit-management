/**
 * Add Watermark Page
 * 
 * Purpose: Allow users to add single or multiple text/image watermarks to images
 * 
 * Features:
 * - Upload single image file (JPG, PNG, WEBP, GIF, BMP, TIFF)
 * - Add multiple watermarks with independent settings
 * - Add text watermark with customization (font size, color, opacity)
 * - Add image watermark with customization (size, opacity)
 * - Position control (9 positions: corners, edges, center)
 * - Tile/repeat pattern across entire image
 * - Live preview with all watermark overlays
 * - Format conversion dropdown
 * - Download watermarked image
 * 
 * How it works:
 * 1. User uploads image file
 * 2. User adds one or more watermarks
 * 3. User customizes each watermark settings
 * 4. User positions watermarks or enables tile pattern
 * 5. User clicks "Apply Watermark"
 * 6. File is processed with all watermarks applied
 * 7. User downloads the watermarked image
 */

import { useState, useEffect, useRef } from "react";
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
  RefreshCw, FileType, RotateCw, Crop, ChevronDown, Search, Check,
  Type, Droplet, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Shield, Layers, Zap, Grid3x3, Move
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
    title: "Add Watermarks",
    description: "Add one or more text or image watermarks and customize their appearance, size, and opacity.",
    icon: Droplet,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Position Watermarks",
    description: "Choose from 9 preset positions or drag the watermarks to your desired location. Enable tile pattern for repeating watermarks.",
    icon: Layers,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Apply the watermarks and download your protected image instantly.",
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

// Watermark positions
const WATERMARK_POSITIONS = [
  { id: "top-left", name: "Top Left", x: 5, y: 5 },
  { id: "top-center", name: "Top Center", x: 50, y: 5 },
  { id: "top-right", name: "Top Right", x: 95, y: 5 },
  { id: "middle-left", name: "Middle Left", x: 5, y: 50 },
  { id: "middle-center", name: "Center", x: 50, y: 50 },
  { id: "middle-right", name: "Middle Right", x: 95, y: 50 },
  { id: "bottom-left", name: "Bottom Left", x: 5, y: 95 },
  { id: "bottom-center", name: "Bottom Center", x: 50, y: 95 },
  { id: "bottom-right", name: "Bottom Right", x: 95, y: 95 },
];

interface AddWatermarkPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function AddWatermarkPage({ onWorkStateChange }: AddWatermarkPageProps = {}) {
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
  
  // Watermark settings
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
  const [watermarkText, setWatermarkText] = useState("© Your Watermark");
  const [watermarkImageFile, setWatermarkImageFile] = useState<File | null>(null);
  const [watermarkImageUrl, setWatermarkImageUrl] = useState<string>("");
  const [watermarkPosition, setWatermarkPosition] = useState("bottom-right");
  const [watermarkOpacity, setWatermarkOpacity] = useState(70);
  const [watermarkFontSize, setWatermarkFontSize] = useState(24);
  const [watermarkColor, setWatermarkColor] = useState("#ffffff");
  const [watermarkImageScale, setWatermarkImageScale] = useState(20); // percentage of image width
  const [tilePattern, setTilePattern] = useState(false);
  const [watermarkRotation, setWatermarkRotation] = useState(0); // 0-360 degrees
  const [watermarkFontFamily, setWatermarkFontFamily] = useState("Arial");
  const [watermarkFontWeight, setWatermarkFontWeight] = useState("normal"); // normal, bold, italic, bold italic
  const [tileSpacing, setTileSpacing] = useState(2.5); // multiplier for spacing
  
  // Format dropdown state
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [formatSearchQuery, setFormatSearchQuery] = useState("");
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Canvas ref for watermark preview
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const watermarkImageRef = useRef<HTMLImageElement>(null);

  // Get selected format details
  const selectedFormat = IMAGE_OUTPUT_FORMATS.find(f => f.id === outputFormat) || IMAGE_OUTPUT_FORMATS[0];

  // Filter formats based on search
  const filteredFormats = IMAGE_OUTPUT_FORMATS.filter(format =>
    format.name.toLowerCase().includes(formatSearchQuery.toLowerCase()) ||
    format.description.toLowerCase().includes(formatSearchQuery.toLowerCase())
  );

  // Get selected position
  const selectedPosition = WATERMARK_POSITIONS.find(p => p.id === watermarkPosition) || WATERMARK_POSITIONS[8];

  // Update filename when format changes or file is uploaded
  useEffect(() => {
    if (files.length === 1) {
      const baseName = files[0].name.replace(/\.(jpg|jpeg|png|webp|gif|bmp|tiff|svg|ico|heic|avif)$/i, '');
      const ext = outputFormat === "original" 
        ? files[0].name.split('.').pop()?.toLowerCase() 
        : selectedFormat.extension;
      setOutputFileName(`${baseName}_watermarked.${ext}`);
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

  // Create watermark image preview URL
  useEffect(() => {
    if (watermarkImageFile) {
      const url = URL.createObjectURL(watermarkImageFile);
      setWatermarkImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watermarkImageFile]);

  // Draw watermark on canvas
  useEffect(() => {
    if (!imagePreviewUrl || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    
    const drawWatermark = () => {
      // Draw base image
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (tilePattern) {
        // Draw tiled watermark pattern across entire image
        if (watermarkType === "text" && watermarkText) {
          ctx.font = `${watermarkFontSize}px ${watermarkFontFamily}`;
          ctx.fillStyle = watermarkColor;
          ctx.globalAlpha = watermarkOpacity / 100;
          
          const metrics = ctx.measureText(watermarkText);
          const textWidth = metrics.width;
          const textHeight = watermarkFontSize;
          
          // Calculate spacing (2x text size for gaps)
          const spacingX = textWidth * tileSpacing;
          const spacingY = textHeight * tileSpacing;
          
          // Draw watermark in a grid pattern
          for (let y = textHeight; y < canvas.height + spacingY; y += spacingY) {
            for (let x = 0; x < canvas.width + spacingX; x += spacingX) {
              ctx.fillText(watermarkText, x, y);
            }
          }
          
          ctx.globalAlpha = 1;
        } else if (watermarkType === "image" && watermarkImageRef.current && watermarkImageUrl) {
          const watermarkImg = watermarkImageRef.current;
          
          if (watermarkImg.complete) {
            const scale = watermarkImageScale / 100;
            const watermarkWidth = canvas.width * scale;
            const watermarkHeight = (watermarkImg.height / watermarkImg.width) * watermarkWidth;
            
            // Calculate spacing (2x watermark size for gaps)
            const spacingX = watermarkWidth * tileSpacing;
            const spacingY = watermarkHeight * tileSpacing;
            
            ctx.globalAlpha = watermarkOpacity / 100;
            
            // Draw watermark in a grid pattern
            for (let y = 0; y < canvas.height + spacingY; y += spacingY) {
              for (let x = 0; x < canvas.width + spacingX; x += spacingX) {
                ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
              }
            }
            
            ctx.globalAlpha = 1;
          }
        }
      } else {
        // Draw single watermark at selected position
        const xPercent = selectedPosition.x / 100;
        const yPercent = selectedPosition.y / 100;

        if (watermarkType === "text" && watermarkText) {
          // Draw text watermark
          ctx.font = `${watermarkFontSize}px ${watermarkFontFamily}`;
          ctx.fillStyle = watermarkColor;
          ctx.globalAlpha = watermarkOpacity / 100;
          
          const metrics = ctx.measureText(watermarkText);
          const textWidth = metrics.width;
          const textHeight = watermarkFontSize;
          
          let x = canvas.width * xPercent;
          let y = canvas.height * yPercent;
          
          // Adjust for alignment based on position
          if (xPercent === 0.5) {
            x -= textWidth / 2; // center
          } else if (xPercent > 0.5) {
            x -= textWidth; // right
          }
          
          if (yPercent === 0.5) {
            y += textHeight / 2; // middle
          } else if (yPercent < 0.5) {
            y += textHeight; // top
          }
          
          ctx.fillText(watermarkText, x, y);
          ctx.globalAlpha = 1;
        } else if (watermarkType === "image" && watermarkImageRef.current && watermarkImageUrl) {
          // Draw image watermark
          const watermarkImg = watermarkImageRef.current;
          
          if (watermarkImg.complete) {
            const scale = watermarkImageScale / 100;
            const watermarkWidth = canvas.width * scale;
            const watermarkHeight = (watermarkImg.height / watermarkImg.width) * watermarkWidth;
            
            let x = canvas.width * xPercent;
            let y = canvas.height * yPercent;
            
            // Adjust for alignment based on position
            if (xPercent === 0.5) {
              x -= watermarkWidth / 2; // center
            } else if (xPercent > 0.5) {
              x -= watermarkWidth; // right
            }
            
            if (yPercent === 0.5) {
              y -= watermarkHeight / 2; // middle
            } else if (yPercent > 0.5) {
              y -= watermarkHeight; // bottom
            }
            
            ctx.globalAlpha = watermarkOpacity / 100;
            ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    if (img.complete) {
      drawWatermark();
    } else {
      img.onload = drawWatermark;
    }
  }, [imagePreviewUrl, watermarkType, watermarkText, watermarkImageUrl, watermarkPosition, 
      watermarkOpacity, watermarkFontSize, watermarkColor, watermarkImageScale, selectedPosition, tilePattern, tileSpacing, watermarkFontFamily]);
  
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
      icon: ImageIcon,
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

  // Handle watermark image upload
  const handleWatermarkImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'].includes(ext)) {
      return;
    }
    
    setWatermarkImageFile(file);
  };

  // Remove file and go back to upload
  const handleRemoveFile = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
    setCurrentStep("upload");
    setWatermarkText("© Your Watermark");
    setWatermarkImageFile(null);
    setWatermarkImageUrl("");
    setWatermarkPosition("bottom-right");
    setWatermarkOpacity(70);
    setWatermarkFontSize(24);
    setWatermarkColor("#ffffff");
    setWatermarkImageScale(20);
    setTilePattern(false);
    setWatermarkRotation(0);
    setWatermarkFontFamily("Arial");
    setWatermarkFontWeight("normal");
    setTileSpacing(2.5);
  };

  // Go back to upload
  const handleBackToUpload = () => {
    handleRemoveFile();
  };

  // Process file (apply watermark)
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      setProgress(i);
    }
    
    const file = files[0];
    
    // Determine output extension
    const ext = outputFormat === "original" 
      ? file.name.split('.').pop()?.toLowerCase() 
      : selectedFormat.extension;
    
    // Create a mock blob for download (in real app, this would be the canvas data)
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          
          setDownloadUrls([{
            url,
            fileName: outputFileName,
            originalSize: file.size,
            compressedSize: blob.size,
          }]);

          setProgress(100);
          setCurrentStep("complete");
        }
      }, `image/${ext}`);
    } else {
      // Fallback if canvas is not available
      const mockImageContent = `Watermarked Image: ${file.name}\nWatermark Type: ${watermarkType}\nPosition: ${selectedPosition.name}\nOpacity: ${watermarkOpacity}%`;
      const blob = new Blob([mockImageContent], { type: `image/${ext}` });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrls([{
        url,
        fileName: outputFileName,
        originalSize: file.size,
        compressedSize: blob.size,
      }]);

      setProgress(100);
      setCurrentStep("complete");
    }
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
    setWatermarkText("© Your Watermark");
    setWatermarkImageFile(null);
    setWatermarkImageUrl("");
    setWatermarkPosition("bottom-right");
    setWatermarkOpacity(70);
    setWatermarkFontSize(24);
    setWatermarkColor("#ffffff");
    setWatermarkImageScale(20);
    setTilePattern(false);
    setWatermarkRotation(0);
    setWatermarkFontFamily("Arial");
    setWatermarkFontWeight("normal");
    setTileSpacing(2.5);
  };

  // Check if we can process files (at least one valid file)
  const canProcess = fileValidationInfo.length > 0 && 
                     fileValidationInfo[0]?.isValid &&
                     !fileValidationInfo[0]?.isValidating &&
                     (watermarkType === "text" ? watermarkText.length > 0 : watermarkImageFile !== null);

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
      <SeoHead path="/add-watermark" />
      <ToolJsonLd path="/add-watermark" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded a file that hasn't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleReset}
      />

      {/* Success Header - Full Width at Top (only on complete step) */}
      {currentStep === "complete" && (
        <SuccessHeader
          title="Watermark Added Successfully!"
          description="Your watermarked image is ready to download"
        />
      )}

      {/* Header Section - Full Width Above Layout - Hide on Complete Step and Edit Step */}
      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Add Watermark to Image" 
          description="Add text or image watermarks to protect your photos. Customize position, size, opacity, and style — completely free and secure."
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
                <h3 className="font-semibold">Watermark Settings</h3>
                
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
                {/* Watermark Type Toggle */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Watermark Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setWatermarkType("text")}
                      className={`px-3 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        watermarkType === "text"
                          ? "border-purple-400 bg-purple-50 text-purple-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <Type className="w-4 h-4" />
                      Text
                    </button>
                    <button
                      onClick={() => setWatermarkType("image")}
                      className={`px-3 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        watermarkType === "image"
                          ? "border-purple-400 bg-purple-50 text-purple-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Image
                    </button>
                  </div>
                </div>

                {/* Text Watermark Settings */}
                {watermarkType === "text" && (
                  <>
                    <div>
                      <Label htmlFor="watermarkText" className="text-sm font-medium mb-1.5 block">
                        Watermark Text
                      </Label>
                      <Input
                        id="watermarkText"
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="© Your Watermark"
                        className="text-sm h-9"
                      />
                    </div>

                    <div>
                      <Label htmlFor="watermarkFontSize" className="text-sm font-medium mb-1.5 block">
                        Font Size: {watermarkFontSize}px
                      </Label>
                      <input
                        id="watermarkFontSize"
                        type="range"
                        min="12"
                        max="72"
                        value={watermarkFontSize}
                        onChange={(e) => setWatermarkFontSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>

                    <div>
                      <Label htmlFor="watermarkColor" className="text-sm font-medium mb-1.5 block">
                        Text Color
                      </Label>
                      <div className="flex gap-2">
                        <input
                          id="watermarkColor"
                          type="color"
                          value={watermarkColor}
                          onChange={(e) => setWatermarkColor(e.target.value)}
                          className="h-9 w-16 rounded border border-gray-300 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={watermarkColor}
                          onChange={(e) => setWatermarkColor(e.target.value)}
                          className="text-sm h-9 flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="watermarkFontFamily" className="text-sm font-medium mb-1.5 block">
                        Font Family
                      </Label>
                      <Input
                        id="watermarkFontFamily"
                        type="text"
                        value={watermarkFontFamily}
                        onChange={(e) => setWatermarkFontFamily(e.target.value)}
                        placeholder="Arial"
                        className="text-sm h-9"
                      />
                      <p className="text-xs text-gray-500 mt-1">Try: Arial, Times New Roman, Courier, Georgia</p>
                    </div>

                    <div>
                      <Label htmlFor="watermarkFontWeight" className="text-sm font-medium mb-1.5 block">
                        Font Style
                      </Label>
                      <select
                        id="watermarkFontWeight"
                        value={watermarkFontWeight}
                        onChange={(e) => setWatermarkFontWeight(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 bg-white"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="italic">Italic</option>
                        <option value="bold italic">Bold Italic</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="watermarkRotation" className="text-sm font-medium mb-1.5 block">
                        Rotation: {watermarkRotation}°
                      </Label>
                      <input
                        id="watermarkRotation"
                        type="range"
                        min="0"
                        max="360"
                        value={watermarkRotation}
                        onChange={(e) => setWatermarkRotation(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0°</span>
                        <span>90°</span>
                        <span>180°</span>
                        <span>270°</span>
                        <span>360°</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Image Watermark Settings */}
                {watermarkType === "image" && (
                  <>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">
                        Watermark Image
                      </Label>
                      <input
                        type="file"
                        id="watermarkImageInput"
                        accept=".jpg,.jpeg,.png,.webp,.gif,.bmp"
                        className="hidden"
                        onChange={handleWatermarkImageSelected}
                      />
                      <button
                        onClick={() => document.getElementById('watermarkImageInput')?.click()}
                        className="w-full px-3 py-2 rounded-lg border-2 border-dashed border-purple-400 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {watermarkImageFile ? "Change Image" : "Upload Image"}
                      </button>
                      {watermarkImageFile && (
                        <p className="text-xs text-gray-600 mt-1 truncate">{watermarkImageFile.name}</p>
                      )}
                    </div>

                    {watermarkImageFile && (
                      <div>
                        <Label htmlFor="watermarkImageScale" className="text-sm font-medium mb-1.5 block">
                          Size: {watermarkImageScale}% of image width
                        </Label>
                        <input
                          id="watermarkImageScale"
                          type="range"
                          min="5"
                          max="50"
                          value={watermarkImageScale}
                          onChange={(e) => setWatermarkImageScale(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Opacity Control */}
                <div>
                  <Label htmlFor="watermarkOpacity" className="text-sm font-medium mb-1.5 block">
                    Opacity: {watermarkOpacity}%
                  </Label>
                  <input
                    id="watermarkOpacity"
                    type="range"
                    min="10"
                    max="100"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Position Grid */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Position</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {WATERMARK_POSITIONS.map((position) => (
                      <button
                        key={position.id}
                        onClick={() => setWatermarkPosition(position.id)}
                        className={`aspect-square rounded-lg border-2 border-dashed text-xs font-medium transition-all flex items-center justify-center ${
                          watermarkPosition === position.id
                            ? "border-purple-400 bg-purple-50 text-purple-700"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                        title={position.name}
                      >
                        <div className="w-3 h-3 rounded-full bg-current" />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">{selectedPosition.name}</p>
                </div>

                {/* Tile Pattern */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Tile Pattern</Label>
                  <div className="relative">
                    <button
                      onClick={() => setTilePattern(!tilePattern)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-purple-400 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{tilePattern ? "Enabled" : "Disabled"}</div>
                        <div className="text-xs text-gray-500">Repeat watermark across entire image</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isFormatDropdownOpen ? 'rotate-180' : ''}`} />
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
                    placeholder="watermarked"
                    className="text-sm h-9"
                  />
                  <p className="text-xs text-gray-500 mt-1">File will be named: {outputFileName}</p>
                </div>

                {/* Apply Watermark Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!canProcess}
                >
                  <Droplet className="w-5 h-5 mr-2" />
                  Apply Watermark
                </GradientButton>

                {/* Tips Card */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-bold text-blue-900 mb-1">💡 Best Practices</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Use PNG format for watermarks with transparency</li>
                    <li>• Lower opacity for subtle watermarks</li>
                    <li>• Position in corners to avoid covering subjects</li>
                  </ul>
                </div>
              </div>

              {/* Hidden image refs for canvas drawing */}
              {watermarkImageUrl && (
                <img
                  ref={watermarkImageRef}
                  src={watermarkImageUrl}
                  alt="Watermark"
                  className="hidden"
                />
              )}
            </>
          }
        >
          {/* Main Preview Area */}
          <div className="space-y-4">
            {/* Preview Image with Watermark */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 flex items-center justify-center min-h-[400px] relative overflow-hidden">
              <div 
                className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-md z-10"
              >
                <p className="text-xs text-gray-600">Live Preview</p>
                <p className="text-sm font-bold text-purple-600">With Watermark</p>
              </div>
              
              {imagePreviewUrl && (
                <>
                  <img
                    ref={imageRef}
                    src={imagePreviewUrl}
                    alt="Source"
                    className="hidden"
                  />
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-full object-contain rounded shadow-lg"
                    style={{
                      maxHeight: '500px',
                      width: 'auto',
                      height: 'auto',
                    }}
                  />
                </>
              )}
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-purple-900">Protect Your Images</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Add custom text or image watermarks to protect your photos from unauthorized use. Adjust position, opacity, size, and style to create the perfect watermark for your needs.
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
                  title="Applying Watermark..." 
                  description="Please wait while we add the watermark to your image" 
                  icon={Droplet} 
                />
                <RelatedToolsSection tools={relatedTools} introText="These tools work well with watermarking." />
              </>
            )}

            {currentStep === "complete" && (
              <CompressSuccessSection
                files={downloadUrls}
                onReset={handleReset}
                resetButtonText="Add Watermark to Another Image"
                title="Watermark Added Successfully!"
                description="Your watermarked image is ready to download"
                icon={Droplet}
              />
            )}
          </div>

          {currentStep === "complete" && <RelatedToolsSection tools={relatedTools} introText="Continue working with your images." />}

          {currentStep !== "complete" && (
            <>
              <RelatedToolsSection tools={relatedTools} introText="These tools work well with watermarking." />
              <ToolDefinitionSection
                title="What Is a Watermark?"
                content="A watermark is a visible overlay added to images to protect copyright, identify ownership, or add branding. Add text or image watermarks with customizable position, size, opacity, and style — completely free, secure, and private."
              />
              <HowItWorksSteps title="How It Works" subtitle="Add watermark in four simple steps" introText="Follow these steps to watermark your image quickly and securely." steps={STEPS} />
              <WhyChooseSection title={WHY_CHOOSE_WORKFLOWPRO.title} subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} introText={WHY_CHOOSE_WORKFLOWPRO.introText} features={WHY_CHOOSE_WORKFLOWPRO.features} />
              <UseCasesSection
                title="Popular Uses for Watermarks"
                useCases={[
                  "Protect photography portfolios from unauthorized use",
                  "Add branding to product images for e-commerce",
                  "Copyright protection for artwork and illustrations",
                  "Brand social media images with logo watermarks",
                  "Add attribution to educational materials",
                  "Protect stock photos with visible watermarks",
                  "Add copyright notices to digital downloads",
                  "Brand marketing materials and graphics",
                  "Identify ownership of shared images online",
                ]}
              />
              <ToolFAQSection
                faqs={[
                  { question: "What types of watermarks can I add?", answer: "You can add text watermarks (copyright notices, names, URLs) or image watermarks (logos, signatures, graphics). Both types support customizable opacity, position, and size." },
                  { question: "Where should I position my watermark?", answer: "Common positions are corners (especially bottom-right) or center. Choose a position that protects your image without covering important content. Lower opacity watermarks work well in more visible positions." },
                  { question: "What opacity should I use?", answer: "For subtle watermarks that don't distract: 30-50%. For strong protection: 70-90%. Lower opacity is better for photos where you want the watermark visible but not dominant." },
                  { question: "What format should I use for watermarked images?", answer: "PNG is recommended for images requiring transparency. JPG works well for photos. WEBP offers good compression with quality." },
                  { question: "Can watermarks be removed?", answer: "Visible watermarks can sometimes be removed with advanced tools, so position them strategically. For maximum protection, place them over important content or use multiple smaller watermarks." },
                  { question: "Is my image uploaded to a server?", answer: "No — all watermarking happens locally in your browser. Your files never leave your device." },
                ]}
              />
              <ToolSEOFooter
                title="About WorkflowPro's Add Watermark Tool"
                content="WorkflowPro's watermark tool: text and image watermarks, 9 position presets, customizable size and opacity, color control, multiple format support — perfect for photographers, artists, businesses. Fast, simple, always free."
              />
            </>
          )}
        </ToolPageLayout>
      )}
    </>
  );
}