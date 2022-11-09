import { Router } from "./routes";
import { ThemeProvider } from "@mui/material";
import { theme } from "./Theme";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
