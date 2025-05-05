import Layout from "@/components/large/Layout";
import "@/styles/globals.css";
import theme from "@/styles/theme";
import { ContextProvider } from "@/utilities/Context";
import PageTransitionWrapper from "@/utilities/PageTransitionWrapper";
import useAuthRedirect from "@/utilities/useAuthRedirect";
import { ThemeProvider } from "@emotion/react";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

function ClickFit({ Component, pageProps }: AppProps) {
	useAuthRedirect();

	return (
		<ThemeProvider theme={theme}>
			<ContextProvider>
				<Layout>
					<PageTransitionWrapper>
						<Component {...pageProps} />
					</PageTransitionWrapper>
				</Layout>
			</ContextProvider>
		</ThemeProvider>
	);
}

export default ClickFit;
