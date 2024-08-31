import { Box, Button, HStack, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import AddApplicationDialog from "../../ApplicationPage/AddApplicationDialog";
import { mainDashboardHeight, primaryColor, sx } from "../../../configs";
import ExpandingSearchbar from "../../Shared/ExpandingSearchbar";
import ViewSelector from "./ViewSelector";
import ProductsList from "../ProductsList";
import { useEffect, useState } from "react";
import { useProductsQuery } from "../../../hooks/useProductsQuery";
import useProductStore from "../../../store/ProductStore";
import { useAppDataMutation } from "../../../hooks/useAppDataQuery";
import { useQueryClient } from "@tanstack/react-query";
import { fieldMapping, FieldMappingKey } from "../../../services/sortMappings";

interface ProductsRenderProps {
  handleSelectedView: (view: string) => void;
}

const GridView = ({ handleSelectedView }: ProductsRenderProps) => {
  const {
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    searchField,
    reset,
    setSelectedFilter,
    selectedFilter,
    currentPage,
    setPage,
    setCurrentPage,
    setSearchTerm,
    setPageSize,
    selectedDates,
  } = useProductStore();

  useEffect(() => {
    setSelectedFilter("Active");
    setPageSize(6);
  }, [setSelectedFilter, setPageSize]);

  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data, isFetching, isError, refetch } = useProductsQuery(
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField,
    selectedFilter,
    selectedDates
  );

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // State to control the Add Application popup
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false);

  const addProduct = () => {
    setIsAddApplicationOpen(true);
  };

  const handleAddApplicationClose = () => {
    setIsAddApplicationOpen(false);
  };

  const onclose: (() => void) | null = null;
  const saveAppMutation = useAppDataMutation(onclose ?? (() => {}));
  const queryClient = useQueryClient();

  const handleAddApplicationSubmit = async (
    formData: Record<string, string>
  ) => {
    try {
      await saveAppMutation.mutateAsync({
        applicationName: formData.applicationName,
        applicationDescription: formData.applicationDescription,
      });

      // Refetch queries if needed
      await queryClient.refetchQueries({
        queryKey: ["products"],
      });
    } catch (error) {
      console.error("Failed to save application:", error);
    }
  };

  // Effect to reset page number when search term, filter, or page size changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedFilter, pageSize]);

  // Sync the store's `page` with `currentPage`
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const allFilters = ["All", "Active", "Inactive"];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
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
                  setSelectedFilter(filter);
                  refetch(); // Refresh data based on the new filter value
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
          <HStack>
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
              Add Application
            </Button>
            <ViewSelector viewType={handleSelectedView} />
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
              products={data?.content ?? []}
              totalElements={data?.totalElements ?? 0}
              totalPages={data?.totalPages ?? 1}
              currentPage={currentPage}
              setCurrentPage={handlePageChange} // Updated to handle page change correctly
              itemVariants={itemVariants}
              isEmpty={data?.empty ?? false}
              isFetching={isFetching}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
          </motion.div>
        )}
      </Box>

      {isAddApplicationOpen && (
        <AddApplicationDialog
          isOpen={isAddApplicationOpen}
          onClose={handleAddApplicationClose}
          onSubmit={handleAddApplicationSubmit}
          isFetching={saveAppMutation.status === "pending"}
        />
      )}
    </Box>
  );
};

export default GridView;
