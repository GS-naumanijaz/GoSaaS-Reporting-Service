// src/components/TdData.tsx
import {
  Input,
  Td,
  FormControl,
  FormErrorMessage,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { validateField, ValidationRule } from "../../models/ValidationRule"; // Adjust the import path as needed
import { InputField } from "../../models/TableManagementModels";
import { FaChevronDown } from "react-icons/fa";

interface Props {
  isEditing: boolean;
  isEditable: boolean;
  data: string;
  inputField: InputField;
  handleInputChange: (value: string, error: string) => void;
}

const TdData = ({
  isEditing,
  isEditable,
  data,
  inputField,
  handleInputChange,
}: Props) => {
  const [error, setError] = useState<string>("");

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
    <Td textAlign="center">
      {isEditing && isEditable ? (
        <Box>
          {inputField.isSelectable ? (
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
                {data}
              </MenuButton>
              <MenuList>
                {inputField.options!.map((item, index) => (
                  <MenuItem key={index} fontSize={16}>
                    {item}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <FormControl isInvalid={!!error}>
              <Input
                type={inputField.type}
                textAlign="center"
                value={data}
                onChange={handleChange}
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          )}
        </Box>
      ) : (
        data
      )}
    </Td>
  );
};

export default TdData;
