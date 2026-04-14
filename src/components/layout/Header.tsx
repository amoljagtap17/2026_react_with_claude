import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router";

const NAV_LINKS = [
  { label: "Dashboard", to: "/" },
  { label: "Admin", to: "/admin" },
];

export function Header() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
                "&.active": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: 1,
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
