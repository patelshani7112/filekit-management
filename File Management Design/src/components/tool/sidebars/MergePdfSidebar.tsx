/**
 * MergePdfSidebar Component
 * 
 * Right sidebar for Merge PDF tool with enhanced features:
 * - ✅ Collapsible "Source Files" section (default: COLLAPSED with toggle arrow)
 * - ✅ "Add Files" button inside source files dropdown
 * - ✅ Stats ONLY shown when compress option is enabled
 * - ✅ Shows current size vs estimated compressed size
 * - ✅ Optional "Compress PDF after merge" checkbox
 * - ✅ Scrollable source files list (max-height: 400px)
 * - ✅ Drag and drop reordering support
 * 
 * Basic Usage (no stats shown):
 * <MergePdfSidebar
 *   sourceFiles={files}
 *   totalPages={57}
 *   totalSize="95.02 MB"
 *   outputFilename="merged.pdf"
 *   onAddFiles={handleAddFiles}
 *   onRemoveFile={handleRemoveFile}
 *   onOutputFilenameChange={setOutputFilename}
 *   onMerge={handleMerge}
 * />
 * 
 * Advanced Usage (with compress - shows stats):
 * <MergePdfSidebar
 *   sourceFiles={files}
 *   totalPages={57}
 *   totalSize="95.02 MB"
 *   outputFilename="merged.pdf"
 *   onAddFiles={handleAddFiles}
 *   onRemoveFile={handleRemoveFile}
 *   onReorderFiles={handleReorderFiles}
 *   onOutputFilenameChange={setOutputFilename}
 *   onMerge={handleMerge}
 *   isProcessing={isProcessing}
 *   showCompressOption={true}
 *   compressEnabled={compressEnabled}
 *   onCompressChange={setCompressEnabled}
 *   estimatedCompressedSize="35.86 MB"  // Optional: show after compress is enabled
 * />
 */

import { Button } from "../../ui/button";
import { DottedButton } from "../../ui/dotted-button";
import { GradientButton } from "../../ui/gradient-button";
import { Input } from "../../ui/input";
import { Plus, X, FileText, GripVertical, ChevronDown, ChevronUp, File } from "lucide-react";
import { useState } from "react";

export interface SourceFile {
  id: string;
  name: string;
  pageCount: number;
  size: string;
  color: string;
}

export interface MergePdfSidebarProps {
  sourceFiles: SourceFile[];
  totalPages: number;
  totalSize: string;
  outputFilename: string;
  onAddFiles: () => void;
  onRemoveFile: (index: number) => void;
  onReorderFiles?: (fromIndex: number, toIndex: number) => void;
  onOutputFilenameChange: (filename: string) => void;
  onMerge: () => void;
  isProcessing?: boolean;
  
  // Optional: Compress PDF option
  showCompressOption?: boolean;
  compressEnabled?: boolean;
  onCompressChange?: (enabled: boolean) => void;
  estimatedCompressedSize?: string;  // e.g., "35.86 MB" - shown when compress is enabled
}

export function MergePdfSidebar({
  sourceFiles,
  totalPages,
  totalSize,
  outputFilename,
  onAddFiles,
  onRemoveFile,
  onReorderFiles,
  onOutputFilenameChange,
  onMerge,
  isProcessing = false,
  showCompressOption = false,
  compressEnabled = false,
  onCompressChange,
  estimatedCompressedSize,
}: MergePdfSidebarProps) {
  // State for collapsible sections - Changed default to FALSE (collapsed)
  const [isSourceFilesOpen, setIsSourceFilesOpen] = useState(false);
  return (
    <div className="space-y-6">
      {/* Header with Add Files Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl">Merge Settings</h2>
        <DottedButton
          onClick={onAddFiles}
          size="sm"
          variant="primary"
        >
          <Plus className="w-4 h-4" />
          Add Files
        </DottedButton>
      </div>

      {/* Source Files Section - Collapsible */}
      <div className="space-y-3">
        <div 
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsSourceFilesOpen(!isSourceFilesOpen)}
        >
          <h3 className="text-sm text-gray-600 font-medium">Source Files</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            {isSourceFilesOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {isSourceFilesOpen && (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {sourceFiles.map((file, index) => (
              <div
                key={file.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors"
                draggable={!!onReorderFiles}
                onDragStart={(e) => {
                  if (onReorderFiles) {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("fileIndex", index.toString());
                  }
                }}
                onDragOver={(e) => {
                  if (onReorderFiles) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }
                }}
                onDrop={(e) => {
                  if (onReorderFiles) {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData("fileIndex"));
                    if (fromIndex !== index && !isNaN(fromIndex)) {
                      onReorderFiles(fromIndex, index);
                    }
                  }
                }}
              >
                {onReorderFiles && (
                  <div className="cursor-move text-gray-400">
                    <GripVertical className="w-4 h-4" />
                  </div>
                )}
                
                <div 
                  className="w-8 h-8 rounded flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: file.color }}
                >
                  <FileText className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {file.pageCount} page{file.pageCount !== 1 ? 's' : ''} • {file.size}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(index)}
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            {/* Add Files Button inside dropdown */}
            <DottedButton
              onClick={onAddFiles}
              size="sm"
              variant="primary"
              className="w-full"
            >
              <Plus className="w-4 h-4" />
              Add Files
            </DottedButton>
          </div>
        )}
      </div>

      {/* Output Settings Section */}
      <div className="space-y-3">
        <h3 className="text-sm text-gray-600 font-medium">Output Settings</h3>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-700">Filename</label>
          <Input
            type="text"
            value={outputFilename}
            onChange={(e) => onOutputFilenameChange(e.target.value)}
            className="w-full"
            placeholder="merged.pdf"
          />
        </div>

        {/* Optional: Compress PDF Option */}
        {showCompressOption && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={compressEnabled}
                onChange={(e) => onCompressChange?.(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Compress PDF after merge</span>
            </label>
          </div>
        )}
      </div>

      {/* Stats at Bottom - Only show when compress option is enabled */}
      {showCompressOption && compressEnabled && (
        <div className="pt-2 border-t border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Current Size:</span>
            <span className="font-medium">{totalPages} pages • {totalSize}</span>
          </div>
          {estimatedCompressedSize && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">After Compression:</span>
              <span className="font-medium text-green-700">{estimatedCompressedSize}</span>
            </div>
          )}
        </div>
      )}

      {/* Merge Button */}
      <GradientButton
        onClick={onMerge}
        disabled={isProcessing || sourceFiles.length === 0}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Merging...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5 mr-2" />
            Merge PDF
          </>
        )}
      </GradientButton>
    </div>
  );
}
