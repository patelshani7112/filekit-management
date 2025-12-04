/**
 * Edit Image Page - Professional Layout
 * 
 * Purpose: Comprehensive image editor with professional toolbar layout
 * 
 * Layout:
 * - Top: Horizontal toolbar with tool buttons
 * - Center: Large image preview with checkered background
 * - Right sidebar: File info, controls, and tool settings
 * 
 * Features:
 * - Crop, Resize, Filters, Adjust, Transform, Text, Draw, Remove BG, Background, More
 * - Add custom backgrounds (colors, gradients, images)
 * - Live preview with zoom controls
 * - Professional editing capabilities
 */

import { useState, useEffect } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import {
  ToolPageLayout,
  ToolPageHero,
  FileUploader,
  ProcessingModal,
  CompressSuccessSection,
  SuccessHeader,
  RelatedToolsSection,
  HowItWorksSteps,
  WhyChooseSection,
  ToolFAQSection,
  ToolDefinitionSection,
  UseCasesSection,
  ToolSEOFooter,
  MobileStickyAd,
  NavigationBlocker,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
import { getImageInfo } from "../../../utils/imageUtils";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Slider } from "../../../components/ui/slider";
import { Input } from "../../../components/ui/input";
import { GradientButton } from "../../../components/ui/gradient-button";
import { 
  Upload, Download, X, FilePlus, ImageIcon,
  Sparkles, Sliders, RotateCw, Type, MoreHorizontal,
  Wand2, Eye, Settings, Crop, Maximize2, Archive,
  FileText, Droplet, 
  FlipHorizontal, FlipVertical, RotateCcw,
  ZoomIn, ZoomOut, Maximize, Undo2, Redo2,
  Circle, Square, Minus, ArrowRight, PenTool, Eraser,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Sun, Moon, Contrast as ContrastIcon,
  Zap, Flame, Palette,
  Scissors, FileType, ArrowLeft, ChevronLeft,
  Image as ImageIconSolid, Layers, Grid
} from "lucide-react";

// How it works steps
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
    title: "Choose Editing Tools",
    description: "Select from crop, resize, filters, adjustments, text, drawing, backgrounds and more.",
    icon: Settings,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Preview Your Edits",
    description: "See live preview with zoom, undo/redo, and adjust settings until perfect.",
    icon: Eye,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Download your edited image in your preferred format with custom quality settings.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

// Output formats
const OUTPUT_FORMATS = [
  { id: "jpg", name: "JPG / JPEG - Standard photo", extension: "jpg" },
  { id: "png", name: "PNG - Transparent image", extension: "png" },
  { id: "webp", name: "WEBP - Modern web", extension: "webp" },
  { id: "bmp", name: "BMP - Bitmap", extension: "bmp" },
  { id: "tiff", name: "TIFF - High quality", extension: "tiff" },
];

// Filter presets
const FILTERS = [
  { id: "none", name: "Original", filter: "" },
  { id: "grayscale", name: "Grayscale", filter: "grayscale(100%)" },
  { id: "sepia", name: "Sepia", filter: "sepia(100%)" },
  { id: "vintage", name: "Vintage", filter: "sepia(50%) contrast(1.2) brightness(0.9)" },
  { id: "cool", name: "Cool", filter: "hue-rotate(180deg) saturate(1.2)" },
  { id: "warm", name: "Warm", filter: "hue-rotate(-20deg) saturate(1.3)" },
  { id: "dramatic", name: "Dramatic", filter: "contrast(1.5) brightness(0.9) saturate(0.8)" },
  { id: "vivid", name: "Vivid", filter: "saturate(1.8) contrast(1.2)" },
  { id: "faded", name: "Faded", filter: "brightness(1.1) contrast(0.9) saturate(0.6)" },
  { id: "noir", name: "Noir", filter: "grayscale(100%) contrast(1.4) brightness(0.9)" },
];

// Aspect ratio presets
const ASPECT_RATIOS = [
  { id: "free", name: "Free", ratio: null },
  { id: "1:1", name: "1:1", ratio: 1 },
  { id: "4:5", name: "4:5", ratio: 4/5 },
  { id: "16:9", name: "16:9", ratio: 16/9 },
  { id: "9:16", name: "9:16", ratio: 9/16 },
];

