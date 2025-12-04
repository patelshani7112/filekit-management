/**
 * EditorPageGrid Component
 * 
 * Reusable page grid for PDF editing interfaces
 * Displays PDF pages in a responsive grid with actions
 * 
 * Features:
 * - Responsive grid (1-6 columns based on screen size)
 * - Page selection (single/multi-select)
 * - Page actions (rotate, duplicate, delete, etc.)
 * - Drag and drop reordering
 * - Page thumbnails
 * - Page metadata display
 */

import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { GripVertical } from "lucide-react";

export interface PageInfo {
  id: string;
  thumbnail: string;
  pageNumber: number;
  fileName?: string;
  rotation?: number;
  isBlank?: boolean;
  metadata?: Record<string, any>;
}

export interface PageAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: (pageId: string) => void;
  variant?: "default" | "destructive" | "ghost";
  showAlways?: boolean; // Show without hover
}

interface EditorPageGridProps {
  // Pages data
  pages: PageInfo[];
  
  // Selection
  selectedPageIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  
  // Page actions (show on hover/selection)
  pageActions?: PageAction[];
  
  // Reordering
  onReorder?: (fromIndex: number, toIndex: number) => void;
  showReorderHandle?: boolean;
  
  // Grid settings
  columns?: {
    sm?: number; // Mobile
    md?: number; // Tablet
    lg?: number; // Desktop
    xl?: number; // Large desktop
  };
  
  // Page click behavior
  onPageClick?: (pageId: string, event: React.MouseEvent) => void;
  
  // Custom rendering
  renderPageOverlay?: (page: PageInfo) => React.ReactNode;
  renderPageFooter?: (page: PageInfo) => React.ReactNode;
  
  // Empty state
  emptyState?: React.ReactNode;
}

export function EditorPageGrid({
  pages,
  selectedPageIds = [],
  onSelectionChange,
  multiSelect = true,
  pageActions = [],
  onReorder,
  showReorderHandle = false,
  columns = { sm: 2, md: 3, lg: 5, xl: 6 },
  onPageClick,
  renderPageOverlay,
  renderPageFooter,
  emptyState,
}: EditorPageGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Handle page selection
  const handlePageClick = (pageId: string, event: React.MouseEvent) => {
    // Custom click handler
    if (onPageClick) {
      onPageClick(pageId, event);
      return;
    }

    // Default selection behavior
    if (!onSelectionChange) return;

    if (multiSelect) {
      if (event.ctrlKey || event.metaKey) {
        // Ctrl+Click: Toggle selection
        const newSelection = selectedPageIds.includes(pageId)
          ? selectedPageIds.filter(id => id !== pageId)
          : [...selectedPageIds, pageId];
        onSelectionChange(newSelection);
      } else if (event.shiftKey && selectedPageIds.length > 0) {
        // Shift+Click: Range selection
        const lastSelectedId = selectedPageIds[selectedPageIds.length - 1];
        const lastIndex = pages.findIndex(p => p.id === lastSelectedId);
        const currentIndex = pages.findIndex(p => p.id === pageId);
        
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        const rangeIds = pages.slice(start, end + 1).map(p => p.id);
        
        onSelectionChange([...new Set([...selectedPageIds, ...rangeIds])]);
      } else {
        // Regular click: Single selection
        onSelectionChange([pageId]);
      }
    } else {
      // Single select mode
      onSelectionChange([pageId]);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorder) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Grid column classes
  const gridColsClass = `
    grid-cols-${columns.sm || 2}
    md:grid-cols-${columns.md || 3}
    lg:grid-cols-${columns.lg || 5}
    xl:grid-cols-${columns.xl || 6}
  `;

  // Empty state
  if (pages.length === 0 && emptyState) {
    return <div className="flex items-center justify-center min-h-[400px]">{emptyState}</div>;
  }

  return (
    <div 
      className={`grid gap-3 sm:gap-4 ${gridColsClass}`}
      style={{
        gridTemplateColumns: `repeat(${columns.sm || 2}, minmax(0, 1fr))`,
      }}
    >
      {pages.map((page, index) => {
        const isSelected = selectedPageIds.includes(page.id);
        const isDragging = draggedIndex === index;
        const isDragOver = dragOverIndex === index;

        return (
          <Card
            key={page.id}
            draggable={showReorderHandle}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              group relative overflow-hidden cursor-pointer transition-all
              ${isSelected ? "ring-2 ring-purple-500 border-purple-500" : "border-gray-200"}
              ${isDragging ? "opacity-50" : "opacity-100"}
              ${isDragOver ? "ring-2 ring-pink-400 scale-105" : ""}
              hover:border-purple-300 hover:shadow-md
            `}
            onClick={(e) => handlePageClick(page.id, e)}
          >
            {/* Drag handle */}
            {showReorderHandle && (
              <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 backdrop-blur-sm rounded p-1 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            )}

            {/* Page actions (top right) */}
            {pageActions.length > 0 && (
              <div className={`
                absolute top-2 right-2 z-10 flex gap-1
                ${pageActions.some(a => a.showAlways) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                transition-opacity
              `}>
                {pageActions.map((action) => (
                  <Button
                    key={action.id}
                    variant={action.variant || "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(page.id);
                    }}
                    title={action.label}
                  >
                    <action.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            )}

            {/* Page thumbnail */}
            <div className="aspect-[1/1.414] bg-gray-100 overflow-hidden">
              <img
                src={page.thumbnail}
                alt={`Page ${page.pageNumber}`}
                className="w-full h-full object-contain"
                style={{
                  transform: page.rotation ? `rotate(${page.rotation}deg)` : undefined,
                }}
              />
            </div>

            {/* Custom overlay */}
            {renderPageOverlay && renderPageOverlay(page)}

            {/* Page info */}
            <div className="p-2 sm:p-3 space-y-1">
              <p className="text-xs sm:text-sm text-center truncate">
                Page {page.pageNumber}
              </p>
              {page.fileName && (
                <p className="text-xs text-gray-500 text-center truncate">
                  {page.fileName}
                </p>
              )}
              {renderPageFooter && renderPageFooter(page)}
            </div>
          </Card>
        );
      })}
    </div>
  );
}