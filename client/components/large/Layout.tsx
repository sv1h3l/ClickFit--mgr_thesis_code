import { useAppContext } from "@/utilities/Context";
import { Box } from "@mui/material";
import Head from "next/head";
import { ReactNode, useEffect } from "react";
import Header from "./Header";

function Layout({ children }: { children: ReactNode }) {
	const context = useAppContext();

	useEffect(() => {
		// Nastavení třídy pro html
		document.documentElement.classList.forEach((cls) => {
			if (cls.startsWith("outer_content-color-")) {
				document.documentElement.classList.remove(cls);
			}
		});
		document.documentElement.classList.add(context.outerContentColor.trim());

		// Nastavení <meta name="theme-color">
		let metaThemeColor = document.querySelector("meta[name=theme-color]");
		if (!metaThemeColor) {
			metaThemeColor = document.createElement("meta");
			metaThemeColor.setAttribute("name", "theme-color");
			document.head.appendChild(metaThemeColor);
		}

		// Mapa barev pro každé téma
		const colorMap: Record<string, string> = {
			"outer_content-color-gray": "#141414", 
			"outer_content-color-red": "#1e1111",
			"outer_content-color-green": "#0a1510",
			"outer_content-color-blue": "#111117",
		};

		const color = colorMap[context.outerContentColor.trim()] || "#141414";
		metaThemeColor.setAttribute("content", color);
	}, []);

	useEffect(() => {
		// Nastavení třídy pro html
		document.documentElement.classList.forEach((cls) => {
			if (cls.startsWith("outer_content-color-")) {
				document.documentElement.classList.remove(cls);
			}
		});
		document.documentElement.classList.add(context.outerContentColor.trim());

		// Nastavení <meta name="theme-color">
		let metaThemeColor = document.querySelector("meta[name=theme-color]");
		if (!metaThemeColor) {
			metaThemeColor = document.createElement("meta");
			metaThemeColor.setAttribute("name", "theme-color");
			document.head.appendChild(metaThemeColor);
		}

		// Mapa barev pro každé téma
		const colorMap: Record<string, string> = {
			"outer_content-color-gray": "#141414",
			"outer_content-color-red": "#330000",
			"outer_content-color-green": "#002a00",
			"outer_content-color-blue": "#001f33",
		};

		const color = colorMap[context.outerContentColor.trim()] || "#141414";
		metaThemeColor.setAttribute("content", color);
	}, [context.outerContentColor]);

	return (
		<>
			<Head>
				<link
					rel="icon"
					href="/icons/favicon-gray.ico"
				/>
			</Head>

			<Box className={`${context.outerContentColor}`}>
				<div className="flex justify-center">
					<Box className="max-w-content w-full">
						<Header />
					</Box>
				</div>

				<div className="flex justify-center w-full">
					<div className="max-w-content w-full">
						<main>{children}</main>
					</div>
				</div>
			</Box>
		</>
	);
}

export default Layout;
