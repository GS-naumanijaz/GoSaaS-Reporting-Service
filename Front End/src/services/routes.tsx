import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import ProductDetails from "../components/Dashboard/ProductDetails";
import LoginPage from "../pages/LoginPage";

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
    path: "/product",
    element: <AuthenticatedRoute element={<ProductDetails />} />,
  },
]);

export default router;
