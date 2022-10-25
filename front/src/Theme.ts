import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#7E22CE",
            contrastText: "#fff",
        },
        error: {
            main: "#f44336",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: "7px 25px",
                    fontSize: 15,
                    textTransform: "capitalize",
                },
            },
        },
    },
});
