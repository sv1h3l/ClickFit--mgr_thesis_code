import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ThemeColor = "gray" | "red" | "green" | "blue";
export type TextSize = "text_size-small" | "text_size-medium" | "text_size-large";

interface AppContextInterface {
	colorSchemeCode: string;

	outerContentColor: string;

	bgPrimaryColor: string;
	bgSecondaryColor: string;
	bgTertiaryColor: string;
	bgQuaternaryColor: string;

	borderPrimaryColor: string;
	borderSecondaryColor: string;
	borderTertiaryColor: string;
	borderQuaternaryColor: string;

	bgHoverTertiaryColor: string;
	borderHoverTertiaryColor: string;

	scrollbarThumbColor: string;
	scrollbarThumbHoverColor: string;

	logoColor: string;

	activeSection: number;
	setActiveSection: (nthSection: number) => void;
	isSmallDevice: boolean;
	setIsSmallDevice: (enabled: boolean) => void;
	windowWidth: number;
	setWindowWidth: (width: number) => void;

	setColors: (color: ThemeColor) => void;

	textSize: TextSize;
	setTextSize: (size: TextSize) => void;
}

const defaultColors = {
	colorSchemeCode: "gray",

	scrollbarThumbColor: "#505050", // Přednastavená barva pro thumb
	scrollbarThumbHoverColor: "#5f5f5f", // Přednastavená barva pro thumb při hoveru

	outerContentColor: " outer_content-color-gray ",

	bgPrimaryColor: " bg-primary_color-gray ",
	bgSecondaryColor: " bg-secondary_color-gray ",
	bgTertiaryColor: " bg-tertiary_color-gray ",
	bgQuaternaryColor: " bg-quaternary_color-gray ",

	borderPrimaryColor: " border-primary_color-gray ",
	borderSecondaryColor: " border-secondary_color-gray ",
	borderTertiaryColor: " border-tertiary_color-gray ",
	borderQuaternaryColor: " border-quaternary_color-gray ",

	bgHoverTertiaryColor: " bg_hover-tertiary_color-gray ",
	borderHoverTertiaryColor: " border_hover-tertiary_color-gray ",

	logoColor: "/icons/logo-gray.webp",
};

const AppContext = createContext<AppContextInterface>({
	...defaultColors,
	textSize: "text_size-medium",
	activeSection: 1,
	isSmallDevice: false,
	windowWidth: 0,
	setColors: () => {},
	setTextSize: () => {},
	setActiveSection: () => {},
	setIsSmallDevice: () => {},
	setWindowWidth: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
	// #region Settings
	const [colors, setColors] = useState(defaultColors);

	const setColor = (color: ThemeColor) => {
		const newColors = {
			colorSchemeCode: color,

			outerContentColor: "outer_content-color-" + color,

			bgPrimaryColor: " bg-primary_color-" + color + " ",
			bgSecondaryColor: " bg-secondary_color-" + color + " ",
			bgTertiaryColor: " bg-tertiary_color-" + color + " ",
			bgQuaternaryColor: " bg-quaternary_color-" + color + " ",

			borderPrimaryColor: " border-primary_color-" + color + " ",
			borderSecondaryColor: " border-secondary_color-" + color + " ",
			borderTertiaryColor: " border-tertiary_color-" + color + " ",
			borderQuaternaryColor: " border-quaternary_color-" + color + " ",

			bgHoverTertiaryColor: " bg_hover-tertiary_color-" + color + " ",
			borderHoverTertiaryColor: " border_hover-tertiary_color-" + color + " ",

			scrollbarThumbColor: color === "red" ? "#5d4848" : color === "blue" ? "#404b58" : color === "green" ? "#375242" : "#505050", // Dynamická barva scrollbar-u
			scrollbarThumbHoverColor: color === "red" ? "#6c5757" : color === "blue" ? "#4f5a67" : color === "green" ? "#466151" : "#5f5f5f", // Dynamická hover barva scrollbar-u

			logoColor: "/icons/logo-" + color + ".webp",
		};

		setColors(newColors);
	};

	useEffect(() => {
		document.documentElement.style.setProperty("--scrollbar-thumb-color", colors.scrollbarThumbColor);
		document.documentElement.style.setProperty("--scrollbar-thumb-hover-color", colors.scrollbarThumbHoverColor);
	}, [colors]);

	const [textSize, setTextSize] = useState<TextSize>("text_size-medium");

	useEffect(() => {
		if (textSize) {
			document.documentElement.className = textSize;
		}
	}, [textSize]);

	const [activeSection, setActiveSection] = useState<number>(1);

	const [isSmallDevice, setIsSmallDevice] = useState<boolean>(false);

	const [windowWidth, setWindowWidth] = useState<number>(0);

	useEffect(() => {
		const checkWidth = () => {
			const width = window.innerWidth;
			setWindowWidth(width);
			const isMobile = width < 1024;
			//console.log("Změna šířky okna:", window.innerWidth, "| isMobile:", isMobile);
			setIsSmallDevice(isMobile);
		};

		checkWidth();
		window.addEventListener("resize", checkWidth);

		return () => window.removeEventListener("resize", checkWidth);
	}, []);

	useEffect(() => {
		// Pushneme jeden dummy stav, aby měl uživatel kam jít zpět
		window.history.pushState({ section: 0 }, "");
		window.history.pushState({ section: 1 }, "");
	}, []);

	useEffect(() => {
		if (activeSection > 1) {
			window.history.pushState({ section: activeSection }, "");
		}
	}, [activeSection]);

	useEffect(() => {
		const onPopState = (event: PopStateEvent) => {
			if (isSmallDevice) {
				if (activeSection > 1) {
					setActiveSection((prev) => prev - 1);
					window.history.pushState({ section: activeSection - 1 }, "");
				}
				// Pokud je activeSection === 1, necháme browser jít dál = popstate se zpracuje normálně
			}
		};

		window.addEventListener("popstate", onPopState);
		return () => window.removeEventListener("popstate", onPopState);
	}, [activeSection, isSmallDevice]);

	// #endregion

	return <AppContext.Provider value={{ ...colors, textSize, setColors: setColor, setTextSize, setActiveSection, activeSection, setIsSmallDevice, isSmallDevice, setWindowWidth, windowWidth }}>{children}</AppContext.Provider>;
};
