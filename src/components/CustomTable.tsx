import {
  Checkbox,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { TableData } from "../models/TableData";
import FilterSortPopup from "./CustomTableComponents/FilterSortPopup";
import TableFooter from "./CustomTableComponents/TableFooter";
import TableHeader from "./CustomTableComponents/TableHeader";
import TdCheckBox from "./CustomTableComponents/TdCheckBox";
import TdData from "./CustomTableComponents/TdData";
import TdDeleteButton from "./CustomTableComponents/TdDeleteButton";
import TdEditButton from "./CustomTableComponents/TdEditButton";
import TdSwitch from "./CustomTableComponents/TdSwitch";

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
      <TableHeader
        tableHeading={data[0].getTableHeader()}
        isSelectingRows={isSelectingRows}
        handleBulkSwitchActions={handleBulkSwitchActions}
        handleBulkDeleteRows={handleBulkDeleteRows}
      />
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
                <TdCheckBox
                  checkedState={checkedState[rowIndex]}
                  rowIndex={rowIndex}
                  selectCheckBox={selectCheckBox}
                />
                {row.tableData().map((d, index) => (
                  <TdData
                    key={index}
                    isEditing={isEditing[rowIndex]}
                    data={d}
                    rowIndex={rowIndex}
                    index={index}
                    handleInputChange={handleInputChange}
                  />
                ))}

                {tableData[0].requiresStatusToggle() && (
                  <TdSwitch row={row} handleToggleSwitch={handleToggleSwitch} />
                )}
                <TdEditButton
                  isEditing={isEditing[rowIndex]}
                  rowIndex={rowIndex}
                  handleEditToggle={handleEditToggle}
                  revertEdit={revertEdit}
                />
                <TdDeleteButton
                  rowIndex={rowIndex}
                  handleDeleteRow={handleDeleteRow}
                />
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <TableFooter />
    </>
  );
};

export default CustomTable;
