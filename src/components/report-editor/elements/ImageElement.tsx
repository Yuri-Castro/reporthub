import React from "react";
import { ReportElement } from "../types";

interface ImageElementProps {
  element: ReportElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<ReportElement>) => void;
}

export const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const { src = "", alt = "" } = element.content || {};
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
            pointerEvents: "none",
          }}
        />
      ) : (
        <span className="text-gray-400 text-xs">No image selected</span>
      )}
    </div>
  );
};
