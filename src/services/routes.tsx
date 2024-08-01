import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import App from "../App";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import ProductDetails from "../components/ProductDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
