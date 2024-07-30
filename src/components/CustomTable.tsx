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
import { TableManager } from "../models/TableManager";
import FilterSortPopup from "./CustomTableComponents/FilterSortPopup";
import TableFooter from "./CustomTableComponents/TableFooter";
import TableHeader from "./CustomTableComponents/TableHeader";
import TdCheckBox from "./CustomTableComponents/TdCheckBox";
import TdData from "./CustomTableComponents/TdData";
import TdDeleteButton from "./CustomTableComponents/TdDeleteButton";
import TdEditButton from "./CustomTableComponents/TdEditButton";
import TdSwitch from "./CustomTableComponents/TdSwitch";

interface Props {
  tableManager: TableManager;
}

const CustomTable = ({ tableManager }: Props) => {
  const [tableState, setTableState] = useState({
    tableData: tableManager.getTableData(),
    checkedState: tableManager.getCheckedState(),
    isEditing: tableManager.getIsEditing(),
    allRowsSelected: tableManager.getAllRowsSelected(),
    isSelectingRows: tableManager.getIsSelectingRows(),
  });

  const updateState = () => {
    setTableState({
      tableData: tableManager.getTableData(),
      checkedState: tableManager.getCheckedState(),
      isEditing: tableManager.getIsEditing(),
      allRowsSelected: tableManager.getAllRowsSelected(),
      isSelectingRows: tableManager.getIsSelectingRows(),
    });
  };

  const handleBulkSwitchActions = (newStatus: boolean) => {
    tableManager.handleBulkSwitchActions(newStatus);
    updateState();
  };

  const selectAllCheckBoxes = () => {
    tableManager.selectAllCheckBoxes();
    updateState();
  };

  const selectCheckBox = (rowIndex: number) => {
    tableManager.selectCheckBox(rowIndex);
    updateState();
  };

  const handleEditToggle = (index: number) => {
    tableManager.handleEditToggle(index);
    updateState();
  };

  const handleInputChange = (
    rowIndex: number,
    elementIndex: number,
    value: string
  ) => {
    tableManager.handleInputChange(rowIndex, elementIndex, value);
    updateState();
  };

  const revertEdit = (rowIndex: number) => {
    tableManager.revertEdit(rowIndex);
    updateState();
  };

  const handleDeleteRow = (rowIndex: number) => {
    tableManager.handleDeleteRow(rowIndex);
    updateState();
  };

  const handleBulkDeleteRows = () => {
    tableManager.handleBulkDeleteRows();
    updateState();
  };

  const {
    tableData,
    checkedState,
    isEditing,
    allRowsSelected,
    isSelectingRows,
  } = tableState;

  if (tableData.length === 0) return <Text>No data to show</Text>;

  return (
    <>
      <TableHeader
        tableHeading={tableManager.getTableHeader()}
        isSelectingRows={isSelectingRows}
        handleBulkSwitchActions={handleBulkSwitchActions}
        handleBulkDeleteRows={handleBulkDeleteRows}
      />
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th textAlign="center" width={tableManager.getCheckBoxWidth()}>
                <Checkbox
                  colorScheme="red"
                  isChecked={allRowsSelected}
                  onChange={selectAllCheckBoxes}
                />
              </Th>
              {tableManager.getTableHeadings().map((heading, index) => (
                <Th
                  key={index}
                  textAlign="center"
                  width={tableManager.getColumnWidths()[index]}
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
                  selectCheckBox={() => selectCheckBox(rowIndex)}
                />
                {row.tableData().map((d, index) => (
                  <TdData
                    key={index}
                    isEditing={isEditing[rowIndex]}
                    data={d}
                    handleInputChange={(value) =>
                      handleInputChange(rowIndex, index, value)
                    }
                  />
                ))}

                {tableData[0].requiresStatusToggle() && (
                  <TdSwitch
                    row={row}
                    handleToggleSwitch={() => {
                      tableManager.handleToggleSwitch(row.getId());
                      updateState();
                    }}
                  />
                )}
                <TdEditButton
                  isEditing={isEditing[rowIndex]}
                  handleEditToggle={() => handleEditToggle(rowIndex)}
                  revertEdit={() => revertEdit(rowIndex)}
                />
                <TdDeleteButton
                  handleDeleteRow={() => handleDeleteRow(rowIndex)}
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
