/**
 * EditPageLayout Component
 * 
 * Purpose: Flexible full-screen layout for edit steps (Merge PDF, Split PDF, etc.)
 * 
 * Layout Options:
 * - WITH INLINE AD (showInlineAd={true}): 
 *   - Desktop: ONLY horizontal banner (728×90 Leaderboard) - NO vertical sidebar ads
 *   - Mobile: ONLY mobile banner (320×100) - sticky at top
 *   - 2-column layout: [Content] [Sidebar]
 * - WITH SIDE ADS (showInlineAd={false}): 
 *   - Desktop: ONLY left/right vertical sidebar ads (160×600) - NO horizontal banner
 *   - 4-column layout: [Left Ad] [Content] [Sidebar] [Right Ad]
 * - WITHOUT ADS: Clean 2-column layout [Content] [Sidebar]
 * 
 * Features:
 * - Full-screen gradient background
 * - 2-column layout (content left, sidebar right)
 * - Responsive (stacked on mobile, side-by-side on desktop)
 * - Config-driven ad display
 * - Flexible width configuration (full-width or custom max-width)
 * 
 * Configuration:
 * - Uses global AD_CONFIG from /src/config/adConfig.ts
 * - Can be overridden with showAds prop or adConfig prop
 * 
 * Props:
 * - onBack: Callback for back button
 * - totalPages: Total number of pages
 * - totalSize: Total file size (optional)
 * - children: Main content area (left column - pages grid)
 * - sidebar: Sidebar content (right column - settings panel)
 * - showAds: Simple toggle to enable/disable ads (optional)
 * - adConfig: Advanced ad configuration (optional)
 * - showInlineAd: Show STICKY horizontal ad at top (no sidebar ads) (optional)
 * - fullWidth: Use full viewport width (removes max-width constraint) (optional)
 * - maxWidth: Custom max-width value (default: "1400px") (optional)
 * 
 * Usage:
 * <EditPageLayout
 *   onBack={handleBackToUpload}
 *   totalPages={31}
 *   totalSize="4.2 MB"
 *   showAds={false}       // Optional: override global config
 *   showInlineAd={true}   // Optional: show horizontal ad inside content
 *   fullWidth={true}      // Optional: use full viewport width
 *   maxWidth="1800px"     // Optional: custom max-width
 *   sidebar={<EditSidebar {...} />}
 * >
 *   <PageGridSection pages={pages} {...} />
 * </EditPageLayout>
 */

import { ArrowLeft } from "lucide-react";
import { Button } from "../../ui/button";
import { DottedButton } from "../../ui/dotted-button";
import { ReactNode } from "react";
import { AD_CONFIG, AdConfig, getAdConfig } from "../../../src/config/adConfig";
import { AdPlaceholder } from "../ads/AdPlaceholder";

interface EditPageLayoutProps {
  onBack: () => void;
  totalPages: number;
  totalSize?: string;
  children: ReactNode;
  sidebar: ReactNode;
  showInlineAd?: boolean;               // Show horizontal ad inside content area (below children)
  
  // Ad configuration
  showAds?: boolean;                    // Simple toggle (overrides global config)
  adConfig?: Partial<AdConfig>;         // Advanced config override
  
  // Width configuration
  fullWidth?: boolean;                  // Use full viewport width (removes max-width)
  maxWidth?: string;                    // Custom max-width (default: "1400px")
}

