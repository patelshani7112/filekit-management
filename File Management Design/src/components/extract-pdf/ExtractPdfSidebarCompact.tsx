/**
 * ExtractPdfSidebarCompact Component
 * 
 * Compact sidebar for Extract PDF Pages tool with settings and options
 * Matches the Merge PDF sidebar design pattern
 */

import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { FilePlus, FileText, GripVertical, X, ChevronDown, ChevronUp } from "lucide-react";

interface ExtractPdfSidebarCompactProps {
  // Files management
  uploadedFiles: Array<{ name: string; size: number }>;
  onAddFiles: () => void;
  onRemoveFile: (index: number) => void;
  onReorderFiles: (reorderedFiles: Array<{ name: string; size: number }>) => void;
  
  // Selection info
  selectedPagesCount: number;
  totalPagesCount: number;
  
  // Output options
  mergeIntoOne: boolean;
  setMergeIntoOne: (value: boolean) => void;
  
  // Actions
  onSelectAll: () => void;
  onClearSelection: () => void;
  handleExtract: () => void;
  isProcessing: boolean;
}

export function ExtractPdfSidebarCompact({
  uploadedFiles,
  onAddFiles,
  onRemoveFile,
  onReorderFiles,
  selectedPagesCount,
  totalPagesCount,
  mergeIntoOne,
  setMergeIntoOne,
  onSelectAll,
  onClearSelection,
  handleExtract,
  isProcessing,
}: ExtractPdfSidebarCompactProps) {
  // State for collapsible Source Files section
  const [isSourceFilesExpanded, setIsSourceFilesExpanded] = useState(false);
  
  // Calculate total file size
  const totalFileSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
  const formattedSize = (() => {
    if (totalFileSize < 1024) return `${totalFileSize} B`;
    if (totalFileSize < 1024 * 1024) return `${(totalFileSize / 1024).toFixed(2)} KB`;
    return `${(totalFileSize / (1024 * 1024)).toFixed(2)} MB`;
  })();

  return (
    <Card className="p-6 bg-white shadow-sm border-gray-200">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Extract Settings</h3>
        
        {/* Add More Files Button */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-8 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-500 hover:text-white transition-colors"
          onClick={onAddFiles}
          disabled={uploadedFiles.length >= 15}
        >
          <FilePlus className="w-3.5 h-3.5" />
          Add Files
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Source Files - Collapsible */}
        <div>
          {/* Collapsible Header */}
          <button
            onClick={() => setIsSourceFilesExpanded(!isSourceFilesExpanded)}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-3 hover:text-gray-900 transition-colors"
          >
            <span>Source Files</span>
            {isSourceFilesExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {/* Collapsible Content */}
          {isSourceFilesExpanded && (
            <>
              {/* File List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {uploadedFiles.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No files uploaded
                  </div>
                ) : (
                  uploadedFiles.map((file, fileIndex) => (
                    <div
                      key={fileIndex}
                      className="flex items-center gap-2 text-xs p-3 rounded-lg border-2 transition-all group bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-purple-500 flex-shrink-0" />
                      <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="flex-1 truncate text-gray-700" title={file.name}>
                        {file.name}
                      </span>
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
                    </div>
                  ))
                )}
              </div>
              
              {/* Quick Selection Actions */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSelectAll}
                  className="flex-1 text-xs h-8"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearSelection}
                  disabled={selectedPagesCount === 0}
                  className="flex-1 text-xs h-8"
                >
                  Clear
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Output Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Output Settings</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="outputFileName" className="text-xs text-gray-600">
                Filename
              </Label>
              <Input
                id="outputFileName"
                type="text"
                defaultValue="extracted.pdf"
                placeholder="extracted.pdf"
                className="text-sm bg-purple-50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            
            {/* Merge Option - Changed to "Separate PDFs" with inverted logic */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex-1">
                <Label htmlFor="merge-option" className="text-sm font-medium cursor-pointer">
                  Separate PDFs
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Export each selected page as a separate PDF file
                </p>
              </div>
              <input
                type="checkbox"
                id="merge-option"
                checked={!mergeIntoOne}
                onChange={(e) => setMergeIntoOne(!e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>
            
            {/* Total Pages and Size Info */}
            <div className="flex items-center justify-between pt-3 pb-1">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span className="text-xs">
                    <span className="font-semibold text-purple-600">{selectedPagesCount}</span> pages selected
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {formattedSize}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extract Button - Full Width at Bottom */}
      <Button
        onClick={handleExtract}
        disabled={selectedPagesCount === 0 || isProcessing}
        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
        size="lg"
      >
        {isProcessing ? "Extracting..." : "Extract Pages"}
      </Button>
    </Card>
  );
}