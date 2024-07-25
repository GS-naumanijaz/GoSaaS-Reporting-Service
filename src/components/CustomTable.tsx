import React, { useState } from "react";
import { TableData } from "../models/TableData";
import {
  Button,
  Checkbox,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { primaryColor } from "../configs";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";

interface Props {
  data: TableData[];
}

const CustomTable = ({ data }: Props) => {
  const [tableData, setTableData] = useState(data);

  const handleToggleSwitch = (id: number) => {
    const updatedData = tableData.map((row) => {
      if (row.getId() === id) {
        row.toggleSwitchStatus();
      }
      return row;
    });
    setTableData([...updatedData]);
  };

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            {tableData[0].tableHeadings().map((heading, index) => (
              <Th key={index}>{heading}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((row) => (
            <Tr key={row.getId()}>
              <Td>
                <Checkbox colorScheme="red" defaultChecked />
              </Td>
              {row.tableData().map((d, index) => (
                <Td key={index}>{d}</Td>
              ))}
              {tableData[0].requiresStatusToggle() && (
                <Td>
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
              )}
              <Td>
                <Button>
                  <FaPencil color="blue" />
                </Button>
              </Td>
              <Td>
                <Button>
                  <FaRegTrashCan color="red" />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
