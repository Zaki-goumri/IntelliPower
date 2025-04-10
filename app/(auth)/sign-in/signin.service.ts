import axios from "@/api/axios.config";
import { serialize } from "cookie";
import { LoginRequest, User, LoginResponse } from "./signin.types";

export const loginUser = async (data: LoginRequest): Promise<User> => {
  try {
    const response = await axios.post<LoginResponse>("auth/login", data);
    document.cookie = serialize("accessToken", response.data.accessToken, {
      httpOnly: false,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    document.cookie = serialize("refreshToken", response.data.refreshToken, {
      httpOnly: false,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return response.data.user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};
