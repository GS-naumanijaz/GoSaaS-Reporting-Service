// import AuthenticatedRoute from "../components/AuthenticatedRoute";
import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import LoginPage from "../pages/LoginPage";
import Application from "../pages/Application";
import AddReportPage from "../pages/AddReportPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/homepage",
    element: <Homepage />,
  },
  {
    path: "/applications",
    element: <Application />,
  },
  {
    path: "/addreports",
    element: <AddReportPage />,
  },
]);

export default router;

// element: <AuthenticatedRoute element={<Homepage />} />,
// element: <AuthenticatedRoute element={<Application />} />,
// element: <AuthenticatedRoute element={<AddReportPage />} />,
