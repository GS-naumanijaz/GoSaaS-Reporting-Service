import { useQuery } from "@tanstack/react-query";
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
  selectedFilter: string
): Promise<{
  content: Product[];
  totalPages: number;
  totalElements: number;
  empty: boolean;
}> => {
  const params = new URLSearchParams({
    sort_by: sortingBy,
    sort_order: sortingOrder,
    page: page.toString(),
    page_size: pageSize.toString(),
    search_by: searchField,
    search: searchTerm,
    status: selectedFilter,
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
  selectedFilter: string
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
    ],
    queryFn: () =>
      fetchProducts(
        sortingBy,
        sortingOrder,
        page,
        pageSize,
        searchTerm,
        searchField,
        selectedFilter
      ),
    refetchOnWindowFocus: true,
    gcTime: 0, // cache time
  });
};
