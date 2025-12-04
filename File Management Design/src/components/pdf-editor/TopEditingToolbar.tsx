/**
 * Top Horizontal Editing Toolbar
 * 
 * Full-width toolbar with all editing controls and tools
 */

import { 
  Undo2, Redo2, ZoomIn, ZoomOut, Maximize2, Hand, MousePointer2,
  Type, ImageIcon, Square, Circle, Minus, ArrowRight, Pen, Highlighter,
  MessageSquare, ChevronDown, Droplet, Shield, Crop, Download,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface TopEditingToolbarProps {
  activeTool: string;
  currentPage: number;
  totalPages: number;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  fileName: string;
  onToolChange: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToWidth: () => void;
  onFitToPage: () => void;
  onPageChange: (page: number) => void;
  onSave: () => void;
  onExit: () => void;
}

export function TopEditingToolbar({
  activeTool,
  currentPage,
  totalPages,
  zoom,
  canUndo,
  canRedo,
  fileName,
  onToolChange,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitToWidth,
  onFitToPage,
  onPageChange,
  onSave,
  onExit,
}: TopEditingToolbarProps) {
  const ToolButton = ({ 
    tool, 
    icon: Icon, 
    label 
  }: { 
    tool: string; 
    icon: any; 
    label: string;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={activeTool === tool ? 'default' : 'ghost'}
          size="sm"
          className={`h-9 w-9 p-0 hover:bg-gray-200 ${
            activeTool === tool 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' 
              : ''
          }`}
          onClick={() => onToolChange(tool)}
        >
          <Icon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="h-14 bg-gray-50 border-b-2 border-gray-300 px-4 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-100 hover:scrollbar-thumb-purple-600 shadow-sm">
        {/* Global Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-200"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Undo (Ctrl+Z)</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-200"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Redo (Ctrl+Y)</p></TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-300" />

        {/* Basic Tools */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <ToolButton tool="hand" icon={Hand} label="Hand Tool (Pan)" />
          <ToolButton tool="select" icon={MousePointer2} label="Select Tool" />
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-300" />

        {/* Editing Tools */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <ToolButton tool="text" icon={Type} label="Add Text" />
          <ToolButton tool="image" icon={ImageIcon} label="Add Image" />

          {/* Shapes Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={['rectangle', 'ellipse', 'line', 'arrow'].includes(activeTool) ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-9 px-2 gap-1 hover:bg-gray-200 ${
                      ['rectangle', 'ellipse', 'line', 'arrow'].includes(activeTool)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : ''
                    }`}
                  >
                    <Square className="w-4 h-4" />
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent><p>Shapes</p></TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onToolChange('rectangle')}>
                <Square className="w-4 h-4 mr-2" />
                Rectangle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToolChange('ellipse')}>
                <Circle className="w-4 h-4 mr-2" />
                Circle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToolChange('line')}>
                <Minus className="w-4 h-4 mr-2" />
                Line
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToolChange('arrow')}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Arrow
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ToolButton tool="draw" icon={Pen} label="Draw / Pen" />
          <ToolButton tool="highlight" icon={Highlighter} label="Highlighter" />
          <ToolButton tool="sticky-note" icon={MessageSquare} label="Sticky Note" />

          {/* Form Tools Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={['text-field', 'checkbox', 'radio', 'dropdown', 'date', 'signature'].includes(activeTool) ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-9 px-2 gap-1 text-xs hover:bg-gray-200 ${
                      ['text-field', 'checkbox', 'radio', 'dropdown', 'date', 'signature'].includes(activeTool)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : ''
                    }`}
                  >
                    Forms
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent><p>Form Fields</p></TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onToolChange('text-field')}>
                Text Field
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToolChange('checkbox')}>
                Checkbox
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToolChange('radio')}>
                Radio Button
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToolChange('dropdown')}>
                Dropdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToolChange('date')}>
                Date Field
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToolChange('signature')}>
                Signature Field
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ToolButton tool="watermark" icon={Droplet} label="Watermark" />
          <ToolButton tool="redact" icon={Shield} label="Redact" />
          <ToolButton tool="crop" icon={Crop} label="Crop Page" />
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-300" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-200"
                onClick={onZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Zoom Out</p></TooltipContent>
          </Tooltip>

          <span className="text-xs font-medium min-w-[50px] text-center bg-white border border-gray-300 rounded px-2 py-1">
            {zoom}%
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-200"
                onClick={onZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Zoom In</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2 text-xs hover:bg-gray-200"
                onClick={onFitToWidth}
              >
                Fit
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Fit to Width</p></TooltipContent>
          </Tooltip>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-w-[20px]" />

        {/* Page Navigation */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-gray-200"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-xs font-medium whitespace-nowrap">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-gray-200"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-300" />

        {/* Save & Exit */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={onSave}
            size="sm"
            className="h-9 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Done
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}