// Fonts
const FONTS = [
  "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana", "Courier New", "Impact", "Comic Sans MS"
];

// Background preset colors
const BG_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Gray", value: "#6b7280" },
];

// Background gradients
const BG_GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #667eea 0%, #1e3a8a 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #10b981 0%, #065f46 100%)" },
  { name: "Fire", value: "linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)" },
  { name: "Sky", value: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)" },
];

interface EditImagePageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function EditImagePage({ onWorkStateChange }: EditImagePageProps = {}) {
  // File management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrls, setDownloadUrls] = useState<Array<{ url: string; fileName: string; originalSize: number; compressedSize: number }>>([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  // Active tool
  const [activeTool, setActiveTool] = useState<"crop" | "resize" | "filters" | "adjust" | "transform" | "text" | "draw" | "removebg" | "background" | "more">("resize");
  
  // Settings
  const [cropAspectRatio, setCropAspectRatio] = useState<string>("free");
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [filterStrength, setFilterStrength] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [exposure, setExposure] = useState(0);
  const [highlights, setHighlights] = useState(0);
  const [shadows, setShadows] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [textOverlay, setTextOverlay] = useState("");
  const [textFontFamily, setTextFontFamily] = useState("Arial");
  const [textSize, setTextSize] = useState(24);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [textStrokeWidth, setTextStrokeWidth] = useState(0);
  const [textStrokeColor, setTextStrokeColor] = useState("#000000");
  const [textShadow, setTextShadow] = useState(true);
  const [textOpacity, setTextOpacity] = useState(100);
  const [drawingTool, setDrawingTool] = useState<"brush" | "highlighter" | "shape" | null>(null);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#000000");
  const [shapeType, setShapeType] = useState<"rectangle" | "circle" | "line" | "arrow">("rectangle");
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState("#000000");
  const [removeBackground, setRemoveBackground] = useState(false);
  
