import React, { useState, useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface ResizablePanelProps {
  children: React.ReactNode;
  width: number;
  onWidthChange: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  width,
  onWidthChange,
  minWidth = 870,
  maxWidth = 1200,
  className = "",
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = startXRef.current - e.clientX;
    const newWidth = Math.max(
      minWidth,
      Math.min(maxWidth, startWidthRef.current + deltaX)
    );
    onWidthChange(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      className={`relative flex ${className}`}
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex items-center justify-center group z-10"
        onMouseDown={handleMouseDown}
      >
        <div className="w-0.5 h-8 bg-gray-400 group-hover:bg-gray-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};
