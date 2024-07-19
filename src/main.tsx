import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@/theme";
import { SettingsConsumer, SettingsProvider } from "@/contexts/settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
      <SettingsConsumer>
        {(settings) => {
          const theme = createTheme({
            colorPreset: settings.colorPreset,
            contrast: settings.contrast,
            direction: settings.direction,
            paletteMode: settings.paletteMode,
            responsiveFontSizes: settings.responsiveFontSizes,
          });
          return (
            <ThemeProvider theme={theme}>
              <BrowserRouter>
                <CssBaseline />

                <QueryClientProvider client={queryClient}>
                  <App />
                </QueryClientProvider>
              </BrowserRouter>
            </ThemeProvider>
          );
        }}
      </SettingsConsumer>
    </SettingsProvider>
    {/* <BrowserRouter>
      <App />
    </BrowserRouter> */}
  </React.StrictMode>
);
