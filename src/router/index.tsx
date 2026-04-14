import { AppLayout } from "@components/layout/AppLayout";
import { AdminPage } from "@features/admin";
import { DashboardPage } from "@features/dashboard";
import { BrowserRouter, Route, Routes } from "react-router";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
