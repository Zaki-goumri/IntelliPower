import axios from "@/api/axios.config";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const getNotifications = async () => {
  try {
    const response = await axios.get("/notifications/me");
    const notifications = response.data;
    return notifications;
  } catch (error) {
    if (error instanceof AxiosError) {
    }
    throw error;
  }
};
