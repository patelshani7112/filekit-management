/**
 * PDF Editor Component
 * 
 * Main editor with new layout:
 * - Top: Horizontal editing toolbar with all tools
 * - Left: Vertical page thumbnails sidebar
 * - Center-Right: Main canvas (full width, no properties panel)
 */

import { useState, useCallback, useEffect } from 'react';
import { TopEditingToolbar } from './TopEditingToolbar';
import { VerticalPageThumbnails } from './VerticalPageThumbnails';
import { PdfEditorCanvas } from './PdfEditorCanvas';

interface PdfEditorProps {
  fileName: string;
  totalPages: number;
  onSave: () => void;
  onExit: () => void;
}

interface EditorElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'highlight' | 'draw' | 'sticky-note' | 'signature' | 'form-field';
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  locked?: boolean;
  
  // Text properties
  content?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bgColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  
  // Shape properties
  shapeType?: 'rectangle' | 'ellipse' | 'line' | 'arrow';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  cornerRadius?: number;
  
  // Image properties
  src?: string;
  borderRadius?: number;
  
  // Common properties
  opacity?: number;
  zIndex?: number;
}

export function PdfEditor({ fileName, totalPages, onSave, onExit }: PdfEditorProps) {
  const [activeTool, setActiveTool] = useState('select');
  const [currentPage, setCurrentPage] = useState(1);
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [history, setHistory] = useState<EditorElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [zoom, setZoom] = useState(100);

  // Zoom handlers
  const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev + 10, 200)), []);
  const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev - 10, 50)), []);
  const handleFitToWidth = useCallback(() => setZoom(100), []);
  const handleFitToPage = useCallback(() => setZoom(90), []);

  // Save current state to history
  const saveToHistory = useCallback((newElements: EditorElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  }, [historyIndex, history]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  }, [historyIndex, history]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
      if (e.key === 'Delete' && selectedElements.length > 0) {
        e.preventDefault();
        handleDeleteElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedElements]);

  // Tool change
  const handleToolChange = useCallback((tool: string) => {
    setActiveTool(tool);
    setSelectedElements([]);
  }, []);

  // Canvas click - create element based on active tool
  const handleCanvasClick = useCallback((x: number, y: number) => {
    if (activeTool === 'select' || activeTool === 'hand') {
      setSelectedElements([]);
      return;
    }

    const newElement: EditorElement = {
      id: `element-${Date.now()}-${Math.random()}`,
      type: 'text',
      page: currentPage,
      x,
      y,
      width: 200,
      height: 50,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length,
    };

    // Configure based on tool
    if (activeTool === 'text') {
      newElement.type = 'text';
      newElement.content = 'Type here...';
      newElement.fontSize = 14;
      newElement.fontFamily = 'Arial';
      newElement.color = '#000000';
      newElement.align = 'left';
    } else if (activeTool === 'rectangle') {
      newElement.type = 'shape';
      newElement.shapeType = 'rectangle';
      newElement.fillColor = '#3B82F6';
      newElement.strokeColor = '#000000';
      newElement.strokeWidth = 2;
      newElement.width = 150;
      newElement.height = 100;
    } else if (activeTool === 'ellipse') {
      newElement.type = 'shape';
      newElement.shapeType = 'ellipse';
      newElement.fillColor = '#10B981';
      newElement.strokeColor = '#000000';
      newElement.strokeWidth = 2;
      newElement.width = 150;
      newElement.height = 100;
    } else if (activeTool === 'line') {
      newElement.type = 'shape';
      newElement.shapeType = 'line';
      newElement.fillColor = 'transparent';
      newElement.strokeColor = '#000000';
      newElement.strokeWidth = 2;
      newElement.width = 150;
      newElement.height = 2;
    } else if (activeTool === 'arrow') {
      newElement.type = 'shape';
      newElement.shapeType = 'arrow';
      newElement.fillColor = 'transparent';
      newElement.strokeColor = '#000000';
      newElement.strokeWidth = 2;
      newElement.width = 150;
      newElement.height = 2;
    } else if (activeTool === 'highlight') {
      newElement.type = 'highlight';
      newElement.color = '#FFFF00';
      newElement.opacity = 0.3;
      newElement.width = 150;
      newElement.height = 20;
    } else if (activeTool === 'sticky-note') {
      newElement.type = 'sticky-note';
      newElement.content = 'Add note...';
      newElement.bgColor = '#FEF08A';
      newElement.width = 150;
      newElement.height = 150;
    } else if (activeTool === 'draw') {
      newElement.type = 'draw';
      newElement.strokeColor = '#000000';
      newElement.strokeWidth = 2;
      newElement.width = 100;
      newElement.height = 100;
    }

    const updatedElements = [...elements, newElement];
    setElements(updatedElements);
    setSelectedElements([newElement.id]);
    saveToHistory(updatedElements);

    // Auto-switch to select tool after adding element (except for draw tool)
    if (activeTool !== 'draw') {
      setActiveTool('select');
    }
  }, [activeTool, currentPage, elements, saveToHistory]);

  // Element click - select element
  const handleElementClick = useCallback((id: string, event: React.MouseEvent) => {
    if (activeTool !== 'select') return;
    
    if (event.shiftKey) {
      // Multi-select
      setSelectedElements(prev => 
        prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
      );
    } else {
      setSelectedElements([id]);
    }
  }, [activeTool]);

  // Delete element
  const handleDeleteElement = useCallback(() => {
    const updatedElements = elements.filter(el => !selectedElements.includes(el.id));
    setElements(updatedElements);
    setSelectedElements([]);
    saveToHistory(updatedElements);
  }, [elements, selectedElements, saveToHistory]);

  // Property change
  const handlePropertyChange = useCallback((property: string, value: any) => {
    const updatedElements = elements.map(el => {
      if (selectedElements.includes(el.id)) {
        return { ...el, [property]: value };
      }
      return el;
    });
    setElements(updatedElements);
    saveToHistory(updatedElements);
  }, [elements, selectedElements, saveToHistory]);

  // Layer change
  const handleLayerChange = useCallback((direction: 'front' | 'back' | 'forward' | 'backward') => {
    const updatedElements = [...elements];
    
    selectedElements.forEach(id => {
      const index = updatedElements.findIndex(el => el.id === id);
      if (index === -1) return;
      
      const [element] = updatedElements.splice(index, 1);
      
      if (direction === 'front') {
        updatedElements.push(element);
      } else if (direction === 'back') {
        updatedElements.unshift(element);
      }
    });
    
    setElements(updatedElements);
    saveToHistory(updatedElements);
  }, [elements, selectedElements, saveToHistory]);

  // Page management
  const handlePageSelect = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedElements([]);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedElements([]);
    }
  }, [totalPages]);

  const handlePageDuplicate = useCallback((page: number) => {
    const pageElements = elements.filter(el => el.page === page);
    const newPageElements = pageElements.map(el => ({
      ...el,
      id: `element-${Date.now()}-${Math.random()}`,
      page: totalPages + 1,
    }));
    
    const updatedElements = [...elements, ...newPageElements];
    setElements(updatedElements);
    saveToHistory(updatedElements);
  }, [elements, totalPages, saveToHistory]);

  const handlePageDelete = useCallback((page: number) => {
    if (totalPages === 1) return;
    
    const updatedElements = elements.filter(el => el.page !== page);
    setElements(updatedElements);
    saveToHistory(updatedElements);
    
    if (currentPage === page) {
      setCurrentPage(Math.max(1, page - 1));
    }
  }, [elements, totalPages, currentPage, saveToHistory]);

  const handlePageRotate = useCallback((page: number, direction: 'left' | 'right') => {
    console.log(`Rotate page ${page} ${direction}`);
  }, []);

  // Element drag/resize (simplified)
  const handleElementDrag = useCallback((id: string, x: number, y: number) => {
    const updatedElements = elements.map(el => 
      el.id === id ? { ...el, x, y } : el
    );
    setElements(updatedElements);
  }, [elements]);

  const handleElementResize = useCallback((id: string, width: number, height: number) => {
    const updatedElements = elements.map(el => 
      el.id === id ? { ...el, width, height } : el
    );
    setElements(updatedElements);
  }, [elements]);

  const selectedElementObjects = elements.filter(el => selectedElements.includes(el.id));

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-50">
      {/* Top Horizontal Toolbar */}
      <TopEditingToolbar
        activeTool={activeTool}
        currentPage={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        fileName={fileName}
        onToolChange={handleToolChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToWidth={handleFitToWidth}
        onFitToPage={handleFitToPage}
        onPageChange={handlePageChange}
        onSave={onSave}
        onExit={onExit}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Vertical Page Thumbnails */}
        <VerticalPageThumbnails
          totalPages={totalPages}
          currentPage={currentPage}
          onPageSelect={handlePageSelect}
          onPageDuplicate={handlePageDuplicate}
          onPageDelete={handlePageDelete}
          onPageRotate={handlePageRotate}
        />

        {/* Center-Right: Main Canvas */}
        <PdfEditorCanvas
          currentPage={currentPage}
          totalPages={totalPages}
          activeTool={activeTool}
          selectedElements={selectedElements}
          elements={elements}
          zoom={zoom}
          onElementClick={handleElementClick}
          onCanvasClick={handleCanvasClick}
          onElementDrag={handleElementDrag}
          onElementResize={handleElementResize}
        />
      </div>
    </div>
  );
}