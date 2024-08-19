import { Button, Td } from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface Props {
  onClick: () => void;
  isEditingMode: boolean;
}

const TdTestButton = ({ onClick, isEditingMode }: Props) => {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "failure"
  >("idle");

  useEffect(() => {
    // Reset button state when isEditingMode changes
    setButtonState("idle");
  }, [isEditingMode]);

  const handleTest = async () => {
    setButtonState("loading");
    try {
      await onClick();
      setButtonState("success");
    } catch {
      setButtonState("failure");
    }
  };

  let buttonText = "Test";
  let buttonColorScheme = "blue";

  if (buttonState === "loading") {
    buttonText = "Testing";
  } else if (buttonState === "success") {
    buttonText = "Success";
    buttonColorScheme = "green";
  } else if (buttonState === "failure") {
    buttonText = "Failure";
    buttonColorScheme = "red";
  }

  return (
    <Td textAlign="center">
      <Button
        width={100}
        onClick={handleTest}
        colorScheme={buttonColorScheme}
        variant="solid"
        isDisabled={buttonState === "loading" || isEditingMode}
      >
        {buttonText}
      </Button>
    </Td>
  );
};

export default TdTestButton;
