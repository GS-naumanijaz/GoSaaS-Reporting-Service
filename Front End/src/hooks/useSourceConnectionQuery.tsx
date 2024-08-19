import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BackendURL } from "../configs";
import { SourceConnection } from "../models/SourceConnection";
import { useErrorToast } from "./useErrorToast";
import APIClient from "../services/apiClient";

const createApiClient = (appId: number) => 
  new APIClient<SourceConnection>(`applications/${appId}/source-connections`);

export const useSourceConnections = (
  appId: number, 
  sortingBy: string, 
  sortingOrder: string, 
  page: number, 
  pageSize: number, 
  searchTerm: string, 
  searchField: string
) => {
  // Create the API client specific to the appId
  const apiClient = createApiClient(appId);

  return useQuery({
    queryKey: ["sourceConnections", appId, sortingBy, sortingOrder, page, pageSize, searchTerm, searchField],
    queryFn: () => apiClient.getAll({
      params: {
        sort_by: sortingBy,
        sort_order: sortingOrder,
        page: page,
        page_size: pageSize,
        search_by: searchField,
        search: searchTerm,
      }
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes cache time
  });
};

const fetchSourceConnections = async (
  appId: number,
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string
) => {
  const params = new URLSearchParams({
    sort_by: sortingBy,
    sort_order: sortingOrder,
    page: page.toString(),
    page_size: pageSize.toString(),
    search_by: searchField,
    search: searchTerm,
  });

  const response = await fetch(
    `${BackendURL}/applications/${appId}/source-connections?${params.toString()}`,
    { method: "GET", credentials: "include" }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Failed to fetch the source connection.";
    
    throw new Error(errorMessage);

  }

  const data = await response.json();
  return data.data;
};

export const useSourceConnectionsQuery = (
  appId: number,
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string
) => {
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
      fetchSourceConnections(
        appId,
        sortingBy,
        sortingOrder,
        page,
        pageSize,
        searchTerm,
        searchField
      ),
    enabled: !!appId,
    staleTime: 0,
    gcTime: 0,
  });
};

//delete source connection
const deleteSourceConnection = async (
  appId: number,
  sourceId: number
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/source-connections/${sourceId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Failed to delete source connection.";
    
    throw new Error(errorMessage);

  }
};

export const useDeleteSourceConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, sourceId }: { appId: number; sourceId: number }) =>
      deleteSourceConnection(appId, sourceId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch source connections query after successful deletion
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            (queryKey[0] === "sourceConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "reportsConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "sourceConnections" && queryKey[1] === "list")
          );
        },
      });
    },
    onError: (error: Error) => {  
      useErrorToast()("Error deleting source connection:" + error.message);
    },
  });
};

//bulk delete source connections
const bulkDeleteSourceConnection = async (
  appId: number,
  sourceIds: number[]
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/source-connections`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sourceIds),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Failed to bulk delete source connections.";
    
    throw new Error(errorMessage);
  }
};

export const useBulkDeleteSourceConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      sourceIds,
    }: {
      appId: number;
      sourceIds: number[];
    }) => bulkDeleteSourceConnection(appId, sourceIds),
    onSuccess: (_, variables) => {
      // Invalidate and refetch source connections query after successful deletion
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            (queryKey[0] === "sourceConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "reportsConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "sourceConnections" && queryKey[1] === "list")
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};

//bulk update status
const updateSourceConnectionStatus = async (
  appId: number,
  sourceIds: number[],
  status: boolean
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/source-connections?isActive=${status}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sourceIds),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Failed to update the source connection status.";
    
    throw new Error(errorMessage);
  }
};

export const useUpdateSourceConnectionStatusMutation = () => {
  const queryClient = useQueryClient();
  const toast = useErrorToast();

  return useMutation({
    mutationFn: ({
      appId,
      sourceIds,
      status,
    }: {
      appId: number;
      sourceIds: number[];
      status: boolean;
    }) => updateSourceConnectionStatus(appId, sourceIds, status),
    onSuccess: (_, variables) => {
      // Invalidate queries that start with ["sourceConnections", appId]
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            (queryKey[0] === "sourceConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "reportsConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "sourceConnections" && queryKey[1] === "list")
          );
        },
      });
    },
    onError: (error: Error) => {
      toast(error.message);
    },
  });
};

const testSourceConnection = async (
  appId: number,
  testId: number
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/source-connections/${testId}/test`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Failed to test the source connection.";
    
    throw new Error(errorMessage);
  }

  return response.json();
};

export const useTestSourceConnectionMutation = () => {
  return useMutation({
    mutationFn: ({ appId, testId }: { appId: number; testId: number }) =>
      testSourceConnection(appId, testId),
  });
};

const addSourceConnection = async (
  appId: number,
  data: SourceConnection
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/source-connections`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Failed to add the source connection.";
    
    throw new Error(errorMessage);
  }
};

export const useAddSourceConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, data }: { appId: number; data: any }) => {
      return addSourceConnection(appId, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch the source connections query after successful addition
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            (queryKey[0] === "sourceConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "reportsConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "sourceConnections" && queryKey[1] === "list")
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};

//edit source connection
const editSourceConnection = async (
  appId: number,
  editId: number,
  editedItem: any
): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/applications/${appId}/source-connections/${editId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedItem),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Failed to edit the source connection.";
    
    throw new Error(errorMessage);
  }
};

export const useEditSourceConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      editId,
      editedItem,
    }: {
      appId: number;
      editId: number;
      editedItem: any;
    }) => editSourceConnection(appId, editId, editedItem),
    onSuccess: (_, variables) => {
      // Invalidate queries that start with ["sourceConnections", appId]
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            (queryKey[0] === "sourceConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "reportsConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "sourceConnections" && queryKey[1] === "list")
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};

//get list of all source connection for report
const getSourceConnectionsList = async (): Promise<any> => {
  const response = await fetch(
    `http://localhost:8080/applications/1/source-connections/all`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Failed to fetch the source connections.";
    
    throw new Error(errorMessage);

  }

  const data = await response.json();
  return data.data;
};

export const useGetSourceConnectionsListQuery = () => {
  return useQuery({
    queryKey: ["sourceConnections", "list"],
    queryFn: () => getSourceConnectionsList(),
  });
};

