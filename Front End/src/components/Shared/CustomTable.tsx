import {
  Box,
  Checkbox,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
import { FieldMappingKey } from "../../services/sortMappings";
import { ReportsConnection } from "../../models/ReportsConnection";

interface Props {
  tableManager: TableManager;
  appId: number;
  onSort: (field: FieldMappingKey, order: string) => void;
  onSearch: (searchTerm: string, field: string) => void;
  onDelete: (deleteId: number) => void;
  onBulkDelete: (deleteIds: number[]) => void;
  onBulkUpdateStatus?: (updateIds: number[], status: boolean) => void;
  onTestConnection?: (appId: number, connectionId: number) => void;
  onEdit?: (itemId: number, editedItem: any) => void;
  onClickEdit?: (report: ReportsConnection) => void;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  totalElements: number;
  searchObject?: { searchField: string; searchTerm: string };
  onAddNew: any;
}

const CustomTable = ({
  tableManager,
  appId,
  onSort,
  onSearch,
  onDelete,
  onBulkDelete,
  onBulkUpdateStatus,
  onTestConnection, onEdit, onClickEdit,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalElements,
  searchObject,
  onAddNew,
}: Props) => {
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

  useEffect(() => {
    updateState();
  }, [tableManager]);

  const handleBulkSwitchActions = (newStatus: boolean) => {
    if (onBulkUpdateStatus) {
      onBulkUpdateStatus(tableManager.getCheckedIds(), newStatus);
    }
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

  const handleEditSave = (rowIndex: number) => {
    let itemId = tableManager.getRowId(rowIndex);
    let editedItem = tableManager.getRowItem(rowIndex);
    onEdit!(itemId, editedItem);
  }

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

  const handleDeleteRow = (id: number) => {
    onDelete(id);
  };

  const handleBulkDeleteRows = () => {
    onBulkDelete(tableManager.getCheckedIds());
  };

  const {
    tableData,
    checkedState,
    isEditing,
    allRowsSelected,
    isSelectingRows,
  } = tableState;

  const isEditingMode = () => {
    return isEditing.some(value => value);
  }

  return (
    <Box
      borderWidth={3}
      borderColor={"lightgrey"}
      borderEndWidth={0}
      borderStartWidth={0}
      my={10}
      width={"90%"}
    >
      {searchObject?.searchTerm && (
        <Box mb={4} p={2} borderWidth={1} borderColor="gray.200">
          <Text fontWeight="bold">Search Results:</Text>
          <HStack justifyContent={"center"} spacing={5}>
            <Text>
              <strong>Field:</strong> {searchObject.searchField}
            </Text>
            <Text>
              <strong>Term:</strong> {searchObject.searchTerm}
            </Text>
          </HStack>
        </Box>
      )}
      <TableHeader
        tableHeading={tableManager.getTableHeader()}
        isSelectingRows={isSelectingRows}
        inputFields={tableManager.getInputFields()}
        handleBulkSwitchActions={handleBulkSwitchActions}
        handleBulkDeleteRows={handleBulkDeleteRows}
        productDetails={tableManager.getTableProduct()}
        onAddNew={onAddNew}
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
                    onSort={onSort}
                    onSearch={onSearch}
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

                  {tableManager.requiresStatusToggle() && (
                    <TdSwitch
                      row={row}
                      isEditable={isEditing[rowIndex]}
                      handleToggleSwitch={() => {
                        tableManager.handleToggleSwitch(row.getId());
                        updateState();
                      }}
                    />
                  )}
                  <TdEditButton
                    isEditingMode={isEditingMode()}
                    isEditing={isEditing[rowIndex]}
                    isDisabled={tableManager.getCanSaveEditedRows()[rowIndex]}
                    // handleEditToggle={() => handleEditToggle(rowIndex)}
                    handleEditToggle={onClickEdit ? () => onClickEdit(tableManager.getRowItem(rowIndex)) : () => handleEditToggle(rowIndex)}
                    revertEdit={() => revertEdit(rowIndex)}
                    saveEdit={() => handleEditSave(rowIndex)}
                  />
                  <TdDeleteButton
                    handleDeleteRow={() => handleDeleteRow(row.getId())}
                  />
                  {tableManager.requiresTestButton() && (
                    <TdTestButton
                      onClick={() => onTestConnection!(appId, row.getId())}
                    />
                  )}
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Text>No data to show</Text>
          )}
        </Table>
      </TableContainer>
      <TableFooter
        NoOfRecords={totalElements}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Box>
  );
};

export default CustomTable;
