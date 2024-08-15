import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { DestinationConnection } from "../../models/DestinationConnection";
import { useBulkDeleteDestinationConnectionMutation, useDeleteDestinationConnectionMutation, useDestinationConnectionsQuery } from "../../hooks/useDestinationConnectionQuery";
import { useState } from "react";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";

interface DestinationConnectionDataProps {
  appId: number;
}

const DestinationConnectionData = ({
  appId,
}: DestinationConnectionDataProps) => {
  const [sortField, setSortField] = useState<FieldMappingKey>("Alias");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("");

  const {
    data: destinationConnections,
    isLoading,
    isError,
    error,
  } = useDestinationConnectionsQuery(appId, sortField, sortOrder);

  const { mutate: deleteDestinationConnection } = useDeleteDestinationConnectionMutation();
  const { mutate: bulkDeleteDestinationConnection } = useBulkDeleteDestinationConnectionMutation();


  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  // Apply filtering based on searchTerm and searchField
  const filteredDestinationConnections =
    destinationConnections?.filter((destinationConnection: any) => {
      if (actualSearchField && searchTerm) {
        const fieldValue = destinationConnection[actualSearchField];
        // Compare in lowercase if both are strings
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

  // Map destinationConnections to DestinationConnection objects
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

  const manager = new TableManager(
    new DestinationConnection(),
    destinationConnectionsList
  );

  const handleSort = (field: FieldMappingKey, order: string) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleSearch = (searchTerm: string, field: string) => {
    setSearchTerm(searchTerm);
    setSearchField(field);
  };

  const handleDelete = (destinationId: number) => {
    deleteDestinationConnection({appId, destinationId});
  }

  const handleBulkDelete = (destinationIds: number[]) => {
    bulkDeleteDestinationConnection({appId, destinationIds});
  }

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
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
        />
      )}
    </>
  );
};

export default DestinationConnectionData;
