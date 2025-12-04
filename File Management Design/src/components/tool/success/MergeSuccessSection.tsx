/**
 * MergeSuccessSection Component
 * 
 * Purpose: Display success state after merging PDFs with preview cards
 * - Shows success message with page count (can be separate)
 * - Merged File Preview card with download progress
 * - Merge Another PDF button
 * 
 * Props:
 * - downloadUrl: URL or blob URL for download
 * - fileName: Name of the merged file
 * - totalPages: Total number of pages in merged PDF
 * - fileSize: File size of merged PDF
 * - onReset: Callback to merge another PDF
 * - showHeader: Whether to show the success header (default: false)
 */

import { useState, useEffect } from "react";
import { Download, RotateCcw, CheckCircle, FileText } from "lucide-react";
import { Button } from "../../ui/button";
import { MobileStickyAd } from "../ads/MobileStickyAd";

interface MergeSuccessSectionProps {
  downloadUrl: string;
  fileName: string;
  totalPages: number;
  fileSize: string;
  onReset: () => void;
  showHeader?: boolean;
}

export function MergeSuccessSection({
  downloadUrl,
  fileName,
  totalPages,
  fileSize,
  onReset,
  showHeader = false,
}: MergeSuccessSectionProps) {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [countdown, setCountdown] = useState(10); // 10 second countdown

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

  // Handle download
  const handleDownload = () => {
    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Success Header - Full Width */}
      {showHeader && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl text-green-600 mb-1">
            PDF Merged Successfully!
          </h2>
          <p className="text-sm text-gray-600">
            Your {totalPages} pages have been combined into one PDF file
          </p>
        </div>
      )}

      {/* Mobile Sticky Ad - Just Above Preview */}
      <MobileStickyAd topOffset={64} height={100} />

      {/* Merged File Preview Card - Full Width */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-8">
        <h3 className="text-center text-gray-700 mb-4 sm:mb-6">
          Merged File Preview
        </h3>

        {/* File Icon */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
        </div>

        {/* File Info */}
        <div className="text-center space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
          <p className="font-medium text-gray-900 text-base sm:text-lg">{fileName}</p>
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <span className="text-purple-500">Total Pages: {totalPages}</span>
            <span className="text-blue-500">File Size: {fileSize}</span>
          </div>
        </div>

        {/* Download Button with Progress */}
        <div className="max-w-sm mx-auto space-y-2 sm:space-y-2.5">
          <Button
            onClick={handleDownload}
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

          {/* Merge Another PDF Button */}
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-2 border-gray-300 hover:border-gray-400 h-10 transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Merge Another PDF
          </Button>

          {/* Privacy Note */}
          <p className="text-xs text-center text-gray-500 mt-2">
            Please wait while we prepare your file for download...
          </p>
        </div>
      </div>
    </div>
  );
}
