/**
 * Split PDF Sidebar Component
 * 
 * Comprehensive sidebar for PDF splitting with 3 categories:
 * - Basic Split Modes (5 modes)
 * - Advanced Split Modes (4 modes)
 * - Output Options (filename, format, combine)
 */

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { 
  Scissors, 
  Grid3x3, 
  Slice, 
  Square, 
  Hand, 
  SplitSquareHorizontal,
  HardDrive,
  FileStack,
  Files,
  Settings2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

interface SplitPdfSidebarProps {
  // Category state
  activeCategory: "basic" | "advanced" | "output";
  setActiveCategory: (cat: "basic" | "advanced" | "output") => void;
  
  // Split mode state
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
  
  // Basic mode settings
  pageRangeInput: string;
  setPageRangeInput: (val: string) => void;
  pagesPerSplit: number;
  setPagesPerSplit: (val: number) => void;
  numberOfParts: number;
  setNumberOfParts: (val: number) => void;
  specificPages: string;
  setSpecificPages: (val: string) => void;
  selectedPages: number[];
  setSelectedPages: (val: number[]) => void;
  
  // Advanced mode settings
  oddEvenMode: "odd" | "even" | "both";
  setOddEvenMode: (mode: "odd" | "even" | "both") => void;
  maxFileSize: number;
  setMaxFileSize: (val: number) => void;
  maxPagesPerFile: number;
  setMaxPagesPerFile: (val: number) => void;
  
  // Output options
  filenamePattern: string;
  setFilenamePattern: (val: string) => void;
  combineAfterSplit: boolean;
  setCombineAfterSplit: (val: boolean) => void;
  outputFormat: "pdf" | "zip";
  setOutputFormat: (format: "pdf" | "zip") => void;
  
  // PDF pages data
  pdfPages: Array<{pageNumber: number, fileName: string, selected: boolean, outputFile: number}>;
  setPdfPages: (pages: any) => void;
  
  // Actions
  handleSplit: () => void;
  isProcessing: boolean;
}

export function SplitPdfSidebar(props: SplitPdfSidebarProps) {
  const {
    activeCategory,
    setActiveCategory,
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
  } = props;

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Split Settings</h3>
      </div>

      {/* Category Tabs - 3 Column Layout */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          onClick={() => setActiveCategory("basic")}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            activeCategory === "basic"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Basic
        </button>
        <button
          onClick={() => setActiveCategory("advanced")}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            activeCategory === "advanced"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Advanced
        </button>
        <button
          onClick={() => setActiveCategory("output")}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            activeCategory === "output"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Output
        </button>
      </div>

      <div className="space-y-6">
        {/* BASIC SPLIT MODES */}
        {activeCategory === "basic" && (
          <>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Split Modes</h4>
              <RadioGroup value={splitMode} onValueChange={(value: any) => setSplitMode(value)}>
                <div className="space-y-2">
                  {/* 1. Split by Page Range */}
                  <div 
                    className={`flex items-start space-x-3 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      splitMode === "range" ? "border-purple-400 bg-purple-50/50" : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSplitMode("range")}
                  >
                    <RadioGroupItem value="range" id="mode-range" className="mt-0.5" />
                    <Label htmlFor="mode-range" className="flex-1 cursor-pointer">
                      <div className="font-medium text-sm">Split by Page Range</div>
                      <div className="text-xs text-gray-500 mt-0.5">Define custom page ranges</div>
                    </Label>
                  </div>

                  {/* 2. Split Every N Pages */}
                  <div 
                    className={`flex items-start space-x-3 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      splitMode === "every" ? "border-purple-400 bg-purple-50/50" : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSplitMode("every")}
                  >
                    <RadioGroupItem value="every" id="mode-every" className="mt-0.5" />
                    <Label htmlFor="mode-every" className="flex-1 cursor-pointer">
                      <div className="font-medium text-sm">Split Every N Pages</div>
                      <div className="text-xs text-gray-500 mt-0.5">Equal page groups</div>
                    </Label>
                  </div>

                  {/* 3. Split Into Equal Parts */}
                  <div 
                    className={`flex items-start space-x-3 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      splitMode === "equal" ? "border-purple-400 bg-purple-50/50" : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSplitMode("equal")}
                  >
                    <RadioGroupItem value="equal" id="mode-equal" className="mt-0.5" />
                    <Label htmlFor="mode-equal" className="flex-1 cursor-pointer">
                      <div className="font-medium text-sm">Split Into Equal Parts</div>
                      <div className="text-xs text-gray-500 mt-0.5">Divide into N files</div>
                    </Label>
                  </div>

                  {/* 4. Split by Specific Pages */}
                  <div 
                    className={`flex items-start space-x-3 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      splitMode === "specific" ? "border-purple-400 bg-purple-50/50" : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSplitMode("specific")}
                  >
                    <RadioGroupItem value="specific" id="mode-specific" className="mt-0.5" />
                    <Label htmlFor="mode-specific" className="flex-1 cursor-pointer">
                      <div className="font-medium text-sm">Split by Specific Pages</div>
                      <div className="text-xs text-gray-500 mt-0.5">Choose exact pages</div>
                    </Label>
                  </div>

                  {/* 5. Extract Pages */}
                  <div 
                    className={`flex items-start space-x-3 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      splitMode === "extract" ? "border-purple-400 bg-purple-50/50" : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSplitMode("extract")}
                  >
                    <RadioGroupItem value="extract" id="mode-extract" className="mt-0.5" />
                    <Label htmlFor="mode-extract" className="flex-1 cursor-pointer">
                      <div className="font-medium text-sm">Extract Pages to New PDF</div>
                      <div className="text-xs text-gray-500 mt-0.5">Click pages to select</div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </>
        )}

        {/* ADVANCED SPLIT MODES */}
        {activeCategory === "advanced" && (
          <>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Advanced Split Modes</h4>
              <RadioGroup value={splitMode} onValueChange={(value: any) => setSplitMode(value)}>
                <div className="space-y-2">
                  {/* 6. Split by Odd/Even Pages */}
                  <div 
                    className={`flex items-start space-x-3 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      splitMode === "oddEven" ? "border-purple-400 bg-purple-50/50" : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSplitMode("oddEven")}
                  >
                    <RadioGroupItem value="oddEven" id="mode-oddEven" className="mt-0.5" />
                    <Label htmlFor="mode-oddEven" className="flex-1 cursor-pointer">
                      <div className="font-medium text-sm">Split by Odd/Even Pages</div>
                      <div className="text-xs text-gray-500 mt-0.5">Separate odd and even</div>
                    </Label>
                  </div>

                  {/* 7. Split by File Size */}
                  <div 
                    className={`flex items-start space-x-3 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      splitMode === "fileSize" ? "border-purple-400 bg-purple-50/50" : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSplitMode("fileSize")}
                  >
                    <RadioGroupItem value="fileSize" id="mode-fileSize" className="mt-0.5" />
                    <Label htmlFor="mode-fileSize" className="flex-1 cursor-pointer">
                      <div className="font-medium text-sm">Split by File Size</div>
                      <div className="text-xs text-gray-500 mt-0.5">Max size per file</div>
                    </Label>
                  </div>

                  {/* 8. Split by Page Count Limit */}
                  <div 
                    className={`flex items-start space-x-3 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      splitMode === "pageLimit" ? "border-purple-400 bg-purple-50/50" : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSplitMode("pageLimit")}
                  >
                    <RadioGroupItem value="pageLimit" id="mode-pageLimit" className="mt-0.5" />
                    <Label htmlFor="mode-pageLimit" className="flex-1 cursor-pointer">
                      <div className="font-medium text-sm">Split by Page Count Limit</div>
                      <div className="text-xs text-gray-500 mt-0.5">Max pages per file</div>
                    </Label>
                  </div>

                  {/* 9. Split One Page Per File */}
                  <div 
                    className={`flex items-start space-x-3 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      splitMode === "onePerFile" ? "border-purple-400 bg-purple-50/50" : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSplitMode("onePerFile")}
                  >
                    <RadioGroupItem value="onePerFile" id="mode-onePerFile" className="mt-0.5" />
                    <Label htmlFor="mode-onePerFile" className="flex-1 cursor-pointer">
                      <div className="font-medium text-sm">Split One Page Per File</div>
                      <div className="text-xs text-gray-500 mt-0.5">Extract all pages separately</div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </>
        )}

        {/* OUTPUT OPTIONS */}
        {activeCategory === "output" && (
          <>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Output Options</h4>
              
              {/* Filename Pattern */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="filenamePattern" className="text-xs text-gray-600">
                  Filename Pattern
                </Label>
                <Input
                  id="filenamePattern"
                  type="text"
                  value={filenamePattern}
                  onChange={(e) => setFilenamePattern(e.target.value)}
                  placeholder="split_{n}"
                  className="text-sm bg-purple-50 border-purple-200"
                />
                <p className="text-xs text-gray-500">Use {"{n}"} for file number</p>
              </div>

              {/* Output Format */}
              <div className="space-y-2 mb-4">
                <Label className="text-xs text-gray-600">Download Format</Label>
                <RadioGroup value={outputFormat} onValueChange={(value: any) => setOutputFormat(value)}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 border rounded-lg">
                      <RadioGroupItem value="pdf" id="format-pdf" />
                      <Label htmlFor="format-pdf" className="flex-1 cursor-pointer text-sm">
                        Individual PDF files
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-2 border rounded-lg">
                      <RadioGroupItem value="zip" id="format-zip" />
                      <Label htmlFor="format-zip" className="flex-1 cursor-pointer text-sm">
                        ZIP archive (all files)
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Combine After Split */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border-2 rounded-lg border-purple-200 bg-purple-50/30">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Combine After Split</div>
                    <div className="text-xs text-gray-500 mt-0.5">Create one merged file too</div>
                  </div>
                  <button
                    onClick={() => setCombineAfterSplit(!combineAfterSplit)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      combineAfterSplit ? "bg-purple-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        combineAfterSplit ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Configuration (shown for Basic and Advanced modes) */}
        {activeCategory !== "output" && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Configuration</h4>
            
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
                  onChange={(e) => setPageRangeInput(e.target.value)}
                  placeholder="1-5, 6-10, 11-15"
                  className="text-sm bg-purple-50 border-purple-200"
                />
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
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      setPagesPerSplit(val);
                      setPdfPages((prev: any) => prev.map((page: any, idx: number) => ({
                        ...page,
                        outputFile: Math.floor(idx / val)
                      })));
                    }
                  }}
                  className="text-sm bg-purple-50 border-purple-200"
                />
                <p className="text-xs text-gray-500">
                  Will create {Math.ceil(pdfPages.length / pagesPerSplit)} file(s)
                </p>
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
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) setNumberOfParts(val);
                  }}
                  className="text-sm bg-purple-50 border-purple-200"
                />
                <p className="text-xs text-gray-500">
                  ~{Math.ceil(pdfPages.length / numberOfParts)} pages per file
                </p>
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
                  onChange={(e) => setSpecificPages(e.target.value)}
                  placeholder="1, 3, 5, 7"
                  className="text-sm bg-purple-50 border-purple-200"
                />
              </div>
            )}

            {/* Extract Pages */}
            {splitMode === "extract" && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  {selectedPages.length > 0 
                    ? `Selected: ${selectedPages.sort((a,b) => a-b).join(", ")}`
                    : "Click pages in the grid to select"}
                </p>
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

            {/* Odd/Even */}
            {splitMode === "oddEven" && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Split Mode</Label>
                <RadioGroup value={oddEvenMode} onValueChange={(value: any) => setOddEvenMode(value)}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 border rounded-lg">
                      <RadioGroupItem value="odd" id="oddEven-odd" />
                      <Label htmlFor="oddEven-odd" className="flex-1 cursor-pointer text-sm">
                        Odd pages only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-2 border rounded-lg">
                      <RadioGroupItem value="even" id="oddEven-even" />
                      <Label htmlFor="oddEven-even" className="flex-1 cursor-pointer text-sm">
                        Even pages only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-2 border rounded-lg">
                      <RadioGroupItem value="both" id="oddEven-both" />
                      <Label htmlFor="oddEven-both" className="flex-1 cursor-pointer text-sm">
                        Both (2 separate files)
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* File Size */}
            {splitMode === "fileSize" && (
              <div className="space-y-2">
                <Label htmlFor="maxFileSize" className="text-xs text-gray-600">
                  Max file size (MB)
                </Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  min="1"
                  max="100"
                  value={maxFileSize}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) setMaxFileSize(val);
                  }}
                  className="text-sm bg-purple-50 border-purple-200"
                />
              </div>
            )}

            {/* Page Limit */}
            {splitMode === "pageLimit" && (
              <div className="space-y-2">
                <Label htmlFor="maxPagesPerFile" className="text-xs text-gray-600">
                  Max pages per file
                </Label>
                <Input
                  id="maxPagesPerFile"
                  type="number"
                  min="1"
                  max={pdfPages.length}
                  value={maxPagesPerFile}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) setMaxPagesPerFile(val);
                  }}
                  className="text-sm bg-purple-50 border-purple-200"
                />
                <p className="text-xs text-gray-500">
                  Will create ~{Math.ceil(pdfPages.length / maxPagesPerFile)} file(s)
                </p>
              </div>
            )}

            {/* One Per File - No config needed */}
            {splitMode === "onePerFile" && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-700">
                  Will create {pdfPages.length} separate PDF files (one page each)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Output Preview */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Output Files</h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
            {/* Preview based on mode */}
            {splitMode === "every" && Array.from({ length: Math.ceil(pdfPages.length / pagesPerSplit) }).map((_, idx) => {
              const startPage = idx * pagesPerSplit + 1;
              const endPage = Math.min((idx + 1) * pagesPerSplit, pdfPages.length);
              const pageCount = endPage - startPage + 1;
              return (
                <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                  <div className="font-medium text-gray-900">{filenamePattern.replace("{n}", `${idx + 1}`)}.pdf</div>
                  <div className="text-gray-500">Pages {startPage}-{endPage} ({pageCount} pages)</div>
                </div>
              );
            })}
            
            {splitMode === "equal" && Array.from({ length: numberOfParts }).map((_, idx) => {
              const pagesPerPart = Math.ceil(pdfPages.length / numberOfParts);
              const startPage = idx * pagesPerPart + 1;
              const endPage = Math.min((idx + 1) * pagesPerPart, pdfPages.length);
              const pageCount = endPage - startPage + 1;
              return (
                <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                  <div className="font-medium text-gray-900">{filenamePattern.replace("{n}", `${idx + 1}`)}.pdf</div>
                  <div className="text-gray-500">Pages {startPage}-{endPage} ({pageCount} pages)</div>
                </div>
              );
            })}
            
            {splitMode === "extract" && selectedPages.length > 0 && (
              <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                <div className="font-medium text-gray-900">extracted.pdf</div>
                <div className="text-gray-500">{selectedPages.length} selected pages</div>
              </div>
            )}
            
            {splitMode === "onePerFile" && (
              <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                <div className="font-medium text-gray-900">{pdfPages.length} files</div>
                <div className="text-gray-500">page_1.pdf, page_2.pdf, ...</div>
              </div>
            )}
            
            {splitMode === "oddEven" && (
              <>
                {(oddEvenMode === "odd" || oddEvenMode === "both") && (
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                    <div className="font-medium text-gray-900">odd_pages.pdf</div>
                    <div className="text-gray-500">{Math.ceil(pdfPages.length / 2)} odd pages</div>
                  </div>
                )}
                {(oddEvenMode === "even" || oddEvenMode === "both") && (
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                    <div className="font-medium text-gray-900">even_pages.pdf</div>
                    <div className="text-gray-500">{Math.floor(pdfPages.length / 2)} even pages</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Split Button */}
        <Button
          onClick={handleSplit}
          disabled={splitMode === "extract" && selectedPages.length === 0}
          size="lg"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12"
        >
          <Scissors className="w-5 h-5 mr-2" />
          {isProcessing ? "Splitting..." : "Split PDF"}
        </Button>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>✓ 100% Secure & Private</p>
          <p>✓ No Watermarks</p>
          <p>✓ Unlimited Usage</p>
        </div>
      </div>
    </>
  );
}