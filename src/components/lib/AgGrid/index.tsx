import Box from "@mui/material/Box";
import type {
  ColDef,
  GetMainMenuItemsParams,
  GridReadyEvent,
  MenuItemDef,
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
import { ColumnMenuItem } from "./columnMenu/ColumnMenuItem";
import { CustomHeader } from "./columnMenu/CustomHeader";

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
}

const INITIAL_PAGINATION_STATE: AgGridPaginationState = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 20,
  totalRows: 0,
};

/**
 * Default column menu: Sort Ascending, Sort Descending, separator, then a
 * "Columns" submenu where each entry renders via ColumnMenuItem (checkbox +
 * label) to toggle column visibility.
 *
 * Requires enterprise ColumnMenuModule to actually fire at runtime; wired here
 * so the grid is ready when enterprise is added.
 */
function defaultGetMainMenuItems(
  params: GetMainMenuItemsParams
): (string | MenuItemDef)[] {
  const { column, api } = params;
  const colId = column!.getColId();
  const currentSort =
    (column!.getSort() as "asc" | "desc" | null | undefined) ?? null;

  const sortAsc: MenuItemDef = {
    name: "Sort Ascending",
    disabled: currentSort === "asc",
    action: () =>
      api.applyColumnState({
        state: [{ colId, sort: "asc" }],
        defaultState: { sort: null },
      }),
  };

  const sortDesc: MenuItemDef = {
    name: "Sort Descending",
    disabled: currentSort === "desc",
    action: () =>
      api.applyColumnState({
        state: [{ colId, sort: "desc" }],
        defaultState: { sort: null },
      }),
  };

  const columnSubMenuItems: MenuItemDef[] = (api.getColumns() ?? []).map(
    col => {
      const def = col.getColDef() as ColDef;
      const id = col.getColId();
      const headerName = def.headerName ?? def.field ?? id;
      const visible = col.isVisible();
      return {
        name: headerName,
        menuItem: ColumnMenuItem,
        menuItemParams: {
          colId: id,
          headerName,
          visible,
          onVisibilityChange: (changedColId: string, isVisible: boolean) => {
            api.applyColumnState({
              state: [{ colId: changedColId, hide: !isVisible }],
            });
          },
        },
        suppressCloseOnSelect: true,
      };
    }
  );

  const columnsMenu: MenuItemDef = {
    name: "Columns",
    subMenu: columnSubMenuItems,
  };

  return [sortAsc, sortDesc, "separator", columnsMenu];
}

/**
 * Reusable AG Grid wrapper with:
 * - MUI no-rows overlay (plain text)
 * - Custom column header: sort indicator + MoreVert column-settings menu
 * - MUI custom pagination panel
 * - Cell editing via TextEditorModule / NumberEditorModule
 * - Row grouping support via additionalModules prop (requires ag-grid-enterprise)
 * - getMainMenuItems wired with sort + column-visibility defaults
 *   (fires when enterprise ColumnMenuModule is present)
 */
export function AgGrid<TData = unknown>({
  additionalModules = [],
  pageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  noRowsMessage,
  pagination = false,
  defaultColDef: userDefaultColDef,
  onGridReady: userOnGridReady,
  onPaginationChanged: userOnPaginationChanged,
  getMainMenuItems: userGetMainMenuItems,
  ...restProps
}: AgGridProps<TData>) {
  const gridRef = useRef<AgGridReact<TData>>(null);
  const [paginationState, setPaginationState] = useState<AgGridPaginationState>(
    { ...INITIAL_PAGINATION_STATE, pageSize }
  );

  const allModules = useMemo(
    () => [...BASE_MODULES, ...additionalModules],
    [additionalModules]
  );

  const mergedDefaultColDef = useMemo(
    () => ({
      ...defaultColDef,
      headerComponent: CustomHeader,
      ...userDefaultColDef,
    }),
    [userDefaultColDef]
  );

  const handleGridReady = useCallback(
    (event: GridReadyEvent<TData>) => {
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
            getMainMenuItems={userGetMainMenuItems ?? defaultGetMainMenuItems}
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
