# AgGrid Component Reference

The reusable wrapper lives in `src/components/lib/AgGrid/` and is exported from `@components/lib`.

```tsx
import { AgGrid } from "@components/lib";
```

---

## `AgGrid<TData>` Props

Extends all `AgGridReactProps<TData>` except the four props it manages internally (`noRowsOverlayComponent`, `noRowsOverlayComponentParams`, `suppressPaginationPanel`, `paginationPageSize`).

| Prop                 | Type                                                            | Default                | Notes                                                   |
| -------------------- | --------------------------------------------------------------- | ---------------------- | ------------------------------------------------------- |
| `columnDefs`         | `ColDef<TData>[]`                                               | —                      | **Required.** Column definitions                        |
| `rowData`            | `TData[] \| null`                                               | —                      | Pass `null` while loading; grid shows loading state     |
| `additionalModules`  | `Module[]`                                                      | `[]`                   | Enterprise modules; merged with BASE_MODULES internally |
| `pageSize`           | `number`                                                        | `20`                   | Initial rows per page                                   |
| `pageSizeOptions`    | `number[]`                                                      | `[10, 20, 50, 100]`    | Options shown in the custom pagination panel            |
| `noRowsMessage`      | `string`                                                        | `"No rows to display"` | Text shown in the no-rows overlay                       |
| `pagination`         | `boolean`                                                       | `false`                | Enables pagination + custom pagination panel            |
| `rowSelection`       | `RowSelectionOptions`                                           | —                      | See row selection section below                         |
| `onSelectionChanged` | `(event: SelectionChangedEvent<TData>) => void`                 | —                      | Fires after row selection changes                       |
| `getMainMenuItems`   | `(params: GetMainMenuItemsParams) => (string \| MenuItemDef)[]` | —                      | Overrides default column menu (sort + columns submenu)  |
| `...rest`            | `AgGridReactProps<TData>`                                       | —                      | Any other AG Grid prop passes through unchanged         |

---

## BASE_MODULES (always included)

These modules are registered in the wrapper — **do not re-add them** in `additionalModules`:

`ClientSideRowModelModule`, `ColumnApiModule`, `PaginationModule`, `TextEditorModule`, `TextFilterModule`, `NumberEditorModule`, `NumberFilterModule`, `ValidationModule`, `CellStyleModule`, `RowSelectionModule`

---

## Enterprise Modules (add via `additionalModules`)

Import from `ag-grid-enterprise`:

| Scenario        | Modules to add                        |
| --------------- | ------------------------------------- |
| Row grouping    | `RowGroupingModule`, `TreeDataModule` |
| Dropdown editor | `SelectEditorModule`                  |

```ts
import {
  RowGroupingModule,
  SelectEditorModule,
  TreeDataModule,
} from "ag-grid-enterprise";

const ADDITIONAL_MODULES = [
  SelectEditorModule,
  RowGroupingModule,
  TreeDataModule,
];
```

Define the array as a module-level constant (not inside the component) to keep it referentially stable.

---

## Default Column Def (applied to every column)

```ts
{
  flex: 1,
  minWidth: 100,
  filter: false,
  sortable: true,
  resizable: true,
  editable: false,
}
```

Override per column with `ColDef.sortable`, `ColDef.resizable`, etc.

---

## Column Definition Recipes

### Text column

```ts
{ field: "name", headerName: "Name" }
```

### Number column

```ts
{ field: "quantity", headerName: "Quantity", type: "numericColumn" }
```

### Currency column

```ts
{
  field: "price",
  headerName: "Price",
  type: "numericColumn",
  valueFormatter: (p) => (p.value != null ? `$${Number(p.value).toFixed(2)}` : ""),
}
```

### Boolean column

```ts
{
  field: "isFeatured",
  headerName: "Featured",
  valueFormatter: (p) => (p.value ? "Yes" : "No"),
}
```

### Date column

```ts
{
  field: "createdAt",
  headerName: "Created",
  valueFormatter: (p) =>
    p.value ? new Date(p.value as string).toLocaleDateString() : "",
}
```

### Enum / Select editor column

```ts
{
  field: "status",
  headerName: "Status",
  cellEditor: "agSelectCellEditor",
  cellEditorParams: { values: STATUS_OPTIONS },   // string[]
  editable: true,
}
```

### Row grouping column (hidden from main view)

```ts
{
  field: "category",
  headerName: "Category",
  rowGroup: true,
  hide: true,
}
```

### Editable only when row is selected

```ts
{
  field: "name",
  headerName: "Name",
  editable: (params) => !!params.node.isSelected(),
}
```

**Important:** When using selection-gated editing, call `event.api.refreshCells({ force: true })` inside `onSelectionChanged` so the editable state updates immediately.

---

## Row Selection Config

```ts
// Single-row checkbox selection
rowSelection={{ mode: "singleRow", checkboxes: true }}

// Multi-row checkbox selection (no click-to-select)
rowSelection={{
  mode: "multiRow",
  checkboxes: true,
  headerCheckbox: true,
  enableClickSelection: false,
}}
```

Track selected rows in local state:

```tsx
const [selectedRows, setSelectedRows] = useState<EntityType[]>([]);

<AgGrid onSelectionChanged={e => setSelectedRows(e.api.getSelectedRows())} />;
```

---

## Row Grouping Config

```tsx
<AgGrid
  additionalModules={[RowGroupingModule, TreeDataModule]}
  groupDisplayType="singleColumn"
  groupDefaultExpanded={1} // already set in baseGridOptions
  suppressAggFuncInHeader // already set in baseGridOptions
  autoGroupColumnDef={{
    headerName: "Category",
    minWidth: 180,
    cellRendererParams: { suppressCount: false },
  }}
  columnDefs={columns} // grouping col has rowGroup:true, hide:true
/>
```

---

## Toolbar Pattern

Place the toolbar above the grid inside a flex-column container so the grid fills remaining height:

```tsx
<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
  {/* Toolbar */}
  <Box sx={{ display: "flex", gap: 1, p: 1, borderBottom: 1, borderColor: "divider" }}>
    <Button variant="contained" size="small" onClick={onAdd}>
      Add
    </Button>
    <Button
      variant="outlined"
      size="small"
      disabled={selectedRows.length !== 1}
      onClick={onUpdate}
    >
      Update
    </Button>
    <Button
      variant="outlined"
      size="small"
      color="error"
      disabled={selectedRows.length === 0}
      onClick={onDelete}
    >
      Delete
    </Button>
  </Box>

  {/* Grid fills remaining space */}
  <Box sx={{ flex: 1 }}>
    <AgGrid ... />
  </Box>
</Box>
```

Toolbar button disabled logic:

- **Add** — always enabled
- **Update** — enabled only when exactly 1 row is selected (`selectedRows.length === 1`)
- **Delete** — enabled when 1 or more rows are selected (`selectedRows.length > 0`)

---

## `getRowId` (required for optimistic updates / mutations)

```ts
<AgGrid getRowId={(params) => String(params.data.id)} />
```

Always provide `getRowId` when the grid data comes from a TanStack Query mutation that invalidates the cache — it prevents row flicker on re-fetch.
