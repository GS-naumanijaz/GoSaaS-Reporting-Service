import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { DestinationConnection } from "../../models/DestinationConnection";
import { useDestinationConnectionsQuery } from "../../hooks/useDestinationConnectionQuery";

interface DestinationConnectionDataProps {
  appId: number;
}

const DestinationConnectionData = ({
  appId,
}: DestinationConnectionDataProps) => {
  const {
    data: destinationConnections,
    isLoading,
    isError,
    error,
  } = useDestinationConnectionsQuery(appId);

  // Map destinationConnections to DestinationConnection objects
  const destinationConnectionsList: DestinationConnection[] = [];
  if (destinationConnections) {
    destinationConnections.forEach((destinationConnection: any) => {
      destinationConnectionsList.push(
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
    });
  }

  const manager = new TableManager(destinationConnectionsList);

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
        <CustomTable tableManager={manager} />
      )}
    </>
  );
};

export default DestinationConnectionData;
