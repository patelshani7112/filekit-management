/**
 * Unlock PDF Page
 * 
 * Purpose: Remove password protection from PDF files
 * Structure: Matches RotatePdfPage.tsx exactly, using same components and layout
 */

import { useState, useEffect, useRef } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import {
  ToolPageLayout,
  ToolPageHero,
  FileUploader,
  FileListWithValidation,
  ToolSuccessSection,
  SuccessHeader,
  RelatedToolsSection,
  HowItWorksSteps,
  WhyChooseSection,
  ToolFAQSection,
  ToolDefinitionSection,
  UseCasesSection,
  ToolSEOFooter,
  MobileStickyAd,
  EditPageLayout,
  NavigationBlocker,
  ProcessingModal,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
import { getPdfInfo } from "../../../utils/pdfUtils";
import { simulateRealisticProgress } from "../../../utils/uploadProgress";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Button } from "../../../components/ui/button";
import { GradientButton } from "../../../components/ui/gradient-button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { 
  FileText, 
  LockOpen,
  Lock,
  GripVertical,
  X,
  FilePlus,
  Archive,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Key,
  ArrowLeft
} from "lucide-react";

// Import all content from centralized content file
import {
  HERO_CONTENT,
  FEATURES,
  WHY_CHOOSE_CONTENT,
  HOW_IT_WORKS_STEPS,
  RELATED_TOOLS,
  USE_CASES,
  USE_CASES_TITLE,
  UPLOAD_CONFIG,
  VALIDATION_MESSAGES,
  UI_LABELS,
  SEO_CONTENT,
  NAVIGATION_BLOCKER_MESSAGE,
  FAQ_ITEMS,
} from "../../../content/tools/pdf-tools/organize-manage-pdf/unlock-pdf-content";

// Processing steps
type ProcessStep = "upload" | "edit" | "processing" | "complete";

interface UnlockPdfPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

interface PdfFileWithPassword {
  fileIndex: number;
  fileName: string;
  password: string;
  isUnlocked: boolean;
  showPassword: boolean;
}

