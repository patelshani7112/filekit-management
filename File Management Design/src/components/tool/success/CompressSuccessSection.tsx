/**
 * CompressSuccessSection Component
 * 
 * Purpose: Success state component specifically for compression tools (PDF, Image, etc.)
 * Shows original size vs compressed size with savings information
 * 
 * Features:
 * - Shows original vs compressed size for each file
 * - Displays savings percentage and amount
 * - Individual download buttons
 * - Clean, minimal design matching the reference
 * - Mobile responsive
 */

import { useState, useEffect } from "react";
import { Download, RotateCcw, FileText, Archive } from "lucide-react";
import { Button } from "../../ui/button";
import { MobileStickyAd } from "../ads/MobileStickyAd";

export interface CompressedFileItem {
  url: string;
  name: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
}

interface CompressSuccessSectionProps {
  files: CompressedFileItem[];
  onReset: () => void;
  resetButtonText?: string;
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function CompressSuccessSection({
  files,
  onReset,
  resetButtonText = "Compress Another File",
  title = "Files Compressed Successfully!",
  description,
  icon: Icon = FileText,
}: CompressSuccessSectionProps) {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingFileIndex, setDownloadingFileIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(10); // 10 second countdown

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Calculate savings percentage
  const getSavingsPercentage = (original: number, compressed: number): number => {
    return Math.round((1 - compressed / original) * 100);
  };

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
  const handleDownload = (file: CompressedFileItem, index: number) => {
    setDownloadingFileIndex(index);
    
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      setDownloadingFileIndex(null);
    }, 1000);
  };

  const canDownload = downloadProgress >= 100 && countdown === 0;

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Mobile Sticky Ad - Just Above Preview */}
      <MobileStickyAd topOffset={64} height={100} />

      {/* Success Message */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-lg sm:text-xl text-green-600">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      {/* Files List */}
      <div className="space-y-3 max-w-2xl mx-auto">
        {files.map((file, index) => {
          const isDownloadingThis = downloadingFileIndex === index;
          const savingsPercentage = getSavingsPercentage(file.originalSize, file.compressedSize);
          const savingsAmount = file.originalSize - file.compressedSize;

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 space-y-3 hover:border-purple-300 hover:shadow-md transition-all"
            >
              {/* File Header */}
              <div className="flex items-start gap-3">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate mb-2" title={file.name}>
                    {file.name}
                  </h4>
                  
                  {/* Size Info */}
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Original:</span>
                      <span className="text-gray-900 font-medium">{formatFileSize(file.originalSize)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Compressed:</span>
                      <span className="text-green-600 font-medium">{formatFileSize(file.compressedSize)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-semibold">
                        Saved {savingsPercentage}% ({formatFileSize(savingsAmount)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Download Button */}
              <Button 
                onClick={() => handleDownload(file, index)}
                disabled={!canDownload || isDownloadingThis}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all h-10 sm:h-11"
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
                ) : isDownloadingThis ? (
                  <>
                    <Download className="w-4 h-4 mr-2 animate-bounce" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Progress Bar (only show while preparing) */}
      {downloadProgress < 100 && (
        <div className="max-w-2xl mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="max-w-lg mx-auto space-y-3">
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-2 border-gray-300 hover:border-gray-400 h-10 transition-all"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {resetButtonText}
        </Button>

        {/* Privacy Note */}
        <p className="text-xs text-center text-gray-500">
          {files.length} file{files.length !== 1 ? 's' : ''} ready for download
        </p>
      </div>
    </div>
  );
}
