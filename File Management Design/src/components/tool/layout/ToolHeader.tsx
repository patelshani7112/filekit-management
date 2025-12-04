/**
 * ToolHeader Component
 * 
 * Purpose: Display tool title and description at the top
 * - Shows tool name
 * - Shows helpful description
 * - Consistent styling across all tools
 * 
 * Props:
 * - title: Main heading (e.g., "Merge PDF")
 * - description: Helpful text explaining what the tool does
 * - icon: Optional Lucide icon component
 * - seoText: Optional SEO text for additional information
 * 
 * Usage:
 * <ToolHeader 
 *   title="Merge PDF" 
 *   description="Combine multiple PDF files into one"
 *   icon={FileText}
 *   seoText="This tool allows you to merge multiple PDF files into a single document, making it easy to organize and share your content."
 * />
 */

import { LucideIcon } from "lucide-react";

interface ToolHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  seoText?: string;
}

export function ToolHeader({ title, description, icon: Icon, seoText }: ToolHeaderProps) {
  return (
    <div className="text-center mb-4 md:mb-6 px-4">
      {/* Title */}
      <h1 className="mb-2 text-[#e91e63] text-3xl sm:text-4xl md:text-5xl">{title}</h1>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          {description}
        </p>
      )}

      {/* SEO Text */}
      {seoText && (
        <p className="text-muted-foreground max-w-3xl mx-auto mt-2 leading-relaxed text-sm sm:text-[15px]">
          {seoText}
        </p>
      )}
    </div>
  );
}
