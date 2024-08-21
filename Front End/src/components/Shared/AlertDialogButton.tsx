import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  header: string;
  body: string;
  cancelText: string;
  confirmText: string;
  onConfirm: () => void;
  children: React.ReactNode;
}

const AlertDialogButton = ({
  header,
  body,
  cancelText,
  confirmText,
  onConfirm: onDelete,
  children,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <>
      <Button variant={"ghost"} onClick={onOpen}>
        {children}{" "}
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

            <AlertDialogBody>{body}</AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>{cancelText}</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                {confirmText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AlertDialogButton;
