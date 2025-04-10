export interface Point {
  x: number
  y: number
}

export interface Wall {
  start: Point
  end: Point
  thickness: number
}

export interface Door {
  start: Point
  end: Point
  isOpen: boolean
  openingAngle?: number
}

export interface Window {
  start: Point
  end: Point
  width: number
}

export interface Furniture {
  type: string
  position: Point
  width: number
  height: number
  rotation: number
}

export interface Camera {
  position: Point
  direction: number
  fieldOfView: number
  range: number
  isActive: boolean
}

export interface FloorPlanData {
  id: string
  name: string
  description?: string
  lastUpdated: string
  dimensions: {
    width: number
    height: number
  }
  walls: Wall[]
  doors?: Door[]
  windows?: Window[]
  furniture?: Furniture[]
  cameras?: Camera[]
}
