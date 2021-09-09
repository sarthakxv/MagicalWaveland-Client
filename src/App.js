import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Homepage from "./Components/Homepage";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Homepage />
    </ChakraProvider>
  );
};

export default App;
