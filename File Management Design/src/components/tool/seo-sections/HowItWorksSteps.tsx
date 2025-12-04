/**
 * HowItWorksSteps Component
 * 
 * Purpose: Display step-by-step instructions for how a tool works
 * 
 * Design:
 * - Pink title (#ec4899)
 * - Gray subtitle and intro text
 * - Numbered steps in cards with gradient icons
 * - Responsive grid layout (1 col mobile → 2 col tablet → 4 col desktop)
 */

import { LucideIcon } from "lucide-react";

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string; // Tailwind gradient classes: "from-purple-400 to-purple-500"
}

interface HowItWorksStepsProps {
  title?: string;
  subtitle?: string;
  steps: HowItWorksStep[];
  introText?: string;
}

export function HowItWorksSteps({
  title = "How It Works",
  subtitle = "Complete your task in four simple steps",
  steps,
  introText,
}: HowItWorksStepsProps) {
  return (
    <div className="pt-8 sm:pt-12 pb-12 sm:pb-16 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          {/* Title - Always visible, pink color */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#ec4899] font-normal">
            {title}
          </h2>

          {/* Subtitle - Always visible on all devices */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Intro Text - Always visible if provided */}
          {introText && (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {introText}
            </p>
          )}
        </div>

        {/* Steps Grid - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center bg-white rounded-2xl p-6 sm:p-7 lg:p-8 border border-gray-200/80 hover:border-pink-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Step Number Badge - Top right corner */}
                <div className="absolute -top-3 -right-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-pink-400 flex items-center justify-center shadow-lg z-10">
                  <span className="text-white text-sm sm:text-base font-medium">
                    {step.number}
                  </span>
                </div>

                {/* Icon Box - Gradient background */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-[88px] lg:h-[88px] rounded-2xl bg-gradient-to-br ${step.iconBgColor} flex items-center justify-center shadow-md mb-5 sm:mb-6`}
                >
                  <Icon className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
                </div>

                {/* Step Title */}
                <h3 className="text-sm sm:text-base lg:text-lg text-foreground mb-2 sm:mb-3 leading-tight">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
