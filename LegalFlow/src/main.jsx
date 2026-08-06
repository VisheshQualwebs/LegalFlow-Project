import { BrowserRouter, HashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./bones/registry";
import { Provider } from "react-redux"
import { store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>

  // <HashRouter>
  //   <App />
  // </HashRouter>
);