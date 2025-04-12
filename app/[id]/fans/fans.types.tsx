export interface ApiFan {
  id: string;
  name: string;
  areaId: string;
  locationX: number;
  locationY: number;
  locationZ: number;
  lastMaintenance: string | null;
  status: "on" | "off";
  createdAt: string;
  updatedAt: string;
}

export interface FanState {
  id: string;
  name: string;
  isOn: boolean;
  speed: number; // 1: Low, 2: Medium, 3: High
  targetTemp?: number; // Not supported by API, managed client-side
  location?: string;
}