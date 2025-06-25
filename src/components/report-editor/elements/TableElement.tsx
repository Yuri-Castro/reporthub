import React from "react";
import { ReportElement } from "../types";

interface TableElementProps {
  element: ReportElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<ReportElement>) => void;
}

export const TableElement: React.FC<TableElementProps> = ({ element }) => {
  const { headers = [], rows = [] } = element.content;

  return (
    <div
      className="w-full h-full border rounded overflow-auto"
      style={{
        backgroundColor: element.style.backgroundColor,
        borderColor: element.style.borderColor,
        borderWidth: element.style.borderWidth,
        borderRadius: element.style.borderRadius,
        padding: element.style.padding,
        background: "transparent",
      }}
    >
      <table className="w-full text-sm" style={{ background: "transparent" }}>
        <thead>
          <tr className="border-b" style={{ background: "transparent" }}>
            {headers.map((header: string, index: number) => (
              <th
                key={index}
                className="p-2 text-left font-medium text-gray-700"
                style={{ background: "transparent" }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: string[], rowIndex: number) => (
            <tr
              key={rowIndex}
              className="border-b"
              style={{ background: "transparent" }}
            >
              {row.map((cell: string, cellIndex: number) => (
                <td
                  key={cellIndex}
                  className="p-2 text-gray-600"
                  style={{ background: "transparent" }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
