/**
 * RelatedToolsSection Component
 * 
 * Purpose: Display related tools in a responsive grid layout
 * - Shows tools relevant to the current page
 * - Different layouts for mobile vs desktop
 * - Orange gradient icons with hover effects
 * - Pink title and hover states
 */

import { LucideIcon } from "lucide-react";
import { Card } from "../../ui/card";

export interface RelatedTool {
  name: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

interface RelatedToolsSectionProps {
  tools: RelatedTool[];
  introText?: string;
}

export function RelatedToolsSection({ tools, introText }: RelatedToolsSectionProps) {
  return (
    <div className="pt-6 sm:pt-8 pb-8 sm:pb-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          {/* Title - Pink Color */}
          <h2 className="text-lg sm:text-xl text-[#ec4899] mb-2">
            Related Tools
          </h2>
          
          {/* Intro Text - Hidden on mobile for cleaner look */}
          {introText && (
            <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground">
              {introText}
            </p>
          )}
        </div>

        {/* ========================================
            DESKTOP/TABLET LAYOUT (sm and above)
            ======================================== */}
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card
                key={index}
                className="p-4 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-[#ec4899]"
                onClick={tool.onClick}
              >
                <div className="flex flex-col items-center space-y-3">
                  {/* Icon Container - Orange Gradient Circle */}
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Tool Name - Hover turns pink */}
                  <h3 className="text-sm leading-tight group-hover:text-[#ec4899] transition-colors font-medium">
                    {tool.name}
                  </h3>
                </div>
              </Card>
            );
          })}
        </div>

        {/* ========================================
            MOBILE LAYOUT (< sm)
            ======================================== */}
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card
                key={index}
                className="p-3 hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-[#ec4899]"
                onClick={tool.onClick}
              >
                <div className="flex items-center gap-2">
                  {/* Icon Container - Orange Gradient Circle (Slightly larger on mobile) */}
                  <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Tool Name - Smaller text on mobile, hover turns pink */}
                  <h3 className="text-xs font-medium group-hover:text-[#ec4899] transition-colors leading-tight">
                    {tool.name}
                  </h3>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
