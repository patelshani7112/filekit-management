/**
 * Updated Sidebar Example
 * 
 * Visual demonstration of the enhanced MergePdfSidebar with:
 * - Collapsible Source Files section
 * - Add Files button inside dropdown
 * - Stats at bottom
 * - Optional compress checkbox
 */

import { useState } from 'react';
import { MergePdfSidebar, SourceFile } from '../tool/sidebars/MergePdfSidebar';

export default function UpdatedSidebarExample() {
  const [sourceFiles] = useState<SourceFile[]>([
    {
      id: '1',
      name: '26217643_VDA PHOTOS (1).pdf',
      pageCount: 10,
      size: '23.74 MB',
      color: '#8B5CF6'
    },
    {
      id: '2',
      name: '26217643_VDA PHOTOS.pdf',
      pageCount: 20,
      size: '47.51 MB',
      color: '#EC4899'
    },
    {
      id: '3',
      name: 'filetools_mvp_plan.pdf',
      pageCount: 2,
      size: '1.52 MB',
      color: '#6366F1'
    },
    {
      id: '4',
      name: 'filetools_clean_list.pdf',
      pageCount: 5,
      size: '3.89 MB',
      color: '#F59E0B'
    },
    {
      id: '5',
      name: 'merged.pdf',
      pageCount: 20,
      size: '18.36 MB',
      color: '#10B981'
    }
  ]);

  const [outputFilename, setOutputFilename] = useState('merged.pdf');
  const [compressEnabled, setCompressEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPages = sourceFiles.reduce((sum, file) => sum + file.pageCount, 0);
  const totalSize = '95.02 MB';
  const estimatedCompressedSize = '35.86 MB';  // Example: ~62% reduction

  const handleAddFiles = () => {
    alert('Add Files clicked!');
  };

  const handleRemoveFile = (index: number) => {
    alert(`Remove file at index ${index}`);
  };

  const handleReorderFiles = (fromIndex: number, toIndex: number) => {
    alert(`Reorder from ${fromIndex} to ${toIndex}`);
  };

  const handleMerge = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Merging ${totalPages} pages${compressEnabled ? ' with compression' : ''}!`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl">Enhanced MergePdfSidebar Component</h1>
          <p className="text-gray-600">
            Collapsible sections, stats at bottom, optional compress checkbox
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Without Compress Option */}
          <div className="space-y-4">
            <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4">
              <h2 className="text-xl text-center">Basic Version</h2>
              <p className="text-sm text-gray-600 text-center">No stats shown (default)</p>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              <MergePdfSidebar
                sourceFiles={sourceFiles}
                totalPages={totalPages}
                totalSize={totalSize}
                outputFilename={outputFilename}
                onAddFiles={handleAddFiles}
                onRemoveFile={handleRemoveFile}
                onReorderFiles={handleReorderFiles}
                onOutputFilenameChange={setOutputFilename}
                onMerge={handleMerge}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {/* Right: With Compress Option */}
          <div className="space-y-4">
            <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4">
              <h2 className="text-xl text-center">Advanced Version</h2>
              <p className="text-sm text-gray-600 text-center">Stats shown when compress enabled</p>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              <MergePdfSidebar
                sourceFiles={sourceFiles}
                totalPages={totalPages}
                totalSize={totalSize}
                outputFilename={outputFilename}
                onAddFiles={handleAddFiles}
                onRemoveFile={handleRemoveFile}
                onReorderFiles={handleReorderFiles}
                onOutputFilenameChange={setOutputFilename}
                onMerge={handleMerge}
                isProcessing={isProcessing}
                showCompressOption={true}
                compressEnabled={compressEnabled}
                onCompressChange={setCompressEnabled}
                estimatedCompressedSize={estimatedCompressedSize}
              />
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-xl text-center">New Features</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 space-y-2">
              <div className="text-purple-600 text-2xl">📁</div>
              <h3 className="font-medium">Collapsible Source Files</h3>
              <p className="text-sm text-gray-600">
                Click the "Source Files" header to toggle the file list. Default: COLLAPSED with arrow icon.
              </p>
            </div>

            <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 space-y-2">
              <div className="text-purple-600 text-2xl">➕</div>
              <h3 className="font-medium">Add Files Inside Dropdown</h3>
              <p className="text-sm text-gray-600">
                "Add Files" button is now inside the collapsible source files section.
              </p>
            </div>

            <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 space-y-2">
              <div className="text-purple-600 text-2xl">📊</div>
              <h3 className="font-medium">Conditional Stats Display</h3>
              <p className="text-sm text-gray-600">
                Stats ONLY shown when compress option is enabled. Shows current size vs estimated compressed size.
              </p>
            </div>
          </div>

          <div className="border-2 border-dashed border-green-300 rounded-lg p-4 space-y-2 bg-green-50">
            <div className="text-green-600 text-2xl">🗜️</div>
            <h3 className="font-medium">Optional: Compress PDF with Size Preview</h3>
            <p className="text-sm text-gray-600">
              When compress is enabled, shows current size (95.02 MB) vs estimated compressed size (35.86 MB).
              Enable with <code className="bg-white px-2 py-0.5 rounded border">showCompressOption=&#123;true&#125;</code>.
            </p>
            <div className="mt-2 bg-white rounded border p-3 space-y-1">
              <p className="text-xs text-gray-500 mb-2">Current state in right sidebar:</p>
              <p className="text-sm">
                <strong>Compress Enabled:</strong> {compressEnabled ? '✅ Yes' : '❌ No'}
              </p>
              <p className="text-sm">
                <strong>Stats Visible:</strong> {compressEnabled ? '✅ Yes (showing sizes)' : '❌ No (hidden)'}
              </p>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-gray-900 text-gray-100 rounded-xl p-6 space-y-4">
          <h2 className="text-xl">Usage Example</h2>
          <pre className="text-sm overflow-x-auto">
{`<MergePdfSidebar
  sourceFiles={sourceFiles}
  totalPages={57}
  totalSize="95.02 MB"
  outputFilename="merged.pdf"
  onAddFiles={handleAddFiles}
  onRemoveFile={handleRemoveFile}
  onReorderFiles={handleReorderFiles}
  onOutputFilenameChange={setOutputFilename}
  onMerge={handleMerge}
  isProcessing={isProcessing}
  
  // Optional: Enable compress with size comparison
  showCompressOption={true}
  compressEnabled={compressEnabled}
  onCompressChange={setCompressEnabled}
  estimatedCompressedSize="35.86 MB"  // Shows after compress enabled
/>`}
          </pre>
        </div>

        {/* Interactive Test */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
          <h2 className="text-xl text-center">Try It Out!</h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCompressEnabled(!compressEnabled)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Toggle Compress: {compressEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleMerge}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Test Merge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
