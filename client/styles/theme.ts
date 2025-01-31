import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12, 
                    //color: "black",
                },
            },
        },
    },
});

export default theme;
