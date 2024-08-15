import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    gcTime: 0, // No caching
  });
};

//delete destination connection
const deleteDestinationConnection = async (
  appId: number,
  destinationId: number
): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/applications/${appId}/destination-connections/${destinationId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete the destination connection.");
  }
};

export const useDeleteDestinationConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, destinationId }: { appId: number; destinationId: number; }) =>
      deleteDestinationConnection(appId, destinationId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch source connections query after successful deletion
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey[0] === "destinationConnections" && queryKey[1] === variables.appId;
        },
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting destination connection:", error);
    },
  });
};


//bulk delete destination connections
const bulkDeleteDestinationConnection = async (
  appId: number,
  destinationIds: number[]
): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/applications/${appId}/destination-connections`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(destinationIds),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete the destination connection.");
  }
};

export const useBulkDeleteDestinationConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, destinationIds }: { appId: number; destinationIds: number[]; }) =>
      bulkDeleteDestinationConnection(appId, destinationIds),
    onSuccess: (_, variables) => {
      // Invalidate and refetch source connections query after successful deletion
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey[0] === "destinationConnections" && queryKey[1] === variables.appId;
        },
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting destination connection:", error);
    },
  });
};

//bulk update status
const updateDestinationConnectionStatus = async (
  appId: number,
  destinationIds: number[],
  status: boolean
): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/applications/${appId}/destination-connections?isActive=${status}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(destinationIds),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update the destination connection status.");
  }
};

export const useUpdateDestinationConnectionStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, destinationIds, status }: { appId: number; destinationIds: number[]; status: boolean }) =>
      updateDestinationConnectionStatus(appId, destinationIds, status),
    onSuccess: (_, variables) => {
      // Invalidate queries that start with ["sourceConnections", appId]
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey[0] === "destinationConnections" && queryKey[1] === variables.appId;
        },
      });
    },
    onError: (error: Error) => {
      console.error("Error updating source destination status:", error);
    },
  });
};

