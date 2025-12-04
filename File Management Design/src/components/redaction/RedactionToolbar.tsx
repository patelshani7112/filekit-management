/**
 * RedactionToolbar Component
 * 
 * Purpose: Top toolbar for redaction editor
 * Features:
 * - Back to Upload button
 * - Undo/Redo
 * - Zoom controls
 * - Page navigation
 * - Delete Watermark button (right side)
 */

import { Button } from "../ui/button";
import { ArrowLeft, Undo2, Redo2, ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight } from "lucide-react";

interface RedactionToolbarProps {
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  canUndo: boolean;
  canRedo: boolean;
  onBack: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function RedactionToolbar({
  currentPage,
  totalPages,
  zoomLevel,
  canUndo,
  canRedo,
  onBack,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onPreviousPage,
  onNextPage,
}: RedactionToolbarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between gap-2 md:gap-4">
      {/* Left Section: Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="gap-1.5 text-xs md:text-sm shrink-0"
      >
        <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
        <span className="hidden sm:inline">Back to Upload</span>
        <span className="sm:hidden">Back</span>
      </Button>

      {/* Center Section: Controls */}
      <div className="flex items-center gap-1 md:gap-2 flex-1 justify-center">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-1 md:pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-1 md:pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
          <span className="text-xs md:text-sm font-medium text-gray-700 min-w-[45px] md:min-w-[50px] text-center">
            {zoomLevel}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomFit}
            className="h-7 w-7 md:h-8 md:w-8 p-0 hidden sm:flex"
            title="Fit to Page"
          >
            <Maximize className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
          <span className="text-xs md:text-sm font-medium text-gray-700 min-w-[60px] md:min-w-[80px] text-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>
      </div>

      {/* Right Section: Empty for now - can add additional controls */}
      <div className="shrink-0 w-[80px] md:w-[120px]">
        {/* Placeholder for future controls */}
      </div>
    </div>
  );
}
