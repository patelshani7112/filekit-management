/**
 * Grid Utilities
 * 
 * Purpose: Responsive grid column configurations for tool pages
 * Auto-scales based on viewport width to maximize screen space usage
 * 
 * Usage:
 * ```tsx
 * import { getResponsiveGridCols } from '@/utils/gridUtils';
 * 
 * // For page thumbnails (medium size)
 * <div className={getResponsiveGridCols('medium')}>
 *   {pages.map(page => <PageThumbnail />)}
 * </div>
 * 
 * // For small icons/tools
 * <div className={getResponsiveGridCols('small')}>
 *   {tools.map(tool => <ToolIcon />)}
 * </div>
 * 
 * // For large cards
 * <div className={getResponsiveGridCols('large')}>
 *   {items.map(item => <Card />)}
 * </div>
 * ```
 */

export type GridSize = 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Responsive Grid Column Configurations
 * Automatically scales from mobile to ultra-wide displays
 */
export const GRID_CONFIGS = {
  /**
   * SMALL - For icons, small buttons, compact items
   * Mobile → Desktop → Ultra-wide
   * 3 → 4 → 6 → 8 → 10 → 12 columns
   */
  small: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12',
  
  /**
   * MEDIUM - For PDF page thumbnails, image previews (RECOMMENDED)
   * Mobile → Desktop → Ultra-wide
   * 2 → 3 → 4 → 6 → 8 → 10 columns
   */
  medium: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10',
  
  /**
   * LARGE - For cards, feature sections
   * Mobile → Desktop → Ultra-wide
   * 1 → 2 → 3 → 4 → 5 → 6 columns
   */
  large: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
  
  /**
   * XLARGE - For hero cards, large content blocks
   * Mobile → Desktop → Ultra-wide
   * 1 → 1 → 2 → 3 → 4 → 4 columns
   */
  xlarge: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4',
} as const;

/**
 * Get responsive grid column classes
 * 
 * @param size - Grid size preset (small/medium/large/xlarge)
 * @returns Tailwind CSS grid-cols classes
 * 
 * @example
 * ```tsx
 * <div className={`grid ${getResponsiveGridCols('medium')} gap-4`}>
 *   {pages.map(page => <PageThumbnail key={page.id} />)}
 * </div>
 * ```
 */
export function getResponsiveGridCols(size: GridSize = 'medium'): string {
  return GRID_CONFIGS[size];
}

/**
 * Get custom responsive grid with specific column counts
 * For advanced use cases where presets don't fit
 * 
 * @param cols - Column counts for each breakpoint
 * @returns Tailwind CSS grid-cols classes
 * 
 * @example
 * ```tsx
 * const customGrid = getCustomGridCols({
 *   base: 2,    // Mobile
 *   sm: 3,      // Small tablets
 *   md: 5,      // Tablets
 *   lg: 7,      // Desktop
 *   xl: 9,      // Large desktop
 *   '2xl': 11   // Ultra-wide
 * });
 * ```
 */
export function getCustomGridCols(cols: {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}): string {
  const classes: string[] = [];
  
  if (cols.base) classes.push(`grid-cols-${cols.base}`);
  if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
  if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`);
  
  return classes.join(' ');
}

/**
 * Calculate optimal grid columns based on container width
 * Useful for dynamic layouts
 * 
 * @param containerWidth - Container width in pixels
 * @param itemMinWidth - Minimum item width in pixels
 * @param maxColumns - Maximum number of columns (default: 12)
 * @returns Optimal number of columns
 * 
 * @example
 * ```tsx
 * const columns = calculateOptimalColumns(1920, 200, 10);
 * // Returns: 9 (1920px / 200px = 9.6, capped at 10)
 * ```
 */
export function calculateOptimalColumns(
  containerWidth: number,
  itemMinWidth: number,
  maxColumns: number = 12
): number {
  const calculated = Math.floor(containerWidth / itemMinWidth);
  return Math.min(calculated, maxColumns);
}

/**
 * Grid gap configurations
 * Consistent spacing across different layouts
 */
export const GRID_GAPS = {
  none: 'gap-0',
  xs: 'gap-1 sm:gap-2',
  sm: 'gap-2 sm:gap-3',
  md: 'gap-3 sm:gap-4',      // Default/Recommended
  lg: 'gap-4 sm:gap-5 md:gap-6',
  xl: 'gap-6 sm:gap-8 md:gap-10',
} as const;

/**
 * Get responsive grid gap classes
 * 
 * @param size - Gap size preset
 * @returns Tailwind CSS gap classes
 */
export function getGridGap(size: keyof typeof GRID_GAPS = 'md'): string {
  return GRID_GAPS[size];
}

/**
 * Complete grid utility - combines columns + gap
 * One-liner for common grid layouts
 * 
 * @param gridSize - Grid column preset
 * @param gapSize - Gap size preset
 * @returns Complete grid classes string
 * 
 * @example
 * ```tsx
 * <div className={getGridClasses('medium', 'md')}>
 *   // Auto-responsive grid with proper spacing
 * </div>
 * ```
 */
export function getGridClasses(
  gridSize: GridSize = 'medium',
  gapSize: keyof typeof GRID_GAPS = 'md'
): string {
  return `grid ${getResponsiveGridCols(gridSize)} ${getGridGap(gapSize)}`;
}
