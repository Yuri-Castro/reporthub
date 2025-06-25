import React from "react";
import { ReportElement } from "../types";

interface EmojiElementProps {
  element: ReportElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<ReportElement>) => void;
}

export const EmojiElement: React.FC<EmojiElementProps> = ({ element }) => {
  const { emoji = "😀", size = 48, scale = 1 } = element.content || {};

  // Calculate emoji size based on container size and content size
  const containerWidth = element.size?.width || 100;
  const containerHeight = element.size?.height || 100;
  const baseSize = size || 48;
  const scaleFactor = scale || 1;

  // Scale emoji to fit within the container while maintaining aspect ratio
  const maxScale = Math.min(
    containerWidth / baseSize,
    containerHeight / baseSize,
    1
  );
  const finalScale = Math.min(maxScale * scaleFactor, 1);
  const emojiSize = Math.max(baseSize * finalScale, 16); // Minimum size of 16px

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <span style={{ fontSize: emojiSize, lineHeight: 1 }}>{emoji}</span>
    </div>
  );
};
