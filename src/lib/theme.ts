import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1a237e",
      light: "#534bae",
      dark: "#000051",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00897b",
      light: "#4ebaaa",
      dark: "#005b4f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a2e",
      secondary: "#546e7a",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});
