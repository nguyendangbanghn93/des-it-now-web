import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import ReactDOM from "react-dom/client";
import Toasts, { toasts } from "@/components/commons/Toast.tsx";
import { DialogProvider } from "@/stores/dialogStore.tsx";
import useAuthStore from "@/stores/authStore.ts";

import duration from "dayjs/plugin/duration";
import dayjs from "dayjs";

dayjs.extend(duration);

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError(error: any) {
        console.log("🚀 ~ onError ~ error, variables, context:", error);
        toasts.error(
          error?.response?.data?.message ||
            error?.response?.data?.error?.message ||
            error.message
        );
      },
    },
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      throwOnError(error: any) {
        if (error?.response?.data?.error?.name === "UnauthorizedError") {
          useAuthStore.getState().logout();
        }
        console.log("🚀 ~ onError ~ error, variables, context:", error);
        toasts.error(error?.response?.data?.error?.message || error.message);
        return false;
      },
    },
  },
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then(function (registrations) {
      for (const registration of registrations) {
        registration.unregister();
      }
    })
    .finally(() => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function (registration) {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch(function (error) {
          console.error("Service Worker registration failed:", error);
        });
    });
}

Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    console.log("Notification permission granted.");
  } else {
    console.log("Notification permission denied.");
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    theme={createTheme({
      shape: { borderRadius: 8 },
      palette: {
        secondary: { main: "#EE7553" },
      },
    })}
  >
    <Toasts />
    <BrowserRouter>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <DialogProvider>
          <App />
        </DialogProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ThemeProvider>
  //   <React.StrictMode>

  //     {/* <BrowserRouter>
  //       <App />
  //     </BrowserRouter> */}
  //   </React.StrictMode>
);
