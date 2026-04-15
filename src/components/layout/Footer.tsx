import { AppBar, Container, Toolbar, Typography } from "@mui/material";

export function Footer() {
  return (
    <AppBar
      position="static"
      component="footer"
      elevation={0}
      sx={{ borderTop: "1px solid", borderColor: "divider" }}
    >
      <Container maxWidth="xl">
        <Toolbar variant="dense" disableGutters>
          <Typography variant="body2" sx={{ flexGrow: 1, opacity: 0.8 }}>
            © {new Date().getFullYear()} Product Catalog Dashboard
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
