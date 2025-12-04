/**
 * PageGrid Component
 * 
 * Universal reusable page grid for all PDF edit tools.
 * Displays page thumbnails with customizable actions.
 * 
 * Features:
 * - Responsive grid with auto-scaling columns
 * - Drag & drop reordering
 * - Rotate, Copy, Delete actions
 * - Click to preview
 * - Source file color badges
 * - Page selection support
 * 
 * Usage:
 * <PageGrid
 *   pages={pdfPages}
 *   gridSize="medium"
 *   onReorder={(from, to) => handleReorder(from, to)}
 *   onRotate={(index) => handleRotate(index)}
 *   onCopy={(index) => handleCopy(index)}
 *   onDelete={(index) => handleDelete(index)}
 *   onPreview={(index) => setPreviewPage(index)}
 *   showActions={{ rotate: true, copy: true, delete: true }}
 *   showBadges={true}
 *   draggable={true}
 * />
 */

import { RotateCw, Copy, Trash2, GripVertical } from "lucide-react";
import { Button } from "../../ui/button";
import { getGridClasses } from "../../../src/utils/gridUtils";

export interface PageGridPage {
  id: string | number;
  rotation: number;
  sourceFileIndex?: number;
  sourceColor?: string;
  selected?: boolean;
}

export interface PageGridActions {
  rotate?: boolean;
  copy?: boolean;
  delete?: boolean;
  custom?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: (index: number) => void;
    className?: string;
  }>;
}

export interface PageGridProps {
  pages: PageGridPage[];
  
  // Grid configuration
  gridSize?: 'small' | 'medium' | 'large' | 'xlarge';
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  maxHeight?: string;
  
  // Actions
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onRotate?: (index: number) => void;
  onCopy?: (index: number) => void;
  onDelete?: (index: number) => void;
  onPreview?: (index: number) => void;
  onSelect?: (index: number) => void;
  
  // Customization
  showActions?: PageGridActions;
  showBadges?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  
  // UI Labels
  labels?: {
    rotate?: string;
    copy?: string;
    delete?: string;
  };
}

const DEFAULT_LABELS = {
  rotate: "Rotate page",
  copy: "Duplicate page",
  delete: "Delete page",
};

const SOURCE_COLORS = [
  "#E879F9", // Fuchsia
  "#C084FC", // Purple
  "#A78BFA", // Violet
  "#818CF8", // Indigo
  "#60A5FA", // Blue
  "#38BDF8", // Sky
  "#22D3EE", // Cyan
  "#2DD4BF", // Teal
];

export function PageGrid({
  pages,
  gridSize = 'medium',
  breakpoint = 'md',
  maxHeight = 'calc(100vh-180px)',
  onReorder,
  onRotate,
  onCopy,
  onDelete,
  onPreview,
  onSelect,
  showActions = { rotate: true, copy: true, delete: true },
  showBadges = true,
  draggable = true,
  selectable = false,
  labels = DEFAULT_LABELS,
}: PageGridProps) {
  
  const effectiveLabels = { ...DEFAULT_LABELS, ...labels };
  
  return (
    <div 
      className="border-2 border-pink-200 rounded-lg p-2 overflow-y-auto custom-scrollbar"
      style={{ maxHeight }}
    >
      <div className={getGridClasses(gridSize, breakpoint)}>
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={`group relative ${selectable && page.selected ? 'ring-2 ring-purple-500' : ''}`}
            draggable={draggable}
            onDragStart={(e) => {
              if (draggable && onReorder) {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("pageIndex", index.toString());
              }
            }}
            onDragOver={(e) => {
              if (draggable && onReorder) {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }
            }}
            onDrop={(e) => {
              if (draggable && onReorder) {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData("pageIndex"));
                if (fromIndex !== index && !isNaN(fromIndex)) {
                  onReorder(fromIndex, index);
                }
              }
            }}
          >
            {/* Page Card */}
            <div 
              className={`bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-purple-400 hover:shadow-lg transition-all relative ${
                draggable ? 'cursor-move' : ''
              } ${selectable ? 'cursor-pointer' : ''}`}
              onClick={(e) => {
                // If clicking on the card itself (not buttons)
                if (!(e.target as HTMLElement).closest('button')) {
                  if (selectable && onSelect) {
                    onSelect(index);
                  } else if (onPreview) {
                    onPreview(index);
                  }
                }
              }}
            >
              {/* Action Buttons at TOP - ALWAYS VISIBLE */}
              {(showActions.rotate || showActions.copy || showActions.delete || showActions.custom) && (
                <div className="absolute top-1.5 right-1.5 z-10 flex gap-0.5 bg-white/95 rounded p-0.5 shadow-md">
                  {showActions.rotate && onRotate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRotate(index);
                      }}
                      className="h-6 w-6 p-0 hover:bg-purple-500 hover:text-white transition-colors"
                      title={effectiveLabels.rotate}
                    >
                      <RotateCw className="w-3 h-3" />
                    </Button>
                  )}
                  {showActions.copy && onCopy && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopy(index);
                      }}
                      className="h-6 w-6 p-0 hover:bg-purple-500 hover:text-white transition-colors"
                      title={effectiveLabels.copy}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  )}
                  {showActions.delete && onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(index);
                      }}
                      className="h-6 w-6 p-0 hover:bg-red-500 hover:text-white text-red-500 transition-colors"
                      title={effectiveLabels.delete}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                  {showActions.custom?.map((action, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(index);
                      }}
                      className={`h-6 w-6 p-0 ${action.className || 'hover:bg-purple-500 hover:text-white'}`}
                      title={action.label}
                    >
                      {action.icon}
                    </Button>
                  ))}
                </div>
              )}

              {/* Drag Handle */}
              {draggable && (
                <div className="absolute top-1.5 left-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/95 rounded p-0.5 shadow-md">
                    <GripVertical className="w-3 h-3 text-gray-500" />
                  </div>
                </div>
              )}

              {/* Page Preview */}
              <div className="aspect-[8.5/11] bg-gray-50 flex items-center justify-center p-4 sm:p-6">
                <div 
                  className="w-full h-full bg-white shadow-md rounded flex items-center justify-center p-3 sm:p-4 transition-transform"
                  style={{ 
                    transform: `rotate(${page.rotation}deg)`,
                  }}
                >
                  {/* Simulated page content */}
                  <div className="w-full space-y-1 sm:space-y-1.5">
                    <div className="h-1 sm:h-1.5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-1 sm:h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1 sm:h-1.5 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-1 sm:h-1.5 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-1 sm:h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1 sm:h-1.5 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>

              {/* Page Info Footer */}
              <div className="bg-gray-50 px-2 py-1.5 flex items-center justify-between border-t border-gray-200">
                <span className="text-xs text-gray-600">Page {index + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
