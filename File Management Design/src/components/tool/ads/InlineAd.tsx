/**
 * InlineAd Component
 * 
 * Purpose: Show horizontal ad banner between content sections (optional)
 * 
 * Features:
 * - Only displays if enabled in AD_CONFIG
 * - Only shows at specified section positions
 * - Responsive sizing (728×90 desktop, 320×100 mobile)
 * - Centered layout
 * 
 * Usage:
 * <InlineAd index={0} />  // Show ad after section 0 (if enabled)
 * <InlineAd index={2} />  // Show ad after section 2 (if enabled)
 */

import { AD_CONFIG } from "../../../src/config/adConfig";

interface InlineAdProps {
  index: number;                        // Section index (0-based)
  height?: number;                      // Custom height (optional)
  className?: string;                   // Additional classes
}

export function InlineAd({ 
  index, 
  height,
  className = "" 
}: InlineAdProps) {
  // Check if inline ads are enabled globally
  if (!AD_CONFIG.enabled || !AD_CONFIG.inlineAds.enabled) {
    return null;
  }
  
  // Check if ad should show at this position
  if (!AD_CONFIG.inlineAds.positions.includes(index)) {
    return null;
  }
  
  const adHeight = height || AD_CONFIG.inlineAds.height;
  
  return (
    <div className={`w-full my-6 sm:my-8 ${className}`}>
      <div className="flex items-center justify-center">
        {/* Desktop Ad (728×90) */}
        <div 
          className="hidden sm:flex bg-gray-100 border border-gray-300 rounded-lg items-center justify-center"
          style={{ 
            width: '728px',
            maxWidth: '100%',
            height: `${adHeight}px`
          }}
        >
          <div className="text-center text-sm text-gray-500">
            <div className="font-medium">Google AdSense</div>
            <div className="text-xs text-gray-400">728 × {adHeight} - Inline Ad</div>
          </div>
        </div>
        
        {/* Mobile Ad (320×100) */}
        <div 
          className="flex sm:hidden bg-gray-100 border border-gray-300 rounded-lg items-center justify-center w-full"
          style={{ 
            maxWidth: '320px',
            height: '100px'
          }}
        >
          <div className="text-center text-sm text-gray-500">
            <div className="font-medium">Google AdSense</div>
            <div className="text-xs text-gray-400">320 × 100 - Mobile</div>
          </div>
        </div>
      </div>
    </div>
  );
}
