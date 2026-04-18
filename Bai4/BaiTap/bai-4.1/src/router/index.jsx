import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import CourseDetail from "../pages/CourseDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/courses/:courseName",
    element: <CourseDetail />,
  }
]);