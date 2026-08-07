import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "../components/common/Loading";

// Pages every visitor reaches — keep them in the main bundle.
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyOrdersPage from "../pages/MyOrdersPage";

// Bài 37 — the admin dashboard is reachable by a handful of accounts but was shipped
// to every shopper: three pages plus MUI's Table, Dialog and DataGrid code in the
// initial bundle. `lazy()` moves each into its own chunk, downloaded only when an
// admin actually opens the page.
const AdminProductsPage = lazy(() => import("../pages/admin/AdminProductsPage"));
const AdminOrdersPage = lazy(() => import("../pages/admin/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsersPage"));

// A lazy component MUST sit under a <Suspense> boundary, otherwise React throws
// while the chunk is downloading. One helper keeps the route table readable.
const lazyAdminRoute = (element: ReactNode) => (
  <ProtectedRoute requireAdmin>
    <Suspense fallback={<Loading />}>{element}</Suspense>
  </ProtectedRoute>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "my-orders", element: <ProtectedRoute><MyOrdersPage /></ProtectedRoute> },
      { path: "admin/products", element: lazyAdminRoute(<AdminProductsPage />) },
      { path: "admin/orders", element: lazyAdminRoute(<AdminOrdersPage />) },
      { path: "admin/users", element: lazyAdminRoute(<AdminUsersPage />) },
    ],
  },
]);

export default router;
