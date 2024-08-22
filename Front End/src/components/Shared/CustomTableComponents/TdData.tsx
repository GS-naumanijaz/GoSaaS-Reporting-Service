import {
  Box,
  Button,
  FormControl,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Text,
  Tooltip,
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
    const validationError = validateField(value, inputField.validation);
    setError(validationError);
    handleInputChange(value, validationError);
  };

  const renderDataBasedOnType = () => {
    if (inputField.isSelectable) {
      return <Text>{selectedItem.toLowerCase()}</Text>;
    }

    if (inputField.type === "password") {
      return (
        <Input
          type="password"
          value={"•".repeat(data.length)}
          isReadOnly
          variant="filled"
          bg="transparent"
          _hover={{ bg: "transparent" }}
          textAlign="center"
          pointerEvents="none"
        />
      );
    }

    if (inputField.isDate) {
      return <Text>{new Date(data).toLocaleDateString()}</Text>;
    }

    return <Text>{data}</Text>;
  };

  return (
    <Td textAlign="center" width={columnWidth} m={0} p={0} height={50}>
      {isEditing && isEditable ? (
        <Box>
          {inputField.isSelectable ? (
            <Menu>
              <MenuButton
                as={Button}
                width="100%"
                bg="white"
                border="1px"
                borderColor="gray.200"
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
              <Tooltip
                label={error}
                placement="bottom-start"
                isOpen={!!error}
                bg="red.600"
                color="white"
                fontSize="sm"
              >
                <Input
                  type={inputField.type}
                  textAlign="center"
                  value={data}
                  onChange={handleChange}
                />
              </Tooltip>
            </FormControl>
          )}
        </Box>
      ) : (
        renderDataBasedOnType()
      )}
    </Td>
  );
};

export default TdData;
