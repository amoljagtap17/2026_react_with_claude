import type { Product } from "@features/products";
import axiosInstance from "@lib/axios";
import { useQuery } from "@tanstack/react-query";

const RECENT_LIMIT = 5;

async function fetchRecentProducts(): Promise<Product[]> {
  const { data } = await axiosInstance.get<Product[]>("/products", {
    params: { _sort: "createdAt", _order: "desc", _limit: RECENT_LIMIT },
  });
  return data;
}

export function useRecentProducts() {
  return useQuery({
    queryKey: ["products", "recent"],
    queryFn: fetchRecentProducts,
  });
}
