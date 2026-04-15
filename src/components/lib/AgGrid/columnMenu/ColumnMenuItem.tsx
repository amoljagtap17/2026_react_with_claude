import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

export interface ColumnMenuItemProps {
  colId: string;
  headerName: string;
  visible: boolean;
  onVisibilityChange: (colId: string, visible: boolean) => void;
}

export function ColumnMenuItem({
  colId,
  headerName,
  visible,
  onVisibilityChange,
}: ColumnMenuItemProps) {
  return (
    <ListItem disablePadding sx={{ px: 1, py: 0 }}>
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
          <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
            {headerName}
          </Typography>
        }
        sx={{ flex: 1, mr: 0, minWidth: 0 }}
      />
    </ListItem>
  );
}
