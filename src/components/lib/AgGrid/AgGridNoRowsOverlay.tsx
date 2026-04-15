import Typography from "@mui/material/Typography";
import type { CustomNoRowsOverlayProps } from "ag-grid-react";

export interface AgGridNoRowsOverlayParams {
  message?: string;
}

export function AgGridNoRowsOverlay(
  props: CustomNoRowsOverlayProps & AgGridNoRowsOverlayParams
) {
  return (
    <Typography variant="body2" color="text.secondary">
      {props.message ?? "No rows to display"}
    </Typography>
  );
}
