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
  const [sortField, setSortField] = useState("alias");
  const [sortOrder, setSortOrder] = useState("desc");

  // Update the query hook to accept sorting parameters
  const {
    data: destinationConnections,
    isLoading,
    isError,
    error,
  } = useDestinationConnectionsQuery(appId, sortField, sortOrder);

  const handleSort = (field: FieldMappingKey, order: string) => {
    setSortField(fieldMapping[field]);
    setSortOrder(order);
  };

  // Map destinationConnections to DestinationConnection objects
  const destinationConnectionsList: DestinationConnection[] = [];
  if (destinationConnections) {
    destinationConnections.forEach((destinationConnection: any) => {
      destinationConnectionsList.push(
        new DestinationConnection(
          destinationConnection.id,
          destinationConnection.alias,
          destinationConnection.secretKey,
          destinationConnection.accessKey,
          destinationConnection.bucketName,
          destinationConnection.region,
          destinationConnection.application,
          destinationConnection.is_active
        )
      );
    });
  }

  console.log(destinationConnections)

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
          onSearch={() => {
            throw new Error("search implement karo destination connection me");
          }}
        />
      )}
    </>
  );
};

export default DestinationConnectionData;
