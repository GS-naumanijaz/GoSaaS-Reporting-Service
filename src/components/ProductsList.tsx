import { Box, SimpleGrid } from "@chakra-ui/react";
import PageSelector from "./PageSelector";
import ProductElement from "./ProductElement";
import { Product } from "./Products";

interface Props {
  products: Product[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const ProductsList = ({ products, currentPage, setCurrentPage }: Props) => {
  const productPages = chunkArray(products, 6);

  const placeholdersNeeded = Math.max(0, 6 - productPages[currentPage].length);

  return (
    <>
      <SimpleGrid columns={{ md: 2, lg: 3 }} padding={10} spacing={10}>
        {productPages[currentPage].map((product, index) => (
          <ProductElement key={index} product={product} />
        ))}
        {Array.from({ length: placeholdersNeeded }).map((_, index) => (
          <Box key={index} height={40} />
        ))}
      </SimpleGrid>
      {productPages.length > 1 && (
        <Box display="flex" justifyContent="center">
          <PageSelector
            currentPage={currentPage}
            totalPages={productPages.length}
            setCurrentPage={setCurrentPage}
          />
        </Box>
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
