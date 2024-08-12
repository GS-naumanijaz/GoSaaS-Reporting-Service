import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { SourceConnection } from "../../models/SourceConnection";
import { useSourceConnectionsQuery } from "../../hooks/useSourceConnectionQuery";
import { useState } from "react";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";

interface SourceConnectionDataProps {
  appId: number;
}

const SourceConnectionData = ({ appId }: SourceConnectionDataProps) => {
  const [sortField, setSortField] = useState("alias");
  const [sortOrder, setSortOrder] = useState("desc");

  const {
    data: sourceConnections,
    isLoading,
    isError,
    error,
  } = useSourceConnectionsQuery(appId, sortField, sortOrder);

  const handleSort = (field: FieldMappingKey, order: string) => {
    console.log(fieldMapping[field], order);
    setSortField(fieldMapping[field]);
    setSortOrder(order);
    console.log("Updated: ", field, order);
  };
  // Map sourceConnections to SourceConnection objects
  const sourceConnectionsList: SourceConnection[] = [];
  if (sourceConnections) {
    sourceConnections.forEach((sourceConnection: any) => {
      sourceConnectionsList.push(
        new SourceConnection(
          sourceConnection.id,
          sourceConnection.alias,
          sourceConnection.type ?? "",
          sourceConnection.host,
          sourceConnection.port.toString(),
          sourceConnection.database_name,
          sourceConnection.username,
          sourceConnection.password,
          sourceConnection.application,
          sourceConnection.is_active
        )
      );
    });
  }

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
        <CustomTable tableManager={manager} onSort={handleSort} />
      )}
    </>
  );
};

export default SourceConnectionData;
