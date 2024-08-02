import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import ProductDetails from "../components/Dashboard/ProductDetails";
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
  {
    // remove when table is implememnted
    path: "/product",
    element: <AuthenticatedRoute element={<ProductDetails />} />,
  },
]);

export default router;
