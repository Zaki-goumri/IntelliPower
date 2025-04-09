import React from "react";

interface RoomData {
  type: string;
  id: string;
  label: string;
  polygon: Array<{ x: number; y: number }>;
  properties: {
    capacity: number;
    department: string;
    averageTemperature: number;
    highTempThreshold: number;
    status: "normal" | "warning" | "alert";
  };
}

interface FloorPlanData {
  version: string;
  dimensions: { width: number; height: number };
  elements: RoomData[];
}

const FloorPlanVisualization: React.FC = () => {
  const floorPlanData: FloorPlanData = {
    version: "1.0",
    dimensions: {
      width: 1200,
      height: 800,
    },
    elements: [
      {
        type: "room",
        id: "room-1",
        label: "Server Room",
        polygon: [
          { x: 100, y: 100 },
          { x: 300, y: 100 },
          { x: 300, y: 250 },
          { x: 100, y: 250 },
        ],
        properties: {
          capacity: 0,
          department: "IT",
          averageTemperature: 24.5,
          highTempThreshold: 28,
          status: "normal",
        },
      },
      {
        type: "room",
        id: "room-2",
        label: "Main Office",
        polygon: [
          { x: 350, y: 100 },
          { x: 700, y: 100 },
          { x: 700, y: 300 },
          { x: 350, y: 300 },
        ],
        properties: {
          capacity: 12,
          department: "Development",
          averageTemperature: 22.1,
          highTempThreshold: 26,
          status: "normal",
        },
      },
      {
        type: "room",
        id: "room-3",
        label: "Call Center",
        polygon: [
          { x: 750, y: 100 },
          { x: 1100, y: 100 },
          { x: 1100, y: 300 },
          { x: 750, y: 300 },
        ],
        properties: {
          capacity: 20,
          department: "Support",
          averageTemperature: 27.8,
          highTempThreshold: 26,
          status: "warning",
        },
      },
    ],
  };

  const statusColors = {
    normal: "#4CAF50",
    warning: "#FFC107",
    alert: "#F44336",
  };

  const calculateCentroid = (points: Array<{ x: number; y: number }>) => {
    const centroid = points.reduce(
      (acc, point) => ({
        x: acc.x + point.x / points.length,
        y: acc.y + point.y / points.length,
      }),
      { x: 0, y: 0 },
    );

    return centroid;
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        maxWidth: "100%",
        overflow: "auto",
      }}
    >
      <svg
        viewBox={`0 0 ${floorPlanData.dimensions.width} ${floorPlanData.dimensions.height}`}
        width="100%"
        height="800px"
        style={{ border: "1px solid #ddd" }}
      >
        {floorPlanData.elements.map((room) => {
          const centroid = calculateCentroid(room.polygon);
          const points = room.polygon.map((p) => `${p.x},${p.y}`).join(" ");

          return (
            <g key={room.id}>
              {/* Room Outline */}
              <polygon
                points={points}
                fill="#F5F5F5"
                stroke="#212121"
                strokeWidth="2"
              />

              {/* Status Indicator */}
              <circle
                cx={centroid.x}
                cy={centroid.y}
                r="10"
                fill={statusColors[room.properties.status]}
                stroke="#FFFFFF"
                strokeWidth="2"
              />

              {/* Temperature Display */}
              <text
                x={centroid.x}
                y={centroid.y + 5}
                textAnchor="middle"
                fontSize="12"
                fill={
                  room.properties.averageTemperature >
                  room.properties.highTempThreshold
                    ? "#F44336"
                    : "#212121"
                }
                fontWeight="500"
              >
                {room.properties.averageTemperature}°C
              </text>

              {/* Room Label */}
              <text
                x={room.polygon[0].x + 10}
                y={room.polygon[0].y + 20}
                fontSize="14"
                fill="#212121"
                fontWeight="600"
              >
                {room.label}
              </text>

              {/* Department Label */}
              <text
                x={room.polygon[0].x + 10}
                y={room.polygon[0].y + 40}
                fontSize="12"
                fill="#666"
              >
                {room.properties.department}
              </text>

              {/* Capacity */}
              <text
                x={room.polygon[0].x + 10}
                y={room.polygon[0].y + 60}
                fontSize="12"
                fill="#666"
              >
                Capacity: {room.properties.capacity}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(20 20)">
          <rect
            x="0"
            y="0"
            width="150"
            height="110"
            fill="white"
            stroke="#ddd"
            rx="5"
          />
          <text x="10" y="20" fontSize="14" fontWeight="600">
            Status Legend
          </text>
          {Object.entries(statusColors).map(([status, color], index) => (
            <g key={status} transform={`translate(10 ${30 + index * 25})`}>
              <circle cx="10" cy="10" r="8" fill={color} />
              <text x="25" y="15" fontSize="12">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default FloorPlanVisualization;
