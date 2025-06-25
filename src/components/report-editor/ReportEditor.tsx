"use client";

import React, { useState, useEffect } from "react";
import { Toolbar } from "./Toolbar";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { ResizablePanel } from "./ResizablePanel";
import { PreviewModal } from "./PreviewModal";
import { ElementType, ReportElement } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Download, ArrowLeft, Save } from "lucide-react";
import { generatePDF } from "./elements/utils/pdfGenerator";
import { toast } from "sonner";
import Link from "next/link";
import { reportService, Report } from "@/lib/reportService";

interface ReportEditorProps {
  reportId?: string;
}

export const ReportEditor = ({ reportId }: ReportEditorProps) => {
  const [elements, setElements] = useState<ReportElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [propertiesPanelWidth, setPropertiesPanelWidth] = useState(320);
  const [reportName, setReportName] = useState("Untitled Report");
  const [reportDescription, setReportDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);

  // Load existing report if reportId is provided
  useEffect(() => {
    if (reportId) {
      loadReport(reportId);
    } else {
      // Initialize sample data for new reports
      reportService.initializeSampleData();
    }
  }, [reportId]);

  const loadReport = async (slug: string) => {
    setIsLoading(true);
    try {
      const report = await reportService.loadReport(slug);
      if (report) {
        setElements(report.elements);
        setReportName(report.name);
        setReportDescription(report.description || "");
        setCurrentReport(report);
      } else {
        toast.error("Report not found");
      }
    } catch (error) {
      toast.error("Failed to load report");
      console.error("Error loading report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!reportName.trim()) {
      toast.error("Please enter a report name");
      return;
    }

    setIsSaving(true);
    try {
      const reportData = {
        id: currentReport?.id,
        name: reportName.trim(),
        description: reportDescription.trim() || undefined,
        elements,
      };

      const savedReport = await reportService.saveReport(reportData);
      setCurrentReport(savedReport);
      toast.success("Report saved successfully!");
    } catch (error) {
      toast.error("Failed to save report");
      console.error("Error saving report:", error);
    } finally {
      setIsSaving(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div>
              <Input
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
                className="w-64 font-semibold text-lg border-none shadow-none focus-visible:ring-0"
              />
              <Input
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Enter report description (optional)"
                className="w-64 text-sm text-gray-500 border-none shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save"}
          </Button>
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
