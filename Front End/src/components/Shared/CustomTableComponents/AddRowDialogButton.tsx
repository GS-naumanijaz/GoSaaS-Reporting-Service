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
  Spinner,
  Tooltip,
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
  onSubmit: (formData: Record<string, string>) => Promise<void>;
  tooltipLabel?: string;
  tooltipColor?: string;
  tooltipHasArrow?: boolean;
  setCanTest: (newValue: boolean) => void;
}

const AddRowDialogButton: React.FC<Props> = ({
  header,
  inputFields,
  onSubmit,
  tooltipLabel,
  tooltipColor = "gray.800",
  tooltipHasArrow = true,
  setCanTest,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const initialFormState = inputFields.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    {}
  );

  const [formData, setFormData] = useState<Record<string, string>>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Manage the loading state

  const handleChange =
    (field: string, maxLength: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.slice(0, maxLength); // Enforce max length
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value,
      }));
    };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    inputFields.forEach((field) => {
      const error = validateField(formData[field.name], field.validation);
      if (error) newErrors[field.name] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
    } else {
      setIsSubmitting(true); // Start loading state
      try {
        console.log("before api call");
        await onSubmit(formData); // Use mutateAsync for the API call
        console.log("after api call");
        // Close the dialog only if the submission is successful
        onClose();
        setCanTest(false);
        setTimeout(() => {
          setCanTest(true);
        }, 1000);
      } catch (error) {
        console.error("Error adding new row:", error);
        // You can show an error toast or message here
      } finally {
        setIsSubmitting(false); // End loading state
      }
    }
  };

  const handleOpen = () => {
    setFormData(initialFormState); // Reset form data
    setFormErrors({}); // Clear errors
    onOpen();
  };

  const button = (
    <Button variant={"ghost"} onClick={handleOpen}>
      <FaPlus />
    </Button>
  );

  return (
    <>
      {tooltipLabel ? (
        <Tooltip
          label={tooltipLabel}
          bg={tooltipColor}
          hasArrow={tooltipHasArrow}
        >
          {button}
        </Tooltip>
      ) : (
        button
      )}

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
                        type={field.type ?? "text"}
                        value={formData[field.name]}
                        onChange={handleChange(
                          field.name,
                          field.validation?.maxLength ?? 50
                        )}
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
              <Button colorScheme="red" onClick={handleSubmit} ml={3} isDisabled={isSubmitting}>
                {isSubmitting ? <Spinner size="sm" mr={2} /> : null}
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
