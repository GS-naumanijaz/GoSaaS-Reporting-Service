import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { DestinationConnection } from "../../models/DestinationConnection";
import { useDestinationConnectionsQuery } from "../../hooks/useDestinationConnectionQuery";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";
import useDestinationConnectionStore from "../../store/DestinationConnStore";

interface DestinationConnectionDataProps {
  appId: number;
}

const DestinationConnectionData = ({
  appId,
}: DestinationConnectionDataProps) => {
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
  } = useDestinationConnectionStore();

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const {
    data: { content: destinationConnections = [] } = {},
    data: { totalElements = 0 } = {},
    isLoading,
    isError,
    error,
  } = useDestinationConnectionsQuery(
    appId,
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField
  );

  const destinationConnectionsList: DestinationConnection[] =
    destinationConnections.map(
      (destinationConnection: any) =>
        new DestinationConnection(
          destinationConnection.id,
          destinationConnection.alias,
          destinationConnection.secretKey,
          destinationConnection.accessKey,
          destinationConnection.bucketName,
          destinationConnection.region,
          destinationConnection.application,
          destinationConnection.isActive
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
    new DestinationConnection(),
    destinationConnectionsList
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
            : "Failed to fetch destination connection data."}
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

export default DestinationConnectionData;
