import { Box, Text } from "@chakra-ui/react";
import { Product } from "./Products";

interface Props {
  product: Product;
}

const ProductElement = ({ product }: Props) => {
  return (
    <Box
      bg={"white"}
      height={40}
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius={20}
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
    >
      <Text fontSize={"xx-large"}>{product.name}</Text>
    </Box>
  );
};

export default ProductElement;
