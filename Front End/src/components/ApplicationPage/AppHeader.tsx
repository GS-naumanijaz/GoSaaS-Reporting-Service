import { AiOutlineDelete, AiOutlineSave } from "react-icons/ai";
import {
  Button,
  HStack,
  Input,
  Spacer,
  Switch,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Stack,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  maximumAppDescription,
  maximumAppName,
  minimumAppDescription,
  minimumAppName,
  primaryColor,
  secondaryColor,
} from "../../configs";
import { Application } from "./AppDashboard";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useProductStore from "../../store/ProductStore";
import {
  useDeleteApplicationMutation,
  useEditApplicationMutation,
  useSaveApplicationMutation,
} from "../../hooks/useAppDataQuery";
import { IoArrowBack } from "react-icons/io5";

interface Props {
  appData?: Application;
}

const pattern = /^[a-zA-Z0-9 _-]+$/; // Pattern to match only allowed characters

const validationCheck = ({ alias, description }: Application) => {
  return (
    alias.length >= minimumAppName &&
    alias.length <= maximumAppName &&
    description.length >= minimumAppDescription &&
    description.length <= maximumAppDescription &&
    pattern.test(alias) &&
    pattern.test(description)
  );
};

function assignUpdatedField<K extends keyof Application>(
  obj: Partial<Application>,
  key: K,
  value: Application[K]
) {
  obj[key] = value;
}

