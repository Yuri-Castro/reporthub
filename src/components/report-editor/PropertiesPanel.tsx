import React, { useState } from "react";
import { ReportElement } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, BarChart, LineChart, PieChart } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";

interface PropertiesPanelProps {
  selectedElement: ReportElement | null;
  onUpdateElement: (id: string, updates: Partial<ReportElement>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
}) => {
  const [newHeader, setNewHeader] = useState("");
  const [newRowData, setNewRowData] = useState<string[]>([]);

  if (!selectedElement) {
    return (
      <div className="w-full bg-gray-50 border-l p-4">
        <div className="text-center text-gray-500 mt-8">
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateStyle = (styleUpdates: any) => {
    onUpdateElement(selectedElement.id, {
      style: { ...selectedElement.style, ...styleUpdates },
    });
  };

  const updateContent = (contentUpdates: any) => {
    onUpdateElement(selectedElement.id, {
      content: { ...selectedElement.content, ...contentUpdates },
    });
  };

  const updateSize = (sizeUpdates: any) => {
    onUpdateElement(selectedElement.id, {
      size: { ...selectedElement.size, ...sizeUpdates },
    });
  };

  const addTableColumn = () => {
    if (!newHeader.trim()) return;

    const currentHeaders = selectedElement.content.headers || [];
    const currentRows = selectedElement.content.rows || [];

    const updatedHeaders = [...currentHeaders, newHeader.trim()];
    const updatedRows = currentRows.map((row: string[]) => [...row, ""]);

    updateContent({
      headers: updatedHeaders,
      rows: updatedRows,
    });

    setNewHeader("");
  };

  const removeTableColumn = (columnIndex: number) => {
    const currentHeaders = selectedElement.content.headers || [];
    const currentRows = selectedElement.content.rows || [];

    const updatedHeaders = currentHeaders.filter(
      (_: string, index: number) => index !== columnIndex
    );
    const updatedRows = currentRows.map((row: string[]) =>
      row.filter((_: string, index: number) => index !== columnIndex)
    );

    updateContent({
      headers: updatedHeaders,
      rows: updatedRows,
    });
  };

  const updateTableHeader = (headerIndex: number, newValue: string) => {
    const currentHeaders = selectedElement.content.headers || [];
    const updatedHeaders = currentHeaders.map((header: string, index: number) =>
      index === headerIndex ? newValue : header
    );

    updateContent({ headers: updatedHeaders });
  };

  const addTableRow = () => {
    const currentHeaders = selectedElement.content.headers || [];
    const currentRows = selectedElement.content.rows || [];
    const newRow = new Array(currentHeaders.length).fill("");

    updateContent({
      rows: [...currentRows, newRow],
    });
  };

  const removeTableRow = (rowIndex: number) => {
    const currentRows = selectedElement.content.rows || [];
    const updatedRows = currentRows.filter(
      (_: string[], index: number) => index !== rowIndex
    );

    updateContent({ rows: updatedRows });
  };

  const updateTableCell = (
    rowIndex: number,
    cellIndex: number,
    newValue: string
  ) => {
    const currentRows = selectedElement.content.rows || [];
    const updatedRows = currentRows.map((row: string[], rIndex: number) =>
      rIndex === rowIndex
        ? row.map((cell: string, cIndex: number) =>
            cIndex === cellIndex ? newValue : cell
          )
        : row
    );

    updateContent({ rows: updatedRows });
  };

  return (
    <div className="w-full bg-gray-50 border-l p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Properties</h3>

      {/* Element Type */}
      <div className="mb-4 p-3 bg-white rounded border">
        <Label className="text-sm font-medium text-gray-700 capitalize">
          {selectedElement.type} Element
        </Label>
      </div>

      {/* Size Properties */}
      <div className="mb-4 p-3 bg-white rounded border">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Size
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-600">Width</Label>
            <Input
              type="number"
              value={selectedElement.size.width}
              onChange={(e) =>
                updateSize({ width: parseInt(e.target.value) || 0 })
              }
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Height</Label>
            <Input
              type="number"
              value={selectedElement.size.height}
              onChange={(e) =>
                updateSize({ height: parseInt(e.target.value) || 0 })
              }
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Style Properties */}
      <div className="mb-4 p-3 bg-white rounded border">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Style
        </Label>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Background Color</Label>
            <Input
              type="color"
              value={selectedElement.style.backgroundColor || "#ffffff"}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Border Color</Label>
            <Input
              type="color"
              value={selectedElement.style.borderColor || "#e5e7eb"}
              onChange={(e) => updateStyle({ borderColor: e.target.value })}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Border Radius</Label>
            <Input
              type="number"
              value={selectedElement.style.borderRadius || 0}
              onChange={(e) =>
                updateStyle({ borderRadius: parseInt(e.target.value) || 0 })
              }
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Type-specific Properties */}
      {selectedElement.type === "text" && (
        <div className="mb-4 p-3 bg-white rounded border">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Text Properties
          </Label>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">Font Size</Label>
              <Input
                type="number"
                value={selectedElement.content.fontSize || 16}
                onChange={(e) =>
                  updateContent({ fontSize: parseInt(e.target.value) || 16 })
                }
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Font Weight</Label>
              <Select
                value={selectedElement.content.fontWeight || "normal"}
                onValueChange={(value) => updateContent({ fontWeight: value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="lighter">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Text Color</Label>
              <Input
                type="color"
                value={selectedElement.style.color || "#1f2937"}
                onChange={(e) => updateStyle({ color: e.target.value })}
                className="h-8"
              />
            </div>
          </div>
        </div>
      )}

      {selectedElement.type === "chart" && (
        <div className="mb-4 p-3 bg-white rounded border">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Chart Properties
          </Label>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">Chart Type</Label>
              <Select
                value={selectedElement.content.chartType || "bar"}
                onValueChange={(value) => updateContent({ chartType: value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <span className="flex items-center gap-2">
                      <BarChart size={16} className="text-blue-600" />
                      Bar Chart
                    </span>
                  </SelectItem>
                  <SelectItem value="line">
                    <span className="flex items-center gap-2">
                      <LineChart size={16} className="text-green-600" />
                      Line Chart
                    </span>
                  </SelectItem>
                  <div className="my-1 border-t border-gray-200" />
                  <SelectItem value="pie">
                    <span className="flex items-center gap-2">
                      <PieChart size={16} className="text-orange-600" />
                      Pie Chart
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {selectedElement.type === "table" && (
        <div className="mb-4 p-3 bg-white rounded border">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Table Properties
          </Label>

          {/* Headers Management */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600 mb-2 block">
                Table Headers
              </Label>
              {(selectedElement.content.headers || []).map(
                (header: string, index: number) => (
                  <div key={index} className="flex gap-1 mb-2">
                    <Input
                      value={header}
                      onChange={(e) => updateTableHeader(index, e.target.value)}
                      className="text-sm flex-1"
                      placeholder="Header name"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeTableColumn(index)}
                      className="px-2"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )
              )}

              <div className="flex gap-1">
                <Input
                  value={newHeader}
                  onChange={(e) => setNewHeader(e.target.value)}
                  placeholder="New column name"
                  className="text-sm flex-1"
                />
                <Button size="sm" onClick={addTableColumn} className="px-2">
                  <Plus size={14} />
                </Button>
              </div>
            </div>

            {/* Rows Management */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs text-gray-600">Table Rows</Label>
                <Button
                  size="sm"
                  onClick={addTableRow}
                  className="px-2 py-1 text-xs"
                >
                  <Plus size={12} className="mr-1" />
                  Add Row
                </Button>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2">
                {(selectedElement.content.rows || []).map(
                  (row: string[], rowIndex: number) => (
                    <div
                      key={rowIndex}
                      className="border rounded p-2 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">
                          Row {rowIndex + 1}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTableRow(rowIndex)}
                          className="px-1 py-0 h-6"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {row.map((cell: string, cellIndex: number) => (
                          <Input
                            key={cellIndex}
                            value={cell}
                            onChange={(e) =>
                              updateTableCell(
                                rowIndex,
                                cellIndex,
                                e.target.value
                              )
                            }
                            placeholder={`${
                              selectedElement.content.headers?.[cellIndex] ||
                              `Column ${cellIndex + 1}`
                            }`}
                            className="text-xs"
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedElement.type === "divider" && (
        <div className="mb-4 p-3 bg-white rounded border">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Divider Properties
          </Label>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">Thickness</Label>
              <Input
                type="number"
                value={selectedElement.style.thickness || 2}
                onChange={(e) =>
                  updateStyle({ thickness: parseInt(e.target.value) || 1 })
                }
                className="text-sm"
                min={1}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Color</Label>
              <Input
                type="color"
                value={selectedElement.style.color || "#e5e7eb"}
                onChange={(e) => updateStyle({ color: e.target.value })}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Line Style</Label>
              <select
                value={selectedElement.style.lineStyle || "solid"}
                onChange={(e) => updateStyle({ lineStyle: e.target.value })}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Vertical Margin</Label>
              <Input
                type="number"
                value={selectedElement.style.marginVertical || 8}
                onChange={(e) =>
                  updateStyle({ marginVertical: parseInt(e.target.value) || 0 })
                }
                className="text-sm"
                min={0}
              />
            </div>
          </div>
        </div>
      )}

      {selectedElement.type === "image" && (
        <div className="mb-4 p-3 bg-white rounded border">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Image Properties
          </Label>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600 mb-1">Source Type</Label>
              <select
                value={selectedElement.content.sourceType || "upload"}
                onChange={(e) => updateContent({ sourceType: e.target.value })}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="upload">Upload</option>
                <option value="link">Link</option>
              </select>
            </div>
            {selectedElement.content.sourceType !== "link" ? (
              <div>
                <Label className="text-xs text-gray-600 mb-1">
                  Upload Image
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  className="block text-xs"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        updateContent({
                          src: ev.target?.result,
                          sourceType: "upload",
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            ) : (
              <div>
                <Label className="text-xs text-gray-600 mb-1">Image URL</Label>
                <input
                  type="text"
                  className="text-sm border rounded px-2 py-1 w-full"
                  value={selectedElement.content.src || ""}
                  onChange={(e) =>
                    updateContent({ src: e.target.value, sourceType: "link" })
                  }
                  placeholder="https://example.com/image.png"
                />
              </div>
            )}
            <div>
              <Label className="text-xs text-gray-600 mb-1">Alt Text</Label>
              <input
                type="text"
                className="text-sm border rounded px-2 py-1 w-full"
                value={selectedElement.content.alt || ""}
                onChange={(e) => updateContent({ alt: e.target.value })}
                placeholder="Describe the image"
              />
            </div>
          </div>
        </div>
      )}

      {selectedElement.type === "quote" && (
        <div className="mb-4 p-3 bg-white rounded border">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Quote Properties
          </Label>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">Quote Text</Label>
              <textarea
                className="text-sm border rounded px-2 py-1 w-full"
                value={selectedElement.content.text || ""}
                onChange={(e) => updateContent({ text: e.target.value })}
                placeholder="Enter the quote..."
                rows={3}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Author</Label>
              <input
                type="text"
                className="text-sm border rounded px-2 py-1 w-full"
                value={selectedElement.content.author || ""}
                onChange={(e) => updateContent({ author: e.target.value })}
                placeholder="Author name"
              />
            </div>
          </div>
        </div>
      )}

      {selectedElement.type === "emoji" && (
        <div className="mb-4 p-3 bg-white rounded border">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Emoji Properties
          </Label>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600 mb-2 block">Emoji</Label>
              <EmojiPicker
                value={selectedElement.content.emoji || ""}
                onChange={(emoji) => updateContent({ emoji })}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Base Size</Label>
              <Input
                type="number"
                className="text-sm border rounded px-2 py-1 w-20 text-center"
                value={selectedElement.content.size || 48}
                onChange={(e) =>
                  updateContent({ size: parseInt(e.target.value) || 24 })
                }
                min={16}
                max={200}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Scale Factor</Label>
              <Input
                type="number"
                className="text-sm border rounded px-2 py-1 w-20 text-center"
                value={selectedElement.content.scale || 1}
                onChange={(e) =>
                  updateContent({ scale: parseFloat(e.target.value) || 1 })
                }
                min={0.1}
                max={3}
                step={0.1}
              />
              <div className="text-xs text-gray-500 mt-1">
                Controls how emoji scales with container
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
