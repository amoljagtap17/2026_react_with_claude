# API Skill — Canonical Examples

## The Reference Implementation: Products + Admin

The products/admin API layer is the complete working reference for this pattern. Read these files before generating any new hooks:

```
src/features/products/api/keys.ts
src/features/products/api/useProducts.ts
src/features/products/api/useProduct.ts
src/features/admin/api/useCreateProduct.ts
src/features/admin/api/useUpdateProduct.ts
src/features/admin/api/useDeleteProduct.ts
src/features/products/index.ts
src/features/admin/index.ts
src/lib/axios.ts
```

---

## Key Patterns to Notice

### `keys.ts` — hierarchical factory with `as const`

```ts
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  detail: (id: number) => [...productKeys.all, "detail", id] as const,
};
```

`as const` on each entry gives TanStack Query precise tuple types for the query key, enabling exact matching during invalidation.

---

### `useProducts.ts` — list query

```ts
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
    queryFn: fetchProducts, // ← direct reference, not () => fetchProducts()
  });
}
```

---

### `useProduct.ts` — detail query (parameterized)

```ts
async function fetchProduct(id: number): Promise<Product> {
  const { data } = await axiosInstance.get<Product>(`/products/${id}`);
  return data;
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id), // ← arrow fn captures `id` in closure
  });
}
```

---

### `useCreateProduct.ts` — create mutation

```ts
async function createProduct(input: CreateProductInput): Promise<Product> {
  const { data } = await axiosInstance.post<Product>("/products", {
    ...input,
    createdAt: new Date().toISOString(), // server-side concern moved to client here for demo
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
```

---

### `useUpdateProduct.ts` — update mutation

Note the `UpdateProductArgs` interface that bundles `id` + `input`:

```ts
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
      // ← variables destructured in onSuccess
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
```

---

### `useDeleteProduct.ts` — delete mutation

`removeQueries` instead of `invalidateQueries` for the detail key — the record no longer exists:

```ts
async function deleteProduct(id: number): Promise<void> {
  await axiosInstance.delete(`/products/${id}`);
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) }); // ← remove not invalidate
    },
  });
}
```

---

### `index.ts` — barrel exports

```ts
// src/features/products/index.ts
export * from "./api/keys";
export * from "./api/useProduct";
export * from "./api/useProducts";
export * from "./schemas/product.schema";
```

Only query hooks and schema live in the products feature barrel. Mutation hooks live in the admin feature barrel because that's the feature that owns those operations:

```ts
// src/features/admin/index.ts
export * from "./api/useCreateProduct";
export * from "./api/useDeleteProduct";
export * from "./api/useUpdateProduct";
export * from "./components";
```

This separation is a project convention — for new features, it's fine to put all hooks (queries + mutations) in the same feature barrel unless there's a deliberate ownership reason to split them.
