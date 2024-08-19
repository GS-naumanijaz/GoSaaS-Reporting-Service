import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SourceConnection } from "../models/SourceConnection";
import APIClient from "../services/apiClient";

const createApiClient = (appId: number) =>
  new APIClient<SourceConnection>(`applications/${appId}/source-connections`);

// Utility function to create a predicate for invalidating queries
const invalidateSourceAndReportsConnections = (appId: number) => (query: any) => {
  const queryKey = query.queryKey;
  return (
    (queryKey[0] === "sourceConnections" && queryKey[1] === appId) ||
    (queryKey[0] === "reportsConnections" && queryKey[1] === appId) ||
    (queryKey[0] === "sourceConnections" && queryKey[1] === "list")
  );
};


export const useSourceConnections = (
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
      "sourceConnections",
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

// Hook to delete a single source connection
export const useDeleteSourceConnection = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: (sourceId: number) => apiClient.delete(`${sourceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateSourceAndReportsConnections(appId),
      });
    },
  });
};

// Hook to bulk delete source connections
export const useBulkDeleteSourceConnections = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: (sourceIds: number[]) => apiClient.bulkDelete(sourceIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateSourceAndReportsConnections(appId),
      });
    },
  });
};

// Hook to update the status of multiple source connections
export const useUpdateSourceConnectionStatus = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: ({
      sourceIds,
      status,
    }: {
      sourceIds: number[];
      status: boolean;
    }) =>
      apiClient.updateStatus(status, sourceIds    ), 
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateSourceAndReportsConnections(appId),
      });
    },
  });
};

// Hook to test a specific source connection
export const useTestSourceConnection = (appId: number) => {
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: (sourceId: number) => apiClient.get(`${sourceId}/test`),
  });
};

// Hook to add a new source connection
export const useAddSourceConnection = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: (newSource: SourceConnection) => apiClient.create(newSource),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateSourceAndReportsConnections(appId),
      });
    },
  });
};

// Hook to edit an existing source connection
export const useEditSourceConnection = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient(appId);

  return useMutation({
    mutationFn: ({
      sourceId,
      updatedSource,
    }: {
      sourceId: number;
      updatedSource: Partial<SourceConnection>;
    }) => apiClient.update(`${sourceId}`, updatedSource),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateSourceAndReportsConnections(appId),
      });
    },
  });
};

// Hook to get the list of all source connections for a report
export const useGetSourceConnectionsListQuery = (appId: number) => {
  const apiClient = createApiClient(appId);

  return useQuery({
    queryKey: ["sourceConnections", appId, "list"],
    queryFn: () => apiClient.getListAll(),
    staleTime: 1000 * 60 * 5, 
  });
};