import { Flex, Button, Input, Box, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import { primaryColor } from "../../configs";

interface Props {
  onSearch: (searchTerm: string) => void;
  bg?: string;
  children: React.ReactNode;
}

const ExpandingSearchbar = ({ onSearch, bg = "gray.100", children }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorField, setErrorField] = useState("");

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length === 0) {
      setErrorField("");
      onSearch("");
    } else if (value.length >= 3) {
      setErrorField("");
      onSearch(value);
    } else {
      setErrorField("Search term must be at least 3 characters long");
    }
  };

  return (
    <Box position="relative">
      <Flex alignItems="center" direction="column">
        <Flex alignItems="center">
          <Tooltip
            label={errorField || ""}
            isOpen={!!errorField}
            bg="red.500"
            color="white"
            hasArrow
            placement="bottom"
          >
            <Box>
              <Button
                onClick={toggleExpand}
                right={isExpanded ? "0" : "unset"}
                zIndex={isExpanded ? "-1" : "1"}
                transition="width 0.3s ease"
                width={isExpanded ? "0" : "auto"}
                overflow="hidden"
                bg={bg}
              >
                {children}
              </Button>
              <Input
                placeholder="Search..."
                pl={isExpanded ? "2rem" : "0"}
                width={isExpanded ? "200px" : "0"}
                opacity={isExpanded ? "1" : "0"}
                transition="width 0.3s ease, opacity 0.3s ease"
                onBlur={() => setIsExpanded(false)}
                autoFocus={isExpanded}
                onChange={handleChange}
                focusBorderColor={primaryColor}
                value={searchTerm}
              />
            </Box>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ExpandingSearchbar;
