import { Button, HStack, Text } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const PageSelector = ({ currentPage, totalPages, setCurrentPage }: Props) => {
  console.log(currentPage, totalPages);

  return (
    <HStack>
      <Button
        onClick={() => setCurrentPage(currentPage - 1)}
        visibility={currentPage === 0 ? "hidden" : "visible"}
      >
        <FaChevronLeft />
      </Button>

      <Text>{currentPage + 1}</Text>

      <Button
        onClick={() => setCurrentPage(currentPage + 1)}
        visibility={currentPage < totalPages - 1 ? "visible" : "hidden"}
      >
        <FaChevronRight />
      </Button>
    </HStack>
  );
};

export default PageSelector;
