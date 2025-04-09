"use client"; // Add client directive
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { loginUser } from "./signin.service";
import { User, LoginRequest } from "./signin.types";
import { useUserStore } from "../../../store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const useSignin = () => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter(); // Use proper Next.js router

  return useMutation<User, unknown, LoginRequest>({
    mutationFn: (values: LoginRequest) => loginUser(values),
    onSuccess: (data: User) => {
      setUser(data);
      router.push("/home/dashboard"); // Use router.push instead of navigate
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.email?.[0] ||
          "An unknown error occurred";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error("An unexpected error occurred", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    },
  });
};

export default useSignin;
