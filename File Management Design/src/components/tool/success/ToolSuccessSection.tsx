/**
 * ToolSuccessSection Component
 * 
 * Purpose: Generic success state component for all tools (PDF, Image, Video, etc.)
 * - Supports single file, multiple files, ZIPs, and combinations
 * - Shows "Download All" button when multiple files exist
 * - Vertical scrollable list for multiple files
 * - Individual download buttons for each file
 * - Clean, minimal design
 * - Reusable across Split PDF, Merge PDF, Compress, Convert, and all other tools
 */

import { useState, useEffect } from "react";
import { Download, RotateCcw, FileText, Archive, Package, FileImage, FileVideo, File } from "lucide-react";
import { Button } from "../../ui/button";
import { MobileStickyAd } from "../ads/MobileStickyAd";

export interface FileItem {
  url: string;
  name: string;
  size?: string;
  type?: 'pdf' | 'zip' | 'image' | 'video' | 'file';
  pages?: number; // For PDFs
}

interface ToolSuccessSectionProps {
  // Support both single file and multiple files
  files: FileItem | FileItem[];
  fileInfo?: Record<string, string | number>; // Global info (e.g., Total Pages, Processing Time)
  onReset: () => void;
  resetButtonText?: string;
  previewTitle?: string;
  downloadAllText?: string;
  icon?: React.ComponentType<{ className?: string }>;
  showDownloadAll?: boolean;
  onDownloadAll?: () => void; // Custom download all handler
}

