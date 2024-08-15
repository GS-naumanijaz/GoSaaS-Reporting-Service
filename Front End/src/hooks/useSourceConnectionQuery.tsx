import { useQuery } from "@tanstack/react-query";

const fetchSourceConnections = async (
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
    `http://localhost:8080/applications/${appId}/source-connections?${params.toString()}`,
    { method: "GET", credentials: "include" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch source connection data.");
  }

  const data = await response.json();
  return data.data;
};

export const useSourceConnectionsQuery = (
  appId: number,
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: [
      "sourceConnections",
      appId,
      sortingBy,
      sortingOrder,
      page,
      pageSize,
    ],
    queryFn: () =>
      fetchSourceConnections(appId, sortingBy, sortingOrder, page, pageSize),
    enabled: !!appId,
    staleTime: 0,
    gcTime: 0,
  });
};
