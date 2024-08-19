import { createStandaloneToast } from "@chakra-ui/react";

export const useErrorToast = () => {
  const { toast } = createStandaloneToast();

  return (errorMessage: string) => {
    toast({
      title: "Error",
      description: errorMessage,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };
};
