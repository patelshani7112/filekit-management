/**
 * ProcessingModal Component
 * 
 * Purpose: Reusable centered processing modal with progress bar
 * 
 * Features:
 * - Centered modal that appears on top of all content
 * - Animated icon with spinning ring
 * - Progress bar showing completion percentage
 * - Non-dismissible (can't close until processing completes)
 * - Responsive design for all devices (mobile, tablet, desktop)
 * - Proper z-index layering using Dialog portal
 * - Accessibility support with VisuallyHidden labels
 * 
 * Usage:
 * ```tsx
 * import { ProcessingModal } from "./components/tool/ProcessingModal";
 * import { Scissors } from "lucide-react";
 * 
 * <ProcessingModal
 *   isOpen={isProcessing}
 *   progress={progress}
 *   title="Splitting PDF..."
 *   description="Separating your PDF into multiple files"
 *   icon={Scissors}
 * />
 * ```
 * 
 * Props:
 * - isOpen: boolean - Controls whether modal is visible
 * - progress: number - Progress percentage (0-100)
 * - title: string - Main title text (e.g., "Splitting PDF...")
 * - description: string - Description text below title
 * - icon: LucideIcon - Icon component to display (e.g., Scissors, FileText)
 * - accessibilityTitle?: string - Optional custom title for screen readers (defaults to title)
 * - accessibilityDescription?: string - Optional custom description for screen readers (defaults to description)
 */

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../../ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { LucideIcon } from "lucide-react";

interface ProcessingModalProps {
  /** Controls whether modal is visible */
  isOpen: boolean;
  /** Progress percentage (0-100) */
  progress: number;
  /** Main title text (e.g., "Splitting PDF...") */
  title: string;
  /** Description text below title */
  description: string;
  /** Icon component to display (e.g., Scissors, FileText) */
  icon: LucideIcon;
  /** Optional custom title for screen readers (defaults to title) */
  accessibilityTitle?: string;
  /** Optional custom description for screen readers (defaults to description with additional context) */
  accessibilityDescription?: string;
}

export function ProcessingModal({
  isOpen,
  progress,
  title,
  description,
  icon: Icon,
  accessibilityTitle,
  accessibilityDescription,
}: ProcessingModalProps) {
  // Default accessibility text with more context if not provided
  const defaultAccessibilityDescription = `Please wait while we process your files. This process ${description.toLowerCase()}. Current progress: ${progress}% complete.`;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" hideCloseButton>
        <VisuallyHidden.Root>
          <DialogTitle>{accessibilityTitle || title}</DialogTitle>
          <DialogDescription>
            {accessibilityDescription || defaultAccessibilityDescription}
          </DialogDescription>
        </VisuallyHidden.Root>
        
        <div className="text-center py-6 space-y-6">
          {/* Animated Icon with Spinning Ring */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Icon Circle Background */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
              {/* Spinning Ring Animation */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600">
              {description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {progress}% complete
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
