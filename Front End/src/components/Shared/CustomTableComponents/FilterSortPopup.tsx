import {
  Box,
  Button,
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
import { fieldMapping, FieldMappingKey } from "../../../services/sortMappings";
import { ColumnSortFilterOptions } from "../../../models/TableManagementModels";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";

interface Props {
  heading: string;
  sortFilterOptions: ColumnSortFilterOptions;
  onSort: (field: FieldMappingKey, order: string) => void;
  onSearch: (searchTerm: string, field: string) => void;
}

const FilterSortPopup = ({
  heading,
  sortFilterOptions,
  onSort,
  onSearch,
}: Props) => {
  const [selectedItem, setSelectedItem] = useState("All");

  const handleChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    field: FieldMappingKey
  ) => {
    if (event.key === "Enter") {
      if (value.length === 0) {
        onSearch("", fieldMapping[field]);
        return;
      }
      onSearch(value, fieldMapping[field]);
    }
  };

  const handleDropdown = (selected: string) => {
    if (selected === "All") {
      onSearch("", heading as FieldMappingKey);
    } else {
      onSearch(selected, heading as FieldMappingKey);
    }
    setSelectedItem(selected);
  };

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
      <Popover placement="top">
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
                  <Button
                    variant="outline"
                    onClick={() => onSort(heading as FieldMappingKey, "asc")}
                  >
                    Ascending
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onSort(heading as FieldMappingKey, "desc")}
                  >
                    Descending
                  </Button>
                </Stack>
              </PopoverBody>
            </Box>
          )}
          {sortFilterOptions.isSearchable && (
            <Box>
              <PopoverHeader>Search by {heading}</PopoverHeader>
              <PopoverBody>
                <Input
                  placeholder={`Enter ${heading}`}
                  size="sm"
                  onKeyDown={(e) =>
                    handleChange(
                      e,
                      (e.target as HTMLInputElement).value,
                      heading as FieldMappingKey
                    )
                  }
                />
              </PopoverBody>
            </Box>
          )}
          {sortFilterOptions.dropdownFilter && (
            <Box>
              <PopoverHeader>Filter By Options</PopoverHeader>
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
                    {selectedItem.toLowerCase()}
                  </MenuButton>
                  <MenuList>
                    {sortFilterOptions.dropdownFilter.map((item, index) => (
                      <MenuItem
                        key={index}
                        fontSize={16}
                        onClick={() => handleDropdown(item)}
                      >
                        {item.toLowerCase()}
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
