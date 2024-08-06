import {
  Box,
  Button,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { ColumnSortFilterOptions } from "../../../models/TableManagementModels";

interface Props {
  heading: string;
  sortFilterOptions: ColumnSortFilterOptions;
}

const FilterSortPopup = ({ heading, sortFilterOptions }: Props) => {
  if (!sortFilterOptions.isEnabled)
    return (
      <Text
        fontSize="16px"
        fontWeight="semibold"
        lineHeight="1.2"
        color="gray.700"
      >
        {heading}
      </Text>
    );

  return (
    <Box p={4}>
      <Popover>
        <PopoverTrigger>
          <Button variant={"ghost"}>{heading}</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          {sortFilterOptions.isSortable && (
            <Box>
              <PopoverHeader>Sort by</PopoverHeader>
              <PopoverBody>
                <Stack spacing={2}>
                  <Button variant="outline">Ascending</Button>
                  <Button variant="outline">Descending</Button>
                </Stack>
              </PopoverBody>
            </Box>
          )}
          {sortFilterOptions.isSearchable && (
            <Box>
              <PopoverHeader>Search</PopoverHeader>
              <PopoverBody>
                <HStack>
                  <Input />
                  <Button>
                    <FaSearch />
                  </Button>
                </HStack>
              </PopoverBody>
            </Box>
          )}
          {sortFilterOptions.dropdownFilter && (
            <Box>
              <PopoverHeader>Select</PopoverHeader>
              <PopoverBody>
                <Menu>
                  <MenuButton
                    width={"100%"}
                    bg="white"
                    border="1px"
                    borderColor="gray.200"
                    as={Button}
                    fontWeight="normal"
                    rightIcon={<FaChevronDown />}
                  >
                    {heading}
                  </MenuButton>
                  <MenuList>
                    {sortFilterOptions.dropdownFilter.map((item, index) => (
                      <MenuItem key={index} fontSize={16}>
                        {item}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </PopoverBody>
            </Box>
          )}
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default FilterSortPopup;
