"use client"; // if you're in the App Router

import dynamic from "next/dynamic";
import React from "react";
import { FloorPlanData } from "./drawer";
// If you want to dynamically import:
const DynamicFloorPlan = dynamic(() => import("./drawer"), {
  ssr: false,
});

export default function HomePage() {
  const floorPlanData: FloorPlanData = {
    dimensions: { width: 800, height: 600 },
    rooms: [
      {
        id: "room-1",
        label: "Room 1",
        polygon: [
          // Main room outline
          { x: 100, y: 200 }, // Southwest corner
          { x: 200, y: 200 }, // Southeast corner
          { x: 200, y: 250 }, // East wall
          { x: 180, y: 250 }, // Doorway indentation start
          { x: 180, y: 270 }, // Doorway indentation
          { x: 150, y: 270 }, // Doorway indentation end

          // Living area section
          { x: 150, y: 300 }, // North wall segment
          { x: 160, y: 310 }, // Window bay start
          { x: 170, y: 320 }, // Window bay middle
          { x: 160, y: 330 }, // Window bay end
          { x: 150, y: 340 }, // North wall continued

          // Bedroom section
          { x: 150, y: 350 }, // Northeast corner
          { x: 100, y: 350 }, // Northwest corner
          { x: 100, y: 300 }, // West wall

          // Bathroom section
          { x: 120, y: 300 }, // Bathroom partition start
          { x: 120, y: 250 }, // Bathroom partition corner
          { x: 100, y: 250 }, // Bathroom partition end
          { x: 100, y: 200 }, // Back to starting point
        ],
        status: "normal",
      },
    ],
    doors: [
      {
        id: "door-1",
        roomId: "room-1",
        start: { x: 180, y: 260 },
        doorWidth: 30,
        orientation: 0,
      },
    ],
  };

  return (
    <div>
      <h1>Floor Plan</h1>
      <DynamicFloorPlan floorPlanData={floorPlanData} />
    </div>
  );
}
