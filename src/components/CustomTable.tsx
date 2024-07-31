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
    canSaveEditedRows: tableManager.getCanSaveEditedRows(),
  });

  const updateState = () => {
    setTableState({
      tableData: tableManager.getTableData(),
      checkedState: tableManager.getCheckedState(),
      isEditing: tableManager.getIsEditing(),
      allRowsSelected: tableManager.getAllRowsSelected(),
      isSelectingRows: tableManager.getIsSelectingRows(),
      canSaveEditedRows: tableManager.getCanSaveEditedRows(),
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
    value: string,
    error: string
  ) => {
    tableManager.handleInputChange(rowIndex, elementIndex, value);
    tableManager.setEditSaveOnRow(rowIndex, !!error);
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
        inputFields={tableManager.getInputFields()}
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
                  <FilterSortPopup
                    heading={heading}
                    sortFilterOptions={
                      tableManager.getSortFilterOptions()[index]
                    }
                  />
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
                {row.getTableData().map((d, index) => (
                  <TdData
                    key={index}
                    isEditing={isEditing[rowIndex]}
                    isEditable={tableManager.getEditAccess(index)}
                    data={d}
                    type={tableManager.getInputFields()[index].type}
                    handleInputChange={(value, error) =>
                      handleInputChange(rowIndex, index, value, error)
                    }
                    validation={tableManager.getInputFields()[index].validation}
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
                  isDisabled={tableManager.getCanSaveEditedRows()[rowIndex]}
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