const AppHeader = ({ appData }: Props) => {
  const [newAppData, setNewAppData] = useState<Application>(
    appData || {
      alias: "",
      description: "",
      isActive: false,
      isDeleted: false,
      createdBy: "",
      deletedBy: "",
      creationDate: "",
      deletionDate: null,
      updatedAt: "",
    }
  );

  const [touched, setTouched] = useState({ alias: false, description: false });
  const navigate = useNavigate();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const onDeleteClose = () => setIsDeleteOpen(false);
  const onSaveClose = () => setIsSaveOpen(false);
  const cancelDeleteRef = useRef<HTMLButtonElement | null>(null);
  const cancelSaveRef = useRef<HTMLButtonElement | null>(null);

  const deleteApplication = useDeleteApplicationMutation();
  const saveApplication = useSaveApplicationMutation();
  const editApplication = useEditApplicationMutation();

  const handleDelete = () => {
    if (appData?.id) deleteApplication.mutate(appData.id);
    onDeleteClose();
  };

  // const handleSave = () => {
  //   // First, update the state with the created_by field
  //   setNewAppData((prev) => ({
  //     ...prev,
  //     createdBy: user?.fullName || "",
  //   }));
  //   saveApplication.mutate(newAppData);
  //   onSaveClose();
  // };

  function assignUpdatedField<K extends keyof Application>(
    obj: Partial<Application>,
    key: K,
    value: Application[K]
  ) {
    obj[key] = value;
  }

  const handleSave = () => {
    const updatedFields: Partial<Application> = {};

    // Compare newAppData with originalApp and only add changed fields to updatedFields
    Object.keys(newAppData).forEach((key) => {
      const keyTyped = key as keyof Application;
      if (newAppData[keyTyped] !== appData?.[keyTyped]) {
        assignUpdatedField(updatedFields, keyTyped, newAppData[keyTyped]);
      }
    });

    // If there are any updated fields, send the update request
    if (Object.keys(updatedFields).length > 0) {
      if (appData?.id) {
        // Use the edit mutation if appData exists (this means we are editing)
        editApplication.mutate({ id: appData.id, ...updatedFields });
      } else {
        // Otherwise, use the add mutation (this means we are adding a new application)
        saveApplication.mutate(updatedFields);
      }
    } else {
      navigate("/homepage");
    }
    onSaveClose();
  };

  const handleInputChange =
    (field: keyof Application, maxLength: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.slice(0, maxLength);

      if (pattern.test(value)) {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setNewAppData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    };

  return (
    <>
      <HStack
        justifyContent={"space-between"}
        alignItems="center"
        marginX={10}
        marginTop={5}
        spacing={4}
        paddingBottom={3}
        borderBottomColor={"lightgrey"}
        borderBottomWidth={3}
      >
        <Button
          variant="link"
          p={0}
          _active={{ color: primaryColor }}
          color={primaryColor}
          onClick={() => navigate(-1)}
        >
          <IoArrowBack size={35} />
        </Button>
        <Tooltip
          label={
            newAppData.isActive
              ? "Application Status: Active"
              : "Application Status: Inactive"
          }
          placement="top-start"
          bg={primaryColor}
          fontSize={"lg"}
        >
          <Box>
            <Switch
              size="lg"
              colorScheme="red"
              isChecked={newAppData.isActive}
              onChange={() => {
                setNewAppData((prev) => ({
                  ...prev,
                  isActive: !prev.isActive,
                }));
              }}
            />
          </Box>
        </Tooltip>
        <Spacer />
        <Text fontSize={25} textAlign="center">
          Application Registration
        </Text>
        <Spacer />
        <HStack spacing={5}>
          <Tooltip hasArrow label="Save" bg={primaryColor}>
            <Button
              isDisabled={!validationCheck(newAppData)}
              variant="link"
              p={0}
              _active={
                validationCheck(newAppData)
                  ? { color: primaryColor }
                  : { color: secondaryColor }
              }
              color={
                validationCheck(newAppData) ? primaryColor : secondaryColor
              }
              onClick={() => {
                validationCheck(newAppData) ? setIsSaveOpen(true) : null;
              }}
            >
              <AiOutlineSave size={"35"} />
            </Button>
          </Tooltip>
          <Tooltip hasArrow label="Delete" bg={primaryColor}>
            <Button
              variant="link"
              p={0}
              _active={{ color: primaryColor }}
              color={primaryColor}
              onClick={() => setIsDeleteOpen(true)}
            >
              <AiOutlineDelete size={"35"} />
            </Button>
          </Tooltip>
        </HStack>
      </HStack>

      <HStack spacing={5} mt={5} mb={10} pl={10} alignItems="center">
        <Text fontSize="lg" fontWeight="semibold">
          Name:
        </Text>
        <Stack spacing={2} width="100%" position="relative">
          <Tooltip label={newAppData.alias} bg={primaryColor}>
            <Input
              size="md"
              autoComplete="off"
              variant="outline"
              width={"20%"}
              focusBorderColor={primaryColor}
              placeholder="Enter application name"
              value={newAppData.alias}
              onChange={handleInputChange("alias", maximumAppName)}
              sx={{
                overflow: "hidden", // Hide overflowed text
                textOverflow: "ellipsis", // Add ellipsis for overflowed text
                whiteSpace: "nowrap", // Prevent text wrapping
              }}
            />
          </Tooltip>
          {touched.alias &&
            (newAppData.alias.length < minimumAppName ||
              newAppData.alias.length > maximumAppName ||
              !pattern.test(newAppData.alias)) && (
              <Text
                color="red"
                fontSize="sm"
                position="absolute"
                bottom="-25px"
              >
                {`Application name must be between ${minimumAppName} and ${maximumAppName} characters and only contain letters, numbers, spaces, hyphens, and underscores.`}
              </Text>
            )}
        </Stack>
      </HStack>

      <HStack spacing={5} mt={10} mb={10} pl={10} position="relative">
        <Text fontSize="lg" fontWeight="semibold">
          Description:
        </Text>
        <Stack spacing={2} width="100%">
          <Tooltip label={newAppData.description} bg={primaryColor}>
            <Input
              size="md"
              autoComplete="off"
              width="40%"
              variant="outline"
              focusBorderColor={primaryColor}
              placeholder="Enter Application Description"
              value={newAppData.description}
              onChange={handleInputChange("description", maximumAppDescription)}
              sx={{
                overflow: "hidden", // Hide overflowed text
                textOverflow: "ellipsis", // Add ellipsis for overflowed text
                whiteSpace: "nowrap", // Prevent text wrapping
              }}
            />
          </Tooltip>
          {touched.description &&
            (newAppData.description.length < minimumAppDescription ||
              newAppData.description.length > maximumAppDescription ||
              !pattern.test(newAppData.description)) && (
              <Text
                color="red"
                fontSize="sm"
                position="absolute"
                bottom="-25px"
              >
                {`Application description must be between ${minimumAppDescription} and ${maximumAppDescription} characters and only contain letters, numbers, spaces, hyphens, and underscores.`}
              </Text>
            )}
        </Stack>
      </HStack>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Confirmation
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelDeleteRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isSaveOpen}
        leastDestructiveRef={cancelSaveRef}
        onClose={onSaveClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Save Confirmation
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to save these changes?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelSaveRef} onClick={onSaveClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleSave} ml={3}>
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AppHeader;
