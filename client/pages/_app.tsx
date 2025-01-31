import "@/styles/globals.css";
import theme from "@/styles/theme"; // ❌ Bez .ts přípony
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

function ClickFit({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default ClickFit;
