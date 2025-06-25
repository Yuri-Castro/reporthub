import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReportElement } from "./types";
import { TextElement } from "./elements/TextElement";
import { ChartElement } from "./elements/ChartElement";
import { TableElement } from "./elements/TableElement";
import { DividerElement } from "./elements/DividerElement";
import { ImageElement } from "./elements/ImageElement";
import { QuoteElement } from "./elements/QuoteElement";
import { EmojiElement } from "./elements/EmojiElement";

interface PreviewModalProps {
  elements: ReportElement[];
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  elements,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for charts to render, then hide loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400); // 400ms delay to allow charts/labels to render
    return () => clearTimeout(timeout);
  }, []);

  const renderElement = (element: ReportElement) => {
    const commonProps = {
      element: {
        ...element,
        style: {
          ...element.style,
          backgroundColor: "transparent", // Make background transparent in preview
          borderWidth: 0, // Hide border in preview
          borderColor: "transparent", // Hide border in preview
        },
      },
      isSelected: false,
      onUpdate: () => {}, // Preview mode - no updates
    };

    switch (element.type) {
      case "text":
        return <TextElement {...commonProps} />;
      case "chart":
        return <ChartElement {...commonProps} previewMode={true} />;
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Report Preview</DialogTitle>
        </DialogHeader>

        <div
          className="flex-1 flex justify-center items-start bg-gray-100 overflow-auto p-6"
          style={{ minHeight: 400 }}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mr-4" />
              <span className="text-lg text-gray-600">Loading preview…</span>
            </div>
          ) : (
            <div
              className="relative shadow-lg my-8"
              style={{
                width: "794px",
                minHeight: "1123px",
                background: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
                backgroundColor: "#fff",
              }}
            >
              {elements.map((element) => (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: element.position.x,
                    top: element.position.y,
                    width: element.size.width,
                    height: element.size.height,
                  }}
                >
                  {renderElement(element)}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
