import type { Product } from "@features/products";
import axiosInstance from "@lib/axios";
import { useQuery } from "@tanstack/react-query";

const LOW_STOCK_THRESHOLD = 10;

async function fetchLowStockProducts(): Promise<Product[]> {
  const { data } = await axiosInstance.get<Product[]>("/products", {
    params: { stock_lte: LOW_STOCK_THRESHOLD },
  });
  return data;
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: ["products", "low-stock"],
    queryFn: fetchLowStockProducts,
  });
}
