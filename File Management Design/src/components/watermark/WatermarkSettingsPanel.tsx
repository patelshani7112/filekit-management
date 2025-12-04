/**
 * WatermarkSettingsPanel Component
 * 
 * Purpose: Right panel with all watermark settings
 * Features:
 * - Tab selection (Text / Image / Pattern)
 * - Text watermark options (font, size, color, opacity, position, etc.)
 * - Image watermark options (upload, scale, opacity, blend mode, etc.)
 * - Pattern mode (repeat options, spacing, etc.)
 * - Apply options (current page, all pages, page range)
 */

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Type, Image as ImageIcon, Grid3x3, Droplets, Upload, GripVertical, FileText, X, ChevronDown, ChevronUp, FilePlus } from "lucide-react";
import { cn } from "../ui/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  pageCount: number;
}

interface WatermarkSettings {
  type: "text" | "image" | "pattern";
  // Text settings
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  color: string;
  letterSpacing: number;
  lineHeight: number;
  textShadow: boolean;
  // Image settings
  imageUrl: string;
  imageSize: number;
  keepAspectRatio: boolean;
  blendMode: string;
  // Common settings
  opacity: number;
  rotation: number;
  alignment: string;
  xOffset: number;
  yOffset: number;
  // Pattern settings
  repeatMode: "none" | "diagonal" | "grid" | "horizontal" | "vertical";
  spacing: number;
  patternAngle: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  // Apply settings
  applyTo: "current" | "all" | "range";
  pageRange: string;
}

interface WatermarkSettingsPanelProps {
  settings: WatermarkSettings;
  onSettingsChange: (settings: Partial<WatermarkSettings>) => void;
  onApplyWatermark: () => void;
  uploadedFiles?: UploadedFile[];
  onAddFiles?: () => void;
  onRemoveFile?: (fileId: string) => void;
}

