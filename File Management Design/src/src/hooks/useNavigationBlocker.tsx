/**
 * useNavigationBlocker Hook
 * 
 * Prevents accidental navigation away from a page when there's unsaved work.
 * 
 * Features:
 * - Blocks browser navigation (back, forward, close tab, refresh)
 * - Blocks React Router navigation (internal links)
 * - Customizable warning message
 * 
 * Usage:
 * ```tsx
 * const hasUnsavedWork = files.length > 0 || isProcessing;
 * useNavigationBlocker(hasUnsavedWork, "You have files in progress. Are you sure you want to leave?");
 * ```
 * 
 * Note: For most cases, use the <NavigationBlocker> component instead.
 * This hook is for advanced use cases where you need more control.
 */

import { useEffect } from "react";

interface NavigationBlockerOptions {
  message?: string;
  onBeforeUnload?: () => void;
  onBlock?: () => void;
}

export function useNavigationBlocker(
  shouldBlock: boolean,
  options?: NavigationBlockerOptions | string
) {
  // Handle options parameter (can be string or object)
  const opts: NavigationBlockerOptions = typeof options === "string" 
    ? { message: options } 
    : options || {};

  const defaultMessage = "You have unsaved work. Are you sure you want to leave?";
  const message = opts.message || defaultMessage;

  // Block browser navigation (back, forward, close tab, refresh, external links)
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Call custom callback if provided
      opts.onBeforeUnload?.();

      // Standard way to trigger browser confirmation dialog
      e.preventDefault();
      e.returnValue = message; // Modern browsers ignore custom message but require this
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldBlock, message, opts]);

  // Block React Router navigation (internal links) - using link interception
  useEffect(() => {
    if (!shouldBlock) return;

    const handleClick = (e: MouseEvent) => {
      // Find if click is on a link or inside a link
      let target = e.target as HTMLElement;
      let link: HTMLAnchorElement | null = null;

      // Traverse up to find anchor tag
      while (target && target !== document.body) {
        if (target.tagName === "A") {
          link = target as HTMLAnchorElement;
          break;
        }
        target = target.parentElement as HTMLElement;
      }

      // If we found a link
      if (link && link.href) {
        const linkUrl = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        // Check if it's an internal link (same origin)
        if (linkUrl.origin === currentUrl.origin) {
          // Check if it's a different page
          if (linkUrl.pathname !== currentUrl.pathname) {
            // Call custom callback
            opts.onBlock?.();

            // Show browser confirmation
            const confirmLeave = window.confirm(message);

            if (!confirmLeave) {
              e.preventDefault();
              e.stopPropagation();
            }
          }
        }
      }
    };

    // Capture phase to intercept before other handlers
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [shouldBlock, message, opts]);

  return {
    isBlocking: shouldBlock,
  };
}
