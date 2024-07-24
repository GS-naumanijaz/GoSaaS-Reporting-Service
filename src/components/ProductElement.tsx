import { Box, Text } from "@chakra-ui/react";
import { Product } from "./Products";
import { primaryColor } from "../configs";

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
      borderWidth={1}
      borderColor={primaryColor}
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
    >
      <Text fontSize={"xx-large"}>{product.name}</Text>
    </Box>
  );
};

export default ProductElement;
