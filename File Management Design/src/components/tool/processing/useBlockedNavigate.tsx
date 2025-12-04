/**
 * useBlockedNavigate Hook
 * 
 * A wrapper around React Router's navigate that can be blocked
 * when certain conditions are met (e.g., unsaved work).
 * 
 * This is used internally by NavigationBlocker to intercept
 * programmatic navigation calls.
 */

import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";

interface BlockedNavigateOptions {
  when: boolean;
  onBlock: () => void;
}

export function useBlockedNavigate(options?: BlockedNavigateOptions) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const blockedNavigate = useCallback((to: string | number, navigateOptions?: any) => {
    // If blocking is enabled and trying to navigate
    if (options?.when && typeof to === 'string') {
      // Check if it's actual navigation (not hash only)
      if (!to.startsWith('#')) {
        // Trigger the block callback
        options.onBlock();
        return; // Don't navigate
      }
    }
    
    // Otherwise, navigate normally
    navigate(to as any, navigateOptions);
  }, [navigate, options]);
  
  return blockedNavigate;
}
