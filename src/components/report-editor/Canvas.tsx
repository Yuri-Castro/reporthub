import React from "react";
import Draggable from "react-draggable";
import { ReportElement } from "./types";
import { TextElement } from "./elements/TextElement";
import { ChartElement } from "./elements/ChartElement";
import { TableElement } from "./elements/TableElement";
import { DividerElement } from "./elements/DividerElement";
import { ImageElement } from "./elements/ImageElement";
import { QuoteElement } from "./elements/QuoteElement";
import { EmojiElement } from "./elements/EmojiElement";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

// Type assertion to fix compatibility issues
const ResizableBoxComponent = ResizableBox as any;

interface CanvasProps {
  elements: ReportElement[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<ReportElement>) => void;
  onDeleteElement: (id: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
}) => {
  const handleDrag = (elementId: string, data: any) => {
    onUpdateElement(elementId, {
      position: { x: data.x, y: data.y },
    });
  };

  const handleResize = (
    elementId: string,
    size: { width: number; height: number }
  ) => {
    onUpdateElement(elementId, {
      size: size,
    });
  };

  const renderElement = (element: ReportElement) => {
    const commonProps = {
      element,
      isSelected: selectedElement === element.id,
      onUpdate: (updates: any) => onUpdateElement(element.id, updates),
    };

    switch (element.type) {
      case "text":
        return <TextElement {...commonProps} />;
      case "chart":
        return <ChartElement {...commonProps} />;
      case "table":
        return <TableElement {...commonProps} />;
      case "divider":
        return <DividerElement {...commonProps} />;
      case "image":
        return <ImageElement {...commonProps} />;
      case "quote":
        return <QuoteElement {...commonProps} />;
      case "emoji":
        return <EmojiElement {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex justify-center items-start bg-gray-100 overflow-auto">
      {/* A4 Paper Simulation */}
      <div
        className="relative shadow-lg my-8"
        style={{
          width: "794px",
          minHeight: "1123px",
          background: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          backgroundColor: "#fff",
        }}
        onClick={() => onSelectElement(null)}
      >
        {elements.map((element) => {
          // Divider-specific height logic
          let height = element.size.height;
          let minConstraints = [50, 30];
          let maxConstraints = [700, 1000];
          let resizeHandles =
            selectedElement === element.id
              ? ["se", "sw", "nw", "ne", "n", "s", "e", "w"]
              : [];

          if (element.type === "divider") {
            const thickness = element.style.thickness || 2;
            const marginVertical = element.style.marginVertical || 8;
            height = thickness + 2 * marginVertical;
            minConstraints = [50, height];
            maxConstraints = [700, height];
            resizeHandles = selectedElement === element.id ? ["e", "w"] : [];
          }

          return (
            <Draggable
              key={element.id}
              position={element.position}
              onDrag={(e, data) => handleDrag(element.id, data)}
              bounds="parent"
              handle=".drag-handle"
            >
              <div className="absolute" style={{ willChange: "transform" }}>
                <ResizableBoxComponent
                  width={element.size.width}
                  height={height}
                  onResize={(
                    e: any,
                    { size }: { size: { width: number; height: number } }
                  ) => handleResize(element.id, size)}
                  minConstraints={minConstraints}
                  maxConstraints={maxConstraints}
                  resizeHandles={resizeHandles}
                >
                  <div
                    className={`w-full h-full drag-handle cursor-move ${
                      selectedElement === element.id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectElement(element.id);
                    }}
                  >
                    {renderElement(element)}

                    {/* Delete Button for Selected Element */}
                    {selectedElement === element.id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement(element.id);
                        }}
                      >
                        <Trash2 size={12} />
                      </Button>
                    )}
                  </div>
                </ResizableBoxComponent>
              </div>
            </Draggable>
          );
        })}
      </div>
    </div>
  );
};
