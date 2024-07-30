import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Box,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface Props {
  header: string;
  inputFields: string[];
  inputFieldTypes: string[];
}

const AddRowDialogButton = ({
  header,
  inputFields,
  inputFieldTypes,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState<Record<string, string>>(
    inputFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleSubmit = () => {
    // onSubmit(formData);
    onClose();
  };

  console.log(inputFieldTypes);

  return (
    <>
      <Button onClick={onOpen}>
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
                  <FormControl>
                    <FormLabel>{field}</FormLabel>
                    <Input
                      type={inputFieldTypes[index]}
                      value={formData[field]}
                      onChange={handleChange(field)}
                      placeholder={`Enter ${field.toLowerCase()}`}
                    />
                  </FormControl>
                </Box>
              ))}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
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
