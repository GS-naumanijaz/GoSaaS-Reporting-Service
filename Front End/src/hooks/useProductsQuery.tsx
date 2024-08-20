import { useQuery } from "@tanstack/react-query";
import useProductStore from "../store/ProductStore";
import { Product } from "../components/Dashboard/Products";
import { BackendURL } from "../configs";

// Define the fetch function
const fetchProducts = async (
  sortingBy: string,
  sortingOrder: string,
  page: number,
  pageSize: number,
  searchTerm: string,
  searchField: string
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
  });
  const response = await fetch(
    `${BackendURL}/applications?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  console.log("response: ", `${BackendURL}/applications?${params.toString()}`);
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
  searchField: string
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
    ],
    queryFn: () =>
      fetchProducts(
        sortingBy,
        sortingOrder,
        page,
        pageSize,
        searchTerm,
        searchField
      ),
    refetchOnWindowFocus: true,
    gcTime: 0, // cache time
  });
};