export function WatermarkSettingsPanel({
  settings,
  onSettingsChange,
  onApplyWatermark,
  uploadedFiles,
  onAddFiles,
  onRemoveFile,
}: WatermarkSettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFilesExpanded, setIsFilesExpanded] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onSettingsChange({ imageUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const alignmentOptions = [
    { value: "center", label: "Center" },
    { value: "top-left", label: "Top Left" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-right", label: "Bottom Right" },
  ];

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Source Files Section - Only show if files are uploaded */}
      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Header with Add Files button and toggle */}
          <div className="flex items-center justify-between p-2 md:p-4 bg-gray-50 border-b border-gray-200">
            <button
              onClick={() => setIsFilesExpanded(!isFilesExpanded)}
              className="flex items-center gap-1.5 md:gap-2 flex-1 text-left hover:text-purple-600 transition-colors"
            >
              <h3 className="font-semibold text-sm md:text-base">Source Files</h3>
              {isFilesExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
              )}
            </button>
            {onAddFiles && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddFiles}
                className="gap-1 md:gap-1.5 text-xs h-7 md:h-8 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-500 hover:text-white transition-colors"
              >
                <FilePlus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="hidden sm:inline">Add Files</span>
              </Button>
            )}
          </div>

          {/* File List - Collapsible */}
          {isFilesExpanded && (
            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
              <div className="p-2 space-y-2">
                {uploadedFiles.map((file) => {
                  // Truncate filename if too long
                  const maxLength = 25;
                  const truncatedName = file.name.length > maxLength
                    ? file.name.substring(0, maxLength) + "..."
                    : file.name;

                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-colors group"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 cursor-move" />
                      <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-700 truncate block" title={file.name}>
                          {truncatedName}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 flex-shrink-0">
                        ({file.pageCount})
                      </span>
                      {onRemoveFile && (
                        <button
                          onClick={() => onRemoveFile(file.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <h3 className="font-semibold">Watermark Settings</h3>

      {/* Watermark Type Tabs */}
      <Tabs
        value={settings.type}
        onValueChange={(value) => onSettingsChange({ type: value as "text" | "image" | "pattern" })}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text" className="gap-1 text-xs">
            <Type className="w-3 h-3" />
            Text
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-1 text-xs">
            <ImageIcon className="w-3 h-3" />
            Image
          </TabsTrigger>
          <TabsTrigger value="pattern" className="gap-1 text-xs">
            <Grid3x3 className="w-3 h-3" />
            Pattern
          </TabsTrigger>
        </TabsList>

        {/* TEXT WATERMARK OPTIONS */}
        <TabsContent value="text" className="space-y-6 mt-6">
          {/* Text Settings */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 block">
                Text Settings
              </Label>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="watermark-text">Watermark Text</Label>
                  <Input
                    id="watermark-text"
                    value={settings.text}
                    onChange={(e) => onSettingsChange({ text: e.target.value })}
                    placeholder="Enter watermark text"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select
                      value={settings.fontFamily}
                      onValueChange={(value) => onSettingsChange({ fontFamily: value })}
                    >
                      <SelectTrigger id="font-family" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="font-weight">Font Weight</Label>
                    <Select
                      value={settings.fontWeight}
                      onValueChange={(value) => onSettingsChange({ fontWeight: value as "normal" | "bold" })}
                    >
                      <SelectTrigger id="font-weight" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="font-size">Font Size: {settings.fontSize}px</Label>
                  <Slider
                    id="font-size"
                    value={[settings.fontSize]}
                    onValueChange={(value) => onSettingsChange({ fontSize: value[0] })}
                    min={12}
                    max={72}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="text-color"
                        type="color"
                        value={settings.color}
                        onChange={(e) => onSettingsChange({ color: e.target.value })}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={settings.color}
                        onChange={(e) => onSettingsChange({ color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="opacity">Opacity: {settings.opacity}%</Label>
                    <Slider
                      id="opacity"
                      value={[settings.opacity]}
                      onValueChange={(value) => onSettingsChange({ opacity: value[0] })}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="letter-spacing">Letter Spacing: {settings.letterSpacing}px</Label>
                    <Slider
                      id="letter-spacing"
                      value={[settings.letterSpacing]}
                      onValueChange={(value) => onSettingsChange({ letterSpacing: value[0] })}
                      min={0}
                      max={10}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="line-height">Line Height: {settings.lineHeight}</Label>
                    <Slider
                      id="line-height"
                      value={[settings.lineHeight]}
                      onValueChange={(value) => onSettingsChange({ lineHeight: value[0] })}
                      min={1}
                      max={3}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="text-shadow">Text Shadow</Label>
                  <Switch
                    id="text-shadow"
                    checked={settings.textShadow}
                    onCheckedChange={(checked) => onSettingsChange({ textShadow: checked })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Position & Angle */}
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block">
              Position & Angle
            </Label>

            <div>
              <Label htmlFor="rotation">Rotation: {settings.rotation}°</Label>
              <Slider
                id="rotation"
                value={[settings.rotation]}
                onValueChange={(value) => onSettingsChange({ rotation: value[0] })}
                min={0}
                max={360}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="alignment">Alignment</Label>
              <Select
                value={settings.alignment}
                onValueChange={(value) => onSettingsChange({ alignment: value })}
              >
                <SelectTrigger id="alignment" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {alignmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="x-offset">X Offset: {settings.xOffset}%</Label>
                <Slider
                  id="x-offset"
                  value={[settings.xOffset]}
                  onValueChange={(value) => onSettingsChange({ xOffset: value[0] })}
                  min={-50}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="y-offset">Y Offset: {settings.yOffset}%</Label>
                <Slider
                  id="y-offset"
                  value={[settings.yOffset]}
                  onValueChange={(value) => onSettingsChange({ yOffset: value[0] })}
                  min={-50}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* IMAGE WATERMARK OPTIONS */}
        <TabsContent value="image" className="space-y-6 mt-6">
          {/* Upload Image */}
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block">
              Upload Image
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Watermark Image
            </Button>

            {settings.imageUrl && (
              <div className="border-2 border-gray-200 rounded-lg p-3">
                <img
                  src={settings.imageUrl}
                  alt="Watermark preview"
                  className="w-full h-auto max-h-32 object-contain"
                />
              </div>
            )}
          </div>

          {/* Image Settings */}
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block">
              Image Settings
            </Label>

            <div>
              <Label htmlFor="image-opacity">Opacity: {settings.opacity}%</Label>
              <Slider
                id="image-opacity"
                value={[settings.opacity]}
                onValueChange={(value) => onSettingsChange({ opacity: value[0] })}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="image-size">Size (Scale): {settings.imageSize}%</Label>
              <Slider
                id="image-size"
                value={[settings.imageSize]}
                onValueChange={(value) => onSettingsChange({ imageSize: value[0] })}
                min={10}
                max={200}
                step={5}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="keep-aspect">Keep Aspect Ratio</Label>
              <Switch
                id="keep-aspect"
                checked={settings.keepAspectRatio}
                onCheckedChange={(checked) => onSettingsChange({ keepAspectRatio: checked })}
              />
            </div>

            <div>
              <Label htmlFor="blend-mode">Blend Mode</Label>
              <Select
                value={settings.blendMode}
                onValueChange={(value) => onSettingsChange({ blendMode: value })}
              >
                <SelectTrigger id="blend-mode" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="multiply">Multiply</SelectItem>
                  <SelectItem value="overlay">Overlay</SelectItem>
                  <SelectItem value="lighten">Lighten</SelectItem>
                  <SelectItem value="darken">Darken</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Position Settings */}
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block">
              Position Settings
            </Label>

            <div>
              <Label htmlFor="image-rotation">Rotation: {settings.rotation}°</Label>
              <Slider
                id="image-rotation"
                value={[settings.rotation]}
                onValueChange={(value) => onSettingsChange({ rotation: value[0] })}
                min={0}
                max={360}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="image-alignment">Alignment</Label>
              <Select
                value={settings.alignment}
                onValueChange={(value) => onSettingsChange({ alignment: value })}
              >
                <SelectTrigger id="image-alignment" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {alignmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="image-x-offset">X Offset: {settings.xOffset}%</Label>
                <Slider
                  id="image-x-offset"
                  value={[settings.xOffset]}
                  onValueChange={(value) => onSettingsChange({ xOffset: value[0] })}
                  min={-50}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="image-y-offset">Y Offset: {settings.yOffset}%</Label>
                <Slider
                  id="image-y-offset"
                  value={[settings.yOffset]}
                  onValueChange={(value) => onSettingsChange({ yOffset: value[0] })}
                  min={-50}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* PATTERN WATERMARK OPTIONS */}
        <TabsContent value="pattern" className="space-y-6 mt-6">
          {/* Pattern Layout */}
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block">
              Pattern Layout
            </Label>

            <div>
              <Label>Repeat Mode</Label>
              <RadioGroup
                value={settings.repeatMode}
                onValueChange={(value) => onSettingsChange({ repeatMode: value as any })}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="diagonal" id="diagonal" />
                  <Label htmlFor="diagonal" className="font-normal cursor-pointer">
                    Repeat Diagonally
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grid" id="grid" />
                  <Label htmlFor="grid" className="font-normal cursor-pointer">
                    Repeat Grid
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="horizontal" id="horizontal" />
                  <Label htmlFor="horizontal" className="font-normal cursor-pointer">
                    Repeat Horizontal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vertical" id="vertical" />
                  <Label htmlFor="vertical" className="font-normal cursor-pointer">
                    Repeat Vertical
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="font-normal cursor-pointer">
                    Single Watermark
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {settings.repeatMode !== "none" && (
              <>
                <div>
                  <Label htmlFor="spacing">Spacing Between: {settings.spacing}%</Label>
                  <Slider
                    id="spacing"
                    value={[settings.spacing]}
                    onValueChange={(value) => onSettingsChange({ spacing: value[0] })}
                    min={10}
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="pattern-angle">Pattern Angle: {settings.patternAngle}°</Label>
                  <Slider
                    id="pattern-angle"
                    value={[settings.patternAngle]}
                    onValueChange={(value) => onSettingsChange({ patternAngle: value[0] })}
                    min={0}
                    max={360}
                    step={15}
                    className="mt-2"
                  />
                </div>
              </>
            )}
          </div>

          {/* Style */}
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block">
              Style
            </Label>

            <div>
              <Label htmlFor="pattern-opacity">Opacity: {settings.opacity}%</Label>
              <Slider
                id="pattern-opacity"
                value={[settings.opacity]}
                onValueChange={(value) => onSettingsChange({ opacity: value[0] })}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="pattern-size">Text/Image Size: {settings.fontSize}px</Label>
              <Slider
                id="pattern-size"
                value={[settings.fontSize]}
                onValueChange={(value) => onSettingsChange({ fontSize: value[0] })}
                min={12}
                max={48}
                step={2}
                className="mt-2"
              />
            </div>

            {settings.type === "text" && (
              <div>
                <Label htmlFor="pattern-color">Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="pattern-color"
                    type="color"
                    value={settings.color}
                    onChange={(e) => onSettingsChange({ color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.color}
                    onChange={(e) => onSettingsChange({ color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Page Margins */}
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block">
              Page Margins
            </Label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="margin-top">Top: {settings.marginTop}px</Label>
                <Slider
                  id="margin-top"
                  value={[settings.marginTop]}
                  onValueChange={(value) => onSettingsChange({ marginTop: value[0] })}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="margin-bottom">Bottom: {settings.marginBottom}px</Label>
                <Slider
                  id="margin-bottom"
                  value={[settings.marginBottom]}
                  onValueChange={(value) => onSettingsChange({ marginBottom: value[0] })}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="margin-left">Left: {settings.marginLeft}px</Label>
                <Slider
                  id="margin-left"
                  value={[settings.marginLeft]}
                  onValueChange={(value) => onSettingsChange({ marginLeft: value[0] })}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="margin-right">Right: {settings.marginRight}px</Label>
                <Slider
                  id="margin-right"
                  value={[settings.marginRight]}
                  onValueChange={(value) => onSettingsChange({ marginRight: value[0] })}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Apply Options - Common for all types */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block">
          Apply Options
        </Label>

        <RadioGroup
          value={settings.applyTo}
          onValueChange={(value) => onSettingsChange({ applyTo: value as any })}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="current" id="current" />
            <Label htmlFor="current" className="font-normal cursor-pointer">
              Current Page Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="font-normal cursor-pointer">
              All Pages
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="range" id="range" />
            <Label htmlFor="range" className="font-normal cursor-pointer">
              Page Range
            </Label>
          </div>
        </RadioGroup>

        {settings.applyTo === "range" && (
          <div>
            <Label htmlFor="page-range">Page Range (e.g., 1-5, 7, 9-12)</Label>
            <Input
              id="page-range"
              value={settings.pageRange}
              onChange={(e) => onSettingsChange({ pageRange: e.target.value })}
              placeholder="1-5, 7"
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Apply Button */}
      <Button
        onClick={onApplyWatermark}
        size="lg"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
      >
        <Droplets className="w-5 h-5 mr-2" />
        Apply Watermark & Download
      </Button>
    </div>
  );
}