import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react";

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
          <PopoverHeader>Filter by</PopoverHeader>
          <PopoverBody>
            <Stack spacing={2}>
              <Button variant="outline">Option 1</Button>
              <Button variant="outline">Option 2</Button>
              <Button variant="outline">Option 3</Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default FilterSortPopup;
