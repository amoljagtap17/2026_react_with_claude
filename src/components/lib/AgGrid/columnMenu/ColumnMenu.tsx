import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { ColDef, GridApi } from "ag-grid-community";
import { useCallback, useState } from "react";
import { ColumnMenuItem } from "./ColumnMenuItem";

interface ColumnEntry {
  colId: string;
  headerName: string;
  visible: boolean;
  sortDirection: "asc" | "desc" | null;
}

export interface ColumnMenuProps {
  gridApi: GridApi | null;
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

export function ColumnMenu({ gridApi }: ColumnMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [columns, setColumns] = useState<ColumnEntry[]>([]);

  const refreshColumns = useCallback(() => {
    if (!gridApi) return;
    setColumns(readColumns(gridApi));
  }, [gridApi]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    refreshColumns();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVisibilityChange = useCallback(
    (colId: string, visible: boolean) => {
      gridApi?.applyColumnState({ state: [{ colId, hide: !visible }] });
      refreshColumns();
    },
    [gridApi, refreshColumns]
  );

  const handleSortChange = useCallback(
    (colId: string, direction: "asc" | "desc" | null) => {
      gridApi?.applyColumnState({
        state: [{ colId, sort: direction }],
        defaultState: { sort: null },
      });
      refreshColumns();
    },
    [gridApi, refreshColumns]
  );

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Column settings">
        <span>
          <IconButton
            size="small"
            onClick={handleOpen}
            disabled={!gridApi}
            aria-label="Open column settings"
            aria-haspopup="true"
            aria-expanded={open}
          >
            <ViewColumnIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
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
    </>
  );
}
