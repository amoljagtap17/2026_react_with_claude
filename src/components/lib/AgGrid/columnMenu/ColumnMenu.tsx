import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import type { ColDef, GridApi } from "ag-grid-community";
import type { MouseEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { ColumnMenuItem } from "./ColumnMenuItem";

interface ColumnEntry {
  colId: string;
  headerName: string;
  visible: boolean;
}

export interface ColumnMenuProps {
  gridApi: GridApi | null;
  anchorEl: HTMLElement | null;
  colId: string | null;
  currentSort: "asc" | "desc" | null;
  onClose: () => void;
}

function readColumns(gridApi: GridApi): ColumnEntry[] {
  const cols = gridApi.getColumns();
  if (!cols) return [];

  return cols.map(col => {
    const colDef = col.getColDef() as ColDef;
    return {
      colId: col.getColId(),
      headerName: colDef.headerName ?? colDef.field ?? col.getColId(),
      visible: col.isVisible(),
    };
  });
}

export function ColumnMenu({
  gridApi,
  anchorEl,
  colId,
  currentSort,
  onClose,
}: ColumnMenuProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [columnsAnchorEl, setColumnsAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const columns = useMemo<ColumnEntry[]>(() => {
    if (!anchorEl || !gridApi) return [];
    return readColumns(gridApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorEl, gridApi, refreshKey]);

  const handleSortAsc = useCallback(() => {
    if (!colId || !gridApi) return;
    gridApi.applyColumnState({
      state: [{ colId, sort: "asc" }],
      defaultState: { sort: null },
    });
    setRefreshKey(k => k + 1);
  }, [colId, gridApi]);

  const handleSortDesc = useCallback(() => {
    if (!colId || !gridApi) return;
    gridApi.applyColumnState({
      state: [{ colId, sort: "desc" }],
      defaultState: { sort: null },
    });
    setRefreshKey(k => k + 1);
  }, [colId, gridApi]);

  const handleVisibilityChange = useCallback(
    (id: string, visible: boolean) => {
      gridApi?.applyColumnState({ state: [{ colId: id, hide: !visible }] });
      setRefreshKey(k => k + 1);
    },
    [gridApi]
  );

  const handleColumnsOpen = (e: MouseEvent<HTMLElement>) => {
    setColumnsAnchorEl(e.currentTarget);
  };

  const handleColumnsClose = () => setColumnsAnchorEl(null);

  const handleMainClose = () => {
    setColumnsAnchorEl(null);
    onClose();
  };

  return (
    <>
      {/* Main menu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMainClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 220 } } }}
      >
        <List dense disablePadding sx={{ py: 0.5 }}>
          <ListItemButton
            onClick={handleSortAsc}
            disabled={currentSort === "asc"}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowUpwardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sort Ascending" />
          </ListItemButton>

          <ListItemButton
            onClick={handleSortDesc}
            disabled={currentSort === "desc"}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowDownwardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sort Descending" />
          </ListItemButton>

          <Divider sx={{ my: 0.5 }} />

          <ListItemButton onClick={handleColumnsOpen}>
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={500}>
                  Columns
                </Typography>
              }
            />
            <ChevronRightIcon
              fontSize="small"
              sx={{ color: "text.secondary" }}
            />
          </ListItemButton>
        </List>
      </Popover>

      {/* Columns submenu */}
      <Popover
        open={Boolean(columnsAnchorEl)}
        anchorEl={columnsAnchorEl}
        onClose={handleColumnsClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableRestoreFocus
        slotProps={{ paper: { sx: { width: 200 } } }}
      >
        <List
          dense
          disablePadding
          sx={{ py: 0.5, maxHeight: 320, overflow: "auto" }}
        >
          {columns.map(col => (
            <ColumnMenuItem
              key={col.colId}
              colId={col.colId}
              headerName={col.headerName}
              visible={col.visible}
              onVisibilityChange={handleVisibilityChange}
            />
          ))}
        </List>
      </Popover>
    </>
  );
}
