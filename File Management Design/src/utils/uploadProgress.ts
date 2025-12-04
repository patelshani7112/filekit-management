/**
 * Upload Progress Utilities
 * 
 * Simulate upload/validation progress from 0% to 100%
 * Use this to show progress animation when validating files
 */

export interface ProgressCallback {
  (progress: number): void;
}

/**
 * Simulate upload progress with smooth animation
 * 
 * @param duration - Total duration in milliseconds (default: 2000ms)
 * @param onProgress - Callback called with progress 0-100
 * @param intervals - How many times to update (default: 20)
 * @returns Cancel function to stop progress
 * 
 * @example
 * const cancel = simulateUploadProgress(2000, (progress) => {
 *   console.log(`Progress: ${progress}%`);
 * });
 */
export function simulateUploadProgress(
  duration: number = 2000,
  onProgress: ProgressCallback,
  intervals: number = 20
): () => void {
  const intervalTime = duration / intervals;
  const progressPerInterval = 100 / intervals;
  
  let currentProgress = 0;
  let cancelled = false;
  
  const interval = setInterval(() => {
    if (cancelled) {
      clearInterval(interval);
      return;
    }
    
    currentProgress += progressPerInterval;
    
    if (currentProgress >= 100) {
      currentProgress = 100;
      onProgress(100);
      clearInterval(interval);
    } else {
      onProgress(Math.round(currentProgress));
    }
  }, intervalTime);
  
  // Return cancel function
  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}

/**
 * Simulate upload progress with realistic speed variations
 * Progress is faster at start, slower at end (more realistic)
 * 
 * @param duration - Total duration in milliseconds
 * @param onProgress - Callback called with progress 0-100
 * @returns Cancel function
 * 
 * @example
 * const cancel = simulateRealisticProgress(3000, (progress) => {
 *   setUploadProgress(progress);
 * });
 */
export function simulateRealisticProgress(
  duration: number = 3000,
  onProgress: ProgressCallback
): () => void {
  const startTime = Date.now();
  let cancelled = false;
  let animationFrame: number;
  
  const animate = () => {
    if (cancelled) return;
    
    const elapsed = Date.now() - startTime;
    const ratio = Math.min(elapsed / duration, 1);
    
    // Ease-out curve: fast start, slow end
    const progress = Math.round(ratio * ratio * (3 - 2 * ratio) * 100);
    
    onProgress(progress);
    
    if (ratio < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      onProgress(100);
    }
  };
  
  animationFrame = requestAnimationFrame(animate);
  
  return () => {
    cancelled = true;
    cancelAnimationFrame(animationFrame);
  };
}

/**
 * Simulate progress with stages (e.g., "Uploading" → "Processing" → "Validating")
 * 
 * @param stages - Array of stage configurations
 * @param onProgress - Callback with progress and current stage
 * @returns Cancel function
 * 
 * @example
 * simulateStageProgress([
 *   { name: 'Uploading', duration: 1000 },
 *   { name: 'Processing', duration: 1500 },
 *   { name: 'Validating', duration: 500 }
 * ], (progress, stage) => {
 *   console.log(`${stage}: ${progress}%`);
 * });
 */
export function simulateStageProgress(
  stages: { name: string; duration: number }[],
  onProgress: (progress: number, stageName: string) => void
): () => void {
  let cancelled = false;
  let currentStageIndex = 0;
  
  const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
  let elapsedDuration = 0;
  
  const runStage = (index: number) => {
    if (cancelled || index >= stages.length) return;
    
    const stage = stages[index];
    const stageDuration = stage.duration;
    const stageStartProgress = (elapsedDuration / totalDuration) * 100;
    const stageEndProgress = ((elapsedDuration + stageDuration) / totalDuration) * 100;
    
    const cancel = simulateUploadProgress(
      stageDuration,
      (stageProgress) => {
        const overallProgress = Math.round(
          stageStartProgress + (stageProgress / 100) * (stageEndProgress - stageStartProgress)
        );
        onProgress(overallProgress, stage.name);
      }
    );
    
    setTimeout(() => {
      if (!cancelled) {
        elapsedDuration += stageDuration;
        runStage(index + 1);
      }
    }, stageDuration);
  };
  
  runStage(0);
  
  return () => {
    cancelled = true;
  };
}

/**
 * Wait for actual file reading progress (for FileReader)
 * 
 * @param file - File to read
 * @param onProgress - Progress callback (0-100)
 * @returns Promise with file content
 * 
 * @example
 * const arrayBuffer = await readFileWithProgress(file, (progress) => {
 *   setUploadProgress(progress);
 * });
 */
export function readFileWithProgress(
  file: File,
  onProgress: ProgressCallback
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };
    
    reader.onload = () => {
      onProgress(100);
      resolve(reader.result as ArrayBuffer);
    };
    
    reader.onerror = () => {
      reject(reader.error);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Combine file reading + validation progress
 * 
 * @param file - File to process
 * @param validator - Async validation function
 * @param onProgress - Progress callback
 * @returns Validation result
 * 
 * @example
 * const pdfInfo = await processFileWithProgress(
 *   file,
 *   (arrayBuffer) => getPdfInfo(file),
 *   (progress, stage) => {
 *     setFileValidationInfo({
 *       ...fileInfo,
 *       uploadProgress: progress
 *     });
 *   }
 * );
 */
export async function processFileWithProgress<T>(
  file: File,
  validator: (arrayBuffer: ArrayBuffer) => Promise<T>,
  onProgress: (progress: number, stage: string) => void
): Promise<T> {
  // Stage 1: Reading file (0-50%)
  onProgress(0, 'Reading file');
  
  const arrayBuffer = await readFileWithProgress(file, (readProgress) => {
    const overallProgress = Math.round(readProgress * 0.5); // 0-50%
    onProgress(overallProgress, 'Reading file');
  });
  
  // Stage 2: Validating (50-100%)
  onProgress(50, 'Validating');
  
  // Simulate validation progress
  const validationCancel = simulateUploadProgress(500, (validationProgress) => {
    const overallProgress = 50 + Math.round(validationProgress * 0.5); // 50-100%
    onProgress(overallProgress, 'Validating');
  });
  
  try {
    const result = await validator(arrayBuffer);
    validationCancel();
    onProgress(100, 'Complete');
    return result;
  } catch (error) {
    validationCancel();
    throw error;
  }
}
