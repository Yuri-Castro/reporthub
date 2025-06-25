import React, { useState } from "react";
import { ReportElement } from "../types";

interface TextElementProps {
  element: ReportElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<ReportElement>) => void;
}

export const TextElement: React.FC<TextElementProps> = ({
  element,
  isSelected,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.content.text || "");

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(element.content.text || "");
  };

  const handleSave = () => {
    onUpdate({
      content: { ...element.content, text: editText },
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditText(element.content.text || "");
    }
  };

  return (
    <div
      className="w-full h-full border rounded flex items-center justify-center"
      style={{
        backgroundColor: element.style.backgroundColor,
        borderColor: element.style.borderColor,
        borderWidth: element.style.borderWidth,
        borderRadius: element.style.borderRadius,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full h-full resize-none border-none outline-none bg-transparent text-center flex items-center justify-center"
          style={{
            color: element.style.color,
            fontSize: element.content.fontSize || element.style.fontSize,
            fontWeight: element.content.fontWeight || element.style.fontWeight,
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
          autoFocus
          placeholder="Enter your text..."
        />
      ) : (
        <div
          className="w-full h-full overflow-hidden flex items-center justify-center text-center"
          style={{
            color: element.style.color,
            fontSize: element.content.fontSize || element.style.fontSize,
            fontWeight: element.content.fontWeight || element.style.fontWeight,
            whiteSpace: "pre-wrap",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {element.content.text || "Double-click to edit text"}
        </div>
      )}
    </div>
  );
};
