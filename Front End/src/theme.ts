import { extendTheme } from "@chakra-ui/react";
import { tertiaryColor } from "./configs";
export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: tertiaryColor,
        color: "black",
      },
    },
  },
});
