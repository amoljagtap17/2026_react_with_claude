import type { CreateProductInput, Product } from "@features/products";
import { productKeys } from "@features/products";
import axiosInstance from "@lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createProduct(input: CreateProductInput): Promise<Product> {
  const { data } = await axiosInstance.post<Product>("/products", {
    ...input,
    createdAt: new Date().toISOString(),
  });
  return data;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
