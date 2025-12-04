/**
 * ToolDefinitionSection Component
 * 
 * Purpose: SEO-optimized definition section for tool pages
 * - Answers "What is..." questions
 * - Improves SEO with keyword-rich content
 * - Appears after main tool area
 */

interface ToolDefinitionSectionProps {
  title: string;
  content: string;
}

export function ToolDefinitionSection({ title, content }: ToolDefinitionSectionProps) {
  return (
    <div className="hidden sm:block py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10">
          <h2 className="text-xl text-[#ec4899] mb-4 text-center">{title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
