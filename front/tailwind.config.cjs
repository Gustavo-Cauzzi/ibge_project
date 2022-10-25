const { screens } = require("tailwindcss/defaultTheme");

module.exports = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                main: "#7E22CE",
            },
        },
        extend: {
            screens: {
                "2xs": "300px",
                xs: "475px",
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