export function EditPageLayout({
  onBack,
  totalPages,
  totalSize,
  children,
  sidebar,
  showAds,
  adConfig: adConfigOverride,
  showInlineAd = false,
  fullWidth = false,
  maxWidth = "1400px",
}: EditPageLayoutProps) {
  // Get effective ad configuration
  const adConfig = getAdConfig(adConfigOverride);
  
  // Determine if ads should be shown
  const shouldShowTopBanner = showAds !== undefined 
    ? showAds && adConfig.topBannerAd.enabled 
    : adConfig.enabled && adConfig.topBannerAd.enabled;
  
  // Determine if the inline horizontal ad should show (respects global config)
  const shouldShowInlineAd = showAds !== undefined
    ? showAds && showInlineAd && adConfig.topBannerAd.enabled
    : adConfig.enabled && showInlineAd && adConfig.topBannerAd.enabled;
  
  // When showInlineAd is true, ONLY show horizontal ad - NO vertical sidebar ads
  // Sidebar ads are ONLY shown when showInlineAd is false
  const shouldShowSideAds = showAds !== undefined
    ? showAds && adConfig.sideAds.enabled && !showInlineAd
    : adConfig.enabled && adConfig.sideAds.enabled && !showInlineAd;
  
  // Calculate container max-width class
  const containerMaxWidth = fullWidth ? "" : `max-w-[${maxWidth}]`;
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pb-2">
      {/* Horizontal Banner Ad at Top - STICKY - DESKTOP ONLY (728×90 Leaderboard) */}
      {shouldShowInlineAd && (
        <div className="hidden lg:block bg-gray-100 border-b border-gray-200 py-4 sticky top-16 z-40">
          <div className={`container mx-auto px-4 ${containerMaxWidth}`}>
            <div 
              className="bg-white border border-gray-300 rounded-lg flex items-center justify-center mx-auto"
              style={{ 
                maxWidth: '728px',
                height: '90px'
              }}
            >
              <div className="text-center text-sm text-gray-500">
                <div className="font-medium">Google AdSense</div>
                <div className="text-xs text-gray-400">728 × 90 - Horizontal Leaderboard</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Banner Ad at Top - MOBILE ONLY (320×100 Large Mobile Banner) */}
      {shouldShowInlineAd && (
        <div className="block lg:hidden bg-gray-100 border-b border-gray-200 py-3">
          <div className="container mx-auto px-4">
            <div 
              className="bg-white border border-gray-300 rounded-lg flex items-center justify-center mx-auto"
              style={{ 
                maxWidth: '320px',
                height: '100px'
              }}
            >
              <div className="text-center text-sm text-gray-500">
                <div className="font-medium">Google AdSense</div>
                <div className="text-xs text-gray-400">320 × 100 - Mobile Banner</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Horizontal Banner Ad - STICKY (Optional - for other modes) - HIDDEN ON MOBILE */}
      {!shouldShowInlineAd && shouldShowTopBanner && (
        <div 
          className={`hidden lg:block bg-gray-100 border-b border-gray-200 py-4 z-40 ${
            adConfig.topBannerAd.sticky ? 'sticky top-16' : ''
          }`}
        >
          <div className={`container mx-auto px-4 ${containerMaxWidth}`}>
            <div 
              className="bg-white border border-gray-300 rounded-lg flex items-center justify-center mx-auto"
              style={{ 
                maxWidth: '728px',
                height: `${adConfig.topBannerAd.height}px`
              }}
            >
              <div className="text-center text-sm text-gray-500">
                <div className="font-medium">Google AdSense</div>
                <div className="text-xs text-gray-400">728 × {adConfig.topBannerAd.height} - Horizontal Banner</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Edit Content */}
      <div className={`container mx-auto ${fullWidth ? 'px-2' : 'px-4'} ${containerMaxWidth} pt-2 space-y-3`}>
        {/* Back to Upload Button - OUTSIDE content area */}
        <div className="flex items-center justify-between">
          <DottedButton
            onClick={onBack}
            size="sm"
            variant="primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upload
          </DottedButton>
        </div>

        {/* Choose layout based on side ads */}
        {shouldShowSideAds ? (
          // WITH SIDE ADS: 4-column layout [Left Ad] [Content] [Sidebar] [Right Ad]
          <div className="grid lg:grid-cols-[200px_1fr_340px_200px] gap-6">
            {/* Left Sidebar Ad - Sticky */}
            <div className="hidden lg:block">
              <div 
                className="sticky"
                style={{ top: shouldShowInlineAd ? '200px' : '80px' }}
              >
                <AdPlaceholder 
                  width={160} 
                  height={600} 
                  position="left" 
                />
              </div>
            </div>
            
            {/* Main Content */}
            <div className="bg-white border border-gray-200 rounded-xl p-2 sm:p-3">
              {children}
            </div>
            
            {/* Sidebar */}
            <div>
              <div 
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:sticky max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar"
                style={{ top: shouldShowInlineAd ? '200px' : '80px' }}
              >
                {sidebar}
              </div>
            </div>
            
            {/* Right Sidebar Ad - Sticky */}
            <div className="hidden lg:block">
              <div 
                className="sticky"
                style={{ top: shouldShowInlineAd ? '200px' : '80px' }}
              >
                <AdPlaceholder 
                  width={160} 
                  height={600} 
                  position="right" 
                />
              </div>
            </div>
          </div>
        ) : (
          // WITHOUT SIDE ADS or WITH INLINE AD: 2-column layout [Content] [Sidebar]
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-3">
            {/* MOBILE ORDER 2, DESKTOP ORDER 1: Main Content Area (Pages) */}
            <div className="bg-white border border-gray-200 rounded-xl p-2 sm:p-3 order-2 lg:order-1">
              {/* Main Content (Pages Grid) */}
              {children}
            </div>

            {/* MOBILE ORDER 1, DESKTOP ORDER 2: Settings Panel - SCROLLABLE */}
            <div className="order-1 lg:order-2">
              <div className={`bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:sticky ${showInlineAd ? 'lg:top-[200px]' : 'lg:top-[130px]'} ${showInlineAd ? 'max-h-[calc(100vh-220px)]' : 'max-h-[calc(100vh-150px)]'} overflow-y-auto custom-scrollbar`}>
                {sidebar}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
