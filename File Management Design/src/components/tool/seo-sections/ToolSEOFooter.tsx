/**
 * ToolSEOFooter Component
 * 
 * Purpose: SEO-optimized footer text for tool pages
 * - Adds LSI keywords for better ranking
 * - Provides context about the tool
 * - Improves conversion and session duration
 */

interface ToolSEOFooterProps {
  title: string;
  content: string;
}

export function ToolSEOFooter({ title, content }: ToolSEOFooterProps) {
  return (
    // Hide entire section on mobile
    <div className="hidden sm:block py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10">
          <h2 className="text-lg text-[#ec4899] mb-4">{title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
