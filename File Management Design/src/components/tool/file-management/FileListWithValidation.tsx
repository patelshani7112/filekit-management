/**
 * FileListWithValidation Component
 * 
 * Enhanced file list with validation support (PDF, Image, Video, etc.)
 * - Shows real page counts/dimensions from file analysis
 * - Displays error states for corrupted/invalid files
 * - Optional: Accept invalid files for recovery tools
 * - Optional: Auto-advance to next step
 * - Optional: Custom file requirements (min/max/exact)
 * - Shows validation status (validating, valid, error)
 */

import { FileText, X, GripVertical, Check, AlertCircle, Loader2, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";
import { DottedButton } from "../../ui/dotted-button";
import { GradientButton } from "../../ui/gradient-button";
import { useState, useEffect } from "react";

export interface FileValidationInfo {
  file: File;
  isValidating: boolean;
  isValid: boolean;
  pageCount: number;
  error?: string;
  uploadProgress?: number;  // Upload progress 0-100 (optional)
}

interface FileListWithValidationProps {
  // === REQUIRED ===
  files: FileValidationInfo[];
  onRemove: (index: number) => void;
  
  // === OPTIONAL: BASIC ===
  onReorder?: (fromIndex: number, toIndex: number) => void;
  showReorder?: boolean;
  onClearAll?: () => void;
  onContinue?: () => void;
  continueText?: string;
  continueDisabled?: boolean;
  onRetry?: (index: number) => void;
  
  // === OPTIONAL: VALIDATION CONTROL ===
  acceptInvalidFiles?: boolean;                  // Allow broken files (default: false)
  requireAllValid?: boolean;                     // All must be valid (default: true)
  
  // === OPTIONAL: AUTO-ADVANCE ===
  autoAdvance?: boolean;                         // Skip button, auto-go to next step (default: false)
  autoAdvanceDelay?: number;                     // Delay in ms before auto-advance (default: 0)
  autoAdvanceCondition?: (files: FileValidationInfo[]) => boolean; // Custom condition
  disableAutoAdvanceOnReturn?: boolean;          // If true, don't auto-advance when user returns (default: false)
  
  // === OPTIONAL: BUTTON CONTROL ===
  showContinueButton?: boolean;                  // Show/hide button (default: true)
  minFiles?: number;                             // Min files to enable (default: 1)
  maxFiles?: number;                             // Max files to enable (default: undefined)
  continueButtonCondition?: (files: FileValidationInfo[]) => boolean; // Custom enable logic
  
  // === OPTIONAL: FILE REQUIREMENTS ===
  fileRequirement?: {
    min?: number;                                // Min files required
    max?: number;                                // Max files allowed
    exact?: number;                              // Exact count required
    message?: string;                            // Message to show
  };
  
  // === OPTIONAL: CUSTOM MESSAGES ===
  validatingText?: string;                       // Default: "Reading PDF..."
  validText?: string;                            // Default: "Valid PDF"
  invalidText?: string;                          // Default: "Error"
  totalPagesText?: (count: number) => string;    // Custom total text
}

export function FileListWithValidation({
  files,
  onRemove,
  onReorder,
  showReorder = false,
  onClearAll,
  onContinue,
  continueText = "Continue",
  continueDisabled = false,
  onRetry,
  // NEW: Validation control
  acceptInvalidFiles = false,
  requireAllValid = true,
  // NEW: Auto-advance
  autoAdvance = false,
  autoAdvanceDelay = 0,
  autoAdvanceCondition,
  disableAutoAdvanceOnReturn = false,
  // NEW: Button control
  showContinueButton = true,
  minFiles = 1,
  maxFiles,
  continueButtonCondition,
  // NEW: File requirements
  fileRequirement,
  // NEW: Custom messages
  validatingText = "Reading PDF...",
  validText = "Valid PDF",
  invalidText = "Error",
  totalPagesText,
}: FileListWithValidationProps) {
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

  // Calculate total pages (only from valid files)
  const totalPages = files.reduce((sum, fileInfo) => 
    sum + (fileInfo.isValid ? fileInfo.pageCount : 0), 0
  );

  // Check if all files are validated
  const allFilesValidated = files.every(f => !f.isValidating);
  
  // Check if any file has errors
  const hasErrors = files.some(f => !f.isValid && !f.isValidating);
  
  // Check if any file is currently validating
  const isValidating = files.some(f => f.isValidating);
  
  // Count valid files
  const validFileCount = files.filter(f => f.isValid && !f.isValidating).length;
  
  // NEW: Enhanced continue logic
  const canContinue = (() => {
    // Use custom condition if provided
    if (continueButtonCondition) {
      return continueButtonCondition(files);
    }
    
    // Check file requirement
    if (fileRequirement) {
      if (fileRequirement.exact && validFileCount !== fileRequirement.exact) return false;
      if (fileRequirement.min && validFileCount < fileRequirement.min) return false;
      if (fileRequirement.max && validFileCount > fileRequirement.max) return false;
    }
    
    // Check min/max files
    if (minFiles && validFileCount < minFiles) return false;
    if (maxFiles && validFileCount > maxFiles) return false;
    
    // Check if all files validated
    if (!allFilesValidated) return false;
    
    // Check validation requirements
    if (acceptInvalidFiles || !requireAllValid) {
      // Allow continuing even with invalid files
      return files.length > 0;
    } else {
      // Require all files to be valid (default behavior)
      return !hasErrors && files.length > 0;
    }
  })();
  
  // NEW: Auto-advance logic
  useEffect(() => {
    if (!autoAdvance || !onContinue) return;
    
    // Check if should auto-advance
    const shouldAdvance = autoAdvanceCondition 
      ? autoAdvanceCondition(files) 
      : canContinue;
    
    if (shouldAdvance) {
      const timer = setTimeout(() => {
        onContinue();
      }, autoAdvanceDelay);
      
      return () => clearTimeout(timer);
    }
  }, [files, autoAdvance, autoAdvanceCondition, autoAdvanceDelay, canContinue, onContinue]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
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
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm">
          Selected Files ({files.length})
        </h3>
        {onClearAll && files.length > 0 && (
          <DottedButton
            onClick={onClearAll}
            size="sm"
            variant="primary"
            className="shrink-0"
          >
            <X className="w-4 h-4" />
            Clear All
          </DottedButton>
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
        {files.map((fileInfo, index) => {
          const { file, isValidating, isValid, pageCount, error, uploadProgress } = fileInfo;

          return (
          <div
            key={`${file.name}-${index}`}
            draggable={showReorder && isValid}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border rounded-lg 
              transition-all duration-200 overflow-hidden
              ${draggedIndex === index ? "opacity-50" : "opacity-100"}
              ${dragOverIndex === index ? "border-pink-400 border-2 scale-[1.02]" : ""}
              ${!isValid && !isValidating ? "border-red-300 bg-red-50" : "border-gray-200"}
              ${showReorder && isValid ? "cursor-move" : ""}
              hover:border-pink-200
            `}
          >
            {/* Drag handle */}
            {showReorder && isValid && (
              <div className="hidden sm:flex flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none">
                <GripVertical className="w-5 h-5" />
              </div>
            )}

            {/* PDF icon */}
            <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
              !isValid && !isValidating ? "bg-red-100" : "bg-orange-100"
            }`}>
              {!isValid && !isValidating ? (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              ) : (
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              )}
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5 overflow-hidden">
              <p className="text-xs sm:text-sm truncate">{file.name}</p>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                <span>{formatFileSize(file.size)}</span>
                {isValid && (
                  <>
                    <span>•</span>
                    <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
                  </>
                )}
              </div>
              
              {/* Status indicator */}
              {isValidating ? (
                <div className="space-y-1">
                  {/* Progress bar */}
                  {uploadProgress !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                  <p className="text-xs text-purple-600">
                    Uploading {uploadProgress !== undefined ? uploadProgress : 0}%
                  </p>
                </div>
              ) : isValid ? (
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">Uploaded</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-600" />
                    <span className="text-xs text-red-600 font-medium">{invalidText}</span>
                  </div>
                  <p className="text-xs text-red-600">{error || "Invalid file"}</p>
                  {onRetry && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRetry(index)}
                      className="h-6 text-xs px-2 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                  )}
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

      {/* Error message if there are broken files (only show if not accepting invalid files) */}
      {hasErrors && !acceptInvalidFiles && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Some files have errors</p>
            <p className="text-xs text-red-700 mt-1">
              Please remove the files with errors or upload new valid files to continue.
            </p>
          </div>
        </div>
      )}
      
      {/* File requirement message */}
      {fileRequirement?.message && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900">{fileRequirement.message}</p>
          </div>
        </div>
      )}

      {/* Footer with total and continue button */}
      {onContinue && showContinueButton && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          {/* Total Pages - Hidden on mobile */}
          <p className="text-sm text-gray-600 hidden sm:block">
            {isValidating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating...
              </span>
            ) : totalPagesText ? (
              totalPagesText(totalPages)
            ) : (
              `Total: ${totalPages} ${totalPages === 1 ? 'page' : 'pages'}`
            )}
          </p>
          {/* Spacer for mobile to push button to right */}
          <div className="sm:hidden"></div>
          <GradientButton
            onClick={onContinue}
            disabled={continueDisabled || !canContinue}
            variant="secondary"
            size="md"
          >
            {continueText}
            <ChevronRight className="w-4 h-4 ml-2" />
          </GradientButton>
        </div>
      )}
    </div>
  );
}