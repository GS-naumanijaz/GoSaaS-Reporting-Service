import { useQuery } from "@tanstack/react-query";
import { BackendURL } from "../configs";
import { AuditLog } from "../models/AuditLog";
import APIClient from "../services/apiClient";

const searchFieldMapping: Record<string, string> = {
  user: "username",
  "created at": "createdAt",
  module: "module",
  action: "action",
  details: "details",
};

const apiClient = new APIClient<AuditLog>(`auditLog`);

//fetch all destination connections pagination
// Define the query hook for audit logs
export const useAuditLogsQuery = (
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string,
  selectedModule: string,
  selectedAction: string,
  selectedDates: string[]
) => {

  return useQuery({
    queryKey: [
      "auditLogs",
      sortingBy,
      sortingOrder,
      page,
      pageSize,
      searchTerm,
      searchField,
      selectedModule,
      selectedAction,
      selectedDates,
    ],
    queryFn: () =>
      apiClient.getAll({
        params: {
          sort_by: searchFieldMapping[sortingBy.toLowerCase()] || sortingBy,
          sort_order: sortingOrder || "desc",
          page: page.toString(),
          page_size: pageSize.toString(),
          search_by: searchFieldMapping[searchField.toLowerCase()] || searchField,
          search: searchTerm || "",
          module: selectedModule || "all",
          action: selectedAction || "all",
          start_date: selectedDates[0] || "0000-01-01",
          end_date: selectedDates[1] || "9999-12-31",
        },
      }),
    staleTime: 1000 * 60 * 5, // same as used in useDestinationConnections
    refetchOnWindowFocus: true
  });
};