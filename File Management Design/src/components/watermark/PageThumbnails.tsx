/**
 * PageThumbnails Component
 * 
 * Purpose: Vertical list of page thumbnails for watermark editor
 * Features:
 * - Shows small page previews
 * - Click to switch page (automatically scrolls center canvas)
 * - Highlight active page with purple border
 * - Show watermark indicator on pages with watermark
 * - Auto-scroll to keep active page visible
 */

import { useEffect, useRef } from "react";
import { Droplets } from "lucide-react";
import { cn } from "../ui/utils";

interface PageThumbnail {
  pageNumber: number;
  hasWatermark: boolean;
}

interface PageThumbnailsProps {
  pages: PageThumbnail[];
  currentPage: number;
  onPageSelect: (pageNumber: number) => void;
}

export function PageThumbnails({
  pages,
  currentPage,
  onPageSelect,
}: PageThumbnailsProps) {
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active thumbnail
  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentPage]);

  return (
    <div className="p-2 space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-2">
        Pages
      </h3>
      {pages.map((page) => (
        <button
          key={page.pageNumber}
          ref={currentPage === page.pageNumber ? activeThumbRef : null}
          onClick={() => onPageSelect(page.pageNumber)}
          className={cn(
            "w-full rounded-lg border-2 transition-all p-2 text-left hover:border-purple-300 hover:bg-purple-50/50",
            currentPage === page.pageNumber
              ? "border-purple-500 bg-purple-50 shadow-sm"
              : "border-gray-200 bg-white"
          )}
        >
          <div className="relative">
            {/* Thumbnail preview placeholder */}
            <div className="aspect-[8.5/11] bg-gray-50 rounded border border-gray-200 mb-1.5 flex items-center justify-center">
              <span className="text-[10px] text-gray-400 font-medium">{page.pageNumber}</span>
            </div>
            
            {/* Page number and watermark indicator */}
            <div className="flex items-center justify-between px-0.5">
              <span className={cn(
                "text-[10px] font-medium",
                currentPage === page.pageNumber ? "text-purple-700" : "text-gray-600"
              )}>
                {page.pageNumber}
              </span>
              {page.hasWatermark && (
                <Droplets className="w-3 h-3 text-purple-500" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}