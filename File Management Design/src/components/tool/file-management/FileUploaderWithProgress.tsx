/**
 * FileUploaderWithProgress Component
 * 
 * AUTOMATIC upload progress animation - no code needed in pages!
 * 
 * This component combines:
 * - FileUploader (drag & drop)
 * - FileListWithValidation (file list with progress)
 * - Automatic validation with progress animation
 * 
 * Just use this component and get progress automatically! 🎉
 * 
 * Features:
 * - ✅ Automatic progress animation (0% → 100%)
 * - ✅ File validation (PDF, Image, Video)
 * - ✅ Progress bar with percentage
 * - ✅ Works everywhere!
 * 
 * Usage:
 * <FileUploaderWithProgress
 *   fileType="pdf"
 *   onContinue={(files) => console.log('Valid files:', files)}
 *   minFiles={2}
 *   multiple={true}
 * />
 */

import { useState } from 'react';
import { FileUploader } from './FileUploader';
import { FileListWithValidation } from './FileListWithValidation';
import type { FileValidationInfo } from './FileListWithValidation';
import { getPdfInfo } from '../../../utils/pdfUtils';
import { getImageInfo } from '../../../utils/imageUtils';
import { getVideoInfo } from '../../../utils/videoUtils';
import { simulateRealisticProgress } from '../../../utils/uploadProgress';

type FileType = 'pdf' | 'image' | 'video';

interface FileUploaderWithProgressProps {
  // === FILE TYPE ===
  fileType: FileType;  // 'pdf' | 'image' | 'video'
  
  // === UPLOAD CONFIG ===
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;  // in MB
  acceptedTypes?: string;  // Override default (e.g., ".pdf,.docx")
  
  // === CONTINUE BUTTON ===
  onContinue: (files: File[], validationInfo: FileValidationInfo[]) => void;
  continueText?: string;
  
  // === FILE REQUIREMENTS ===
  minFiles?: number;
  maxFilesRequired?: number;
  fileRequirement?: { min?: number; max?: number; exact?: number };
  
  // === VALIDATION OPTIONS ===
  acceptInvalidFiles?: boolean;
  requireAllValid?: boolean;
  
  // === AUTO-ADVANCE ===
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  disableAutoAdvanceOnReturn?: boolean;
  
  // === CUSTOM TEXT ===
  validatingText?: string;
  validText?: string;
  invalidText?: string;
  
  // === REORDER ===
  showReorder?: boolean;
  
  // === PROGRESS ANIMATION ===
  progressDuration?: number;  // Duration in ms (default: 2000)
  disableProgress?: boolean;  // Turn off progress animation
}

