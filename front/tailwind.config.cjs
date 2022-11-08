const { screens } = require("tailwindcss/defaultTheme");

module.exports = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                main: {
                    DEFAULT: "#7E22CE",
                },
                "desp-roxo-escuro": {
                    DEFAULT: "#4E0371",
                    50: "#BA32FA",
                    100: "#B31EF9",
                    200: "#A006E8",
                    300: "#8505C0",
                    400: "#690499",
                    500: "#4E0371",
                    600: "#28023A",
                    700: "#030004",
                    800: "#000000",
                    900: "#000000",
                },
            },
        },
        extend: {
            screens: {
                "2xs": "300px",
                xs: "475px",
                xs: "579px",
                xsmd: "621px",
                mdlg: "896px",
                lgxl: "1152px",
                "3xl": "1600px",
                ...screens,
            },
        },
    },
    plugins: [],
};
