import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthenticatedRoute = ({ element }: any) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/check-auth", {
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
    return <div>Loading...</div>; // Show a loader while authentication is being checked
  }

  return authenticated ? element : <Navigate to="/" />;
};

export default AuthenticatedRoute;
