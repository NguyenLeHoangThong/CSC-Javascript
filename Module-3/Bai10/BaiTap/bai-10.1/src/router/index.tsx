import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyOrdersPage from "../pages/MyOrdersPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";

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
      { path: "admin/products", element: <ProtectedRoute requireAdmin><AdminProductsPage /></ProtectedRoute> },
      { path: "admin/orders", element: <ProtectedRoute requireAdmin><AdminOrdersPage /></ProtectedRoute> },
      { path: "admin/users", element: <ProtectedRoute requireAdmin><AdminUsersPage /></ProtectedRoute> },
    ],
  },
]);

export default router;
