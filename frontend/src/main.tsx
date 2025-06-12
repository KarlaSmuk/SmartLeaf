import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { PushSetup } from "./components/PushSetup";
import { PlantProvider } from "./context/plant";
import { PushListener } from "./components/PushListener";
import { AlertProvider } from "./context/alert";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <PlantProvider>
              <AlertProvider>
                <PushSetup />
                <PushListener />
                <App />
              </AlertProvider>
            </PlantProvider>
          </ThemeProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
