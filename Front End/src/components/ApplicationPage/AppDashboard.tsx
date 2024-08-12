import SourceConnectionData from "../Data/SourceConnectionData";
import DestinationConnectionData from "../Data/DestinationConnectionData";
import AppHeader from "./AppHeader";
import { sx } from "../../configs";
import { Box, VStack, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import ReportsConnectionData from "../Data/ReportsConnectionData";
import { useLocation } from "react-router-dom";
import { useAppDataQuery } from "../../hooks/useAppDataQuery";

export interface Application {
  id: number;
  alias: string;
  description: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: string;
  deleted_by: string;
  creation_date: string;
  deletion_date: string | null;
  updation_date: string;
}
const AppDashboard = () => {
  const location = useLocation();
  const timestamp = Date.now();
  const isNewApplication = !location.state?.id;
  const appId = location.state?.id ?? timestamp;

  const {
    data: appData,
    isLoading,
    isError,
    error,
  } = useAppDataQuery(isNewApplication ? null : appId);

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
        {isLoading ? (
          <Spinner size="xl" />
        ) : isError ? (
          <Alert status="error">
            <AlertIcon />
            {error.message}
          </Alert>
        ) : isNewApplication ? (
          <AppHeader />
        ) : (
          <AppHeader appData={appData} />
        )}
        <VStack
          display="flex"
          alignContent={"center"}
          justifyContent={"center"}
        >
          <SourceConnectionData appId={appId} />
          {/* <DestinationConnectionData appId={appId} />
          <ReportsConnectionData product={location?.state} /> */}
        </VStack>
      </Box>
    </Box>
  );
};

export default AppDashboard;
