import { Box, Text } from "@chakra-ui/react";

interface Props {
  product: string;
}

const ProductElement = ({ product }: Props) => {
  return (
    <Box
      bg={"white"}
      height={40}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontSize={"xx-large"}>{product}</Text>
    </Box>
  );
};

export default ProductElement;
