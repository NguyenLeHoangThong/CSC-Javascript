import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ShoppingPage from "../pages/ShoppingPage";
import FormDemoPage from "../pages/FormDemoPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <ShoppingPage /> },
      { path: "form-demo", element: <FormDemoPage /> },
    ],
  },
]);

export default router;
