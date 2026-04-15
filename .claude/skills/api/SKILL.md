---
name: api
description: Scaffolds TanStack Query hooks (query key factory, useQuery, useMutation) + Axios fetch functions for a feature's API layer. Schema/type creation and UI wiring are out of scope.
---

# API Skill

Scaffolds TanStack Query hooks for a feature using the project's Axios singleton and query key factory pattern.

**NOT in scope:** Zod schema / type creation, form wiring, grid wiring. Those are handled by other skills.
The generated hooks assume the entity types (`Entity`, `Create<Entity>Input`, `Update<Entity>Input`) already exist — they are imported, not created.

---

## Arguments

`<Entity> for <feature> [at <endpoint>] [with operations: <list>]`

Examples:

- `Order for orders at /orders with operations: list, detail, create, update, delete`
- `Customer for customers at /customers with operations: list, create`
- `DashboardStats for dashboard at /stats with operations: list`

Available operations: `list`, `detail`, `create`, `update`, `delete`

---

## Output

Creates files inside `src/features/<feature>/api/`:

```
api/
├── keys.ts                    ← query key factory (<entity>Keys)
├── use<Entity>s.ts            ← list query          (if list)
├── use<Entity>.ts             ← detail query by id  (if detail)
├── useCreate<Entity>.ts       ← create mutation     (if create)
├── useUpdate<Entity>.ts       ← update mutation     (if update)
└── useDelete<Entity>.ts       ← delete mutation     (if delete)
```

Then updates `src/features/<feature>/index.ts` to export the new hooks.

---

## Steps

### 1. Parse arguments

Extract:

- **`<Entity>`** — PascalCase entity name (e.g. `Order`, `Customer`)
- **`<feature>`** — target feature folder under `src/features/`
- **`<endpoint>`** — REST base path (e.g. `/orders`). If omitted, derive as `/<entity-plural-lowercase>`
- **Operations** — subset of `list`, `detail`, `create`, `update`, `delete`

Derive:

- `entityLower` — camelCase entity name (e.g. `order`)
- `entityPlural` — pluralised camelCase (e.g. `orders`) for the keys factory variable
- `ENTITY_UPPER` — SCREAMING_SNAKE (e.g. `ORDER`) — not used directly but helpful for naming

### 2. Read canonical examples

Read `examples.md` (in this skill folder) for the complete products API reference implementation.

### 3. Read hook patterns

Read `reference.md` (in this skill folder) for the full patterns for keys, useQuery, useMutation, and Axios usage.

### 4. Check for existing types

Look in `src/features/<feature>/schemas/<entityLower>.schema.ts` for:

- `<Entity>` — the full entity type
- `Create<Entity>Input` — create payload type
- `Update<Entity>Input` — update payload type

If found → use those import paths.
If not found → leave an `// TODO: import <Entity> type` comment and use `unknown` as a placeholder so the file still compiles.

### 5. Create `keys.ts`

```ts
export const <entityPlural>Keys = {
  all: ["<entityPlural>"] as const,
  lists: () => [...<entityPlural>Keys.all, "list"] as const,
  detail: (id: number) => [...<entityPlural>Keys.all, "detail", id] as const,
};
```

### 6. Create query hooks (list and/or detail)

**`use<Entity>s.ts`** (list):

```ts
import axiosInstance from "@lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { <Entity> } from "../schemas/<entityLower>.schema";
import { <entityPlural>Keys } from "./keys";

async function fetch<Entity>s(): Promise<<Entity>[]> {
  const { data } = await axiosInstance.get<<Entity>[]>("<endpoint>");
  return data;
}

export function use<Entity>s() {
  return useQuery({
    queryKey: <entityPlural>Keys.lists(),
    queryFn: fetch<Entity>s,
  });
}
```

**`use<Entity>.ts`** (detail by id):

```ts
async function fetch<Entity>(id: number): Promise<<Entity>> {
  const { data } = await axiosInstance.get<<Entity>>(`<endpoint>/${id}`);
  return data;
}

export function use<Entity>(id: number) {
  return useQuery({
    queryKey: <entityPlural>Keys.detail(id),
    queryFn: () => fetch<Entity>(id),
  });
}
```

### 7. Create mutation hooks

**`useCreate<Entity>.ts`**:

```ts
async function create<Entity>(input: Create<Entity>Input): Promise<<Entity>> {
  const { data } = await axiosInstance.post<<Entity>>("<endpoint>", input);
  return data;
}

export function useCreate<Entity>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create<Entity>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: <entityPlural>Keys.lists() });
    },
  });
}
```

**`useUpdate<Entity>.ts`**:

```ts
interface Update<Entity>Args {
  id: number;
  input: Update<Entity>Input;
}

async function update<Entity>({ id, input }: Update<Entity>Args): Promise<<Entity>> {
  const { data } = await axiosInstance.patch<<Entity>>(`<endpoint>/${id}`, input);
  return data;
}

export function useUpdate<Entity>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update<Entity>,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: <entityPlural>Keys.detail(id) });
      queryClient.invalidateQueries({ queryKey: <entityPlural>Keys.lists() });
    },
  });
}
```

**`useDelete<Entity>.ts`**:

```ts
async function delete<Entity>(id: number): Promise<void> {
  await axiosInstance.delete(`<endpoint>/${id}`);
}

export function useDelete<Entity>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delete<Entity>,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: <entityPlural>Keys.lists() });
      queryClient.removeQueries({ queryKey: <entityPlural>Keys.detail(id) });
    },
  });
}
```

### 8. Update `src/features/<feature>/index.ts`

Add exports for all newly created hooks and the keys factory. If the file doesn't exist, create it.

```ts
export * from "./api/keys";
export * from "./api/use<Entity>s"; // if list
export * from "./api/use<Entity>"; // if detail
export * from "./api/useCreate<Entity>"; // if create
export * from "./api/useUpdate<Entity>"; // if update
export * from "./api/useDelete<Entity>"; // if delete
export * from "./schemas/<entityLower>.schema"; // if schema file exists
```

Do not remove existing exports — only add new ones.

### 9. Verify

Run `npx tsc --noEmit`. Fix any type errors before finishing.
