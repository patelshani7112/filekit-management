/**
 * DownloadSection Component
 * 
 * Purpose: Display download button and success message after processing
 * - Shows success message
 * - Download button
 * - Option to process more files
 * - Shows processed file info
 * 
 * Props:
 * - downloadUrl: URL or blob URL for download
 * - fileName: Name of the file to download
 * - onReset: Callback to process more files
 * - fileSize: Optional file size to display
 * 
 * Usage:
 * <DownloadSection 
 *   downloadUrl={processedFileUrl}
 *   fileName="merged.pdf"
 *   onReset={() => setStep('upload')}
 *   fileSize="2.5 MB"
 * />
 */

import { Download, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "../../ui/button";

interface DownloadSectionProps {
  downloadUrl: string;
  fileName: string;
  onReset: () => void;
  fileSize?: string;
}

export function DownloadSection({
  downloadUrl,
  fileName,
  onReset,
  fileSize,
}: DownloadSectionProps) {
  // Handle download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 text-center space-y-6">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success message */}
        <div>
          <h3 className="mb-2">File Ready!</h3>
          <p className="text-sm text-muted-foreground">
            Your file has been processed successfully
          </p>
        </div>

        {/* File info */}
        <div className="bg-muted rounded-lg p-4 space-y-1">
          <p className="text-sm truncate">{fileName}</p>
          {fileSize && (
            <p className="text-xs text-muted-foreground">{fileSize}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {/* Download button */}
          <Button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12 text-base"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download File
          </Button>

          {/* Process more button */}
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Process More Files
          </Button>
        </div>

        {/* Note */}
        <p className="text-xs text-muted-foreground">
          Your file will be automatically deleted after download for privacy
        </p>
      </div>
    </div>
  );
}
