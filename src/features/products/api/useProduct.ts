import axiosInstance from "@lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../schemas/product.schema";
import { productKeys } from "./keys";

async function fetchProduct(id: number): Promise<Product> {
  const { data } = await axiosInstance.get<Product>(`/products/${id}`);

  return data;
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
  });
}
