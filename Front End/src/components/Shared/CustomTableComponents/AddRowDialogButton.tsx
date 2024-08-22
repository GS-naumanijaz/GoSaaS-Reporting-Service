import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaChevronDown, FaPlus } from "react-icons/fa";
import { InputField } from "../../../models/TableManagementModels";
import { validateField } from "../../../models/ValidationRule";
import { sx } from "../../../configs";

interface Props {
  header: string;
  inputFields: InputField[];
  onSubmit: (formData: Record<string, string>) => void;
}

const AddRowDialogButton: React.FC<Props> = ({
  header,
  inputFields,
  onSubmit,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const initialFormState = inputFields.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    {}
  );

  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    inputFields.forEach((field) => {
      const error = validateField(formData[field.name], field.validation);
      if (error) newErrors[field.name] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
    } else {
      onSubmit(formData);
      onClose();
    }
  };

  const handleOpen = () => {
    setFormData(initialFormState); // Reset form data
    setFormErrors({}); // Clear errors
    onOpen();
  };

  return (
    <>
      <Button variant={"ghost"} onClick={handleOpen}>
        <FaPlus />
      </Button>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {header}
            </AlertDialogHeader>

            <AlertDialogBody>
              {inputFields.map((field, index) => (
                <Box key={index} mb={4}>
                  {field.isSelectable ? (
                    <FormControl isInvalid={!!formErrors[field.name]}>
                      <FormLabel>{field.name}</FormLabel>
                      <Menu>
                        <MenuButton
                          width={"100%"}
                          bg="white"
                          border="1px"
                          borderColor="gray.200"
                          as={Button}
                          textAlign="left"
                          fontWeight="normal"
                          rightIcon={<FaChevronDown />}
                        >
                          {formData[field.name].toLowerCase() ||
                            `Select ${field.name}`}
                        </MenuButton>
                        <MenuList
                          maxHeight="30vh"
                          overflowY="auto"
                          overflowX="hidden"
                          sx={sx}
                        >
                          {field.options!.map((item, index) => (
                            <MenuItem
                              key={index}
                              fontSize={16}
                              onClick={() =>
                                setFormData({ ...formData, [field.name]: item })
                              }
                            >
                              {item.toLowerCase()}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                      <FormErrorMessage>
                        {formErrors[field.name]}
                      </FormErrorMessage>
                    </FormControl>
                  ) : (
                    <FormControl isInvalid={!!formErrors[field.name]}>
                      <FormLabel>{field.name}</FormLabel>
                      <Input
                        type={field.type || "text"}
                        value={formData[field.name]}
                        onChange={handleChange(field.name)}
                        placeholder={`Enter ${field.name.toLowerCase()}`}
                      />
                      <FormErrorMessage>
                        {formErrors[field.name]}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Box>
              ))}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleSubmit} ml={3}>
                Add
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AddRowDialogButton;
