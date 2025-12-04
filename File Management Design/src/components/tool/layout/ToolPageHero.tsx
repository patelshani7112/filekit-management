/**
 * ToolPageHero Component
 * 
 * Purpose: Display a prominent hero section for tool pages
 * - Centered title with pink color (#e91e63)
 * - SEO-friendly description
 * - Fully responsive design matching existing ToolHeader
 * - Consistent styling across all tools
 * 
 * Props:
 * - title: Main heading (e.g., "Merge PDF")
 * - description: SEO text explaining what the tool does
 * - titleColor: Custom title color (default: #e91e63 pink)
 * - className: Optional additional classes for wrapper
 * 
 * Design Specs:
 * - Matches exact styling from MergePdfPage.tsx
 * - Background: Subtle gradient from white to gray
 * - Title: Pink (#e91e63), responsive sizing (3xl → 4xl → 5xl)
 * - Description: Muted gray, max-width 3xl, responsive text
 * 
 * Usage:
 * <ToolPageHero 
 *   title="Merge PDF" 
 *   description="Merge PDF files instantly with WorkflowPro's fast and secure PDF combiner. Upload multiple PDFs, reorder pages, and join everything into one clean document — completely free and watermark-free."
 * />
 */

interface ToolPageHeroProps {
  title: string;
  description: string;
  titleColor?: string;
  className?: string;
}

export function ToolPageHero({ 
  title, 
  description, 
  titleColor = "text-[#e91e63]",
  className = "" 
}: ToolPageHeroProps) {
  return (
    <div className={`bg-gradient-to-b from-white to-gray-50/50 pt-4 sm:pt-6 md:pt-8 pb-3 sm:pb-4 ${className}`}>
      <div className="container mx-auto px-3 sm:px-4 max-w-[1400px]">
        <div className="text-center mb-4 md:mb-6 px-4">
          {/* Title */}
          <h1 className={`mb-2 ${titleColor} text-3xl sm:text-4xl md:text-5xl`}>
            {title}
          </h1>

          {/* Description / SEO Text */}
          {description && (
            <p className="text-muted-foreground max-w-3xl mx-auto mt-2 leading-relaxed text-sm sm:text-[15px]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