export default function UnlockPdfPage({ onWorkStateChange }: UnlockPdfPageProps = {}) {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [fileValidationInfo, setFileValidationInfo] = useState<FileValidationInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<ProcessStep>("upload");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [processedFileName, setProcessedFileName] = useState("");
  const [filePasswords, setFilePasswords] = useState<PdfFileWithPassword[]>([]);
  
  // Validation state
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"warning" | "error" | "info">("warning");
  
  // Settings state
  const [masterPassword, setMasterPassword] = useState("");
  const [applyToAll, setApplyToAll] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  
  // Collapsible state for Source Files section
  const [isSourceFilesOpen, setIsSourceFilesOpen] = useState(false);
  
  // Refs
  const fileListRef = useRef<HTMLDivElement>(null);
  
  // Convert RELATED_TOOLS from content file to component format with onClick handlers
  const relatedTools = RELATED_TOOLS.map(tool => ({
    ...tool,
    onClick: () => window.location.href = tool.href,
  }));

  // Notify parent component about work state changes
  useEffect(() => {
    const hasWork = (files.length > 0 || filePasswords.length > 0) && currentStep !== "complete";
    onWorkStateChange?.(hasWork);
  }, [files.length, filePasswords.length, currentStep, onWorkStateChange]);

  // Handle file selection with PDF validation
  const handleFilesSelected = async (newFiles: File[]) => {
    const { maxFiles, maxFileSize } = UPLOAD_CONFIG;
    
    // Clear previous validation messages
    setValidationMessage("");
    
    // For single file mode, replace existing file
    if (!UPLOAD_CONFIG.allowMultiple && files.length > 0) {
      // Clear existing files first
      setFiles([]);
      setFileValidationInfo([]);
      setFilePasswords([]);
    }
    
    // Only take the first file in single-file mode
    const filesToProcess = UPLOAD_CONFIG.allowMultiple ? newFiles : [newFiles[0]];
    
    // Validate file types (PDF only)
    const invalidFiles = filesToProcess.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return ext !== '.pdf';
    });
    
    if (invalidFiles.length > 0) {
      setValidationMessage(VALIDATION_MESSAGES.invalidFileType);
      setValidationType("error");
      return;
    }
    
    // Validate file sizes
    const oversizedFiles = filesToProcess.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setValidationMessage(VALIDATION_MESSAGES.fileTooLarge);
      setValidationType("error");
      return;
    }
    
    // Add files to state
    setFiles(filesToProcess);

    // Create validation info for each file (initially validating)
    const newValidationInfo: FileValidationInfo[] = filesToProcess.map(file => ({
      file,
      isValidating: true,
      isValid: false,
      pageCount: 0,
      uploadProgress: 0,
    }));
    
    setFileValidationInfo(newValidationInfo);

    // Create password entries for each file
    const newPasswordEntries: PdfFileWithPassword[] = filesToProcess.map((file, index) => ({
      fileIndex: index,
      fileName: file.name,
      password: "",
      isUnlocked: false,
      showPassword: false,
    }));
    
    setFilePasswords(newPasswordEntries);

    // Validate each PDF file with progress animation
    filesToProcess.forEach(async (file, index) => {
      const fileIndex = index;
      
      const minAnimationDuration = 1200;
      
      // Start progress animation
      const cancelProgress = simulateRealisticProgress(minAnimationDuration, (progress) => {
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          if (updated[fileIndex]) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              uploadProgress: progress,
            };
          }
          return updated;
        });
      });
      
      try {
        // Get PDF info
        const pdfInfo = await getPdfInfo(file);
        
        // Wait for minimum animation duration
        const elapsed = Date.now();
        const remaining = minAnimationDuration - elapsed;
        if (remaining > 0) {
          await new Promise(resolve => setTimeout(resolve, remaining));
        }
      
        // Cancel progress
        cancelProgress();
      
        // Update validation info
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: pdfInfo.isValid,
            pageCount: pdfInfo.pageCount,
            error: pdfInfo.error,
            uploadProgress: 100,
          };
          return updated;
        });
      } catch (error) {
        // Cancel progress
        cancelProgress();
        
        // Handle unexpected errors
        setFileValidationInfo((prev) => {
          const updated = [...prev];
          updated[fileIndex] = {
            file,
            isValidating: false,
            isValid: false,
            pageCount: 0,
            error: "Invalid PDF file",
          };
          return updated;
        });
      }
    });
  };

  // Remove file
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileValidationInfo((prev) => prev.filter((_, i) => i !== index));
    setFilePasswords((prev) => prev.filter((_, i) => i !== index).map((p, i) => ({
      ...p,
      fileIndex: i,
    })));
  };

  // Retry validation for a specific file
  const handleRetryValidation = async (index: number) => {
    const file = files[index];
    
    setFileValidationInfo((prev) => {
      const updated = [...prev];
      updated[index] = {
        file,
        isValidating: true,
        isValid: false,
        pageCount: 0,
        uploadProgress: 0,
      };
      return updated;
    });

    const minAnimationDuration = 1200;
    
    const cancelProgress = simulateRealisticProgress(minAnimationDuration, (progress) => {
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            uploadProgress: progress,
          };
        }
        return updated;
      });
    });
    
    try {
      const pdfInfo = await getPdfInfo(file);
      
      const elapsed = Date.now();
      const remaining = minAnimationDuration - elapsed;
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
    
      cancelProgress();
    
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: pdfInfo.isValid,
          pageCount: pdfInfo.pageCount,
          error: pdfInfo.error,
          uploadProgress: 100,
        };
        return updated;
      });
    } catch (error) {
      cancelProgress();
      
      setFileValidationInfo((prev) => {
        const updated = [...prev];
        updated[index] = {
          file,
          isValidating: false,
          isValid: false,
          pageCount: 0,
          error: "Invalid PDF file",
        };
        return updated;
      });
    }
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
    setFileValidationInfo([]);
    setFilePasswords([]);
    setValidationMessage("");
  };

  // Proceed to edit mode
  const handleContinueToEdit = () => {
    // Ensure we only have valid files
    const validFiles = fileValidationInfo.filter(info => info.isValid);
    if (validFiles.length === 0) return;
    
    setCurrentStep("edit");
  };

  // Back to upload
  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  // Update password for a specific file
  const handlePasswordChange = (fileIndex: number, password: string) => {
    setFilePasswords((prev) =>
      prev.map((p) =>
        p.fileIndex === fileIndex ? { ...p, password } : p
      )
    );
  };

  // Toggle show password for a specific file
  const handleToggleShowPassword = (fileIndex: number) => {
    setFilePasswords((prev) =>
      prev.map((p) =>
        p.fileIndex === fileIndex ? { ...p, showPassword: !p.showPassword } : p
      )
    );
  };

  // Apply master password to all files
  const handleApplyMasterPassword = () => {
    if (!masterPassword.trim()) return;
    
    setFilePasswords((prev) =>
      prev.map((p) => ({ ...p, password: masterPassword }))
    );
  };

  // Process files (unlock PDFs)
  const handleProcessFiles = async () => {
    // Validate that all files have passwords
    const filesWithoutPassword = filePasswords.filter(p => !p.password.trim());
    if (filesWithoutPassword.length > 0) {
      alert(VALIDATION_MESSAGES.noPassword);
      return;
    }
    
    setCurrentStep("processing");
    
    // Simulate processing with progress
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 95) {
        currentProgress = 95;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 200);
    
    // Simulate unlock process
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    clearInterval(progressInterval);
    setProgress(100);
    
    // Mark all files as unlocked
    setFilePasswords((prev) =>
      prev.map((p) => ({ ...p, isUnlocked: true }))
    );
    
    // Simulate creating download
    const fileName = files.length === 1 
      ? files[0].name.replace('.pdf', '_unlocked.pdf')
      : `${files.length}_unlocked_pdfs.zip`;
    setProcessedFileName(fileName);
    setDownloadUrl("#");
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentStep("complete");
  };

  // Reset to start
  const handleReset = () => {
    setCurrentStep("upload");
    setFiles([]);
    setFileValidationInfo([]);
    setFilePasswords([]);
    setMasterPassword("");
    setApplyToAll(false);
    setProgress(0);
    setDownloadUrl("");
    setProcessedFileName("");
    setValidationMessage("");
  };

  // Calculate total file size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalSizeFormatted = totalSize < 1024 * 1024
    ? `${(totalSize / 1024).toFixed(1)} KB`
    : `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <>
      <SeoHead
        title="Unlock PDF - Remove Password Protection Online Free | WorkflowPro"
        description="Remove password protection from PDF files online for free. Upload your locked PDF, enter the password, and unlock it instantly – no signup required, 100% secure."
        canonical="/unlock-pdf"
      />
      <ToolJsonLd
        name="Unlock PDF"
        description={HERO_CONTENT.description}
        url="/unlock-pdf"
      />

      <NavigationBlocker
        when={files.length > 0 && currentStep === "edit"}
        message={NAVIGATION_BLOCKER_MESSAGE}
      />

      <ProcessingModal
        isOpen={currentStep === "processing"}
        progress={progress}
        title="Unlocking PDFs..."
        description="Removing password protection from your files"
        icon={LockOpen}
      />

      {currentStep === "edit" ? (
        <EditPageLayout
          onBack={handleBackToUpload}
          title="Unlock PDF File"
          subtitle="Enter password to unlock your PDF"
          showInlineAd={true}
          sidebar={
            <>
              {/* Header with Title and Replace Button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Enter Password</h3>
                
                {/* Replace File Button */}
                <input
                  type="file"
                  id="replaceFileUnlock"
                  accept=".pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const newFiles = Array.from(e.target.files || []);
                    if (newFiles.length > 0) {
                      await handleFilesSelected(newFiles);
                    }
                    e.target.value = '';
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-500 hover:text-white transition-colors"
                  onClick={() => document.getElementById('replaceFileUnlock')?.click()}
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  Replace File
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Enter the password to unlock this PDF file
              </p>
              
              <div className="space-y-6">
                {/* File Info Card */}
                <div className="p-4 border-2 border-purple-200 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {files[0]?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {totalSizeFormatted}
                        {fileValidationInfo[0]?.pageCount ? ` • ${fileValidationInfo[0].pageCount} pages` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <Label htmlFor="pdf-password" className="text-sm font-medium text-gray-700">
                      PDF Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="pdf-password"
                        type={filePasswords[0]?.showPassword ? "text" : "password"}
                        value={filePasswords[0]?.password || ""}
                        onChange={(e) => handlePasswordChange(0, e.target.value)}
                        placeholder="Enter PDF password"
                        className="pr-10 text-sm h-11 bg-white border-2 border-gray-300 focus:border-purple-400 focus:ring-purple-400"
                        disabled={filePasswords[0]?.isUnlocked}
                      />
                      <button
                        type="button"
                        onClick={() => handleToggleShowPassword(0)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                        disabled={filePasswords[0]?.isUnlocked}
                      >
                        {filePasswords[0]?.showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Enter the password that was used to protect this PDF
                    </p>
                  </div>

                  {/* Password Validation Feedback */}
                  {filePasswords[0]?.isUnlocked && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mt-4">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-700 font-medium">
                        Password verified successfully!
                      </p>
                    </div>
                  )}
                </div>

                {/* Unlock Button */}
                <GradientButton
                  onClick={handleProcessFiles}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!filePasswords[0]?.password?.trim() || filePasswords[0]?.isUnlocked}
                >
                  <LockOpen className="w-5 h-5 mr-2" />
                  Unlock PDF
                </GradientButton>

                {/* Download Button - Shows when unlocked */}
                {filePasswords[0]?.isUnlocked && (
                  <Button
                    onClick={() => setCurrentStep("complete")}
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50"
                  >
                    Continue to Download
                  </Button>
                )}

                {/* Help Section */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Key className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Need help?
                      </h4>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Make sure you enter the correct password that was used to protect this PDF. The password is case-sensitive.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        >
          {/* Main Content Area - PDF Preview */}
          <div className="flex items-center justify-center min-h-[400px] lg:min-h-[600px] p-4 sm:p-8">
            <div className="w-full max-w-xs sm:max-w-md flex flex-col items-center space-y-4 sm:space-y-6">
              {/* Lock Icon */}
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                {filePasswords[0]?.isUnlocked ? (
                  <LockOpen className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
                ) : (
                  <Lock className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600" />
                )}
              </div>

              {/* PDF Preview Card - Smaller on Mobile */}
              <div className="w-full max-w-[180px] sm:max-w-[320px] aspect-[1/1.4] bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl border-2 border-purple-200 flex items-center justify-center relative overflow-hidden shadow-lg">
                {/* PDF Icon Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <FileText className="w-24 h-24 sm:w-48 sm:h-48 text-purple-400" />
                </div>
                
                {/* File Info */}
                <div className="relative z-10 text-center p-3 sm:p-6">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 rounded-xl sm:rounded-2xl bg-white shadow-md flex items-center justify-center">
                    <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 break-words px-2 sm:px-4 text-xs sm:text-sm">
                    {files[0]?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {totalSizeFormatted}
                    {fileValidationInfo[0]?.pageCount ? ` • ${fileValidationInfo[0].pageCount} pages` : ''}
                  </p>
                </div>

                {/* Unlocked Badge Overlay */}
                {filePasswords[0]?.isUnlocked && (
                  <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-full shadow-lg">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">Unlocked</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="w-full max-w-[180px] sm:max-w-[320px] p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-sm">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <div className="flex items-center gap-2">
                    {filePasswords[0]?.isUnlocked ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-medium text-green-600">Unlocked</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="font-medium text-orange-600">Locked</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EditPageLayout>
      ) : (
        <>
          {/* Success Header */}
          {currentStep === "complete" && (
            <SuccessHeader
              title={UI_LABELS.successTitle}
              message="PDF unlocked successfully!"
            />
          )}
          
          {/* Hero - Only on upload step */}
          {currentStep !== "complete" && (
            <ToolPageHero
              title={HERO_CONTENT.title}
              description={HERO_CONTENT.description}
            />
          )}

          {/* Main Tool Page Layout */}
          <ToolPageLayout>
            {/* Mobile Sticky Ad */}
            {currentStep === "upload" && <MobileStickyAd topOffset={64} height={100} />}
            
            {/* Main Tool Card */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {/* Upload Step */}
              {currentStep === "upload" && (
                <>
                  <FileUploader 
                    onFilesSelected={handleFilesSelected} 
                    acceptedTypes={UPLOAD_CONFIG.acceptedTypes.join(',')} 
                    multiple={UPLOAD_CONFIG.allowMultiple} 
                    maxFiles={UPLOAD_CONFIG.maxFiles} 
                    maxFileSize={UPLOAD_CONFIG.maxFileSize * 1024 * 1024} 
                    fileTypeLabel={UPLOAD_CONFIG.fileTypeLabel} 
                    helperText={UPLOAD_CONFIG.helperText} 
                    validationMessage={validationMessage} 
                    validationType={validationType} 
                  />
                  {files.length > 0 && (
                    <FileListWithValidation
                      files={fileValidationInfo}
                      onRemove={handleRemoveFile}
                      onContinue={handleContinueToEdit}
                      continueText={UI_LABELS.continueToUnlock}
                      showReorder={false}
                      onClearAll={handleClearAll}
                      onRetry={handleRetryValidation}
                    />
                  )}
                </>
              )}

              {/* Complete Step */}
              {currentStep === "complete" && (
                <ToolSuccessSection
                  files={{
                    name: processedFileName,
                    url: downloadUrl,
                    type: "pdf"
                  }}
                  fileInfo={{
                    'Files Unlocked': files.length.toString(),
                    'Total Size': totalSizeFormatted,
                  }}
                  onReset={handleReset}
                  resetButtonText={UI_LABELS.unlockAnother}
                  icon={LockOpen}
                />
              )}
            </div>

            {/* Related Tools Section */}
            {currentStep === "complete" && (
              <RelatedToolsSection
                title="Try More PDF Tools"
                tools={relatedTools}
              />
            )}

            {/* Show these sections if NOT on complete step */}
            {currentStep !== "complete" && (
              <>
                {/* Related Tools Section */}
                <RelatedToolsSection
                  title="Related PDF Tools"
                  tools={relatedTools}
                  introText="These tools work well with PDF unlocking and help you manage your documents."
                />

                {/* Tool Definition Section */}
                <ToolDefinitionSection
                  title={SEO_CONTENT.definition.title}
                  content={SEO_CONTENT.definition.content}
                />

                {/* How to Use Section */}
                <HowItWorksSteps
                  title={SEO_CONTENT.howItWorks.title}
                  subtitle={SEO_CONTENT.howItWorks.subtitle}
                  introText={SEO_CONTENT.howItWorks.introText}
                  steps={HOW_IT_WORKS_STEPS}
                />

                {/* Why Choose Section */}
                <WhyChooseSection
                  title={WHY_CHOOSE_WORKFLOWPRO.title}
                  subtitle="The most powerful and user-friendly PDF unlocker available online"
                  introText="WorkflowPro delivers fast, private, and watermark-free PDF unlocking trusted by professionals, students, and businesses. No signup required."
                  features={WHY_CHOOSE_WORKFLOWPRO.features}
                />

                {/* Use Cases Section */}
                <UseCasesSection
                  useCases={USE_CASES}
                  title={USE_CASES_TITLE}
                />

                {/* FAQ Section */}
                <ToolFAQSection faqs={FAQ_ITEMS} />

                {/* SEO Footer */}
                <ToolSEOFooter
                  title={SEO_CONTENT.footer.title}
                  content={SEO_CONTENT.footer.content}
                />
              </>
            )}
          </ToolPageLayout>
        </>
      )}
    </>
  );
}