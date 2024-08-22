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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  maximumAppDescription,
  maximumAppName,
  minimumAppDescription,
  primaryColor,
  secondaryColor,
  minimumAppName,
  BackendURL,
} from "../../configs";
import { Application } from "./AppDashboard";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useProductStore from "../../store/ProductStore";

interface Props {
  appData?: Application;
}

const validationCheck = ({ alias, description }: Application) => {
  return (
    alias.length >= minimumAppName &&
    alias.length <= maximumAppName &&
    description.length >= minimumAppDescription &&
    description.length <= maximumAppDescription
  );
};

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
  const user = { fullName: "testUser" };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentPage, searchTerm } = useProductStore();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const onDeleteClose = () => setIsDeleteOpen(false);
  const onSaveClose = () => setIsSaveOpen(false);
  const cancelDeleteRef = useRef<HTMLButtonElement | null>(null);
  const cancelSaveRef = useRef<HTMLButtonElement | null>(null);


  const deleteMutation = useMutation({
    // refactor later into useAppData
    mutationFn: async (id: number) => {
      const response = await fetch(`${BackendURL}/applications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete application");
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["products", currentPage, searchTerm],
      });
      await queryClient.refetchQueries({
        queryKey: ["application", appData?.id],
      });
      navigate(`/homepage`);
    },
    onError: (error: any) => {
      console.error("Error deleting application", error);
    },
  });

  const saveMutation = useMutation({
    // refactor later into useAppData
    mutationFn: async (appData: Application) => {
      const { id, ...appDataToSend } = appData;
      const method = id ? "PATCH" : "POST";
      const response = await fetch(
        `${BackendURL}/applications${id ? `/${id}` : ""}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appDataToSend),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save application");
      }
      return response.json();
    },
    onSuccess: async (savedApplication) => {
      // console.log("Application saved", savedApplication);
      await queryClient.refetchQueries({
        queryKey: ["products", currentPage, searchTerm],
      });
      await queryClient.refetchQueries({
        queryKey: ["application", appData?.id],
      });
      navigate(`/homepage`);
    },
    onError: (error: any) => {
      console.error("Error saving application", error);
    },
  });

  const handleDelete = () => {
    if (appData?.id) deleteMutation.mutate(appData.id);
    onDeleteClose();
  };

  const handleSave = () => {
    // First, update the state with the created_by field
    setNewAppData((prev) => ({
      ...prev,
      createdBy: user?.fullName || "",
    }));
    saveMutation.mutate(newAppData);
    onSaveClose();
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
        <Spacer />
        <Text fontSize={25} textAlign="center">
          Application Registration
        </Text>
        <Spacer />
        <HStack spacing={5}>
          <Button
            variant="link"
            p={0}
            _active={
              validationCheck(newAppData)
                ? { color: primaryColor }
                : { color: secondaryColor }
            }
            color={validationCheck(newAppData) ? primaryColor : secondaryColor}
            onClick={() => {
              validationCheck(newAppData) ? setIsSaveOpen(true) : null;
            }}
          >
            <AiOutlineSave size={"35"} />
          </Button>
          <Button
            variant="link"
            p={0}
            _active={{ color: primaryColor }}
            color={primaryColor}
            onClick={() => setIsDeleteOpen(true)}
          >
            <AiOutlineDelete size={"35"} />
          </Button>
        </HStack>
      </HStack>

      <HStack spacing={5} mt={5} mb={10} pl={10} alignItems="center">
        <Text fontSize="lg" fontWeight="semibold">
          Name:
        </Text>
        <Stack spacing={2} width="100%" position="relative">
          <Input
            size="md"
            variant="outline"
            width={"20%"}
            focusBorderColor={primaryColor}
            placeholder="Enter application name"
            value={newAppData.alias}
            onChange={(e) => {
              const alias = e.target.value;
              setTouched((prev) => ({ ...prev, alias: true }));
              setNewAppData((prev) => ({
                ...prev,
                alias,
              }));
            }}
          />
          {touched.alias &&
            (newAppData.alias.length < minimumAppName ||
              newAppData.alias.length > maximumAppName) && (
              <Text
                color="red"
                fontSize="sm"
                position="absolute"
                bottom="-25px"
              >
                {`Application name must be between ${minimumAppName} and ${maximumAppName} characters`}
              </Text>
            )}
        </Stack>
      </HStack>

      <HStack spacing={5} mt={10} mb={10} pl={10} position="relative">
        <Text fontSize="lg" fontWeight="semibold">
          Description:
        </Text>
        <Stack spacing={2} width="100%">
          <Input
            size="md"
            width="50%"
            variant="outline"
            focusBorderColor={primaryColor}
            placeholder="Enter Application Description"
            value={newAppData.description}
            onChange={(e) => {
              const description = e.target.value;
              setTouched((prev) => ({ ...prev, description: true }));
              setNewAppData((prev) => ({
                ...prev,
                description,
              }));
            }}
          />
          {touched.description &&
            (newAppData.description.length < minimumAppDescription ||
              newAppData.description.length > maximumAppDescription) && (
              <Text
                color="red"
                fontSize="sm"
                position="absolute"
                bottom="-25px"
              >
                {`Application description must be between ${minimumAppDescription} and ${maximumAppDescription} characters`}
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
