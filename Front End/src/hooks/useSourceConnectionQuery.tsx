import { useQuery } from "@tanstack/react-query";
import { SourceConnection } from "../models/SourceConnection";

const fetchSourceConnections = async (
  appId: number
): Promise<SourceConnection[]> => {
  const response = await fetch(`http://localhost:8080/source-connections`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch source connection data.");
  }

  const data = await response.json();
  return data.data.content.filter(
    // remove once fetch source by id route is created
    (connection: any) => connection.application.id === appId
  );
};

export const useSourceConnectionsQuery = (appId: number) => {
  return useQuery({
    queryKey: ["sourceConnections", appId],
    queryFn: () => fetchSourceConnections(appId),
    enabled: !!appId, // Only fetch if appId is provided
  });
};
