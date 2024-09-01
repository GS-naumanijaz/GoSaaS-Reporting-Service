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
}

const AddApplicationDialog: React.FC<AddApplicationDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState({
    applicationName: "",
    applicationDescription: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (
      formData.applicationName.length < minimumAppName ||
      formData.applicationName.length > maximumAppName
    ) {
      newErrors.applicationName = `Application Name must be between ${minimumAppName} and ${maximumAppName} characters.`;
    }

    if (
      formData.applicationDescription.length < minimumAppDescription ||
      formData.applicationDescription.length > maximumAppDescription
    ) {
      newErrors.applicationDescription = `Application Description must be between ${minimumAppDescription} and ${maximumAppDescription} characters.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
    } else {
      setIsSubmitting(true); // Start loading state
      try {
        await onSubmit(formData); // Await the async submit function
        
      } catch (error) {
        console.error("Failed to add applicssssation:", error);
        // Optionally, set additional error state here to show a message to the user
      } finally {
        setIsSubmitting(false); // End loading state
      }
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
              isDisabled={isSubmitting} // Disable the button while submitting
            >
              {isSubmitting ? <Spinner size="sm" /> : "Add"} {/* Show spinner while loading */}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AddApplicationDialog;
