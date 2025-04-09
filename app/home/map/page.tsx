import React, { useState, useEffect } from "react";

interface FloorPlanProps {
  coordinates: Array<{ x: number; y: number }>;
  strokeWidth?: number;
  scale?: number;
}

const FloorPlan: React.FC<FloorPlanProps> = ({
  coordinates,
  strokeWidth = 2,
  scale = 1,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Detect color scheme on mount and when it changes
  useEffect(() => {
    // Check initial preference
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeMediaQuery.matches);

    // Set up listener for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Set colors based on dark/light mode
  const strokeColor = isDarkMode ? "white" : "black";
  const fillColor = isDarkMode ? "white" : "black";

  if (coordinates.length < 2) return <div>Not enough points to draw</div>;

  // Normalize coordinates and calculate bounds
  const scaledPoints = coordinates.map(({ x, y }) => ({
    x: x * scale,
    y: y * scale,
  }));
  const minX = Math.min(...scaledPoints.map((p) => p.x));
  const minY = Math.min(...scaledPoints.map((p) => p.y));
  const maxX = Math.max(...scaledPoints.map((p) => p.x));
  const maxY = Math.max(...scaledPoints.map((p) => p.y));

  const pathData = scaledPoints
    .map(({ x, y }, i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");

  return (
    <div
      className="w-full h-full"
      style={{ backgroundColor: "transparent", padding: "20px" }}
    >
      <svg
        viewBox={`${minX - 10} ${minY - 10} ${maxX - minX + 20} ${maxY - minY + 20}`}
        style={{ width: "100%", height: "auto" }}
      >
        {/* Walls */}
        <path
          d={pathData}
          stroke={strokeColor}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Coordinate markers */}
        {scaledPoints.map(({ x, y }, i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <circle r="3" fill={fillColor} />
            <text
              x="5"
              y="5"
              fontSize="10"
              fill={fillColor}
              style={{ userSelect: "none" }}
            ></text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Example usage
const App: React.FC = () => (
  <FloorPlan
    coordinates={[
      { x: 100, y: 100 },
      { x: 300, y: 100 },
      { x: 300, y: 250 },
      { x: 100, y: 250 },
    ]}
    scale={2}
  />
);

export default App;
