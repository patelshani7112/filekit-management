/**
 * MobileStickyAd Component
 * 
 * Purpose: Horizontal ad banner that sticks at top on mobile/tablet screens
 * - Shows only on mobile/tablet (hidden on desktop where side ads show)
 * - Sticks to top of viewport when scrolling
 * - Standard mobile banner size (320×50 or 320×100)
 * - Respects global ad configuration from adConfig.ts
 * 
 * Props:
 * - topOffset: Distance from top when sticky (default: 64px)
 * - height: Ad height in pixels (default: 100)
 * - showAd: Override to force show/hide (optional)
 * 
 * Usage:
 * <MobileStickyAd topOffset={64} height={100} />
 */

import { AD_CONFIG, getAdConfig, AdConfig } from "../../../src/config/adConfig";

interface MobileStickyAdProps {
  topOffset?: number;
  height?: number;
  showAd?: boolean; // Override to force show/hide
  adConfig?: Partial<AdConfig>; // Custom ad configuration
}

export function MobileStickyAd({ 
  topOffset = 64, 
  height = 100,
  showAd,
  adConfig: adConfigOverride
}: MobileStickyAdProps) {
  // Get effective ad configuration
  const adConfig = getAdConfig(adConfigOverride);
  
  // Determine if mobile ads should be shown
  // Priority: showAd prop > global config
  const shouldShowAd = showAd !== undefined 
    ? showAd 
    : (adConfig.enabled && adConfig.mobileAds.enabled);
  
  // Don't render anything if ads are disabled
  if (!shouldShowAd) {
    return null;
  }
  
  return (
    <div 
      className="lg:hidden sticky bg-white border border-gray-200 rounded-lg p-3 shadow-sm mb-4"
      style={{ 
        top: `${topOffset}px`,
        zIndex: 40,
        position: 'sticky'
      }}
    >
      {/* Ad Container */}
      <div className="flex items-center justify-center">
        {/* Google AdSense - Mobile Banner */}
        <div 
          className="w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-md flex items-center justify-center border border-gray-200"
          style={{ height: `${height}px`, maxWidth: '100%' }}
        >
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-400">Advertisement</p>
            <p className="text-[10px] text-gray-300">Mobile Banner</p>
          </div>
        </div>
      </div>
    </div>
  );
}
