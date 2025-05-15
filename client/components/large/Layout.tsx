import { getUserSettingsReq } from "@/api/get/getUserSettingsReq";
import { useAppContext } from "@/utilities/Context";
import { Box } from "@mui/material";
import Head from "next/head";
import { ReactNode, useEffect } from "react";
import Header from "./Header";
import HeaderMobile from "./HeaderMobile";

const cookie = require("cookie");

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
			"outer_content-color-red": "#1e1111",
			"outer_content-color-green": "#0a1510",
			"outer_content-color-blue": "#111117",
		};

		const color = colorMap[context.outerContentColor.trim()] || "#141414";
		metaThemeColor.setAttribute("content", color);

		// Přímé nastavení backgroundColor pro html (pro mobily)
		document.documentElement.style.backgroundColor = color;
	}, [context.outerContentColor]);

	useEffect(() => {
		const cookies = cookie.parse(document.cookie);
		const authToken = cookies.authToken || null;

		const fetchSettings = async () => {
			let textSizeCode = 3;
			let colorSchemeCode = 1;

			if (!authToken) {
				textSizeCode = Number(cookies.text_size);
				colorSchemeCode = Number(cookies.color_scheme);
			} else {
				const settings = await getUserSettingsReq({ authToken });

				if (settings.status === 200 && settings.data) {
					textSizeCode = settings.data.textSizeCode;
					colorSchemeCode = settings.data.colorSchemeCode;

					document.cookie = `text_size=${textSizeCode}; path=/; max-age=${60 * 60 * 24 * 90};`;
					document.cookie = `color_scheme=${colorSchemeCode}; path=/; max-age=${60 * 60 * 24 * 90};`;
				}
			}

			context.setTextSize(textSizeCode === 2 ? "text_size-small" : textSizeCode === 4 ? "text_size-large" : "text_size-medium");
			context.setColors(colorSchemeCode === 2 ? "red" : colorSchemeCode === 3 ? "blue" : colorSchemeCode === 4 ? "green" : "gray");
		};

		fetchSettings();
	}, []);

	useEffect(() => {
		const setAppHeight = () => {
			const appHeight = window.innerHeight;
			document.documentElement.style.setProperty("--app-height", `${appHeight}px`);
		};

		setAppHeight();
		window.addEventListener("resize", setAppHeight);

		return () => {
			window.removeEventListener("resize", setAppHeight);
		};
	}, []);

	return (
		<>
			<Head>
				<link
					rel="icon"
					href="/icons/favicon-gray.ico"
				/>
			</Head>

			<Box className={`${context.outerContentColor} h-[100dvh]`}>
				<div className="flex justify-center">
					<Box className="max-w-content w-full hidden lg:block">
						<Header />
					</Box>
					<Box className="max-w-content  w-full block lg:hidden ">
						<HeaderMobile />
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
