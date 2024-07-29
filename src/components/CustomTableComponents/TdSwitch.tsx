import { Switch, Td } from "@chakra-ui/react";
import { primaryColor } from "../../configs";
import { TableData } from "../../models/TableData";

interface Props {
  row: TableData;
  handleToggleSwitch: (id: number) => void;
}

const TdSwitch = ({ row, handleToggleSwitch }: Props) => {
  return (
    <Td textAlign="center">
      <Switch
        isChecked={row.getSwitchStatus()}
        onChange={() => handleToggleSwitch(row.getId())}
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
  );
};

export default TdSwitch;
