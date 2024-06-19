import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./errorHandlers/ErrorBoundary.tsx";
import { Provider } from "react-redux";
import { persister, store } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { Store } from "@reduxjs/toolkit";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate persistor={persister} loading={null}>
          <App />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

//////////////////////////////
// for Cy mocking
//////////////////////////////

declare global {
  interface Window {
    __store__: Store;
  }
}

if (typeof window !== 'undefined') {
  window.__store__ = store;
  
  // if (window.Cypress) {
  //   window.__store__ = store;
  // }
}
