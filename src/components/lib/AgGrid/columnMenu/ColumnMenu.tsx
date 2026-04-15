import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import type { ColDef, GridApi } from "ag-grid-community";
import { useCallback, useMemo, useState } from "react";
import { ColumnMenuItem } from "./ColumnMenuItem";

interface ColumnEntry {
  colId: string;
  headerName: string;
  visible: boolean;
  sortDirection: "asc" | "desc" | null;
}

export interface ColumnMenuProps {
  gridApi: GridApi | null;
  anchorEl: HTMLElement | null;
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
      sortDirection:
        (col.getSort() as "asc" | "desc" | null | undefined) ?? null,
    };
  });
}

export function ColumnMenu({ gridApi, anchorEl, onClose }: ColumnMenuProps) {
  // Incrementing this re-reads column state from the grid after each action
  const [refreshKey, setRefreshKey] = useState(0);

  // Columns are derived from grid state — re-computed whenever the popover
  // opens (anchorEl changes) or after a visibility/sort mutation (refreshKey++).
  const columns = useMemo<ColumnEntry[]>(() => {
    if (!anchorEl || !gridApi) return [];
    return readColumns(gridApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorEl, gridApi, refreshKey]);

  const handleVisibilityChange = useCallback(
    (colId: string, visible: boolean) => {
      gridApi?.applyColumnState({ state: [{ colId, hide: !visible }] });
      setRefreshKey(k => k + 1);
    },
    [gridApi]
  );

  const handleSortChange = useCallback(
    (colId: string, direction: "asc" | "desc" | null) => {
      gridApi?.applyColumnState({
        state: [{ colId, sort: direction }],
        defaultState: { sort: null },
      });
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
      slotProps={{ paper: { sx: { width: 280 } } }}
    >
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Column Settings
        </Typography>
      </Box>

      <Divider />

      <List
        dense
        disablePadding
        sx={{ py: 0.5, maxHeight: 360, overflow: "auto" }}
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
              sortDirection={col.sortDirection}
              onVisibilityChange={handleVisibilityChange}
              onSortChange={handleSortChange}
            />
          ))
        )}
      </List>
    </Popover>
  );
}
