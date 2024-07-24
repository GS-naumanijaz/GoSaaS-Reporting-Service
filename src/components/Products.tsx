import { Button, HStack } from "@chakra-ui/react";
import { useState } from "react";
import ProductsList from "./ProductsList";
import { primaryColor } from "../configs";

const Products = () => {
  const products = [
    "abc",
    "ets",
    "123",
    "dummy",
    "test",
    "abc",
    "ets",
    "123",
    "dummy",
    "test",
  ];

  const filters = ["All", "Active", "Inactive"];

  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

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
      <ProductsList products={products} />
    </>
  );
};

export default Products;
