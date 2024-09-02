import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReportsConnection } from "../models/ReportsConnection";
import APIClient from "../services/apiClient";

export interface ReportResponse {
  id: number; // Adjust the type if it's different (e.g., `string`)
  // Other properties if needed
}

interface ReportRequestBody {
  report: Partial<ReportsConnection>;
  sourceId: number;
  destinationId: number;
  id: number;
}

const createApiClient1 = (appId: number) =>
  new APIClient<ReportsConnection>(`applications/${appId}/reports`);

const createApiClient2 = (appId: number) =>
  new APIClient<ReportRequestBody>(`applications/${appId}/reports`);

// Utility function to create a predicate for invalidating queries
const invalidateReportsConnections = (appId: number) => (query: any) => {
  const queryKey = query.queryKey;
  return (
    (queryKey[0] === "reportsConnections" && queryKey[1] === appId) ||
    queryKey[0] === "pinnedReports" ||
    query.queryKey[0] === "auditLogs"
  );
};

//fetch all report pagination
export const useReports = (
  appId: number,
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string
) => {
  const apiClient = createApiClient1(appId);

  return useQuery({
    queryKey: [
      "reportsConnections",
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

// Hook to delete a single report
export const useDeleteReport = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient1(appId);

  return useMutation({
    mutationFn: (reportId: number) => apiClient.delete(`${reportId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateReportsConnections(appId),
      });
    },
  });
};

// Hook to bulk delete reports
export const useBulkDeleteReport = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient1(appId);

  return useMutation({
    mutationFn: (reportIds: number[]) => apiClient.bulkDelete(reportIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateReportsConnections(appId),
      });
    },
  });
};

// Hook to bulk update reports
export const useBulkUpdateReportStatus = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient1(appId);

  return useMutation({
    mutationFn: (data: { reportIds: number[]; status: boolean }) =>
      apiClient.updateStatus(data.status, data.reportIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateReportsConnections(appId),
      });
    },
  });
};

// Hook to upload file
export const useUploadFile = (appId: number) => {
  const apiClient = createApiClient1(appId);

  return useMutation({
    mutationFn: (data: { file: File; reportId: number }) =>
      apiClient.upload(data.file, data.reportId),
    onError: (error) => {
      console.error("File upload failed:", error);
    },
    onSuccess: () => {
      console.log("File uploaded successfully.");
    },
  });
};

// Hook to add a new report
export const useAddReport = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient2(appId);

  return useMutation<ReportResponse, Error, ReportRequestBody>({
    mutationFn: async (newReport: ReportRequestBody) => {
      const response = await apiClient.create(newReport);
      if (response === null) {
        throw new Error("Invalid request: No report data to send.");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateReportsConnections(appId),
      });
    },
  });
};

// Hook to edit an existing report
export const useEditReport = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient2(appId);

  return useMutation<
    ReportResponse,
    Error,
    { reportId: number; updatedReport: ReportRequestBody }
  >({
    mutationFn: async ({ reportId, updatedReport }) => {
      const response = await apiClient.update(`${reportId}`, updatedReport);
      if (response === null) {
        throw new Error("Invalid request: No report data to send.");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateReportsConnections(appId),
      });
    },
  });
};

// Hook to get the list of all pinned reports
export const useGetPinnedReports = () => {
  const apiClient = new APIClient<ReportsConnection>(`applications`);

  return useQuery({
    queryKey: ["pinnedReports"],
    queryFn: () => apiClient.getListAll("pinnedReports"),
    staleTime: 1000 * 60 * 5,
  });
};

export const getAllReportIds = async (appId: number): Promise<number[]> => {
  const apiClient = createApiClient1(appId);
  try {
    const response = await apiClient.getAllIds(); // response is of type AxiosResponse<number[]>
    return response.data; // Directly return the number[] array
  } catch (error) {
    console.error("Error fetching all IDs:", error);
    return [];
  }
};
