/**
 * SuccessHeader Component
 * 
 * Purpose: Display full-width success message banner
 * - Shows green success banner at the top
 * - Used after successful file processing
 * 
 * Props:
 * - title: Success title text
 * - description: Description text
 */

import { CheckCircle } from "lucide-react";

interface SuccessHeaderProps {
  title: string;
  description: string;
}

export function SuccessHeader({ title, description }: SuccessHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 py-8">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl text-green-700 mb-2 whitespace-nowrap">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-green-700/80">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
