import axios from "@/api/axios.config";
import { serialize } from "cookie";
import { IFloor } from "./dashboard.types";

export const getData = async (): Promise<IFloor[]> => {
  try {
    const response = await axios.get("/floor-plan");
    return response.data;
  } catch (error) {
    // to do add toast
    throw error;
  }
};

export const getTemp = async (id: string) => {
  try {
    const response = await axios.get("/floor/{floorId}");
  } catch (error) {
    throw error;
  }
};
  