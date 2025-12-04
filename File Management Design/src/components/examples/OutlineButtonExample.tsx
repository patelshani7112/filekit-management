/**
 * OutlineButton Examples
 * 
 * Visual showcase of the OutlineButton component with all variants and sizes.
 * This file can be used as a reference or imported into a style guide page.
 */

import { OutlineButton } from '../ui/outline-button';
import { ArrowLeft, Plus, Save, Trash2, Check, Download, Upload, Edit2 } from 'lucide-react';

export function OutlineButtonExample() {
  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">OutlineButton Component</h1>
          <p className="text-gray-600">
            Consistent outline-style buttons used throughout WorkflowPro
          </p>
        </div>

        {/* Sizes */}
        <div className="space-y-4">
          <h2 className="text-2xl">Sizes</h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <OutlineButton size="sm">
                <Plus className="w-4 h-4" />
                Small
              </OutlineButton>
              <OutlineButton size="md">
                <Plus className="w-5 h-5" />
                Medium (Default)
              </OutlineButton>
              <OutlineButton size="lg">
                <Plus className="w-5 h-5" />
                Large
              </OutlineButton>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <h2 className="text-2xl">Variants</h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <OutlineButton variant="primary">
                Primary (Purple)
              </OutlineButton>
              <OutlineButton variant="danger">
                <Trash2 className="w-4 h-4" />
                Danger (Red)
              </OutlineButton>
              <OutlineButton variant="success">
                <Check className="w-4 h-4" />
                Success (Green)
              </OutlineButton>
            </div>
          </div>
        </div>

        {/* Common Use Cases */}
        <div className="space-y-4">
          <h2 className="text-2xl">Common Use Cases</h2>
          
          {/* Navigation */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-3">
            <h3 className="font-medium text-gray-700">Navigation</h3>
            <div className="flex items-center gap-3">
              <OutlineButton>
                <ArrowLeft className="w-5 h-5" />
                Back to Upload
              </OutlineButton>
              <OutlineButton>
                Continue
              </OutlineButton>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-3">
            <h3 className="font-medium text-gray-700">Actions</h3>
            <div className="flex items-center gap-3">
              <OutlineButton size="sm">
                <Plus className="w-4 h-4" />
                Add Files
              </OutlineButton>
              <OutlineButton size="sm">
                <Upload className="w-4 h-4" />
                Upload
              </OutlineButton>
              <OutlineButton size="sm">
                <Download className="w-4 h-4" />
                Download
              </OutlineButton>
              <OutlineButton size="sm">
                <Save className="w-4 h-4" />
                Save
              </OutlineButton>
              <OutlineButton size="sm">
                <Edit2 className="w-4 h-4" />
                Edit
              </OutlineButton>
            </div>
          </div>

          {/* Selection Tools */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-3">
            <h3 className="font-medium text-gray-700">Selection Tools</h3>
            <div className="flex items-center gap-3">
              <OutlineButton size="sm">Select All</OutlineButton>
              <OutlineButton size="sm">Deselect All</OutlineButton>
              <OutlineButton size="sm">Invert Selection</OutlineButton>
            </div>
          </div>

          {/* Destructive Actions */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-3">
            <h3 className="font-medium text-gray-700">Destructive Actions</h3>
            <div className="flex items-center gap-3">
              <OutlineButton variant="danger" size="sm">
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </OutlineButton>
              <OutlineButton variant="danger">
                <Trash2 className="w-4 h-4" />
                Delete All Pages
              </OutlineButton>
            </div>
          </div>
        </div>

        {/* States */}
        <div className="space-y-4">
          <h2 className="text-2xl">States</h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <OutlineButton>Normal</OutlineButton>
              <OutlineButton disabled>Disabled</OutlineButton>
            </div>
          </div>
        </div>

        {/* Layout Examples */}
        <div className="space-y-4">
          <h2 className="text-2xl">Layout Examples</h2>
          
          {/* Header Layout */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-3">
            <h3 className="font-medium text-gray-700">Page Header</h3>
            <div className="flex items-center justify-between border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <OutlineButton size="md">
                <ArrowLeft className="w-5 h-5" />
                Back to Upload
              </OutlineButton>
              <div className="text-sm text-gray-600 font-medium">
                49 pages total • 59.34 MB
              </div>
            </div>
          </div>

          {/* Sidebar Header */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-3">
            <h3 className="font-medium text-gray-700">Sidebar Header</h3>
            <div className="flex items-center justify-between border-2 border-dashed border-gray-300 p-4 rounded-lg max-w-md">
              <h2 className="text-xl">Merge Settings</h2>
              <OutlineButton size="sm">
                <Plus className="w-4 h-4" />
                Add Files
              </OutlineButton>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-3">
            <h3 className="font-medium text-gray-700">Toolbar</h3>
            <div className="flex items-center gap-2 border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <OutlineButton size="sm">Select All</OutlineButton>
              <OutlineButton size="sm">Deselect All</OutlineButton>
              <OutlineButton size="sm">Invert</OutlineButton>
              <div className="flex-1"></div>
              <OutlineButton size="sm" variant="danger">
                <Trash2 className="w-4 h-4" />
                Delete
              </OutlineButton>
            </div>
          </div>

          {/* Confirmation Dialog */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-3">
            <h3 className="font-medium text-gray-700">Confirmation Dialog</h3>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg max-w-md space-y-4">
              <p className="text-gray-700">Are you sure you want to delete these files?</p>
              <div className="flex gap-3 justify-end">
                <OutlineButton>Cancel</OutlineButton>
                <OutlineButton variant="danger">
                  Delete Permanently
                </OutlineButton>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width */}
        <div className="space-y-4">
          <h2 className="text-2xl">Full Width</h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="max-w-md space-y-3">
              <OutlineButton className="w-full">
                <Upload className="w-4 h-4" />
                Upload Files
              </OutlineButton>
              <OutlineButton className="w-full" variant="success">
                <Check className="w-4 h-4" />
                Confirm Selection
              </OutlineButton>
              <OutlineButton className="w-full" variant="danger">
                <Trash2 className="w-4 h-4" />
                Delete All
              </OutlineButton>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="space-y-4">
          <h2 className="text-2xl">Code Examples</h2>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm">
{`// Import
import { OutlineButton } from '@/components/ui/outline-button';
import { ArrowLeft, Plus } from 'lucide-react';

// Basic usage
<OutlineButton onClick={handleClick}>
  Click Me
</OutlineButton>

// With icon
<OutlineButton onClick={handleBack}>
  <ArrowLeft className="w-5 h-5" />
  Back to Upload
</OutlineButton>

// Different sizes
<OutlineButton size="sm">Small</OutlineButton>
<OutlineButton size="md">Medium</OutlineButton>
<OutlineButton size="lg">Large</OutlineButton>

// Different variants
<OutlineButton variant="primary">Primary</OutlineButton>
<OutlineButton variant="danger">Danger</OutlineButton>
<OutlineButton variant="success">Success</OutlineButton>

// Disabled
<OutlineButton disabled>Disabled</OutlineButton>

// Full width
<OutlineButton className="w-full">Full Width</OutlineButton>`}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
