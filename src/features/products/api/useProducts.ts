import axiosInstance from "@lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../schemas/product.schema";
import { productKeys } from "./keys";

async function fetchProducts(): Promise<Product[]> {
  const { data } = await axiosInstance.get<Product[]>("/products");
  return data;
}

export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: fetchProducts,
  });
}
