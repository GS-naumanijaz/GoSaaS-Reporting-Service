import {
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";

interface Props {
  NoOfRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

const TableFooter = ({
  NoOfRecords = 0,
  page = 0,
  pageSize = 5,
  onPageChange,
  onPageSizeChange,
}: Props) => {
  // Use local state to manage totalPages
  const [totalPages, setTotalPages] = useState(
    Math.ceil(NoOfRecords / pageSize)
  );
  // Recalculate totalPages whenever NoOfRecords or pageSize changes
  useEffect(() => {
    setTotalPages(Math.ceil(NoOfRecords / pageSize) || 1);
  }, [NoOfRecords, pageSize]);

  // calculating range of records
  const safePageSize = pageSize > 0 ? pageSize : 1;
  const lowerRange = NoOfRecords === 0 ? 0 : page * safePageSize + 1;
  const upperRange = Math.min((page + 1) * safePageSize, NoOfRecords);

  const showPagination = totalPages > 1;

  // for page size calculation
  const generatePageSizes = (upperBound: number, step: number) => {
    const sizes: number[] = [];

    if (upperBound > 0) {
      let currentSize = step;
      while (currentSize <= upperBound) {
        sizes.push(currentSize);
        currentSize += step;
      }
      if (sizes.length === 0 || sizes[sizes.length - 1] < upperBound) {
        sizes.push(currentSize);
      }
    }
    return sizes.length > 0 ? sizes : [5];
  };
  const pageSizes = generatePageSizes(NoOfRecords, 5);

  return (
    <Box margin={4}>
      <Flex justifyContent="space-between" alignItems="center">
        {NoOfRecords !== 0 && (
          <Text flex="1" textAlign="left">
            {`${lowerRange}-${upperRange} of ${NoOfRecords} records showing`}
          </Text>
        )}
        <HStack spacing={4} justifyContent="center" flex="1">
          {showPagination && (
            <>
              <Button
                variant={"ghost"}
                onClick={() => onPageChange(page - 1)}
                isDisabled={page === 0}
              >
                <FaChevronLeft />
              </Button>
              <Text>{`${page + 1} of ${totalPages}`}</Text>
              <Button
                variant={"ghost"}
                onClick={() => onPageChange(page + 1)}
                isDisabled={page >= totalPages - 1}
              >
                <FaChevronRight />
              </Button>
            </>
          )}
        </HStack>

        <HStack flex="1" justifyContent="flex-end">
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
            <MenuList>
              {pageSizes.map((size) => (
                <MenuItem key={size} onClick={() => onPageSizeChange(size)}>
                  {size}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default TableFooter;
