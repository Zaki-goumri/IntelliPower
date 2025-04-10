import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { getTemp } from "./dashboard.service";

function useGetTemp(path: string) {
  return useQuery({
    queryKey: [`remperatures/${path}`],
    queryFn: () => getTemp(path),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export default useGetTemp;
