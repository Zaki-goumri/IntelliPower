import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { getData } from "./dashboard.service";

function useGetData() {
  return useQuery({
    queryKey: ["data"],
    queryFn: () => getData(),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export default useGetData;
