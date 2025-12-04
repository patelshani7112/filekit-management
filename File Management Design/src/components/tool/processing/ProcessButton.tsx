/**
 * ProcessButton Component
 * 
 * Purpose: Button to trigger file processing/conversion
 * - Shows loading state during processing
 * - Disabled when no files or already processing
 * - Shows progress percentage (optional)
 * 
 * Props:
 * - onClick: Callback when button is clicked
 * - isProcessing: Is the process running?
 * - disabled: Is button disabled?
 * - text: Button text (default: "Process Files")
 * - processingText: Text while processing (default: "Processing...")
 * - progress: Optional progress percentage (0-100)
 * 
 * Usage:
 * <ProcessButton 
 *   onClick={handleProcess}
 *   isProcessing={isProcessing}
 *   disabled={files.length === 0}
 *   text="Merge PDFs"
 * />
 */

import { Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";

interface ProcessButtonProps {
  onClick: () => void;
  isProcessing: boolean;
  disabled?: boolean;
  text?: string;
  processingText?: string;
  progress?: number;
}

export function ProcessButton({
  onClick,
  isProcessing,
  disabled = false,
  text = "Process Files",
  processingText = "Processing...",
  progress,
}: ProcessButtonProps) {
  return (
    <div className="w-full space-y-3">
      {/* Progress bar (if processing and progress is provided) */}
      {isProcessing && progress !== undefined && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}

      {/* Process button */}
      <Button
        onClick={onClick}
        disabled={disabled || isProcessing}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12 text-base"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {processingText}
          </>
        ) : (
          text
        )}
      </Button>
    </div>
  );
}
