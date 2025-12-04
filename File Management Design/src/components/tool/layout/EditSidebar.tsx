/**
 * EditSidebar Component
 * 
 * Purpose: Right sidebar panel for edit steps
 * Contains source files, output settings, and action button
 * 
 * Props:
 * - title: Panel title (e.g., "Merge Settings", "Split Settings")
 * - files: Array of source files
 * - onAddFiles: Callback for adding more files
 * - outputFileName: Output filename
 * - onOutputFileNameChange: Callback when filename changes
 * - totalPages: Total number of pages
 * - totalSize: Total file size (optional)
 * - actionButtonText: Text for main action button (e.g., "Merge PDF")
 * - onAction: Callback for main action button
 * - actionButtonDisabled: Disable action button? (default: false)
 * - children: Optional additional content (custom settings)
 * - sourceFilesList: Custom source files list component (optional)
 * 
 * Usage:
 * <EditSidebar
 *   title="Merge Settings"
 *   files={files}
 *   onAddFiles={handleAddFiles}
 *   outputFileName={outputFileName}
 *   onOutputFileNameChange={setOutputFileName}
 *   totalPages={31}
 *   totalSize="4.2 MB"
 *   actionButtonText="Merge PDF"
 *   onAction={handleMerge}
 *   sourceFilesList={<SourceFilesList ... />}
 * />
 */

import { ReactNode } from "react";
import { FilePlus } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface EditSidebarProps {
  title: string;
  files?: File[];
  onAddFiles?: () => void;
  outputFileName?: string;
  onOutputFileNameChange?: (filename: string) => void;
  totalPages: number;
  totalSize?: string;
  actionButtonText: string;
  onAction: () => void;
  actionButtonDisabled?: boolean;
  children?: ReactNode; // Additional custom settings
  sourceFilesList?: ReactNode; // Custom source files list component
}

export function EditSidebar({
  title,
  files = [],
  onAddFiles,
  outputFileName,
  onOutputFileNameChange,
  totalPages,
  totalSize,
  actionButtonText,
  onAction,
  actionButtonDisabled = false,
  children,
  sourceFilesList,
}: EditSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>

        {/* Add More Files Button */}
        {onAddFiles && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-8 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-500 hover:text-white transition-colors"
            onClick={onAddFiles}
          >
            <FilePlus className="w-3.5 h-3.5" />
            Add Files
          </Button>
        )}
      </div>

      {/* Source Files Section (if provided) */}
      {sourceFilesList && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Source Files</h4>
          {sourceFilesList}
        </div>
      )}

      {/* Custom Content (Additional Settings) */}
      {children}

      {/* Output Settings */}
      {outputFileName !== undefined && onOutputFileNameChange && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Output Settings</h4>
          <div className="space-y-2">
            <Label htmlFor="outputFileName" className="text-xs text-gray-600">
              Filename
            </Label>
            <Input
              id="outputFileName"
              type="text"
              value={outputFileName}
              onChange={(e) => onOutputFileNameChange(e.target.value)}
              placeholder="output.pdf"
              className="text-sm bg-purple-50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />

            {/* Total Pages and Size Info */}
            <div className="flex items-center justify-between pt-3 pb-1">
              <div className="text-xs text-gray-600">
                <div>
                  Total: <span className="font-medium text-gray-900">{totalPages} pages</span>
                </div>
                {totalSize && (
                  <div className="mt-0.5">
                    Size: <span className="font-medium text-gray-900">{totalSize}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={onAction}
        disabled={actionButtonDisabled}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {actionButtonText}
      </Button>
    </div>
  );
}
