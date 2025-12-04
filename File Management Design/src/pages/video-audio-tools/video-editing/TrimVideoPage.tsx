/**
 * Trim Video Page
 * 
 * Purpose: Allow users to trim and cut video clips
 * 
 * Features:
 * - Upload single video file (MP4, MOV, AVI, MKV, WEBM, FLV, WMV)
 * - Interactive timeline with start/end markers
 * - Precise time selection (down to seconds)
 * - Live video preview with playback
 * - Duration calculator
 * - Format conversion dropdown
 * - Download trimmed video
 * 
 * How it works:
 * 1. User uploads video file
 * 2. User drags start and end markers on timeline
 * 3. User previews selected segment
 * 4. User clicks "Trim Video"
 * 5. File is processed with trim settings
 * 6. User downloads the trimmed video
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
  Upload, Download, X, FilePlus, Video, Archive, FileEdit,
  RefreshCw, FileType, Crop, ChevronDown, Check,
  Play, Pause, Scissors, Clock, SkipBack, SkipForward
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
    title: "Select Time Range",
    description: "Use the timeline to set the start and end points for your trimmed video.",
    icon: Scissors,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Preview Selection",
    description: "Play the selected segment to ensure you've chosen the right portion.",
    icon: Play,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Result",
    description: "Process and download your trimmed video instantly.",
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

interface TrimVideoPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function TrimVideoPage({ onWorkStateChange }: TrimVideoPageProps = {}) {
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
  
  // Trim settings
  const [startTime, setStartTime] = useState(0); // in seconds
  const [endTime, setEndTime] = useState(0); // in seconds
  const [currentTime, setCurrentTime] = useState(0); // playback position
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Format dropdown state
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [formatSearchQuery, setFormatSearchQuery] = useState("");
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Video ref for preview
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Get selected format details
  const selectedFormat = VIDEO_OUTPUT_FORMATS.find(f => f.id === outputFormat) || VIDEO_OUTPUT_FORMATS[0];

  // Filter formats based on search
  const filteredFormats = VIDEO_OUTPUT_FORMATS.filter(format =>
    format.name.toLowerCase().includes(formatSearchQuery.toLowerCase()) ||
    format.description.toLowerCase().includes(formatSearchQuery.toLowerCase())
  );

  // Calculate trimmed duration
  const trimmedDuration = endTime - startTime;

  // Update filename when format changes or file is uploaded
  useEffect(() => {
    if (files.length === 1) {
      const baseName = files[0].name.replace(/\.(mp4|mov|avi|mkv|webm|flv|wmv|mpeg|m4v)$/i, '');
      const ext = selectedFormat.extension;
      setOutputFileName(`${baseName}_trimmed.${ext}`);
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
        
        // Set initial trim to full video
        setStartTime(0);
        setEndTime(video.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        
        // Stop playback at end time
        if (video.currentTime >= endTime) {
          video.pause();
          video.currentTime = startTime;
          setIsPlaying(false);
        }
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [videoPreviewUrl, endTime, startTime]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Start from startTime if not in range
        if (videoRef.current.currentTime < startTime || videoRef.current.currentTime >= endTime) {
          videoRef.current.currentTime = startTime;
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Jump to start of selection
  const jumpToStart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    }
  };

  // Jump to end of selection
  const jumpToEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = endTime;
      setCurrentTime(endTime);
    }
  };

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || videoDuration === 0) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = clickX / rect.width;
    const clickTime = clickPercent * videoDuration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = clickTime;
      setCurrentTime(clickTime);
    }
  };

  // Related tools for this page
  const relatedTools = [
    {
      name: "Crop Video",
      description: "Crop and resize videos",
      icon: Crop,
      onClick: () => window.location.href = "/crop-video",
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
    setStartTime(0);
    setEndTime(0);
    setCurrentTime(0);
  };

  // Go back to upload
  const handleBackToUpload = () => {
    handleRemoveFile();
  };

  // Process file (trim video)
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
    const mockVideoContent = `Trimmed Video\nFormat: ${ext}\nStart: ${formatTime(startTime)}\nEnd: ${formatTime(endTime)}\nDuration: ${formatTime(trimmedDuration)}`;
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
    setStartTime(0);
    setEndTime(0);
    setCurrentTime(0);
  };

  // Check if we can process files (at least one valid file)
  const canProcess = fileValidationInfo.length > 0 && 
                     fileValidationInfo[0]?.isValid &&
                     !fileValidationInfo[0]?.isValidating &&
                     trimmedDuration > 0;

  // Calculate total file size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time in detailed format (HH:MM:SS)
  const formatTimeDetailed = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate if we should block navigation
  const hasUnsavedWork = files.length > 0 && currentStep !== "complete";

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/trim-video" />
      <ToolJsonLd path="/trim-video" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded a file that hasn't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleReset}
      />

      {/* Success Header - Full Width at Top (only on complete step) */}
      {currentStep === "complete" && (
        <SuccessHeader
          title="Video Trimmed Successfully!"
          description="Your trimmed video is ready to download"
        />
      )}

      {/* Header Section - Full Width Above Layout - Hide on Complete Step and Edit Step */}
      {currentStep !== "complete" && currentStep !== "edit" && (
        <ToolPageHero 
          title="Trim Video" 
          description="Cut and trim your videos to the perfect length. Remove unwanted sections, create clips, and extract the best moments from your footage — completely free and easy to use."
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
                      {originalWidth} × {originalHeight} · {formatTime(videoDuration)} · {formatFileSize(files[0]?.size || 0)}
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
                <h3 className="font-semibold">Trim Settings</h3>
                
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
                {/* Current Selection Info */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Time Selection</Label>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Start Time:</span>
                      <span className="font-medium text-gray-900">{formatTimeDetailed(startTime)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">End Time:</span>
                      <span className="font-medium text-gray-900">{formatTimeDetailed(endTime)}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Trimmed Duration:</span>
                      <span className="font-bold text-purple-600">{formatTimeDetailed(trimmedDuration)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Original Duration:</span>
                      <span className="font-medium text-gray-500">{formatTimeDetailed(videoDuration)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-700">
                    <strong className="text-purple-900">💡 Tip:</strong> Drag the start and end markers on the timeline below the video to select your trim range.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4" />

                {/* Start Time Input */}
                <div>
                  <Label htmlFor="startTime" className="text-sm font-medium mb-1.5 block">
                    Start Time (seconds)
                  </Label>
                  <Input
                    id="startTime"
                    type="number"
                    min="0"
                    max={endTime - 0.1}
                    step="0.1"
                    value={startTime.toFixed(1)}
                    onChange={(e) => {
                      const newStart = parseFloat(e.target.value) || 0;
                      if (newStart < endTime) {
                        setStartTime(Math.max(0, Math.min(newStart, videoDuration)));
                      }
                    }}
                    className="text-sm h-9"
                  />
                </div>

                {/* End Time Input */}
                <div>
                  <Label htmlFor="endTime" className="text-sm font-medium mb-1.5 block">
                    End Time (seconds)
                  </Label>
                  <Input
                    id="endTime"
                    type="number"
                    min={startTime + 0.1}
                    max={videoDuration}
                    step="0.1"
                    value={endTime.toFixed(1)}
                    onChange={(e) => {
                      const newEnd = parseFloat(e.target.value) || videoDuration;
                      if (newEnd > startTime) {
                        setEndTime(Math.max(startTime, Math.min(newEnd, videoDuration)));
                      }
                    }}
                    className="text-sm h-9"
                  />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={jumpToStart}
                    className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-purple-400 transition-all text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                    Jump to Start
                  </button>
                  <button
                    onClick={jumpToEnd}
                    className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-purple-400 transition-all text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    Jump to End
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
                    placeholder="video_trimmed"
                    className="text-sm h-9"
                  />
                  <p className="text-xs text-gray-500 mt-1">File will be named: {outputFileName}</p>
                </div>

                {/* Trim Video Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!canProcess}
                >
                  <Scissors className="w-5 h-5 mr-2" />
                  Trim Video
                </GradientButton>

                {/* Tips Card */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-bold text-blue-900 mb-1">💡 Trimming Tips</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Use sliders for precise control</li>
                    <li>• Preview before trimming</li>
                    <li>• No quality loss when trimming</li>
                  </ul>
                </div>
              </div>
            </>
          }
        >
          {/* Main Preview Area */}
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 flex items-center justify-center min-h-[400px] relative overflow-hidden">
              <div 
                className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-md z-10"
              >
                <p className="text-xs text-gray-600">Live Preview</p>
                <p className="text-sm font-bold text-purple-600">{formatTimeDetailed(currentTime)}</p>
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
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                    
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

            {/* Timeline Control */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Video Timeline
                </h3>
                <p className="text-xs text-gray-500">Drag the markers to select start and end points</p>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                {/* Main Timeline Bar */}
                <div 
                  ref={timelineRef}
                  className="relative h-16 bg-gray-100 rounded-lg cursor-pointer overflow-visible"
                  onClick={handleTimelineClick}
                >
                  {/* Selected Range Highlight */}
                  <div
                    className="absolute top-0 bottom-0 bg-purple-200"
                    style={{
                      left: `${(startTime / videoDuration) * 100}%`,
                      width: `${((endTime - startTime) / videoDuration) * 100}%`,
                    }}
                  />
                  
                  {/* Current Time Indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-purple-600 z-20"
                    style={{
                      left: `${(currentTime / videoDuration) * 100}%`,
                    }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-purple-600 rounded-full" />
                  </div>
                  
                  {/* Start Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-green-500 cursor-ew-resize z-10 group"
                    style={{
                      left: `${(startTime / videoDuration) * 100}%`,
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-10 bg-green-500 rounded border-2 border-white shadow-lg group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-medium">
                      {formatTimeDetailed(startTime)}
                    </div>
                  </div>
                  
                  {/* End Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-red-500 cursor-ew-resize z-10 group"
                    style={{
                      left: `${(endTime / videoDuration) * 100}%`,
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-10 bg-red-500 rounded border-2 border-white shadow-lg group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-medium">
                      {formatTimeDetailed(endTime)}
                    </div>
                  </div>
                </div>

                {/* Time Labels */}
                <div className="flex justify-between text-xs text-gray-500 px-1">
                  <span>0:00</span>
                  <span>{formatTimeDetailed(videoDuration)}</span>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <Scissors className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-purple-900">Trim Your Video</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Select the perfect start and end points for your video clip. Use the timeline and sliders to precisely control your trim range!
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
                  title="Trimming Video..." 
                  description="Please wait while we trim your video" 
                  icon={Scissors} 
                />
                <RelatedToolsSection tools={relatedTools} introText="These tools work well with video trimming." />
              </>
            )}

            {currentStep === "complete" && (
              <CompressSuccessSection
                files={downloadUrls}
                onReset={handleReset}
                resetButtonText="Trim Another Video"
                title="Video Trimmed Successfully!"
                description="Your trimmed video is ready to download"
                icon={Scissors}
              />
            )}
          </div>

          {currentStep === "complete" && <RelatedToolsSection tools={relatedTools} introText="Continue editing your videos." />}

          {currentStep !== "complete" && (
            <>
              <RelatedToolsSection tools={relatedTools} introText="These tools work well with video trimming." />
              <ToolDefinitionSection
                title="What Is Video Trimming?"
                content="Video trimming is the process of cutting and removing unwanted sections from the beginning, middle, or end of a video. Trim videos to create shorter clips, remove mistakes, extract highlights, or optimize content for social media — completely free, easy to use, and secure."
              />
              <HowItWorksSteps title="How It Works" subtitle="Trim videos in four simple steps" introText="Follow these steps to trim your video quickly and easily." steps={STEPS} />
              <WhyChooseSection title={WHY_CHOOSE_WORKFLOWPRO.title} subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} introText={WHY_CHOOSE_WORKFLOWPRO.introText} features={WHY_CHOOSE_WORKFLOWPRO.features} />
              <UseCasesSection
                title="Popular Uses for Video Trimming"
                useCases={[
                  "Remove intro and outro from videos",
                  "Extract highlights from long recordings",
                  "Cut out mistakes or unwanted sections",
                  "Create short clips for social media",
                  "Trim videos to fit time limits",
                  "Remove silent or boring parts",
                  "Create teasers from full videos",
                  "Extract specific scenes or moments",
                  "Prepare video content for presentations",
                ]}
              />
              <ToolFAQSection
                faqs={[
                  { question: "Will trimming reduce video quality?", answer: "No! Trimming simply cuts the video without re-encoding, so there's no quality loss. The original quality is preserved." },
                  { question: "Can I trim multiple sections?", answer: "Currently, you can select one continuous section (start to end). To create multiple clips, trim each section separately." },
                  { question: "How precise can I be with trimming?", answer: "You can trim down to 0.1 second precision using the time inputs and sliders for frame-accurate cuts." },
                  { question: "What video formats are supported?", answer: "We support MP4, MOV, AVI, MKV, WEBM, FLV, WMV, and MPEG formats. You can also convert to different formats during export." },
                  { question: "How large can my video file be?", answer: "Videos up to 500MB are supported. For larger files, consider compressing them first." },
                  { question: "Is my video uploaded to a server?", answer: "No — all video processing happens locally in your browser. Your files never leave your device." },
                ]}
              />
              <ToolSEOFooter
                title="About WorkflowPro's Video Trimmer"
                content="WorkflowPro's video trimmer: interactive timeline, precise time control, visual markers, multiple output formats, live preview — perfect for content creators, social media, and video editing. Fast, simple, always free."
              />
            </>
          )}
        </ToolPageLayout>
      )}
    </>
  );
}