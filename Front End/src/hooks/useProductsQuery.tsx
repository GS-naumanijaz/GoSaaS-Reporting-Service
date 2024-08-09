import { useQuery } from "@tanstack/react-query";
import useProductStore from "../store";
import { Product } from "../components/Dashboard/Products";

// Define the fetch function
const fetchProducts = async (
  page: number,
  searchTerm: string
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
  });

  const response = await fetch(
    `http://localhost:8080/applications?${params.toString()}`,
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
  const { currentPage, searchTerm } = useProductStore();

  return useQuery({
    queryKey: ["products", currentPage, searchTerm],
    queryFn: () => fetchProducts(currentPage, searchTerm),
  });
};
