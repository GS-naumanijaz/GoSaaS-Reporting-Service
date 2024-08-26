import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DestinationConnection } from "../models/DestinationConnection";
import APIClient from "../services/apiClient";

const createApiClient = (appId: number) =>
  new APIClient<DestinationConnection>(`applications/${appId}/destinationConnections`);

const invalidateDestinationAndReportsConnections = (appId: number) => (query: any) => {
  const queryKey = query.queryKey;
  return (
    (queryKey[0] === "destinationConnections" && queryKey[1] === appId) ||
    (queryKey[0] === "reportsConnections" && queryKey[1] === appId) ||
    (queryKey[0] === "destinationConnections" && queryKey[1] === "list")
  );
};


//fetch all destination connections pagination
export const useDestinationConnections = (
  appId: number,
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string
) => {
  const apiClient = createApiClient(appId);

  return useQuery({
    queryKey: [
      "destinationConnections",
      appId,
      sortingBy,
      sortingOrder,
      page,
      pageSize,
      searchTerm,
      searchField,
    ],
    queryFn: () =>
      apiClient.getAll({
        params: {
          sort_by: sortingBy,
          sort_order: sortingOrder,
          page: page,
          page_size: pageSize,
          search_by: searchField,
          search: searchTerm,
        },
      }),
    staleTime: 1000 * 60 * 5, 
  });
};

// Hook to delete a single destination connection
export const useDeleteDestinationConnection = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: (destinationId: number) => apiClient.delete(`${destinationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateDestinationAndReportsConnections(appId),
      });
    },
  });
};

// Hook to bulk delete destination connections
export const useBulkDeleteDestinationConnections = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: (destinationIds: number[]) => apiClient.bulkDelete(destinationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateDestinationAndReportsConnections(appId),
      });
    },
  });
};

// Hook to update the status of multiple destination connections
export const useUpdateDestinationConnectionStatus = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: ({
      destinationIds,
      status,
    }: {
      destinationIds: number[];
      status: boolean;
    }) =>
      apiClient.updateStatus(status, destinationIds), 
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateDestinationAndReportsConnections(appId),
      });
    },
  });
};

// Hook to test a specific destination connection
export const useTestDestinationConnection = (appId: number) => {
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: (destinationId: number) => apiClient.get(`${destinationId}/test`),
  });
};

// Hook to add a new destination connection
export const useAddDestinationConnection = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: (newDestination: DestinationConnection) => apiClient.create(newDestination),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateDestinationAndReportsConnections(appId),
      });
    },
  });
};

// Hook to edit an existing destination connection
export const useEditDestinationConnection = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: ({
      destinationId,
      updatedDestination,
    }: {
      destinationId: number;
      updatedDestination: Partial<DestinationConnection>;
    }) => apiClient.update(`${destinationId}`, updatedDestination),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateDestinationAndReportsConnections(appId),
      });
    },
  });
};

// Hook to get the list of all destination connections for a report
export const useGetDestinationConnectionsListQuery = (appId: number) => {
  const apiClient = createApiClient(appId);

  return useQuery({
    queryKey: ["destinationConnections", appId, "list"],
    queryFn: () => apiClient.getListAll("all"),
    staleTime: 1000 * 60 * 5, 
  });
};
