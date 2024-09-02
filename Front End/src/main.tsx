import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, createStandaloneToast } from "@chakra-ui/react";
import { theme } from "./theme";
import { RouterProvider } from "react-router-dom";
import router from "./services/routes.tsx";
import { UserProvider } from "./components/Login/UserContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 } },
}); // 1 minute fresh time

const { ToastContainer } = createStandaloneToast();

// Polyfill global for AWS SDK v2
window.global = window;

// Get the root element
const rootElement = document.getElementById("root") as HTMLElement;

rootElement.style.transform = "scale(0.90)";
rootElement.style.transformOrigin = "top left";

rootElement.style.width = "111.11%";
rootElement.style.height = "111.11%";

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ReactQueryDevtools />
          <RouterProvider router={router} />
          <ToastContainer />
        </UserProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
