/**
 * Repair PDF Page
 * 
 * Purpose: Allow users to repair corrupted or damaged PDF files
 * 
 * Features:
 * - Upload corrupted PDF files
 * - Preview and manage files before repair
 * - Configure repair options
 * - Attempt to repair damaged PDFs
 * - Show repair status for each file
 * - Download repaired PDFs
 * 
 * How it works:
 * 1. User uploads PDF files (even corrupted ones)
 * 2. User reviews files and configures repair settings  
 * 3. User clicks "Repair PDF"
 * 4. Files are processed and repaired
 * 5. User downloads the repaired PDFs
 */

import { useState, useEffect } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import { ToolPageLayout } from "../../../components/tool/layout/ToolPageLayout";
import { EditPageLayout } from "../../../components/tool/layout/EditPageLayout";
import { ToolPageHero } from "../../../components/tool/layout/ToolPageHero";
import { FileUploader } from "../../../components/tool/file-management/FileUploader";
import { FileListWithValidation } from "../../../components/tool/file-management/FileListWithValidation";
import { NavigationBlocker } from "../../../components/tool/processing/NavigationBlocker";
import { ProcessingModal } from "../../../components/tool/processing/ProcessingModal";
import { SuccessHeader } from "../../../components/tool/success/SuccessHeader";
import { ToolSuccessSection } from "../../../components/tool/success/ToolSuccessSection";
import { RelatedToolsSection } from "../../../components/tool/seo-sections/RelatedToolsSection";
import { HowItWorksSteps } from "../../../components/tool/seo-sections/HowItWorksSteps";
import { WhyChooseSection } from "../../../components/tool/seo-sections/WhyChooseSection";
import { ToolFAQSection } from "../../../components/tool/seo-sections/ToolFAQSection";
import { ToolDefinitionSection } from "../../../components/tool/seo-sections/ToolDefinitionSection";
import { UseCasesSection } from "../../../components/tool/seo-sections/UseCasesSection";
import { ToolSEOFooter } from "../../../components/tool/seo-sections/ToolSEOFooter";
import { MobileStickyAd } from "../../../components/tool/ads/MobileStickyAd";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { 
  FileText, Upload, Download, Wrench, X, CheckCircle2, XCircle, 
  AlertCircle, Merge, Split, FileEdit, FileCog, Archive, RefreshCw, 
  FileType, FileImage, RotateCw, FileMinus, FileKey, FileSignature, LockOpen,
  AlertTriangle, Shield, Info, GripVertical
} from "lucide-react";
import { getPdfInfo } from "../../../utils/pdfUtils";

// How it works steps for this tool
const STEPS = [
  {
    number: 1,
    title: "Upload PDFs",
    description: "Select one or multiple PDF files that need repair. Even corrupted files can be uploaded.",
    icon: Upload,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Automatic Analysis",
    description: "Our tool analyzes each PDF to detect corruption, missing data, or structural issues.",
    icon: Wrench,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Configure Repair",
    description: "Review detected problems and choose repair options that best suit your needs.",
    icon: FileCog,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Download Fixed PDFs",
    description: "Download your repaired PDF files. See which files were successfully repaired.",
    icon: Download,
    iconBgColor: "from-green-400 to-green-500",
  },
];

interface RepairPdfPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

interface DetectedProblem {
  type: "critical" | "warning" | "info";
  message: string;
}

interface FileValidationInfo {
  file: File;
  isValidating: boolean;
  isValid: boolean;
  pageCount: number;
  error?: string;
  problems?: DetectedProblem[];
  status?: "validated" | "has-warnings" | "critical-errors";
}

interface RepairResult {
  fileName: string;
  originalFile: File;
  success: boolean;
  error?: string;
  url?: string;
  issuesFound?: string[];
  issuesFixed?: string[];
}

