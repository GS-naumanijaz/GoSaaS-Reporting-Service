import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { DestinationConnection } from "../../models/DestinationConnection";
import { useDestinationConnectionsQuery } from "../../hooks/useDestinationConnectionQuery";
import { useState } from "react";
import { FieldMappingKey } from "../../services/sortMappings";

interface DestinationConnectionDataProps {
  appId: number;
}

const DestinationConnectionData = ({
  appId,
}: DestinationConnectionDataProps) => {
  const [sortField, setSortField] = useState<FieldMappingKey>("Alias"); // Assuming "Alias" as default sort field
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("");

  const {
    data: destinationConnections,
    isLoading,
    isError,
    error,
  } = useDestinationConnectionsQuery(appId, sortField, sortOrder);

  // Apply filtering based on searchTerm and searchField
  const filteredDestinationConnections =
    destinationConnections?.filter((destinationConnection: any) =>
      searchField && searchTerm
        ? destinationConnection[searchField]
            .toLowerCase()
            .toString()
            .includes(searchTerm)
        : true
    ) || [];

  // Map destinationConnections to DestinationConnection objects
  const destinationConnectionsList: DestinationConnection[] =
    filteredDestinationConnections.map(
      (destinationConnection: any) =>
        new DestinationConnection(
          destinationConnection.id,
          destinationConnection.alias,
          destinationConnection.type ?? "",
          destinationConnection.url,
          destinationConnection.port,
          destinationConnection.secret_key,
          destinationConnection.access_key,
          destinationConnection.application,
          destinationConnection.is_active
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
        />
      )}
    </>
  );
};

export default DestinationConnectionData;
