import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Header />
      {/*
       * flex: "1 1 0" — grows to fill remaining viewport height, flex-basis 0
       * so min-height is 0 and the box never overflows the viewport.
       * overflow: hidden — prevents the main area itself from scrolling;
       * each child page is responsible for its own scroll behaviour.
       */}
      <Box
        component="main"
        sx={{ flex: "1 1 0", overflow: "hidden", display: "flex" }}
      >
        <Container
          maxWidth="xl"
          sx={{
            flex: "1 1 0",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
