/**
 * PageGridSection Component
 * 
 * Purpose: Scrollable grid of page thumbnails with drag & drop
 * Used in edit steps for Merge PDF, Split PDF, Organize PDF, etc.
 * 
 * Props:
 * - pages: Array of page objects
 * - onRotate: Callback when page is rotated (receives pageIndex)
 * - onDuplicate: Callback when page is duplicated (receives pageIndex)
 * - onDelete: Callback when page is deleted (receives pageIndex)
 * - onReorder: Callback when pages are reordered (receives fromIndex, toIndex)
 * - onPreview: Optional callback when page is clicked (receives pageIndex)
 * - showActions: Show action buttons? (default: true)
 * - gridCols: Custom grid columns (default: responsive)
 */

import { ReactNode } from "react";
import { PageCard } from "./PageCard";

export interface PageData {
  fileIndex: number;
  fileName: string;
  pageNumber: number;
  rotation: number;
}

interface PageGridSectionProps {
  pages: PageData[];
  onRotate?: (pageIndex: number) => void;
  onDuplicate?: (pageIndex: number) => void;
  onDelete?: (pageIndex: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onPreview?: (pageIndex: number) => void;
  showActions?: boolean;
  gridCols?: string; // Custom grid column classes
}

export function PageGridSection({
  pages,
  onRotate,
  onDuplicate,
  onDelete,
  onReorder,
  onPreview,
  showActions = true,
  gridCols = "grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6",
}: PageGridSectionProps) {
  const handleDragStart = (e: React.DragEvent, pageIndex: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("pageIndex", pageIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("pageIndex"));
    if (fromIndex !== dropIndex && !isNaN(fromIndex) && onReorder) {
      onReorder(fromIndex, dropIndex);
    }
  };

  if (pages.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <p className="text-gray-500">No pages to display</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-pink-200 rounded-lg p-3 max-h-[600px] overflow-y-auto custom-scrollbar">
      <div className={`grid ${gridCols} gap-3`}>
        {pages.map((page, index) => (
          <div
            key={index}
            className="group relative"
            draggable={!!onReorder}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <PageCard
              page={page}
              index={index}
              onRotate={onRotate}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onClick={onPreview}
              showActions={showActions}
              showDragHandle={!!onReorder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
