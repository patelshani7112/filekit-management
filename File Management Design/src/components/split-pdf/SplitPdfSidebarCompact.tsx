/**
 * Split PDF Sidebar - Simplified 3-Mode Design
 * 
 * Structure:
 * - 3 main modes: By Pages, By Count, Advanced
 * - All other options organized as sub-options within each mode
 * - Clean, simple, easy to use
 */

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { 
  Scissors, 
  Grid3x3, 
  Slice, 
  Hash,
  Settings,
  ChevronDown,
  ChevronUp,
  SplitSquareHorizontal,
  Hand,
  HardDrive,
  FileStack,
  Files,
  Square,
  FileText,
  Edit2,
  Plus,
  X,
  GripVertical,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

interface SplitPdfSidebarCompactProps {
  splitMode:
    | "range" 
    | "every" 
    | "equal" 
    | "specific" 
    | "extract"
    | "oddEven"
    | "fileSize"
    | "pageLimit"
    | "onePerFile";
  setSplitMode: (mode: any) => void;
  
  pageRangeInput: string;
  setPageRangeInput: (val: string) => void;
  pagesPerSplit: number | string;
  setPagesPerSplit: (val: number | string) => void;
  numberOfParts: number | string;
  setNumberOfParts: (val: number | string) => void;
  specificPages: string;
  setSpecificPages: (val: string) => void;
  selectedPages: number[];
  setSelectedPages: (val: number[]) => void;
  
  oddEvenMode: "odd" | "even" | "both";
  setOddEvenMode: (mode: "odd" | "even" | "both") => void;
  maxFileSize: number | string;
  setMaxFileSize: (val: number | string) => void;
  maxPagesPerFile: number | string;
  setMaxPagesPerFile: (val: number | string) => void;
  
  filenamePattern: string;
  setFilenamePattern: (val: string) => void;
  combineAfterSplit: boolean;
  setCombineAfterSplit: (val: boolean) => void;
  outputFormat: "pdf" | "zip";
  setOutputFormat: (format: "pdf" | "zip") => void;
  
  pdfPages: Array<{pageNumber: number, fileName: string, selected: boolean, outputFile: number}>;
  setPdfPages: (pages: any) => void;
  
  handleSplit: () => void;
  isProcessing: boolean;
  
  // Output files with editable names
  outputFiles?: Array<{id: number, name: string, pages: string}>;
  setOutputFiles?: (files: Array<{id: number, name: string, pages: string}>) => void;
  
  // File management
  uploadedFiles?: Array<{name: string, size: number}>;
  onAddFiles?: () => void;
  onRemoveFile?: (index: number) => void;
  onReorderFiles?: (files: Array<{name: string, size: number}>) => void;
  
  // Combine files first option
  combineFilesFirst?: boolean;
  setCombineFilesFirst?: (val: boolean) => void;
}

export function SplitPdfSidebarCompact(props: SplitPdfSidebarCompactProps) {
  const {
    splitMode,
    setSplitMode,
    pageRangeInput,
    setPageRangeInput,
    pagesPerSplit,
    setPagesPerSplit,
    numberOfParts,
    setNumberOfParts,
    specificPages,
    setSpecificPages,
    selectedPages,
    setSelectedPages,
    oddEvenMode,
    setOddEvenMode,
    maxFileSize,
    setMaxFileSize,
    maxPagesPerFile,
    setMaxPagesPerFile,
    filenamePattern,
    setFilenamePattern,
    combineAfterSplit,
    setCombineAfterSplit,
    outputFormat,
    setOutputFormat,
    pdfPages,
    setPdfPages,
    handleSplit,
    isProcessing,
    outputFiles,
    setOutputFiles,
    uploadedFiles,
    onAddFiles,
    onRemoveFile,
    onReorderFiles,
    combineFilesFirst,
    setCombineFilesFirst,
  } = props;

  // Determine which main category is active
  const getMainCategory = () => {
    if (["range", "specific", "oddEven"].includes(splitMode)) return "byPages";
    if (["every", "equal"].includes(splitMode)) return "byCount";
    return "advanced";
  };

  const [mainCategory, setMainCategory] = useState(getMainCategory());
  const [showOutput, setShowOutput] = useState(false);
  const [showUploadedFiles, setShowUploadedFiles] = useState(false); // Default: closed
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [validationError, setValidationError] = useState("");

  // Calculate total output files based on split mode and settings
  const calculateTotalOutputFiles = () => {
    const totalPages = pdfPages.length;
    
    if (totalPages === 0) return 0;
    
    switch (splitMode) {
      case "all":
        return totalPages; // Each page = 1 file
      
      case "every":
        if (typeof pagesPerSplit === 'number' && pagesPerSplit > 0) {
          return Math.ceil(totalPages / pagesPerSplit);
        }
        return 0;
      
      case "equal":
        if (typeof numberOfParts === 'number' && numberOfParts > 0) {
          return numberOfParts;
        }
        return 0;
      
      case "extract":
        const selectedCount = pdfPages.filter(p => p.selected).length;
        return selectedCount > 0 ? 1 : 0;
      
      case "range":
        // Count valid ranges in pageRangeInput
        if (!pageRangeInput.trim()) return 0;
        const ranges = pageRangeInput.split(',').filter(r => r.trim());
        return ranges.length;
      
      case "specific":
        // Count specific pages
        if (!specificPages.trim()) return 0;
        const pages = specificPages.split(',').filter(p => p.trim());
        return pages.length;
      
      default:
        return 0;
    }
  };

  const totalOutputFiles = calculateTotalOutputFiles();

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || !uploadedFiles || !onReorderFiles) return;
    
    const newFiles = [...uploadedFiles];
    const draggedFile = newFiles[draggedIndex];
    
    // Remove from old position
    newFiles.splice(draggedIndex, 1);
    // Insert at new position
    newFiles.splice(dropIndex, 0, draggedFile);
    
    onReorderFiles(newFiles);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle main category change
  const handleCategoryChange = (category: string) => {
    setMainCategory(category);
    setValidationError(""); // Clear validation error when changing category
    // Set default mode for each category
    if (category === "byPages") setSplitMode("range");
    else if (category === "byCount") setSplitMode("every");
    else setSplitMode("extract");
  };

  // Validation function
  const validateInput = (): boolean => {
    setValidationError("");
    
    switch (splitMode) {
      case "range":
        if (!pageRangeInput || pageRangeInput.trim() === "") {
          setValidationError("Please enter page ranges (e.g., 1-5, 6-10)");
          return false;
        }
        break;
      case "specific":
        if (!specificPages || specificPages.trim() === "") {
          setValidationError("Please enter specific page numbers (e.g., 1, 3, 5)");
          return false;
        }
        break;
      case "every":
        if (!pagesPerSplit || pagesPerSplit === "" || typeof pagesPerSplit !== "number") {
          setValidationError("Please enter number of pages per file");
          return false;
        }
        break;
      case "equal":
        if (!numberOfParts || numberOfParts === "" || typeof numberOfParts !== "number") {
          setValidationError("Please enter number of files to create");
          return false;
        }
        break;
      case "extract":
        if (selectedPages.length === 0) {
          setValidationError("Please select at least one page to extract");
          return false;
        }
        break;
      case "fileSize":
        if (!maxFileSize || maxFileSize === "" || typeof maxFileSize !== "number") {
          setValidationError("Please enter maximum file size in MB");
          return false;
        }
        break;
      case "pageLimit":
        if (!maxPagesPerFile || maxPagesPerFile === "" || typeof maxPagesPerFile !== "number") {
          setValidationError("Please enter maximum pages per file");
          return false;
        }
        break;
    }
    
    return true;
  };

  // Wrapped handleSplit with validation
  const handleSplitClick = () => {
    if (validateInput()) {
      handleSplit();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Split Settings</h3>
      </div>

      {/* 3 Main Categories - MOVED TO TOP */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Split Mode</h4>
        <div className="grid grid-cols-3 gap-2">
          {/* By Pages */}
          <button
            onClick={() => handleCategoryChange("byPages")}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
              mainCategory === "byPages"
                ? "border-purple-500 bg-purple-50 shadow-md"
                : "border-gray-200 hover:border-purple-300 bg-white"
            }`}
          >
            <Grid3x3 className={`w-6 h-6 mb-1 ${mainCategory === "byPages" ? "text-purple-600" : "text-gray-400"}`} />
            <span className={`text-xs font-medium ${mainCategory === "byPages" ? "text-purple-900" : "text-gray-600"}`}>
              By Pages
            </span>
            {mainCategory === "byPages" && (
              <div className="w-1 h-1 bg-purple-500 rounded-full mt-1"></div>
            )}
          </button>

          {/* By Count */}
          <button
            onClick={() => handleCategoryChange("byCount")}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
              mainCategory === "byCount"
                ? "border-purple-500 bg-purple-50 shadow-md"
                : "border-gray-200 hover:border-purple-300 bg-white"
            }`}
          >
            <Hash className={`w-6 h-6 mb-1 ${mainCategory === "byCount" ? "text-purple-600" : "text-gray-400"}`} />
            <span className={`text-xs font-medium ${mainCategory === "byCount" ? "text-purple-900" : "text-gray-600"}`}>
              By Count
            </span>
            {mainCategory === "byCount" && (
              <div className="w-1 h-1 bg-purple-500 rounded-full mt-1"></div>
            )}
          </button>

          {/* Advanced */}
          <button
            onClick={() => handleCategoryChange("advanced")}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
              mainCategory === "advanced"
                ? "border-purple-500 bg-purple-50 shadow-md"
                : "border-gray-200 hover:border-purple-300 bg-white"
            }`}
          >
            <Settings className={`w-6 h-6 mb-1 ${mainCategory === "advanced" ? "text-purple-600" : "text-gray-400"}`} />
            <span className={`text-xs font-medium ${mainCategory === "advanced" ? "text-purple-900" : "text-gray-600"}`}>
              Advanced
            </span>
            {mainCategory === "advanced" && (
              <div className="w-1 h-1 bg-purple-500 rounded-full mt-1"></div>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Options based on selected category */}
      {mainCategory === "byPages" && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-600 mb-2">Method</h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSplitMode("range")}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                splitMode === "range"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Range
            </button>
            <button
              onClick={() => setSplitMode("specific")}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                splitMode === "specific"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Specific
            </button>
            <button
              onClick={() => setSplitMode("oddEven")}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                splitMode === "oddEven"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Odd/Even
            </button>
          </div>
        </div>
      )}

      {mainCategory === "byCount" && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-600 mb-2">Method</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSplitMode("every")}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                splitMode === "every"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Every N Pages
            </button>
            <button
              onClick={() => setSplitMode("equal")}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                splitMode === "equal"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Equal Parts
            </button>
          </div>
        </div>
      )}

      {mainCategory === "advanced" && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-600 mb-2">Method</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSplitMode("extract")}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                splitMode === "extract"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Hand className="w-3 h-3" />
              Extract
            </button>
            <button
              onClick={() => setSplitMode("fileSize")}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                splitMode === "fileSize"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <HardDrive className="w-3 h-3" />
              By Size
            </button>
            <button
              onClick={() => setSplitMode("pageLimit")}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                splitMode === "pageLimit"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FileStack className="w-3 h-3" />
              Page Limit
            </button>
            <button
              onClick={() => setSplitMode("onePerFile")}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                splitMode === "onePerFile"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Files className="w-3 h-3" />
              One Per File
            </button>
          </div>
        </div>
      )}

      {/* Total Output Files Counter - NEW! */}
      {totalOutputFiles > 0 && (
        <div className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Total Output Files</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="text-2xl font-bold text-purple-600">{totalOutputFiles}</div>
              <span className="text-xs text-gray-600">file{totalOutputFiles !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Section - Only show when there's actual configuration to display */}
      {(splitMode === "range" || splitMode === "specific" || splitMode === "oddEven" || 
        splitMode === "every" || splitMode === "equal" || splitMode === "extract" || 
        splitMode === "fileSize" || splitMode === "pageLimit") && (
        <>
          {/* Only show heading and container when there's actual input fields */}
          {(splitMode !== "onePerFile") && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-600 mb-2">Configuration</h4>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                {/* Range mode */}
                {splitMode === "range" && (
                  <div className="space-y-2">
                    <Label htmlFor="pageRangeInput" className="text-xs text-gray-600">
                      Page ranges (e.g., 1-5, 6-10)
                    </Label>
                    <Input
                      id="pageRangeInput"
                      type="text"
                      value={pageRangeInput}
                      onChange={(e) => {
                        setPageRangeInput(e.target.value);
                        
                        // Generate output files based on ranges
                        const ranges = e.target.value.split(',').map(r => r.trim()).filter(r => r);
                        if (ranges.length > 0 && setOutputFiles) {
                          const files: Array<{id: number, name: string, pages: string}> = [];
                          ranges.forEach((range, idx) => {
                            files.push({
                              id: idx,
                              name: filenamePattern.replace("{n}", `${idx + 1}`),
                              pages: range
                            });
                          });
                          setOutputFiles(files);
                        } else if (setOutputFiles) {
                          setOutputFiles([]);
                        }
                      }}
                      placeholder="1-5, 6-10"
                      className="text-sm"
                    />
                  </div>
                )}

                {/* Specific Pages */}
                {splitMode === "specific" && (
                  <div className="space-y-2">
                    <Label htmlFor="specificPages" className="text-xs text-gray-600">
                      Page numbers (e.g., 1, 3, 5, 7)
                    </Label>
                    <Input
                      id="specificPages"
                      type="text"
                      value={specificPages}
                      onChange={(e) => {
                        setSpecificPages(e.target.value);
                        
                        // Generate output files based on specific pages
                        const pages = e.target.value.split(',').map(p => p.trim()).filter(p => p);
                        if (pages.length > 0 && setOutputFiles) {
                          const files: Array<{id: number, name: string, pages: string}> = [];
                          pages.forEach((page, idx) => {
                            files.push({
                              id: idx,
                              name: filenamePattern.replace("{n}", `${idx + 1}`),
                              pages: page
                            });
                          });
                          setOutputFiles(files);
                        } else if (setOutputFiles) {
                          setOutputFiles([]);
                        }
                      }}
                      placeholder="1, 3, 5, 7"
                      className="text-sm"
                    />
                  </div>
                )}

                {/* Odd/Even */}
                {splitMode === "oddEven" && (
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Select pages</Label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOddEvenMode("odd")}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          oddEvenMode === "odd"
                            ? "bg-purple-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Odd
                      </button>
                      <button
                        onClick={() => setOddEvenMode("even")}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          oddEvenMode === "even"
                            ? "bg-purple-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Even
                      </button>
                      <button
                        onClick={() => setOddEvenMode("both")}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          oddEvenMode === "both"
                            ? "bg-purple-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Both
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center pt-1">
                      {oddEvenMode === "odd" && "Pages: 1, 3, 5, 7..."}
                      {oddEvenMode === "even" && "Pages: 2, 4, 6, 8..."}
                      {oddEvenMode === "both" && "2 files: odd & even"}
                    </p>
                  </div>
                )}

                {/* Every N Pages */}
                {splitMode === "every" && (
                  <div className="space-y-2">
                    <Label htmlFor="pagesPerSplit" className="text-xs text-gray-600">
                      Pages per file
                    </Label>
                    <Input
                      id="pagesPerSplit"
                      type="number"
                      min="1"
                      max={pdfPages.length}
                      value={pagesPerSplit}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseInt(e.target.value);
                        if (val === "" || (!isNaN(val) && val > 0)) {
                          setPagesPerSplit(val);
                          if (typeof val === "number") {
                            // Update page assignments
                            setPdfPages((prev: any) => prev.map((page: any, idx: number) => ({
                              ...page,
                              outputFile: Math.floor(idx / val)
                            })));
                            
                            // Generate output files list
                            const numFiles = Math.ceil(pdfPages.length / val);
                            const files: Array<{id: number, name: string, pages: string}> = [];
                            for (let i = 0; i < numFiles; i++) {
                              const startPage = i * val + 1;
                              const endPage = Math.min((i + 1) * val, pdfPages.length);
                              files.push({
                                id: i,
                                name: filenamePattern.replace("{n}", `${i + 1}`),
                                pages: `${startPage}-${endPage}`
                              });
                            }
                            if (setOutputFiles) setOutputFiles(files);
                          } else {
                            // Clear output files when input is empty
                            if (setOutputFiles) setOutputFiles([]);
                          }
                        }
                      }}
                      placeholder="3"
                      className="text-sm"
                    />
                    {typeof pagesPerSplit === "number" && pagesPerSplit > 0 && (
                      <p className="text-xs text-gray-500">
                        → {Math.ceil(pdfPages.length / pagesPerSplit)} file(s) will be created
                      </p>
                    )}
                  </div>
                )}

                {/* Equal Parts */}
                {splitMode === "equal" && (
                  <div className="space-y-2">
                    <Label htmlFor="numberOfParts" className="text-xs text-gray-600">
                      Number of files
                    </Label>
                    <Input
                      id="numberOfParts"
                      type="number"
                      min="2"
                      max={pdfPages.length}
                      value={numberOfParts}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseInt(e.target.value);
                        if (val === "" || (!isNaN(val) && val > 0)) {
                          setNumberOfParts(val);
                          if (typeof val === "number") {
                            // Generate output files list
                            const pagesPerFile = Math.ceil(pdfPages.length / val);
                            const files: Array<{id: number, name: string, pages: string}> = [];
                            for (let i = 0; i < val; i++) {
                              const startPage = i * pagesPerFile + 1;
                              const endPage = Math.min((i + 1) * pagesPerFile, pdfPages.length);
                              files.push({
                                id: i,
                                name: filenamePattern.replace("{n}", `${i + 1}`),
                                pages: `${startPage}-${endPage}`
                              });
                            }
                            if (setOutputFiles) setOutputFiles(files);
                          } else {
                            // Clear output files when input is empty
                            if (setOutputFiles) setOutputFiles([]);
                          }
                        }
                      }}
                      placeholder="3"
                      className="text-sm"
                    />
                    {typeof numberOfParts === "number" && numberOfParts > 0 && (
                      <p className="text-xs text-gray-500">
                        → ~{Math.ceil(pdfPages.length / numberOfParts)} pages per file
                      </p>
                    )}
                  </div>
                )}

                {/* Extract Pages */}
                {splitMode === "extract" && (
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">
                      {selectedPages.length > 0 
                        ? `Selected pages: ${selectedPages.sort((a,b) => a-b).join(", ")}`
                        : "Click pages in the grid to select"}
                    </Label>
                    {selectedPages.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPages([]);
                          setPdfPages((prev: any) => prev.map((p: any) => ({ ...p, selected: false })));
                        }}
                        className="w-full text-xs"
                      >
                        Clear Selection
                      </Button>
                    )}
                  </div>
                )}

                {/* File Size */}
                {splitMode === "fileSize" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize" className="text-xs text-gray-600">
                      Maximum file size (MB)
                    </Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      min="1"
                      max="100"
                      value={maxFileSize}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseInt(e.target.value);
                        if (val === "" || (!isNaN(val) && val > 0)) setMaxFileSize(val);
                      }}
                      placeholder="5"
                      className="text-sm"
                    />
                  </div>
                )}

                {/* Page Limit */}
                {splitMode === "pageLimit" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxPagesPerFile" className="text-xs text-gray-600">
                      Maximum pages per file
                    </Label>
                    <Input
                      id="maxPagesPerFile"
                      type="number"
                      min="1"
                      max={pdfPages.length}
                      value={maxPagesPerFile}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseInt(e.target.value);
                        if (val === "" || (!isNaN(val) && val > 0)) {
                          setMaxPagesPerFile(val);
                          
                          // Generate output files list
                          if (typeof val === "number" && val > 0) {
                            const numFiles = Math.ceil(pdfPages.length / val);
                            const files: Array<{id: number, name: string, pages: string}> = [];
                            for (let i = 0; i < numFiles; i++) {
                              const startPage = i * val + 1;
                              const endPage = Math.min((i + 1) * val, pdfPages.length);
                              files.push({
                                id: i,
                                name: filenamePattern.replace("{n}", `${i + 1}`),
                                pages: `${startPage}-${endPage}`
                              });
                            }
                            if (setOutputFiles) setOutputFiles(files);
                          } else {
                            // Clear output files when input is empty
                            if (setOutputFiles) setOutputFiles([]);
                          }
                        }
                      }}
                      placeholder="10"
                      className="text-sm"
                    />
                    {typeof maxPagesPerFile === "number" && maxPagesPerFile > 0 && (
                      <p className="text-xs text-gray-500">
                        → ~{Math.ceil(pdfPages.length / maxPagesPerFile)} file(s) will be created
                      </p>
                    )}
                  </div>
                )}

                {/* One Per File */}
                {splitMode === "onePerFile" && (
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-sm text-gray-700">
                      Each page becomes a separate file
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {pdfPages.length} PDF files will be created
                    </p>
                  </div>
                )}
              </div>

              {/* Inline Validation Error - Show directly under configuration */}
              {validationError && (
                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">{validationError}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Uploaded Files Panel - MOVED HERE */}
      {uploadedFiles && (
        <div className="mb-4">
          {/* Collapsible Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadedFiles(!showUploadedFiles)}
              className="flex-1 flex items-center justify-between bg-white border-2 border-purple-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900 text-left">Uploaded Files</h4>
                <p className="text-xs text-gray-500 mt-0.5 text-left">
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {showUploadedFiles ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </button>
            {onAddFiles && uploadedFiles.length > 0 && (
              <Button
                onClick={onAddFiles}
                size="sm"
                variant="outline"
                className="h-11 px-3 text-xs flex-shrink-0"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            )}
          </div>

          {/* Collapsible Content with Smooth Animation */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showUploadedFiles ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white border border-purple-200 rounded-lg p-3">
              {/* Files List or Empty State */}
              {uploadedFiles.length === 0 ? (
                <div className="py-6 text-center">
                  <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-500">No files uploaded</p>
                  {onAddFiles && (
                    <Button
                      onClick={onAddFiles}
                      size="sm"
                      className="mt-3 h-8 px-3 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Upload Files
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`bg-gray-50/80 border rounded-lg p-2.5 hover:bg-gray-100 hover:border-gray-300 transition-all group ${
                          draggedIndex === index ? 'opacity-50' : ''
                        } ${
                          dragOverIndex === index && draggedIndex !== index ? 'border-purple-500 border-2 bg-purple-50' : 'border-gray-200'
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="flex items-center gap-2">
                          {/* Drag Handle */}
                          <div className="flex-shrink-0 text-gray-400 cursor-move hover:text-gray-600 transition-colors">
                            <GripVertical className="w-4 h-4" />
                          </div>

                          {/* File Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                              <FileText className="w-4 h-4 text-purple-600" />
                            </div>
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(() => {
                                const bytes = file.size;
                                if (bytes < 1024) return `${bytes} B`;
                                if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
                                return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
                              })()}
                            </div>
                          </div>

                          {/* Page Count Badge (optional - you can add this from parent) */}
                          {/* <div className="flex-shrink-0">
                            <div className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                              (2)
                            </div>
                          </div> */}

                          {/* Remove Button - ALWAYS VISIBLE */}
                          {onRemoveFile && (
                            <button
                              onClick={() => onRemoveFile(index)}
                              className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                              title="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Size */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium text-gray-900">
                        {(() => {
                          const totalBytes = uploadedFiles.reduce((sum, f) => sum + f.size, 0);
                          if (totalBytes < 1024) return `${totalBytes} B`;
                          if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
                          return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
                        })()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Output Options (Collapsible) */}
      <div className="mb-4">
        <button
          onClick={() => setShowOutput(!showOutput)}
          className="flex items-center justify-between w-full p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-xs font-medium text-gray-700">Output Options</span>
          {showOutput ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {showOutput && (
          <div className="bg-white border border-gray-200 rounded-lg p-3 mt-2 space-y-3">
            {/* Filename Pattern */}
            <div className="space-y-1">
              <Label htmlFor="filenamePattern" className="text-xs text-gray-600">
                Filename pattern
              </Label>
              <Input
                id="filenamePattern"
                type="text"
                value={filenamePattern}
                onChange={(e) => setFilenamePattern(e.target.value)}
                placeholder="split_{n}"
                className="text-sm"
              />
              <p className="text-xs text-gray-400">Use {"{n}"} for file number</p>
            </div>

            {/* Output Format */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Output format</Label>
              <RadioGroup value={outputFormat} onValueChange={(value: any) => setOutputFormat(value)}>
                <div className="space-y-2">
                  <label 
                    className={`flex items-center space-x-2 p-2.5 border-2 rounded-lg cursor-pointer transition-all ${
                      outputFormat === "pdf" 
                        ? "border-purple-500 bg-purple-50" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem value="pdf" id="format-pdf" />
                    <span className={`text-xs ${outputFormat === "pdf" ? "font-medium text-purple-900" : "text-gray-700"}`}>
                      Individual PDF files
                    </span>
                  </label>
                  <label 
                    className={`flex items-center space-x-2 p-2.5 border-2 rounded-lg cursor-pointer transition-all ${
                      outputFormat === "zip" 
                        ? "border-purple-500 bg-purple-50" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem value="zip" id="format-zip" />
                    <span className={`text-xs ${outputFormat === "zip" ? "font-medium text-purple-900" : "text-gray-700"}`}>
                      ZIP archive
                    </span>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
      </div>

      {/* Output Files Section - Only show when there are files to display */}
      {outputFiles && outputFiles.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-600 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Output Files ({outputFiles.length})
            </Label>
          </div>

          {/* Output Files List with Custom Scrollbar */}
          <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {outputFiles.map((file) => (
              <div
                key={file.id}
                className="bg-purple-50/50 border border-purple-200 rounded-lg p-2.5 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {/* Editable Filename */}
                  <div className="flex-1 min-w-0">
                    <Input
                      value={file.name}
                      onChange={(e) => {
                        if (setOutputFiles) {
                          setOutputFiles(
                            outputFiles.map((f) =>
                              f.id === file.id ? { ...f, name: e.target.value } : f
                            )
                          );
                        }
                      }}
                      className="h-7 text-xs font-medium px-2 bg-white border-purple-300 focus:border-purple-500"
                    />
                  </div>
                  
                  {/* Page Numbers on Same Line */}
                  <div className="flex-shrink-0 text-[10px] text-gray-500 font-medium whitespace-nowrap">
                    Pages: {file.pages}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-gray-400 italic">
            Edit filenames directly in the input field
          </p>
        </div>
      )}

      {/* Split Button */}
      <Button
        onClick={handleSplitClick}
        disabled={splitMode === "extract" && selectedPages.length === 0}
        size="lg"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-11"
      >
        <Scissors className="w-4 h-4 mr-2" />
        {isProcessing ? "Splitting..." : "Split PDF"}
      </Button>
    </>
  );
}