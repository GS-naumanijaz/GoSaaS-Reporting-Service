import { Box, Button, HStack } from "@chakra-ui/react";
import { useState } from "react";
import ProductsList from "./ProductsList";

const Products = () => {
  const [products, setProducts] = useState([
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
  ]);

  const filters = ["all", "active", "inactive"];

  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  return (
    <>
      <HStack marginLeft={10} marginTop={5} spacing={5}>
        {filters.map((filter) => (
          <Button>{filter}</Button>
        ))}
      </HStack>
      <ProductsList products={products} />
    </>
  );
};

export default Products;
