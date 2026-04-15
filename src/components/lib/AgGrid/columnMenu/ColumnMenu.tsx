import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import type { ColDef, GridApi } from "ag-grid-community";
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

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{ paper: { sx: { width: 240 } } }}
    >
      {/* Sort section */}
      <List dense disablePadding sx={{ pt: 0.5 }}>
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
      </List>

      <Divider />

      {/* Column visibility section */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Columns
        </Typography>
      </Box>

      <List
        dense
        disablePadding
        sx={{ pb: 0.5, maxHeight: 300, overflow: "auto" }}
      >
        {columns.length === 0 ? (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" color="text.disabled">
              No columns available
            </Typography>
          </Box>
        ) : (
          columns.map(col => (
            <ColumnMenuItem
              key={col.colId}
              colId={col.colId}
              headerName={col.headerName}
              visible={col.visible}
              onVisibilityChange={handleVisibilityChange}
            />
          ))
        )}
      </List>
    </Popover>
  );
}
