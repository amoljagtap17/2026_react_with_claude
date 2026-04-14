import { Box } from "@mui/material";
import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
