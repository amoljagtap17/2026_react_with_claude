import { theme } from "@lib/theme";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ErrorBoundaryProvider } from "@providers/ErrorBoundaryProvider";
import { QueryProvider } from "@providers/QueryProvider";
import type { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundaryProvider>
        <QueryProvider>{children}</QueryProvider>
      </ErrorBoundaryProvider>
    </ThemeProvider>
  );
}
