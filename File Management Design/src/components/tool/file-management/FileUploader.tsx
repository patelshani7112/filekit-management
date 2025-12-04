/**
 * FileUploader Component
 * 
 * Purpose: Allow users to upload files via drag & drop or click
 * - Drag and drop area
 * - Click to browse files
 * - Shows accepted file types
 * - Visual feedback on drag over
 * 
 * Props:
 * - onFilesSelected: Callback when files are selected
 * - acceptedTypes: File types to accept (e.g., ".pdf")
 * - multiple: Allow multiple files? (default: false)
 * - maxFiles: Maximum number of files (optional)
 * - maxFileSize: Maximum file size in MB (optional)
 * - fileTypeLabel: Label for file type (e.g., "PDF", "Image", "Video")
 * - helperText: Custom helper text to show (optional)
 * - validationMessage: Validation message to show
 * - validationType: Type of validation message (warning, error, info)
 * 
 * Usage:
 * <FileUploader 
 *   onFilesSelected={(files) => console.log(files)}
 *   acceptedTypes=".pdf"
 *   multiple={true}
 *   maxFiles={10}
 *   maxFileSize={50}
 *   fileTypeLabel="PDF"
 *   validationMessage="File size exceeds limit"
 *   validationType="error"
 * />
 */

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  fileTypeLabel?: string; // e.g., "PDF", "Image", "Video"
  helperText?: string; // Custom helper text
  disabled?: boolean;
  validationMessage?: string; // Validation message to show
  validationType?: "warning" | "error" | "info"; // Type of validation message
}

export function FileUploader({
  onFilesSelected,
  acceptedTypes,
  multiple = false,
  maxFiles,
  maxFileSize,
  fileTypeLabel = "PDF",
  helperText,
  disabled = false,
  validationMessage,
  validationType = "warning",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const filesToProcess = maxFiles ? files.slice(0, maxFiles) : files;
      onFilesSelected(filesToProcess);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const filesToProcess = maxFiles ? files.slice(0, maxFiles) : files;
      onFilesSelected(filesToProcess);
    }
  };

  // Handle click to open file browser
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Generate helper text automatically if not provided
  const getHelperText = () => {
    if (helperText) return helperText;

    // Auto-generate based on props
    const parts: string[] = [];
    
    if (multiple && maxFiles) {
      parts.push(`up to ${maxFiles} ${fileTypeLabel} files`);
    } else if (multiple) {
      parts.push(`multiple ${fileTypeLabel} files`);
    } else {
      parts.push(`${fileTypeLabel} file`);
    }

    if (maxFileSize) {
      if (parts.length > 0) {
        parts.push(`each up to ${maxFileSize}MB in size`);
      } else {
        parts.push(`up to ${maxFileSize}MB in size`);
      }
    }

    return parts.length > 0 ? `Supports ${parts.join(', ')}.` : '';
  };

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-2xl p-8 sm:p-12 md:p-16 
          bg-gradient-to-br from-pink-50/50 to-purple-50/50
          border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragging 
            ? "border-pink-400 bg-pink-50/80 scale-[1.02]" 
            : "border-pink-200 hover:border-pink-300 hover:bg-pink-50/70"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5">
          {/* Upload Icon Circle */}
          <div className={`
            w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center
            bg-gradient-to-br from-pink-100 to-purple-100
            border-2 transition-all duration-300
            ${isDragging ? "border-pink-400 scale-110" : "border-pink-200"}
          `}>
            <Upload className={`
              w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300
              ${isDragging ? "text-pink-600" : "text-pink-500"}
            `} />
          </div>

          {/* Text Content */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className={`text-lg sm:text-xl transition-colors duration-300 ${
              isDragging ? "text-pink-600" : "text-gray-800"
            }`}>
              {isDragging ? "Drop Your Files Here" : "Click or Drop Files"}
            </h3>
          </div>

          {/* Helper Text - Single Line Instead of Badges */}
          {getHelperText() && (
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto px-4">
              {getHelperText()}
            </p>
          )}

          {/* Validation Message */}
          {validationMessage && (
            <div
              className={`
                mt-2 px-4 py-2 rounded-lg border max-w-md mx-auto
                ${
                  validationType === "warning"
                    ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                    : validationType === "error"
                    ? "bg-red-50 border-red-300 text-red-800"
                    : "bg-blue-50 border-blue-300 text-blue-800"
                }
              `}
            >
              <p className="text-xs sm:text-sm font-medium text-center">
                {validationMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
