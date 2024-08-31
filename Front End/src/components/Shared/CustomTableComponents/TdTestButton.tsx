import { Button, Td, Tooltip } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useLocation } from "react-router-dom";

interface Props {
  onClick: () => void;
  isEditingMode: boolean;
  lastTestResult: boolean | undefined;
  setLastTestResult: (result: boolean) => void;
  rowIndex: number;
  canTest: boolean;
}

const TdTestButton = ({ onClick, isEditingMode, lastTestResult, setLastTestResult, rowIndex, canTest }: Props) => {

  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "failure"
  >("idle");

  useEffect(() => {
    setButtonState("idle");
  }, [isEditingMode]);

  useEffect(() => {
    if (lastTestResult === null) {
      handleTest();
    }
  }, [lastTestResult, canTest]);

  const handleTest = async () => {
    if (!canTest) return; 

    setButtonState("loading");
    try {
      await onClick();
      console.log("pass");
      setLastTestResult(true);
    } catch {
      console.log("fail");
      setLastTestResult(false);
    } finally {
      setTimeout(() => {
        setButtonState("idle");
      }, 500); 
    }
  };

  console.log(rowIndex, lastTestResult, canTest);

  let buttonText = "Test";
  let buttonColorScheme = "blue";

  if (buttonState === "loading") {
    buttonText = "Testing";
  }

  return (
    <Td textAlign="center">
      <Tooltip label={lastTestResult ? "Last test result was Successful" : "Last test result was unsuccessful"} bg={lastTestResult ? "green" : "red"}>
        <Button
          width={100}
          onClick={handleTest}
          colorScheme={buttonColorScheme}
          variant="solid"
          isDisabled={buttonState === "loading" || isEditingMode}
          rightIcon={lastTestResult ? <IoCheckmarkCircle color="lightgreen" size={25} /> : <FaCircleExclamation color="red" size={25} />}
        >
          {buttonText}
        </Button>
      </Tooltip>
    </Td>
  );
};

export default TdTestButton;
