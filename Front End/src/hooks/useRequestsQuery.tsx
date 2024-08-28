import { useQuery } from "@tanstack/react-query";
import { BackendURL } from "../configs";

const searchFieldMapping: Record<string, string> = {
  name: "name",
  application: "application",
  createdAt: "createdAt",
  createdBy: "createdBy",
  issues: "issues",
  status: "status",
};

// Define the fetch function for audit logs
const fetchRequests = async (
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string,
  selectedModule: string,
  selectedAction: string,
  selectedDates: string[]
): Promise<{
  content: any[];
  totalPages: number;
  totalElements: number;
  empty: boolean;
}> => {
  const normalizedSearchField =
    searchFieldMapping[searchField.toLowerCase()] || searchField;
  const normalizedSortingBy =
    searchFieldMapping[sortingBy.toLowerCase()] || sortingBy;

  const params = new URLSearchParams({
    sort_by: normalizedSortingBy || "createdAt",
    sort_order: sortingOrder || "desc",
    page: page.toString(),
    page_size: pageSize.toString(),
    search_by: normalizedSearchField || "userId",
    search: searchTerm || "",
    module: selectedModule || "all",
    action: selectedAction || "all",
    start_date: selectedDates[0] || "0000-01-01",
    end_date: selectedDates[1] || "9999-12-31",
  });

  const response = await fetch(`${BackendURL}/requests?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  return data.data;
};

// Define the query hook for audit logs
export const useRequestsQuery = (
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
      "requests",
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
      fetchRequests(
        sortingBy,
        sortingOrder,
        page,
        pageSize,
        searchTerm,
        searchField,
        selectedModule,
        selectedAction,
        selectedDates
      ),
    refetchOnWindowFocus: true,
    gcTime: 0, // cache time
  });
};

export const useRequestCount = () => {
  return useQuery({
    queryKey: ["requestCount"],
    queryFn: async () => {
      const response = await fetch(`${BackendURL}/requests/statusCounts`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      return data.data;
    },
    refetchOnWindowFocus: true,
    gcTime: 0, // cache time
  });
};
