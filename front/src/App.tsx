import { Router } from "./routes";
import { ThemeProvider } from "@mui/material";
import { theme } from "./Theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
