import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  header: string;
  body: string;
  cancelText: string;
  confirmText: string;
  onConfirm: () => void;
  children: React.ReactNode;
  tooltipLabel?: string;
  tooltipColor?: string;
  tooltipHasArrow?: boolean;
}

const AlertDialogButton = ({
  header,
  body,
  cancelText,
  confirmText,
  onConfirm: onDelete,
  children,
  tooltipLabel,
  tooltipColor = "gray.300",
  tooltipHasArrow = false,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const button = (
    <Button variant={"ghost"} onClick={onOpen}>
      {children}
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
