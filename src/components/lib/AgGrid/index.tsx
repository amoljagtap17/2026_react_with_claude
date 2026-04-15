import Box from "@mui/material/Box";
import type {
  GridApi,
  GridReadyEvent,
  Module,
  PaginationChangedEvent,
} from "ag-grid-community";
import type { AgGridReactProps } from "ag-grid-react";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { BASE_MODULES, baseGridOptions, defaultColDef } from "./AgGrid.config";
import { AgGridNoRowsOverlay } from "./AgGridNoRowsOverlay";
import type { AgGridPaginationState } from "./AgGridPagination";
import { AgGridPagination } from "./AgGridPagination";
import { ColumnMenu } from "./columnMenu/ColumnMenu";

export interface AgGridProps<TData = unknown> extends Omit<
  AgGridReactProps<TData>,
  | "noRowsOverlayComponent"
  | "noRowsOverlayComponentParams"
  | "suppressPaginationPanel"
  | "paginationPageSize"
> {
  /**
   * Additional AG Grid modules (e.g. enterprise modules for row grouping).
   *
   * Row grouping example:
   *   import { RowGroupingModule } from "ag-grid-enterprise";
   *   <AgGrid additionalModules={[RowGroupingModule]} ... />
   */
  additionalModules?: Module[];

  /**
   * Default page size when pagination is enabled.
   * @default 20
   */
  pageSize?: number;

  /**
   * Page size options shown in the pagination dropdown.
   * @default [10, 20, 50, 100]
   */
  pageSizeOptions?: number[];

  /**
   * Message shown inside the no-rows overlay.
   * @default "No rows to display"
   */
  noRowsMessage?: string;

  /**
   * Show the column settings menu (visibility toggles + sort controls).
   * @default true
   */
  showColumnMenu?: boolean;
}

const INITIAL_PAGINATION_STATE: AgGridPaginationState = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 20,
  totalRows: 0,
};

/**
 * Reusable AG Grid wrapper with:
 * - MUI no-rows overlay
 * - MUI column settings menu (visibility + sort)
 * - MUI custom pagination panel
 * - Cell editing via TextEditorModule / NumberEditorModule
 * - Row grouping support via additionalModules prop (requires ag-grid-enterprise)
 */
export function AgGrid<TData = unknown>({
  additionalModules = [],
  pageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  noRowsMessage,
  showColumnMenu = true,
  pagination = false,
  defaultColDef: userDefaultColDef,
  onGridReady: userOnGridReady,
  onPaginationChanged: userOnPaginationChanged,
  ...restProps
}: AgGridProps<TData>) {
  const gridRef = useRef<AgGridReact<TData>>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [paginationState, setPaginationState] = useState<AgGridPaginationState>(
    { ...INITIAL_PAGINATION_STATE, pageSize }
  );

  const allModules = useMemo(
    () => [...BASE_MODULES, ...additionalModules],
    [additionalModules]
  );

  const mergedDefaultColDef = useMemo(
    () => ({ ...defaultColDef, ...userDefaultColDef }),
    [userDefaultColDef]
  );

  const handleGridReady = useCallback(
    (event: GridReadyEvent<TData>) => {
      setGridApi(event.api);
      userOnGridReady?.(event);
    },
    [userOnGridReady]
  );

  const handlePaginationChanged = useCallback(
    (event: PaginationChangedEvent<TData>) => {
      const api = event.api;
      setPaginationState({
        currentPage: api.paginationGetCurrentPage() + 1,
        totalPages: api.paginationGetTotalPages(),
        pageSize: api.paginationGetPageSize(),
        totalRows: api.paginationGetRowCount(),
      });
      userOnPaginationChanged?.(event);
    },
    [userOnPaginationChanged]
  );

  const handlePageChange = useCallback((page: number) => {
    gridRef.current?.api.paginationGoToPage(page - 1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    gridRef.current?.api.setGridOption("paginationPageSize", size);
  }, []);

  return (
    <AgGridProvider modules={allModules}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        {/* Column settings toolbar */}
        {showColumnMenu && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              px: 0.5,
              py: 0.25,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <ColumnMenu gridApi={gridApi} />
          </Box>
        )}

        {/* Grid area */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<TData>
            ref={gridRef}
            defaultColDef={mergedDefaultColDef}
            noRowsOverlayComponent={AgGridNoRowsOverlay}
            noRowsOverlayComponentParams={{ message: noRowsMessage }}
            suppressPaginationPanel
            paginationPageSize={pageSize}
            pagination={pagination}
            onGridReady={handleGridReady}
            onPaginationChanged={
              pagination ? handlePaginationChanged : userOnPaginationChanged
            }
            {...baseGridOptions}
            {...restProps}
          />
        </Box>

        {/* Custom MUI pagination panel */}
        {pagination && (
          <AgGridPagination
            paginationState={paginationState}
            pageSizeOptions={pageSizeOptions}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </Box>
    </AgGridProvider>
  );
}
