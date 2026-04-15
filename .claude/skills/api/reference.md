# TanStack Query + Axios Reference

---

## Axios Instance

Always import the singleton — never create a new `axios.create()` in a hook file:

```ts
import axiosInstance from "@lib/axios";
```

**Response unwrapping:** Axios wraps responses in `{ data, status, headers, ... }`. Always destructure `data`:

```ts
const { data } = await axiosInstance.get<Product[]>("/products");
return data; // ← return the unwrapped payload, not the full response
```

**Generic type parameter:** Always pass the expected response type to the Axios method so the return type is inferred correctly:

```ts
axiosInstance.get<Product[]>("/products"); // list
axiosInstance.get<Product>(`/products/${id}`); // detail
axiosInstance.post<Product>("/products", body); // create
axiosInstance.patch<Product>(`/products/${id}`, body); // update
axiosInstance.delete(`/products/${id}`); // delete — returns void, no generic needed
```

**HTTP method conventions:**

- `GET` — list and detail
- `POST` — create
- `PATCH` — update (partial; use PUT only if the API requires full replacement)
- `DELETE` — delete

---

## Query Key Factory

The key factory creates a hierarchical, typed structure that lets you invalidate at any level:

```ts
export const ordersKeys = {
  all: ["orders"] as const,
  lists: () => [...ordersKeys.all, "list"] as const,
  detail: (id: number) => [...ordersKeys.all, "detail", id] as const,
};
```

| Key                    | Value                     | Used for                          |
| ---------------------- | ------------------------- | --------------------------------- |
| `ordersKeys.all`       | `["orders"]`              | Invalidate everything for entity  |
| `ordersKeys.lists()`   | `["orders", "list"]`      | Invalidate / refetch list query   |
| `ordersKeys.detail(5)` | `["orders", "detail", 5]` | Invalidate / remove single record |

**Naming:** factory variable is `<entityPlural>Keys` (e.g. `ordersKeys`, `customersKeys`).

---

## `useQuery` Pattern

Define the fetch function separately (not inline) so it can be typed independently:

```ts
async function fetchOrders(): Promise<Order[]> {
  const { data } = await axiosInstance.get<Order[]>("/orders");
  return data;
}

export function useOrders() {
  return useQuery({
    queryKey: ordersKeys.lists(),
    queryFn: fetchOrders,
  });
}
```

For parameterized queries, wrap the fetch call in an arrow function so the param is captured:

```ts
async function fetchOrder(id: number): Promise<Order> {
  const { data } = await axiosInstance.get<Order>(`/orders/${id}`);
  return data;
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => fetchOrder(id), // ← arrow function captures id
  });
}
```

---

## `useMutation` Patterns

### Create

```ts
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate the list so it re-fetches with the new item
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists() });
    },
  });
}
```

### Update

The mutation variable is `{ id, input }`. Use destructuring in `onSuccess` to access the ID:

```ts
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrder,
    onSuccess: (_, { id }) => {
      // Invalidate both the detail and the list
      queryClient.invalidateQueries({ queryKey: ordersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists() });
    },
  });
}
```

`onSuccess` signature: `(data, variables, context)` — `data` is the mutation response, `variables` is what you passed to `mutate()`.

### Delete

Use `removeQueries` (not `invalidateQueries`) for the detail key after deletion — the record no longer exists:

```ts
export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists() });
      queryClient.removeQueries({ queryKey: ordersKeys.detail(id) }); // ← remove, not invalidate
    },
  });
}
```

---

## Update Args Interface

When a mutation needs both an `id` and a payload, define an interface for the combined argument:

```ts
interface UpdateOrderArgs {
  id: number;
  input: UpdateOrderInput;
}

async function updateOrder({ id, input }: UpdateOrderArgs): Promise<Order> {
  const { data } = await axiosInstance.patch<Order>(`/orders/${id}`, input);
  return data;
}
```

This keeps `mutationFn` as a direct function reference (no inline arrow function needed).

---

## Cache Invalidation Strategy

| Operation | Action                                                                      |
| --------- | --------------------------------------------------------------------------- |
| Create    | `invalidateQueries(lists())` — list now has a new item                      |
| Update    | `invalidateQueries(detail(id))` + `invalidateQueries(lists())` — both stale |
| Delete    | `invalidateQueries(lists())` + `removeQueries(detail(id))` — record gone    |

**Why `removeQueries` on delete?** `invalidateQueries` marks a key stale and triggers a background refetch. But the record is gone — the refetch would 404. `removeQueries` drops it from the cache outright.

---

## TypeScript Type Conventions

| Type name             | Source                               | Usage                             |
| --------------------- | ------------------------------------ | --------------------------------- |
| `Entity`              | `z.infer<typeof entitySchema>`       | GET response, mutation response   |
| `Create<Entity>Input` | `z.infer<typeof createEntitySchema>` | POST body                         |
| `Update<Entity>Input` | `z.infer<typeof updateEntitySchema>` | PATCH body (usually `.partial()`) |

Import from the feature's schema file or the feature's public `index.ts`:

```ts
import type {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
} from "../schemas/order.schema";
// or from another feature's public API:
import type { Product, CreateProductInput } from "@features/products";
```

Always use `import type` for type-only imports (`verbatimModuleSyntax` is enabled).

---

## Feature `index.ts` Barrel

The feature's `index.ts` is the public boundary — other features import only from here:

```ts
// src/features/orders/index.ts
export * from "./api/keys";
export * from "./api/useOrders";
export * from "./api/useOrder";
export * from "./api/useCreateOrder";
export * from "./api/useUpdateOrder";
export * from "./api/useDeleteOrder";
export * from "./schemas/order.schema";
```

When updating `index.ts`, **append only** — do not remove or reorder existing exports.
