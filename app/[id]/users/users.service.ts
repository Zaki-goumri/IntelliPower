import axios from "@/api/axios.config";
import { AxiosError, isAxiosError } from "axios";
import { toast } from "react-toastify";

type NewUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee";
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastActive: string;
  avatar: string;
  age?: number;
  gender?: "Male" | "Female";
  phone_number?: string;
};

export const addEmployee = async (values: NewUser): Promise<User> => {
  try {
    const lowerRoleCase = values.role.toLowerCase();
    const response = await axios.post("/auth/register", {
      ...values,
      role: lowerRoleCase,
    });
    const registeredUser: User = response.data;

    toast.success("added user");
    return registeredUser;
  } catch (err) {
    let errorMessage = `Error in sending data, try again ${err}`;
    let errorDetails = {};

    if (isAxiosError(err)) {
      errorMessage = err.response?.data?.message || errorMessage;
      errorDetails = {
        status: err.response?.status,
        data: err.response?.data,
      };
    }

    toast("there is an error");
    throw new Error(errorMessage, { cause: errorDetails });
  }
};

// Other functions (getUsers, uploadUsersCSV) remain unchanged
export const getUsers = async (page: number, limit: number) => {
  try {
    const response = await axios.get("/employees", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching users:", error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
    throw error;
  }
};

export const uploadUsersCSV = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("/employees/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success(response.data || "Added users", {
      position: "top-right",
      autoClose: 5000,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error uploading CSV:", error.message);
      throw new Error(
        error.response?.data?.message || "Failed to upload CSV file",
      );
    }
    throw error;
  }
};
