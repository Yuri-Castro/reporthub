import React from "react";
import { ReportElement } from "../types";

interface QuoteElementProps {
  element: ReportElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<ReportElement>) => void;
}

export const QuoteElement: React.FC<QuoteElementProps> = ({ element }) => {
  const { text = "Your quote here...", author = "Author" } =
    element.content || {};
  return (
    <blockquote className="w-full h-full flex flex-col justify-center items-center px-4 py-2 bg-gray-50 border-l-4 border-blue-400 rounded">
      <span className="italic text-lg text-gray-700 text-center">“{text}”</span>
      <span className="mt-2 text-sm text-gray-500 self-end">— {author}</span>
    </blockquote>
  );
};
