import { useEffect } from "react";
import { useAuditLogsQuery } from "../../hooks/useAuditLogQuery"; // Assuming you have a hook for fetching audit logs
import { AuditLog } from "../../models/AuditLog";
import { TableManager } from "../../models/TableManager";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";
import useAuditLogStore from "../../store/AuditLogStore";
import CustomTable from "../Shared/CustomTable";
import { Box } from "@chakra-ui/react";
import { sx } from "../../configs";

const AuditLogData = () => {
  const {
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    searchField,
    setSelectedModule,
    selectedModule,
    setSelectedAction,
    selectedAction,
    setCurrentPage,
    setSearchTerm,
    setSearchField,
    setSortField,
    setSortOrder,
    setPageSize,
    setPage,
    selectedDates,
    setSelectedDates,
  } = useAuditLogStore();

  useEffect(() => {
    setSelectedModule("All");
    setSelectedAction("All");
  }, [setSelectedModule, setSelectedAction]);

  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data, isLoading } = useAuditLogsQuery(
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField,
    selectedModule,
    selectedAction,
    selectedDates
  );

  const { content: auditLogs, totalElements } = data || {};

  const AuditLogList: AuditLog[] =
    auditLogs?.map(
      (log: any) =>
        new AuditLog(
          log.id,
          log.module,
          log.action,
          log.createdAt,
          log.details,
          log.username
        )
    ) || [];

  const manager = new TableManager(new AuditLog(), AuditLogList);

  function handleSearch(searchTerm: string, field: string): void {
    setSearchTerm(searchTerm);
    setSearchField(field);
    setCurrentPage(0);
  }

  function handleSort(field: string, order: string): void {
    const mappedField = fieldMapping[field as FieldMappingKey] || field;
    setSortField(mappedField);
    setSortOrder(order);
    setCurrentPage(0);
  }

  function handleClearSearch(): void {
    setSearchTerm("");
    setSearchField("");
    setCurrentPage(0);
  }

  function handleClearSort(): void {
    setSortField("createdAt");
    setSortOrder("desc");
    setCurrentPage(0);
  }

  function handlePageChange(newPage: number): void {
    setPage(newPage);
    setCurrentPage(newPage);
  }

  function handlePageSizeChange(newPageSize: number): void {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }

  const handleDateSearch = (date: string[]) => {
    setSelectedDates(date);
  };

  function handleClearDate(): void {
    setSelectedDates(["0000-01-01", "9999-12-31"]);
    setCurrentPage(0);
  }

  return (
    <Box
      bg={"white"}
      borderColor={"lightgrey"}
      borderWidth={2}
      borderRadius="md"
      // marginX={3}
      marginTop={2}
      textAlign="center"
      overflowY="auto"
      sx={sx}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        marginX={10}
        marginTop={5}
      >
        <CustomTable
          tableManager={manager}
          onSort={handleSort}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          page={page}
          pageSize={pageSize}
          totalElements={totalElements ?? 0}
          searchObject={{
            searchField: searchField || "",
            searchTerm: searchTerm || "",
            selectedDates: selectedDates || ["0000-01-01", "9999-12-31"],
            sortOrder: sortOrder,
            sortField: sortField,
          }}
          handleClearSearch={handleClearSearch}
          onDateSearch={handleDateSearch}
          handleClearSort={handleClearSort}
          handleClearDates={handleClearDate}
          onDelete={function (_: number): void {
            throw new Error("audit cannot delete");
          }}
          onBulkDelete={function (_: number[]): void {
            throw new Error("audit cannot bulk delete");
          }}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default AuditLogData;
