import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { getNotifications} from "./notifications.service";
import { toast } from "react-toastify";

function useGetNotifications() {
  return useQuery({
    queryKey: ["notifications/all"],
    queryFn: () => getNotifications(),
  });
}

export default useGetNotifications;
