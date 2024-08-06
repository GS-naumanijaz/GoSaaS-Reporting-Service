import { Box, Button, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { mainDashboardHeight, primaryColor, sx } from "../../configs";
import ProductsList from "./ProductsList";
import { motion } from "framer-motion";
import ExpandingSearchbar from "../Shared/ExpandingSearchbar";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export interface Product {
  name: string;
  id: number;
  description: string;
  isActive: boolean;
  creationDate: string;
  updationDate?: string | null;
  deletedBy?: string | null;
  deletionDate?: string | null;
}

const Products = () => {
  const allFilters = ["All", "Active", "Inactive"];
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // Start with 1 total page
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(allFilters[0]);
  const [isEmpty, setIsEmpty] = useState(false);

  const AppsPageSize = 6;
  useEffect(() => {
    const fetchProducts = async (
      page = 0,
      size = AppsPageSize,
      searchItem: string = searchTerm
    ) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          page_size: size.toString(),
          search: searchItem,
        });

        const response = await fetch(
          `http://localhost:8080/applications?${params.toString()}`,
          {
            method: "GET",
            credentials: "include", // Correctly placed in the fetch options
          }
        );

        const data = await response.json();
        const fetchedProducts: Product[] = data.data.content.map(
          (item: any): Product => ({
            name: item.name,
            id: item.id,
            description: item.description,
            isActive: item.is_active,
            creationDate: item.creation_date,
            updationDate: item.updation_date,
            deletedBy: item.deleted_by,
            deletionDate: item.deletion_date,
          })
        );

        setProducts(fetchedProducts);
        setTotalPages(data.data.totalPages);
        setTotalElements(data.data.totalElements);
        setIsEmpty(data.data.empty);
      } catch (error: any) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts(currentPage);
  }, [currentPage, AppsPageSize, searchTerm]);

  useEffect(() => {
    setFilteredProducts(productsToShow());
  }, [products, selectedFilter]);

  const productsToShow = () => {
    switch (selectedFilter) {
      case "All":
        return products;
      case "Active":
        return products.filter((product) => product.isActive);
      case "Inactive":
        return products.filter((product) => !product.isActive);
      default:
        return products;
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Box height={mainDashboardHeight} p={2}>
      <Box
        bg={"white"}
        borderColor={"lightgrey"}
        borderWidth={2}
        borderRadius="md"
        marginX={3}
        marginTop={2}
        textAlign="center"
        h="96.8%"
        overflowY="auto"
        sx={sx}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          marginX={10}
          marginTop={5}
        >
          <HStack spacing={5}>
            {allFilters.map((filter, index) => (
              <Button
                key={index}
                onClick={() => {
                  setCurrentPage(0);
                  setSelectedFilter(filter);
                }}
                border={"1px"}
                bg={selectedFilter === filter ? primaryColor : "white"}
                color={selectedFilter === filter ? "white" : primaryColor}
                _hover={{
                  bg: selectedFilter === filter ? primaryColor : "gray.100",
                  color: selectedFilter === filter ? "white" : primaryColor,
                }}
              >
                {filter}
              </Button>
            ))}
          </HStack>
          <HStack spacing={10}>
            <ExpandingSearchbar onSearch={(s) => setSearchTerm(s)} bg="white">
              <FaSearch color={primaryColor} />
            </ExpandingSearchbar>
            <Button
              onClick={() => navigate("/applications")}
              border={"1px"}
              bg={primaryColor}
              color={"white"}
              _hover={{
                bg: "gray.100",
                color: primaryColor,
              }}
            >
              Add Application
            </Button>
          </HStack>
        </Box>
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <ProductsList
            products={filteredProducts}
            totalElements={totalElements}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemVariants={itemVariants}
            isEmpty={isEmpty}
          />
        </motion.div>
      </Box>
    </Box>
  );
};

export default Products;
