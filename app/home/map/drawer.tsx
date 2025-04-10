// components/FloorPlan.tsx
"use client";

import React from "react";
import { Stage, Layer, Line, Text, Arc } from "react-konva";

type Point = { x: number; y: number };

type Room = {
  id: string;
  label: string;
  polygon: Point[];
  status: "normal" | "warning" | "alert";
};

type Door = {
  id: string;
  roomId: string;
  start: Point; // Door start coordinate (on the wall)
  doorWidth: number; // The length along the wall
  orientation: number; // In degrees; use 0 for horizontal, 90 for vertical, etc.
};

export type FloorPlanData = {
  dimensions: {
    width: number;
    height: number;
  };
  rooms: Room[];
  doors: Door[];
};

// Updated status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "alert":
      return "hsla(0, 85%, 55%, 0.6)";
    case "warning":
      return "hsla(35, 90%, 55%, 0.6)";
    default:
      return "hsla(120, 60%, 45%, 0.5)";
  }
};

type FloorPlanProps = {
  floorPlanData: FloorPlanData;
};

const DoorComponent: React.FC<{ door: Door }> = ({ door }) => {
  // Convert orientation to radians for math calculations:
  const radians = door.orientation * (Math.PI / 180);
  const end = {
    x: door.start.x + door.doorWidth * Math.cos(radians),
    y: door.start.y + door.doorWidth * Math.sin(radians),
  };

  return (
    <>
      {/* Draw the door as a thick line */}
      <Line
        points={[door.start.x, door.start.y, end.x, end.y]}
        stroke="brown"
        strokeWidth={4}
      />
      {/* Optionally, render an arc to indicate the door swing (90° sweep) */}
      <Arc
        x={door.start.x}
        y={door.start.y}
        innerRadius={door.doorWidth - 2}
        outerRadius={door.doorWidth + 2}
        angle={90}
        rotation={door.orientation}
        fill="rgba(165,42,42,0.3)"
      />
    </>
  );
};

const FloorPlan: React.FC<FloorPlanProps> = ({ floorPlanData }) => {
  const { dimensions, rooms, doors } = floorPlanData;

  return (
    <Stage width={dimensions.width} height={dimensions.height}>
      <Layer>
        {/* Render Rooms */}
        {rooms.map((room) => {
          const points = room.polygon.flatMap((p) => [p.x, p.y]);
          // Simple center calculation for the room label
          const avgX =
            room.polygon.reduce((sum, p) => sum + p.x, 0) / room.polygon.length;
          const avgY =
            room.polygon.reduce((sum, p) => sum + p.y, 0) / room.polygon.length;
          return (
            <React.Fragment key={room.id}>
              <Line
                points={points}
                closed
                stroke="black"
                strokeWidth={2}
                fill={getStatusColor(room.status)}
                lineJoin="round"
              />
              <Text
                x={avgX - 30}
                y={avgY - 10}
                text={room.label}
                fontSize={16}
                fill="black"
                width={60}
                align="center"
              />
            </React.Fragment>
          );
        })}

        {/* Render Doors */}
        {doors.map((door) => (
          <DoorComponent key={door.id} door={door} />
        ))}
      </Layer>
    </Stage>
  );
};

export default FloorPlan;
