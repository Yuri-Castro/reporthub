import React from "react";
import { ReportElement } from "../types";

interface DividerElementProps {
  element: ReportElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<ReportElement>) => void;
}

export const DividerElement: React.FC<DividerElementProps> = ({ element }) => {
  const { style = {} } = element;
  return (
    <hr
      style={{
        border: "none",
        borderTop: `${style.thickness || 2}px ${style.lineStyle || "solid"} ${
          style.color || "#e5e7eb"
        }`,
        margin: `${style.marginVertical || 8}px 0`,
        width: "100%",
      }}
    />
  );
};
