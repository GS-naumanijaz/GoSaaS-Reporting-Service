import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { DestinationConnection } from "../../models/DestinationConnection";
import { useDestinationConnectionsQuery } from "../../hooks/useDestinationConnectionQuery";
import { useState } from "react";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";

interface DestinationConnectionDataProps {
  appId: number;
}

const DestinationConnectionData = ({
  appId,
}: DestinationConnectionDataProps) => {
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);

  const {
    data: { content: destinationConnections } = {},
    data: { totalElements = 0 } = {},
    isLoading,
    isError,
    error,
  } = useDestinationConnectionsQuery(
    appId,
    sortField,
    sortOrder,
    page,
    pageSize
  );

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  // Apply filtering based on searchTerm and searchField
  const filteredDestinationConnections =
    destinationConnections?.filter((destinationConnection: any) => {
      if (actualSearchField && searchTerm) {
        const fieldValue = destinationConnection[actualSearchField];
        if (typeof fieldValue === "string" && typeof searchTerm === "string") {
          return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof fieldValue === "number" && typeof searchTerm === "string") {
          return fieldValue.toString().includes(searchTerm);
        }
        if (typeof fieldValue === "boolean" && typeof searchTerm === "string") {
          const searchBoolean = searchTerm.toLowerCase() === "active";
          return fieldValue === searchBoolean;
        }
        return fieldValue.includes(searchTerm);
      }
      return true;
    }) || [];

  const destinationConnectionsList: DestinationConnection[] =
    filteredDestinationConnections.map(
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
    setPage(0);
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
        />
      )}
    </>
  );
};

export default DestinationConnectionData;
