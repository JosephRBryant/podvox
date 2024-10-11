import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { configureStore } from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import "./index.css";
import { csrfFetch, restoreCSRF } from "./redux/csrf";
import { PersistGate } from "redux-persist/integration/react";

const { store, persistor } = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF()
  window.csrfFetch = csrfFetch
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </ReduxProvider>
  </React.StrictMode>
);
