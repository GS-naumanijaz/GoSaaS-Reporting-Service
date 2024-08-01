import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { primaryColor, tertiaryColor } from "../configs";
import { RxAvatar } from "react-icons/rx";
import { RiLogoutBoxRLine } from "react-icons/ri";

const AvatarPopup = () => {
  const handleLogout = async () => {
    try {
      console.log("Logging out Called");
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
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
          onClick={() => console.log("Avatar Clicked")}
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
