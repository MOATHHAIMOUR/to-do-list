import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axios.config";
import { AxiosRequestConfig } from "axios";

interface IUseAuthenticatedQuery {
  queryKey: string[];
  url: string;
  config?: AxiosRequestConfig;
}

const useCustomQuery = <TData>({
  queryKey,
  url,
  config,
}: IUseAuthenticatedQuery) => {
  return useQuery<TData>({
    queryKey: queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get<TData>(url, config);
      return data;
    },
  });
};

export default useCustomQuery;
