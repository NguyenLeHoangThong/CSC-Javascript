// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import Dashboard from "../pages/Dashboard";
import EmployeeList from "../pages/EmployeeList";
import SalaryPage from "../pages/SalaryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Tầng 1: Chứa Topbar
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "employees",
        element: <EmployeeLayout />, // Tầng 2: Chứa Sub-sidebar
        children: [
          {
            index: true,
            element: <EmployeeList />
          },
          {
            path: "salary",
            element: <SalaryPage />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <div style={{ textAlign: 'center', padding: '50px' }}><h1>404 - Không tìm thấy trang</h1></div>
  }
]);