import { Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { primaryColor, BackendURL } from "../configs";

const AuthenticatedRoute = ({ element }: any) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BackendURL}/checkAuth`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (authenticated === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner size={"xl"} color={primaryColor} />
      </div>
    );
  }

  return authenticated ? element : <Navigate to="/" />;
};

export default AuthenticatedRoute;
