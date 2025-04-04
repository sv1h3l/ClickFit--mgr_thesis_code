import Layout from "@/components/large/Layout"; // Import Layout komponenty
import "@/styles/globals.css";
import theme from "@/styles/theme";
import useAuthRedirect from "@/utilities/useAuthRedirect";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

function ClickFit({ Component, pageProps }: AppProps) {
	useAuthRedirect();

	return (
		<ThemeProvider theme={theme}>
			<Layout>
				{/* Obalíme všechny stránky do Layoutu */}
				<Component {...pageProps} />
			</Layout>
		</ThemeProvider>
	);
}

export default ClickFit;
