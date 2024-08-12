import {
  Box,
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
import { TableManager } from "../../models/TableManager";
import FilterSortPopup from "./CustomTableComponents/FilterSortPopup";
import TableFooter from "./CustomTableComponents/TableFooter";
import TableHeader from "./CustomTableComponents/TableHeader";
import TdCheckBox from "./CustomTableComponents/TdCheckBox";
import TdData from "./CustomTableComponents/TdData";
import TdDeleteButton from "./CustomTableComponents/TdDeleteButton";
import TdEditButton from "./CustomTableComponents/TdEditButton";
import TdSwitch from "./CustomTableComponents/TdSwitch";
import { sx } from "../../configs";
import TdTestButton from "./CustomTableComponents/TdTestButton";

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

  // if (tableData.length === 0)
  //   return (
  //     <Box padding={2}>
  //       <Text>{`Implement case where data doesnt exist`}</Text>
  //     </Box>
  //   );
  return (
    <Box
      borderWidth={3}
      borderColor={"lightgrey"}
      borderEndWidth={0}
      borderStartWidth={0}
      my={10}
      width={"90%"}
    >
      <TableHeader
        tableHeading={tableManager.getTableHeader()}
        isSelectingRows={isSelectingRows}
        inputFields={tableManager.getInputFields()}
        handleBulkSwitchActions={handleBulkSwitchActions}
        handleBulkDeleteRows={handleBulkDeleteRows}
        productDetails={tableManager.getTableProduct()}
      />
      <TableContainer sx={sx}>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              {tableManager.requiresCheckBox() && (
                <Th textAlign="center" width={tableManager.getCheckBoxWidth()}>
                  <Checkbox
                    colorScheme="red"
                    isChecked={allRowsSelected}
                    onChange={selectAllCheckBoxes}
                  />
                </Th>
              )}
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
          {tableData.length !== 0 ? (
            <Tbody>
              {tableData.map((row, rowIndex) => (
                <Tr key={row.getId()}>
                  {tableManager.requiresCheckBox() && (
                    <TdCheckBox
                      checkedState={checkedState[rowIndex]}
                      selectCheckBox={() => selectCheckBox(rowIndex)}
                    />
                  )}
                  {row.getTableData().map((d, index) => (
                    <TdData
                      key={index}
                      isEditing={isEditing[rowIndex]}
                      isEditable={tableManager.getEditAccess(index)}
                      data={d}
                      inputField={tableManager.getInputFields()[index]}
                      handleInputChange={(value, error) =>
                        handleInputChange(rowIndex, index, value, error)
                      }
                    />
                  ))}

                  {tableManager.getTableHeader() !== "Reports" &&
                    tableManager.requiresStatusToggle() && (
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
                  {tableManager.requiresTestButton() && (
                    <TdTestButton onClick={() => console.log("testing")} />
                  )}
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Text>No data to show</Text>
          )}
        </Table>
      </TableContainer>
      <TableFooter NoOfRecords={tableData.length} />
    </Box>
  );
};

export default CustomTable;
