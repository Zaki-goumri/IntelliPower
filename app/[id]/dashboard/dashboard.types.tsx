export interface IArea {
  name: string;
  id: string;
}
export interface IFloor {
  name: string;
  id: string;
  areas: IArea[];
}
