import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router";

const NAV_LINKS = [
  { label: "Dashboard", to: "/" },
  { label: "Admin", to: "/admin" },
];

export function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, letterSpacing: "0.02em" }}
        >
          Product Catalog
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {NAV_LINKS.map(({ label, to }) => (
            <Button
              key={to}
              color="inherit"
              component={NavLink}
              to={to}
              sx={{
                borderRadius: 2,
                px: 2,
                "&.active": {
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  fontWeight: 600,
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
