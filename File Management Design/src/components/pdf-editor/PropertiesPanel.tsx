/**
 * Properties Panel Component
 * 
 * Right sidebar showing context-sensitive properties
 * Changes based on selected element or page
 */

import { useState } from 'react';
import { 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  ArrowUp, ArrowDown, Lock, Unlock, Trash2, RotateCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';

interface PropertiesPanelProps {
  selectedElements: any[];
  currentPage: number;
  totalPages: number;
  onPropertyChange: (property: string, value: any) => void;
  onDeleteElement: () => void;
  onLayerChange: (direction: 'front' | 'back' | 'forward' | 'backward') => void;
}

export function PropertiesPanel({
  selectedElements,
  currentPage,
  totalPages,
  onPropertyChange,
  onDeleteElement,
  onLayerChange,
}: PropertiesPanelProps) {
  const selectedElement = selectedElements[0]; // Single selection for now
  const hasSelection = selectedElements.length > 0;

  // Page Properties (when nothing selected)
  if (!hasSelection) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Page Properties</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Page Number</Label>
                <p className="text-lg font-medium">{currentPage} of {totalPages}</p>
              </div>

              <Separator />

              <div>
                <Label htmlFor="page-rotation">Page Rotation</Label>
                <Select defaultValue="0">
                  <SelectTrigger id="page-rotation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0°</SelectItem>
                    <SelectItem value="90">90°</SelectItem>
                    <SelectItem value="180">180°</SelectItem>
                    <SelectItem value="270">270°</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="page-size">Page Size</Label>
                <p className="text-sm text-muted-foreground mt-1">Letter (8.5" × 11")</p>
              </div>

              <Separator />

              <Button variant="outline" className="w-full">
                <Droplet className="w-4 h-4 mr-2" />
                Add Watermark
              </Button>

              <Button variant="outline" className="w-full">
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Text Element Properties
  if (selectedElement?.type === 'text') {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Text Properties</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDeleteElement}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Text Content */}
            <div>
              <Label htmlFor="text-content">Content</Label>
              <textarea
                id="text-content"
                className="w-full min-h-[80px] px-3 py-2 text-sm border rounded-md"
                value={selectedElement.content || ''}
                onChange={(e) => onPropertyChange('content', e.target.value)}
                placeholder="Enter text..."
              />
            </div>

            <Separator />

            {/* Font Family */}
            <div>
              <Label htmlFor="font-family">Font</Label>
              <Select 
                value={selectedElement.fontFamily || 'Arial'}
                onValueChange={(value) => onPropertyChange('fontFamily', value)}
              >
                <SelectTrigger id="font-family">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <Input
                id="font-size"
                type="number"
                value={selectedElement.fontSize || 14}
                onChange={(e) => onPropertyChange('fontSize', parseInt(e.target.value))}
                min={8}
                max={72}
              />
            </div>

            {/* Text Style */}
            <div>
              <Label>Text Style</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={selectedElement.bold ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('bold', !selectedElement.bold)}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedElement.italic ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('italic', !selectedElement.italic)}
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedElement.underline ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('underline', !selectedElement.underline)}
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <Label>Alignment</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={selectedElement.align === 'left' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('align', 'left')}
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedElement.align === 'center' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('align', 'center')}
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedElement.align === 'right' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('align', 'right')}
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Text Color */}
            <div>
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="text-color"
                  type="color"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => onPropertyChange('color', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => onPropertyChange('color', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bg-color"
                  type="color"
                  value={selectedElement.bgColor || '#FFFFFF'}
                  onChange={(e) => onPropertyChange('bgColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={selectedElement.bgColor || '#FFFFFF'}
                  onChange={(e) => onPropertyChange('bgColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Opacity */}
            <div>
              <Label htmlFor="opacity">Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%</Label>
              <Slider
                id="opacity"
                min={0}
                max={1}
                step={0.1}
                value={[selectedElement.opacity || 1]}
                onValueChange={([value]) => onPropertyChange('opacity', value)}
                className="mt-2"
              />
            </div>

            <Separator />

            {/* Layer Controls */}
            <div>
              <Label>Layer Order</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLayerChange('front')}
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  To Front
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLayerChange('back')}
                >
                  <ArrowDown className="w-4 h-4 mr-1" />
                  To Back
                </Button>
              </div>
            </div>

            {/* Lock Element */}
            <div className="flex items-center justify-between">
              <Label htmlFor="lock-element">Lock Element</Label>
              <Switch
                id="lock-element"
                checked={selectedElement.locked || false}
                onCheckedChange={(checked) => onPropertyChange('locked', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Shape Element Properties
  if (selectedElement?.type === 'shape') {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Shape Properties</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDeleteElement}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Shape Type</Label>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                {selectedElement.shapeType || 'Rectangle'}
              </p>
            </div>

            <Separator />

            {/* Fill Color */}
            <div>
              <Label htmlFor="fill-color">Fill Color</Label>
              <div className="flex gap-2">
                <Input
                  id="fill-color"
                  type="color"
                  value={selectedElement.fillColor || '#3B82F6'}
                  onChange={(e) => onPropertyChange('fillColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={selectedElement.fillColor || '#3B82F6'}
                  onChange={(e) => onPropertyChange('fillColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Stroke Color */}
            <div>
              <Label htmlFor="stroke-color">Stroke Color</Label>
              <div className="flex gap-2">
                <Input
                  id="stroke-color"
                  type="color"
                  value={selectedElement.strokeColor || '#000000'}
                  onChange={(e) => onPropertyChange('strokeColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={selectedElement.strokeColor || '#000000'}
                  onChange={(e) => onPropertyChange('strokeColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Stroke Width */}
            <div>
              <Label htmlFor="stroke-width">Stroke Width</Label>
              <Input
                id="stroke-width"
                type="number"
                value={selectedElement.strokeWidth || 2}
                onChange={(e) => onPropertyChange('strokeWidth', parseInt(e.target.value))}
                min={0}
                max={20}
              />
            </div>

            {/* Corner Radius (rectangles only) */}
            {selectedElement.shapeType === 'rectangle' && (
              <div>
                <Label htmlFor="corner-radius">Corner Radius</Label>
                <Input
                  id="corner-radius"
                  type="number"
                  value={selectedElement.cornerRadius || 0}
                  onChange={(e) => onPropertyChange('cornerRadius', parseInt(e.target.value))}
                  min={0}
                  max={50}
                />
              </div>
            )}

            {/* Opacity */}
            <div>
              <Label htmlFor="opacity">Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%</Label>
              <Slider
                id="opacity"
                min={0}
                max={1}
                step={0.1}
                value={[selectedElement.opacity || 1]}
                onValueChange={([value]) => onPropertyChange('opacity', value)}
                className="mt-2"
              />
            </div>

            <Separator />

            {/* Layer Controls */}
            <div>
              <Label>Layer Order</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLayerChange('front')}
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  To Front
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLayerChange('back')}
                >
                  <ArrowDown className="w-4 h-4 mr-1" />
                  To Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Image Element Properties
  if (selectedElement?.type === 'image') {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Image Properties</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDeleteElement}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              Replace Image
            </Button>

            <Separator />

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={selectedElement.width || 100}
                  onChange={(e) => onPropertyChange('width', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={selectedElement.height || 100}
                  onChange={(e) => onPropertyChange('height', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch id="lock-aspect" defaultChecked />
              <Label htmlFor="lock-aspect">Lock aspect ratio</Label>
            </div>

            {/* Border Radius */}
            <div>
              <Label htmlFor="border-radius">Border Radius</Label>
              <Input
                id="border-radius"
                type="number"
                value={selectedElement.borderRadius || 0}
                onChange={(e) => onPropertyChange('borderRadius', parseInt(e.target.value))}
                min={0}
                max={50}
              />
            </div>

            {/* Opacity */}
            <div>
              <Label htmlFor="opacity">Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%</Label>
              <Slider
                id="opacity"
                min={0}
                max={1}
                step={0.1}
                value={[selectedElement.opacity || 1]}
                onValueChange={([value]) => onPropertyChange('opacity', value)}
                className="mt-2"
              />
            </div>

            <Separator />

            {/* Layer Controls */}
            <div>
              <Label>Layer Order</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLayerChange('front')}
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  To Front
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLayerChange('back')}
                >
                  <ArrowDown className="w-4 h-4 mr-1" />
                  To Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6">
      <p className="text-sm text-muted-foreground">Select an element to edit its properties</p>
    </div>
  );
}

// Helper import at top
import { Droplet } from 'lucide-react';
