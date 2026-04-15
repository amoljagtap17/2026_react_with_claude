import InboxIcon from "@mui/icons-material/Inbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { CustomNoRowsOverlayProps } from "ag-grid-react";

export interface AgGridNoRowsOverlayParams {
  message?: string;
}

export function AgGridNoRowsOverlay(
  props: CustomNoRowsOverlayProps & AgGridNoRowsOverlayParams
) {
  return (
    <Box
      role="presentation"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        px: 3,
        py: 2,
        bgcolor: "background.paper",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: 1,
      }}
    >
      <InboxIcon sx={{ fontSize: 40, color: "text.disabled" }} />
      <Typography variant="body2" color="text.secondary">
        {props.message ?? "No rows to display"}
      </Typography>
    </Box>
  );
}
