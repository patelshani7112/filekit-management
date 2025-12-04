/**
 * Video Utilities
 * 
 * Provides functions to work with video files including:
 * - Validating video integrity
 * - Reading duration and dimensions
 * - Detecting corrupted files
 * - Supporting formats: MP4, WebM, AVI, MOV, MKV
 */

export interface VideoInfo {
  duration: number; // in seconds
  width: number;
  height: number;
  isValid: boolean;
  error?: string;
  fileSize: number;
  fileName: string;
  format: string;
}

/**
 * Get video info and validate file integrity
 * @param file - The video file to analyze
 * @returns Promise with video information
 */
export async function getVideoInfo(file: File): Promise<VideoInfo> {
  const result: VideoInfo = {
    duration: 0,
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
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (!validTypes.includes(file.type)) {
      result.error = 'Unsupported video format';
      return result;
    }

    // Create a video element to load and validate the video
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        result.duration = video.duration;
        result.width = video.videoWidth;
        result.height = video.videoHeight;
        result.isValid = true;
        URL.revokeObjectURL(url);
        resolve();
      };

      video.onerror = () => {
        result.error = 'Video is corrupted or invalid';
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load video'));
      };

      video.src = url;
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
 * Batch process multiple video files
 * @param files - Array of video files to process
 * @param onProgress - Optional callback for progress updates
 * @returns Promise with array of video information
 */
export async function batchGetVideoInfo(
  files: File[],
  onProgress?: (current: number, total: number, fileName: string) => void
): Promise<VideoInfo[]> {
  const results: VideoInfo[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i + 1, files.length, file.name);
    
    const info = await getVideoInfo(file);
    results.push(info);
  }

  return results;
}

/**
 * Check if all videos in a list are valid
 * @param videoInfos - Array of video information
 * @returns true if all videos are valid
 */
export function areAllVideosValid(videoInfos: VideoInfo[]): boolean {
  return videoInfos.every(info => info.isValid);
}

/**
 * Format duration to human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "1:23" or "1:23:45")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format dimensions to human-readable string
 * @param width - Video width
 * @param height - Video height
 * @returns Formatted string (e.g., "1920x1080")
 */
export function formatDimensions(width: number, height: number): string {
  return `${width}x${height}`;
}