export function ToolSuccessSection({
  files,
  fileInfo,
  onReset,
  resetButtonText = "Process Another File",
  previewTitle = "File Preview",
  downloadAllText = "Download All Files",
  icon: Icon = FileText,
  showDownloadAll = true,
  onDownloadAll,
}: ToolSuccessSectionProps) {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingFileIndex, setDownloadingFileIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(10); // 10 second countdown

  // Normalize files to always be an array
  const fileList = Array.isArray(files) ? files : [files];
  const isMultipleFiles = fileList.length > 1;

  // Simulate download preparation progress
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer for download button
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle single file download
  const handleDownload = (file: FileItem, index?: number) => {
    if (index !== undefined) {
      setDownloadingFileIndex(index);
    } else {
      setIsDownloading(true);
    }
    
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadingFileIndex(null);
    }, 1000);
  };

  // Handle download all
  const handleDownloadAll = () => {
    if (onDownloadAll) {
      onDownloadAll();
    } else {
      // Default behavior: download all files one by one
      fileList.forEach((file, index) => {
        setTimeout(() => handleDownload(file, index), index * 500);
      });
    }
  };

  // Get icon for file type
  const getFileIcon = (type?: string) => {
    switch (type) {
      case 'zip':
        return Archive;
      case 'image':
        return FileImage;
      case 'video':
        return FileVideo;
      case 'pdf':
        return FileText;
      default:
        return File;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Mobile Sticky Ad - Just Above Preview */}
      <MobileStickyAd topOffset={64} height={100} />

      {/* File Preview Card - Full Width */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-8">
        <h3 className="text-center text-gray-700 mb-4 sm:mb-6">
          {previewTitle}
        </h3>

        {/* SINGLE FILE VIEW */}
        {!isMultipleFiles && (
          <>
            {/* File Icon */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-100 flex items-center justify-center shadow-sm">
                {(() => {
                  const FileIcon = getFileIcon(fileList[0].type);
                  return <FileIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />;
                })()}
              </div>
            </div>

            {/* File Info */}
            <div className="text-center space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
              <p className="font-medium text-gray-900 text-base sm:text-lg">{fileList[0].name}</p>
              {fileInfo && Object.keys(fileInfo).length > 0 && (
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
                  {Object.entries(fileInfo).map(([key, value], index) => (
                    <span 
                      key={key} 
                      className={index % 2 === 0 ? "text-purple-500" : "text-blue-500"}
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Download Button with Progress */}
            <div className="max-w-sm mx-auto space-y-2 sm:space-y-2.5">
              <Button
                onClick={() => handleDownload(fileList[0])}
                disabled={downloadProgress < 100 || countdown > 0 || isDownloading}
                className="w-full bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white h-10 sm:h-11 disabled:opacity-70 transition-all text-sm sm:text-base"
              >
                {downloadProgress < 100 ? (
                  <>
                    <Download className="w-4 h-4 mr-2 animate-pulse" />
                    Preparing... {downloadProgress}%
                  </>
                ) : countdown > 0 ? (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download in {countdown}s
                  </>
                ) : isDownloading ? (
                  <>
                    <Download className="w-4 h-4 mr-2 animate-bounce" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Now
                  </>
                )}
              </Button>

              {/* Progress Bar (only show while preparing) */}
              {downloadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
              )}

              {/* Reset/Process Another Button */}
              <Button
                onClick={onReset}
                variant="outline"
                className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-2 border-gray-300 hover:border-gray-400 h-10 transition-all"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {resetButtonText}
              </Button>

              {/* Privacy Note */}
              <p className="text-xs text-center text-gray-500 mt-2">
                Please wait while we prepare your file for download...
              </p>
            </div>
          </>
        )}

        {/* MULTIPLE FILES VIEW - VERTICAL SCROLLABLE LIST */}
        {isMultipleFiles && (
          <>
            {/* Global File Info (if provided) */}
            {fileInfo && Object.keys(fileInfo).length > 0 && (
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap mb-4 sm:mb-6">
                {Object.entries(fileInfo).map(([key, value], index) => (
                  <span 
                    key={key} 
                    className={index % 2 === 0 ? "text-purple-500" : "text-blue-500"}
                  >
                    {key}: {value}
                  </span>
                ))}
              </div>
            )}

            {/* Download All Button */}
            {showDownloadAll && (
              <div className="max-w-2xl mx-auto mb-4 sm:mb-6">
                <Button
                  onClick={handleDownloadAll}
                  disabled={downloadProgress < 100 || countdown > 0}
                  variant="outline"
                  className="w-full border-2 border-purple-400 text-gray-900 hover:bg-purple-50 hover:border-purple-500 hover:text-gray-900 disabled:opacity-50 transition-all h-11 sm:h-12 text-sm sm:text-base"
                >
                  {downloadProgress < 100 ? (
                    <>
                      <Download className="w-4 h-4 mr-2 animate-pulse" />
                      Preparing... {downloadProgress}%
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <Package className="w-4 h-4 mr-2" />
                      Download All in {countdown}s
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4 mr-2" />
                      {downloadAllText}
                    </>
                  )}
                </Button>

                {/* Progress Bar (only show while preparing) */}
                {downloadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">or download individually</span>
              </div>
            </div>

            {/* VERTICAL SCROLLABLE FILE LIST */}
            <div className="max-w-2xl mx-auto">
              {/* Scrollable Container - Max 4 visible items */}
              <div 
                className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar-purple"
              >
                {fileList.map((file, index) => {
                  const FileIcon = getFileIcon(file.type);
                  const isDownloadingThis = downloadingFileIndex === index;
                  const canDownload = downloadProgress >= 100 && countdown === 0;

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-100 flex items-center justify-center shadow-sm">
                          <FileIcon className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate mb-1" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                          {file.size && (
                            <span>{file.size}</span>
                          )}
                          {file.size && file.pages && (
                            <span>•</span>
                          )}
                          {file.pages && (
                            <span className="text-gray-900">{file.pages} pages</span>
                          )}
                        </div>
                      </div>

                      {/* Download Button */}
                      <div className="flex-shrink-0">
                        <Button
                          onClick={() => handleDownload(file, index)}
                          disabled={!canDownload || isDownloadingThis}
                          size="sm"
                          variant="outline"
                          className="border border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm px-3 sm:px-4"
                        >
                          {isDownloadingThis ? (
                            <>
                              <Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1.5 animate-bounce" />
                              <span className="hidden sm:inline">Downloading...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1.5" />
                              <span className="hidden sm:inline">Download</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* File Counter */}
              <p className="text-center text-xs text-gray-500 mt-3">
                Showing {fileList.length} of {fileList.length} files
              </p>
            </div>

            {/* Reset/Process Another Button */}
            <div className="max-w-lg mx-auto mt-6">
              <Button
                onClick={onReset}
                variant="outline"
                className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-2 border-gray-300 hover:border-gray-400 h-10 transition-all"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {resetButtonText}
              </Button>

              {/* Privacy Note */}
              <p className="text-xs text-center text-gray-500 mt-2">
                {fileList.length} files ready for download
              </p>
            </div>
          </>
        )}
      </div>


    </div>
  );
}
