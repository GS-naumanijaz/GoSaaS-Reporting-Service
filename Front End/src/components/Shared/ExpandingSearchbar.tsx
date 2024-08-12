import { Flex, Button, Input, Box } from "@chakra-ui/react";
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length === 0) {
      onSearch("");
    } else if (value.length >= 3) {
      onSearch(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  return (
    <Box position="relative">
      <Flex alignItems="center">
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
          onKeyDown={handleKeyDown}
          focusBorderColor={primaryColor}
          value={searchTerm}
        />
      </Flex>
    </Box>
  );
};

export default ExpandingSearchbar;
