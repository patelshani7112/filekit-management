/**
 * Button Styles Examples
 * 
 * Visual showcase comparing OutlineButton vs DottedButton.
 * Shows when to use each button type.
 */

import { OutlineButton } from '../ui/outline-button';
import { DottedButton } from '../ui/dotted-button';
import { ArrowLeft, Plus, Trash2, Upload, Save, Download } from 'lucide-react';

export function ButtonStylesExample() {
  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">WorkflowPro Button Styles</h1>
          <p className="text-gray-600">
            Two button styles for different use cases
          </p>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* OutlineButton */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
              <h2 className="text-xl mb-3">OutlineButton</h2>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Solid outline</strong> → fills on hover<br/>
                Use for: Navigation, actions, confirmations
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Primary:</p>
                  <OutlineButton size="md">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Upload
                  </OutlineButton>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Danger:</p>
                  <OutlineButton variant="danger" size="sm">
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </OutlineButton>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Success:</p>
                  <OutlineButton variant="success" size="sm">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </OutlineButton>
                </div>
              </div>
            </div>
          </div>

          {/* DottedButton */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
              <h2 className="text-xl mb-3">DottedButton</h2>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Dotted outline</strong> → fills on hover<br/>
                Use for: Add files, upload, create new
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Primary:</p>
                  <DottedButton size="sm">
                    <Plus className="w-4 h-4" />
                    Add Files
                  </DottedButton>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Upload:</p>
                  <DottedButton size="md">
                    <Upload className="w-5 h-5" />
                    Upload More
                  </DottedButton>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Secondary:</p>
                  <DottedButton variant="secondary" size="sm">
                    <Plus className="w-4 h-4" />
                    Add Optional
                  </DottedButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual States */}
        <div className="space-y-4">
          <h2 className="text-2xl">Visual States Comparison</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* OutlineButton States */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 space-y-4">
              <h3 className="font-medium">OutlineButton States</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Normal (hover to see effect):</p>
                  <OutlineButton>Normal State</OutlineButton>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-2">Disabled:</p>
                  <OutlineButton disabled>Disabled State</OutlineButton>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
                <strong>Default:</strong> Solid purple border, purple text<br/>
                <strong>Hover:</strong> Purple fill, white text<br/>
                <strong>Transition:</strong> Smooth 200ms
              </div>
            </div>

            {/* DottedButton States */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 space-y-4">
              <h3 className="font-medium">DottedButton States</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Normal (hover to see effect):</p>
                  <DottedButton>Normal State</DottedButton>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-2">Disabled:</p>
                  <DottedButton disabled>Disabled State</DottedButton>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
                <strong>Default:</strong> Dotted purple border, purple text<br/>
                <strong>Hover:</strong> Solid border + purple fill, white text<br/>
                <strong>Transition:</strong> Smooth 200ms
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Examples */}
        <div className="space-y-4">
          <h2 className="text-2xl">Real-World Usage</h2>
          
          {/* Page Header Example */}
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200 space-y-3">
            <h3 className="font-medium">Page Header</h3>
            <div className="flex items-center justify-between border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <OutlineButton size="md">
                <ArrowLeft className="w-5 h-5" />
                Back to Upload
              </OutlineButton>
              <div className="text-sm text-gray-600 font-medium">
                21 pages total • 47.51 MB
              </div>
            </div>
            <p className="text-xs text-gray-500">
              ✅ Uses OutlineButton for navigation
            </p>
          </div>

          {/* Sidebar Header Example */}
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200 space-y-3">
            <h3 className="font-medium">Sidebar Header</h3>
            <div className="flex items-center justify-between border-2 border-dashed border-gray-300 p-4 rounded-lg max-w-md">
              <h2 className="text-xl">Merge Settings</h2>
              <DottedButton size="sm">
                <Plus className="w-4 h-4" />
                Add Files
              </DottedButton>
            </div>
            <p className="text-xs text-gray-500">
              ✅ Uses DottedButton for adding content
            </p>
          </div>

          {/* Mixed Actions Example */}
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200 space-y-3">
            <h3 className="font-medium">Mixed Actions (Toolbar)</h3>
            <div className="flex items-center gap-3 border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <OutlineButton size="sm">Select All</OutlineButton>
              <OutlineButton size="sm">Deselect All</OutlineButton>
              <div className="flex-1"></div>
              <DottedButton size="sm">
                <Plus className="w-4 h-4" />
                Add More
              </DottedButton>
              <OutlineButton variant="danger" size="sm">
                <Trash2 className="w-4 h-4" />
                Delete
              </OutlineButton>
            </div>
            <p className="text-xs text-gray-500">
              ✅ OutlineButton for actions, DottedButton for additions
            </p>
          </div>

          {/* Upload Area Example */}
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200 space-y-3">
            <h3 className="font-medium">Upload Area (Empty State)</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg mb-2">No files uploaded yet</h3>
              <p className="text-gray-600 mb-6">
                Upload PDF files to get started
              </p>
              <DottedButton size="lg">
                <Upload className="w-5 h-5" />
                Upload Files
              </DottedButton>
            </div>
            <p className="text-xs text-gray-500">
              ✅ DottedButton perfect for upload prompts
            </p>
          </div>
        </div>

        {/* Decision Guide */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8">
          <h2 className="text-2xl mb-4">Quick Decision Guide</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <div className="w-8 h-8 border-2 border-purple-600 rounded flex items-center justify-center text-purple-600">
                  1
                </div>
                Use OutlineButton for:
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Navigation (Back, Continue, Next)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Selection actions (Select All, Deselect)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Destructive actions (Delete, Remove)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Confirmation actions (Save, Confirm)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <div className="w-8 h-8 border-2 border-dashed border-purple-600 rounded flex items-center justify-center text-purple-600">
                  2
                </div>
                Use DottedButton for:
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Adding files (Add Files, Upload More)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Creating new items (New Document, Add Section)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Upload prompts (empty states)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Additive actions (Add More, Create New)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Code Comparison */}
        <div className="space-y-4">
          <h2 className="text-2xl">Code Comparison</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <p className="text-xs text-gray-400 mb-2">OutlineButton:</p>
              <pre className="text-xs">
{`import { OutlineButton } from '@/components/ui/outline-button';

<OutlineButton 
  onClick={handleBack}
  size="md"
>
  <ArrowLeft className="w-5 h-5" />
  Back to Upload
</OutlineButton>`}
              </pre>
            </div>
            
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <p className="text-xs text-gray-400 mb-2">DottedButton:</p>
              <pre className="text-xs">
{`import { DottedButton } from '@/components/ui/dotted-button';

<DottedButton 
  onClick={handleAdd}
  size="sm"
>
  <Plus className="w-4 h-4" />
  Add Files
</DottedButton>`}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
