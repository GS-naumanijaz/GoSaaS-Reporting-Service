import { Box, Button, Text } from "@chakra-ui/react";
import { primaryColor, sidebarHeight } from "../configs";
import { MdDashboard } from "react-icons/md";
import { AiOutlineAudit } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";

interface SidebarProps {
  onSelected: (selectedComponent: string) => void;
}

const Sidebar = ({ onSelected }: SidebarProps) => {
  return (
    <Box
      height={sidebarHeight}
      paddingLeft={5}
      p={5}
      borderRightColor={"lightgrey"}
      borderRightWidth={1}
    >
      <Button onClick={() => onSelected("Dashboard")}>
        <MdDashboard size={20} color={primaryColor} />
        <Text textColor={"black"} fontWeight={"normal"} paddingLeft={2}>
          Dashboard
        </Text>
      </Button>
      <Button onClick={() => onSelected("AuditTrail")}>
        <AiOutlineAudit size={20} color={primaryColor} />
        <Text textColor={"black"} fontWeight={"normal"} paddingLeft={2}>
          Audit Trail
        </Text>
      </Button>
      <Button onClick={() => onSelected("Reports")}>
        <TbReportAnalytics size={20} color={primaryColor} />
        <Text textColor={"black"} fontWeight={"normal"} paddingLeft={2}>
          Reports
        </Text>
      </Button>
    </Box>
  );
};

export default Sidebar;
