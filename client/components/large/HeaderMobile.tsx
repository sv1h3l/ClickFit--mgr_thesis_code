import { changeUserSettingsReq } from "@/api/change/changeUserSettingsReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { getUserSettingsReq } from "@/api/get/getUserSettingsReq";
import { TextSize, useAppContext } from "@/utilities/Context";
import { AppBar, Box, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import CustomModal from "../small/CustomModal";
import Navigation from "./Navigation";

const cookie = require("cookie");

function HeaderMobile() {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("cs-CZ"));
	const [externalClicked, setExternalClicked] = useState(false);

	const [externalSettingsClicked, setExternalSettingsClicked] = useState(false);

	const context = useAppContext();

	useEffect(() => {
		const checkUserCookie = () => {
			const cookies = cookie.parse(document.cookie);
			const authToken = cookies.authToken || null;

			if (authToken) {
				setUser(authToken);
			}
		};

		checkUserCookie();

		const interval = setInterval(checkUserCookie, 10);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		router.pathname === "/profile" ? setExternalClicked(true) : setExternalClicked(false);
	}, [router.pathname]);

	useEffect(() => {
		const fetchSettings = async () => {
			const cookies = cookie.parse(document.cookie);
			const authToken = cookies.authToken || null;

			const settings = await getUserSettingsReq({ authToken });

			if (settings.status === 200 && settings.data) {
				const textSizeCode = settings.data.textSizeCode;
				const colorSchemeCode = settings.data.colorSchemeCode;

				setSelectedColorScheme(colorSchemeCode === 2 ? "red" : colorSchemeCode === 3 ? "blue" : colorSchemeCode === 4 ? "green" : "gray");
				setSelectedTextSize(textSizeCode === 2 ? "text_size-small" : textSizeCode === 4 ? "text_size-large" : "text_size-medium");
			}
		};

		fetchSettings();
	});

	const handleLogout = () => {
		document.cookie = "authToken=; max-age=0; path=/"; // Vymazání cookie
		setUser(null);
		router.push("/");
	};

	const [isModalOpen, setModalOpen] = useState(false);

	const handleOpenModal = () => {
		setExternalSettingsClicked(true);
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setExternalSettingsClicked(false);
		setModalOpen(false);
	};

	type ColorScheme = "gray" | "red" | "green" | "blue";
	const [selectedColorScheme, setSelectedColorScheme] = useState<ColorScheme>("gray");
	const [openColorScheme, setOpenColorScheme] = useState(false);

	const handleOpenColorScheme = () => {
		setOpenColorScheme(true);
	};

	const handleCloseColorScheme = () => {
		setOpenColorScheme(false);
	};

	const handleChangeColorScheme = async (event: SelectChangeEvent<string>) => {
		const colorScheme = event.target.value as ColorScheme;

		if (["gray", "red", "green", "blue"].includes(colorScheme)) {
			setSelectedColorScheme(colorScheme);
			context.setColors(colorScheme);

			const colorSchemeCode = colorScheme === "red" ? 2 : colorScheme === "blue" ? 3 : colorScheme === "green" ? 4 : 1;
			document.cookie = `color_scheme=${colorSchemeCode}; path=/; max-age=${60 * 60 * 24 * 90};`;

			try {
				const response = await changeUserSettingsReq({ code: colorSchemeCode, isTextSize: false });

				consoleLogPrint(response);
			} catch (error) {
				console.error("Error: ", error);
			}
		}

		handleCloseColorScheme();
	};

	const [selectedTextSize, setSelectedTextSize] = useState<TextSize>("text_size-medium");
	const [openTextSize, setOpenTextSize] = useState(false);

	const handleOpenTextSize = () => {
		setOpenTextSize(true);
	};

	const handleCloseTextSize = () => {
		setOpenTextSize(false);
	};

	const handleChangeTextSize = async (event: SelectChangeEvent<string>) => {
		const textSize = event.target.value as TextSize;

		if (["text_size-small", "text_size-medium", "text_size-large"].includes(textSize)) {
			setSelectedTextSize(textSize);
			context.setTextSize(textSize);

			const textSizeCode = textSize === "text_size-small" ? 2 : textSize === "text_size-large" ? 4 : 3;
			document.cookie = `text_size=${textSizeCode}; path=/; max-age=${60 * 60 * 24 * 90};`;

			try {
				const response = await changeUserSettingsReq({ code: textSizeCode, isTextSize: true });

				consoleLogPrint(response);
			} catch (error) {
				console.error("Error: ", error);
			}
		}

		handleCloseTextSize();
	};

	return user ? (
		<AppBar className="bg-transparent shadow-none text-center relative ">
			<Box className="justify-center px-1">
				<Box className="flex w-full max-w-content shadow-black shadow-md rounded-3xl">
					<Box className={`w-1/6 justify-center items-center flex border-l-[3px] border-b-[3px] rounded-bl-3xl h-28 ${context.bgPrimaryColor} ${context.borderPrimaryColor}`}>
						
					</Box>
					<Box className={` flex flex-col w-5/6 rounded-br-3xl h-28 ${context.bgPrimaryColor} ${context.borderPrimaryColor}`}>
						<Box className="w-full flex justify-center mt-[0.15rem]">{user && <Navigation externalClicked={{ state: externalClicked, setState: setExternalClicked }} />}</Box>
					</Box>
				</Box>
			</Box>

			<CustomModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				paddingTop
				title="Nastavení"
				style="w-1/4">
				<Box>
					<Box className="flex mt-6 ml-2">
						<Typography className="mr-2 text-lg">Velikost písma:</Typography>
						<FormControl
							variant="standard"
							sx={{
								"& .MuiSelect-select": {
									backgroundColor: "transparent !important",
								},
							}}>
							<Select
								open={openTextSize}
								onClose={handleCloseTextSize}
								onOpen={handleOpenTextSize}
								value={selectedTextSize || ""}
								onChange={handleChangeTextSize}
								className="text-lg h-[2rem]"
								disableUnderline
								sx={{
									"& .MuiSelect-select": {
										display: "flex",
										alignItems: "center",
										backgroundColor: "transparent !important",
									},
								}}
								IconComponent={() => null}
								renderValue={(value) => (
									<Box className="flex items-center gap-2">
										<ButtonComp
											content={openTextSize ? IconEnum.ARROW_DROP_UP : IconEnum.ARROW_DROP_DOWN}
											style="-mt-0.5  ml-1"
											color="text-[#fff]"
											onClick={handleOpenTextSize}
											externalClicked={{ state: openTextSize, setState: setOpenTextSize }}
										/>
										<Typography
											className="text-lg"
											sx={{ opacity: 0.95 }}>
											{value === "text_size-small" && "Malá"}
											{value === "text_size-medium" && "Střední"}
											{value === "text_size-large" && "Velká"}
										</Typography>
									</Box>
								)}
								MenuProps={{
									PaperProps: {
										sx: {
											marginTop: "-0.15rem",
											marginLeft: "0.3rem",
											backgroundColor: "#1E1E1E",
											borderRadius: "0.75rem",
											borderTopLeftRadius: "0.25rem",
											fontWeight: 300,
										},
									},
									anchorOrigin: {
										vertical: "bottom",
										horizontal: "left",
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "left",
									},
								}}>
								{[
									{ value: "text_size-small", label: "Malá" },
									{ value: "text_size-medium", label: "Střední" },
									{ value: "text_size-large", label: "Velká" },
								].map((item) => (
									<MenuItem
										sx={{
											opacity: 1,
											"&.Mui-selected": {
												backgroundColor: context.colorSchemeCode === "red" ? "#4e3939" : context.colorSchemeCode === "blue" ? "#313c49" : context.colorSchemeCode === "green" ? "#284437" : "#414141",
											},
											"&.Mui-selected:hover": {
												backgroundColor: context.colorSchemeCode === "red" ? "#4e3939" : context.colorSchemeCode === "blue" ? "#313c49" : context.colorSchemeCode === "green" ? "#284437" : "#414141",
											},
										}}
										key={item.value}
										value={item.value}
										className={`px-3 py-1.5  hover:cursor-pointer transition-colors duration-150 w-full flex justify-center
													${context.bgSecondaryColor + context.bgHoverTertiaryColor}`}>
										<Typography sx={{ opacity: 0.95 }}>{item.label}</Typography>
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box className="flex mt-8 ml-2">
						<Typography className="mr-2  text-lg">Barevné schéma:</Typography>
						<FormControl
							variant="standard"
							sx={{
								"& .MuiSelect-select": {
									backgroundColor: "transparent !important",
								},
							}}>
							<Select
								open={openColorScheme}
								onClose={handleCloseColorScheme}
								onOpen={handleOpenColorScheme}
								value={selectedColorScheme || ""}
								onChange={handleChangeColorScheme}
								className="text-lg h-[2rem]"
								disableUnderline
								sx={{
									"& .MuiSelect-select": {
										display: "flex",
										alignItems: "center",
										backgroundColor: "transparent !important",
									},
								}}
								IconComponent={() => null}
								renderValue={(value) => (
									<Box className="flex items-center gap-2">
										<ButtonComp
											content={openColorScheme ? IconEnum.ARROW_DROP_UP : IconEnum.ARROW_DROP_DOWN}
											style="-mt-0.5 ml-1 "
											color="text-[#fff]"
											onClick={handleOpenColorScheme}
											externalClicked={{ state: openColorScheme, setState: setOpenColorScheme }}
										/>
										<Typography
											className="text-lg"
											sx={{ opacity: 0.95 }}>
											{value === "gray" && "Šedé"}
											{value === "red" && "Červené"}
											{value === "blue" && "Modré"}
											{value === "green" && "Zelené"}
										</Typography>
									</Box>
								)}
								MenuProps={{
									PaperProps: {
										sx: {
											marginTop: "-0.15rem",
											marginLeft: "0.3rem",
											borderRadius: "0.75rem",
											backgroundColor: "#1E1E1E",
											borderTopLeftRadius: "0.25rem",
											fontWeight: 300,
										},
									},
									anchorOrigin: {
										vertical: "bottom",
										horizontal: "left",
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "left",
									},
								}}>
								{[
									{ value: "gray", label: "Šedé" },
									{ value: "red", label: "Červené" },
									{ value: "blue", label: "Modré" },
									{ value: "green", label: "Zelené" },
								].map((item) => (
									<MenuItem
										sx={{
											opacity: 1,
											"&.Mui-selected": {
												backgroundColor: context.colorSchemeCode === "red" ? "#4e3939" : context.colorSchemeCode === "blue" ? "#313c49" : context.colorSchemeCode === "green" ? "#284437" : "#414141",
											},
											"&.Mui-selected:hover": {
												backgroundColor: context.colorSchemeCode === "red" ? "#4e3939" : context.colorSchemeCode === "blue" ? "#313c49" : context.colorSchemeCode === "green" ? "#284437" : "#414141",
											},
										}}
										key={item.value}
										value={item.value}
										className={`px-3 py-1.5  hover:cursor-pointer transition-colors duration-150 w-full flex justify-center
													${context.bgSecondaryColor + context.bgHoverTertiaryColor}`}>
										<Typography sx={{ opacity: 0.95 }}>{item.label}</Typography>
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</Box>
			</CustomModal>
		</AppBar>
	) : (
		<Box className="flex flex-col w-full max-w-content justify-center items-center mt-8">
			<Image
				className="h-[5.2rem] mr-1"
				src="/icons/logo-gray.webp"
				alt="Logo"
				width={150}
				height={150}
				priority
			/>
			<Typography className="text-[3.1rem] mt-2 h-16 font-audiowide tracking-widest">KlikFit</Typography>
		</Box>
	);
}

export default HeaderMobile;
