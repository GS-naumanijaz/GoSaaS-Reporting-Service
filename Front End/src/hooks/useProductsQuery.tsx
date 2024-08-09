import { useQuery } from "@tanstack/react-query";
import useProductStore from "../store";
import { Product } from "../components/Dashboard/Products";

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
    `http://localhost:8080/applications?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();
  console.log("Data returned: ", data.data);
  return data.data;
};

// Define the query hook
export const useProductsQuery = () => {
  const { currentPage, searchTerm, selectedFilter } = useProductStore();

  return useQuery({
    queryKey: ["products", currentPage, searchTerm, selectedFilter],
    queryFn: () => fetchProducts(currentPage, searchTerm, selectedFilter),
    refetchOnWindowFocus: true,
    // gcTime: 0, // cache time
  });
};
