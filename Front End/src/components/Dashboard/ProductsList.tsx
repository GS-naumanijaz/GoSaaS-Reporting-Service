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
}

const ProductsList = ({
  products,
  totalPages,
  totalElements,
  currentPage,
  setCurrentPage,
  itemVariants,
  isEmpty,
}: Props) => {
  return isEmpty ? (
    <Box marginY={10} padding={15}>
      <Text fontSize={30}> No search item found</Text>
    </Box>
  ) : !products.length ? (
    <Box marginY={10} padding={15}>
      <Spinner />
    </Box>
  ) : (
    <>
      <SimpleGrid columns={{ md: 2, lg: 3 }} padding={10} spacing={10}>
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

      {totalPages > 1 && (
        <Flex alignItems="center" marginX={12}>
          <Box flex="1" />
          <Box>
            <PageSelector
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </Box>
          <Box flex="1" textAlign="right">
            <Text>Total number of applications = {totalElements}</Text>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default ProductsList;
