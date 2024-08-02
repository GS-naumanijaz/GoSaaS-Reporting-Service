import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import PageSelector from "./PageSelector";
import ProductElement from "./ProductElement";
import { Product } from "./Products";

interface Props {
  products: Product[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemVariants: {
    hidden: { opacity: number; x: number };
    visible: { opacity: number; x: number };
  };
}

const ProductsList = ({
  products,
  currentPage,
  setCurrentPage,
  itemVariants,
}: Props) => {
  const productPages = chunkArray(products, 6);
  const placeholdersNeeded = Math.max(0, 6 - productPages[currentPage].length);

  return (
    <>
      <SimpleGrid columns={{ md: 2, lg: 3 }} padding={10} spacing={10}>
        {productPages[currentPage].map((product, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <ProductElement product={product} />
          </motion.div>
        ))}
        {Array.from({ length: placeholdersNeeded }).map((_, index) => (
          <Box key={index} height={40} />
        ))}
      </SimpleGrid>
      {productPages.length > 1 && (
        <Flex alignItems="center" marginX={12}>
          <Box flex="1">
            {/* Empty Box to take up space and push the selector to the center */}
          </Box>
          <Box>
            <PageSelector
              currentPage={currentPage}
              totalPages={productPages.length}
              setCurrentPage={setCurrentPage}
            />
          </Box>
          <Box flex="1" textAlign="right">
            <Text>Total number of applications = {products.length}</Text>
          </Box>
        </Flex>
      )}
    </>
  );
};

function chunkArray(array: Product[], chunkSize: number): Product[][] {
  const result: Product[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export default ProductsList;
