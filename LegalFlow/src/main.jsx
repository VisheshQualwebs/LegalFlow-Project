import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { store } from "./redux/store";
import "./bones/registry";
import "./i18n/i18n";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient} >
        <App />
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
);