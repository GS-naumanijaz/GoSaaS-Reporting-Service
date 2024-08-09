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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { primaryColor } from "../../configs";
import { Application } from "./AppDashboard";
import { useUser } from "../Login/UserContext";
import { useNavigate } from "react-router-dom";

interface Props {
  appData?: Application;
}

const AppHeader = ({ appData }: Props) => {
  const [newAppData, setNewAppData] = useState<Application>(
    appData || {
      id: Date.now(),
      name: "",
      description: "",
      is_active: false,
      is_deleted: false,
      created_by: "",
      deleted_by: "",
      creation_date: "",
      deletion_date: null,
      updation_date: "",
    }
  );
  const user = useUser(); // for created by
  const navigate = useNavigate();

  // usestates for the delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const onDeleteClose = () => setIsDeleteOpen(false);
  const cancelDeleteRef = useRef<HTMLButtonElement | null>(null);

  // usestates for the save dialog
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const onSaveClose = () => setIsSaveOpen(false);
  const cancelSaveRef = useRef<HTMLButtonElement | null>(null);

  const onDelete = () => {
    // delete item from database
    // navigate to homepage
    console.log("Item deleted");
    onDeleteClose();
  };

  const onSave = async () => {
    setNewAppData((prev) => ({
      ...prev,
      created_by: user?.fullName || "",
    }));
    try {
      const { id, ...appDataToSend } = newAppData;
      console.log("JSON.stringify(newAppData)" + JSON.stringify(appDataToSend));
      const response = await fetch("http://localhost:8080/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appDataToSend),
        credentials: "include",
      });

      if (response.ok) {
        const createdApplication = await response.json();
        console.log("Application saved", createdApplication);
        navigate(`/homepage`);
        // You might want to update the UI or navigate to another page
      } else {
        console.error("Failed to save application", response.statusText);
      }
    } catch (error) {
      console.error("Error saving application", error);
    }

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
          isChecked={newAppData.is_active}
          onChange={() => {
            setNewAppData((prev) => ({
              ...prev,
              is_active: !prev.is_active,
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
            _active={{ color: primaryColor }}
            color={primaryColor}
            onClick={() => setIsSaveOpen(true)}
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

      <HStack spacing={5} pt={5} pl={10}>
        <Text fontSize={20}>Application Name: </Text>
        <Input
          size="md"
          width="15%"
          variant="outline"
          focusBorderColor={primaryColor}
          placeholder="Name"
          value={newAppData.name}
          onChange={(e) => {
            const name = e.target.value;
            setNewAppData((prev) => ({
              ...prev,
              name: name,
            }));
          }}
        />
      </HStack>

      <HStack spacing={5} pt={5} pl={10}>
        <Text fontSize={20}>Application Description: </Text>
        <Input
          size="md"
          width="50%"
          variant="outline"
          focusBorderColor={primaryColor}
          placeholder="Description"
          value={newAppData.description}
          onChange={(e) => {
            const description = e.target.value;
            setNewAppData((prev) => ({
              ...prev,
              description: description,
            }));
          }}
        />
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
              <Button colorScheme="red" onClick={onDelete} ml={3}>
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
              <Button colorScheme="red" onClick={onSave} ml={3}>
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
