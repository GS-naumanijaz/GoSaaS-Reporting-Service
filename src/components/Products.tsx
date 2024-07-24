import { Button, HStack } from "@chakra-ui/react";
import { useState } from "react";
import ProductsList from "./ProductsList";
import { primaryColor } from "../configs";

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

  const filters = ["All", "Active", "Inactive"];

  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

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
        {filters.map((filter, index) => (
          <Button
            key={index}
            onClick={() => setSelectedFilter(filter)}
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
      <ProductsList products={productsToShow()} />
    </>
  );
};

export default Products;
