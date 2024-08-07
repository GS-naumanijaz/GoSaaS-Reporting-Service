import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import { RouterProvider } from "react-router-dom";
import router from "./services/routes.tsx";
import { UserProvider } from "./components/LoginPage/UserContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ChakraProvider>
  </React.StrictMode>
);
