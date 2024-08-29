import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import { Request } from "../models/Request";

const createApiClient = () => new APIClient<Request>(`requests`);

// Define the query hook for requests
export const useRequestsQuery = (
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string,
  selectedDates: string[]
) => {
  const apiClient = createApiClient();

  return useQuery({
    queryKey: [
      "requests",
      sortingBy,
      sortingOrder,
      page,
      pageSize,
      searchTerm,
      searchField,
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
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};

export const useRequestCount = () => {
  const apiClient = createApiClient();

  return useQuery({
    queryKey: ["requestCount"],
    queryFn: () => apiClient.get("statusCounts"),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};