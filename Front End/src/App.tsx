import { Box, HStack, Text } from "@chakra-ui/react";
import SignInCard from "./components/SignInCard";

const App = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // horizontal center
        justifyContent: "center", // vertical center
        height: "100vh", // vertical center
      }}
    >
      <Box>
        <Box borderWidth={"3px"} borderColor={"black"} textAlign="center">
          <SignInCard />
        </Box>
        <HStack padding={2} justify={"space-between"}>
          <Text>GoSaas Reporting Service</Text>
          <Text>Version: 1</Text>
        </HStack>
      </Box>
    </div>
  );
};

export default App;
