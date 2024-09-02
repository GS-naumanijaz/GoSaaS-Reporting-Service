import { Box, HStack, Icon, Switch, Td, Text, Tooltip } from "@chakra-ui/react";
import { primaryColor, secondaryColor } from "../../../configs";
import { TableRowData } from "../../../models/TableRowData";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Props {
  row: TableRowData;
  isEditable: boolean;
  handleToggleSwitch: (id: number) => void;
}

const TdSwitch = ({ row, isEditable, handleToggleSwitch }: Props) => {
  return (
    <Td textAlign="center">
      {row.getTableHeader() === "Applications" ? (
        <Text
          color={row.getSwitchStatus() ? "green.500" : "red.500"}
          fontWeight="bold"
          fontSize="lg"
        >
          <HStack spacing={3} justifyContent={"center"}>
            <Icon as={row.getSwitchStatus() ? FaCheckCircle : FaTimesCircle} />
            <span>{row.getSwitchStatus() ? "Active" : "Inactive"}</span>
          </HStack>
        </Text>
      ) : (
        <Switch
          isChecked={row.getSwitchStatus()}
          onChange={() => handleToggleSwitch(row.getId())}
          isDisabled={!isEditable}
          sx={{
            "& .chakra-switch__track": {
              bg: row.getSwitchStatus() ? primaryColor : "gray.200",
              opacity: 1, // Ensure the track's background doesn't fade when disabled
            },
            "& .chakra-switch__thumb": {
              bg: row.getSwitchStatus() ? "white" : "gray.500",
              opacity: 1, // Ensure the track's background doesn't fade when disabled
            },
            "&:disabled .chakra-switch__track": {
              cursor: "not-allowed", // Optionally, change the cursor when disabled
            },
          }}
        />
      )}
    </Td>
  );
};

export default TdSwitch;
