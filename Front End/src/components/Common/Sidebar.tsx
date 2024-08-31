import { Box, Button, Text } from "@chakra-ui/react";
import { primaryColor, sidebarHeight, tertiaryColor } from "../../configs";
import { MdDashboard } from "react-icons/md";
import { AiOutlineAudit } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";

interface SidebarProps {
  onSelected: (selectedComponent: string) => void;
}

const Sidebar = ({ onSelected }: SidebarProps) => {
  return (
    <Box
      paddingLeft={5}
      p={5}
      // borderRightColor={"lightgrey"}
      // borderRightWidth={2}
      bg={tertiaryColor}
      // h={sidebarHeight}
    >
      <Button variant="ghost" onClick={() => onSelected("Dashboard")}>
        <MdDashboard size={20} color={primaryColor} />
        <Text textColor={"black"} fontWeight={"normal"} paddingLeft={2}>
          Dashboard
        </Text>
      </Button>
      <Button variant="ghost" onClick={() => onSelected("AuditTrail")}>
        <AiOutlineAudit size={20} color={primaryColor} />
        <Text textColor={"black"} fontWeight={"normal"} paddingLeft={2}>
          Audit Trail
        </Text>
      </Button>
      <Button variant="ghost" onClick={() => onSelected("Requests")}>
        <TbReportAnalytics size={20} color={primaryColor} />
        <Text textColor={"black"} fontWeight={"normal"} paddingLeft={2}>
          Requests
        </Text>
      </Button>
    </Box>
  );
};

export default Sidebar;
