import { useEffect, useState } from "react";
import { DestinationConnection } from "../../models/DestinationConnection";
import { TableManager } from "../../models/TableManager";
import CustomTable from "../Shared/CustomTable";
import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { Application } from "../ApplicationPage/AppDashboard";

// Define the props for the component
interface DestinationConnectionDataProps {
  appId: number;
}

interface DestinationCons {
  forEach: any;
  connections: DestinationConnection[];
}

const DestinationConnectionData = ({
  appId,
}: DestinationConnectionDataProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinationConnections, setDestinationConnections] =
    useState<DestinationCons | null>();

  useEffect(() => {
    const fetchDestinationConnections = async () => {
      if (appId) {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:8080/destination-connections`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await response.json();
          setDestinationConnections(data.data.content);
          console.log("DestinationData: ", data.data.content);
        } catch (error) {
          console.error(error);
          setError("Failed to fetch destination connection data.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDestinationConnections();
  }, [appId]);

  // map destinationConnections to DestinationConnection objects
  const destinationConnectionsList: DestinationConnection[] = [];
  if (destinationConnections) {
    destinationConnections.forEach((destinationConnection: any) => {
      if (destinationConnection.application.id !== appId) return; // remove this when get app by id route is created
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

  console.log(destinationConnectionsList);
  const manager = new TableManager(destinationConnectionsList);

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

export default DestinationConnectionData;
