import { ErrorBoundaryProvider } from "@providers/ErrorBoundaryProvider";
import { QueryProvider } from "@providers/QueryProvider";
import type { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundaryProvider>
      <QueryProvider>{children}</QueryProvider>
    </ErrorBoundaryProvider>
  );
}
