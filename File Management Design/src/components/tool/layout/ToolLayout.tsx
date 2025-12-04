/**
 * ToolLayout Component
 * 
 * Purpose: Wrapper layout for all tool pages
 * - Provides consistent structure
 * - Adds padding and max-width
 * - Responsive design
 * 
 * Usage:
 * <ToolLayout>
 *   <YourToolContent />
 * </ToolLayout>
 */

import { ReactNode } from "react";

interface ToolLayoutProps {
  children: ReactNode;
}

export function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
