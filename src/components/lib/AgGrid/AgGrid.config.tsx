import type { ColDef, GridOptions, Module } from "ag-grid-community";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  NumberEditorModule,
  NumberFilterModule,
  PaginationModule,
  RowSelectionModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";

/**
 * Default column definition applied to all columns unless overridden.
 * Merge with per-column ColDef to customize individual columns.
 */
export const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 100,
  filter: false,
  sortable: true,
  resizable: true,
  editable: false,
};

/**
 * Community edition modules registered with every AgGrid instance.
 *
 * Row grouping requires enterprise modules — pass them via the
 * `additionalModules` prop on the AgGrid component:
 *   import { RowGroupingModule } from "ag-grid-enterprise";
 *   <AgGrid additionalModules={[RowGroupingModule]} ... />
 */
export const BASE_MODULES: Module[] = [
  ClientSideRowModelModule,
  ColumnApiModule,
  PaginationModule,
  TextEditorModule,
  TextFilterModule,
  NumberEditorModule,
  NumberFilterModule,
  ValidationModule,
  CellStyleModule,
  RowSelectionModule,
];

/**
 * Base grid options applied to every AgGrid instance.
 * Individual usage can override these via props.
 */
export const baseGridOptions: GridOptions = {
  suppressPaginationPanel: true,
  groupDefaultExpanded: 1,
  suppressAggFuncInHeader: true,
  enableCellTextSelection: true,
};
