import { AgGrid } from "@components/lib";
import { useProducts } from "@features/products";
import type { Product } from "@features/products/schemas/product.schema";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
} from "@features/products/schemas/product.schema";
import Box from "@mui/material/Box";
import type { ColDef, ValueFormatterParams } from "ag-grid-community";
import { SelectEditorModule } from "ag-grid-community";
import { useMemo } from "react";

const ADDITIONAL_MODULES = [SelectEditorModule];

const priceFormatter = (params: ValueFormatterParams<Product, number>) =>
  params.value != null ? `$${params.value.toFixed(2)}` : "";

const dateFormatter = (params: ValueFormatterParams<Product, string>) =>
  params.value ? new Date(params.value).toLocaleDateString() : "";

const boolFormatter = (params: ValueFormatterParams<Product, boolean>) =>
  params.value ? "Yes" : "No";

export function AdminGrid() {
  const { data, isPending } = useProducts();

  const columnDefs = useMemo<ColDef<Product>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 72,
        editable: false,
        filter: "agNumberColumnFilter",
        sortable: true,
        pinned: "left",
      },
      {
        field: "name",
        headerName: "Name",
        flex: 2,
        minWidth: 160,
        editable: true,
        filter: "agTextColumnFilter",
      },
      {
        field: "category",
        headerName: "Category",
        minWidth: 160,
        editable: true,
        filter: "agTextColumnFilter",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: PRODUCT_CATEGORIES },
        // Enable row grouping when RowGroupingModule (enterprise) is provided
        enableRowGroup: true,
      },
      {
        field: "price",
        headerName: "Price",
        width: 110,
        editable: true,
        filter: "agNumberColumnFilter",
        cellEditor: "agNumberCellEditor",
        cellEditorParams: { min: 0, precision: 2 },
        valueFormatter: priceFormatter,
      },
      {
        field: "stock",
        headerName: "Stock",
        width: 100,
        editable: true,
        filter: "agNumberColumnFilter",
        cellEditor: "agNumberCellEditor",
        cellEditorParams: { min: 0 },
      },
      {
        field: "condition",
        headerName: "Condition",
        minWidth: 130,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: PRODUCT_CONDITIONS },
      },
      {
        field: "isFeatured",
        headerName: "Featured",
        width: 100,
        editable: false,
        valueFormatter: boolFormatter,
      },
      {
        field: "description",
        headerName: "Description",
        flex: 3,
        minWidth: 200,
        editable: true,
        tooltipField: "description",
      },
      {
        field: "createdAt",
        headerName: "Created At",
        minWidth: 130,
        editable: false,
        valueFormatter: dateFormatter,
        sort: "desc",
      },
    ],
    []
  );

  return (
    /*
     * height: 100% fills the AppLayout <main> area (flex: 1 1 0).
     * padding + display:flex+column lets AgGrid fill the padded space.
     * overflow: hidden prevents this container from scrolling;
     * the AG Grid viewport handles row virtualisation internally.
     */
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        overflow: "hidden",
      }}
    >
      <AgGrid<Product>
        columnDefs={columnDefs}
        rowData={data ?? null}
        loading={isPending}
        pagination={true}
        pageSize={20}
        pageSizeOptions={[10, 20, 50, 100]}
        additionalModules={ADDITIONAL_MODULES}
        noRowsMessage="No products found"
        rowGroupPanelShow="never"
        getRowId={params => String(params.data.id)}
      />
    </Box>
  );
}
