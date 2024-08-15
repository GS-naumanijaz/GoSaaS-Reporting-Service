import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SourceConnection } from "../models/SourceConnection";

const fetchSourceConnections = async (
  appId: number,
  sortingBy: string,
  sortingOrder: string
): Promise<SourceConnection[]> => {
  const params = new URLSearchParams({
    sort_by: sortingBy,
    sort_order: sortingOrder,
  });
  const response = await fetch(
    `http://localhost:8080/applications/${appId}/source-connections?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch source connection data.");
  }

  const data = await response.json();
  return data.data.content;
};

export const useSourceConnectionsQuery = (
  appId: number,
  sortingBy: string,
  sortingOrder: string
) => {
  return useQuery({
    queryKey: ["sourceConnections", appId, sortingBy, sortingOrder],
    queryFn: () => fetchSourceConnections(appId, sortingBy, sortingOrder),
    enabled: !!appId, // Only fetch if appId is provided
    staleTime: 0, // Mark data as stale as soon as it is received
    gcTime: 0, // no caching
  });
};


//delete source connection

const deleteSourceConnection = async (
  appId: number,
  sourceId: number
): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/applications/${appId}/source-connections/${sourceId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete the source connection.");
  }
};

export const useDeleteSourceConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, sourceId }: { appId: number; sourceId: number; }) =>
      deleteSourceConnection(appId, sourceId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch source connections query after successful deletion
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey[0] === "sourceConnections" && queryKey[1] === variables.appId;
        },
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting source connection:", error);
    },
  });
};
