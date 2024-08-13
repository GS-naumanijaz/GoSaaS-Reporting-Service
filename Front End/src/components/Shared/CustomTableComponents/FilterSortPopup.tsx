import {
  Box,
  Button,
  Input,
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
  const handleChange = (value: string, field: FieldMappingKey) => {
    if (value.length === 0) {
      onSearch("", fieldMapping[field]);
    } else if (value.length >= 3) {
      onSearch(value, fieldMapping[field]);
    }
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
                  onChange={(e) =>
                    handleChange(e.target.value, heading as FieldMappingKey)
                  }
                />
              </PopoverBody>
            </Box>
          )}
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default FilterSortPopup;
