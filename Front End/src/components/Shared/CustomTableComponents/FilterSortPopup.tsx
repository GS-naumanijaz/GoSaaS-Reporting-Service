import { useState, useEffect, useRef } from "react";
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
  Tooltip,
} from "@chakra-ui/react";
import { DayPicker } from "react-day-picker";
import {
  FaChevronDown,
  FaRegCaretSquareDown,
  FaRegCaretSquareUp,
} from "react-icons/fa";
import { fieldMapping, FieldMappingKey } from "../../../services/sortMappings";
import { ColumnSortFilterOptions } from "../../../models/TableManagementModels";
import {
  maximumAppName,
  primaryColor,
  secondaryColor,
  sx,
} from "../../../configs";
import { useErrorToast } from "../../../hooks/useErrorToast";

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
  const [truncatedValue, setTruncatedValue] = useState(""); // State for the truncated value
  const hasCalledOnDateSearchRef = useRef(false);

  const handleChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    field: FieldMappingKey
  ) => {
    const trimmedValue = value.slice(0, maximumAppName); // Enforce max length
    setTruncatedValue(trimmedValue); // Update truncated value state

    if (event.key === "Enter") {
      if (value.length === 0) {
        onSearch("", fieldMapping[field]);
        return;
      }
      onSearch(trimmedValue, fieldMapping[field]);
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

  // Handle date selection and validation
  const handleDateSelect = (dates: Date[]) => {
    if (dates.length === 2 && dates[0] > dates[1]) {
      useErrorToast()("Selected first date cannot be before the second date");
      setSelectedDate([]); // Clear the selected dates
    } else {
      setSelectedDate(dates);
    }
  };

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
          <HStack justifyContent={"center"}>
            <Button variant={"ghost"}>{heading}</Button>
            <FaRegCaretSquareUp color={primaryColor} size={25} />
          </HStack>
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
                <Tooltip
                  label="Press Enter to Search"
                  bg={secondaryColor}
                  color="black"
                >
                  <Input
                    placeholder={`Enter ${heading}`}
                    size="sm"
                    value={truncatedValue} // Use truncated value in the input
                    onChange={(e) => setTruncatedValue(e.target.value)} // Update input value state
                    onKeyDown={(e) =>
                      handleChange(
                        e,
                        (e.target as HTMLInputElement).value,
                        heading as FieldMappingKey
                      )
                    }
                  />
                </Tooltip>
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
              pb={2}
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
                onSelect={handleDateSelect} // Use the updated date select handler
                footer={
                  selectedDate?.length
                    ? `${selectedDate
                        .map((date) => date.toLocaleDateString())
                        .join(" - ")}.`
                    : "Select (MM/DD/YYYY)"
                }
              />
              <Text color="black">Select a date range: start, then end.</Text>
            </Stack>
          )}
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default FilterSortPopup;
