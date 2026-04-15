import { AppLayout } from "@components/layout";
import { BrowserRouter, Route, Routes } from "react-router";
import { AdminPage } from "./AdminPage";
import { DashboardPage } from "./DashboardPage";

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
