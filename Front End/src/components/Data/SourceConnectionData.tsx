import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { SourceConnection } from "../../models/SourceConnection";
import { useSourceConnectionsQuery } from "../../hooks/useSourceConnectionQuery";
import { useState } from "react";
import { FieldMappingKey } from "../../services/sortMappings";

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

  // Apply filtering based on searchTerm and searchField
  const filteredSourceConnections =
    sourceConnections?.filter((sourceConnection: any) =>
      searchField && searchTerm
        ? sourceConnection[searchField]
            .toLowerCase()
            .toString()
            .includes(searchTerm)
        : true
    ) || [];

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

  console.log("sourceConnectionsList", sourceConnectionsList);
  const handleSort = (field: FieldMappingKey, order: string) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleSearch = (searchTerm: string, field: string) => {
    setSearchTerm(searchTerm);
    setSearchField(field);
  };

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
        />
      )}
    </>
  );
};

export default SourceConnectionData;
