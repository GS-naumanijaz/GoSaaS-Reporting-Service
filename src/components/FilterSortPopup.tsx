import {
  Box,
  Button,
  HStack,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

interface Props {
  heading: string;
}

const FilterSortPopup = ({ heading }: Props) => {
  return (
    <Box p={4}>
      <Popover>
        <PopoverTrigger>
          <Button>{heading}</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Sort by</PopoverHeader>
          <PopoverBody>
            <Stack spacing={2}>
              <Button variant="outline">Accending</Button>
              <Button variant="outline">Deccending</Button>
            </Stack>
          </PopoverBody>
          <PopoverHeader>Search</PopoverHeader>
          <PopoverBody>
            <HStack>
              <Input />
              <Button>
                <FaSearch />
              </Button>
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default FilterSortPopup;
