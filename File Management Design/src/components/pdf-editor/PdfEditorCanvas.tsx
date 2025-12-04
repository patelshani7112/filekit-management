/**
 * PDF Editor Canvas Component
 * 
 * Full-width canvas without properties panel
 * Shows one PDF page at a time, centered and scrollable
 */

import { useRef } from 'react';

interface PdfEditorCanvasProps {
  currentPage: number;
  totalPages: number;
  activeTool: string;
  selectedElements: string[];
  elements: any[];
  zoom: number;
  onElementClick: (id: string, event: React.MouseEvent) => void;
  onCanvasClick: (x: number, y: number) => void;
  onElementDrag: (id: string, x: number, y: number) => void;
  onElementResize: (id: string, width: number, height: number) => void;
}

export function PdfEditorCanvas({
  currentPage,
  totalPages,
  activeTool,
  selectedElements,
  elements,
  zoom,
  onElementClick,
  onCanvasClick,
  onElementDrag,
  onElementResize,
}: PdfEditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (zoom / 100);
      const y = (e.clientY - rect.top) / (zoom / 100);
      onCanvasClick(x, y);
    }
  };

  const hasElementsOnPage = elements.filter(el => el.page === currentPage).length > 0;

  // Calculate page dimensions based on zoom
  const pageWidth = (8.5 * 96 * zoom) / 100;
  const pageHeight = (11 * 96 * zoom) / 100;

  return (
    <div className="flex-1 flex flex-col bg-gray-100 relative overflow-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200 hover:scrollbar-thumb-purple-600">
      {/* Canvas Wrapper - Centers the page */}
      <div className="min-h-full flex items-center justify-center p-8">
        <div
          ref={canvasRef}
          className="bg-white shadow-2xl relative"
          style={{
            width: `${pageWidth}px`,
            height: `${pageHeight}px`,
            cursor: activeTool === 'hand' ? 'grab' : activeTool === 'select' ? 'default' : 'crosshair',
          }}
          onClick={handleCanvasClick}
        >
          {/* PDF Page Background */}
          <div className="absolute inset-0 bg-white">
            {/* Empty State */}
            {!hasElementsOnPage && activeTool === 'select' && (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <div className="text-center">
                  <p className="text-sm">Click anywhere or choose a tool to start editing</p>
                </div>
              </div>
            )}
            
            {!hasElementsOnPage && activeTool !== 'select' && activeTool !== 'hand' && (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <div className="text-center">
                  <p className="text-sm">Click inside the page area to place an element</p>
                </div>
              </div>
            )}
          </div>

          {/* Render Elements */}
          {elements
            .filter(el => el.page === currentPage)
            .map(element => (
              <div
                key={element.id}
                className={`absolute cursor-move border-2 transition-all ${
                  selectedElements.includes(element.id)
                    ? 'border-blue-500 shadow-lg'
                    : 'border-transparent hover:border-blue-300'
                }`}
                style={{
                  left: `${element.x * (zoom / 100)}px`,
                  top: `${element.y * (zoom / 100)}px`,
                  width: `${element.width * (zoom / 100)}px`,
                  height: `${element.height * (zoom / 100)}px`,
                  transform: `rotate(${element.rotation || 0}deg)`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onElementClick(element.id, e);
                }}
              >
                {/* Element Content */}
                {element.type === 'text' && (
                  <div
                    className="w-full h-full p-2 overflow-hidden"
                    style={{
                      fontSize: `${(element.fontSize || 14) * (zoom / 100)}px`,
                      fontFamily: element.fontFamily || 'Arial',
                      color: element.color || '#000000',
                      fontWeight: element.bold ? 'bold' : 'normal',
                      fontStyle: element.italic ? 'italic' : 'normal',
                      textDecoration: element.underline ? 'underline' : 'none',
                      textAlign: element.align || 'left',
                      backgroundColor: element.bgColor || 'transparent',
                      opacity: element.opacity || 1,
                    }}
                  >
                    {element.content || 'Type here...'}
                  </div>
                )}

                {element.type === 'shape' && (
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundColor: element.fillColor || 'transparent',
                      border: `${(element.strokeWidth || 2) * (zoom / 100)}px solid ${element.strokeColor || '#000000'}`,
                      borderRadius: element.shapeType === 'ellipse' ? '50%' : `${(element.cornerRadius || 0) * (zoom / 100)}px`,
                      opacity: element.opacity || 1,
                    }}
                  />
                )}

                {element.type === 'image' && (
                  <img
                    src={element.src}
                    alt="User uploaded"
                    className="w-full h-full object-contain"
                    style={{
                      opacity: element.opacity || 1,
                      borderRadius: `${(element.borderRadius || 0) * (zoom / 100)}px`,
                    }}
                  />
                )}

                {element.type === 'highlight' && (
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundColor: element.color || '#FFFF00',
                      opacity: element.opacity || 0.3,
                    }}
                  />
                )}

                {element.type === 'sticky-note' && (
                  <div
                    className="w-full h-full p-2 text-xs overflow-auto"
                    style={{
                      backgroundColor: element.bgColor || '#FEF08A',
                      opacity: element.opacity || 1,
                      fontSize: `${12 * (zoom / 100)}px`,
                    }}
                  >
                    {element.content || 'Add note...'}
                  </div>
                )}

                {/* Resize Handles (only when selected) */}
                {selectedElements.includes(element.id) && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize" />
                    
                    {/* Rotation Handle */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full cursor-grab" />
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
