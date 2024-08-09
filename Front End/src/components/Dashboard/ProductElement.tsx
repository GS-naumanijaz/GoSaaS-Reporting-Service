import { Box, Text } from "@chakra-ui/react"; // Import PseudoBox
import { Product } from "./Products";
import { primaryColor } from "../../configs";
import { useNavigate } from "react-router-dom";

interface Props {
  product: Product;
}

const ProductElement = ({ product }: Props) => {
  const navigate = useNavigate();
  return (
    <Box
      bg={"white"}
      overflow={"hidden"}
      position="relative"
      height={40}
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius={20}
      borderWidth={1}
      borderColor={primaryColor}
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
      onClick={() => {
        navigate("/applications", { state: product });
      }}
    >
      {/* Red Semi-circle */}
      <Box
        position="absolute"
        top={0}
        right={0}
        bg={product.is_active ? "lightgreen" : "#ff9999"}
        width={10}
        height={10}
        borderRadius="0 20px 0 50px"
      />

      <Text fontSize={["sm", "md", "lg"]}>{product.name}</Text>
    </Box>
  );
};

export default ProductElement;
