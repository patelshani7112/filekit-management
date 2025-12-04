/**
 * WatermarkToolbar Component
 * 
 * Purpose: Single horizontal toolbar for watermark editor
 * Layout: [Back to Upload] | [Undo | Redo | - | + | 100%] | [◀ ▶ | Delete Watermark]
 * Responsive: On mobile, shows condensed version with essential controls
 */

import { ArrowLeft, Undo2, Redo2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface WatermarkToolbarProps {
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onDeleteWatermark?: () => void;
  onBackToUpload: () => void;
}

export function WatermarkToolbar({
  currentPage,
  totalPages,
  zoomLevel,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onPreviousPage,
  onNextPage,
  onDeleteWatermark,
  onBackToUpload,
}: WatermarkToolbarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-2 md:px-4 py-2 md:py-3 flex items-center justify-between gap-2 md:gap-6">
      {/* Left: Back to Upload button */}
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToUpload}
          className="gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-9"
        >
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Back to Upload</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      {/* Center: Edit controls (Undo, Redo, Zoom) */}
      <div className="flex items-center gap-1 md:gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          className="h-8 w-8 p-0 md:h-9 md:w-9"
        >
          <Undo2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Button>
        
        <div className="w-px h-4 md:h-6 bg-gray-200" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="h-8 w-8 p-0 md:h-9 md:w-9"
        >
          <Redo2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Button>

        <div className="w-px h-4 md:h-6 bg-gray-200" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          disabled={zoomLevel <= 50}
          title="Zoom Out"
          className="h-8 w-8 p-0 md:h-9 md:w-9"
        >
          <ZoomOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          disabled={zoomLevel >= 200}
          title="Zoom In"
          className="h-8 w-8 p-0 md:h-9 md:w-9"
        >
          <ZoomIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Button>
        
        <span className="text-xs md:text-sm font-medium text-gray-700 min-w-[40px] md:min-w-[50px] text-center">
          {zoomLevel}%
        </span>
      </div>

      {/* Right: Page navigation & Delete watermark */}
      <div className="flex items-center gap-1 md:gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousPage}
            disabled={currentPage <= 1}
            title={`Previous page (${currentPage - 1})`}
            className="h-8 w-8 p-0 md:h-9 md:w-9"
          >
            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            title={`Next page (${currentPage + 1})`}
            className="h-8 w-8 p-0 md:h-9 md:w-9"
          >
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>

        {onDeleteWatermark && (
          <>
            <div className="w-px h-4 md:h-6 bg-gray-200 hidden sm:block" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteWatermark}
              className="gap-1 md:gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 h-8 md:h-9 hidden sm:flex"
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden md:inline">Delete Watermark</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}