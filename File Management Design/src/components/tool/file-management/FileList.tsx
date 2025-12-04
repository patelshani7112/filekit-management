/**
 * FileList Component
 * 
 * Purpose: Display list of uploaded files with options
 * - Shows file names, sizes, and page counts
 * - Remove individual files or clear all
 * - Drag and drop to reorder files
 * - Shows upload status
 * - Scrollable list for many files
 * 
 * Props:
 * - files: Array of File objects
 * - onRemove: Callback when file is removed (receives index)
 * - onReorder: Optional callback for reordering files
 * - showReorder: Show reorder handle? (default: false)
 * - onClearAll: Optional callback to clear all files
 * - onContinue: Optional callback for continue button
 * - continueText: Text for continue button (default: "Continue")
 * - continueDisabled: Disable continue button? (default: false)
 * - uploadProgress: Upload progress by file key (optional)
 * 
 * Usage:
 * <FileList 
 *   files={uploadedFiles}
 *   onRemove={(index) => removeFile(index)}
 *   onClearAll={() => clearAllFiles()}
 *   onContinue={() => processFiles()}
 *   showReorder={true}
 *   uploadProgress={uploadProgress}
 * />
 */

import { FileText, X, GripVertical, Check } from "lucide-react";
import { Button } from "../../ui/button";
import { useState } from "react";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  showReorder?: boolean;
  onClearAll?: () => void;
  onContinue?: () => void;
  continueText?: string;
  continueDisabled?: boolean;
  uploadProgress?: Record<string, number>; // NEW: Upload progress by file key
}

export function FileList({
  files,
  onRemove,
  onReorder,
  showReorder = false,
  onClearAll,
  onContinue,
  continueText = "Continue",
  continueDisabled = false,
  uploadProgress,
}: FileListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Format file size to human readable
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // Mock page count generator (since we can't read PDF pages without a library)
  // In production, you'd extract this from the actual PDF
  const getPageCount = (file: File): number => {
    // Generate a consistent mock page count based on file size
    // Rough estimate: 100KB per page average
    const estimatedPages = Math.max(1, Math.floor(file.size / 100000));
    return Math.min(estimatedPages, 50); // Cap at 50 pages
  };

  // Calculate total pages
  const totalPages = files.reduce((sum, file) => sum + getPageCount(file), 0);

  // Check if all files have finished uploading
  const allFilesUploaded = files.every((file, index) => {
    const fileKey = `${index}_${file.name}_${file.size}`;
    const progress = uploadProgress?.[fileKey];
    // If uploadProgress exists and is not 100, file is still uploading
    return progress === undefined || progress === 100;
  });

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Add a ghost image
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorder) {
      onReorder(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm">
          Selected Files ({files.length})
        </h3>
        {onClearAll && files.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-sm h-auto px-2 py-1 hover:text-destructive"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Files list - Scrollable container */}
      <div 
        className="space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden"
        style={{
          maxHeight: files.length > 4 ? "400px" : "none",
          paddingRight: "8px"
        }}
      >
        {files.map((file, index) => {
          // Create file key for progress tracking
          const fileKey = `${index}_${file.name}_${file.size}`;
          const progress = uploadProgress?.[fileKey];
          const isUploading = progress !== undefined && progress < 100;

          return (
          <div
            key={`${file.name}-${index}`}
            draggable={showReorder}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border rounded-lg 
              transition-all duration-200 overflow-hidden
              ${draggedIndex === index ? "opacity-50" : "opacity-100"}
              ${dragOverIndex === index ? "border-pink-400 border-2 scale-[1.02]" : "border-gray-200"}
              ${showReorder ? "cursor-move" : ""}
              hover:border-pink-200
            `}
          >
            {/* Drag handle */}
            {showReorder && (
              <div className="hidden sm:flex flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none">
                <GripVertical className="w-5 h-5" />
              </div>
            )}

            {/* PDF icon */}
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5 overflow-hidden">
              <p className="text-xs sm:text-sm truncate">{file.name}</p>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span>{getPageCount(file)} pages</span>
              </div>
              
              {/* Progress bar (only shown during upload) */}
              {isUploading ? (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-600">
                    Uploading {progress}%
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">Uploaded</span>
                </div>
              )}
            </div>

            {/* Remove button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="h-8 w-8 p-0 hover:bg-gray-100 flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        );
        })}
      </div>

      {/* Footer with total and continue button */}
      {onContinue && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total: {totalPages} pages
          </p>
          <Button
            onClick={onContinue}
            disabled={continueDisabled || !allFilesUploaded}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {continueText}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}
