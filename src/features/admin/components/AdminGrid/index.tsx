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
import { RowGroupingModule, TreeDataModule } from "ag-grid-enterprise";
import { useMemo } from "react";

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
        editable: true,
      },
      {
        field: "category",
        headerName: "Category",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: PRODUCT_CATEGORIES },
        rowGroup: true,
        hide: true,
      },
      {
        field: "price",
        headerName: "Price",
        editable: true,
        cellEditor: "agNumberCellEditor",
        cellEditorParams: { min: 0, precision: 2 },
        valueFormatter: priceFormatter,
      },
      {
        field: "stock",
        headerName: "Stock",
        editable: true,
        cellEditor: "agNumberCellEditor",
        cellEditorParams: { min: 0 },
      },
      {
        field: "condition",
        headerName: "Condition",
        editable: true,
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
        editable: true,
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

  return (
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
        getRowId={params => String(params.data.id)}
        groupDisplayType="singleColumn"
        autoGroupColumnDef={{
          headerName: "Category",
          minWidth: 180,
          cellRendererParams: { suppressCount: false },
        }}
      />
    </Box>
  );
}
