import axios from "@/api/axios.config";
import { FLOOR_ENUM, IFloor } from "../dashboard/dashboard.types";

export const getTemp = async () => {
  try {
    const response = await axios.get("/");
    const flatList = addFloors(response.data);
    return flatList;
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

export async function getHistoryTemperature(
  type: string,
  id: string,
  startDate: Date,
  endDate: Date,
  groupBy: "day" | "week" | "month",
) {
  try {
    const response = await axios.get(`/temperature/${type}/${id}`, {
      params: {
        startDate,
        endDate,
        groupBy,
      },
    });
    return response;
  } catch (error: any) {
    console.error(
      "Temperature API error:",
      error.response?.data || error.message,
    );
    throw error;
  }
}
