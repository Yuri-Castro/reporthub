import React, { useEffect } from "react";
import { ReportElement } from "../types";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface ChartElementProps {
  element: ReportElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<ReportElement>) => void;
  previewMode?: boolean;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export const ChartElement: React.FC<ChartElementProps> = ({
  element,
  previewMode,
}) => {
  const { chartType = "bar", data = [] } = element.content;

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              isAnimationActive={!previewMode}
            />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
              labelLine={true}
              label={({ name, value }) => `${name}: ${value}`}
              isAnimationActive={!previewMode}
            >
              {data.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      default: // bar
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#3b82f6"
              isAnimationActive={!previewMode}
            />
          </BarChart>
        );
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
    >
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
