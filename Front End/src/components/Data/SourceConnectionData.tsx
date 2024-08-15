import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { SourceConnection } from "../../models/SourceConnection";
import { useBulkDeleteSourceConnectionMutation, useDeleteSourceConnectionMutation, useSourceConnectionsQuery, useUpdateSourceConnectionStatusMutation } from "../../hooks/useSourceConnectionQuery";
import { useState } from "react";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";


interface SourceConnectionDataProps {
  appId: number;
}

const SourceConnectionData = ({ appId }: SourceConnectionDataProps) => {
  const [sortField, setSortField] = useState<FieldMappingKey>("Alias");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("");

  const {
    data: sourceConnections,
    isLoading,
    isError,
    error,
  } = useSourceConnectionsQuery(appId, sortField, sortOrder);

  const { mutate: deleteSourceConnection } = useDeleteSourceConnectionMutation();
  const { mutate: bulkDeleteSourceConnection } = useBulkDeleteSourceConnectionMutation();
  const { mutate: updateSourceConnectionStatus } = useUpdateSourceConnectionStatusMutation();

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  // Apply filtering based on searchTerm and searchField
  const filteredSourceConnections =
    sourceConnections?.filter((sourceConnection: any) => {
      if (actualSearchField && searchTerm) {
        const fieldValue = sourceConnection[actualSearchField];
        // Compare in lowercase if both are strings
        if (typeof fieldValue === "string" && typeof searchTerm === "string") {
          return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof fieldValue === "number" && typeof searchTerm === "string") {
          return fieldValue.toString().includes(searchTerm);
        }
        if (typeof fieldValue === "boolean" && typeof searchTerm === "string") {
          console.log("Bool: ", fieldValue, searchTerm);
          const searchBoolean = searchTerm.toLowerCase() === "active";
          return fieldValue === searchBoolean;
        }
        // console.log(sourceConnection[actualSearchField]);
        // Fall back to normal comparison
        return fieldValue.includes(searchTerm);
      }
      return true;
    }) || [];

  // Map sourceConnections to SourceConnection objects
  const sourceConnectionsList: SourceConnection[] =
    filteredSourceConnections.map(
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

  const manager = new TableManager(
    new SourceConnection(),
    sourceConnectionsList
  );

  const handleSort = (field: FieldMappingKey, order: string) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleSearch = (searchTerm: string, field: string) => {
    setSearchTerm(searchTerm);
    setSearchField(field);
  };

  const handleDelete = (sourceId: number) => {
    deleteSourceConnection({appId, sourceId});
  }

  const handleBulkDelete = (sourceIds: number[]) => {
    bulkDeleteSourceConnection({appId, sourceIds})
  }

  const handleBulkStatusUpdate = (sourceIds: number[], status: boolean) => {
    updateSourceConnectionStatus({appId, sourceIds, status})
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
            : "Failed to fetch source connection data."}
        </Alert>
      ) : (
        <CustomTable
          tableManager={manager}
          onSort={handleSort}
          onSearch={handleSearch}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onBulkUpdateStatus={handleBulkStatusUpdate}
        />
      )}
    </>
  );
};

export default SourceConnectionData;
