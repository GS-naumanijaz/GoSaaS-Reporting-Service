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

const TableFooter = () => {
  return (
    <Box margin={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text flex="1" textAlign="left">
          Total Number of Records = 5
        </Text>
        <HStack spacing={4} justifyContent="center" flex="1">
          <Button>
            <FaChevronLeft />
          </Button>
          <Text>1 of 1</Text>  // Make dynamic
          <Button>
            <FaChevronRight />
          </Button>
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
              10
            </MenuButton>
            <MenuList>
              <MenuItem>5</MenuItem>
              <MenuItem>10</MenuItem>
              <MenuItem>20</MenuItem>
              <MenuItem>40</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default TableFooter;
