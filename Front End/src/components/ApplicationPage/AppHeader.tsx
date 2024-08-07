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

interface Props {
  appName?: string;
  appDescription?: string;
}

const AppHeader = ({ appName, appDescription }: Props) => {
  // usestates for the switch, description, and name
  const [isChecked, setIsChecked] = useState(true);
  const [name, setName] = useState(appName ? appName : "");
  const [description, setDescription] = useState(
    appDescription ? appDescription : ""
  );

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

  const onSave = () => {
    // save changes to database
    // reload the application page
    console.log("Changes saved");
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
          isChecked={isChecked}
          onChange={() => {
            setIsChecked(!isChecked);
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </HStack>

      <HStack spacing={5} pt={5} pl={10}>
        <Text fontSize={20}>Application Description: </Text>
        <Input
          size="md"
          width="50%"
          variant="outline"
          focusBorderColor={primaryColor}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></Input>
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
