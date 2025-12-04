/**
 * UseCasesSection Component
 * 
 * Purpose: Display practical use cases for the tool
 * - SEO-optimized with keyword-rich examples
 * - Helps users understand when to use the tool
 * - Improves page ranking with practical applications
 */

import { CheckCircle2 } from "lucide-react";

interface UseCasesSectionProps {
  title?: string;
  useCases: string[];
}

export function UseCasesSection({ 
  title = "Use Cases", 
  useCases 
}: UseCasesSectionProps) {
  return (
    // Hide entire section on mobile
    <div className="hidden sm:block py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl text-[#ec4899] mb-2">{title}</h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
