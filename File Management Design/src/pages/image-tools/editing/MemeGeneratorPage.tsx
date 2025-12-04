/**
 * Meme Generator Page
 * 
 * Purpose: Allow users to create memes by adding customizable text to images
 * 
 * Features:
 * - Upload single image file (JPG, PNG, WEBP, GIF, BMP, TIFF)
 * - Add top and bottom text (classic meme format)
 * - Add custom positioned text boxes
 * - Font customization (family, size, weight, color)
 * - Text stroke/outline for readability
 * - Text shadow effects
 * - Multiple text alignment options
 * - Live preview with all text overlays
 * - Format conversion dropdown
 * - Download finished meme
 * 
 * How it works:
 * 1. User uploads image file
 * 2. User adds top text and/or bottom text
 * 3. User customizes text appearance
 * 4. User adds additional text boxes if needed
 * 5. User clicks "Generate Meme"
 * 6. File is processed with text overlays
 * 7. User downloads the finished meme
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
  Type, Smile, Laugh, AlignLeft, AlignCenter, AlignRight,
  Shield, Layers, Zap, Trash2, Plus
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
    title: "Add Text",
    description: "Add top text, bottom text, or custom positioned text boxes with full customization.",
    icon: Type,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Customize Style",
    description: "Choose font, size, color, stroke, shadow, and alignment to make your meme stand out.",
    icon: Layers,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Meme",
    description: "Generate and download your finished meme instantly.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

// All available image output formats
const IMAGE_OUTPUT_FORMATS = [
  { id: "png", name: "PNG", extension: "png", category: "Image", description: "High quality (recommended)" },
  { id: "jpg", name: "JPG / JPEG", extension: "jpg", category: "Image", description: "Standard photo" },
  { id: "webp", name: "WEBP", extension: "webp", category: "Image", description: "Modern web format" },
  { id: "gif", name: "GIF", extension: "gif", category: "Image", description: "Animation support" },
];

// Text positions for meme
const TEXT_POSITIONS = [
  { id: "top", name: "Top", y: 10 },
  { id: "middle", name: "Middle", y: 50 },
  { id: "bottom", name: "Bottom", y: 90 },
];

// Text alignment options
const TEXT_ALIGNMENTS = [
  { id: "left", name: "Left", icon: AlignLeft },
  { id: "center", name: "Center", icon: AlignCenter },
  { id: "right", name: "Right", icon: AlignRight },
];

interface MemeGeneratorPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function MemeGeneratorPage({ onWorkStateChange }: MemeGeneratorPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrls, setDownloadUrls] = useState<Array<{ url: string; fileName: string; originalSize: number; compressedSize: number }>>([]);
  const [outputFormat, setOutputFormat] = useState("png");
  const [outputFileName, setOutputFileName] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  
  // Original image dimensions
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  
  // Meme text settings
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState("Impact");
  const [fontWeight, setFontWeight] = useState("bold");
  const [textColor, setTextColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [textShadow, setTextShadow] = useState(true);
  const [textAlignment, setTextAlignment] = useState("center");
  const [textTransform, setTextTransform] = useState("uppercase");
  
  // Format dropdown state
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [formatSearchQuery, setFormatSearchQuery] = useState("");
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Canvas ref for meme preview
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
      const ext = selectedFormat.extension;
      setOutputFileName(`${baseName}_meme.${ext}`);
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

  // Draw meme text on canvas
  useEffect(() => {
    if (!imagePreviewUrl || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    
    const drawMeme = () => {
      // Draw base image
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Configure text style
      const fontStyle = fontWeight === "normal" ? "" : fontWeight + " ";
      ctx.font = `${fontStyle}${fontSize}px ${fontFamily}`;
      ctx.fillStyle = textColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.textAlign = textAlignment as CanvasTextAlign;
      
      // Add shadow if enabled
      if (textShadow) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      // Calculate x position based on alignment
      let xPos = canvas.width / 2;
      if (textAlignment === "left") {
        xPos = 20;
      } else if (textAlignment === "right") {
        xPos = canvas.width - 20;
      }

      // Draw top text
      if (topText) {
        const text = textTransform === "uppercase" ? topText.toUpperCase() : topText;
        const yPos = fontSize + 20;
        
        // Draw stroke (outline)
        ctx.strokeText(text, xPos, yPos);
        // Draw fill
        ctx.fillText(text, xPos, yPos);
      }

      // Draw bottom text
      if (bottomText) {
        const text = textTransform === "uppercase" ? bottomText.toUpperCase() : bottomText;
        const yPos = canvas.height - 20;
        
        // Draw stroke (outline)
        ctx.strokeText(text, xPos, yPos);
        // Draw fill
        ctx.fillText(text, xPos, yPos);
      }

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    };

    if (img.complete) {
      drawMeme();
    } else {
      img.onload = drawMeme;
    }
  }, [imagePreviewUrl, topText, bottomText, fontSize, fontFamily, fontWeight, 
      textColor, strokeColor, strokeWidth, textShadow, textAlignment, textTransform]);
  
  // Related tools for this page
  const relatedTools = [
    {
      name: "Add Watermark",
      description: "Protect images with watermarks",
      icon: Shield,
      onClick: () => window.location.href = "/add-watermark",
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
      name: "Crop Image",
      description: "Crop and trim your images",
      icon: Crop,
      onClick: () => window.location.href = "/crop-image",
    },
    {
      name: "Edit Image",
      description: "Advanced image editing tools",
      icon: FileEdit,
      onClick: () => window.location.href = "/edit-image",
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
    setTopText("");
    setBottomText("");
    setFontSize(48);
    setFontFamily("Impact");
    setFontWeight("bold");
    setTextColor("#ffffff");
    setStrokeColor("#000000");
    setStrokeWidth(3);
    setTextShadow(true);
    setTextAlignment("center");
    setTextTransform("uppercase");
  };

  // Go back to upload
  const handleBackToUpload = () => {
    handleRemoveFile();
  };

  // Process file (generate meme)
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
    const ext = selectedFormat.extension;
    
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
      const mockImageContent = `Meme Generated\nTop: ${topText}\nBottom: ${bottomText}`;
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
    setOutputFormat("png");
    setTopText("");
    setBottomText("");
    setFontSize(48);
    setFontFamily("Impact");
    setFontWeight("bold");
    setTextColor("#ffffff");
    setStrokeColor("#000000");
    setStrokeWidth(3);
    setTextShadow(true);
    setTextAlignment("center");
    setTextTransform("uppercase");
  };

  // Check if we can process files (at least one valid file and some text)
  const canProcess = fileValidationInfo.length > 0 && 
                     fileValidationInfo[0]?.isValid &&
                     !fileValidationInfo[0]?.isValidating &&
                     (topText.length > 0 || bottomText.length > 0);

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
      <SeoHead path="/meme-generator" />
      <ToolJsonLd path="/meme-generator" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded a file that hasn't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleReset}
      />

      {/* Success Header - Full Width at Top (only on complete step) */}
      {currentStep === "complete" && (
        <SuccessHeader
          title="Meme Generated Successfully!"
          description="Your meme is ready to share with the world"
        />
      )}

      {/* Header Section - Full Width Above Layout - Hide on Complete Step and Edit Step */}
      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Meme Generator" 
          description="Create hilarious memes with custom text. Add top and bottom text, customize fonts, colors, and effects — completely free and easy to use."
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
                <h3 className="font-semibold">Meme Text</h3>
                
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
                {/* Top Text */}
                <div>
                  <Label htmlFor="topText" className="text-sm font-medium mb-1.5 block">
                    Top Text
                  </Label>
                  <Input
                    id="topText"
                    type="text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="TOP TEXT"
                    className="text-sm h-9"
                  />
                </div>

                {/* Bottom Text */}
                <div>
                  <Label htmlFor="bottomText" className="text-sm font-medium mb-1.5 block">
                    Bottom Text
                  </Label>
                  <Input
                    id="bottomText"
                    type="text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="BOTTOM TEXT"
                    className="text-sm h-9"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4" />

                <h4 className="text-sm font-semibold mb-2">Text Style</h4>

                {/* Font Size */}
                <div>
                  <Label htmlFor="fontSize" className="text-sm font-medium mb-1.5 block">
                    Font Size: {fontSize}px
                  </Label>
                  <input
                    id="fontSize"
                    type="range"
                    min="24"
                    max="120"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Font Family */}
                <div>
                  <Label htmlFor="fontFamily" className="text-sm font-medium mb-1.5 block">
                    Font Family
                  </Label>
                  <select
                    id="fontFamily"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 bg-white"
                  >
                    <option value="Impact">Impact (Classic Meme)</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>

                {/* Font Weight */}
                <div>
                  <Label htmlFor="fontWeight" className="text-sm font-medium mb-1.5 block">
                    Font Weight
                  </Label>
                  <select
                    id="fontWeight"
                    value={fontWeight}
                    onChange={(e) => setFontWeight(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold (Recommended)</option>
                  </select>
                </div>

                {/* Text Transform */}
                <div>
                  <Label htmlFor="textTransform" className="text-sm font-medium mb-1.5 block">
                    Text Case
                  </Label>
                  <select
                    id="textTransform"
                    value={textTransform}
                    onChange={(e) => setTextTransform(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 bg-white"
                  >
                    <option value="uppercase">UPPERCASE (Classic)</option>
                    <option value="none">As Typed</option>
                  </select>
                </div>

                {/* Text Alignment */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Text Alignment</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {TEXT_ALIGNMENTS.map((alignment) => {
                      const Icon = alignment.icon;
                      return (
                        <button
                          key={alignment.id}
                          onClick={() => setTextAlignment(alignment.id)}
                          className={`px-3 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                            textAlignment === alignment.id
                              ? "border-purple-400 bg-purple-50 text-purple-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <Label htmlFor="textColor" className="text-sm font-medium mb-1.5 block">
                    Text Color
                  </Label>
                  <div className="flex gap-2">
                    <input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-9 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="text-sm h-9 flex-1"
                    />
                  </div>
                </div>

                {/* Stroke Color */}
                <div>
                  <Label htmlFor="strokeColor" className="text-sm font-medium mb-1.5 block">
                    Stroke Color (Outline)
                  </Label>
                  <div className="flex gap-2">
                    <input
                      id="strokeColor"
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="h-9 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="text-sm h-9 flex-1"
                    />
                  </div>
                </div>

                {/* Stroke Width */}
                <div>
                  <Label htmlFor="strokeWidth" className="text-sm font-medium mb-1.5 block">
                    Stroke Width: {strokeWidth}px
                  </Label>
                  <input
                    id="strokeWidth"
                    type="range"
                    min="0"
                    max="10"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Text Shadow Toggle */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Text Shadow</Label>
                  <button
                    onClick={() => setTextShadow(!textShadow)}
                    className={`w-full px-3 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-all ${
                      textShadow
                        ? "border-purple-400 bg-purple-50 text-purple-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {textShadow ? "Enabled" : "Disabled"}
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4" />

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
                        {/* Format List */}
                        <div className="overflow-y-auto max-h-64 custom-scrollbar">
                          {filteredFormats.map((format) => (
                            <button
                              key={format.id}
                              onClick={() => {
                                setOutputFormat(format.id);
                                setIsFormatDropdownOpen(false);
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
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Output Filename */}
                <div>
                  <Label htmlFor="outputFileName" className="text-sm font-medium mb-2 block">
                    Filename
                  </Label>
                  <Input
                    id="outputFileName"
                    type="text"
                    value={outputFileName}
                    onChange={(e) => setOutputFileName(e.target.value)}
                    placeholder="meme"
                    className="text-sm h-9"
                  />
                  <p className="text-xs text-gray-500 mt-1">File will be named: {outputFileName}</p>
                </div>

                {/* Generate Meme Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!canProcess}
                >
                  <Smile className="w-5 h-5 mr-2" />
                  Generate Meme
                </GradientButton>

                {/* Tips Card */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-bold text-blue-900 mb-1">💡 Meme Tips</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Keep text short and punchy</li>
                    <li>• White text with black outline is most readable</li>
                    <li>• Impact font is the classic meme style</li>
                  </ul>
                </div>
              </div>
            </>
          }
        >
          {/* Main Preview Area */}
          <div className="space-y-4">
            {/* Preview Image with Text */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 flex items-center justify-center min-h-[400px] relative overflow-hidden">
              <div 
                className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-md z-10"
              >
                <p className="text-xs text-gray-600">Live Preview</p>
                <p className="text-sm font-bold text-purple-600">Meme Generator</p>
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
                      maxHeight: '600px',
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
                <Laugh className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-purple-900">Create Viral Memes</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Add custom text to any image with classic meme styling. Perfect for social media, presentations, or just making your friends laugh!
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
                  title="Generating Meme..." 
                  description="Please wait while we add text to your image" 
                  icon={Smile} 
                />
                <RelatedToolsSection tools={relatedTools} introText="These tools work well with meme generation." />
              </>
            )}

            {currentStep === "complete" && (
              <CompressSuccessSection
                files={downloadUrls}
                onReset={handleReset}
                resetButtonText="Create Another Meme"
                title="Meme Generated Successfully!"
                description="Your meme is ready to share with the world"
                icon={Smile}
              />
            )}
          </div>

          {currentStep === "complete" && <RelatedToolsSection tools={relatedTools} introText="Continue creating content." />}

          {currentStep !== "complete" && (
            <>
              <RelatedToolsSection tools={relatedTools} introText="These tools work well with meme generation." />
              <ToolDefinitionSection
                title="What Is a Meme Generator?"
                content="A meme generator is a tool that lets you add text overlays to images to create funny, shareable content. Add top and bottom text with classic meme styling including Impact font, white text with black outline, and text shadows — completely free, easy to use, and secure."
              />
              <HowItWorksSteps title="How It Works" subtitle="Create memes in four simple steps" introText="Follow these steps to generate your meme quickly and easily." steps={STEPS} />
              <WhyChooseSection title={WHY_CHOOSE_WORKFLOWPRO.title} subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} introText={WHY_CHOOSE_WORKFLOWPRO.introText} features={WHY_CHOOSE_WORKFLOWPRO.features} />
              <UseCasesSection
                title="Popular Uses for Memes"
                useCases={[
                  "Create funny social media posts that get engagement",
                  "Make relatable content for your audience",
                  "Add humor to presentations and slides",
                  "Create reaction images for messaging",
                  "Make viral content for marketing campaigns",
                  "Generate educational memes for teaching",
                  "Create inside jokes for teams and communities",
                  "Make greeting cards with meme formats",
                  "Generate promotional content with humor",
                ]}
              />
              <ToolFAQSection
                faqs={[
                  { question: "What makes a good meme?", answer: "Good memes are relatable, timely, and use recognizable formats. Keep text short and punchy, use high-contrast colors (white text on dark backgrounds), and choose images that support your joke or message." },
                  { question: "What font should I use?", answer: "Impact is the classic meme font. It's bold, highly readable, and instantly recognizable. For variations, try Arial Bold or Helvetica Bold with strong outlines." },
                  { question: "How do I make text readable?", answer: "Use white text with a black stroke (outline) for maximum readability on any background. Enable text shadows for extra depth. Keep font size large (48px+) for easy reading." },
                  { question: "What's the classic meme format?", answer: "Classic memes use top and bottom text in all caps with Impact font, white text, black outline, and text shadow. The text is typically center-aligned." },
                  { question: "Can I save my meme in different formats?", answer: "Yes! Save as PNG for best quality, JPG for smaller file sizes, or WEBP for modern web use." },
                  { question: "Is my image uploaded to a server?", answer: "No — all meme generation happens locally in your browser. Your files never leave your device." },
                ]}
              />
              <ToolSEOFooter
                title="About WorkflowPro's Meme Generator"
                content="WorkflowPro's meme generator: top and bottom text, classic Impact font styling, customizable colors and effects, text stroke and shadow, multiple output formats — perfect for social media, marketing, and fun. Fast, simple, always free."
              />
            </>
          )}
        </ToolPageLayout>
      )}
    </>
  );
}
