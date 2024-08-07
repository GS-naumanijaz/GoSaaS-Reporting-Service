import SourceConnectionData from "../Data/SourceConnectionData";
import DestinationConnectionData from "../Data/DestinationConnectionData";
import AppHeader from "./AppHeader";
import { sx } from "../../configs";
import { Box, VStack, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import ReportsConnectionData from "../Data/ReportsConnectionData";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface AppData {
  name: string;
  description: string;
  is_active: boolean;
}

const AppDashboard = () => {
  const location = useLocation();
  const [appId] = useState(location.state?.id ?? null);
  const [appData, setAppData] = useState<AppData>({
    name: "",
    description: "",
    is_active: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppData = async () => {
      if (appId) {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:8080/applications/${appId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await response.json();
          setAppData(data.data);
          console.log("AppData: ", data.data);
        } catch (error) {
          console.error(error);
          setError("Failed to fetch application data.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAppData();
  }, [appId]);

  return (
    <Box p={2}>
      <Box
        bg="white"
        borderColor="lightgrey"
        borderWidth={2}
        borderRadius="md"
        marginX={3}
        marginTop={2}
        textAlign="center"
        h="96.8%"
        overflowY="auto"
        sx={sx}
      >
        {loading ? (
          <Spinner size="xl" />
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : appData.name === "" ? (
          <AppHeader />
        ) : (
          <AppHeader
            appName={appData.name}
            appDescription={appData.description}
            activeState={appData.is_active}
          />
        )}
        <VStack
          display="flex"
          alignContent={"center"}
          justifyContent={"center"}
        >
          <SourceConnectionData />
          <DestinationConnectionData />
          <ReportsConnectionData product={location.state} />
        </VStack>
      </Box>
    </Box>
  );
};

export default AppDashboard;
