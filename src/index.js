import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import theme from "./theme";
import { ColorModeScript } from "@chakra-ui/color-mode";

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>,
  document.getElementById("root")
);
