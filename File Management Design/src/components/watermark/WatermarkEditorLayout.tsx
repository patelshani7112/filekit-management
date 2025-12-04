/**
 * WatermarkEditorLayout Component
 * 
 * Purpose: Full-screen 3-panel layout for watermark editing
 * Layout: Left Thumbnails (10%) | Center Canvas (65%) | Right Settings (25%)
 * - Horizontal banner ad at top (respects global AD_CONFIG)
 * - Top toolbar (undo, redo, zoom, page nav) - all in one line
 * - All three columns full height and scroll independently
 * - Responsive: On mobile, canvas is full width with settings in collapsible bottom sheet
 */

import { ReactNode } from "react";
import { AD_CONFIG } from "../../src/config/adConfig";

interface WatermarkEditorLayoutProps {
  toolbar: ReactNode;
  thumbnails: ReactNode;
  canvas: ReactNode;
  settingsPanel: ReactNode;
}

export function WatermarkEditorLayout({
  toolbar,
  thumbnails,
  canvas,
  settingsPanel,
}: WatermarkEditorLayoutProps) {
  // Check if banner ads should be shown
  const showBannerAd = AD_CONFIG.enabled && AD_CONFIG.topBannerAd.enabled;
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex flex-col">
      {/* Horizontal Banner Ad - STICKY - Only show if ads enabled */}
      {showBannerAd && (
        <div className="bg-gray-100 border-b border-gray-200 py-2 md:py-4 sticky top-16 z-40">
          <div className="container mx-auto px-2 md:px-4 max-w-[1600px]">
            <div className="bg-white border border-gray-300 rounded-lg flex items-center justify-center h-[60px] md:h-[90px]">
              <div className="text-center text-sm text-gray-500">
                <div className="font-medium text-xs md:text-sm">Google AdSense</div>
                <div className="text-xs text-gray-400 hidden md:block">728 × 90 - Horizontal Banner</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Toolbar - Single horizontal line */}
      <div className="container mx-auto px-2 md:px-4 max-w-[1600px] py-2 md:py-4">
        {toolbar}
      </div>

      {/* Main 3-Column Layout - Flex with specific widths */}
      {/* Desktop: 3 columns side by side */}
      {/* Mobile: Stack vertically with canvas full width */}
      <div className="container mx-auto px-2 md:px-4 max-w-[1600px] flex-1 pb-0 lg:pb-4 md:pb-8">
        <div className="flex flex-col lg:flex-row gap-2 md:gap-4 h-full lg:h-[calc(100vh-340px)]">
          
          {/* LEFT: Thumbnails Panel - Hidden on mobile, 10% width on desktop */}
          <div className="hidden lg:block lg:w-[10%] bg-white border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
            <div className="h-full overflow-y-auto custom-scrollbar">
              {thumbnails}
            </div>
          </div>

          {/* CENTER: Canvas Area - Full width on mobile, 65% on desktop */}
          <div className="w-full lg:w-[65%] bg-white border border-gray-200 rounded-xl overflow-hidden flex-shrink-0 h-[250px] sm:h-[300px] md:h-[350px] lg:h-auto">
            <div className="h-full overflow-y-auto custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
              {canvas}
            </div>
          </div>

          {/* RIGHT: Settings Panel - Full width on mobile, 25% on desktop */}
          <div className="w-full lg:w-[25%] bg-white border border-gray-200 rounded-xl lg:rounded-xl rounded-b-none overflow-hidden flex-shrink-0 flex-1 lg:flex-initial lg:h-auto">
            <div className="h-full overflow-y-auto custom-scrollbar p-3 md:p-6">
              {settingsPanel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}