# Grid Skill

Scaffolds a `<Name>Grid/` component folder that wraps the project's reusable `AgGrid` component from `@components/lib`.

**NOT in scope:** API query hooks, Zustand store entries, drawer/form integration. Those are done separately.

---

## Arguments

`<GridName> for <feature> [with columns: <column descriptions>] [with features: <feature list>]`

Examples:

- `OrderGrid for orders with columns: id (number), customerName (string), total (currency), status (enum: pending/shipped/delivered), createdAt (date) with features: row-selection, toolbar`
- `InventoryGrid for inventory with columns: sku (string), name (string), quantity (integer), reorderLevel (integer) with features: row-grouping`

Available features: `row-selection`, `multi-row-selection`, `row-grouping`, `toolbar`

---

## Output

Creates 2 files inside `src/features/<feature>/components/<Name>Grid/`:

```
<Name>Grid/
├── <Name>GridColumns.ts   ← ColDef[] array with formatters, editors, grouping config
└── index.tsx              ← grid component: data wiring, toolbar, AgGrid usage
```

---

## Steps

### 1. Parse arguments

Extract:

- **`<Name>`** — PascalCase grid name (e.g. `OrderGrid`, `InventoryGrid`)
- **`<feature>`** — target feature folder under `src/features/`
- **Column hints** — list of column names and types if provided
- **Features** — set of optional capabilities: `row-selection`, `multi-row-selection`, `row-grouping`, `toolbar`

### 2. Read canonical examples

Read `examples.md` (in this skill folder) for the complete AdminGrid reference implementation.

### 3. Read component API

Read `reference.md` (in this skill folder) for the full `AgGrid` props interface, column definition patterns, and formatting/editing recipes.

### 4. Check for an existing data hook

Look for a query hook in `src/features/<feature>/api/use<Entity>.ts` or `use<Entity>s.ts`.

- If found → import and use it for `rowData`
- If not found → leave `rowData` as `[]` with a `// TODO: wire up data hook` comment

### 5. Create `<Name>GridColumns.ts`

Define `export const <NAME>_GRID_COLUMNS: ColDef<T>[] = [...]`.

- Use `ColDef<EntityType>` if the entity type is importable from the feature's `index.ts`; otherwise use `ColDef` (untyped)
- Apply formatting valueFormatters per column type (see `reference.md`)
- For `row-grouping`: set `rowGroup: true, hide: true` on the grouping column
- For editable grids: set `editable: (params) => !!params.node.isSelected()` per column
- For enum columns: use `cellEditor: "agSelectCellEditor"` with `cellEditorParams: { values: [...] }`

### 6. Create `index.tsx`

The grid component renders the toolbar (if requested) + `<AgGrid>`. It:

- Imports `AgGrid` from `@components/lib`
- Imports `<NAME>_GRID_COLUMNS` from `./<Name>GridColumns`
- Accepts `rowData` as a prop (or pulls it from a query hook if one was found)
- Passes `additionalModules` for enterprise features (row grouping requires `RowGroupingModule`, `TreeDataModule`)
- Manages selected rows in local state if `row-selection` or `multi-row-selection` is requested

**Minimal grid (no toolbar, no selection):**

```tsx
export function <Name>Grid() {
  return (
    <AgGrid<EntityType>
      columnDefs={<NAME>_GRID_COLUMNS}
      rowData={rowData}
      pagination
      pageSize={20}
    />
  );
}
```

**With row selection:**

```tsx
const [selectedRows, setSelectedRows] = useState<EntityType[]>([]);

<AgGrid
  rowSelection={{
    mode: "multiRow",
    checkboxes: true,
    headerCheckbox: true,
    enableClickSelection: false,
  }}
  onSelectionChanged={e => setSelectedRows(e.api.getSelectedRows())}
/>;
```

**With row grouping:**

```tsx
import { RowGroupingModule, TreeDataModule } from "ag-grid-enterprise";

const ADDITIONAL_MODULES = [RowGroupingModule, TreeDataModule];

<AgGrid
  additionalModules={ADDITIONAL_MODULES}
  groupDisplayType="singleColumn"
  autoGroupColumnDef={{ headerName: "Group", minWidth: 200 }}
/>;
```

**Toolbar pattern** (Add / Update / Delete):

```tsx
<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
  <Box sx={{ display: "flex", gap: 1, p: 1, borderBottom: 1, borderColor: "divider" }}>
    <Button variant="contained" size="small" onClick={onAdd}>Add</Button>
    <Button variant="outlined" size="small" disabled={selectedRows.length !== 1} onClick={onUpdate}>Update</Button>
    <Button variant="outlined" size="small" color="error" disabled={selectedRows.length === 0} onClick={onDelete}>Delete</Button>
  </Box>
  <Box sx={{ flex: 1 }}>
    <AgGrid ... />
  </Box>
</Box>
```

### 7. Verify

Run `npx tsc --noEmit`. Fix any type errors before finishing.
