import { useQuery } from "@tanstack/react-query";
import useProductStore from "../store/ProductStore";
import { Product } from "../components/Dashboard/Products";
import { BackendURL } from "../configs";

// Define the fetch function
const fetchProducts = async (
  page: number,
  searchTerm: string,
  status: string
): Promise<{
  content: Product[];
  totalPages: number;
  totalElements: number;
  empty: boolean;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: "6",
    search: searchTerm,
    status: status ?? "All",
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
export const useProductsQuery = () => {
  const { currentPage, searchTerm, selectedFilter } = useProductStore();

  return useQuery({
    queryKey: ["products", currentPage, searchTerm, selectedFilter],
    queryFn: () => fetchProducts(currentPage, searchTerm, selectedFilter),
    refetchOnWindowFocus: true,
    gcTime: 0, // cache time
  });
};
