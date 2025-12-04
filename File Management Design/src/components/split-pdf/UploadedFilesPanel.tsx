/**
 * Uploaded Files Panel for Split PDF
 * 
 * Displays list of uploaded files with add/remove capabilities
 */

import { FileText, X, Plus } from "lucide-react";
import { Button } from "../ui/button";

interface UploadedFilesPanelProps {
  files: Array<{name: string, size: number}>;
  onAddFiles: () => void;
  onRemoveFile: (index: number) => void;
}

export function UploadedFilesPanel({ files, onAddFiles, onRemoveFile }: UploadedFilesPanelProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white border-2 border-purple-200 rounded-lg p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900">Uploaded Files</h3>
          <p className="text-xs text-gray-500 mt-0.5">{files.length} file(s)</p>
        </div>
        <Button
          onClick={onAddFiles}
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Files
        </Button>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-8">
            <FileText className="w-12 h-12 mb-2 opacity-30" />
            <p className="text-sm">No files uploaded</p>
            <p className="text-xs mt-1">Click "Add Files" to get started</p>
          </div>
        ) : (
          files.map((file, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total Size */}
      {files.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Total size:</span>
            <span className="font-medium text-gray-900">
              {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
