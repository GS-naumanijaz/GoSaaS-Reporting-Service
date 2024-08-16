import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BackendURL } from "../configs";
import { SourceConnection } from "../models/SourceConnection";

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
    search: searchTerm,
    search_by: searchField,
  });

  const response = await fetch(
    `${BackendURL}/applications/${appId}/source-connections?${params.toString()}`,
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
    throw new Error("Failed to delete the source connection.");
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
            queryKey[0] === "sourceConnections" &&
            queryKey[1] === variables.appId
          );
          return (
            queryKey[0] === "sourceConnections" &&
            queryKey[1] === variables.appId
          );
        },
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting source connection:", error);
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
    throw new Error("Failed to delete the source connection.");
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
            queryKey[0] === "sourceConnections" &&
            queryKey[1] === variables.appId
          );
          return (
            queryKey[0] === "sourceConnections" &&
            queryKey[1] === variables.appId
          );
        },
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting source connection:", error);
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
    throw new Error("Failed to update the source connection status.");
  }
};

export const useUpdateSourceConnectionStatusMutation = () => {
  const queryClient = useQueryClient();

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
            queryKey[0] === "sourceConnections" &&
            queryKey[1] === variables.appId
          );
          return (
            queryKey[0] === "sourceConnections" &&
            queryKey[1] === variables.appId
          );
        },
      });
    },
    onError: (error: Error) => {
      console.error("Error updating source connection status:", error);
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
    throw new Error("Failed to test the source connection.");
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
    throw new Error("Failed to add the source connection.");
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
        queryKey: ["sourceConnections", variables.appId],
      });
    },
    onError: (error: Error) => {
      console.error("Error adding source connection:", error);
    },
  });
};//edit source connection
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
    throw new Error("Failed to update the source connection status.");
  }
};

export const useEditSourceConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, editId, editedItem }: { appId: number; editId: number; editedItem: any }) =>
      editSourceConnection(appId, editId, editedItem),
    onSuccess: (_, variables) => {
      // Invalidate queries that start with ["sourceConnections", appId]
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey[0] === "sourceConnections" && queryKey[1] === variables.appId;
        },
      });
    },
    onError: (error: Error) => {
      console.error("Error updating source connection status:", error);
    },
  });
};

// export const useEditSourceConnectionMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ appId, editId, editedItem }: { appId: number; editId: number; editedItem: any }) =>
//       editSourceConnection(appId, editId, editedItem),
//     onMutate: async (variables) => {
//       // Cancel any outgoing refetches that match the beginning of the query key
//       await queryClient.cancelQueries({
//         predicate: (query) => {
//           const queryKey = query.queryKey;
//           return (
//             queryKey[0] === "sourceConnections" &&
//             queryKey[1] === variables.appId
//           );
//         },
//       });

//       // Snapshot the previous value
//       const previousConnections = queryClient.getQueryData(["sourceConnections", variables.appId]);

//       // Optimistically update to the new value
//       queryClient.setQueryData(["sourceConnections", variables.appId], (old: any) => {
//         if (!old) return old;
//         return old.map((connection: any) =>
//           connection.id === variables.editId ? { ...connection, ...variables.editedItem } : connection
//         );
//       });

//       // Return the snapshotted value
//       return { previousConnections };
//     },
//     onError: (error, variables, context) => {
//       // Roll back to the previous value if the mutation fails
//       queryClient.setQueryData(["sourceConnections", variables.appId], context?.previousConnections);
//       console.error("Error updating source connection status:", error);
//     },
//     onSettled: (data, error, variables) => {
//       // Always refetch after error or success
//       queryClient.invalidateQueries({
//         predicate: (query) => {
//           const queryKey = query.queryKey;
//           return (
//             queryKey[0] === "sourceConnections" &&
//             queryKey[1] === variables.appId
//           );
//         },
//       });
//     },  
//   });
// };
