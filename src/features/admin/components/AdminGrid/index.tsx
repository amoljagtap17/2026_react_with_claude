import { AgGrid } from "@components/lib";
import { useProducts } from "@features/products";
import type { Product } from "@features/products/schemas/product.schema";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
} from "@features/products/schemas/product.schema";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useUiStore } from "@stores/uiStore";
import type {
  ColDef,
  SelectionChangedEvent,
  ValueFormatterParams,
} from "ag-grid-community";
import { SelectEditorModule } from "ag-grid-community";
import { RowGroupingModule, TreeDataModule } from "ag-grid-enterprise";
import { useCallback, useMemo, useState } from "react";
import { useDeleteProduct } from "../../api/useDeleteProduct";
import { ProductDrawer } from "../ProductDrawer";

const ADDITIONAL_MODULES = [
  SelectEditorModule,
  RowGroupingModule,
  TreeDataModule,
];

const priceFormatter = (params: ValueFormatterParams<Product, number>) =>
  params.value != null ? `$${params.value.toFixed(2)}` : "";

const dateFormatter = (params: ValueFormatterParams<Product, string>) =>
  params.value ? new Date(params.value).toLocaleDateString() : "";

const boolFormatter = (params: ValueFormatterParams<Product, boolean>) =>
  params.value ? "Yes" : "No";

export function AdminGrid() {
  const { data, isPending } = useProducts();
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);

  const {
    isDrawerOpen,
    drawerMode,
    openAddDrawer,
    openUpdateDrawer,
    closeDrawer,
  } = useUiStore();

  const { mutate: deleteProduct } = useDeleteProduct();

  // Always resolve from the live query data so the drawer shows the
  // latest values after a mutation + refetch, not a stale selection snapshot.
  const editingProduct =
    drawerMode === "update" && selectedRows[0]
      ? data?.find(p => p.id === selectedRows[0].id)
      : undefined;

  const columnDefs = useMemo<ColDef<Product>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        editable: false,
      },
      {
        field: "name",
        headerName: "Name",
        editable: params => !!params.node.isSelected(),
      },
      {
        field: "category",
        headerName: "Category",
        editable: params => !!params.node.isSelected(),
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: PRODUCT_CATEGORIES },
        rowGroup: true,
        hide: true,
      },
      {
        field: "price",
        headerName: "Price",
        editable: params => !!params.node.isSelected(),
        cellEditor: "agNumberCellEditor",
        cellEditorParams: { min: 0, precision: 2 },
        valueFormatter: priceFormatter,
      },
      {
        field: "stock",
        headerName: "Stock",
        editable: params => !!params.node.isSelected(),
        cellEditor: "agNumberCellEditor",
        cellEditorParams: { min: 0 },
      },
      {
        field: "condition",
        headerName: "Condition",
        editable: params => !!params.node.isSelected(),
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: PRODUCT_CONDITIONS },
      },
      {
        field: "isFeatured",
        headerName: "Featured",
        editable: false,
        valueFormatter: boolFormatter,
      },
      {
        field: "description",
        headerName: "Description",
        editable: params => !!params.node.isSelected(),
        tooltipField: "description",
      },
      {
        field: "createdAt",
        headerName: "Created At",
        editable: false,
        valueFormatter: dateFormatter,
        sort: "desc",
      },
    ],
    []
  );

  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent<Product>) => {
      setSelectedRows(event.api.getSelectedRows());
      // Re-evaluate editable callbacks for all visible cells
      event.api.refreshCells({ force: true });
    },
    []
  );

  const handleDelete = () => {
    selectedRows.forEach(row => deleteProduct(row.id));
    setSelectedRows([]);
  };

  const canUpdate = selectedRows.length === 1;
  const canDelete = selectedRows.length > 0;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        gap: 1,
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={openAddDrawer}
        >
          Add
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
          disabled={!canUpdate}
          onClick={openUpdateDrawer}
        >
          Update
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={!canDelete}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>

      {/* Grid */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <AgGrid<Product>
          columnDefs={columnDefs}
          rowData={data ?? null}
          loading={isPending}
          pagination={true}
          pageSize={20}
          pageSizeOptions={[10, 20, 50, 100]}
          additionalModules={ADDITIONAL_MODULES}
          noRowsMessage="No products found"
          getRowId={params => String(params.data.id)}
          groupDisplayType="singleColumn"
          autoGroupColumnDef={{
            headerName: "Category",
            minWidth: 180,
            cellRendererParams: { suppressCount: false },
          }}
          rowSelection={{
            mode: "multiRow",
            checkboxes: true,
            headerCheckbox: true,
            enableClickSelection: false,
          }}
          onSelectionChanged={handleSelectionChanged}
        />
      </Box>

      {/* Drawer */}
      <ProductDrawer
        open={isDrawerOpen}
        mode={drawerMode}
        editingProduct={editingProduct}
        onClose={closeDrawer}
      />
    </Box>
  );
}
