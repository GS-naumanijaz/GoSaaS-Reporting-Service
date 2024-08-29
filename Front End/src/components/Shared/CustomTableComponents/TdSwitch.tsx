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
          // size="lg"
          sx={{
            "& .chakra-switch__track": {
              bg: row.getSwitchStatus() ? primaryColor : "gray.200",
            },
            "& .chakra-switch__thumb": {
              bg: row.getSwitchStatus() ? "white" : "gray.500",
            },
          }}
        />
      </Td>
    </Tooltip>
  );
};

export default TdSwitch;
