/**
 * Color Picker Page
 * 
 * Purpose: Allow users to pick colors from images and get color codes in multiple formats
 * 
 * Features:
 * - Upload single image file (JPG, PNG, WEBP, GIF, BMP, TIFF)
 * - Click anywhere on image to pick colors
 * - Show picked color in multiple formats (HEX, RGB, HSL, CMYK)
 * - Generate color palette from image
 * - Copy color codes to clipboard
 * - Color history tracker
 * - Live preview with crosshair pointer
 * 
 * How it works:
 * 1. User uploads image file
 * 2. Image is displayed with interactive canvas
 * 3. User clicks anywhere on the image to pick a color
 * 4. Color is shown in all formats with copy buttons
 * 5. Color is added to history
 * 6. User can generate a color palette from the image
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
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
import { getImageInfo } from "../../../utils/imageUtils";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { GradientButton } from "../../../components/ui/gradient-button";
import { 
  Upload, Download, X, FilePlus, ImageIcon, Maximize2, Archive, FileEdit,
  RotateCw, FileType, Crop, Palette, Copy, Check, Pipette, Grid3x3, Trash2,
  Sparkles, Info
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
    title: "Click to Pick Colors",
    description: "Click anywhere on the image to instantly pick colors and see them in multiple formats.",
    icon: Pipette,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "View Color Formats",
    description: "See your picked color in HEX, RGB, HSL, and CMYK formats with one-click copy.",
    icon: Palette,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Generate Palette",
    description: "Extract a beautiful color palette from your image with dominant colors.",
    icon: Grid3x3,
    iconBgColor: "from-green-400 to-green-500",
  },
];

interface ColorData {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

interface ColorPickerPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function ColorPickerPage({ onWorkStateChange }: ColorPickerPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit">("upload");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  
  // Original image dimensions
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  
  // Color picking state
  const [currentColor, setCurrentColor] = useState<ColorData | null>(null);
  const [colorHistory, setColorHistory] = useState<ColorData[]>([]);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [generatedPalette, setGeneratedPalette] = useState<ColorData[]>([]);
  const [isGeneratingPalette, setIsGeneratingPalette] = useState(false);
  
  // Canvas and image refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // RGB to HEX conversion
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  // RGB to HSL conversion
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // RGB to CMYK conversion
  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);
    
    if (k === 1) {
      c = m = y = 0;
    } else {
      c = ((c - k) / (1 - k));
      m = ((m - k) / (1 - k));
      y = ((y - k) / (1 - k));
    }

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  // Create color data from RGB
  const createColorData = (r: number, g: number, b: number): ColorData => {
    return {
      hex: rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
      cmyk: rgbToCmyk(r, g, b)
    };
  };

  // Handle canvas click to pick color
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const pixel = imageData.data;

    const colorData = createColorData(pixel[0], pixel[1], pixel[2]);
    setCurrentColor(colorData);

    // Add to history if not already present
    const isDuplicate = colorHistory.some(color => color.hex === colorData.hex);
    if (!isDuplicate) {
      setColorHistory(prev => [colorData, ...prev].slice(0, 10)); // Keep last 10 colors
    }
  };

  // Copy color code to clipboard
  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate color palette from image
  const generatePalette = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGeneratingPalette(true);

    // Simulate palette generation with a delay
    setTimeout(() => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const colorMap = new Map<string, number>();

      // Sample every 10th pixel to reduce processing
      for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const hex = rgbToHex(r, g, b);
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      }

      // Sort by frequency and get top 6 colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      const palette = sortedColors.map(([hex]) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return createColorData(r, g, b);
      });

      setGeneratedPalette(palette);
      setIsGeneratingPalette(false);
    }, 1000);
  };

  // Load image to canvas
  useEffect(() => {
    if (imagePreviewUrl && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
      };
    }
  }, [imagePreviewUrl]);

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
      name: "Edit Image",
      description: "Advanced image editing tools",
      icon: FileEdit,
      onClick: () => window.location.href = "/edit-image",
    },
    {
      name: "Remove Background",
      description: "AI background removal",
      icon: Crop,
      onClick: () => window.location.href = "/remove-background",
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
      name: "Rotate Image",
      description: "Rotate and flip images",
      icon: RotateCw,
      onClick: () => window.location.href = "/rotate-image",
    },
    {
      name: "Add Watermark",
      description: "Add watermark to images",
      icon: ImageIcon,
      onClick: () => window.location.href = "/add-watermark",
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
    const hasWork = files.length > 0;
    onWorkStateChange?.(hasWork);
  }, [files.length, onWorkStateChange]);

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
    setCurrentColor(null);
    setColorHistory([]);
    setGeneratedPalette([]);
  };

  // Go back to upload
  const handleBackToUpload = () => {
    handleRemoveFile();
  };

  // Calculate total file size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Calculate if we should block navigation
  const hasUnsavedWork = files.length > 0;

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/color-picker" />
      <ToolJsonLd path="/color-picker" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded a file. If you leave now, your color picking session will be lost."
        onSamePageClick={handleRemoveFile}
      />

      {/* Header Section - Full Width Above Layout - Hide on Edit Step */}
      {currentStep !== "edit" && (
        <ToolPageHero 
          title="Color Picker" 
          description="Pick colors from any image and get color codes in HEX, RGB, HSL, and CMYK formats. Generate color palettes — completely free and secure."
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
                <h3 className="font-semibold">Picked Color</h3>
                
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
                {/* Current Color Display */}
                {currentColor ? (
                  <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                    <div 
                      className="h-24 w-full"
                      style={{ backgroundColor: currentColor.hex }}
                    />
                    <div className="p-3 space-y-2">
                      {/* HEX */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">HEX</p>
                          <p className="text-sm font-bold text-gray-900">{currentColor.hex.toUpperCase()}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(currentColor.hex, 'hex')}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Copy HEX"
                        >
                          {copiedFormat === 'hex' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* RGB */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">RGB</p>
                          <p className="text-sm font-bold text-gray-900">
                            rgb({currentColor.rgb.r}, {currentColor.rgb.g}, {currentColor.rgb.b})
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`, 'rgb')}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Copy RGB"
                        >
                          {copiedFormat === 'rgb' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* HSL */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">HSL</p>
                          <p className="text-sm font-bold text-gray-900">
                            hsl({currentColor.hsl.h}, {currentColor.hsl.s}%, {currentColor.hsl.l}%)
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)`, 'hsl')}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Copy HSL"
                        >
                          {copiedFormat === 'hsl' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* CMYK */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">CMYK</p>
                          <p className="text-sm font-bold text-gray-900">
                            cmyk({currentColor.cmyk.c}%, {currentColor.cmyk.m}%, {currentColor.cmyk.y}%, {currentColor.cmyk.k}%)
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`cmyk(${currentColor.cmyk.c}%, ${currentColor.cmyk.m}%, ${currentColor.cmyk.y}%, ${currentColor.cmyk.k}%)`, 'cmyk')}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Copy CMYK"
                        >
                          {copiedFormat === 'cmyk' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-dashed border-purple-200 text-center">
                    <Pipette className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-purple-900">Click on the image</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Click anywhere on the image to pick a color
                    </p>
                  </div>
                )}

                {/* Generate Palette Button */}
                <GradientButton
                  onClick={generatePalette}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isGeneratingPalette}
                >
                  <Grid3x3 className="w-5 h-5 mr-2" />
                  {isGeneratingPalette ? "Generating..." : "Generate Color Palette"}
                </GradientButton>

                {/* Generated Palette */}
                {generatedPalette.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Color Palette</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {generatedPalette.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentColor(color)}
                          className="group relative aspect-square rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-all overflow-hidden"
                          style={{ backgroundColor: color.hex }}
                          title={color.hex}
                        >
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 px-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {color.hex}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color History */}
                {colorHistory.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Recent Colors</Label>
                      <button
                        onClick={() => setColorHistory([])}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {colorHistory.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentColor(color)}
                          className="aspect-square rounded border-2 border-gray-200 hover:border-purple-400 transition-all"
                          style={{ backgroundColor: color.hex }}
                          title={color.hex}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips Card */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-bold text-blue-900 mb-1">💡 Pro Tips</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Click anywhere on the image to pick colors</li>
                    <li>• Generate a palette to see dominant colors</li>
                    <li>• Click any color to copy different formats</li>
                  </ul>
                </div>
              </div>
            </>
          }
        >
          {/* Main Preview Area with Color Picker */}
          <div className="space-y-4">
            {/* Interactive Canvas */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 flex items-center justify-center min-h-[400px] relative overflow-hidden">
              <div 
                className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-md z-10"
              >
                <p className="text-xs text-gray-600">Click to Pick Color</p>
                <p className="text-sm font-bold text-purple-600">Interactive Mode</p>
              </div>
              
              <div className="relative">
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
                      onClick={handleCanvasClick}
                      className="max-w-full max-h-full object-contain rounded shadow-lg cursor-crosshair"
                      style={{
                        maxHeight: '500px',
                        width: 'auto',
                        height: 'auto',
                      }}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-purple-900">Interactive Color Picker</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Click anywhere on your image to instantly pick colors. Get color codes in HEX, RGB, HSL, and CMYK formats. Generate a beautiful color palette from your image with one click.
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
          </div>

          <RelatedToolsSection tools={relatedTools} introText="These tools work well with color picking." />
          <ToolDefinitionSection
            title="What Is a Color Picker?"
            content="A color picker is a tool that allows you to extract color values from any point in an image. Get precise color codes in HEX, RGB, HSL, and CMYK formats, generate color palettes, and create perfect color schemes for your design projects — completely free, secure, and private."
          />
          <HowItWorksSteps title="How It Works" subtitle="Pick colors in four simple steps" introText="Follow these steps to pick colors from your image quickly and easily." steps={STEPS} />
          <WhyChooseSection title={WHY_CHOOSE_WORKFLOWPRO.title} subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} introText={WHY_CHOOSE_WORKFLOWPRO.introText} features={WHY_CHOOSE_WORKFLOWPRO.features} />
          <UseCasesSection
            title="Popular Uses for Color Picker"
            useCases={[
              "Extract colors from inspiration images for design projects",
              "Match brand colors from logos and marketing materials",
              "Create color palettes for websites and applications",
              "Identify exact colors from photos for painting or crafts",
              "Generate color schemes for interior design",
              "Match colors for product design and manufacturing",
              "Create accessible color combinations for web design",
              "Extract colors from nature photography for art projects",
              "Build consistent color systems for branding",
            ]}
          />
          <ToolFAQSection
            faqs={[
              { question: "What color formats are supported?", answer: "Our color picker provides color codes in HEX (#RRGGBB), RGB (rgb values), HSL (hue, saturation, lightness), and CMYK (cyan, magenta, yellow, key/black) formats — perfect for web, print, and design work." },
              { question: "How do I generate a color palette?", answer: "After uploading your image, click the 'Generate Color Palette' button. Our tool will analyze your image and extract the 6 most dominant colors, creating a beautiful palette you can use in your designs." },
              { question: "Can I save my picked colors?", answer: "Yes! Recently picked colors are automatically saved to your color history (up to 10 colors). Click any color in the history to select it again, or use the copy buttons to save the codes to your clipboard." },
              { question: "What's the difference between color formats?", answer: "HEX is used for web design, RGB for screen-based work, HSL for intuitive color adjustments, and CMYK for print production. Our tool provides all formats so you can use the right one for your project." },
              { question: "How accurate is the color picker?", answer: "The color picker is pixel-perfect accurate. It reads the exact RGB values from the image pixel you click on and converts them precisely to other color formats." },
              { question: "Is my image uploaded to a server?", answer: "No — all color picking happens locally in your browser. Your files never leave your device." },
            ]}
          />
          <ToolSEOFooter
            title="About WorkflowPro's Color Picker Tool"
            content="WorkflowPro's color picker: extract colors from images, multiple format support (HEX, RGB, HSL, CMYK), generate color palettes, color history, one-click copy — perfect for designers, developers, artists. Fast, simple, always free."
          />
        </ToolPageLayout>
      )}
    </>
  );
}
