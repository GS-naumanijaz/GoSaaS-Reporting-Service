import { Box, Button, Text } from "@chakra-ui/react";
import { primaryColor, sidebarHeight } from "../configs";
import { MdDashboard } from "react-icons/md";
import { AiOutlineAudit } from "react-icons/ai";

const Sidebar = () => {
  return (
    <Box
      height={sidebarHeight}
      paddingLeft={5}
      p={5}
      borderRightColor={"lightgrey"}
      borderRightWidth={1}
    >
      <Button onClick={() => console.log("Dashboard Pressed")}>
        <MdDashboard size={20} color={primaryColor} />
        <Text textColor={"black"} fontWeight={"normal"} paddingLeft={2}>
          Dashboard
        </Text>
      </Button>
      <Button onClick={() => console.log("Audit Trail Pressed")}>
        <AiOutlineAudit size={20} color={primaryColor} />
        <Text textColor={"black"} fontWeight={"normal"} paddingLeft={2}>
          Audit Trail
        </Text>
      </Button>
    </Box>
  );
};

export default Sidebar;
