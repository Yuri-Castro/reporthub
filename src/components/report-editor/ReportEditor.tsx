"use client";

import React, { useState } from "react";
import { Toolbar } from "./Toolbar";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { ResizablePanel } from "./ResizablePanel";
import { PreviewModal } from "./PreviewModal";
import { ElementType, ReportElement } from "./types";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { generatePDF } from "./elements/utils/pdfGenerator";
import { toast } from "sonner";

export const ReportEditor = () => {
  const [elements, setElements] = useState<ReportElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [propertiesPanelWidth, setPropertiesPanelWidth] = useState(320); // Default width

  const addElement = (type: ElementType) => {
    const newElement: ReportElement = {
      id: `element-${Date.now()}`,
      type,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 100 },
      content: getDefaultContent(type),
      style: getDefaultStyle(type),
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    toast.success(`${type} element added!`);
  };

  const updateElement = (id: string, updates: Partial<ReportElement>) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    toast.success("Element deleted!");
  };

  const handleExportPDF = async () => {
    try {
      await generatePDF(elements);
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error("PDF export error:", error);
    }
  };

  const getDefaultContent = (type: ElementType) => {
    switch (type) {
      case "text":
        return { text: "Your text here", fontSize: 16, fontWeight: "normal" };
      case "chart":
        return {
          chartType: "bar",
          data: [
            { name: "Jan", value: 400 },
            { name: "Feb", value: 300 },
            { name: "Mar", value: 600 },
            { name: "Apr", value: 800 },
          ],
        };
      case "table":
        return {
          headers: ["Column 1", "Column 2", "Column 3"],
          rows: [
            ["Data 1", "Data 2", "Data 3"],
            ["Data 4", "Data 5", "Data 6"],
          ],
        };
      case "divider":
        return {};
      case "image":
        return { src: "", alt: "", sourceType: "upload" };
      case "quote":
        return { text: "Your quote here...", author: "Author" };
      case "emoji":
        return { emoji: "😀", size: 48, scale: 1 };
      default:
        return {};
    }
  };

  const getDefaultStyle = (type: ElementType) => {
    const baseStyle = {
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      borderRadius: 4,
      padding: 16,
    };

    switch (type) {
      case "text":
        return { ...baseStyle, color: "#1f2937" };
      case "chart":
        return { ...baseStyle, backgroundColor: "#f9fafb" };
      case "table":
        return { ...baseStyle, backgroundColor: "#ffffff" };
      case "divider":
        return {
          thickness: 2,
          lineStyle: "solid",
          color: "#e5e7eb",
          marginVertical: 8,
          padding: 0,
        };
      case "image":
        return { ...baseStyle, padding: 0 };
      case "quote":
        return {
          ...baseStyle,
          backgroundColor: "#f8fafc",
          borderLeft: "4px solid #60a5fa",
          padding: 16,
        };
      case "emoji":
        return { ...baseStyle, padding: 0, backgroundColor: "transparent" };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">PDF Report Editor</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            Preview
          </Button>
          <Button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Download size={16} />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Toolbar */}
        <Toolbar onAddElement={addElement} />

        {/* Canvas Area */}
        <div className="flex-1 flex">
          <Canvas
            elements={elements}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
          />

          {/* Properties Panel */}
          <ResizablePanel
            width={propertiesPanelWidth}
            onWidthChange={(newWidth) => setPropertiesPanelWidth(newWidth)}
          >
            <PropertiesPanel
              selectedElement={
                selectedElement
                  ? elements.find((el) => el.id === selectedElement) || null
                  : null
              }
              onUpdateElement={updateElement}
            />
          </ResizablePanel>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          elements={elements}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};
