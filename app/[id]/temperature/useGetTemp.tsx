import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { getTemp } from "./temperatures.service";

function useGetTemp() {
  return useQuery({
    queryKey: ["data"],
    queryFn: () => getTemp(),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export default useGetTemp;
