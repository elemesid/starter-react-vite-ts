import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./stores";
import { UnsavedWarnContextProvider } from "./contexts/unsaved-warn.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <UnsavedWarnContextProvider>
        <App />
      </UnsavedWarnContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
