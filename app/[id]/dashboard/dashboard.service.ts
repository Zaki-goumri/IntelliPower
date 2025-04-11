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

export async function fetchTemperatureData(
  type: string,
  id: string,
  period: string,
) {
  try {
    const response = await axios.get(`/temperature/period/${type}/${id}`, {
      params: { type: period },
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

export async function fetchEnergyConsumationData(
  type: string,
  id: string,
  period: string,
) {
  try {
    const response = await axios.get(`/consumtion/period/${type}/${id}`, {
      params: { type: period },
    });
    return response;
  } catch (error: any) {
    console.error(
      "Energy Consumption API error:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function fetchDashboardTemperatureData(
  type: string,
  id: string,
  period: string,
) {
  try {
    const temperatureData = await fetchTemperatureData(type, id, period);
    return temperatureData;
  } catch (error: any) {
    console.error(
      "Temperature Dashboard API error:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function fetchDashboardEnergyConsumationData(
  type: string,
  id: string,
  period: string,
) {
  try {
    const energyConsumation = await fetchEnergyConsumationData(type, id, period);
    return energyConsumation;
  } catch (error: any) {
    console.error(
      "Energy Consumption Dashboard API error:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function fetchDashboardData(
  type: string,
  id: string,
  period: string,
) {
  try {
    const temperatureData = await fetchDashboardTemperatureData(type, id, period);
    const energyConsumation = await fetchDashboardEnergyConsumationData(type, id, period);

    return {
      temperatureData,
      energyConsumation,
    };
  } catch (error: any) {
    console.error(
      "Dashboard API error:",
      error.response?.data || error.message,
    );
    throw error;
  }
}
