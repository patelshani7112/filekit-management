/**
 * NavigationBlocker Component
 * 
 * Easy-to-use component that prevents accidental navigation away from a page.
 * Uses native browser confirmation dialog for simplicity.
 * 
 * Usage:
 * ```tsx
 * <NavigationBlocker
 *   when={files.length > 0 || isProcessing}
 *   message="You have files in progress. Leaving will discard your work."
 *   onSamePageClick={handleReset}
 * />
 * ```
 */

import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationBlockerProps {
  /** Whether to block navigation */
  when: boolean;
  
  /** Custom warning message */
  message?: string;
  
  /** Callback when navigation is blocked */
  onBlock?: () => void;
  
  /** Callback before browser unload */
  onBeforeUnload?: () => void;
  
  /** Callback when user clicks same page route (for resetting) */
  onSamePageClick?: () => void;
}

export function NavigationBlocker({
  when,
  message = "Changes you made may not be saved.",
  onBlock,
  onBeforeUnload,
  onSamePageClick,
}: NavigationBlockerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigatingRef = useRef(false);

  // 1. Block browser navigation (refresh, close tab, back/forward)
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      onBeforeUnload?.();
      e.preventDefault();
      e.returnValue = ""; // Modern browsers require this
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when, onBeforeUnload]);

  // 2. Block link navigation AND handle same-page reset
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      
      // Only handle clicks on actual navigation links (<a> tags)
      while (target && target !== document.body) {
        if (target.tagName === "A") {
          const link = target as HTMLAnchorElement;
          if (link.href) {
            const linkUrl = new URL(link.href);
            const currentUrl = new URL(window.location.href);

            // Check if it's an internal link
            if (linkUrl.origin === currentUrl.origin) {
              const isDifferentPage = linkUrl.pathname !== currentUrl.pathname;
              const isSamePage = linkUrl.pathname === currentUrl.pathname;
              
              // CASE 1: Different page - check if we need to block
              if (isDifferentPage && when) {
                // Skip if we're already navigating (user confirmed)
                if (isNavigatingRef.current) return;
                
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                onBlock?.();
                
                // Show native browser confirm dialog
                const userConfirmed = window.confirm(message);
                
                if (userConfirmed) {
                  // User wants to leave
                  isNavigatingRef.current = true;
                  const destination = linkUrl.pathname + linkUrl.search + linkUrl.hash;
                  setTimeout(() => {
                    navigate(destination);
                    setTimeout(() => {
                      isNavigatingRef.current = false;
                    }, 100);
                  }, 0);
                }
                return;
              } 
              // CASE 2: Same page - reset to initial state (when NOT blocking)
              else if (isSamePage && !when) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Call the reset callback
                onSamePageClick?.();
                return;
              }
            }
          }
        }

        target = target.parentElement as HTMLElement;
      }
    };

    // Use capture phase to intercept before other handlers
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [when, onBlock, message, navigate, location.pathname, onSamePageClick]);

  // 3. Override history API to catch programmatic navigation
  useEffect(() => {
    if (!when) return;

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      if (!isNavigatingRef.current && when) {
        const targetPath = args[2] as string;
        
        if (targetPath) {
          // Check if it's actually navigation (not just hash change)
          const isHashOnly = targetPath.startsWith('#');
          
          if (!isHashOnly) {
            onBlock?.();
            
            // Show native browser confirm dialog
            const userConfirmed = window.confirm(message);
            
            if (userConfirmed) {
              // User wants to leave - allow navigation
              isNavigatingRef.current = true;
              const result = originalPushState.apply(window.history, args);
              setTimeout(() => {
                isNavigatingRef.current = false;
              }, 100);
              return result;
            } else {
              // User cancelled - block navigation
              return;
            }
          }
        }
      }
      return originalPushState.apply(window.history, args);
    };

    window.history.replaceState = function(...args) {
      if (!isNavigatingRef.current && when) {
        const targetPath = args[2] as string;
        
        if (targetPath) {
          const isHashOnly = targetPath.startsWith('#');
          
          if (!isHashOnly) {
            onBlock?.();
            
            // Show native browser confirm dialog
            const userConfirmed = window.confirm(message);
            
            if (userConfirmed) {
              isNavigatingRef.current = true;
              const result = originalReplaceState.apply(window.history, args);
              setTimeout(() => {
                isNavigatingRef.current = false;
              }, 100);
              return result;
            } else {
              return;
            }
          }
        }
      }
      return originalReplaceState.apply(window.history, args);
    };

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [when, message, onBlock]);

  // This component doesn't render anything - it just sets up event listeners
  return null;
}
