import { createTheme } from "@mui/material";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { MUI_DATAGRID_PT_BR } from "./pt-BR";

const hoverOpacity = 0.03;
export const mainColor = "#000055"; // RE

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
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 10,
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                rounded: {
                    borderRadius: 10,
                },
            },
        },
        MuiDataGrid: {
            defaultProps: {
                disableColumnMenu: process.env.NODE_ENV === "production",
                disableColumnSelector: process.env.NODE_ENV === "production",
                disableColumnFilter: process.env.NODE_ENV === "production",
                rowsPerPageOptions: [10, 25, 50, 100],
                autoHeight: true,
                disableSelectionOnClick: true,
                localeText: MUI_DATAGRID_PT_BR,
            },
            styleOverrides: {
                root: {
                    border: 0,
                    "& .MuiCheckbox-root": {
                        padding: "3px 9px",
                    },
                    "& .MuiDataGrid-renderingZone, .MuiDataGrid-virtualScrollerContent": {
                        "& .MuiDataGrid-row": {
                            border: 0,
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                            "&:hover": {
                                backgroundColor: `rgba(0, 0, 0, ${hoverOpacity + 0.04})`,
                            },
                        },
                        "& .MuiDataGrid-row:first-of-type": {
                            borderTopLeftRadius: "3px",
                            borderBottomLeftRadius: "3px",
                            overflow: "hidden",
                        },
                        "& .MuiDataGrid-row:nth-of-type(odd)": {
                            backgroundColor: `rgba(0, 0, 0, ${hoverOpacity})`,
                            "&:hover": {
                                backgroundColor: `rgba(0, 0, 0, ${hoverOpacity + 0.04})`,
                            },
                            "&.Mui-selected": {
                                backgroundColor: `rgba(12, 6, 63, 0.1);`,
                                "&:hover": {
                                    backgroundColor: `rgba(12, 6, 63, 0.12);`,
                                },
                            },
                        },
                        "& .MuiDataGrid-row:last-of-type": {
                            borderTopRightRadius: "3px",
                            borderBottomRightRadius: "3px",
                            overflow: "hidden",
                        },
                        "& .MuiDataGrid-editInputCell .MuiInputBase-input": {
                            padding: 6,
                        },
                    },
                },
            },
        },
    },
});
