/**
 * useFileValidation Hook
 * 
 * AUTOMATIC file validation with progress animation!
 * 
 * Just call this hook and get automatic validation + progress for your files.
 * No manual setup needed!
 * 
 * Features:
 * - ✅ Automatic progress animation (0% → 100%)
 * - ✅ Automatic validation (PDF, Image, Video)
 * - ✅ Automatic error handling
 * - ✅ Works everywhere!
 * 
 * Usage:
 * const { files, fileValidationInfo, addFiles, removeFile, clearAll, retryFile } = 
 *   useFileValidation('pdf', { maxFiles: 10, progressDuration: 2000 });
 * 
 * <FileUploader onFilesSelected={addFiles} ... />
 * <FileListWithValidation files={fileValidationInfo} onRemove={removeFile} ... />
 */

import { useState, useCallback } from 'react';
import type { FileValidationInfo } from '../components/tool/file-management/FileListWithValidation';
import { getPdfInfo } from '../utils/pdfUtils';
import { getImageInfo } from '../utils/imageUtils';
import { getVideoInfo } from '../utils/videoUtils';
import { simulateRealisticProgress } from '../utils/uploadProgress';

type FileType = 'pdf' | 'image' | 'video';
type ValidatorFunction = (file: File) => Promise<{ isValid: boolean; pageCount: number; error?: string }>;

interface UseFileValidationOptions {
  maxFiles?: number;
  maxFileSize?: number;
  progressDuration?: number;
  onValidationComplete?: (files: File[], validationInfo: FileValidationInfo[]) => void;
}

export function useFileValidation(
  fileType: FileType,
  options: UseFileValidationOptions = {}
) {
  const {
    maxFiles = 10,
    maxFileSize = 50,
    progressDuration = 2000,
    onValidationComplete,
  } = options;

  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [validationType, setValidationType] = useState<'warning' | 'error' | 'info'>('warning');

  // Get validator based on file type
  const getValidator = (): ValidatorFunction => {
    switch (fileType) {
      case 'pdf':
        return getPdfInfo as ValidatorFunction;
      case 'image':
        return getImageInfo as ValidatorFunction;
      case 'video':
        return getVideoInfo as ValidatorFunction;
      default:
        return getPdfInfo as ValidatorFunction;
    }
  };

  const validator = getValidator();

  // Add files with automatic validation + progress
  const addFiles = useCallback(async (newFiles: File[]) => {
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
      uploadProgress: 0,  // ✅ AUTOMATIC PROGRESS!
    }));

    setFileValidationInfo((prev) => [...prev, ...newValidationInfo]);

    // ✅ VALIDATE EACH FILE WITH AUTOMATIC PROGRESS ANIMATION
    filesToAdd.forEach(async (file, index) => {
      const fileIndex = startIndex + index;

      // ✅ START PROGRESS ANIMATION AUTOMATICALLY
      const cancelProgress = simulateRealisticProgress(progressDuration, (progress) => {
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

      try {
        // Validate file
        const fileInfo = await validator(file);

        // Cancel progress
        cancelProgress();

        // Update validation info
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: fileInfo.isValid,
            pageCount: fileInfo.pageCount,
            error: fileInfo.error,
            uploadProgress: 100,  // ✅ COMPLETE!
          };
          return updated;
        });

        // Call completion callback if all files are done validating
        if (onValidationComplete) {
          setTimeout(() => {
            setFileValidationInfo((current) => {
              const allDone = current.every(f => !f.isValidating);
              if (allDone) {
                onValidationComplete(
                  files.concat(filesToAdd),
                  current
                );
              }
              return current;
            });
          }, 100);
        }
      } catch (error) {
        // Cancel progress
        cancelProgress();

        // Handle error
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: false,
            pageCount: 0,
            error: `Invalid ${fileType.toUpperCase()} file`,
          };
          return updated;
        });
      }
    });
  }, [files, maxFiles, maxFileSize, progressDuration, validator, fileType, onValidationComplete]);

  // Remove file
  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileValidationInfo((prev) => prev.filter((_, i) => i !== index));
    setValidationMessage('');
  }, []);

  // Clear all files
  const clearAll = useCallback(() => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage('');
  }, []);

  // Retry validation for a file
  const retryFile = useCallback(async (index: number) => {
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
        uploadProgress: 0,  // ✅ RESTART PROGRESS
      };
      return updated;
    });

    // Start progress
    const cancelProgress = simulateRealisticProgress(progressDuration, (progress) => {
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

    try {
      const fileInfo = await validator(file);
      cancelProgress();

      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: fileInfo.isValid,
          pageCount: fileInfo.pageCount,
          error: fileInfo.error,
          uploadProgress: 100,
        };
        return updated;
      });
    } catch (error) {
      cancelProgress();

      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: false,
          pageCount: 0,
          error: `Invalid ${fileType.toUpperCase()} file`,
        };
        return updated;
      });
    }
  }, [files, validator, fileType, progressDuration]);

  // Reorder files
  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
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
  }, []);

  return {
    // State
    files,
    fileValidationInfo,
    validationMessage,
    validationType,
    
    // Actions
    addFiles,         // ✅ Automatically validates with progress!
    removeFile,
    clearAll,
    retryFile,        // ✅ Automatically retries with progress!
    reorderFiles,
    
    // Setters (if you need manual control)
    setValidationMessage,
    setValidationType,
  };
}
