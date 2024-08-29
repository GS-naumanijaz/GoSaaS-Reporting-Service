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
import {
  FaCheck,
  FaChevronDown,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { InputField } from "../../../models/TableManagementModels";
import { validateField } from "../../../models/ValidationRule";
import { sx } from "../../../configs";

interface Props {
  isEditing: boolean;
  isEditable: boolean;
  data: string;
  inputField: InputField;
  handleInputChange: (value: string, error: string) => void;
  columnWidth: string;
}

const TdData: React.FC<Props> = ({
  isEditing,
  isEditable,
  data,
  inputField,
  handleInputChange,
  columnWidth,
}) => {
  const [error, setError] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>(data);

  const handleMenuItemClick = (item: string) => {
    setSelectedItem(item);
    handleInputChange(item, "");
  };

  useEffect(() => {
    if (isEditing) {
      setError("");
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

    if (inputField.isLogo) {
      const renderLogoStatus = (status: string) => {
        switch (status) {
          case "successful":
            return (
              <Tooltip label="successful" placement="bottom" bg="green">
                <Box display="inline-block">
                  <FaCheck color="green" size={20} />
                </Box>
              </Tooltip>
            );
          case "failed":
            return (
              <Tooltip label="failed" placement="bottom" bg="red">
                <Box display="inline-block">
                  <FaXmark color="red" size={27} />
                </Box>
              </Tooltip>
            );
          case "inprogress":
            return (
              <Tooltip label="in progress" placement="bottom" bg="grey">
                <Box display="inline-block">
                  <FaSpinner color="black" size={20} />
                </Box>
              </Tooltip>
            );
          default:
            return (
              <Tooltip label="unknown status" placement="bottom" bg="orange">
                <Box display="inline-block">
                  <FaExclamationTriangle color="orange" size={20} />
                </Box>
              </Tooltip>
            );
        }
      };

      return renderLogoStatus(data);
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
              <MenuList
                maxHeight="30vh"
                overflowY="auto"
                overflowX="hidden"
                sx={sx}
              >
                {inputField.options?.map((item, index) => (
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
