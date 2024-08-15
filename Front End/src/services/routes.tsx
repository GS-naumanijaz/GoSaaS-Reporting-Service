import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
// import AuthenticatedRoute from "../components/AuthenticatedRoute";
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
    // element: <AuthenticatedRoute element={<Homepage />} />,
    element: <Homepage />,
  },
  {
    path: "/applications",
    // element: <AuthenticatedRoute element={<Application />} />,
    element: <Application />,
  },
  {
    path: "/addreports",
    // element: <AuthenticatedRoute element={<AddReportPage />} />,
    element: <AddReportPage />,
  },
]);

export default router;
