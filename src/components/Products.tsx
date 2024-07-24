import { Button, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { primaryColor } from "../configs";
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
    <>
      <HStack marginLeft={10} marginTop={5} spacing={5}>
        {allFilters.map((filter, index) => (
          <Button
            key={index}
            onClick={() => {
              setCurrentPage(0);
              setSelectedFilter(filter);
            }}
            bg={selectedFilter === filter ? primaryColor : "white"}
            color={selectedFilter === filter ? "white" : primaryColor}
            _hover={{
              bg: selectedFilter === filter ? primaryColor : "gray.100",
              color: selectedFilter === filter ? "white" : "red.600",
            }}
          >
            {filter}
          </Button>
        ))}
      </HStack>
      <ProductsList
        products={productsToShow()}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default Products;
