import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { SourceConnection } from "../../models/SourceConnection";
import { useSourceConnectionsQuery } from "../../hooks/useSourceConnectionQuery";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";
import useSourceConnectionStore from "../../store/SourceConnStore";
interface SourceConnectionDataProps {
  appId: number;
}

const SourceConnectionData = ({ appId }: SourceConnectionDataProps) => {
  const {
    sortField,
    sortOrder,
    searchTerm,
    searchField,
    page,
    pageSize,
    setSortField,
    setSortOrder,
    setSearchTerm,
    setSearchField,
    setPage,
    setPageSize,
  } = useSourceConnectionStore();

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const {
    data: { content: sourceConnections = [], totalElements = 0 } = {},
    isLoading,
    isError,
    error,
  } = useSourceConnectionsQuery(
    appId,
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField
  );

  const sourceConnectionsList: SourceConnection[] = sourceConnections!.map(
    (sourceConnection: any) =>
      new SourceConnection(
        sourceConnection.id,
        sourceConnection.alias,
        sourceConnection.type ?? "",
        sourceConnection.databaseName,
        sourceConnection.host,
        sourceConnection.port.toString(),
        sourceConnection.username,
        sourceConnection.password,
        sourceConnection.application,
        sourceConnection.isActive
      )
  );

  const handleSort = (field: FieldMappingKey, order: string) => {
    const mappedField = fieldMapping[field];
    setSortField(mappedField);
    setSortOrder(order);
  };

  const handleSearch = (searchTerm: string, field: string) => {
    setSearchTerm(searchTerm);
    setSearchField(field);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const manager = new TableManager(
    new SourceConnection(),
    sourceConnectionsList
  );

  return (
    <>
      {isLoading ? (
        <Spinner size="xl" />
      ) : isError ? (
        <Alert status="error">
          <AlertIcon />
          {error instanceof Error
            ? error.message
            : "Failed to fetch source connection data."}
        </Alert>
      ) : (
        <CustomTable
          tableManager={manager}
          onSort={handleSort}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          page={page}
          pageSize={pageSize}
          totalElements={totalElements}
          searchObject={{
            searchField: actualSearchField,
            searchTerm: searchTerm,
          }}
        />
      )}
    </>
  );
};

export default SourceConnectionData;
