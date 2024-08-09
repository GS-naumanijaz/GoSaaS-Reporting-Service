import { useQuery } from "@tanstack/react-query";
import { DestinationConnection } from "../models/DestinationConnection";

const fetchDestinationConnections = async (
  appId: number
): Promise<DestinationConnection[]> => {
  const response = await fetch(
    `http://localhost:8080/applications/${appId}/destination-connections`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch destination connection data.");
  }

  const data = await response.json();
  return data.data.content;
};

export const useDestinationConnectionsQuery = (appId: number) => {
  return useQuery({
    queryKey: ["destinationConnections", appId],
    queryFn: () => fetchDestinationConnections(appId),
    enabled: !!appId, // Only fetch if appId is provided
  });
};
