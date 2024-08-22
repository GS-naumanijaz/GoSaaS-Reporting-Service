import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "../components/Dashboard/Products";
import { BackendURL } from "../configs";

// Define the fetch function
const fetchProducts = async (
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string,
  selectedFilter: string,
  selectedDates: string[]
): Promise<{
  content: Product[];
  totalPages: number;
  totalElements: number;
  empty: boolean;
}> => {
  const params = new URLSearchParams({
    sort_by: sortingBy || "alias",
    sort_order: sortingOrder || "desc",
    page: page.toString(),
    page_size: pageSize.toString(),
    search_by: searchField || "alias",
    search: searchTerm || "",
    status: selectedFilter || "all",
    start_date: selectedDates[0] || "2024-01-01",
    end_date: selectedDates[1] || "9999-12-31",
  });
  const response = await fetch(
    `${BackendURL}/applications?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();
  return data.data;
};

// Define the query hook
export const useProductsQuery = (
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string,
  selectedFilter: string,
  selectedDates: string[]
) => {
  return useQuery({
    queryKey: [
      "products",
      sortingBy,
      sortingOrder,
      page,
      pageSize,
      searchTerm,
      searchField,
      selectedFilter,
      selectedDates,
    ],
    queryFn: () =>
      fetchProducts(
        sortingBy,
        sortingOrder,
        page,
        pageSize,
        searchTerm,
        searchField,
        selectedFilter,
        selectedDates
      ),
    refetchOnWindowFocus: true,
    gcTime: 0, // cache time
  });
};

import APIClient from "../services/apiClient";
const createApiClient = () => new APIClient<Product>(`applications`);

// mutation
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient();

  return useMutation({
    mutationFn: ({
      updateIds,
      status,
    }: {
      updateIds: number[];
      status: boolean;
    }) => apiClient.updateStatus(status, updateIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "products",
      });
    },
  });
};

export const useBulkDeleteApplications = () => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient();

  return useMutation({
    mutationFn: (ids: number[]) => apiClient.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "products",
      });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  const apiClient = createApiClient();

  return useMutation({
    mutationFn: (deleteId: number) => apiClient.delete(`${deleteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "products",
      });
    },
  });
};
