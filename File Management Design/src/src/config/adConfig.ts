/**
 * Global Ad Configuration
 *
 * Control ads across entire application from one place.
 * Can be overridden per-page if needed.
 *
 * Quick Toggle:
 * - Set `enabled: false` to disable ALL ads globally
 * - Set `enabled: true` to enable ads globally
 */

export interface AdConfig {
  // 🎯 MASTER SWITCH - Toggle ALL ads on/off
  enabled: Boolean;

  // Side ads (Desktop 180×600)
  sideAds: {
    enabled: boolean;
    left: boolean;
    right: boolean;
    width: number;
    height: number;
    sticky: boolean;
    stickyOffset: number; // Distance from top when stuck (in pixels)
  };

  // Mobile ads (320×100 horizontal banner)
  mobileAds: {
    enabled: boolean;
    position: "top" | "bottom" | "both";
    height: number;
    sticky: boolean;
    stickyOffset: number;
  };

  // Top banner ads (728×90) - for edit pages
  topBannerAd: {
    enabled: boolean;
    height: number;
    sticky: boolean;
  };

  // Inline ads (between content sections)
  inlineAds: {
    enabled: boolean;
    positions: number[]; // After which section (0-based index)
    height: number;
  };

  // Responsive breakpoints
  breakpoints: {
    hideSideAds: number; // Below this width, hide side ads (px)
    showMobileAds: number; // Below this width, show mobile ads (px)
  };
}

// 🎯 DEFAULT CONFIGURATION - CHANGE HERE TO AFFECT ALL PAGES
export const AD_CONFIG: AdConfig = {
  // 🔥 MASTER SWITCH - Set to false to disable ALL ads everywhere
  enabled: false,

  sideAds: {
    enabled: true, // Toggle side ads on/off
    left: true, // Show left ad
    right: true, // Show right ad
    width: 160, // Standard Google AdSense Wide Skyscraper
    height: 600,
    sticky: true,
    stickyOffset: 80, // 80px from top (below header)
  },

  mobileAds: {
    enabled: true, // Toggle mobile ads on/off
    position: "top",
    height: 100,
    sticky: true,
    stickyOffset: 64,
  },

  topBannerAd: {
    enabled: true, // Top banner for edit pages (horizontal banner ads)
    height: 90,
    sticky: true,
  },

  inlineAds: {
    enabled: false, // Inline ads between sections (disabled by default)
    positions: [2, 5], // After 2nd and 5th section
    height: 90,
  },

  breakpoints: {
    hideSideAds: 1024, // Hide side ads below 1024px (tablet)
    showMobileAds: 1024, // Show mobile ads below 1024px
  },
};

// 📦 PRESET CONFIGURATIONS for quick switching
export const AD_PRESETS = {
  // Full ads (maximum revenue)
  FULL_ADS: {
    ...AD_CONFIG,
    enabled: true,
    sideAds: { ...AD_CONFIG.sideAds, enabled: true },
    mobileAds: { ...AD_CONFIG.mobileAds, enabled: true },
    inlineAds: {
      ...AD_CONFIG.inlineAds,
      enabled: true,
      positions: [2, 5, 8],
    },
  } as AdConfig,

  // Side ads only (clean look)
  SIDE_ADS_ONLY: {
    ...AD_CONFIG,
    enabled: true,
    sideAds: { ...AD_CONFIG.sideAds, enabled: true },
    mobileAds: { ...AD_CONFIG.mobileAds, enabled: true },
    inlineAds: { ...AD_CONFIG.inlineAds, enabled: false },
  } as AdConfig,

  // No ads (clean experience)
  NO_ADS: {
    ...AD_CONFIG,
    enabled: false,
  } as AdConfig,

  // Edit page (top banner only)
  EDIT_PAGE: {
    ...AD_CONFIG,
    enabled: true,
    sideAds: { ...AD_CONFIG.sideAds, enabled: false },
    topBannerAd: { ...AD_CONFIG.topBannerAd, enabled: true },
    mobileAds: { ...AD_CONFIG.mobileAds, enabled: true },
  } as AdConfig,
};

// 🔧 HELPER FUNCTIONS

/**
 * Check if any ads are enabled
 */
export function hasAdsEnabled(
  config: AdConfig = AD_CONFIG,
): boolean {
  if (!config.enabled) return false;
  return (
    config.sideAds.enabled ||
    config.mobileAds.enabled ||
    config.topBannerAd.enabled ||
    config.inlineAds.enabled
  );
}

/**
 * Get effective config with overrides
 */
export function getAdConfig(
  overrides?: Partial<AdConfig>,
): AdConfig {
  if (!overrides) return AD_CONFIG;

  return {
    ...AD_CONFIG,
    ...overrides,
    sideAds: {
      ...AD_CONFIG.sideAds,
      ...(overrides.sideAds || {}),
    },
    mobileAds: {
      ...AD_CONFIG.mobileAds,
      ...(overrides.mobileAds || {}),
    },
    topBannerAd: {
      ...AD_CONFIG.topBannerAd,
      ...(overrides.topBannerAd || {}),
    },
    inlineAds: {
      ...AD_CONFIG.inlineAds,
      ...(overrides.inlineAds || {}),
    },
    breakpoints: {
      ...AD_CONFIG.breakpoints,
      ...(overrides.breakpoints || {}),
    },
  };
}

/**
 * Check if side ads should be shown
 */
export function shouldShowSideAds(
  config: AdConfig = AD_CONFIG,
): boolean {
  return (
    config.enabled &&
    config.sideAds.enabled &&
    (config.sideAds.left || config.sideAds.right)
  );
}

/**
 * Get content max width based on ad configuration
 * - With ads: max-w-4xl (~1024px)
 * - Without ads: max-w-6xl (~1536px)
 */
export function getContentMaxWidth(
  config: AdConfig = AD_CONFIG,
): string {
  return shouldShowSideAds(config) ? "max-w-4xl" : "max-w-6xl";
}