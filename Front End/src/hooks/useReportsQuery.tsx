import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReportsConnection } from "../models/ReportsConnection";
import APIClient from "../services/apiClient";

interface ReportRequestBody {
  report: Partial<ReportsConnection>;
  sourceId: number;
  destinationId:number;
}

const createApiClient1 = (appId: number) =>
  new APIClient<ReportsConnection>(`applications/${appId}/reports`);

const createApiClient2 = (appId: number) =>
  new APIClient<ReportRequestBody>(`applications/${appId}/reports`);

// Utility function to create a predicate for invalidating queries
const invalidateReportsConnections = (appId: number) => (query: any) => {
  const queryKey = query.queryKey;
  return (
    queryKey[0] === "reportsConnections" && queryKey[1] === appId
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

// Hook to add a new report
export const useAddReport = (appId: number) => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient2(appId);

  return useMutation({
    mutationFn: (newReport: ReportRequestBody) => apiClient.create(newReport),
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

  return useMutation({
    mutationFn: ({
      reportId,
      updatedReport,
    }: {
      reportId: number;
      updatedReport: ReportRequestBody;
    }) => apiClient.update(`${reportId}`, updatedReport),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateReportsConnections(appId),
      });
    },
  });
};