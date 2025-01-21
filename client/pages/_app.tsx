import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

function ClickFit({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}

export default ClickFit;
