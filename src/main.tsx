import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsConsumer, SettingsProvider } from "@/contexts/settings";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import ReactDOM from "react-dom/client";
// import { createTheme } from "@/theme";
import { toasts } from "@/components/commons/Toast.tsx";
import useAuthStore from "@/stores/authStore.ts";
import { DialogProvider } from "@/stores/dialogStore.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError(error: any, variables) {
        console.log(
          "🚀 ~ onError ~ error, variables, context:",
          error,
          variables
        );
        toasts.error(error?.response?.data?.error?.message || error.message);
      },
    },
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      throwOnError(error: any) {
        // if (error?.response?.data?.error?.name === "UnauthorizedError") {
        //   useAuthStore.getState().logout();
        // }
        console.log("🚀 ~ onError ~ error, variables, context:", error);
        toasts.error(error?.response?.data?.error?.message || error.message);
        return false;
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SettingsProvider>
    <SettingsConsumer>
      {() => {
        //   const theme = createTheme({
        //     colorPreset: settings.colorPreset,
        //     contrast: settings.contrast,
        //     direction: settings.direction,
        //     paletteMode: settings.paletteMode,
        //     responsiveFontSizes: settings.responsiveFontSizes,
        //   });
        return (
          <ThemeProvider
            theme={createTheme({
              shape: { borderRadius: 8 },
              palette: {
                secondary: { main: "#EE7553" },
                // secondary: { main: "#b0b0b0" },
              },
            })}
          >
            <BrowserRouter>
              <CssBaseline />

              <QueryClientProvider client={queryClient}>
                <DialogProvider>
                  <App />
                </DialogProvider>
              </QueryClientProvider>
            </BrowserRouter>
          </ThemeProvider>
        );
      }}
    </SettingsConsumer>
  </SettingsProvider>
  //   <React.StrictMode>

  //     {/* <BrowserRouter>
  //       <App />
  //     </BrowserRouter> */}
  //   </React.StrictMode>
);
