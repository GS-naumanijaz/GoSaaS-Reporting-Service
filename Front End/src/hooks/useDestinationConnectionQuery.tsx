import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BackendURL } from "../configs";
import { DestinationConnection } from "../models/DestinationConnection";
import { useErrorToast } from "./useErrorToast";

const fetchDestinationConnections = async (
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
    search: searchTerm,
    search_by: searchField,
  });
  const response = await fetch(
    `${BackendURL}/applications/${appId}/destination-connections?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData.message || "Failed to fetch destination connections.";

    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.data;
};

export const useDestinationConnectionsQuery = (
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
      fetchDestinationConnections(
        appId,
        sortingBy,
        sortingOrder,
        page,
        pageSize,
        searchTerm,
        searchField
      ),
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
    `${BackendURL}/applications/${appId}/destination-connections/${destinationId}`,
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
    const errorMessage =
      errorData.message || "Failed to delete destination connection.";

    throw new Error(errorMessage);
  }
};

export const useDeleteDestinationConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      destinationId,
    }: {
      appId: number;
      destinationId: number;
    }) => deleteDestinationConnection(appId, destinationId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch source connections query after successful deletion
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            (queryKey[0] === "destinationConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "reportsConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "destinationConnections" && queryKey[1] === "list")
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};

//bulk delete destination connections
const bulkDeleteDestinationConnection = async (
  appId: number,
  destinationIds: number[]
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/destination-connections`,
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
    const errorData = await response.json();
    const errorMessage =
      errorData.message || "Failed to delete destination connections.";

    throw new Error(errorMessage);
  }
};

export const useBulkDeleteDestinationConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      destinationIds,
    }: {
      appId: number;
      destinationIds: number[];
    }) => bulkDeleteDestinationConnection(appId, destinationIds),
    onSuccess: (_, variables) => {
      // Invalidate and refetch source connections query after successful deletion
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            (queryKey[0] === "destinationConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "reportsConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "destinationConnections" && queryKey[1] === "list")
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
const updateDestinationConnectionStatus = async (
  appId: number,
  destinationIds: number[],
  status: boolean
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/destination-connections?isActive=${status}`,
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
    const errorData = await response.json();
    const errorMessage =
      errorData.message || "Failed to update destination connection status.";

    throw new Error(errorMessage);
  }
};

export const useUpdateDestinationConnectionStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      destinationIds,
      status,
    }: {
      appId: number;
      destinationIds: number[];
      status: boolean;
    }) => updateDestinationConnectionStatus(appId, destinationIds, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            (queryKey[0] === "destinationConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "reportsConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "destinationConnections" && queryKey[1] === "list")
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};

const testDestinationConnection = async (
  appId: number,
  testId: number
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/destination-connections/${testId}/test`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData.message || "Failed to test destination connection.";

    throw new Error(errorMessage);
  }

  return response.json();
};

export const useTestDestinationConnectionMutation = () => {
  return useMutation({
    mutationFn: ({ appId, testId }: { appId: number; testId: number }) =>
      testDestinationConnection(appId, testId),
  });
};

const addDestinationConnection = async (
  appId: number,
  data: DestinationConnection
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/destination-connections`,
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
    const errorMessage =
      errorData.message || "Failed to add destination connection.";

    throw new Error(errorMessage);
  }
};

export const useAddDestinationonnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, data }: { appId: number; data: any }) => {
      return addDestinationConnection(appId, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch the source connections query after successful addition
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            (queryKey[0] === "destinationConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "reportsConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "destinationConnections" && queryKey[1] === "list")
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};

//edit destination connection
const editDestinationConnection = async (
  appId: number,
  editId: number,
  editedItem: any
): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/applications/${appId}/destination-connections/${editId}`,
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
    const errorMessage =
      errorData.message || "Failed to edit destination connections.";

    throw new Error(errorMessage);
  }
};

export const useEditDestinationConnectionMutation = () => {
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
    }) => editDestinationConnection(appId, editId, editedItem),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            (queryKey[0] === "destinationConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "reportsConnections" && queryKey[1] === variables.appId) ||
            (queryKey[0] === "destinationConnections" && queryKey[1] === "list")
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};

//get list of all destination connections
const getDestinationConnectionsList = async (): Promise<any> => {
  const response = await fetch(
    `http://localhost:8080/applications/1/destination-connections/all`,
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
    const errorMessage =
      errorData.message || "Failed to fetch destination connections.";

    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.data;
};

export const useGetDestinationConnectionsListQuery = () => {
  return useQuery({
    queryKey: ['destinationConnections', "list"],
    queryFn: () => getDestinationConnectionsList(),
  })
};
