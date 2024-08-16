import { Button, Td } from "@chakra-ui/react";
import { useTestDestinationConnectionMutation } from "../../../hooks/useDestinationConnectionQuery";
import { useState } from "react";

interface Props {
  onClick: () => void;
}

const TdTestButton = ({ onClick }: Props) => {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "failure"
  >("idle");
  const testDestinationMutation = useTestDestinationConnectionMutation();

  let appId = 5;
  let destinationId = 14;

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
    buttonText = "Testing ";
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
        onMouseEnter={() => buttonState !== "loading"}
        colorScheme={buttonColorScheme}
        variant="solid"
        isDisabled={buttonState === "loading"}
      >
        {buttonText}
      </Button>
    </Td>
  );
};

export default TdTestButton;
