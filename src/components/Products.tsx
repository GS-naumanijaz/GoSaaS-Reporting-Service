import { Box, Button, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { mainDashboardHeight, primaryColor, sx } from "../configs";
import ProductsList from "./ProductsList";

export interface Product {
  name: string;
  isActive: boolean;
}

const Products = () => {
  const products: Product[] = [
    { name: "Product 1", isActive: true },
    { name: "Product 2", isActive: false },
    { name: "Product 3", isActive: true },
    { name: "Product 4", isActive: false },
    { name: "Product 5", isActive: true },
    { name: "Product 6", isActive: false },
    { name: "Product 7", isActive: true },
    { name: "Product 8", isActive: false },
    { name: "Product 9", isActive: true },
    { name: "Product 10", isActive: false },
    { name: "Product 11", isActive: true },
    { name: "Product 12", isActive: false },
    { name: "Product 13", isActive: true },
    { name: "Product 14", isActive: false },
    { name: "Product 15", isActive: true },
    { name: "Product 16", isActive: false },
  ];

  const allFilters = ["All", "Active", "Inactive"];

  const [selectedFilter, setSelectedFilter] = useState(allFilters[0]);
  const [currentPage, setCurrentPage] = useState(0);

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
          <Button>Add Aplication</Button>
        </Box>
        <ProductsList
          products={productsToShow()}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Box>
    </Box>
  );
};

export default Products;
