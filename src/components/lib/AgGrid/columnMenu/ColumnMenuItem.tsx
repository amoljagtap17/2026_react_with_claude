import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export interface ColumnMenuItemProps {
  colId: string;
  headerName: string;
  visible: boolean;
  sortDirection: "asc" | "desc" | null;
  onVisibilityChange: (colId: string, visible: boolean) => void;
  onSortChange: (colId: string, direction: "asc" | "desc" | null) => void;
}

export function ColumnMenuItem({
  colId,
  headerName,
  visible,
  sortDirection,
  onVisibilityChange,
  onSortChange,
}: ColumnMenuItemProps) {
  const handleAscClick = () => {
    onSortChange(colId, sortDirection === "asc" ? null : "asc");
  };

  const handleDescClick = () => {
    onSortChange(colId, sortDirection === "desc" ? null : "desc");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1,
        py: 0.25,
        "&:hover": { bgcolor: "action.hover" },
        borderRadius: 1,
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={visible}
            onChange={e => onVisibilityChange(colId, e.target.checked)}
            size="small"
            sx={{ py: 0.5 }}
          />
        }
        label={
          <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
            {headerName}
          </Typography>
        }
        sx={{ flex: 1, mr: 0, minWidth: 0 }}
      />

      <Box sx={{ display: "flex", gap: 0.25, flexShrink: 0 }}>
        <Tooltip title="Sort ascending" placement="top">
          <IconButton
            size="small"
            onClick={handleAscClick}
            color={sortDirection === "asc" ? "primary" : "default"}
            aria-label={`Sort ${headerName} ascending`}
            aria-pressed={sortDirection === "asc"}
          >
            <ArrowUpwardIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Sort descending" placement="top">
          <IconButton
            size="small"
            onClick={handleDescClick}
            color={sortDirection === "desc" ? "primary" : "default"}
            aria-label={`Sort ${headerName} descending`}
            aria-pressed={sortDirection === "desc"}
          >
            <ArrowDownwardIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
