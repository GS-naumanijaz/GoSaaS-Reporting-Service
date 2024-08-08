import { useEffect, useState } from "react";
import { SourceConnection } from "../../models/SourceConnection";
import { TableManager } from "../../models/TableManager";
import CustomTable from "../Shared/CustomTable";
import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { Application } from "../ApplicationPage/AppDashboard";

interface SourceConnectionDataProps {
  appId: number;
}

interface SourceCons {
  forEach: any;
  connections: SourceConnection[];
}

const SourceConnectionData = ({ appId }: SourceConnectionDataProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceConnections, setSourceConnections] =
    useState<SourceCons | null>();

  useEffect(() => {
    const fetchSourceTables = async () => {
      if (appId) {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:8080/source-connections`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await response.json();
          setSourceConnections(data.data.content);
        } catch (error) {
          console.error(error);
          setError("Failed to fetch source connection data.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSourceTables();
  }, [appId]);

  // map sourceConnections to SourceConnection objects
  const sourceConnectionsList: SourceConnection[] = [];
  if (sourceConnections) {
    sourceConnections.forEach((sourceConnection: any) => {
      if (sourceConnection.application.id !== appId) return; // remove this when get app by id route is created
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
  const manager = new TableManager(sourceConnectionsList);

  return (
    <>
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <CustomTable tableManager={manager} />
      )}
    </>
  );
};

export default SourceConnectionData;
