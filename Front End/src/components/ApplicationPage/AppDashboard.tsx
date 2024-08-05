import SourceConnectionData from "../Data/SourceConnectionData";
import DestinationConnectionData from "../Data/DestinationConnectionData";
import AppHeader from "./AppHeader";
import { sx } from "../../configs";
import { Box, VStack } from "@chakra-ui/react";
import ReportsConnectionData from "../Data/ReportsConnectionData";
import { useLocation } from "react-router-dom";

const AppDashboard = () => {
  const location = useLocation();
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
        <AppHeader
          appName={location.state?.name}
          appDescription={location.state?.description}
        />
        <VStack
          display="flex"
          alignContent={"center"}
          justifyContent={"center"}
        >
          <SourceConnectionData />
          <DestinationConnectionData />
          <ReportsConnectionData />
        </VStack>
      </Box>
    </Box>
  );
};

export default AppDashboard;
