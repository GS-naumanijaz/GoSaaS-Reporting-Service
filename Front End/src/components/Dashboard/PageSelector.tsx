import { Button, HStack, Text } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { disabledButton, primaryColor } from "../../configs";

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const PageSelector = ({ currentPage, totalPages, setCurrentPage }: Props) => {
  return (
    <HStack spacing={10}>
      <Button
        onClick={() => setCurrentPage(currentPage - 1)}
        bg={currentPage !== 0 ? primaryColor : disabledButton}
        transition="transform 0.2s, box-shadow 0.2s"
        isDisabled={currentPage === 0}
        _hover={
          currentPage !== 0 ? { transform: "scale(1.05)", boxShadow: "lg" } : {}
        }
      >
        <FaChevronLeft />
      </Button>

      <Text fontSize={"x-large"}>{currentPage + 1}</Text>

      <Button
        onClick={() => setCurrentPage(currentPage + 1)}
        bg={currentPage < totalPages - 1 ? primaryColor : disabledButton}
        transition="transform 0.2s, box-shadow 0.2s"
        isDisabled={!(currentPage < totalPages - 1)}
        _hover={
          currentPage < totalPages - 1
            ? { transform: "scale(1.05)", boxShadow: "lg" }
            : {}
        }
      >
        <FaChevronRight />
      </Button>
    </HStack>
  );
};

export default PageSelector;
