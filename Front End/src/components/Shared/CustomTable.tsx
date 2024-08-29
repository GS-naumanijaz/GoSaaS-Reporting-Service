import {
  Box,
  Button,
  Checkbox,
  HStack,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
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
import { secondaryColor, sx } from "../../configs";
import TdTestButton from "./CustomTableComponents/TdTestButton";
import {
  FieldMappingKey,
  reverseFieldMapping,
} from "../../services/sortMappings";
import { ReportsConnection } from "../../models/ReportsConnection";
import { ImCross } from "react-icons/im";
import TdRedirect from "./CustomTableComponents/TdRedirect";
import { FaDownload } from "react-icons/fa";

interface Props {
  tableManager: TableManager;
  onSort: (field: FieldMappingKey, order: string) => void;
  onSearch: (searchTerm: string, field: string) => void;
  onDateSearch: (date: string[]) => void;
  onDelete: (deleteId: number) => void;
  onBulkDelete: (deleteIds: number[]) => void;
  onBulkUpdateStatus?: (updateIds: number[], status: boolean) => void;
  onTestConnection?: (connectionId: number) => void;
  onEdit?: (itemId: number, editedItem: any) => void;
  onClickEdit?: (report: ReportsConnection) => void;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  totalElements: number;
  searchObject?: {
    searchField: string;
    searchTerm: string;
    selectedDates?: string[];
    sortOrder?: string;
    sortField?: string;
  };
  onAddNew?: any;
  handleClearSearch: () => void;
  handleClearDates: () => void;
  handleClearSort: () => void;
  handleDownload?: (reportIndex: number) => void;
}

const CustomTable = ({
  tableManager,
  onSort,
  onSearch,
  onDateSearch,
  onDelete,
  onBulkDelete,
  onBulkUpdateStatus,
  onTestConnection,
  onEdit,
  onClickEdit,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalElements,
  searchObject,
  onAddNew,
  handleClearSearch,
  handleClearSort,
  handleClearDates,
  handleDownload,
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
    let editedItem = tableManager.getPartialRowItem(rowIndex);
    onEdit!(itemId, editedItem);
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
    return isEditing.some((value) => value);
  };

  // search field prompt box
  const searchField = searchObject?.searchField ?? "";
  const mappedSearchField = reverseFieldMapping[searchField] || searchField;

  return (
    <Box
      borderWidth={3}
      borderColor={"lightgrey"}
      borderEndWidth={0}
      borderStartWidth={0}
      my={10}
      width={"95%"}
      mx="auto"
    >
      <TableHeader
        tableHeading={tableManager.getTableHeader()}
        isSelectingRows={isSelectingRows}
        inputFields={tableManager.getInputFields()}
        handleBulkSwitchActions={handleBulkSwitchActions}
        handleBulkDeleteRows={handleBulkDeleteRows}
        productDetails={tableManager.getTableProduct()}
        onAddNew={onAddNew}
        isConnection={
          tableManager.getTableHeader() === "Source Connections" ||
          tableManager.getTableHeader() === "Destination Connections"
        }
      />
      <Stack spacing={6} align="stretch" width="100%" maxW="500px" mx="auto">
        {searchObject?.sortField &&
        searchObject.sortField !== "createdAt" &&
        searchObject.sortField !== "updatedAt" ? (
          <Box
            p={4}
            borderWidth={1}
            borderColor={secondaryColor}
            borderRadius="md"
            bg="gray.50"
            boxShadow="sm"
          >
            <Text fontWeight="bold" fontSize="lg">
              Sorting Information
            </Text>
            <HStack spacing={10} gap={10} justifyContent="center">
              <Text>
                <strong>Finding "</strong>
                {searchObject.sortField} <strong>" with "</strong>
                {searchObject.sortOrder}
                <strong>" order</strong>
              </Text>

              <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                onClick={handleClearSort}
              >
                <ImCross size={13} />
              </Button>
            </HStack>
          </Box>
        ) : null}

        {searchObject?.searchTerm && (
          <Box
            p={4}
            borderWidth={1}
            borderColor={secondaryColor}
            borderRadius="md"
            bg="gray.50"
            boxShadow="sm"
          >
            <Text fontWeight="bold" fontSize="lg">
              Search Results
            </Text>
            <HStack spacing={10} gap={10} justifyContent="center">
              <Text>
                <strong>Finding "</strong>
                {searchObject.searchTerm}
                <strong>" in "</strong>
                {mappedSearchField}
                <strong>"</strong>
              </Text>
              <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                onClick={handleClearSearch}
              >
                <ImCross size={13} />
              </Button>
            </HStack>
          </Box>
        )}
      </Stack>

      {searchObject?.selectedDates &&
        searchObject?.selectedDates.toString() !==
          ["0000-01-01", "9999-12-31"].toString() && (
          <HStack spacing={2} display={"flex"} justifyContent={"center"}>
            <Text>
              <strong>Selected Dates: </strong>
            </Text>
            {searchObject?.selectedDates.map((date, index) => (
              <HStack key={index} spacing={4} alignItems="center">
                <Text>{date}</Text>
              </HStack>
            ))}
            <Button variant="ghost" onClick={() => handleClearDates()}>
              <ImCross size={13} />
            </Button>
          </HStack>
        )}
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
                    onDateSearch={onDateSearch}
                    isClear={searchObject?.selectedDates?.every(
                      (date, index) =>
                        ["0000-01-01", "9999-12-31"][index] === date
                    )}
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
                      columnWidth={tableManager.getColumnWidths()[index]}
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
                  {tableManager.requiresActions() && (
                    <>
                      {/* Handle Download */}
                      {tableManager.requiresDownload() && (
                        <Tooltip hasArrow label="Download">
                          <Button
                            isDisabled={
                              tableManager.getDisableDownload
                                ? tableManager.getDisableDownload(rowIndex)
                                : false
                            }
                            onClick={
                              handleDownload
                                ? () => handleDownload(rowIndex)
                                : () => console.log("need download function ")
                            }
                          >
                            <FaDownload />
                          </Button>
                        </Tooltip>
                      )}

                      {/* Handle Redirect */}
                      {!tableManager.requiresDownload() &&
                        tableManager.requiresRedirect() && (
                          <TdRedirect
                            tableManager={tableManager}
                            rowIndex={rowIndex}
                          />
                        )}

                      {/* Handle Edit Button */}
                      {!tableManager.requiresDownload() &&
                        !tableManager.requiresRedirect() && (
                          <TdEditButton
                            isEditingMode={isEditingMode()}
                            isEditing={isEditing[rowIndex]}
                            isDisabled={
                              tableManager.getCanSaveEditedRows()[rowIndex]
                            }
                            handleEditToggle={
                              onClickEdit
                                ? () =>
                                    onClickEdit(
                                      tableManager.getRowItem(rowIndex)
                                    )
                                : () => handleEditToggle(rowIndex)
                            }
                            revertEdit={() => revertEdit(rowIndex)}
                            saveEdit={() => handleEditSave(rowIndex)}
                          />
                        )}

                      {/* Handle Delete Button */}
                      {tableManager.requiresDeleteButton() && (
                        <TdDeleteButton
                          handleDeleteRow={() => handleDeleteRow(row.getId())}
                          isConnection={
                            tableManager.getTableHeader() ===
                              "Source Connections" ||
                            tableManager.getTableHeader() ===
                              "Destination Connections"
                          }
                        />
                      )}
                    </>
                  )}

                  {/* Handle Test Button */}
                  {tableManager.requiresTestButton() && (
                    <TdTestButton
                      onClick={() => onTestConnection!(row.getId())}
                      isEditingMode={isEditingMode()}
                    />
                  )}
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Tbody>
              <Tr>
                <Td
                  colSpan={
                    tableManager.getTableHeadings().length +
                    (tableManager.requiresCheckBox() ? 1 : 0)
                  }
                  textAlign="center"
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="20px"
                  >
                    <Text>No data to show</Text>
                  </Box>
                </Td>
              </Tr>
            </Tbody>
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
