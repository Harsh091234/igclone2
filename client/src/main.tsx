import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

import { Toaster } from "react-hot-toast";

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./utils/ThemeProvider.tsx";

import { Provider } from "react-redux";
import { store } from "./store/store.ts";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </Provider>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#fff",
              color: "#0EA5E9", // sky-500
              border: "1px solid #bae6fd",
            },
            iconTheme: {
              primary: "#0EA5E9", // sky-500
              secondary: "#fff",
            },
          },
          error: {
            style: {
              background: "#fff",
              color: "#ef4444", // red-500
              border: "1px solid #fecaca", // red-200
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
    </BrowserRouter>
  </ClerkProvider>,
);
