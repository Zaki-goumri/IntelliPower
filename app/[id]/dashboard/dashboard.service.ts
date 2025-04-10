import axios from "@/api/axios.config";
import { serialize } from "cookie";
import { IFloor, FLOOR_ENUM } from "./dashboard.types";

export const getData = async () => {
  try {
    const response = await axios.get("/floor-plan");
    const flatList = addFloors(response.data);
    return flatList;
  } catch (error) {
    throw error;
  }
};

export const getTemp = async (path: string) => {
  try {
    const response = await axios.get(path);
  } catch (error) {
    throw error;
  }
};

export function addFloors(floors: IFloor[]) {
  const flatList = floors
    .flatMap((floor) => [
      { name: floor.name, id: floor.id, type: FLOOR_ENUM.FLOOR },
      ...floor.areas.map((area) => ({
        name: area.name,
        id: area.id,
        type: FLOOR_ENUM.AREA,
      })),
    ])
    .map((floor) => {
      return {
        label: floor.name,
        value: floor.name,
        type: floor.type,
        id: floor.id,
      };
    });
  return flatList;
}

export async function fetchDashboardData(type: string, id: string) {
  try {
    const [temperatureData, energyConsumation] = await Promise.all([
      axios.get(("/temperature/" + type + "/" + id) as string),
      axios.get(("/consumtion/" + type + "/" + id) as string, {
        params: { groupBy: "day" },
      }),
    ]);
    return { temperatureData, energyConsumation };
  } catch (error) {
    throw error;
  }
}
