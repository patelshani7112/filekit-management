/**
 * SourceFilesList Component
 * 
 * Purpose: Draggable list of source files for edit step sidebar
 * Shows compact file cards with drag handles, filenames, and page counts
 * 
 * Props:
 * - files: Array of File objects
 * - pdfPages: Array of page objects (to calculate page count per file)
 * - onRemoveFile: Callback when file is removed (receives fileIndex)
 * - onReorderFiles: Optional callback for reordering files (fromIndex, toIndex)
 * - dragOverFileIndex: Currently dragged-over file index (for visual feedback)
 * - onDragOverFile: Callback when dragging over a file (receives fileIndex or null)
 * 
 * Usage:
 * <SourceFilesList
 *   files={files}
 *   pdfPages={pdfPages}
 *   onRemoveFile={handleRemoveFile}
 *   onReorderFiles={handleReorderFiles}
 *   dragOverFileIndex={dragOverFileIndex}
 *   onDragOverFile={setDragOverFileIndex}
 * />
 */

import { FileText, X, GripVertical } from "lucide-react";
import { Button } from "../../ui/button";
import { PageData } from "../display/PageGridSection";

interface SourceFilesListProps {
  files: File[];
  pdfPages: PageData[];
  onRemoveFile: (fileIndex: number) => void;
  onReorderFiles?: (fromIndex: number, toIndex: number) => void;
  dragOverFileIndex?: number | null;
  onDragOverFile?: (fileIndex: number | null) => void;
}

export function SourceFilesList({
  files,
  pdfPages,
  onRemoveFile,
  onReorderFiles,
  dragOverFileIndex,
  onDragOverFile,
}: SourceFilesListProps) {
  const handleDragStart = (e: React.DragEvent, fileIndex: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("fileIndex", fileIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent, fileIndex: number) => {
    e.preventDefault();
    
    const pageIndex = e.dataTransfer.getData("pageIndex");
    // If dragging a page, show drop zone effect
    if (pageIndex) {
      e.dataTransfer.dropEffect = "copy";
      onDragOverFile?.(fileIndex);
    } else {
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDragLeave = () => {
    onDragOverFile?.(null);
  };

  const handleDrop = (e: React.DragEvent, fileIndex: number) => {
    e.preventDefault();
    onDragOverFile?.(null);

    const fromFileIndexStr = e.dataTransfer.getData("fileIndex");

    // If dropping a file onto another file (reorder files)
    if (fromFileIndexStr && onReorderFiles) {
      const fromFileIndex = parseInt(fromFileIndexStr);
      if (fromFileIndex !== fileIndex && !isNaN(fromFileIndex)) {
        onReorderFiles(fromFileIndex, fileIndex);
      }
    }
  };

  // Get page count for a specific file
  const getPageCountForFile = (fileIndex: number): number => {
    return pdfPages.filter((p) => p.fileIndex === fileIndex).length;
  };

  if (files.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        No files uploaded
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
      {files.map((file, fileIndex) => (
        <div
          key={fileIndex}
          draggable={!!onReorderFiles}
          onDragStart={(e) => handleDragStart(e, fileIndex)}
          onDragOver={(e) => handleDragOver(e, fileIndex)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, fileIndex)}
          className={`flex items-center gap-2 text-xs p-3 rounded-lg border-2 transition-all group cursor-move relative ${
            dragOverFileIndex === fileIndex
              ? "bg-purple-100 border-purple-400 shadow-lg scale-105"
              : "bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"
          }`}
        >
          {/* Drag Handle */}
          <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-purple-500 flex-shrink-0" />
          
          {/* File Icon */}
          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
          
          {/* Filename */}
          <span className="flex-1 truncate text-gray-700" title={file.name}>
            {file.name}
          </span>
          
          {/* Page Count */}
          <div className="text-xs text-gray-500 font-medium">
            ({getPageCountForFile(fileIndex)})
          </div>
          
          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile(fileIndex);
            }}
            className="h-6 w-6 p-0 hover:bg-red-100 text-gray-400 hover:text-destructive flex-shrink-0"
            title="Remove file"
          >
            <X className="w-3.5 h-3.5" />
          </Button>

          {/* Drop Zone Indicator */}
          {dragOverFileIndex === fileIndex && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-500/10 rounded-lg pointer-events-none">
              <span className="text-xs font-medium text-purple-600">Drop page here</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