export function FileUploaderWithProgress({
  fileType,
  multiple = false,
  maxFiles = 10,
  maxFileSize = 50,
  acceptedTypes,
  onContinue,
  continueText = "Continue",
  minFiles,
  maxFilesRequired,
  fileRequirement,
  acceptInvalidFiles = false,
  requireAllValid = true,
  autoAdvance = false,
  autoAdvanceDelay = 0,
  disableAutoAdvanceOnReturn = false,
  validatingText,
  validText,
  invalidText,
  showReorder = false,
  progressDuration = 2000,
  disableProgress = false,
}: FileUploaderWithProgressProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [validationType, setValidationType] = useState<'warning' | 'error' | 'info'>('warning');

  // Get file type config
  const getFileTypeConfig = () => {
    switch (fileType) {
      case 'pdf':
        return {
          accept: acceptedTypes || '.pdf',
          label: 'PDF',
          validator: getPdfInfo,
        };
      case 'image':
        return {
          accept: acceptedTypes || '.jpg,.jpeg,.png,.gif,.webp,.svg',
          label: 'Image',
          validator: getImageInfo,
        };
      case 'video':
        return {
          accept: acceptedTypes || '.mp4,.avi,.mov,.wmv,.flv,.mkv',
          label: 'Video',
          validator: getVideoInfo,
        };
      default:
        return {
          accept: '*',
          label: 'File',
          validator: getPdfInfo,
        };
    }
  };

  const config = getFileTypeConfig();

  // Handle file selection with automatic validation + progress
  const handleFilesSelected = async (newFiles: File[]) => {
    const startIndex = files.length;
    const currentFileCount = files.length;
    const availableSlots = maxFiles - currentFileCount;

    // Clear previous validation messages
    setValidationMessage('');

    // Check file count limit
    if (currentFileCount >= maxFiles) {
      setValidationMessage(`Maximum ${maxFiles} files allowed`);
      setValidationType('warning');
      return;
    }

    // Check available slots
    const filesToAdd = availableSlots < newFiles.length
      ? newFiles.slice(0, availableSlots)
      : newFiles;

    if (filesToAdd.length < newFiles.length) {
      setValidationMessage(`Only ${filesToAdd.length} files added (${maxFiles} max)`);
      setValidationType('warning');
    }

    if (filesToAdd.length === 0) return;

    // Add files to state
    setFiles((prev) => [...prev, ...filesToAdd]);

    // Create validation info with progress
    const newValidationInfo: FileValidationInfo[] = filesToAdd.map(file => ({
      file,
      isValidating: true,
      isValid: false,
      pageCount: 0,
      uploadProgress: disableProgress ? undefined : 0,  // Start at 0%
    }));

    setFileValidationInfo((prev) => [...prev, ...newValidationInfo]);

    // Validate each file with automatic progress animation
    filesToAdd.forEach(async (file, index) => {
      const fileIndex = startIndex + index;

      // ✅ START PROGRESS ANIMATION AUTOMATICALLY
      let cancelProgress: (() => void) | null = null;
      
      if (!disableProgress) {
        cancelProgress = simulateRealisticProgress(progressDuration, (progress) => {
          setFileValidationInfo((prev) => {
            const updated = [...prev];
            if (updated[fileIndex]) {
              updated[fileIndex] = {
                ...updated[fileIndex],
                uploadProgress: progress,
              };
            }
            return updated;
          });
        });
      }

      try {
        // Validate file
        const fileInfo = await config.validator(file);

        // Cancel progress
        if (cancelProgress) cancelProgress();

        // Update validation info
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: fileInfo.isValid,
            pageCount: fileInfo.pageCount || (fileInfo as any).width || 0,
            error: fileInfo.error,
            uploadProgress: disableProgress ? undefined : 100,
          };
          return updated;
        });
      } catch (error) {
        // Cancel progress
        if (cancelProgress) cancelProgress();

        // Handle error
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: false,
            pageCount: 0,
            error: `Invalid ${config.label} file`,
          };
          return updated;
        });
      }
    });
  };

  // Remove file
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileValidationInfo((prev) => prev.filter((_, i) => i !== index));
    setValidationMessage('');
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage('');
  };

  // Retry validation for a file
  const handleRetry = async (index: number) => {
    const file = files[index];
    if (!file) return;

    // Set validating state
    setFileValidationInfo((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isValidating: true,
        isValid: false,
        error: undefined,
        uploadProgress: disableProgress ? undefined : 0,
      };
      return updated;
    });

    // Start progress
    let cancelProgress: (() => void) | null = null;
    
    if (!disableProgress) {
      cancelProgress = simulateRealisticProgress(progressDuration, (progress) => {
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = {
              ...updated[index],
              uploadProgress: progress,
            };
          }
          return updated;
        });
      });
    }

    try {
      const fileInfo = await config.validator(file);
      if (cancelProgress) cancelProgress();

      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: fileInfo.isValid,
          pageCount: fileInfo.pageCount || (fileInfo as any).width || 0,
          error: fileInfo.error,
          uploadProgress: disableProgress ? undefined : 100,
        };
        return updated;
      });
    } catch (error) {
      if (cancelProgress) cancelProgress();

      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: false,
          pageCount: 0,
          error: `Invalid ${config.label} file`,
        };
        return updated;
      });
    }
  };

  // Reorder files
  const handleReorder = (fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      const [movedFile] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedFile);
      return updated;
    });

    setFileValidationInfo((prev) => {
      const updated = [...prev];
      const [movedInfo] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedInfo);
      return updated;
    });
  };

  // Handle continue
  const handleContinue = () => {
    onContinue(files, fileValidationInfo);
  };

  return (
    <div className="space-y-6">
      {/* File Uploader */}
      <FileUploader
        onFilesSelected={handleFilesSelected}
        acceptedTypes={config.accept}
        multiple={multiple}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        fileTypeLabel={config.label}
        validationMessage={validationMessage}
        validationType={validationType}
      />

      {/* File List with Validation (Automatic Progress!) */}
      {files.length > 0 && (
        <FileListWithValidation
          files={fileValidationInfo}
          onRemove={handleRemoveFile}
          onClearAll={handleClearAll}
          onContinue={handleContinue}
          continueText={continueText}
          onRetry={handleRetry}
          onReorder={showReorder ? handleReorder : undefined}
          showReorder={showReorder}
          minFiles={minFiles}
          maxFiles={maxFilesRequired}
          fileRequirement={fileRequirement}
          acceptInvalidFiles={acceptInvalidFiles}
          requireAllValid={requireAllValid}
          autoAdvance={autoAdvance}
          autoAdvanceDelay={autoAdvanceDelay}
          disableAutoAdvanceOnReturn={disableAutoAdvanceOnReturn}
          validatingText={validatingText}
          validText={validText}
          invalidText={invalidText}
        />
      )}
    </div>
  );
}
