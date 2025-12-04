/**
 * Vertical Page Thumbnails Component
 * 
 * Left sidebar with vertical scrolling page thumbnails
 */

import { MoreVertical, Copy, Trash2, RotateCw, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface VerticalPageThumbnailsProps {
  totalPages: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  onPageDuplicate: (page: number) => void;
  onPageDelete: (page: number) => void;
  onPageRotate: (page: number, direction: 'left' | 'right') => void;
}

export function VerticalPageThumbnails({
  totalPages,
  currentPage,
  onPageSelect,
  onPageDuplicate,
  onPageDelete,
  onPageRotate,
}: VerticalPageThumbnailsProps) {
  return (
    <div className="w-44 bg-gray-50 border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200 hover:scrollbar-thumb-purple-600">
      <div className="p-3 space-y-3">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <div
            key={page}
            className="relative group"
          >
            {/* Thumbnail */}
            <div
              className={`w-full aspect-[8.5/11] border-2 rounded-lg cursor-pointer transition-all flex flex-col ${
                currentPage === page
                  ? 'border-purple-500 shadow-lg ring-2 ring-purple-200 bg-white'
                  : 'border-gray-300 hover:border-purple-300 hover:shadow-md bg-white'
              }`}
              onClick={() => onPageSelect(page)}
            >
              {/* Thumbnail preview */}
              <div className="flex-1 bg-gray-50 rounded-t-md flex items-center justify-center p-2">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Page</div>
                  <div className="text-2xl font-medium text-gray-300">{page}</div>
                </div>
              </div>
              
              {/* Page Number Badge */}
              <div className={`text-center py-1.5 text-xs font-medium rounded-b-md ${
                currentPage === page
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                Page {page}
              </div>
            </div>

            {/* Actions Menu */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6 bg-white/90 hover:bg-white shadow-sm"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPageDuplicate(page)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate Page
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onPageRotate(page, 'left')}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Rotate Left
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPageRotate(page, 'right')}>
                    <RotateCw className="w-4 h-4 mr-2" />
                    Rotate Right
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onPageDelete(page)}
                    className="text-destructive"
                    disabled={totalPages === 1}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Page
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Page Indicator */}
            {currentPage === page && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-16 bg-purple-500 rounded-r-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}