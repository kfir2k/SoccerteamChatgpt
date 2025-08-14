import React from "react";

export default function GridOverlay({
  width,
  height,
  show,
  gridSize = { cols: 8, rows: 10 },
}) {
  if (!show) return null;

  const { cols, rows } = gridSize;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  const verticalLines = [];
  const horizontalLines = [];

  // Create vertical lines
  for (let i = 1; i < cols; i++) {
    const x = i * cellWidth;
    verticalLines.push(
      <line
        key={`v-${i}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
    );
  }

  // Create horizontal lines
  for (let i = 1; i < rows; i++) {
    const y = i * cellHeight;
    horizontalLines.push(
      <line
        key={`h-${i}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {verticalLines}
        {horizontalLines}
      </svg>
    </div>
  );

  // Helper function to get grid snap position
}

export function getGridSnapPosition(
  x,
  y,
  fieldWidth,
  fieldHeight,
  dotSize,
  gridSize = { cols: 8, rows: 10 }
) {
  const { cols, rows } = gridSize;
  const areaW = Math.max(0, fieldWidth - dotSize);
  const areaH = Math.max(0, fieldHeight - dotSize);

  const cellWidth = areaW / cols;
  const cellHeight = areaH / rows;

  // Find nearest grid intersection
  const gridX = Math.round(x / cellWidth) * cellWidth;
  const gridY = Math.round(y / cellHeight) * cellHeight;

  // Clamp to field bounds
  const clampedX = Math.max(0, Math.min(gridX, areaW));
  const clampedY = Math.max(0, Math.min(gridY, areaH));

  // Convert to normalized coordinates
  const nx = areaW > 0 ? clampedX / areaW : 0;
  const ny = areaH > 0 ? clampedY / areaH : 0;

  return { x: nx, y: ny };
}
