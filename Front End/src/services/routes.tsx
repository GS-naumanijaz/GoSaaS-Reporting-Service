import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import LoginPage from "../pages/LoginPage";
import Application from "../pages/Application";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/homepage",
    element: <AuthenticatedRoute element={<Homepage />} />,
  },
  {
    path: "/application",
    element: <AuthenticatedRoute element={<Application />} />,
  },
]);

export default router;
