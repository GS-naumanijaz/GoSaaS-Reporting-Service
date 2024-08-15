import { useQuery } from "@tanstack/react-query";

const fetchDestinationConnections = async (
  appId: number,
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number
) => {
  const params = new URLSearchParams({
    sort_by: sortingBy,
    sort_order: sortingOrder,
    page: page.toString(),
    page_size: pageSize.toString(),
  });
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
  return data.data;
};

export const useDestinationConnectionsQuery = (
  appId: number,
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: [
      "destinationConnections",
      appId,
      sortingBy,
      sortingOrder,
      page,
      pageSize,
    ],
    queryFn: () =>
      fetchDestinationConnections(
        appId,
        sortingBy,
        sortingOrder,
        page,
        pageSize
      ),
    enabled: !!appId, // Only fetch if appId is provided
    staleTime: 0, // Mark data as stale as soon as it is received
    gcTime: 0, // No caching
  });
};
