import { useQuery } from "@tanstack/react-query";
import { DestinationConnection } from "../models/DestinationConnection";

const fetchDestinationConnections = async (
  appId: number,
  sortingBy: string,
  sortingOrder: string
): Promise<DestinationConnection[]> => {
  const params = new URLSearchParams({
    sort_by: sortingBy,
    sort_order: sortingOrder,
  });
  console.log("Params: ", params.toString());
  const response = await fetch(
    `http://localhost:8080/applications/${appId}/destination-connections?${params.toString()}`,
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

export const useDestinationConnectionsQuery = (
  appId: number,
  sortingBy: string,
  sortingOrder: string
) => {
  return useQuery({
    queryKey: ["destinationConnections", appId, sortingBy, sortingOrder],
    queryFn: () => fetchDestinationConnections(appId, sortingBy, sortingOrder),
    enabled: !!appId, // Only fetch if appId is provided
    staleTime: 0, // Mark data as stale as soon as it is received
    gcTime: 0, // no caching
  });
};
