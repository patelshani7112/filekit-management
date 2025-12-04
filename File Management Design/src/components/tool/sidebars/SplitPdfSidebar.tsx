/**
 * SplitPdfSidebar Component
 * 
 * Right sidebar for Split PDF tool.
 * Shows split options and settings.
 * 
 * Usage:
 * <SplitPdfSidebar
 *   splitMode="range"
 *   onSplitModeChange={(mode) => {}}
 *   pageRanges="1-5, 10-15"
 *   onPageRangesChange={(ranges) => {}}
 *   onSplit={() => {}}
 *   isProcessing={false}
 * />
 */

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Scissors, FileText } from "lucide-react";
import { useState } from "react";

export type SplitMode = 'range' | 'every' | 'bookmarks' | 'pages';

export interface SplitPdfSidebarProps {
  splitMode: SplitMode;
  onSplitModeChange: (mode: SplitMode) => void;
  
  // For range mode
  pageRanges?: string;
  onPageRangesChange?: (ranges: string) => void;
  
  // For every N pages mode
  everyNPages?: number;
  onEveryNPagesChange?: (n: number) => void;
  
  // For specific pages mode
  selectedPages?: number[];
  totalPages: number;
  
  onSplit: () => void;
  isProcessing?: boolean;
}

export function SplitPdfSidebar({
  splitMode,
  onSplitModeChange,
  pageRanges = '',
  onPageRangesChange,
  everyNPages = 1,
  onEveryNPagesChange,
  selectedPages = [],
  totalPages,
  onSplit,
  isProcessing = false,
}: SplitPdfSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl">Split Settings</h2>
      </div>

      {/* Split Mode Selection */}
      <div className="space-y-3">
        <h3 className="text-sm text-gray-600">Split Method</h3>
        
        <div className="space-y-2">
          <button
            onClick={() => onSplitModeChange('range')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              splitMode === 'range'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="font-medium text-sm">Split by Range</div>
            <div className="text-xs text-gray-500 mt-0.5">
              e.g., 1-5, 10-15
            </div>
          </button>

          <button
            onClick={() => onSplitModeChange('every')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              splitMode === 'every'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="font-medium text-sm">Split Every N Pages</div>
            <div className="text-xs text-gray-500 mt-0.5">
              Create files with N pages each
            </div>
          </button>

          <button
            onClick={() => onSplitModeChange('pages')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              splitMode === 'pages'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="font-medium text-sm">Extract Selected Pages</div>
            <div className="text-xs text-gray-500 mt-0.5">
              Click pages to select
            </div>
          </button>

          <button
            onClick={() => onSplitModeChange('bookmarks')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              splitMode === 'bookmarks'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="font-medium text-sm">Split by Bookmarks</div>
            <div className="text-xs text-gray-500 mt-0.5">
              Use PDF bookmarks
            </div>
          </button>
        </div>
      </div>

      {/* Mode-Specific Settings */}
      <div className="space-y-3">
        {splitMode === 'range' && onPageRangesChange && (
          <>
            <label className="text-sm text-gray-700">Page Ranges</label>
            <Input
              type="text"
              value={pageRanges}
              onChange={(e) => onPageRangesChange(e.target.value)}
              placeholder="1-5, 10-15, 20"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Enter page ranges separated by commas
            </p>
          </>
        )}

        {splitMode === 'every' && onEveryNPagesChange && (
          <>
            <label className="text-sm text-gray-700">Pages per File</label>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={everyNPages}
              onChange={(e) => onEveryNPagesChange(parseInt(e.target.value) || 1)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Each file will contain {everyNPages} page{everyNPages !== 1 ? 's' : ''}
            </p>
          </>
        )}

        {splitMode === 'pages' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-sm text-purple-900">
              <strong>{selectedPages.length}</strong> page{selectedPages.length !== 1 ? 's' : ''} selected
            </div>
            <p className="text-xs text-purple-700 mt-1">
              Click pages on the left to select/deselect
            </p>
          </div>
        )}

        {splitMode === 'bookmarks' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              PDF will be split at each bookmark
            </p>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Pages</span>
          <span className="font-medium">{totalPages}</span>
        </div>
        {splitMode === 'every' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Files to Create</span>
            <span className="font-medium">{Math.ceil(totalPages / everyNPages)}</span>
          </div>
        )}
      </div>

      {/* Split Button */}
      <Button
        onClick={onSplit}
        disabled={isProcessing}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-base"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Splitting...
          </>
        ) : (
          <>
            <Scissors className="w-5 h-5 mr-2" />
            Split PDF
          </>
        )}
      </Button>
    </div>
  );
}
