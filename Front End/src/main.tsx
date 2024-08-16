import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import { RouterProvider } from "react-router-dom";
import router from "./services/routes.tsx";
// import { UserProvider } from "./components/Login/UserContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 } },
}); // 1 minute fresh time

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {/* <UserProvider> */}
        <ReactQueryDevtools />
        <RouterProvider router={router} />
        {/* </UserProvider> */}
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
