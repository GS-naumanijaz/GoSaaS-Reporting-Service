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
  selectedFilter: string,
  selectedDates: string[]
): Promise<{
  content: Product[];
  totalPages: number;
  totalElements: number;
  empty: boolean;
}> => {
  console.log("reached")
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
  console.log(selectedDates);
  const response = await fetch(
    `${BackendURL}/applications?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();
  console.log("Response");
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
