import React from 'react';

interface FloorPlanProps {
  coordinates: Array<[number, number]>;
  strokeWidth?: number;
  scale?: number;
}

const FloorPlan: React.FC<FloorPlanProps> = ({
  coordinates,
  strokeWidth = 2,
  scale = 1
}) => {
  if (coordinates.length < 2) return <div>Not enough points to draw</div>;

  // Normalize coordinates and calculate bounds
  const scaledPoints = coordinates.map(([x, y]) => [x * scale, y * scale]);
  const minX = Math.min(...scaledPoints.map(p => p[0]));
  const minY = Math.min(...scaledPoints.map(p => p[1]));
  const maxX = Math.max(...scaledPoints.map(p => p[0]));
  const maxY = Math.max(...scaledPoints.map(p => p[1]));

  // Create SVG path data
  const pathData = scaledPoints
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ');

  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <svg
        viewBox={`${minX - 10} ${minY - 10} ${maxX - minX + 20} ${maxY - minY + 20}`}
        style={{ width: '100%', height: 'auto' }}
      >
        {/* Walls */}
        <path
          d={pathData}
          stroke="black"
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Coordinate markers */}
        {scaledPoints.map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <circle r="3" fill="black" />
            <text
              x="5"
              y="5"
              fontSize="10"
              fill="black"
              style={{ userSelect: 'none' }}
            >
              ({coordinates[i][0]}, {coordinates[i][1]})
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

