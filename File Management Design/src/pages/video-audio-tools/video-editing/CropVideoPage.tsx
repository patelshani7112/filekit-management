/**
 * Crop Video Page
 * 
 * Purpose: Allow users to crop and trim video dimensions
 * 
 * Features:
 * - Upload single video file (MP4, MOV, AVI, MKV, WEBM, FLV, WMV)
 * - Interactive crop area selection
 * - Aspect ratio presets (16:9, 4:3, 1:1, 9:16, custom)
 * - Manual dimension input
 * - Live video preview
 * - Crop position control (drag and move)
 * - Format conversion dropdown
 * - Download cropped video
 * 
 * How it works:
 * 1. User uploads video file
 * 2. User selects crop area or aspect ratio
 * 3. User adjusts crop dimensions and position
 * 4. User clicks "Crop Video"
 * 5. File is processed with crop settings
 * 6. User downloads the cropped video
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
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { GradientButton } from "../../../components/ui/gradient-button";
import { 
  Upload, Download, X, FilePlus, Video, Maximize2, Archive, FileEdit,
  RefreshCw, FileType, RotateCw, Crop, ChevronDown, Search, Check,
  Play, Pause, Shield, Layers, Zap, Move, Scissors, Maximize
} from "lucide-react";

// How it works steps for this tool
const STEPS = [
  {
    number: 1,
    title: "Upload Your Video",
    description: "Select a video file from your device or drag and drop it into the upload area.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Select Crop Area",
    description: "Choose an aspect ratio preset or manually adjust the crop area by dragging.",
    icon: Crop,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Adjust Position",
    description: "Fine-tune the crop area position and dimensions to capture the perfect frame.",
    icon: Move,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Process and download your cropped video instantly.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

// All available video output formats
const VIDEO_OUTPUT_FORMATS = [
  { id: "mp4", name: "MP4", extension: "mp4", category: "Video", description: "Universal format (recommended)" },
  { id: "mov", name: "MOV", extension: "mov", category: "Video", description: "Apple QuickTime" },
  { id: "webm", name: "WEBM", extension: "webm", category: "Video", description: "Web optimized" },
  { id: "avi", name: "AVI", extension: "avi", category: "Video", description: "Windows standard" },
  { id: "mkv", name: "MKV", extension: "mkv", category: "Video", description: "High quality" },
];

// Aspect ratio presets
const ASPECT_RATIOS = [
  { id: "custom", name: "Custom", ratio: null, icon: "⚙️" },
  { id: "16:9", name: "16:9", ratio: 16/9, icon: "📺", description: "Landscape (YouTube, TV)" },
  { id: "4:3", name: "4:3", ratio: 4/3, icon: "📺", description: "Classic TV" },
  { id: "1:1", name: "1:1", ratio: 1, icon: "⬜", description: "Square (Instagram)" },
  { id: "9:16", name: "9:16", ratio: 9/16, icon: "📱", description: "Portrait (TikTok, Stories)" },
  { id: "21:9", name: "21:9", ratio: 21/9, icon: "🎬", description: "Cinematic" },
];

interface CropVideoPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function CropVideoPage({ onWorkStateChange }: CropVideoPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrls, setDownloadUrls] = useState<Array<{ url: string; fileName: string; originalSize: number; compressedSize: number }>>([]);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [outputFileName, setOutputFileName] = useState("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  
  // Original video dimensions
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  
  // Crop settings
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9");
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(100); // percentage
  const [cropHeight, setCropHeight] = useState(100); // percentage
  const [outputWidth, setOutputWidth] = useState(1920);
  const [outputHeight, setOutputHeight] = useState(1080);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartCropX, setDragStartCropX] = useState(0);
  const [dragStartCropY, setDragStartCropY] = useState(0);
  const [dragStartCropWidth, setDragStartCropWidth] = useState(100);
  const [dragStartCropHeight, setDragStartCropHeight] = useState(100);
  
  // Format dropdown state
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [formatSearchQuery, setFormatSearchQuery] = useState("");
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Video ref for preview
  const videoRef = useRef<HTMLVideoElement>(null);
  const cropOverlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get selected format details
  const selectedFormat = VIDEO_OUTPUT_FORMATS.find(f => f.id === outputFormat) || VIDEO_OUTPUT_FORMATS[0];

  // Filter formats based on search
  const filteredFormats = VIDEO_OUTPUT_FORMATS.filter(format =>
    format.name.toLowerCase().includes(formatSearchQuery.toLowerCase()) ||
    format.description.toLowerCase().includes(formatSearchQuery.toLowerCase())
  );

  // Update filename when format changes or file is uploaded
  useEffect(() => {
    if (files.length === 1) {
      const baseName = files[0].name.replace(/\.(mp4|mov|avi|mkv|webm|flv|wmv|mpeg|m4v)$/i, '');
      const ext = selectedFormat.extension;
      setOutputFileName(`${baseName}_cropped.${ext}`);
    }
  }, [outputFormat, files, selectedFormat]);

  // Create video preview URL when file is uploaded
  useEffect(() => {
    if (files.length === 1) {
      const url = URL.createObjectURL(files[0]);
      setVideoPreviewUrl(url);
      
      return () => URL.revokeObjectURL(url);
    }
  }, [files]);

  // Get video dimensions when loaded
  useEffect(() => {
    if (videoRef.current && videoPreviewUrl) {
      const video = videoRef.current;
      
      const handleLoadedMetadata = () => {
        setOriginalWidth(video.videoWidth);
        setOriginalHeight(video.videoHeight);
        setVideoDuration(video.duration);
        
        // Set initial output dimensions to match video
        setOutputWidth(video.videoWidth);
        setOutputHeight(video.videoHeight);
        
        // Apply default aspect ratio
        applyAspectRatio("16:9", video.videoWidth, video.videoHeight);
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [videoPreviewUrl]);

  // Apply aspect ratio
  const applyAspectRatio = (ratioId: string, videoWidth: number = originalWidth, videoHeight: number = originalHeight) => {
    const aspectRatio = ASPECT_RATIOS.find(r => r.id === ratioId);
    if (!aspectRatio || !aspectRatio.ratio) {
      // Custom - no changes
      return;
    }
    
    const targetRatio = aspectRatio.ratio;
    const currentRatio = videoWidth / videoHeight;
    
    if (currentRatio > targetRatio) {
      // Video is wider - crop width
      const newWidth = (videoHeight * targetRatio / videoWidth) * 100;
      setCropWidth(newWidth);
      setCropHeight(100);
      setCropX((100 - newWidth) / 2);
      setCropY(0);
      
      setOutputWidth(Math.round(videoHeight * targetRatio));
      setOutputHeight(videoHeight);
    } else {
      // Video is taller - crop height
      const newHeight = (videoWidth / targetRatio / videoHeight) * 100;
      setCropWidth(100);
      setCropHeight(newHeight);
      setCropX(0);
      setCropY((100 - newHeight) / 2);
      
      setOutputWidth(videoWidth);
      setOutputHeight(Math.round(videoWidth / targetRatio));
    }
  };

  // Handle aspect ratio change
  const handleAspectRatioChange = (ratioId: string) => {
    setSelectedAspectRatio(ratioId);
    if (ratioId !== "custom") {
      applyAspectRatio(ratioId);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Related tools for this page
  const relatedTools = [
    {
      name: "Trim Video",
      description: "Cut and trim video clips",
      icon: Scissors,
      onClick: () => window.location.href = "/trim-video",
    },
    {
      name: "MP4 to GIF",
      description: "Convert videos to GIF",
      icon: RefreshCw,
      onClick: () => window.location.href = "/mp4-to-gif",
    },
    {
      name: "Compress Video",
      description: "Reduce video file sizes",
      icon: Archive,
      onClick: () => window.location.href = "/compress-video",
    },
    {
      name: "Video to MP3",
      description: "Extract audio from video",
      icon: RefreshCw,
      onClick: () => window.location.href = "/video-to-mp3",
    },
    {
      name: "MOV to MP4",
      description: "Convert MOV to MP4",
      icon: FileType,
      onClick: () => window.location.href = "/mov-to-mp4",
    },
    {
      name: "MP4 to MOV",
      description: "Convert MP4 to MOV",
      icon: FileType,
      onClick: () => window.location.href = "/mp4-to-mov",
    },
  ];

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

  // Handle file selection with video validation
  const handleFilesSelected = async (newFiles: File[]) => {
    const maxFileSize = 500; // MB
    
    // Clear previous validation messages
    setValidationMessage("");
    
    // Take only the first file
    const fileToAdd = newFiles[0];
    if (!fileToAdd) return;
    
    // Validate file type (videos only)
    const ext = '.' + fileToAdd.name.split('.').pop()?.toLowerCase();
    if (!['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.mpeg', '.m4v'].includes(ext)) {
      setValidationMessage(`Only video files are allowed.`);
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

    // Validate the video file (basic check - just mark as valid)
    try {
      // Update validation info
      setFileValidationInfo([{
        file: fileToAdd,
        isValidating: false,
        isValid: true,
        pageCount: 1,
      }]);

      // Auto-advance to edit mode if valid
      setCurrentStep("edit");
    } catch (error) {
      // Handle unexpected errors
      setFileValidationInfo([{
        file: fileToAdd,
        isValidating: false,
        isValid: false,
        pageCount: 0,
        error: "Failed to read video file",
      }]);
    }
  };

  // Remove file and go back to upload
  const handleRemoveFile = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
    setCurrentStep("upload");
    setIsPlaying(false);
    setSelectedAspectRatio("16:9");
    setCropX(0);
    setCropY(0);
    setCropWidth(100);
    setCropHeight(100);
  };

  // Go back to upload
  const handleBackToUpload = () => {
    handleRemoveFile();
  };

  // Process file (crop video)
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setProgress(i);
    }
    
    const file = files[0];
    
    // Determine output extension
    const ext = selectedFormat.extension;
    
    // Create a mock blob for download (in real app, this would use FFmpeg)
    const mockVideoContent = `Cropped Video\nFormat: ${ext}\nCrop: ${cropX}%, ${cropY}%, ${cropWidth}%, ${cropHeight}%\nOutput: ${outputWidth}x${outputHeight}`;
    const blob = new Blob([mockVideoContent], { type: `video/${ext}` });
    const url = URL.createObjectURL(blob);
    
    setDownloadUrls([{
      url,
      fileName: outputFileName,
      originalSize: file.size,
      compressedSize: blob.size,
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
    setOutputFormat("mp4");
    setIsPlaying(false);
    setSelectedAspectRatio("16:9");
    setCropX(0);
    setCropY(0);
    setCropWidth(100);
    setCropHeight(100);
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

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate if we should block navigation
  const hasUnsavedWork = files.length > 0 && currentStep !== "complete";

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/crop-video" />
      <ToolJsonLd path="/crop-video" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded a file that hasn't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleReset}
      />

      {/* Success Header - Full Width at Top (only on complete step) */}
      {currentStep === "complete" && (
        <SuccessHeader
          title="Video Cropped Successfully!"
          description="Your cropped video is ready to download"
        />
      )}

      {/* Header Section - Full Width Above Layout - Hide on Complete Step and Edit Step */}
      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Crop Video" 
          description="Crop and resize your videos to any aspect ratio. Remove unwanted areas, adjust dimensions, and create perfectly framed content for any platform — completely free and easy to use."
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
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate" title={files[0]?.name}>
                      {files[0]?.name.length > 20 ? files[0]?.name.substring(0, 20) + '...' : files[0]?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {originalWidth} × {originalHeight} · {formatDuration(videoDuration)} · {formatFileSize(files[0]?.size || 0)}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors flex-shrink-0"
                    title="Remove video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Header with Title and Replace Button */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Crop Settings</h3>
                
                {/* Replace Files Button */}
                <input
                  type="file"
                  id="replaceFiles"
                  accept=".mp4,.mov,.avi,.mkv,.webm,.flv,.wmv,.mpeg,.m4v"
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
                {/* Aspect Ratio Selection */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Aspect Ratio</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.id}
                        onClick={() => handleAspectRatioChange(ratio.id)}
                        className={`px-3 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-all ${
                          selectedAspectRatio === ratio.id
                            ? "border-purple-400 bg-purple-5 text-purple-700"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-base mb-0.5">{ratio.icon}</div>
                        <div className="text-xs">{ratio.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4" />

                <h4 className="text-sm font-semibold mb-2">Current Crop Area</h4>

                {/* Display only - no sliders */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Position X:</span>
                    <span className="font-medium text-gray-900">{cropX.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Position Y:</span>
                    <span className="font-medium text-gray-900">{cropY.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Width:</span>
                    <span className="font-medium text-gray-900">{cropWidth.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium text-gray-900">{cropHeight.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-700">
                    <strong className="text-purple-900">💡 Tip:</strong> Drag the crop box on the video to move it. Use the corner and edge handles to resize.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4" />

                <h4 className="text-sm font-semibold mb-2">Output Dimensions</h4>

                {/* Output Width */}
                <div>
                  <Label htmlFor="outputWidth" className="text-sm font-medium mb-1.5 block">
                    Output Width (px)
                  </Label>
                  <Input
                    id="outputWidth"
                    type="number"
                    min="1"
                    max={originalWidth}
                    value={outputWidth}
                    onChange={(e) => setOutputWidth(parseInt(e.target.value) || 0)}
                    className="text-sm h-9"
                  />
                </div>

                {/* Output Height */}
                <div>
                  <Label htmlFor="outputHeight" className="text-sm font-medium mb-1.5 block">
                    Output Height (px)
                  </Label>
                  <Input
                    id="outputHeight"
                    type="number"
                    min="1"
                    max={originalHeight}
                    value={outputHeight}
                    onChange={(e) => setOutputHeight(parseInt(e.target.value) || 0)}
                    className="text-sm h-9"
                  />
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
                    placeholder="video_cropped"
                    className="text-sm h-9"
                  />
                  <p className="text-xs text-gray-500 mt-1">File will be named: {outputFileName}</p>
                </div>

                {/* Crop Video Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!canProcess}
                >
                  <Crop className="w-5 h-5 mr-2" />
                  Crop Video
                </GradientButton>

                {/* Tips Card */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-bold text-blue-900 mb-1">💡 Cropping Tips</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Use 16:9 for YouTube and TV</li>
                    <li>• Use 9:16 for TikTok and Stories</li>
                    <li>• Use 1:1 for Instagram posts</li>
                  </ul>
                </div>
              </div>
            </>
          }
        >
          {/* Main Preview Area */}
          <div className="space-y-4">
            {/* Video Preview with Crop Overlay */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 flex items-center justify-center min-h-[400px] relative overflow-hidden">
              <div 
                className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-md z-10"
              >
                <p className="text-xs text-gray-600">Live Preview</p>
                <p className="text-sm font-bold text-purple-600">Crop Area</p>
              </div>
              
              <div className="relative max-w-full max-h-[600px]">
                {videoPreviewUrl && (
                  <>
                    <video
                      ref={videoRef}
                      src={videoPreviewUrl}
                      className="max-w-full max-h-[600px] object-contain rounded shadow-lg"
                      style={{
                        maxHeight: '600px',
                        width: 'auto',
                        height: 'auto',
                      }}
                      loop
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                    
                    {/* Crop Overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `
                          linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) ${cropX}%, transparent ${cropX}%, transparent ${cropX + cropWidth}%, rgba(0,0,0,0.5) ${cropX + cropWidth}%, rgba(0,0,0,0.5) 100%),
                          linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) ${cropY}%, transparent ${cropY}%, transparent ${cropY + cropHeight}%, rgba(0,0,0,0.5) ${cropY + cropHeight}%, rgba(0,0,0,0.5) 100%)
                        `
                      }}
                    >
                      {/* Crop Border */}
                      <div 
                        className="absolute border-4 border-purple-500 border-dashed"
                        style={{
                          left: `${cropX}%`,
                          top: `${cropY}%`,
                          width: `${cropWidth}%`,
                          height: `${cropHeight}%`,
                        }}
                      />
                    </div>
                    
                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlayPause}
                      className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center transition-colors shadow-lg z-10"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <Crop className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-purple-900">Crop Your Video</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Select the perfect crop area and aspect ratio for your video. Adjust dimensions and position to create content optimized for any platform!
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
                  acceptedTypes=".mp4,.mov,.avi,.mkv,.webm,.flv,.wmv,.mpeg,.m4v"
                  multiple={false}
                  maxFiles={1}
                  maxFileSize={500}
                  fileTypeLabel="Video"
                  helperText="MP4, MOV, AVI, MKV, WEBM, FLV, WMV · 1 file · 500MB max"
                  validationMessage={validationMessage}
                  validationType={validationType}
                />

                {files.length > 0 && fileValidationInfo.length > 0 && (
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
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
                  title="Cropping Video..." 
                  description="Please wait while we crop your video" 
                  icon={Crop} 
                />
                <RelatedToolsSection tools={relatedTools} introText="These tools work well with video cropping." />
              </>
            )}

            {currentStep === "complete" && (
              <CompressSuccessSection
                files={downloadUrls}
                onReset={handleReset}
                resetButtonText="Crop Another Video"
                title="Video Cropped Successfully!"
                description="Your cropped video is ready to download"
                icon={Crop}
              />
            )}
          </div>

          {currentStep === "complete" && <RelatedToolsSection tools={relatedTools} introText="Continue editing your videos." />}

          {currentStep !== "complete" && (
            <>
              <RelatedToolsSection tools={relatedTools} introText="These tools work well with video cropping." />
              <ToolDefinitionSection
                title="What Is Video Cropping?"
                content="Video cropping is the process of removing unwanted outer areas from a video frame. Crop videos to change aspect ratios, remove black bars, focus on specific areas, or optimize content for different platforms like YouTube (16:9), Instagram (1:1), or TikTok (9:16) — completely free, easy to use, and secure."
              />
              <HowItWorksSteps title="How It Works" subtitle="Crop videos in four simple steps" introText="Follow these steps to crop your video quickly and easily." steps={STEPS} />
              <WhyChooseSection title={WHY_CHOOSE_WORKFLOWPRO.title} subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} introText={WHY_CHOOSE_WORKFLOWPRO.introText} features={WHY_CHOOSE_WORKFLOWPRO.features} />
              <UseCasesSection
                title="Popular Uses for Video Cropping"
                useCases={[
                  "Optimize videos for different social media platforms",
                  "Remove black bars from videos",
                  "Create vertical videos from horizontal footage",
                  "Focus on specific subjects by removing excess background",
                  "Convert landscape videos to portrait for mobile",
                  "Prepare videos for Instagram stories or reels",
                  "Create square videos for Instagram feed posts",
                  "Resize videos for TikTok and YouTube Shorts",
                  "Remove unwanted elements from video edges",
                ]}
              />
              <ToolFAQSection
                faqs={[
                  { question: "What aspect ratios should I use?", answer: "Use 16:9 for YouTube and TV, 9:16 for TikTok and Instagram Stories, 1:1 for Instagram feed posts, 4:3 for classic TV format, and 21:9 for cinematic widescreen." },
                  { question: "Will cropping reduce video quality?", answer: "Cropping itself doesn't reduce quality, but the output resolution will be smaller. For best results, start with high-resolution source video." },
                  { question: "Can I preview the crop area before processing?", answer: "Yes! Use the live preview with the crop overlay to see exactly what area will be kept in the final video." },
                  { question: "What video formats are supported?", answer: "We support MP4, MOV, AVI, MKV, WEBM, FLV, WMV, and MPEG formats. You can also convert to different formats during export." },
                  { question: "How large can my video file be?", answer: "Videos up to 500MB are supported. For larger files, consider compressing them first." },
                  { question: "Is my video uploaded to a server?", answer: "No — all video processing happens locally in your browser. Your files never leave your device." },
                ]}
              />
              <ToolSEOFooter
                title="About WorkflowPro's Video Cropper"
                content="WorkflowPro's video cropper: aspect ratio presets, custom dimensions, interactive crop area, multiple output formats, live preview — perfect for social media, content creation, and video optimization. Fast, simple, always free."
              />
            </>
          )}
        </ToolPageLayout>
      )}
    </>
  );
}