import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { Container } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Container>
    <Provider store={store}>
      <App />
    </Provider>
  </Container>,
);
