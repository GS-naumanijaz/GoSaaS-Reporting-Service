import { Flex, Button, Input, Box, Tooltip } from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import { maximumAppName, primaryColor } from "../../configs";

interface Props {
  onSearch: (searchTerm: string) => void;
  bg?: string;
  children: React.ReactNode;
}

const ExpandingSearchbar = ({ onSearch, bg = "gray.100", children }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorField, setErrorField] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Ensure the value does not exceed the maximum allowed length
    const trimmedValue =
      value.length <= maximumAppName ? value : value.slice(0, maximumAppName);

    setSearchTerm(trimmedValue);

    if (trimmedValue.length === 0) {
      setErrorField("");
      onSearch("");
    } else if (trimmedValue.length >= 3) {
      setErrorField("");
      onSearch(trimmedValue);
    } else {
      setErrorField("Search term must be at least 3 characters long");
    }
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

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
              <Tooltip label="Search Applications " bg={primaryColor}>
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
              </Tooltip>
              <Input
                ref={inputRef}
                placeholder="Search by alias..."
                pl={isExpanded ? "2rem" : "0"}
                width={isExpanded ? "200px" : "0"}
                opacity={isExpanded ? "1" : "0"}
                transition="width 0.3s ease, opacity 0.3s ease"
                onBlur={() => setIsExpanded(false)}
                autoFocus={isExpanded}
                onChange={handleChange}
                focusBorderColor={primaryColor}
                value={searchTerm}
                maxLength={50}
              />
            </Box>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ExpandingSearchbar;
