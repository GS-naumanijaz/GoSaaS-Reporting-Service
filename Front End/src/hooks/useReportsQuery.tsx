import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BackendURL } from "../configs";
import { ReportsConnection } from "../models/ReportsConnection";
import { useErrorToast } from "./useErrorToast";

const fetchReportsConnections = async (
  productId: number,
  sortField: string,
  sortOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string
) => {
  const params = new URLSearchParams({
    sort_by: sortField,
    sort_order: sortOrder,
    page: page.toString(),
    page_size: pageSize.toString(),
    search: searchTerm,
    search_by: searchField,
  });

  const response = await fetch(
    `${BackendURL}/applications/${productId}/reports?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reports connection data.");
  }

  const data = await response.json();
  return data.data;
};

export const useReportsQuery = (
  productId: number | null,
  sortField: string,
  sortOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string
) => {
  return useQuery({
    queryKey: [
      "reportsConnections",
      productId,
      sortField,
      sortOrder,
      page,
      pageSize,
      searchTerm,
      searchField,
    ],
    queryFn: () => {
      if (!productId) {
        throw new Error("No product ID provided.");
      }
      return fetchReportsConnections(
        productId,
        sortField,
        sortOrder,
        page,
        pageSize,
        searchTerm,
        searchField
      );
    },
    enabled: !!productId, // Only fetch if productId is provided
    staleTime: 0, // Mark data as stale as soon as it is received
    gcTime: 0, // No caching (note: 'gcTime' is an incorrect option in react-query)
  });
};

//delete report
const deleteReport = async (appId: number, reportId: number): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/reports/${reportId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete the report.");
  }
};

export const useDeleteReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, reportId }: { appId: number; reportId: number }) =>
      deleteReport(appId, reportId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch source connections query after successful deletion
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            queryKey[0] === "reportsConnections" &&
            queryKey[1] === variables.appId
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};

//bulk delete report connections
const bulkDeleteReport = async (
  appId: number,
  reportIds: number[]
): Promise<void> => {
  const response = await fetch(`${BackendURL}/applications/${appId}/reports`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportIds),
  });

  if (!response.ok) {
    throw new Error("Failed to delete the report.");
  }
};

export const useBulkDeleteReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      reportIds,
    }: {
      appId: number;
      reportIds: number[];
    }) => bulkDeleteReport(appId, reportIds),
    onSuccess: (_, variables) => {
      // Invalidate and refetch report connections query after successful deletion
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            queryKey[0] === "reportsConnections" &&
            queryKey[1] === variables.appId
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};


//create report
const createReport = async (
  appId: number,
  reportData: {
    report: ReportsConnection;
    sourceId: number;
    destinationId: number;
  }
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/reports`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create the report.");
  }
};

export const useCreateReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      reportData,
    }: {
      appId: number;
      reportData: {
        report: ReportsConnection;
        sourceId: number;
        destinationId: number;
      };
    }) => createReport(appId, reportData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch the relevant queries after successful creation
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            queryKey[0] === "reportsConnections" &&
            queryKey[1] === variables.appId
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};

//update report
const updateReport = async (
  appId: number,
  reportId: number,
  reportData: {
    report: ReportsConnection;
    sourceId: number;
    destinationId: number;
  }
): Promise<void> => {
  const response = await fetch(
    `${BackendURL}/applications/${appId}/reports/${reportId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create the report.");
  }
};

export const useUpdateReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      reportId,
      reportData,
    }: {
      appId: number;
      reportId: number;
      reportData: {
        report: ReportsConnection;
        sourceId: number;
        destinationId: number;
      };
    }) => updateReport(appId, reportId, reportData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch the relevant queries after successful creation
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            queryKey[0] === "reportsConnections" &&
            queryKey[1] === variables.appId
          );
        },
      });
    },
    onError: (error: Error) => {
      useErrorToast()(error.message);
    },
  });
};


