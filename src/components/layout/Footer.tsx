import { AppBar, Toolbar, Typography } from "@mui/material";

export function Footer() {
  return (
    <AppBar
      position="static"
      component="footer"
      elevation={0}
      sx={{ borderTop: "1px solid", borderColor: "divider" }}
    >
      <Toolbar variant="dense">
        <Typography variant="body2" sx={{ flexGrow: 1, opacity: 0.8 }}>
          © {new Date().getFullYear()} Product Catalog Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
