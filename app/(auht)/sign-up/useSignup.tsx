import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { registerUser } from "./sign-up.service";
import { User, RegisterRequest } from "./signup.types";
import { useUserStore } from "../../../store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const useSignup = () => {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useRouter();

  return useMutation({
    mutationFn: (values: RegisterRequest) => registerUser(values),
    onSuccess: (data: User) => {
      setUser({ ...data });
      navigate.push("/");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.email[0], {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        console.error("Unknown error");
      }
    },
  });
};

export default useSignup;
