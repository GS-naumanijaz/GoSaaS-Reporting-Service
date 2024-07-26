import {
  Button,
  Checkbox,
  HStack,
  Input,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { primaryColor } from "../configs";
import { TableData } from "../models/TableData";
import { FaRegSave } from "react-icons/fa";
import { TbPencil, TbPencilCancel } from "react-icons/tb";

interface Props {
  data: TableData[];
}

const CustomTable = ({ data }: Props) => {
  const [tableData, setTableData] = useState(data);

  const [allRowsSelected, setAllRowsSelected] = useState(false);
  const [isSelectingRows, setIsSelectingRows] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean[]>(
    new Array(data.length).fill(false)
  );

  const [checkedState, setCheckedState] = useState(
    new Array(data.length).fill(false)
  );

  const handleToggleSwitch = (id: number) => {
    const updatedData = tableData.map((row) => {
      if (row.getId() === id) {
        row.toggleSwitchStatus();
      }
      return row;
    });
    setTableData([...updatedData]);
  };

  const selectAllCheckBoxes = () => {
    setAllRowsSelected(!allRowsSelected);
    setCheckedState(new Array(checkedState.length).fill(!allRowsSelected));
    setIsSelectingRows(!allRowsSelected);
  };

  const selectCheckBox = (rowIndex: number) => {
    const updatedCheckedState = checkedState.map((item, idx) =>
      idx === rowIndex ? !item : item
    );
    setCheckedState(updatedCheckedState);
    setIsSelectingRows(updatedCheckedState.some((element) => element === true));
    setAllRowsSelected(
      updatedCheckedState.every((element) => element === true)
    );
  };

  // Function to handle toggle edit mode
  const handleEditToggle = (index: number) => {
    const updatedEditing = isEditing.map((edit, idx) =>
      idx === index ? !edit : edit
    );
    setIsEditing(updatedEditing);
  };

  // Function to handle input change
  const handleInputChange = (
    rowIndex: number,
    elementIndex: number,
    value: string
  ) => {
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        row.editRowData(elementIndex, value);
      }
      return row;
    });
    console.log(updatedData);
    setTableData([...updatedData]);
  };

  return (
    <>
      <HStack
        marginX={10}
        marginTop={4}
        height={12}
        display="flex"
        justifyContent="space-between"
      >
        <Text fontSize={"x-large"}>{data[0].getTableHeader()}</Text>
        {isSelectingRows && (
          <HStack spacing={10}>
            <Button>Activate All</Button>
            <Button>Deactivate All</Button>
            <Button>
              <FaPencil color="blue" />
            </Button>
            <Button>
              <FaRegTrashCan color="red" />
            </Button>
          </HStack>
        )}
      </HStack>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th width={data[0].getCheckBoxWidth()}>
                <Checkbox
                  colorScheme="red"
                  isChecked={allRowsSelected}
                  onChange={selectAllCheckBoxes}
                />
              </Th>
              {tableData[0].tableHeadings().map((heading, index) => (
                <Th key={index} width={data[0].getColumnWidths()[index]}>
                  {heading}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((row, rowIndex) => (
              <Tr key={row.getId()}>
                <Td>
                  <Checkbox
                    colorScheme="red"
                    isChecked={checkedState[rowIndex]}
                    onChange={() => selectCheckBox(rowIndex)}
                  />
                </Td>
                {row.tableData().map((d, index) => (
                  <Td key={index}>
                    {isEditing[rowIndex] ? (
                      <Input
                        value={d}
                        onChange={(e) =>
                          handleInputChange(rowIndex, index, e.target.value)
                        }
                      />
                    ) : (
                      d
                    )}
                  </Td>
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
                  {isEditing[rowIndex] ? (
                    <HStack>
                      <Button onClick={() => handleEditToggle(rowIndex)}>
                        <FaRegSave color="green" />
                      </Button>
                      <Button onClick={() => handleEditToggle(rowIndex)}>
                        <TbPencilCancel color="red" />
                      </Button>
                    </HStack>
                  ) : (
                    <Button onClick={() => handleEditToggle(rowIndex)}>
                      <TbPencil color="blue" />
                    </Button>
                  )}
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
    </>
  );
};

export default CustomTable;