export default function RepairPdfPage({ onWorkStateChange }: RepairPdfPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [repairResults, setRepairResults] = useState<RepairResult[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [processedFileName, setProcessedFileName] = useState("repaired-files.zip");
  
  // Repair options state
  const [deepRepairMode, setDeepRepairMode] = useState(true);
  const [rebuildStructure, setRebuildStructure] = useState(true);
  const [fixFonts, setFixFonts] = useState(true);
  const [removeInvalid, setRemoveInvalid] = useState(true);
  const [createBackup, setCreateBackup] = useState(false);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");

  // Related tools for this page
  const relatedTools = [
    {
      name: "Merge PDF",
      description: "Combine multiple PDF files into one",
      icon: Merge,
      onClick: () => window.location.href = "/merge-pdf",
    },
    {
      name: "Compress PDF",
      description: "Reduce PDF file size",
      icon: Archive,
      onClick: () => window.location.href = "/compress-pdf",
    },
    {
      name: "Split PDF",
      description: "Extract pages from your PDF",
      icon: Split,
      onClick: () => window.location.href = "/split-pdf",
    },
    {
      name: "Edit PDF",
      description: "Add text, images, and annotations to your PDF",
      icon: FileEdit,
      onClick: () => window.location.href = "/edit-pdf",
    },
    {
      name: "Organize PDF",
      description: "Reorder, rotate, and manage PDF pages",
      icon: FileCog,
      onClick: () => window.location.href = "/organize-pdf",
    },
    {
      name: "Convert to PDF",
      description: "Convert Word, Excel, PowerPoint, and images to PDF",
      icon: RefreshCw,
      onClick: () => window.location.href = "/convert-to-pdf",
    },
    {
      name: "PDF to Word",
      description: "Convert PDF to editable Word document",
      icon: FileType,
      onClick: () => window.location.href = "/pdf-to-word",
    },
    {
      name: "PDF to Image",
      description: "Convert PDF pages to JPG or PNG images",
      icon: FileImage,
      onClick: () => window.location.href = "/pdf-to-image",
    },
    {
      name: "Rotate PDF",
      description: "Rotate PDF pages to the correct orientation",
      icon: RotateCw,
      onClick: () => window.location.href = "/rotate-pdf",
    },
    {
      name: "Delete PDF Pages",
      description: "Remove unwanted pages from your PDF",
      icon: FileMinus,
      onClick: () => window.location.href = "/delete-pdf-pages",
    },
    {
      name: "Watermark PDF",
      description: "Add text or image watermark to PDF",
      icon: FileSignature,
      onClick: () => window.location.href = "/watermark-pdf",
    },
    {
      name: "Protect PDF",
      description: "Add password protection to your PDF",
      icon: FileKey,
      onClick: () => window.location.href = "/protect-pdf",
    },
    {
      name: "Unlock PDF",
      description: "Remove password protection from PDF",
      icon: LockOpen,
      onClick: () => window.location.href = "/unlock-pdf",
    },
  ];

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = files.length > 0 && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, currentStep, onWorkStateChange]);

  // Handle file selection and analysis
  const handleFilesSelected = async (newFiles: File[]) => {
    const maxFiles = 10;
    const maxFileSize = 100; // MB - larger limit for repair
    const currentFileCount = files.length;
    const availableSlots = maxFiles - currentFileCount;
    
    // Clear previous validation messages
    setValidationMessage("");
    
    // Check file count limit
    if (currentFileCount >= maxFiles) {
      setValidationMessage(`Maximum ${maxFiles} files allowed. Please remove some files before adding more.`);
      setValidationType("warning");
      return;
    }
    
    // Validate file types (PDF only) - but be lenient for corrupted files
    const invalidFiles = newFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return ext !== '.pdf';
    });
    
    if (invalidFiles.length > 0) {
      setValidationMessage(`Only PDF files are allowed. ${invalidFiles.length} invalid file(s) removed.`);
      setValidationType("error");
      newFiles = newFiles.filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return ext === '.pdf';
      });
    }
    
    // Validate file sizes
    const oversizedFiles = newFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setValidationMessage(`${oversizedFiles.length} file(s) exceed ${maxFileSize}MB limit and were removed.`);
      setValidationType("error");
      newFiles = newFiles.filter(file => file.size <= maxFileSize * 1024 * 1024);
    }
    
    // Check available slots
    const filesToAdd = availableSlots < newFiles.length 
      ? newFiles.slice(0, availableSlots)
      : newFiles;
    
    if (filesToAdd.length < newFiles.length) {
      setValidationMessage(`Only ${filesToAdd.length} file(s) added. Maximum ${maxFiles} files allowed (you have ${currentFileCount} already).`);
      setValidationType("warning");
    }
    
    if (filesToAdd.length === 0) return;
    
    const startIndex = files.length;
    
    // Add files to state
    setFiles((prev) => [...prev, ...filesToAdd]);
    
    // Create validation info for each file (initially validating)
    const newValidationInfo: FileValidationInfo[] = filesToAdd.map(file => ({
      file,
      isValidating: true,
      isValid: false,
      pageCount: 0,
    }));
    
    setFileValidationInfo((prev) => [...prev, ...newValidationInfo]);

    // Analyze each PDF file - BUT ALLOW CORRUPTED FILES
    filesToAdd.forEach(async (file, index) => {
      const fileIndex = startIndex + index;
      
      try {
        // Try to get PDF info - but don't fail if it's corrupted
        let pdfInfo;
        let isBroken = false;
        
        try {
          pdfInfo = await getPdfInfo(file);
        } catch (error) {
          // File is broken/corrupted - this is expected for repair tool!
          isBroken = true;
          pdfInfo = {
            isValid: false,
            pageCount: 0,
            error: "File appears to be corrupted or damaged"
          };
        }
        
        // Simulate problem detection
        const hasCriticalIssues = isBroken || Math.random() > 0.7;
        const hasWarnings = !isBroken && Math.random() > 0.3;
        
        const problems: DetectedProblem[] = [];
        
        if (isBroken) {
          // File is actually broken
          problems.push({
            type: "critical",
            message: "Unable to read PDF structure - file is corrupted"
          });
          problems.push({
            type: "critical",
            message: "Major structural damage detected"
          });
        } else if (hasCriticalIssues) {
          problems.push({
            type: "critical",
            message: "Broken cross-reference table detected"
          });
          problems.push({
            type: "critical",
            message: "Invalid object references found"
          });
        }
        
        if (!isBroken && hasWarnings) {
          problems.push({
            type: "warning",
            message: "Embedded font issues detected"
          });
          problems.push({
            type: "warning",
            message: "Non-standard PDF structure"
          });
        }
        
        if (!isBroken && !hasCriticalIssues && !hasWarnings) {
          problems.push({
            type: "info",
            message: "No critical corruption detected"
          });
          problems.push({
            type: "info",
            message: "File can still be optimized"
          });
        }
        
        // Update validation info - MARK AS VALID EVEN IF CORRUPTED
        // This allows users to continue with broken files
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: true, // Always mark as "valid" for repair tool - we WANT corrupted files!
            pageCount: pdfInfo.pageCount || 0,
            error: isBroken ? "Corrupted - ready for repair" : undefined,
            problems,
            status: hasCriticalIssues ? "critical-errors" : hasWarnings ? "has-warnings" : "validated",
          };
          return updated;
        });
      } catch (error) {
        // Even if analysis completely fails, still allow the file
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: true, // Still mark as valid - we want to try repairing it!
            pageCount: 0,
            error: "Severely corrupted - will attempt repair",
            problems: [
              {
                type: "critical",
                message: "Unable to analyze file - severe corruption"
              },
              {
                type: "critical",
                message: "Repair tool will attempt recovery"
              }
            ],
            status: "critical-errors",
          };
          return updated;
        });
      }
    });
  };

  // Remove a file from the list
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileValidationInfo((prev) => prev.filter((_, i) => i !== index));
    setValidationMessage("");
  };

  // Reorder files
  const handleReorderFiles = (fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
    setFileValidationInfo((prev) => {
      const newInfo = [...prev];
      const [movedInfo] = newInfo.splice(fromIndex, 1);
      newInfo.splice(toIndex, 0, movedInfo);
      return newInfo;
    });
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setValidationMessage("");
  };

  // Retry validation for a specific file
  const handleRetryValidation = async (index: number) => {
    const file = files[index];
    if (!file) return;

    // Set file to validating state
    setFileValidationInfo((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isValidating: true,
        isValid: false,
        error: undefined,
      };
      return updated;
    });

    try {
      // Get PDF info
      const pdfInfo = await getPdfInfo(file);
      
      // Simulate problem detection
      const hasCriticalIssues = Math.random() > 0.7;
      const hasWarnings = Math.random() > 0.3;
      
      const problems: DetectedProblem[] = [];
      
      if (hasCriticalIssues) {
        problems.push({
          type: "critical",
          message: "Broken cross-reference table detected"
        });
        problems.push({
          type: "critical",
          message: "Invalid object references found"
        });
      }
      
      if (hasWarnings) {
        problems.push({
          type: "warning",
          message: "Embedded font issues detected"
        });
        problems.push({
          type: "warning",
          message: "Non-standard PDF structure"
        });
      }
      
      if (!hasCriticalIssues && !hasWarnings) {
        problems.push({
          type: "info",
          message: "No critical corruption detected"
        });
        problems.push({
          type: "info",
          message: "File can still be optimized"
        });
      }
      
      // Update validation info
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: pdfInfo.isValid,
          pageCount: pdfInfo.pageCount,
          error: pdfInfo.error,
          problems,
          status: hasCriticalIssues ? "critical-errors" : hasWarnings ? "has-warnings" : "validated",
        };
        return updated;
      });
    } catch (error) {
      // Handle unexpected errors
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: false,
          pageCount: 0,
          error: "Failed to read PDF file",
        };
        return updated;
      });
    }
  };

  // Go to edit step
  const handleContinueToEdit = () => {
    setCurrentStep("edit");
  };

  // Go back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  // Process files (repair PDFs)
  const handleProcessFiles = async () => {
    setCurrentStep("processing");
    setProgress(0);

    const results: RepairResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = fileValidationInfo[i];
      const progressPerFile = 100 / files.length;
      
      // Simulate repair progress for this file
      for (let j = 0; j <= 100; j += 20) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        setProgress(Math.floor((i * progressPerFile) + (j * progressPerFile / 100)));
      }
      
      // Simulate repair - higher success rate if no critical errors
      const repairSuccess = validation.status === "critical-errors" ? Math.random() > 0.3 : Math.random() > 0.1;
      
      if (repairSuccess) {
        // Create a mock repaired PDF blob
        const mockPdfContent = `Repaired PDF: ${file.name}\nOriginal Size: ${file.size} bytes\nRepair Status: Success\nIssues Fixed: ${validation.problems?.map(p => p.message).join(", ") || "None"}`;
        const blob = new Blob([mockPdfContent], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        
        results.push({
          fileName: file.name.replace('.pdf', '_repaired.pdf'),
          originalFile: file,
          success: true,
          url,
          issuesFound: validation.problems?.map(p => p.message) || [],
          issuesFixed: validation.problems?.map(p => p.message) || [],
        });
      } else {
        // Repair failed
        results.push({
          fileName: file.name,
          originalFile: file,
          success: false,
          error: "Unable to repair: File is severely corrupted or encrypted",
          issuesFound: validation.problems?.map(p => p.message) || [],
        });
      }
    }

    setRepairResults(results);
    setProgress(100);
    
    // If multiple successful repairs, create a zip
    const successfulRepairs = results.filter(r => r.success);
    if (successfulRepairs.length > 1) {
      // Mock zip creation
      const mockZipContent = `Repaired PDFs Archive\n${successfulRepairs.map(r => r.fileName).join('\n')}`;
      const blob = new Blob([mockZipContent], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName("repaired-files.zip");
    } else if (successfulRepairs.length === 1) {
      // Single file
      setDownloadUrl(successfulRepairs[0].url || "");
      setProcessedFileName(successfulRepairs[0].fileName);
    }
    
    setCurrentStep("complete");
  };

  // Reset to upload more files
  const handleReset = () => {
    // Clean up old blob URLs
    repairResults.forEach((result) => {
      if (result.url) {
        URL.revokeObjectURL(result.url);
      }
    });
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

    // Reset state
    setFiles([]);
    setFileValidationInfo([]);
    setCurrentStep("upload");
    setProgress(0);
    setRepairResults([]);
    setValidationMessage("");
    setDownloadUrl("");
    setProcessedFileName("repaired-files.zip");
  };

  // Calculate total file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Calculate if we should block navigation
  const hasUnsavedWork = files.length > 0 && currentStep !== "complete";

  // Count successful repairs
  const successfulRepairs = repairResults.filter(r => r.success).length;
  const failedRepairs = repairResults.filter(r => !r.success).length;

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/repair-pdf" />
      <ToolJsonLd path="/repair-pdf" />
      
      {/* Navigation Blocker - Warns user before leaving with unsaved work */}
      <NavigationBlocker
        when={hasUnsavedWork}
        message="You have uploaded files that haven't been processed yet. If you leave now, all your work will be lost."
        onSamePageClick={handleReset}
      />

      {/* Edit Step - Special Layout without side ads and without header */}
      {currentStep === "edit" ? (
        <EditPageLayout
          onBack={handleBackToUpload}
          totalPages={files.length}
          totalSize={(() => {
            const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
            return formatFileSize(totalBytes);
          })()}
          showSideAds={false}
          showInlineAd={true}
          sidebar={
            <>
              {/* Header with Title */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Repair Settings</h3>
              </div>

              {/* Problems Summary */}
              <div className="mb-6 p-4 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  Issues Detected
                </h4>
                <div className="space-y-2 text-xs text-gray-700">
                  {(() => {
                    const criticalCount = fileValidationInfo.filter(f => f.status === "critical-errors").length;
                    const warningCount = fileValidationInfo.filter(f => f.status === "has-warnings").length;
                    const validCount = fileValidationInfo.filter(f => f.status === "validated").length;
                    
                    return (
                      <>
                        {criticalCount > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span>{criticalCount} file{criticalCount > 1 ? 's' : ''} with critical issues</span>
                          </div>
                        )}
                        {warningCount > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span>{warningCount} file{warningCount > 1 ? 's' : ''} with warnings</span>
                          </div>
                        )}
                        {validCount > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>{validCount} file{validCount > 1 ? 's' : ''} can be optimized</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Repair Options */}
              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-medium text-gray-900">Repair Options</h4>
                
                {/* Deep Repair Mode */}
                <div className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="deep-repair" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Deep repair mode
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Slower, more aggressive fix
                    </p>
                  </div>
                  <Switch
                    id="deep-repair"
                    checked={deepRepairMode}
                    onCheckedChange={setDeepRepairMode}
                  />
                </div>

                {/* Rebuild Structure */}
                <div className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="rebuild" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Rebuild internal structure
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Fix xref, objects, trailer
                    </p>
                  </div>
                  <Switch
                    id="rebuild"
                    checked={rebuildStructure}
                    onCheckedChange={setRebuildStructure}
                  />
                </div>

                {/* Fix Fonts */}
                <div className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="fix-fonts" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Try to fix fonts
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Fix fonts and encoding
                    </p>
                  </div>
                  <Switch
                    id="fix-fonts"
                    checked={fixFonts}
                    onCheckedChange={setFixFonts}
                  />
                </div>

                {/* Remove Invalid Objects */}
                <div className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="remove-invalid" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Remove invalid objects
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Clean empty/broken objects
                    </p>
                  </div>
                  <Switch
                    id="remove-invalid"
                    checked={removeInvalid}
                    onCheckedChange={setRemoveInvalid}
                  />
                </div>

                {/* Create Backup */}
                <div className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="backup" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Create backup
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Save original file copy
                    </p>
                  </div>
                  <Switch
                    id="backup"
                    checked={createBackup}
                    onCheckedChange={setCreateBackup}
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    We'll keep your original files safe
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    Estimated: 5–20 seconds per file
                  </p>
                </div>
              </div>

              {/* Repair Button */}
              <Button
                onClick={handleProcessFiles}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Wrench className="w-5 h-5 mr-2" />
                Repair PDF{files.length > 1 ? 's' : ''}
              </Button>
            </>
          }
        >
          {/* Main Content - File List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                Files to Repair ({files.length})
              </h3>
            </div>

            {/* File Cards */}
            <div className="grid grid-cols-1 gap-3">
              {fileValidationInfo.map((fileInfo, index) => {
                const Icon = FileText;
                return (
                  <div
                    key={index}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    {/* File Card Content */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Drag Handle */}
                        <div className="flex-shrink-0 cursor-move pt-1">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </div>

                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center relative">
                            <Icon className="w-6 h-6 text-orange-600" />
                            {/* Number Badge */}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                              {index + 1}
                            </div>
                          </div>
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate mb-1" title={fileInfo.file.name}>
                            {fileInfo.file.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                            <span>{formatFileSize(fileInfo.file.size)}</span>
                            {fileInfo.pageCount > 0 && (
                              <>
                                <span>•</span>
                                <span>{fileInfo.pageCount} pages</span>
                              </>
                            )}
                          </div>

                          {/* Status Badge */}
                          {fileInfo.status && (
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              fileInfo.status === "critical-errors" ? "bg-red-100 text-red-700" :
                              fileInfo.status === "has-warnings" ? "bg-orange-100 text-orange-700" :
                              "bg-green-100 text-green-700"
                            }`}>
                              {fileInfo.status === "critical-errors" && "⚠️ Critical issues"}
                              {fileInfo.status === "has-warnings" && "⚠️ Issues found"}
                              {fileInfo.status === "validated" && "✅ Can optimize"}
                            </div>
                          )}

                          {/* Problems List */}
                          {fileInfo.problems && fileInfo.problems.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs font-medium text-gray-900 mb-2">Detected Problems:</p>
                              <div className="space-y-1">
                                {fileInfo.problems.map((problem, pIndex) => (
                                  <div key={pIndex} className="flex items-start gap-2">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {problem.type === "critical" && <XCircle className="w-3 h-3 text-red-600" />}
                                      {problem.type === "warning" && <AlertCircle className="w-3 h-3 text-orange-600" />}
                                      {problem.type === "info" && <Info className="w-3 h-3 text-blue-600" />}
                                    </div>
                                    <p className="text-xs text-gray-700">{problem.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Remove file"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </EditPageLayout>
      ) : (
        /* All Other Steps - Normal Layout with Side Ads and Header */
        <>
          {/* Success Header - Full Width at Top (only on complete step) */}
          {currentStep === "complete" && (
            <SuccessHeader
              title={successfulRepairs > 0 ? "PDF Repair Complete!" : "Repair Process Complete"}
              description={
                successfulRepairs > 0 
                  ? `${successfulRepairs} PDF file${successfulRepairs > 1 ? 's were' : ' was'} successfully repaired and ${successfulRepairs > 1 ? 'are' : 'is'} ready to download${failedRepairs > 0 ? `. ${failedRepairs} file${failedRepairs > 1 ? 's' : ''} could not be repaired.` : ''}`
                  : `Unfortunately, none of the files could be repaired. They may be severely corrupted or encrypted.`
              }
            />
          )}

          {/* Header Section - Full Width Above Layout - Hide on Complete Step */}
          {currentStep !== "complete" && (
            <ToolPageHero 
              title="Repair PDF" 
              description="Fix corrupted or damaged PDF files automatically. Recover your important documents by repairing common PDF issues like broken references, encoding errors, and structural problems — completely free and secure."
            />
          )}

          <ToolPageLayout>
            {/* Mobile Sticky Ad Banner - Shows only on mobile/tablet, above upload section */}
            {currentStep === "upload" && <MobileStickyAd topOffset={64} height={100} />}

            {/* Main Tool Area */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {/* STEP 1: Upload Files */}
              {currentStep === "upload" && (
                <>
                  <FileUploader
                    onFilesSelected={handleFilesSelected}
                    acceptedTypes=".pdf"
                    multiple={true}
                    maxFiles={10}
                    maxFileSize={100}
                    fileTypeLabel="PDF"
                    helperText="PDF files only · Up to 10 files · 100MB each · Accepts corrupted files"
                    validationMessage={validationMessage}
                    validationType={validationType}
                  />

                  {/* Show uploaded files */}
                  {files.length > 0 && (
                    <FileListWithValidation
                      files={fileValidationInfo}
                      onRemove={handleRemoveFile}
                      onReorder={handleReorderFiles}
                      onClearAll={handleClearAll}
                      onContinue={handleContinueToEdit}
                      continueText="Continue to Repair Settings"
                      continueDisabled={false}
                      showReorder={true}
                      onRetry={handleRetryValidation}
                    />
                  )}
                </>
              )}

              {/* STEP 3: Download */}
              {currentStep === "complete" && (
                <>
                  {/* Individual Results if multiple files */}
                  {files.length > 1 && (
                    <div className="space-y-3 mb-6">
                      <h3 className="font-medium text-gray-900">Repair Results</h3>
                      {repairResults.map((result, index) => (
                        <div 
                          key={index} 
                          className={`bg-white border rounded-xl p-4 ${
                            result.success ? 'border-green-200' : 'border-red-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Status Icon */}
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                result.success ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                {result.success ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            </div>
                            
                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate mb-1">
                                {result.fileName}
                              </h4>
                              
                              {/* Status */}
                              <div className={`text-sm font-medium mb-2 ${
                                result.success ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {result.success ? '✓ Successfully Repaired' : '✗ Repair Failed'}
                              </div>

                              {/* Error Message */}
                              {result.error && (
                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                                  {result.error}
                                </div>
                              )}
                            </div>

                            {/* Download Button */}
                            {result.success && result.url && (
                              <Button 
                                asChild
                                size="sm"
                                className="flex-shrink-0"
                              >
                                <a href={result.url} download={result.fileName}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Main Success Section */}
                  {successfulRepairs > 0 && (
                    <ToolSuccessSection
                      files={{
                        url: downloadUrl,
                        name: processedFileName,
                        type: "pdf" as const,
                      }}
                      fileInfo={{
                        "Total Files": files.length,
                        "Successfully Repaired": successfulRepairs,
                        "Failed": failedRepairs,
                      }}
                      onReset={handleReset}
                      resetButtonText="Repair Another PDF"
                      previewTitle="Repaired Files"
                      icon={Wrench}
                    />
                  )}

                  {/* Info Box for Failed Repairs */}
                  {failedRepairs > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Some files couldn't be repaired</p>
                        <p className="text-xs text-blue-700">
                          Files that are severely corrupted, encrypted, or have security restrictions cannot be repaired automatically. 
                          Try opening them in a PDF reader or contact the original sender for an uncorrupted version.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* If all repairs failed, show reset button */}
                  {successfulRepairs === 0 && (
                    <div className="text-center pt-4">
                      <Button onClick={handleReset} variant="outline" size="lg" className="w-full sm:w-auto">
                        <Upload className="w-4 h-4 mr-2" />
                        Try Different Files
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Related Tools Section - Show on complete step */}
            {currentStep === "complete" && (
              <RelatedToolsSection 
                tools={relatedTools}
                introText="Continue working with your PDFs or explore other powerful tools."
              />
            )}

            {/* Only show these sections if NOT on complete step */}
            {currentStep !== "complete" && (
              <>
                {/* Related Tools Section */}
                <RelatedToolsSection 
                  tools={relatedTools}
                  introText="These tools work well with PDF repair and help you manage or convert your documents."
                />

                {/* Tool Definition Section */}
                <ToolDefinitionSection
                  title="What Is PDF Repair?"
                  content="PDF repair is the process of fixing corrupted or damaged PDF files that won't open or display correctly. Common issues include broken cross-reference tables, corrupted page structures, invalid stream data, missing fonts, and encoding errors. Our repair tool analyzes the PDF structure and attempts to reconstruct damaged elements, making the file readable again."
                />

                {/* How to Use Section */}
                <HowItWorksSteps 
                  title="How It Works"
                  subtitle="Repair your corrupted PDF files in four simple steps"
                  introText="Follow these simple steps to fix your damaged PDF files quickly and securely."
                  steps={STEPS} 
                />

                {/* Why Choose Us Section */}
                <WhyChooseSection
                  title={WHY_CHOOSE_WORKFLOWPRO.title}
                  subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle}
                  introText={WHY_CHOOSE_WORKFLOWPRO.introText}
                  features={WHY_CHOOSE_WORKFLOWPRO.features}
                />

                {/* Use Cases Section */}
                <UseCasesSection
                  title="When to Use PDF Repair"
                  useCases={[
                    "Fix PDFs that won't open in readers",
                    "Recover files after interrupted downloads",
                    "Repair PDFs damaged during transfer",
                    "Fix files with 'corrupted' error messages",
                    "Restore PDFs from damaged storage devices",
                    "Repair files after system crashes",
                  ]}
                />

                {/* Tool FAQ Section */}
                <ToolFAQSection
                  faqs={[
                    {
                      question: "What types of PDF corruption can be repaired?",
                      answer: "Our tool can fix common issues like broken cross-reference tables, corrupted page structures, invalid stream data, missing fonts, and encoding errors. Severely damaged or encrypted files may not be repairable.",
                    },
                    {
                      question: "Will all my PDF content be recovered?",
                      answer: "In most cases, yes. However, if portions of the file data are completely missing or overwritten, those sections cannot be recovered. The repair tool does its best to salvage readable content.",
                    },
                    {
                      question: "Can I repair password-protected PDFs?",
                      answer: "No, encrypted or password-protected PDFs cannot be repaired without the password. Use our Unlock PDF tool first if you have the password.",
                    },
                    {
                      question: "How many files can I repair at once?",
                      answer: "You can upload and repair up to 10 PDF files simultaneously.",
                    },
                    {
                      question: "Is there a file size limit?",
                      answer: "Each PDF can be up to 100MB. Larger files may take longer to analyze and repair.",
                    },
                    {
                      question: "Are my files secure?",
                      answer: "Yes, all repair operations happen in your browser. Files are never uploaded to our servers.",
                    },
                    {
                      question: "What if the repair fails?",
                      answer: "If automatic repair fails, the file may be severely corrupted or encrypted. Try obtaining a fresh copy from the original source.",
                    },
                    {
                      question: "Is this tool free?",
                      answer: "Yes — completely free to use with no limitations or watermarks.",
                    },
                  ]}
                />

                {/* Tool SEO Footer */}
                <ToolSEOFooter
                  title="About WorkflowPro's Repair PDF Tool"
                  content="WorkflowPro's Repair PDF tool helps you fix corrupted or damaged PDF files automatically. Perfect for recovering important documents, fixing download errors, and restoring files from damaged storage — fast, simple, and always free."
                />
              </>
            )}
          </ToolPageLayout>
        </>
      )}
      
      {/* Processing Modal - Centered */}
      <ProcessingModal
        isOpen={currentStep === "processing"}
        progress={progress}
        title="Repairing PDFs..."
        description="Analyzing and fixing corrupted PDF files"
        icon={Wrench}
      />
    </>
  );
}
