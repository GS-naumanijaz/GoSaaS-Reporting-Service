import { useState, useEffect, useRef } from "react";
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
import { DayPicker } from "react-day-picker";
import { FaChevronDown } from "react-icons/fa";
import { fieldMapping, FieldMappingKey } from "../../../services/sortMappings";
import { ColumnSortFilterOptions } from "../../../models/TableManagementModels";
import { primaryColor, sx } from "../../../configs";

interface Props {
  heading: string;
  sortFilterOptions: ColumnSortFilterOptions;
  onSort: (field: FieldMappingKey, order: string) => void;
  onSearch: (searchTerm: string, field: string) => void;
  onDateSearch: (date: string[]) => void;
  isClear?: boolean;
}

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function convertDatesToStrings(datesArray: Date[]): string[] {
  return datesArray.map((date) => formatDateToYYYYMMDD(date));
}

const customStyles = `
  .rdp-day:not(.selected):hover {
    background-color: red; 
  }
`;

const FilterSortPopup = ({
  heading,
  sortFilterOptions,
  onSort,
  onSearch,
  onDateSearch,
  isClear,
}: Props) => {
  const [selectedItem, setSelectedItem] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date[] | undefined>([]);
  const hasCalledOnDateSearchRef = useRef(false);

  const handleChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    field: FieldMappingKey
  ) => {
    if (event.key === "Enter") {
      console.log("field: ", value, field);

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

  useEffect(() => {
    if (isClear) {
      setSelectedDate([]);
    }
  }, [isClear]);

  useEffect(() => {
    if (selectedDate?.length === 2 && !hasCalledOnDateSearchRef.current) {
      onDateSearch(convertDatesToStrings(selectedDate));
      hasCalledOnDateSearchRef.current = true;
    } else if (selectedDate?.length !== 2) {
      hasCalledOnDateSearchRef.current = false;
    }
  }, [selectedDate, onDateSearch]);

  if (!sortFilterOptions.isEnabled)
    return (
      <Text
        fontSize="16px"
        fontWeight="semibold"
        lineHeight="1.2"
        color="gray.700"
        textTransform="none"
      >
        {heading}
      </Text>
    );

  // Safely access dropdownFilter and sort it
  const dropdownFilter = sortFilterOptions.dropdownFilter ?? [];
  const sortedDropdownFilter = dropdownFilter
    .filter((item) => item.toLowerCase() !== "all")
    .sort((a, b) => a.localeCompare(b));

  // Add "All" to the top of the sorted array
  if (dropdownFilter.includes("All")) {
    sortedDropdownFilter.unshift("All");
  }

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
          {sortedDropdownFilter.length > 2 ? (
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
                  <MenuList
                    maxHeight="30vh"
                    overflowY="auto"
                    overflowX="hidden"
                    sx={sx}
                  >
                    {sortedDropdownFilter.map((item, index) => (
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
          ) : null}
          {sortFilterOptions.DateItem && (
            <Stack
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                ".rdp-footer": {
                  color: primaryColor,
                },
              }}
            >
              <style>{customStyles}</style>
              <DayPicker
                mode="multiple"
                min={2}
                max={2}
                required
                showOutsideDays={false}
                selected={selectedDate}
                onSelect={setSelectedDate}
                footer={
                  selectedDate?.length
                    ? `${selectedDate
                        .map((date) => date.toLocaleDateString())
                        .join(" - ")}.`
                    : "Select (MM/DD/YYYY)"
                }
              />
            </Stack>
          )}
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default FilterSortPopup;
