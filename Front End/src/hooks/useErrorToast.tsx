import { createStandaloneToast } from "@chakra-ui/react";

export const useErrorToast = (titleValue: string = "Error", color:string = "red") => {
  const { toast } = createStandaloneToast();

  return (errorMessage: string) => {
    toast({
      title: titleValue,
      description: errorMessage,
      status: "error",
      duration: 5000,
      isClosable: true,
      colorScheme: color,
    });
  };
};

