/**
 * WatermarkCanvas Component
 * 
 * Purpose: Interactive PDF canvas with live watermark preview
 * Features:
 * - Display single PDF page at a time
 * - Live watermark preview
 * - Draggable watermark positioning
 * - Zoom support
 * - Smooth scrolling between pages
 */

import { useState, useRef, useEffect } from "react";
import { cn } from "../ui/utils";

interface WatermarkSettings {
  type: "text" | "image" | "pattern";
  // Text settings
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  color?: string;
  // Image settings
  imageUrl?: string;
  imageSize?: number;
  // Common settings
  opacity: number;
  rotation: number;
  x: number;
  y: number;
  // Pattern settings
  repeatMode?: "diagonal" | "grid" | "horizontal" | "vertical" | "none";
  spacing?: number;
}

interface WatermarkCanvasProps {
  pageNumber: number;
  totalPages: number;
  zoomLevel: number;
  watermarkSettings: WatermarkSettings;
  onWatermarkPositionChange: (x: number, y: number) => void;
  canvasRef?: React.RefObject<HTMLDivElement>;
}

export function WatermarkCanvas({
  pageNumber,
  totalPages,
  zoomLevel,
  watermarkSettings,
  onWatermarkPositionChange,
  canvasRef,
}: WatermarkCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (watermarkSettings.repeatMode === "none" || !watermarkSettings.repeatMode) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !pageRef.current) return;

    const rect = pageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onWatermarkPositionChange(
      Math.max(0, Math.min(100, x)),
      Math.max(0, Math.min(100, y))
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handleMouseUp);
      return () => document.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isDragging]);

  const renderWatermark = (offsetX = 0, offsetY = 0) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${watermarkSettings.x + offsetX}%`,
      top: `${watermarkSettings.y + offsetY}%`,
      transform: `translate(-50%, -50%) rotate(${watermarkSettings.rotation}deg)`,
      opacity: watermarkSettings.opacity / 100,
      cursor: isDragging ? "grabbing" : "grab",
      userSelect: "none",
    };

    if (watermarkSettings.type === "text") {
      return (
        <div
          key={`${offsetX}-${offsetY}`}
          style={{
            ...style,
            color: watermarkSettings.color || "#000000",
            fontSize: `${watermarkSettings.fontSize || 24}px`,
            fontFamily: watermarkSettings.fontFamily || "Arial",
            fontWeight: watermarkSettings.fontWeight || "normal",
            whiteSpace: "nowrap",
          }}
          onMouseDown={handleMouseDown}
        >
          {watermarkSettings.text || "WATERMARK"}
        </div>
      );
    } else if (watermarkSettings.type === "image" && watermarkSettings.imageUrl) {
      return (
        <img
          key={`${offsetX}-${offsetY}`}
          src={watermarkSettings.imageUrl}
          alt="Watermark"
          style={{
            ...style,
            width: `${watermarkSettings.imageSize || 100}px`,
            height: "auto",
          }}
          onMouseDown={handleMouseDown}
        />
      );
    }
    return null;
  };

  const renderPatternWatermarks = () => {
    if (!watermarkSettings.repeatMode || watermarkSettings.repeatMode === "none") {
      return renderWatermark();
    }

    const spacing = watermarkSettings.spacing || 30;
    const watermarks = [];

    switch (watermarkSettings.repeatMode) {
      case "diagonal":
        for (let i = -100; i <= 200; i += spacing) {
          for (let j = -100; j <= 200; j += spacing) {
            watermarks.push(renderWatermark(i, j));
          }
        }
        break;
      case "grid":
        for (let i = 0; i <= 100; i += spacing) {
          for (let j = 0; j <= 100; j += spacing) {
            watermarks.push(renderWatermark(i - 50, j - 50));
          }
        }
        break;
      case "horizontal":
        for (let i = 0; i <= 100; i += spacing) {
          watermarks.push(renderWatermark(i - 50, 0));
        }
        break;
      case "vertical":
        for (let j = 0; j <= 100; j += spacing) {
          watermarks.push(renderWatermark(0, j - 50));
        }
        break;
      default:
        return renderWatermark();
    }

    return watermarks;
  };

  return (
    <div className="p-6 flex flex-col items-center" style={{ minHeight: '100%' }}>
      {/* Single page display */}
      <div
        ref={pageRef}
        className={cn(
          "relative bg-white shadow-lg rounded-lg overflow-hidden mb-6",
          isDragging && "cursor-grabbing"
        )}
        style={{
          width: `${Math.min(100, zoomLevel)}%`,
          aspectRatio: "8.5 / 11",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* PDF Page Preview */}
        <div className="absolute inset-0 bg-white border border-gray-200">
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-sm font-medium">Page {pageNumber}</div>
              <div className="text-xs">PDF Preview</div>
            </div>
          </div>
        </div>

        {/* Watermark Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full pointer-events-auto">
            {renderPatternWatermarks()}
          </div>
        </div>
      </div>
    </div>
  );
}