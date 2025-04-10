export interface IArea {
  name: string;
  id: string;
}
export interface IFloor {
  name: string;
  id: string;
  areas: IArea[];
}

export const FLOOR_ENUM = {
  FLOOR: "floor",
  AREA: "area",
};

export interface AreaFlour {
  label: string;
  id: string;
  type: string;
  value: string;
}
