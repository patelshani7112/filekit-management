import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  Image as ImageIcon,
  Video,
  Music,
  FileArchive,
  File,
  AlertCircle
} from "lucide-react";

export interface ToolConfig {
  id: string;
  name: string;
  icon: any;
  acceptedTypes: string[];
  acceptedExtensions: string[];
  multiple: boolean;
  description: string;
  actionLabel: string;
  minFiles?: number; // Minimum files required for operations like merge
}

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toolConfig: ToolConfig | null;
}

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['pdf'].includes(ext || '')) return FileText;
  if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'].includes(ext || '')) return ImageIcon;
  if (['mp4', 'webm', 'mov', 'avi'].includes(ext || '')) return Video;
  if (['mp3', 'wav', 'ogg'].includes(ext || '')) return Music;
  if (['zip', 'rar', '7z'].includes(ext || '')) return FileArchive;
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export function FileUploadDialog({ open, onOpenChange, toolConfig }: FileUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      // Reset when dialog closes
      setTimeout(() => {
        setUploadedFiles([]);
        setErrorMessage("");
      }, 300);
    }
  }, [open]);

  const handleFiles = (files: FileList | null) => {
    if (!files || !toolConfig) return;

    const fileArray = Array.from(files);
    
    // Check for invalid file types
    const invalidFiles: string[] = [];
    const validFiles = fileArray.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const isValid = toolConfig.acceptedExtensions.includes(`.${ext}`);
      if (!isValid) {
        invalidFiles.push(file.name);
      }
      return isValid;
    });

    // Show error for invalid files
    if (invalidFiles.length > 0) {
      const acceptedFormats = toolConfig.acceptedExtensions.join(', ').toUpperCase();
      const errorMsg = `Invalid file type${invalidFiles.length > 1 ? 's' : ''}. Only ${acceptedFormats} files are accepted.`;
      setErrorMessage(errorMsg);
      toast.error(errorMsg, {
        description: invalidFiles.length <= 3 
          ? invalidFiles.join(', ')
          : `${invalidFiles.slice(0, 3).join(', ')} and ${invalidFiles.length - 3} more`,
      });
      
      // Clear error after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000);
    }

    if (validFiles.length === 0) {
      return;
    }

    // Clear error on successful file selection
    setErrorMessage("");

    // If not multiple, only take first file
    const filesToUpload = toolConfig.multiple ? validFiles : [validFiles[0]];

    // Create uploaded file objects
    const newFiles: UploadedFile[] = filesToUpload.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadedFiles(prev => toolConfig.multiple ? [...prev, ...newFiles] : newFiles);

    // Simulate upload progress
    newFiles.forEach(uploadedFile => {
      simulateUpload(uploadedFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === fileId ? { ...f, progress: 100, status: 'complete' as const } : f
          )
        );
      } else {
        setUploadedFiles(prev =>
          prev.map(f => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setErrorMessage(""); // Clear error when removing files
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleProcess = () => {
    if (!toolConfig) return;

    // Check if minimum files requirement is met
    const minFiles = toolConfig.minFiles || 1;
    if (uploadedFiles.length < minFiles) {
      const errorMsg = `This operation requires at least ${minFiles} file${minFiles > 1 ? 's' : ''}. Please upload ${minFiles - uploadedFiles.length} more file${minFiles - uploadedFiles.length > 1 ? 's' : ''}.`;
      setErrorMessage(errorMsg);
      toast.error("Not enough files", {
        description: errorMsg,
      });
      return;
    }

    // Process files here
    console.log('Processing files:', uploadedFiles);
    toast.success("Files processed successfully!");
    setErrorMessage("");
  };

  const allFilesComplete = uploadedFiles.length > 0 && uploadedFiles.every(f => f.status === 'complete');
  const minFiles = toolConfig?.minFiles || 1;
  const hasEnoughFiles = uploadedFiles.length >= minFiles;

  if (!toolConfig) return null;

  const ToolIcon = toolConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] max-h-[90vh] overflow-y-auto thin-scrollbar">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
              <ToolIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle>{toolConfig.name}</DialogTitle>
              <DialogDescription>{toolConfig.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Message Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage("")}
                  className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
              isDragging
                ? "border-blue-400 bg-blue-50 scale-[1.02]"
                : "border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50/30 hover:border-blue-300"
            } ${uploadedFiles.length > 0 && !toolConfig.multiple ? 'opacity-50 pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                className="w-16 h-16 mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border border-blue-200"
                animate={{
                  scale: isDragging ? 1.1 : 1,
                  rotate: isDragging ? 5 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-8 h-8 text-blue-600" />
              </motion.div>
              <h3 className="mb-2">
                {uploadedFiles.length > 0 && toolConfig.multiple
                  ? "Add more files"
                  : "Drop your file here"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to choose {toolConfig.multiple ? 'files' : 'file'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {toolConfig.acceptedExtensions.map((ext) => (
                  <span
                    key={ext}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200"
                  >
                    {ext.toUpperCase()}
                  </span>
                ))}
              </div>
              {toolConfig.minFiles && toolConfig.minFiles > 1 && (
                <p className="text-xs text-blue-600 mt-3 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  Minimum {toolConfig.minFiles} files required
                </p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple={toolConfig.multiple}
              accept={toolConfig.acceptedTypes.join(',')}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Uploaded Files List */}
          <AnimatePresence mode="popLayout">
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm">
                    {uploadedFiles.length} {uploadedFiles.length === 1 ? 'File' : 'Files'} Selected
                  </h4>
                  {toolConfig.minFiles && toolConfig.minFiles > 1 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      hasEnoughFiles 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {hasEnoughFiles ? '✓ Ready' : `Need ${minFiles - uploadedFiles.length} more`}
                    </span>
                  )}
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto thin-scrollbar">
                  {uploadedFiles.map((uploadedFile, index) => {
                    const FileIcon = getFileIcon(uploadedFile.file.name);
                    return (
                      <motion.div
                        key={uploadedFile.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white border border-border rounded-xl p-4 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            uploadedFile.status === 'complete' 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-blue-50 border border-blue-100'
                          }`}>
                            {uploadedFile.status === 'complete' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <FileIcon className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{uploadedFile.file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(uploadedFile.file.size)}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFile(uploadedFile.id)}
                                className="p-1 hover:bg-red-50 rounded-lg transition-colors group"
                              >
                                <X className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                              </button>
                            </div>
                            {uploadedFile.status === 'uploading' && (
                              <div className="space-y-1">
                                <Progress value={uploadedFile.progress} className="h-1.5" />
                                <p className="text-xs text-muted-foreground">
                                  {Math.round(uploadedFile.progress)}%
                                </p>
                              </div>
                            )}
                            {uploadedFile.status === 'complete' && (
                              <p className="text-xs text-green-600">Upload complete</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          {allFilesComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 pt-4 border-t border-border"
            >
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProcess}
                disabled={!hasEnoughFiles}
                className={`flex-1 ${
                  hasEnoughFiles
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {toolConfig.actionLabel}
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
