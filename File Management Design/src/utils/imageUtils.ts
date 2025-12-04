/**
 * Image Utilities
 * 
 * Provides functions to work with image files including:
 * - Validating image integrity
 * - Reading dimensions
 * - Detecting corrupted files
 * - Supporting formats: JPG, PNG, GIF, WEBP, BMP, SVG
 */

export interface ImageInfo {
  width: number;
  height: number;
  isValid: boolean;
  error?: string;
  fileSize: number;
  fileName: string;
  format: string;
}

/**
 * Get image info and validate file integrity
 * @param file - The image file to analyze
 * @returns Promise with image information
 */
export async function getImageInfo(file: File): Promise<ImageInfo> {
  const result: ImageInfo = {
    width: 0,
    height: 0,
    isValid: false,
    fileSize: file.size,
    fileName: file.name,
    format: file.type,
  };

  try {
    // Check if file is empty
    if (file.size === 0) {
      result.error = 'File is empty';
      return result;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      result.error = 'Unsupported image format';
      return result;
    }

    // Create an image element to load and validate the image
    const img = new Image();
    const url = URL.createObjectURL(file);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        result.width = img.naturalWidth;
        result.height = img.naturalHeight;
        result.isValid = true;
        URL.revokeObjectURL(url);
        resolve();
      };

      img.onerror = () => {
        result.error = 'Image is corrupted or invalid';
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    result.error = errorMessage;
    result.isValid = false;
    return result;
  }
}

/**
 * Batch process multiple image files
 * @param files - Array of image files to process
 * @param onProgress - Optional callback for progress updates
 * @returns Promise with array of image information
 */
export async function batchGetImageInfo(
  files: File[],
  onProgress?: (current: number, total: number, fileName: string) => void
): Promise<ImageInfo[]> {
  const results: ImageInfo[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i + 1, files.length, file.name);
    
    const info = await getImageInfo(file);
    results.push(info);
  }

  return results;
}

/**
 * Check if all images in a list are valid
 * @param imageInfos - Array of image information
 * @returns true if all images are valid
 */
export function areAllImagesValid(imageInfos: ImageInfo[]): boolean {
  return imageInfos.every(info => info.isValid);
}

/**
 * Format dimensions to human-readable string
 * @param width - Image width
 * @param height - Image height
 * @returns Formatted string (e.g., "1920x1080")
 */
export function formatDimensions(width: number, height: number): string {
  return `${width}x${height}`;
}
