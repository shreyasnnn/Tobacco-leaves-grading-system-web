import React from "react";

interface TooltipProps {
  visible: boolean;
  x: number;
  y: number;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ visible, x, y, content }) => {
  if (!visible) return null;

  const tooltipWidth = 150; // approx. width in px
  const offset = 6; // smaller offset so it's closer to cursor
  const screenWidth = window.innerWidth;

  // If cursor is too close to right edge, shift left instead
  const adjustedX =
    x + tooltipWidth + offset > screenWidth ? x - tooltipWidth - offset : x + offset;

  return (
    <div
      className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50"
      style={{
        top: y + offset,
        left: adjustedX,
        whiteSpace: "nowrap",
      }}
    >
      {content}
    </div>
  );
};
