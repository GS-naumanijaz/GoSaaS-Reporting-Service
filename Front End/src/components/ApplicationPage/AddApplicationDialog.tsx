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
  onSubmit: (formData: Record<string, string>) => void;
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
  const pattern = /^[a-zA-Z0-9 _-]+$/; // Pattern to match only allowed characters

  const handleChange =
    (field: string, maxLength: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      // Validate input based on the allowed pattern and length
      if (newValue.length <= maxLength && pattern.test(newValue)) {
        setFormData({ ...formData, [field]: newValue });
      }
    };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    // Validate application name
    if (
      formData.applicationName.length < minimumAppName ||
      formData.applicationName.length > maximumAppName
    ) {
      newErrors.applicationName = `Application Name must be between ${minimumAppName} and ${maximumAppName} characters.`;
    }

    // Validate application description
    if (
      formData.applicationDescription.length < minimumAppDescription ||
      formData.applicationDescription.length > maximumAppDescription
    ) {
      newErrors.applicationDescription = `Application Description must be between ${minimumAppDescription} and ${maximumAppDescription} characters.`;
    }

    // Check for valid characters in the name
    if (!pattern.test(formData.applicationName)) {
      newErrors.applicationName =
        "Application Name can only contain letters, numbers, spaces, hyphens, and underscores.";
    }

    // Check for valid characters in the description
    if (!pattern.test(formData.applicationDescription)) {
      newErrors.applicationDescription =
        "Application Description can only contain letters, numbers, spaces, hyphens, and underscores.";
    }

    // If there are validation errors, do not close the dialog and show errors
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
    } else {
      // If validation is successful, submit the form and close the dialog
      onSubmit(formData);
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
                  onChange={handleChange("applicationName", maximumAppName)}
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
                  onChange={handleChange(
                    "applicationDescription",
                    maximumAppDescription
                  )}
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
              isDisabled={isFetching}
            >
              {isFetching ? "Loading..." : "Add"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AddApplicationDialog;
