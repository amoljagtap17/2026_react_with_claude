import { AppBar, Toolbar, Typography } from "@mui/material";

export function Footer() {
  return (
    <AppBar
      position="static"
      component="footer"
      sx={{ top: "auto", bottom: 0, mt: "auto" }}
    >
      <Toolbar variant="dense">
        <Typography variant="body2" sx={{ flexGrow: 1, textAlign: "center" }}>
          © {new Date().getFullYear()} Product Catalog Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
