/**
 * ToolPageLayout Component
 * 
 * Purpose: Flexible 3-column layout for tool pages with optional sticky Google Ads
 * 
 * Layout Structure:
 * - WITH ADS: [Left Ad 180×600] [Main Content] [Right Ad 180×600]
 * - WITHOUT ADS: [Full Width Content]
 * 
 * Ad Behavior:
 * - Ads scroll normally with the page at first
 * - When ads reach the top header (64px from top), they LOCK/STICK there
 * - After locking, ads stay visible while all content scrolls in middle column
 * - All sections (Related Tools, How It Works, FAQ, etc.) fit between the ads
 * 
 * Responsive:
 * - Desktop WITH ADS: 3-column layout with sticky ads
 * - Desktop WITHOUT ADS: Full-width content (max-w-6xl)
 * - Mobile/Tablet: Ads hidden, full-width content
 * 
 * Configuration:
 * - Uses global AD_CONFIG from /src/config/adConfig.ts
 * - Can be overridden with showAds prop or adConfig prop
 * - Content width automatically adjusts based on ad presence
 * - Flexible width configuration (full-width or custom max-width)
 */

import { ReactNode } from "react";
import { AdPlaceholder } from "../ads/AdPlaceholder";
import { AD_CONFIG, AdConfig, getAdConfig, shouldShowSideAds, getContentMaxWidth } from "../../../src/config/adConfig";

interface ToolPageLayoutProps {
  children: ReactNode;
  
  // Simple toggle (overrides global config)
  showAds?: boolean;
  
  // Advanced: Custom ad configuration
  adConfig?: Partial<AdConfig>;
  
  // Additional options
  maxWidth?: string;                    // Custom max width (overrides auto calculation)
  className?: string;                   // Additional classes
  
  // Width configuration
  fullWidth?: boolean;                  // Use full viewport width (removes max-width constraint)
  containerMaxWidth?: string;           // Custom container max-width (default: "1400px")
}

export function ToolPageLayout({ 
  children, 
  showAds,
  adConfig: adConfigOverride,
  maxWidth,
  className = "",
  fullWidth = false,
  containerMaxWidth = "1400px"
}: ToolPageLayoutProps) {
  // Get effective ad configuration
  const adConfig = getAdConfig(adConfigOverride);
  
  // Determine if ads should be shown
  // Priority: showAds prop > adConfig.enabled > AD_CONFIG.enabled
  const adsEnabled = showAds !== undefined 
    ? showAds 
    : shouldShowSideAds(adConfig);
  
  // 🐛 DEBUG: Log ad configuration
  console.log('🎯 ToolPageLayout Debug:', {
    'AD_CONFIG.enabled': AD_CONFIG.enabled,
    'adConfig.enabled': adConfig.enabled,
    'adConfig.sideAds.enabled': adConfig.sideAds.enabled,
    'showAds prop': showAds,
    'adsEnabled (final)': adsEnabled
  });
  
  // Get content max width (auto-calculated or custom)
  const contentMaxWidth = maxWidth || getContentMaxWidth(adConfig);
  
  // Calculate grid container max-width class
  const gridMaxWidth = fullWidth ? "" : `max-w-[${containerMaxWidth}]`;
  
  // Calculate grid columns based on which ads are enabled
  const gridCols = adsEnabled 
    ? "grid-cols-1 lg:grid-cols-[200px_1fr_200px]" 
    : "grid-cols-1";

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white ${className}`}>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        <div className={`grid ${gridCols} gap-4 lg:gap-6 ${gridMaxWidth} mx-auto`}>
          {/* Left Ad - Only shows if ads enabled and left ad is enabled */}
          {adsEnabled && adConfig.sideAds.left && (
            <div className="hidden lg:block">
              <div 
                className="sticky h-[600px]"
                style={{ top: `${adConfig.sideAds.stickyOffset}px` }}
              >
                <AdPlaceholder 
                  width={adConfig.sideAds.width} 
                  height={adConfig.sideAds.height} 
                  position="left" 
                />
              </div>
            </div>
          )}

          {/* Main Content Area - Width adjusts based on ads */}
          <div className={`w-full ${contentMaxWidth} mx-auto`}>
            {children}
          </div>

          {/* Right Ad - Only shows if ads enabled and right ad is enabled */}
          {adsEnabled && adConfig.sideAds.right && (
            <div className="hidden lg:block">
              <div 
                className="sticky h-[600px]"
                style={{ top: `${adConfig.sideAds.stickyOffset}px` }}
              >
                <AdPlaceholder 
                  width={adConfig.sideAds.width} 
                  height={adConfig.sideAds.height} 
                  position="right" 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
