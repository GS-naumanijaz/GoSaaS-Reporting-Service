import { Box, Button, Image, VStack } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { primaryColor, secondaryColor } from "../configs";
import { useNavigate } from "react-router-dom";

const SignInCard = () => {
  const navigate = useNavigate();
  const GoSaaSLabsLogo: string =
    "https://gosaaslabs.com/wp-content/uploads/2022/02/GoSaaS-Labs-h.png";

  return (
    <Box padding={70}>
      <Image height={20} src={GoSaaSLabsLogo} />

      <VStack direction="row" spacing={4} paddingTop={7}>
        <Button
          onClick={() => navigate("/homepage")}
          leftIcon={<FcGoogle />}
          bgColor={primaryColor}
          variant="solid"
          _hover={{
            bg: secondaryColor,
            transform: "scale(0.98)",
          }}
        >
          Sign In with Google
        </Button>
      </VStack>
    </Box>
  );
};

export default SignInCard;
