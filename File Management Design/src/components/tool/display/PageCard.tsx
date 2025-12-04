/**
 * PageCard Component
 * 
 * Purpose: Individual page thumbnail card with action buttons
 * Shows a mock PDF page preview with rotate, duplicate, and delete actions
 * 
 * Props:
 * - page: Page object (fileIndex, fileName, pageNumber, rotation)
 * - index: Page index in the array
 * - onRotate: Callback for rotate action
 * - onDuplicate: Callback for duplicate action
 * - onDelete: Callback for delete action
 * - onClick: Optional callback when card is clicked (for preview)
 * - showActions: Show action buttons? (default: true)
 * - showDragHandle: Show drag handle icon? (default: false)
 */

import { RotateCw, Copy, Trash2, GripVertical } from "lucide-react";
import { Button } from "../../ui/button";
import { PageData } from "./PageGridSection";

interface PageCardProps {
  page: PageData;
  index: number;
  onRotate?: (pageIndex: number) => void;
  onDuplicate?: (pageIndex: number) => void;
  onDelete?: (pageIndex: number) => void;
  onClick?: (pageIndex: number) => void;
  showActions?: boolean;
  showDragHandle?: boolean;
}

export function PageCard({
  page,
  index,
  onRotate,
  onDuplicate,
  onDelete,
  onClick,
  showActions = true,
  showDragHandle = false,
}: PageCardProps) {
  return (
    <div
      className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-purple-400 hover:shadow-lg transition-all cursor-move relative"
      onClick={(e) => {
        // Only open preview if not clicking buttons
        if (!(e.target as HTMLElement).closest("button") && onClick) {
          onClick(index);
        }
      }}
    >
      {/* Action Buttons at TOP - ALWAYS VISIBLE */}
      {showActions && (
        <div className="absolute top-1.5 right-1.5 z-10 flex gap-0.5 bg-white/95 rounded p-0.5 shadow-md">
          {onRotate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRotate(index);
              }}
              className="h-6 w-6 p-0 hover:bg-purple-500 hover:text-white transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-3 h-3" />
            </Button>
          )}
          {onDuplicate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(index);
              }}
              className="h-6 w-6 p-0 hover:bg-purple-500 hover:text-white transition-colors"
              title="Duplicate"
            >
              <Copy className="w-3 h-3" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
              className="h-6 w-6 p-0 hover:bg-red-500 hover:text-white text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}

      {/* Drag Handle */}
      {showDragHandle && (
        <div className="absolute top-1.5 left-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/95 rounded p-0.5 shadow-md">
            <GripVertical className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      )}

      {/* Page Thumbnail */}
      <div
        className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t flex items-center justify-center relative p-3"
        style={{ transform: `rotate(${page.rotation}deg)` }}
      >
        {/* Document lines to simulate PDF page */}
        <div className="w-full space-y-1">
          <div className="h-1 bg-gray-300 rounded w-3/4"></div>
          <div className="h-1 bg-gray-300 rounded w-full"></div>
          <div className="h-1 bg-gray-300 rounded w-5/6"></div>
          <div className="h-1 bg-gray-300 rounded w-2/3"></div>
          <div className="h-1 bg-gray-300 rounded w-full"></div>
          <div className="h-1 bg-gray-300 rounded w-4/5"></div>
        </div>
      </div>

      {/* Page Info Footer */}
      <div className="p-2 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between gap-1">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900 mb-0.5">
              Page {index + 1}
            </div>
            <div className="text-[10px] text-gray-500 truncate" title={page.fileName}>
              {page.fileName}
            </div>
          </div>
          {/* Page Number Badge */}
          <div className="flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {index + 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
