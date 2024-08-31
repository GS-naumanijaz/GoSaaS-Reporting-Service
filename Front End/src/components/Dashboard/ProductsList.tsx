import {
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import PageSelector from "./PageSelector";
import ProductElement from "./ProductElement";
import { Product } from "./Products";
import { FaChevronDown } from "react-icons/fa";
import { sx } from "../../configs";

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
  pageSize: number;
  onPageSizeChange: (newPageSize: number) => void;
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
  pageSize,
  onPageSizeChange,
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

  const generatePageSizes = (
    lowerBound: number,
    upperBound: number,
    step: number
  ) => {
    const sizes: number[] = [];

    if (upperBound > 0 && lowerBound > 0 && lowerBound <= upperBound) {
      let currentSize = lowerBound;
      while (currentSize <= upperBound) {
        sizes.push(currentSize);
        currentSize += step;
      }
      if (sizes.length === 0 || sizes[sizes.length - 1] < upperBound) {
        sizes.push(upperBound);
      }
    }
    return sizes.length > 0 ? sizes : [lowerBound];
  };

  console.log(totalPages)

  const pageSizes = generatePageSizes(2, totalElements <= 14 ? (totalElements % 2 === 0 ? totalElements : totalElements + 1) : 14, 2);

  return (
    <>
      <Box height={420}>
        <SimpleGrid columns={{ lg: pageSize / 2 }} padding={10} spacing={10}>
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
        <Box flex="1" textAlign="left">
          <Text>{`Showing ${products.length} of ${totalElements} Applications`}</Text>
        </Box>

        {/* {totalPages > 1 && ( */}
        <Box>
          <PageSelector
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </Box>
        <Box flex="1">
          <HStack justifyContent="flex-end">
            <Text>Max Rows per Page</Text>
            <Menu>
              <MenuButton
                bg="white"
                border="1px"
                borderColor="gray.200"
                as={Button}
                textAlign="left"
                fontWeight="normal"
                rightIcon={<FaChevronDown />}
              >
                {pageSize}
              </MenuButton>
              <MenuList
                maxHeight="30vh"
                overflowY="auto"
                overflowX="hidden"
                sx={sx}
              >
                {pageSizes.map((size) => (
                  <MenuItem key={size} onClick={() => onPageSizeChange(size)}>
                    {size}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
        </Box>
      </Flex>
    </>
  );
};

export default ProductsList;
