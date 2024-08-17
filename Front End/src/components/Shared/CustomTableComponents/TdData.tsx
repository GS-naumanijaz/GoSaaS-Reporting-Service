import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { InputField } from "../../../models/TableManagementModels";
import { validateField } from "../../../models/ValidationRule";

interface Props {
  isEditing: boolean;
  isEditable: boolean;
  data: string;
  inputField: InputField;
  handleInputChange: (value: string, error: string) => void;
  columnWidth: string;
}

const TdData = ({
  isEditing,
  isEditable,
  data,
  inputField,
  handleInputChange,
  columnWidth,
}: Props) => {
  const [error, setError] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState(data);

  const handleMenuItemClick = (item: string) => {
    setSelectedItem(item);
    handleInputChange(item, "");
  };

  useEffect(() => {
    if (isEditing) {
      setError(""); // Reset the error state when isEditing changes
    }
  }, [isEditing]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const error = validateField(value, inputField.validation);
    setError(error);
    handleInputChange(value, error); // Always apply changes
  };

  return (
    <Td textAlign="center" width={columnWidth}>
      {isEditing && isEditable ? (
        <Box>
          {inputField.isSelectable ? (
            <Menu>
              <MenuButton
                width="100%"
                bg="white"
                border="1px"
                borderColor="gray.200"
                as={Button}
                fontWeight="normal"
                rightIcon={<FaChevronDown />}
              >
                {selectedItem.toLowerCase()}
              </MenuButton>
              <MenuList>
                {inputField.options!.map((item, index) => (
                  <MenuItem
                    key={index}
                    fontSize={16}
                    onClick={() => handleMenuItemClick(item)}
                  >
                    {item.toLowerCase()}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <FormControl isInvalid={!!error}>
              <Input
                type={inputField.type}
                textAlign="center"
                value={inputField.isHidden ? "*".repeat(data.length) : data}
                onChange={handleChange}
              />
              <Box
                width="100%"
                maxWidth="100%"
                overflowX="auto"
                paddingTop="4px"
                paddingBottom="4px"
                whiteSpace="normal"
                wordBreak="break-word"
              >
                <FormErrorMessage>{error}</FormErrorMessage>
              </Box>
            </FormControl>
          )}
        </Box>
      ) : inputField.isSelectable ? (
        data.toLowerCase()
      ) : (
        data
      )}
    </Td>
  );
};

export default TdData;
