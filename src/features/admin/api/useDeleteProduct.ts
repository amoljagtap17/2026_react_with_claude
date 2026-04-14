import { productKeys } from "@features/products";
import axiosInstance from "@lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteProduct(id: number): Promise<void> {
  await axiosInstance.delete(`/products/${id}`);
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
    },
  });
}
