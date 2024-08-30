import { Switch, Td, Tooltip } from "@chakra-ui/react";
import { primaryColor, secondaryColor } from "../../../configs";
import { TableRowData } from "../../../models/TableRowData";

interface Props {
  row: TableRowData;
  isEditable: boolean;
  handleToggleSwitch: (id: number) => void;
}

const TdSwitch = ({ row, isEditable, handleToggleSwitch }: Props) => {
  return (
    <Tooltip
      bg={secondaryColor}
      color="black"
      label={row.getSwitchStatus() ? "active" : "inactive"}
    >
      <Td textAlign="center">
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
      </Td>
    </Tooltip>
  );
};

export default TdSwitch;