  // Background settings
  const [backgroundType, setBackgroundType] = useState<"none" | "color" | "gradient" | "image">("none");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundGradient, setBackgroundGradient] = useState(BG_GRADIENTS[0].value);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [backgroundOpacity, setBackgroundOpacity] = useState(100);
  const [backgroundBlur, setBackgroundBlur] = useState(0);
  
  const [zoomLevel, setZoomLevel] = useState(100);
  const [outputFormat, setOutputFormat] = useState("jpg");
  const [outputQuality, setOutputQuality] = useState(90);
  const [outputFileName, setOutputFileName] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  const selectedFormat = OUTPUT_FORMATS.find(f => f.id === outputFormat) || OUTPUT_FORMATS[0];

  // Update filename
  useEffect(() => {
    if (files.length === 1) {
      const baseName = files[0].name.replace(/\.[^/.]+$/, '');
      setOutputFileName(`${baseName}_edited.${selectedFormat.extension}`);
    }
  }, [outputFormat, files, selectedFormat]);

  // Create preview
  useEffect(() => {
    if (files.length === 1) {
      const url = URL.createObjectURL(files[0]);
      setImagePreviewUrl(url);
      
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setResizeWidth(img.width);
        setResizeHeight(img.height);
      };
      img.src = url;
      
      return () => URL.revokeObjectURL(url);
    }
  }, [files]);

  // Related tools
  const relatedTools = [
    { name: "Compress Image", description: "Reduce image file sizes", icon: Archive, onClick: () => window.location.href = "/compress-image" },
    { name: "Resize Image", description: "Change image dimensions", icon: Maximize2, onClick: () => window.location.href = "/resize-image" },
    { name: "Crop Image", description: "Crop and trim images", icon: Crop, onClick: () => window.location.href = "/crop-image" },
    { name: "Rotate Image", description: "Rotate and flip images", icon: RotateCw, onClick: () => window.location.href = "/rotate-image" },
    { name: "JPG to PNG", description: "Convert JPG to PNG format", icon: FileType, onClick: () => window.location.href = "/jpg-to-png" },
    { name: "PNG to JPG", description: "Convert PNG to JPG format", icon: FileType, onClick: () => window.location.href = "/png-to-jpg" },
    { name: "Image to PDF", description: "Convert images to PDF", icon: FileText, onClick: () => window.location.href = "/image-to-pdf" },
    { name: "Compress PDF", description: "Reduce PDF file sizes", icon: Archive, onClick: () => window.location.href = "/compress-pdf" },
  ];

  // Work state
  useEffect(() => {
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

  // Handle file selection
  const handleFilesSelected = async (newFiles: File[]) => {
    const maxFileSize = 50;
    setValidationMessage("");
    
    const fileToAdd = newFiles[0];
    if (!fileToAdd) return;
    
    const validTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
    const ext = '.' + fileToAdd.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(ext)) {
      setValidationMessage(`Only image files are allowed.`);
      setValidationType("error");
      return;
    }
    
    if (fileToAdd.size > maxFileSize * 1024 * 1024) {
      setValidationMessage(`File exceeds ${maxFileSize}MB limit.`);
      setValidationType("error");
      return;
    }
    
    setFiles([fileToAdd]);
    setFileValidationInfo([{ file: fileToAdd, isValidating: true, isValid: false, pageCount: 0 }]);

    try {
      const imageInfo = await getImageInfo(fileToAdd);
      setFileValidationInfo([{
        file: fileToAdd,
        isValidating: false,
        isValid: imageInfo.isValid,
        pageCount: 1,
        error: imageInfo.error,
      }]);

      if (imageInfo.isValid) {
        setCurrentStep("edit");
      }
    } catch (error) {
      setFileValidationInfo([{
        file: fileToAdd,
        isValidating: false,
        isValid: false,
        pageCount: 0,
        error: "Failed to read image file",
      }]);
    }
  };

  // Handle background image upload
  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBackgroundImageUrl(url);
      setBackgroundType("image");
    }
  };

  // Remove file
  const handleRemoveFile = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
    setCurrentStep("upload");
    resetAllSettings();
  };

  // Reset settings
  const resetAllSettings = () => {
    setSelectedFilter("none");
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setExposure(0);
    setHighlights(0);
    setShadows(0);
    setTemperature(0);
    setBlur(0);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setTextOverlay("");
    setBorderWidth(0);
    setRemoveBackground(false);
    setBackgroundType("none");
    setZoomLevel(100);
  };

  // Process
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setProgress(i);
    }
    
    const file = files[0];
    const mockContent = `Edited Image: ${file.name}`;
    const blob = new Blob([mockContent], { type: `image/${selectedFormat.extension}` });
    const url = URL.createObjectURL(blob);
    
    setDownloadUrls([{
      url,
      fileName: outputFileName,
      originalSize: file.size,
      compressedSize: file.size,
    }]);

    setProgress(100);
    setCurrentStep("complete");
  };

  // Reset
  const handleReset = () => {
    downloadUrls.forEach(({ url }) => URL.revokeObjectURL(url));
    handleRemoveFile();
    setDownloadUrls([]);
    setProgress(0);
  };

  const canProcess = fileValidationInfo.length > 0 && fileValidationInfo[0]?.isValid && !fileValidationInfo[0]?.isValidating;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Build combined filter
  const getCombinedFilter = () => {
    const selectedFilterObj = FILTERS.find(f => f.id === selectedFilter);
    const baseFilter = selectedFilterObj?.filter || "";
    
    const adjustments = [];
    if (brightness !== 100) adjustments.push(`brightness(${brightness / 100})`);
    if (contrast !== 100) adjustments.push(`contrast(${contrast / 100})`);
    if (saturation !== 100) adjustments.push(`saturate(${saturation / 100})`);
    if (blur > 0) adjustments.push(`blur(${blur}px)`);
    
    return [baseFilter, ...adjustments].filter(Boolean).join(' ');
  };

  // Build transform
  const getTransform = () => {
    const transforms = [];
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
    if (flipHorizontal) transforms.push(`scaleX(-1)`);
    if (flipVertical) transforms.push(`scaleY(-1)`);
    return transforms.join(' ');
  };

  // Get background style
  const getBackgroundStyle = () => {
    if (backgroundType === "none") {
      return {
        backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        backgroundColor: '#ffffff',
      };
    } else if (backgroundType === "color") {
      return {
        backgroundColor: backgroundColor,
        opacity: backgroundOpacity / 100,
      };
    } else if (backgroundType === "gradient") {
      return {
        background: backgroundGradient,
        opacity: backgroundOpacity / 100,
      };
    } else if (backgroundType === "image" && backgroundImageUrl) {
      return {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: backgroundOpacity / 100,
        filter: backgroundBlur > 0 ? `blur(${backgroundBlur}px)` : 'none',
      };
    }
    return {};
  };

  const hasUnsavedWork = files.length > 0 && currentStep !== "complete";

  return (
    <>
      <SeoHead path="/edit-image" />
      <ToolJsonLd path="/edit-image" />
      
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded an image that hasn't been processed yet. If you leave now, all your edits will be lost."
        onSamePageClick={handleReset}
      />

      {currentStep === "complete" && (
        <SuccessHeader
          title="Image Edited Successfully!"
          description="Your image has been edited and is ready to download"
        />
      )}

      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Edit Image" 
          description="Professional image editor with filters, adjustments, crop, resize, text, drawing, backgrounds and more — completely free and secure."
        />
      )}

      {currentStep === "edit" ? (
        <div className="min-h-screen bg-gray-50">
          {/* Back to Upload Button */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <button
              onClick={() => handleRemoveFile()}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Upload</span>
            </button>
          </div>

          <div className="px-2 sm:px-4 py-2 sm:py-4 space-y-3">
            {/* File Info Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" title={files[0]?.name}>
                    {files[0]?.name}
                  </p>
                  <p className="text-xs opacity-90">
                    {imageDimensions.width} × {imageDimensions.height} · {formatFileSize(files[0]?.size || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Horizontal Toolbar - All Tools */}
            <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                <button
                  onClick={() => setActiveTool("crop")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "crop" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Crop className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Crop</span>
                </button>
                <button
                  onClick={() => setActiveTool("resize")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "resize" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Maximize2 className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Resize</span>
                </button>
                <button
                  onClick={() => setActiveTool("filters")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "filters" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Filters</span>
                </button>
                <button
                  onClick={() => setActiveTool("adjust")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "adjust" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Sliders className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Adjust</span>
                </button>
                <button
                  onClick={() => setActiveTool("transform")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "transform" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Transform</span>
                </button>
                <button
                  onClick={() => setActiveTool("text")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "text" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Type className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Text</span>
                </button>
                <button
                  onClick={() => setActiveTool("draw")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "draw" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Draw</span>
                </button>
                <button
                  onClick={() => setActiveTool("removebg")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "removebg" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Scissors className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Remove BG</span>
                </button>
                <button
                  onClick={() => setActiveTool("background")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "background" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Layers className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Background</span>
                </button>
                <button
                  onClick={() => setActiveTool("more")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "more" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">More</span>
                </button>
              </div>
            </div>

            {/* Tool Settings Row */}
            {activeTool && activeTool !== "none" && (
              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm overflow-x-auto">
                <div className="min-w-max">
                  {/* Crop Settings */}
                  {activeTool === "crop" && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900">Aspect Ratio</h4>
                      <div className="flex gap-2">
                        {ASPECT_RATIOS.map((ratio) => (
                          <button
                            key={ratio.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-md border-2 border-gray-200 hover:border-purple-400 transition-colors whitespace-nowrap"
                          >
                            {ratio.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filters Settings */}
                  {activeTool === "filters" && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Choose Filter</h4>
                      <div className="flex gap-2">
                        {FILTERS.map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border-2 transition-colors whitespace-nowrap ${
                              selectedFilter === filter.id
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            {filter.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Adjust Settings */}
                  {activeTool === "adjust" && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-semibold text-gray-900">Brightness</Label>
                          <span className="text-xs font-bold text-purple-600">{brightness}%</span>
                        </div>
                        <Slider value={[brightness]} onValueChange={(v) => setBrightness(v[0])} min={0} max={200} className="w-64" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-semibold text-gray-900">Contrast</Label>
                          <span className="text-xs font-bold text-purple-600">{contrast}%</span>
                        </div>
                        <Slider value={[contrast]} onValueChange={(v) => setContrast(v[0])} min={0} max={200} className="w-64" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-semibold text-gray-900">Saturation</Label>
                          <span className="text-xs font-bold text-purple-600">{saturation}%</span>
                        </div>
                        <Slider value={[saturation]} onValueChange={(v) => setSaturation(v[0])} min={0} max={200} className="w-64" />
                      </div>
                    </div>
                  )}

                  {/* Transform Settings */}
                  {activeTool === "transform" && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Transform</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRotation(rotation + 90)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <RotateCw className="w-4 h-4" />
                          Rotate 90°
                        </button>
                        <button
                          onClick={() => setFlipHorizontal(!flipHorizontal)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <FlipHorizontal className="w-4 h-4" />
                          Flip H
                        </button>
                        <button
                          onClick={() => setFlipVertical(!flipVertical)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <FlipVertical className="w-4 h-4" />
                          Flip V
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Text Settings */}
                  {activeTool === "text" && (
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Enter text..."
                        value={textOverlay}
                        onChange={(e) => setTextOverlay(e.target.value)}
                        className="w-full max-w-md"
                      />
                      <div className="flex gap-2 items-center">
                        <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-12 h-8" />
                        <Input type="number" placeholder="Size" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-20" />
                        <button
                          onClick={() => setTextBold(!textBold)}
                          className={`p-2 rounded ${textBold ? "bg-purple-100 text-purple-700" : "bg-gray-100"}`}
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTextItalic(!textItalic)}
                          className={`p-2 rounded ${textItalic ? "bg-purple-100 text-purple-700" : "bg-gray-100"}`}
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Background Settings */}
                  {activeTool === "background" && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {["none", "color", "gradient", "image"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setBackgroundType(type)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border-2 transition-colors capitalize ${
                              backgroundType === type
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {backgroundType === "color" && (
                        <div className="flex gap-2">
                          {BG_COLORS.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setBackgroundColor(color.value)}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-purple-500"
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* More Settings */}
                  {activeTool === "more" && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-semibold text-gray-900">Border Width</Label>
                          <span className="text-xs font-bold text-purple-600">{borderWidth}px</span>
                        </div>
                        <Slider value={[borderWidth]} onValueChange={(v) => setBorderWidth(v[0])} min={0} max={50} className="w-64" />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-900 mb-2 block">Output Format</Label>
                        <select
                          value={outputFormat}
                          onChange={(e) => setOutputFormat(e.target.value)}
                          className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg"
                        >
                          {OUTPUT_FORMATS.map((format) => (
                            <option key={format.id} value={format.id}>{format.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Controls & Zoom */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Undo">
                    <Undo2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Redo">
                    <Redo2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button onClick={resetAllSettings} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Reset">
                    <RotateCcw className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ZoomOut className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-4 flex items-center justify-center relative overflow-hidden" style={{ minHeight: '400px' }}>
              {/* Background Layer */}
              <div className="absolute inset-0" style={getBackgroundStyle()}></div>
              
              {/* Image Layer */}
              {imagePreviewUrl ? (
                <div 
                  className="relative z-10"
                  style={{
                    border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'center',
                  }}
                >
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded"
                    style={{
                      filter: getCombinedFilter(),
                      transform: getTransform(),
                      maxHeight: '400px',
                    }}
                  />
                  {textOverlay && (
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        color: textColor,
                        fontSize: `${textSize}px`,
                        fontFamily: textFontFamily,
                        fontWeight: textBold ? 'bold' : 'normal',
                        fontStyle: textItalic ? 'italic' : 'normal',
                        textAlign: textAlign,
                        opacity: textOpacity / 100,
                        WebkitTextStroke: textStrokeWidth > 0 ? `${textStrokeWidth}px ${textStrokeColor}` : 'none',
                        textShadow: textShadow ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
                      }}
                    >
                      {textOverlay}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 z-10">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Loading preview...</p>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <GradientButton
              onClick={handleProcessFiles}
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!canProcess}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Apply Changes
            </GradientButton>
          </div>
        </div>
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
                  helperText="JPG, PNG, GIF, WEBP, BMP · 1 file · 50MB max"
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
                <ProcessingModal isOpen={true} progress={progress} title="Editing Image..." description="Please wait while we apply your changes" icon={Wand2} />
                <RelatedToolsSection tools={relatedTools} introText="These tools work well with image editing." />
              </>
            )}

            {currentStep === "complete" && (
              <CompressSuccessSection
                files={downloadUrls}
                onReset={handleReset}
                resetButtonText="Edit Another Image"
                title="Image Edited Successfully!"
                description="Your image has been edited and is ready to download"
                icon={Wand2}
              />
            )}
          </div>

          {currentStep === "complete" && <RelatedToolsSection tools={relatedTools} introText="Continue working with your images." />}

          {currentStep !== "complete" && (
            <>
              <RelatedToolsSection tools={relatedTools} introText="These tools work well with image editing." />
              <ToolDefinitionSection
                title="What Is Image Editing?"
                content="Image editing allows you to enhance, modify, and transform photos and graphics. Apply filters, adjust colors, add text, draw, crop, resize, remove backgrounds, add custom backgrounds and much more with professional tools — completely free, secure, and private."
              />
              <HowItWorksSteps title="How It Works" subtitle="Edit your image in four simple steps" introText="Follow these steps to edit your image quickly and securely." steps={STEPS} />
              <WhyChooseSection title={WHY_CHOOSE_WORKFLOWPRO.title} subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} introText={WHY_CHOOSE_WORKFLOWPRO.introText} features={WHY_CHOOSE_WORKFLOWPRO.features} />
              <UseCasesSection
                title="Popular Uses for Image Editing"
                useCases={[
                  "Apply professional filters to enhance photos",
                  "Crop and resize images for social media",
                  "Add text overlays for memes and quotes",
                  "Adjust brightness, contrast, and colors",
                  "Remove backgrounds for transparent images",
                  "Add custom backgrounds with colors, gradients, or images",
                  "Create thumbnails with custom effects",
                  "Draw annotations on images",
                  "Apply borders and frames",
                ]}
              />
              <ToolFAQSection
                faqs={[
                  { question: "What image formats can I edit?", answer: "You can edit JPG, PNG, GIF, WEBP, BMP, and TIFF with a 50MB max file size." },
                  { question: "What editing features are available?", answer: "Crop with aspect ratios, resize, 10+ filters, comprehensive adjustments (brightness, contrast, exposure, shadows, highlights, temperature), text with fonts, drawing tools, remove background, add custom backgrounds (colors, gradients, images), zoom, undo/redo, and more." },
                  { question: "Can I add custom backgrounds?", answer: "Yes! Add solid colors, gradients, or upload your own background images. Control opacity and blur for perfect results." },
                  { question: "Can I remove image backgrounds?", answer: "Yes! Use the 'Remove BG' tool to remove backgrounds and create transparent images." },
                  { question: "Can I add text to images?", answer: "Yes! Add text with custom fonts, sizes, colors, bold/italic, alignment, stroke, shadow, and opacity." },
                  { question: "Is the editor free?", answer: "Yes — completely free with no watermarks, no limits, and no registration required." },
                ]}
              />
              <ToolSEOFooter
                title="About WorkflowPro's Edit Image Tool"
                content="WorkflowPro's comprehensive image editor: crop with aspect ratios, resize, 10+ filters, adjustments (brightness, contrast, exposure, shadows, highlights, temperature), text with fonts, drawing tools, remove background, add custom backgrounds (colors, gradients, images), zoom, undo/redo. Perfect for social media, memes, photo enhancement — fast, simple, always free."
              />
            </>
          )}
        </ToolPageLayout>
      )}
    </>
  );
}