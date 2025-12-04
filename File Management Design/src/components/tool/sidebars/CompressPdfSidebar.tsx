/**
 * CompressPdfSidebar Component
 * 
 * Right sidebar for Compress PDF tool.
 * Shows compression settings and quality options.
 * 
 * Usage:
 * <CompressPdfSidebar
 *   compressionLevel="medium"
 *   onCompressionLevelChange={(level) => {}}
 *   originalSize="10.5 MB"
 *   estimatedSize="2.8 MB"
 *   onCompress={() => {}}
 *   isProcessing={false}
 * />
 */

import { Button } from "../../ui/button";
import { FileArchive } from "lucide-react";

export type CompressionLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface CompressPdfSidebarProps {
  compressionLevel: CompressionLevel;
  onCompressionLevelChange: (level: CompressionLevel) => void;
  originalSize: string;
  estimatedSize: string;
  onCompress: () => void;
  isProcessing?: boolean;
}

const COMPRESSION_OPTIONS: Record<CompressionLevel, {
  label: string;
  description: string;
  quality: string;
  reduction: string;
}> = {
  low: {
    label: 'Low Compression',
    description: 'Minimal compression, best quality',
    quality: 'High Quality',
    reduction: '~20-30% smaller',
  },
  medium: {
    label: 'Medium Compression',
    description: 'Balanced quality and size',
    quality: 'Good Quality',
    reduction: '~40-60% smaller',
  },
  high: {
    label: 'High Compression',
    description: 'More compression, lower quality',
    quality: 'Medium Quality',
    reduction: '~60-80% smaller',
  },
  extreme: {
    label: 'Extreme Compression',
    description: 'Maximum compression, lowest quality',
    quality: 'Low Quality',
    reduction: '~80-90% smaller',
  },
};

export function CompressPdfSidebar({
  compressionLevel,
  onCompressionLevelChange,
  originalSize,
  estimatedSize,
  onCompress,
  isProcessing = false,
}: CompressPdfSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl">Compression Settings</h2>
      </div>

      {/* Compression Level Selection */}
      <div className="space-y-3">
        <h3 className="text-sm text-gray-600">Compression Level</h3>
        
        <div className="space-y-2">
          {(Object.keys(COMPRESSION_OPTIONS) as CompressionLevel[]).map((level) => {
            const option = COMPRESSION_OPTIONS[level];
            return (
              <button
                key={level}
                onClick={() => onCompressionLevelChange(level)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  compressionLevel === level
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </div>
                  </div>
                  {compressionLevel === level && (
                    <div className="ml-2">
                      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    {option.quality}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    {option.reduction}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Comparison */}
      <div className="space-y-3">
        <h3 className="text-sm text-gray-600">Size Comparison</h3>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          {/* Original Size */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Original Size</span>
            <span className="font-medium text-gray-900">{originalSize}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ 
                  width: compressionLevel === 'low' ? '70%' 
                    : compressionLevel === 'medium' ? '40%'
                    : compressionLevel === 'high' ? '20%'
                    : '10%'
                }}
              ></div>
            </div>
          </div>
          
          {/* Estimated Size */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Estimated Size</span>
            <span className="font-medium text-purple-600">{estimatedSize}</span>
          </div>
          
          {/* Savings */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">You'll save</span>
              <span className="font-medium text-green-600">
                {compressionLevel === 'low' ? '~25%' 
                  : compressionLevel === 'medium' ? '~50%'
                  : compressionLevel === 'high' ? '~70%'
                  : '~85%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-900">
          <strong>Note:</strong> Actual compression may vary depending on your PDF content. 
          Images and graphics compress more than text.
        </p>
      </div>

      {/* Compress Button */}
      <Button
        onClick={onCompress}
        disabled={isProcessing}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-base"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Compressing...
          </>
        ) : (
          <>
            <FileArchive className="w-5 h-5 mr-2" />
            Compress PDF
          </>
        )}
      </Button>
    </div>
  );
}
