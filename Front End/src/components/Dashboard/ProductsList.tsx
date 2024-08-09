import { Box, Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import PageSelector from "./PageSelector";
import ProductElement from "./ProductElement";
import { Product } from "./Products";

interface Props {
  products: Product[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemVariants: {
    hidden: { opacity: number; x: number };
    visible: { opacity: number; x: number };
  };
  isEmpty: boolean;
  isFetching: boolean; // Added prop for loading state
}

const ProductsList = ({
  products,
  totalPages,
  totalElements,
  currentPage,
  setCurrentPage,
  itemVariants,
  isEmpty,
  isFetching, // Destructure the isFetching prop
}: Props) => {
  if (isFetching) {
    return (
      <Box marginY={10} padding={15} textAlign="center">
        <Spinner size="xl" />
        <Text fontSize={20} mt={4}>
          Loading products...
        </Text>
      </Box>
    );
  }

  if (isEmpty) {
    return (
      <Box marginY={10} padding={15} textAlign="center">
        <Text fontSize={30}>No search items found</Text>
      </Box>
    );
  }

  return (
    <>
      <Box height={420}>
        <SimpleGrid columns={{ lg: 3 }} padding={10} spacing={10}>
          {products.map((product, index) => (
            <motion.div
              key={product.id} // Assuming each product has a unique 'id'
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ProductElement product={product} />
            </motion.div>
          ))}
        </SimpleGrid>
      </Box>

      <Flex alignItems="center" marginX={12} mt={6}>
        <Box flex="1" />
        {totalPages > 1 && (
          <Box>
            <PageSelector
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </Box>
        )}

        <Box flex="1" textAlign="right">
          <Text>Total number of applications = {totalElements}</Text>
        </Box>
      </Flex>
    </>
  );
};

export default ProductsList;
