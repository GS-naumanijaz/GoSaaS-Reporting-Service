import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { primaryColor, tertiaryColor, BackendURL} from "../../configs";
import { RxAvatar } from "react-icons/rx";
import { RiLogoutBoxRLine } from "react-icons/ri";

const AvatarPopup = () => {
  const handleLogout = async () => {
    
    try {
      const response = await fetch(`${BackendURL}/logout`, {
        method: "POST",
        credentials: "include",
      });


      if (response.ok || response.status == 302)   {
        
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      window.location.href = "/";
      console.error("An error occurred during logout", error);
    }
  };

  return (
    <Popover placement="bottom-end" isLazy>
      <PopoverTrigger>
        <Button
          variant="link"
          p={0}
          _active={{ color: primaryColor }}
          color={primaryColor}
        >
          <RxAvatar size={36} />
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent bg={tertiaryColor} maxWidth={"150px"}>
          <PopoverBody>
            <Button
              textColor={"black"}
              fontWeight={"normal"}
              width={"100%"}
              leftIcon={<RiLogoutBoxRLine />}
              size={"sm"}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default AvatarPopup;
