# Grid Skill — Canonical Example

## The Reference Implementation: AdminGrid

The `AdminGrid` is the complete working reference for this pattern. Read these files before generating any new grid:

```
src/features/admin/components/AdminGrid/index.tsx
src/components/lib/AgGrid/index.tsx
src/components/lib/AgGrid/AgGrid.config.tsx
```

---

## Key Patterns to Notice

### Module-level constants (outside the component)

```ts
// GOOD — defined once, referentially stable
const ADDITIONAL_MODULES = [
  SelectEditorModule,
  RowGroupingModule,
  TreeDataModule,
];

// BAD — re-created on every render, causes AgGrid to re-register modules
function MyGrid() {
  const modules = [RowGroupingModule]; // ← never do this
}
```

### Column definitions file (`<Name>GridColumns.ts`)

Separating columns from the component keeps `index.tsx` readable. Column defs are typed with the entity type:

```ts
import type { ColDef } from "ag-grid-react";
import type { Product } from "@features/products";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
} from "@features/products/schemas/product.schema";

export const ADMIN_GRID_COLUMNS: ColDef<Product>[] = [
  {
    field: "name",
    headerName: "Name",
    minWidth: 150,
    editable: p => !!p.node.isSelected(),
  },
  {
    field: "category",
    headerName: "Category",
    rowGroup: true,
    hide: true,
  },
  {
    field: "price",
    headerName: "Price",
    type: "numericColumn",
    valueFormatter: p =>
      p.value != null ? `$${Number(p.value).toFixed(2)}` : "",
    editable: p => !!p.node.isSelected(),
  },
  {
    field: "stock",
    headerName: "Stock",
    type: "numericColumn",
    editable: p => !!p.node.isSelected(),
  },
  {
    field: "condition",
    headerName: "Condition",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: PRODUCT_CONDITIONS },
    editable: p => !!p.node.isSelected(),
  },
  {
    field: "isFeatured",
    headerName: "Featured",
    valueFormatter: p => (p.value ? "Yes" : "No"),
  },
  {
    field: "createdAt",
    headerName: "Created",
    valueFormatter: p =>
      p.value ? new Date(p.value as string).toLocaleDateString() : "",
  },
];
```

### `index.tsx` — full grid component with toolbar and selection

```tsx
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SelectEditorModule } from "ag-grid-enterprise";
import { RowGroupingModule, TreeDataModule } from "ag-grid-enterprise";
import type { SelectionChangedEvent } from "ag-grid-react";
import { AgGrid } from "@components/lib";
import { useProducts } from "@features/products";
import type { Product } from "@features/products";
import { ADMIN_GRID_COLUMNS } from "./AdminGridColumns";

const ADDITIONAL_MODULES = [
  SelectEditorModule,
  RowGroupingModule,
  TreeDataModule,
];

export function AdminGrid() {
  const { data } = useProducts();
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);

  function handleSelectionChanged(event: SelectionChangedEvent<Product>) {
    setSelectedRows(event.api.getSelectedRows());
    // Refresh editable state immediately after selection changes
    event.api.refreshCells({ force: true });
  }

  // Derive the editing target from live query data, not from the selection snapshot
  const editingProduct =
    selectedRows.length === 1
      ? (data?.find(p => p.id === selectedRows[0].id) ?? null)
      : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Button variant="contained" size="small" onClick={openAddDrawer}>
          Add
        </Button>
        <Button
          variant="outlined"
          size="small"
          disabled={selectedRows.length !== 1}
          onClick={openUpdateDrawer}
        >
          Update
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          disabled={selectedRows.length === 0}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>

      {/* Grid */}
      <Box sx={{ flex: 1 }}>
        <AgGrid<Product>
          columnDefs={ADMIN_GRID_COLUMNS}
          rowData={data ?? null}
          pagination
          pageSize={20}
          additionalModules={ADDITIONAL_MODULES}
          getRowId={params => String(params.data.id)}
          rowSelection={{
            mode: "multiRow",
            checkboxes: true,
            headerCheckbox: true,
            enableClickSelection: false,
          }}
          onSelectionChanged={handleSelectionChanged}
          groupDisplayType="singleColumn"
          autoGroupColumnDef={{
            headerName: "Category",
            minWidth: 180,
            cellRendererParams: { suppressCount: false },
          }}
        />
      </Box>
    </Box>
  );
}
```

### Why `editingProduct` is derived from query data (not selection state)

After a mutation (update), TanStack Query invalidates and re-fetches. The `selectedRows` state snapshot holds stale data from the time the row was clicked. Looking up the product by ID in the live `data` array ensures the update drawer always opens with current values:

```ts
// CORRECT — always fresh from the cache
const editingProduct = data?.find(p => p.id === selectedRows[0].id) ?? null;

// WRONG — stale snapshot, shows pre-update values after a mutation
const editingProduct = selectedRows[0];
```
