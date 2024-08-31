import { Button, HStack, Image } from "@chakra-ui/react";
import { GoSaaSLabsLogo, navbarHeight } from "../../configs";
// import NotificationPopup from "./NotificationPopup";
import AvatarPopup from "./AvatarPopup";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <HStack
      justify={"space-between"}
      // height={navbarHeight}
      paddingBottom={10}
      paddingTop={10}
      borderBottomColor={"red"}
      borderBottomWidth={3}
    >
      <Button
        variant="ghost"
        onClick={() => navigate("/homepage")}
        _hover={{
          bg: "transparent",
          boxShadow: "none",
        }}
      >
        <Image marginLeft={3} padding={2} width={200} src={GoSaaSLabsLogo} />
      </Button>

      <HStack marginRight={5} spacing={8}>
        {/* <NotificationPopup /> */}
        <AvatarPopup />
      </HStack>
    </HStack>
  );
};

export default NavBar;
