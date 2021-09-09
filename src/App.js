import * as React from "react";
// import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import Homepage from "./Components/Homepage";

export const App = () => {
  return (
    <ChakraProvider>
      <Homepage />
    </ChakraProvider>
  );
};

export default App;
