import { Box, Button, HStack } from "@chakra-ui/react";
import { useState } from "react";
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
}

const Products = () => {
  const products: Product[] = [
    { id: 1, name: "Product 1", description: "Description 1", isActive: true },
    { id: 2, name: "Product 2", description: "Description 2", isActive: false },
    { id: 3, name: "Product 3", description: "Description 3", isActive: true },
    { id: 4, name: "Product 4", description: "Description 4", isActive: false },
    { id: 5, name: "Product 5", description: "Description 5", isActive: true },
    { id: 6, name: "Product 6", description: "Description 6", isActive: false },
    { id: 7, name: "Product 7", description: "Description 7", isActive: true },
    { id: 8, name: "Product 8", description: "Description 8", isActive: false },
    { id: 9, name: "Product 9", description: "Description 9", isActive: true },
    {
      id: 10,
      name: "Product 10",
      description: "Description 10",
      isActive: false,
    },
    {
      id: 11,
      name: "Product 11",
      description: "Description 11",
      isActive: true,
    },
    {
      id: 12,
      name: "Product 12",
      description: "Description 12",
      isActive: false,
    },
    {
      id: 13,
      name: "Product 13",
      description: "Description 13",
      isActive: true,
    },
    {
      id: 14,
      name: "Product 14",
      description: "Description 14",
      isActive: false,
    },
    {
      id: 15,
      name: "Product 15",
      description: "Description 15",
      isActive: true,
    },
    {
      id: 16,
      name: "Product 16",
      description: "Description 16",
      isActive: false,
    },
  ];

  const allFilters = ["All", "Active", "Inactive"];

  const [selectedFilter, setSelectedFilter] = useState(allFilters[0]);
  const [currentPage, setCurrentPage] = useState(0);

  const navigate = useNavigate();

  const productsToShow = () => {
    switch (selectedFilter) {
      case "All":
        return products;
      case "Active":
        return products.filter((product) => product.isActive);
      case "Inactive":
        return products.filter((product) => !product.isActive);
    }
    return [];
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
            <ExpandingSearchbar
              onSearch={(searchTerm) => console.log(searchTerm)}
              bg="white"
            >
              <FaSearch color={primaryColor} />
            </ExpandingSearchbar>
            <Button
              onClick={() => navigate("/application")}
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
            products={productsToShow()}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemVariants={itemVariants} // Pass the animation variants if needed in ProductsList
          />
        </motion.div>
      </Box>
    </Box>
  );
};

export default Products;
