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
import { useLocation, useNavigate } from "react-router-dom";

interface AddApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, string>) => void;
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

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleSubmit = () => {


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
      
      onSubmit(formData);
      onClose();
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
            <Button colorScheme="red" onClick={handleSubmit} ml={3}>
              Add
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AddApplicationDialog;
