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
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  maximumAppDescription,
  maximumAppName,
  minimumAppDescription,
  minimumAppName,
} from "../../configs";

interface AddApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, string>) => Promise<void>; // Expecting async function
  isFetching?: boolean;
}

const AddApplicationDialog: React.FC<AddApplicationDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isFetching,
}) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState({
    applicationName: "",
    applicationDescription: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const validateField = (field: string, value: string) => {
    let error = "";
    if (field === "applicationName") {
      if (value.length < minimumAppName || value.length > maximumAppName) {
        error = `Application Name must be between ${minimumAppName} and ${maximumAppName} characters.`;
      }
    } else if (field === "applicationDescription") {
      if (
        value.length < minimumAppDescription ||
        value.length > maximumAppDescription
      ) {
        error = `Application Description must be between ${minimumAppDescription} and ${maximumAppDescription} characters.`;
      }
    }
    return error;
  };
  const pattern = /^[a-zA-Z0-9 _-]+$/; // Pattern to match only allowed characters

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const error = validateField(field, value);
      setFormData({ ...formData, [field]: value });
      setFormErrors({ ...formErrors, [field]: error });
    };

  const handleSubmit = async () => {
    if (Object.keys(formErrors).some((key) => formErrors[key])) {
      return; // Do not submit if there are validation errors
    }

    setIsSubmitting(true); // Start loading state
    try {
      await onSubmit(formData); // Await the async submit function
      console.log(formData);
    } catch (error) {
      console.error("Failed to add application:", error);
      // Optionally, set additional error state here to show a message to the user
    } finally {
      setIsSubmitting(false); // End loading state
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Add Application
          </AlertDialogHeader>

          <AlertDialogBody>
            <Box mb={4}>
              <FormControl isInvalid={!!formErrors.applicationName}>
                <FormLabel>Application Name</FormLabel>
                <Input
                  type="text"
                  value={formData.applicationName}
                  onChange={handleChange("applicationName")}
                  placeholder="Enter application name"
                  autoComplete="off"
                />
                <FormErrorMessage>
                  {formErrors.applicationName}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box mb={4}>
              <FormControl isInvalid={!!formErrors.applicationDescription}>
                <FormLabel>Application Description</FormLabel>
                <Input
                  type="text"
                  value={formData.applicationDescription}
                  onChange={handleChange("applicationDescription")}
                  placeholder="Enter application description"
                  autoComplete="off"
                />
                <FormErrorMessage>
                  {formErrors.applicationDescription}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleSubmit}
              ml={3}
              isDisabled={
                isSubmitting ||
                Object.keys(formErrors).some((key) => formErrors[key])
              } // Disable the button while submitting or if there are validation errors
            >
              {isSubmitting ? <Spinner size="sm" /> : "Add"}{" "}
              {/* Show spinner while loading */}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AddApplicationDialog;
