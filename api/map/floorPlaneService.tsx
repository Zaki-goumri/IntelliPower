import { FloorPlanData } from "./floorPlan.types";

// This is a mock API service that simulates getting data from a backend
export const fetchFloorPlanData = async (): Promise<FloorPlanData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data that represents a floor plan
  const floorPlanData: FloorPlanData = {
    walls: [
      { start: { x: 0, y: 0 }, end: { x: 2200, y: 0 }, thickness: 20 },
      { start: { x: 2200, y: 0 }, end: { x: 2200, y: 1050 }, thickness: 20 },
      { start: { x: 2200, y: 1050 }, end: { x: 0, y: 1050 }, thickness: 20 },
      { start: { x: 0, y: 1050 }, end: { x: 0, y: 0 }, thickness: 20 },
      // Inner walls for bathroom
      { start: { x: 1650, y: 0 }, end: { x: 1650, y: 350 }, thickness: 20 },
      { start: { x: 1650, y: 350 }, end: { x: 2200, y: 350 }, thickness: 20 },
      // Bedroom walls
      { start: { x: 1200, y: 1050 }, end: { x: 1200, y: 600 }, thickness: 20 },
      { start: { x: 1200, y: 600 }, end: { x: 2200, y: 600 }, thickness: 20 },
      // Additional wall segment for balcony
      { start: { x: 0, y: 0 }, end: { x: 0, y: 500 }, thickness: 20 },
      { start: { x: 0, y: 500 }, end: { x: 500, y: 1050 }, thickness: 20 }
    ],
    rooms: [
      {
        name: "Living Room and Kitchen",
        walls: [],  // Simplified, or list specific walls
      },
      {
        name: "Bathroom",
        walls: [],
      },
      {
        name: "Bedroom",
        walls: [],
      },
      {
        name: "Hallway",
        walls: [],
      },
      {
        name: "Balcony",
        walls: [],
      }
    ],
    furniture: [
      { type: "Camera", position: { x: 500, y: 500 }, width: 20, height: 20 },
      { type: "Camera", position: { x: 1800, y: 180 }, width: 20, height: 20 },
      { type: "Camera", position: { x: 1800, y: 800 }, width: 20, height: 20 },
      { type: "Camera", position: { x: 300, y: 200 }, width: 20, height: 20 }
    ],
    dimensions: {
      width: 2200,
      height: 1050
    }
  }; 
  return {
    dimensions: { width: 1000, height: 750 },
    walls: [
      // Outer walls
      { start: { x: 50, y: 50 }, end: { x: 950, y: 50 }, thickness: 10 }, // Top
      { start: { x: 950, y: 50 }, end: { x: 950, y: 700 }, thickness: 10 }, // Right
      { start: { x: 950, y: 700 }, end: { x: 50, y: 700 }, thickness: 10 }, // Bottom
      { start: { x: 50, y: 700 }, end: { x: 50, y: 50 }, thickness: 10 }, // Left

      // Interior walls
      { start: { x: 50, y: 300 }, end: { x: 300, y: 300 }, thickness: 8 },
      { start: { x: 300, y: 50 }, end: { x: 300, y: 300 }, thickness: 8 },
      { start: { x: 300, y: 300 }, end: { x: 300, y: 450 }, thickness: 8 },
      { start: { x: 300, y: 450 }, end: { x: 600, y: 450 }, thickness: 8 },
      { start: { x: 600, y: 300 }, end: { x: 600, y: 450 }, thickness: 8 },
      { start: { x: 600, y: 300 }, end: { x: 750, y: 300 }, thickness: 8 },
      { start: { x: 450, y: 450 }, end: { x: 450, y: 700 }, thickness: 8 },
    ],
    doors: [
      { start: { x: 450, y: 50 }, end: { x: 550, y: 50 }, isOpen: false },
      { start: { x: 300, y: 200 }, end: { x: 300, y: 250 }, isOpen: true, openingAngle: 90 },
      { start: { x: 500, y: 450 }, end: { x: 550, y: 450 }, isOpen: false },
      { start: { x: 650, y: 300 }, end: { x: 700, y: 300 }, isOpen: false },
    ],
    windows: [
      { start: { x: 100, y: 50 }, end: { x: 200, y: 50 }, width: 5 },
      { start: { x: 700, y: 50 }, end: { x: 800, y: 50 }, width: 5 },
      { start: { x: 950, y: 200 }, end: { x: 950, y: 300 }, width: 5 },
      { start: { x: 950, y: 500 }, end: { x: 950, y: 600 }, width: 5 },
      { start: { x: 200, y: 700 }, end: { x: 300, y: 700 }, width: 5 },
      { start: { x: 600, y: 700 }, end: { x: 700, y: 700 }, width: 5 },
      { start: { x: 50, y: 400 }, end: { x: 50, y: 500 }, width: 5 },
    ],
    furniture: [
      // Bedroom
      { type: "bed", position: { x: 175, y: 175 }, width: 140, height: 200, rotation: 0 },
      { type: "table", position: { x: 80, y: 80 }, width: 50, height: 50 },
      
      // Living room
      { type: "sofa", position: { x: 700, y: 600 }, width: 200, height: 80, rotation: 0 },
      { type: "table", position: { x: 700, y: 500 }, width: 120, height: 70 },
      
      // Dining area
      { type: "table", position: { x: 800, y: 175 }, width: 150, height: 100 },
      { type: "chair", position: { x: 750, y: 125 }, width: 40, height: 40 },
      { type: "chair", position: { x: 850, y: 125 }, width: 40, height: 40 },
      { type: "chair", position: { x: 750, y: 225 }, width: 40, height: 40 },
      { type: "chair", position: { x: 850, y: 225 }, width: 40, height: 40 },
      
      // Kitchen 
      { type: "table", position: { x: 800, y: 375 }, width: 120, height: 60 },
      
      // Bathroom
      { type: "table", position: { x: 175, y: 600 }, width: 80, height: 60 },
    ],
    cameras: [
      // Entrance camera
      { 
        position: { x: 450, y: 80 }, 
        direction: 180, 
        fieldOfView: 120, 
        range: 250,
        isActive: true 
      },
      // Living room corner camera
      { 
        position: { x: 900, y: 650 }, 
        direction: 225, 
        fieldOfView: 90, 
        range: 300,
        isActive: true 
      },
      // Kitchen camera
      { 
        position: { x: 750, y: 350 }, 
        direction: 270, 
        fieldOfView: 100, 
        range: 200,
        isActive: true 
      },
      // Bedroom camera
      { 
        position: { x: 100, y: 150 }, 
        direction: 45, 
        fieldOfView: 90, 
        range: 180,
        isActive: true 
      },
    ]
  };
};
