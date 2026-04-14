import type { Product, UpdateProductInput } from "@features/products";
import { productKeys } from "@features/products";
import axiosInstance from "@lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProductArgs {
  id: number;
  input: UpdateProductInput;
}

async function updateProduct({
  id,
  input,
}: UpdateProductArgs): Promise<Product> {
  const { data } = await axiosInstance.patch<Product>(`/products/${id}`, input);
  return data;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
