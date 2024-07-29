import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TableFooter = () => {
  return (
    <Box margin={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Spacer />
        <HStack spacing={4} flex="1">
          <Button>
            <FaChevronLeft />
          </Button>
          <Text>1 of 1</Text>
          <Button>
            <FaChevronRight />
          </Button>
        </HStack>
        <HStack>
          <Text>Max Rows per Page</Text>
          <Input width={20} />
        </HStack>
      </Flex>
    </Box>
  );
};

export default TableFooter;
