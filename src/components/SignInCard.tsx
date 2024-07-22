import { Box, Button, Image, VStack } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { GoSaaSLabsLogo, primaryColor, secondaryColor } from "../configs";
import { useNavigate } from "react-router-dom";

const SignInCard = () => {
  const navigate = useNavigate();

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
