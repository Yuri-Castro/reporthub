import React from "react";
import { Button } from "@/components/ui/button";
import {
  Type,
  BarChart,
  Table,
  Minus,
  Image as ImageIcon,
  Quote,
  Smile,
} from "lucide-react";
import { ElementType } from "./types";

interface ToolbarProps {
  onAddElement: (type: ElementType) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onAddElement }) => {
  return (
    <div className="w-64 bg-gray-50 border-r p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Elements</h3>

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-12 border-dashed hover:bg-blue-50 hover:border-blue-300"
          onClick={() => onAddElement("text")}
        >
          <Type size={20} className="text-blue-600" />
          <div className="text-left">
            <div className="font-medium">Text Block</div>
            <div className="text-xs text-gray-500">Add formatted text</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-12 border-dashed hover:bg-green-50 hover:border-green-300"
          onClick={() => onAddElement("chart")}
        >
          <BarChart size={20} className="text-green-600" />
          <div className="text-left">
            <div className="font-medium">Chart</div>
            <div className="text-xs text-gray-500">Bar, line, or pie chart</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-12 border-dashed hover:bg-purple-50 hover:border-purple-300"
          onClick={() => onAddElement("table")}
        >
          <Table size={20} className="text-purple-600" />
          <div className="text-left">
            <div className="font-medium">Table</div>
            <div className="text-xs text-gray-500">Data table with rows</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-12 border-dashed hover:bg-gray-50 hover:border-gray-300"
          onClick={() => onAddElement("image")}
        >
          <ImageIcon size={20} className="text-yellow-600" />
          <div className="text-left">
            <div className="font-medium">Image</div>
            <div className="text-xs text-gray-500">Add an image block</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-12 border-dashed hover:bg-gray-50 hover:border-gray-300"
          onClick={() => onAddElement("quote")}
        >
          <Quote size={20} className="text-blue-400" />
          <div className="text-left">
            <div className="font-medium">Quote</div>
            <div className="text-xs text-gray-500">Add a quote block</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-12 border-dashed hover:bg-gray-50 hover:border-gray-300"
          onClick={() => onAddElement("emoji")}
        >
          <Smile size={20} className="text-yellow-500" />
          <div className="text-left">
            <div className="font-medium">Emoji</div>
            <div className="text-xs text-gray-500">Add an emoji block</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-12 border-dashed hover:bg-gray-50 hover:border-gray-300"
          onClick={() => onAddElement("divider")}
        >
          <Minus size={20} className="text-gray-600" />
          <div className="text-left">
            <div className="font-medium">Divider</div>
            <div className="text-xs text-gray-500">Horizontal line</div>
          </div>
        </Button>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium mb-3 text-gray-700">Quick Tips</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Drag elements to reposition</p>
          <p>• Click to select and edit</p>
          <p>• Use the properties panel to customize</p>
          <p>• Preview before exporting</p>
        </div>
      </div>
    </div>
  );
};
