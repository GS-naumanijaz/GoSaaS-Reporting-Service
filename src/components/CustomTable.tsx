import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  Spacer,
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
import { FaChevronLeft, FaChevronRight, FaRegSave } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { TbPencil, TbPencilCancel } from "react-icons/tb";
import { primaryColor } from "../configs";
import { TableData } from "../models/TableData";
import FilterSortPopup from "./FilterSortPopup";

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

  const [preEditRows, setPreEditRows] = useState<string[][]>(
    new Array(data.length).fill([])
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

  const handleBulkSwitchActions = (newStatus: boolean) => {
    const updatedData = tableData.map((row, index) => {
      if (checkedState[index]) {
        row.setSwitchStatus(newStatus);
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
    const updatedEditing = isEditing.map((edit, idx) => {
      if (idx === index) {
        const updatedPreEditRows = preEditRows.map((row, index2) => {
          if (index2 === index) {
            row = tableData[idx].tableData();
          }
          return row;
        });
        setPreEditRows([...updatedPreEditRows]);
        return !edit;
      }
      return edit;
    });
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
    setTableData([...updatedData]);
  };

  const revertEdit = (rowIndex: number) => {
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        const newRow = data.find((item) => item.getId() === row.getId());
        if (newRow) row.editCompleteRow(preEditRows[index]);
      }
      return row;
    });
    setTableData([...updatedData]);
  };

  //delete rows
  const handleDeleteRow = (rowIndex: number) => {
    const updatedData = tableData.filter((_, index) => index !== rowIndex);
    setTableData([...updatedData]);

    const updatedCheckedState = [
      ...checkedState.slice(0, rowIndex),
      ...checkedState.slice(rowIndex + 1),
    ];
    setCheckedState(updatedCheckedState);

    const updatedIsEditingState = [
      ...isEditing.slice(0, rowIndex),
      ...isEditing.slice(rowIndex + 1),
    ];
    setIsEditing(updatedIsEditingState);
  };

  const handleBulkDeleteRows = () => {
    const updatedData = tableData.filter((_, index) => !checkedState[index]);
    setTableData([...updatedData]);

    const updatedIsEditingState = isEditing.filter(
      (_, index) => !checkedState[index]
    );
    setIsEditing(updatedIsEditingState);

    setCheckedState(new Array(tableData.length).fill(false));
  };

  if (tableData.length === 0) return <Text>No data to show</Text>;

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
          <HStack spacing={6}>
            <Button onClick={() => handleBulkSwitchActions(true)}>
              Activate All
            </Button>
            <Button onClick={() => handleBulkSwitchActions(false)}>
              Deactivate All
            </Button>
            <Button onClick={handleBulkDeleteRows}>
              <FaRegTrashCan color="red" size={20} />
            </Button>
          </HStack>
        )}
      </HStack>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th textAlign="center" width={data[0].getCheckBoxWidth()}>
                <Checkbox
                  colorScheme="red"
                  isChecked={allRowsSelected}
                  onChange={selectAllCheckBoxes}
                />
              </Th>
              {tableData[0].tableHeadings().map((heading, index) => (
                <Th
                  key={index}
                  textAlign="center"
                  width={data[0].getColumnWidths()[index]}
                >
                  <FilterSortPopup heading={heading} />
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((row, rowIndex) => (
              <Tr key={row.getId()}>
                <Td textAlign="center">
                  <Checkbox
                    colorScheme="red"
                    isChecked={checkedState[rowIndex]}
                    onChange={() => selectCheckBox(rowIndex)}
                  />
                </Td>
                {row.tableData().map((d, index) => (
                  <Td key={index} textAlign="center">
                    {isEditing[rowIndex] ? (
                      <Input
                        textAlign="center"
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
                )}
                <Td textAlign="center">
                  {isEditing[rowIndex] ? (
                    <HStack>
                      <Button onClick={() => handleEditToggle(rowIndex)}>
                        <FaRegSave color="green" size={20} />
                      </Button>
                      <Button
                        onClick={() => {
                          handleEditToggle(rowIndex);
                          revertEdit(rowIndex);
                        }}
                      >
                        <TbPencilCancel color="red" size={20} />
                      </Button>
                    </HStack>
                  ) : (
                    <Button onClick={() => handleEditToggle(rowIndex)}>
                      <TbPencil color="blue" size={20} />
                    </Button>
                  )}
                </Td>
                <Td textAlign="center">
                  <Button onClick={() => handleDeleteRow(rowIndex)}>
                    <FaRegTrashCan color="red" size={20} />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box margin={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Spacer />
          <HStack spacing={4} flex="1">
            <Button>
              <FaChevronLeft />
            </Button>
            <Text>2 of 20</Text>
            <Button>
              <FaChevronRight />
            </Button>
          </HStack>
          <HStack>
            <Text>Max Rows per Page</Text>
            <Input width={20} />
          </HStack>
        </Flex>
      </Box>
    </>
  );
};

export default CustomTable;
