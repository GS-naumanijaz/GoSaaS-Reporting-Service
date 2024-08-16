import { Box, Button, HStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaSearch, FaPlus } from "react-icons/fa";
import ProductsList from "./ProductsList";
import ExpandingSearchbar from "../Shared/ExpandingSearchbar";
import { mainDashboardHeight, primaryColor, sx } from "../../configs";
import useProductStore from "../../store/ProductStore";
import { useProductsQuery } from "../../hooks/useProductsQuery";
import { useEffect, useState } from "react";
import AddApplicationDialog from "../ApplicationPage/AddApplicationDialog";
import { useAppDataMutation } from "../../hooks/useAppDataQuery";
import { useQueryClient } from "@tanstack/react-query";

export interface Product {
  alias: string;
  id: number;
  description: string;
  isActive: boolean;
  creationDate: string;
  updationDate?: string | null;
  deletedBy?: string | null;
  deletionDate?: string | null;
}

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const Products = () => {
  const allFilters = ["All", "Active", "Inactive"];
  const {
    currentPage,
    selectedFilter,
    searchTerm,
    setCurrentPage,
    setSelectedFilter,
    setSearchTerm,
  } = useProductStore();

  const { data, isFetching, isError } = useProductsQuery();

  // State to control the Add Application popup
  const [isAddApplicationOpen, setAddApplicationOpen] = useState(false);

  // Effect to reset page number when filter or search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedFilter, searchTerm, setCurrentPage]);

  const addProduct = () => {
    setAddApplicationOpen(true);
  };

  const handleAddApplicationClose = () => {
    setAddApplicationOpen(false);
  };

  const saveAppMutation = useAppDataMutation();
  const queryClient = useQueryClient();

  const handleAddApplicationSubmit = async (
    formData: Record<string, string>
  ) => {
    try {
      await saveAppMutation.mutateAsync({
        applicationName: formData.applicationName,
        applicationDescription: formData.applicationDescription,
      });

      await queryClient.refetchQueries({
        queryKey: ["products", currentPage, searchTerm],
      });
    } catch (error) {
      console.error("Failed to save application:", error);
    } finally {
      handleAddApplicationClose();
    }
  };

  const filteredProducts =
    data?.content.filter((product: Product) => {
      switch (selectedFilter) {
        case "Active":
          return product.isActive;
        case "Inactive":
          return !product.isActive;
        default:
          return true;
      }
    }) || [];

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
              onClick={addProduct}
              border={"1px"}
              bg={primaryColor}
              color={"white"}
              _hover={{
                bg: "gray.100",
                color: primaryColor,
              }}
            >
              <FaPlus /> Add Application
            </Button>
          </HStack>
        </Box>
        {isError ? (
          <div>Error loading products...</div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ProductsList
              products={filteredProducts}
              totalElements={data?.totalElements ?? 0}
              totalPages={data?.totalPages ?? 1}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemVariants={itemVariants}
              isEmpty={data?.empty ?? false}
              isFetching={isFetching}
            />
          </motion.div>
        )}
      </Box>

      {isAddApplicationOpen && (
        <AddApplicationDialog
          isOpen={isAddApplicationOpen}
          onClose={handleAddApplicationClose}
          onSubmit={handleAddApplicationSubmit}
        />
      )}
    </Box>
  );
};

export default Products;
