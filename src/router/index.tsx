import { AdminPage } from "@features/admin";
import { DashboardPage } from "@features/dashboard";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
]);
