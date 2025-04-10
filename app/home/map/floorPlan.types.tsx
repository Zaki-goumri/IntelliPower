export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  start: Point;
  end: Point;
  thickness: number;
}

export interface Room {
  walls: Wall[];
  name?: string;
  type?: string;
}

export interface Door {
  start: Point;
  end: Point;
  isOpen?: boolean;
  openingAngle?: number;
}

export interface Window {
  start: Point;
  end: Point;
  width: number;
}

export interface Furniture {
  type: string;
  position: Point;
  width: number;
  height: number;
  rotation?: number;
}

export interface Camera {
  position: Point;
  direction: number; // In degrees, 0 is right, 90 is up
  fieldOfView: number; // In degrees
  range: number; // How far the camera can see
  isActive?: boolean;
}

export interface FloorPlanData {
  walls: Wall[];
  rooms?: Room[];
  doors?: Door[];
  windows?: Window[];
  furniture?: Furniture[];
  cameras?: Camera[];
  dimensions: {
    width: number;
    height: number;
  };
}
