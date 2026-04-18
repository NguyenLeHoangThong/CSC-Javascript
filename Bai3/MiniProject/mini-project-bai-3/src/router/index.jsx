import { createBrowserRouter } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";

export const router = createBrowserRouter([
  // 1. Khu vực Khách hàng
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "product/:id", element: <ProductDetail /> },
    ],
  },
  // 2. Khu vực Quản trị
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
    ],
  },
  // 3. Trang 404
  { path: "*", element: <h1 style={{textAlign: 'center', marginTop: '50px'}}>404 - Không tìm thấy trang</h1> }
]);