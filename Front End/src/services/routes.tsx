import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import LoginPage from "../pages/LoginPage";
import Application from "../pages/Application";
import AddReportPage from "../pages/AddReportPage";
import AuthenticatedRoute from "../components/AuthenticatedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/homepage",
    // element: <Homepage />,
    element: <AuthenticatedRoute element={<Homepage />} />,
  },
  {
    path: "/applications",
    // element: <Application />,
    element: <AuthenticatedRoute element={<Application />} />,
  },
  {
    path: "/addreports",
    // element: <AddReportPage />,
    element: <AuthenticatedRoute element={<AddReportPage />} />,
  },
]);

export default router;
