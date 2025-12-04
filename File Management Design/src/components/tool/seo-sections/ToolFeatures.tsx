/**
 * ToolFeatures Component
 * 
 * Purpose: Display feature list for the tool
 * - Shows key features with icons
 * - Grid layout
 * - Responsive design
 */

import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ToolFeaturesProps {
  features: Feature[];
}

export function ToolFeatures({ features }: ToolFeaturesProps) {
  return (
    <div className="w-full mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 text-center space-y-3 hover:border-purple-300 transition-colors"
            >
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base">{feature.title}</h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
