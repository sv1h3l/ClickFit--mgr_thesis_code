import { TextSize, useAppContext } from "@/utilities/Context";
import { AppBar, Box, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import CustomModal from "../small/CustomModal";
import Navigation from "./Navigation";

const cookie = require("cookie");

function Header() {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("cs-CZ"));
	const [externalClicked, setExternalClicked] = useState(false);

	const [externalSettingsClicked, setExternalSettingsClicked] = useState(false);

	const context = useAppContext();

	useEffect(() => {
		// Tato funkce se zavolá při každé změně cookies
		const checkUserCookie = () => {
			const cookies = cookie.parse(document.cookie);
			const authToken = cookies.authToken || null; // Retrieve the userEmail cookie if available

			if (authToken) {
				setUser(authToken);
			}
		};

		checkUserCookie(); // Zavoláme ihned po mountu

		// Sledování změn cookies každých 10ms
		const interval = setInterval(checkUserCookie, 10);
		return () => clearInterval(interval); // Po odpojení komponenty zastavíme interval
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date().toLocaleTimeString("cs-CZ"));
		}, 1000);

		return () => clearInterval(interval);
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

	const handleChangeColorScheme = (event: SelectChangeEvent<string>) => {
		const colorScheme = event.target.value as ColorScheme;

		if (["gray", "red", "green", "blue"].includes(colorScheme)) {
			setSelectedColorScheme(colorScheme);
			context.setColors(colorScheme);
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

	const handleChangeTextSize = (event: SelectChangeEvent<string>) => {
		const textSize = event.target.value as TextSize;

		if (["text_size-small", "text_size-medium", "text_size-large"].includes(textSize)) {
			setSelectedTextSize(textSize);
			context.setTextSize(textSize);
		}

		handleCloseTextSize();
	};

	return user ? (
		<AppBar className="bg-transparent shadow-none text-center relative">
			<Box className="justify-center px-1">
				<Box className="flex w-full max-w-content">
					<Box className={`w-1/6 justify-center items-center flex border-l-[3px] border-b-[3px] rounded-bl-3xl h-28 ${context.bgPrimaryColor} ${context.borderPrimaryColor}`}>
						<Image
							className="w-auto h-[5.2rem]"
							src={context.logoColor}
							alt="Logo"
							width={150}
							height={150}
							priority
						/>
					</Box>
					<Box className={` flex flex-col w-5/6 rounded-br-3xl h-28 ${context.bgPrimaryColor} ${context.borderPrimaryColor}`}>
						<Box className="flex items-center ">
							<Typography className="w-full text-center text-[3rem] -mt-1 h-16 font-audiowide tracking-widest">KlikFit</Typography>

							<Box className={`w-6/24 h-full flex items-center justify-center border-r-[3px] mt-0.5  ${context.bgPrimaryColor} ${context.borderPrimaryColor}`}>
								{user && (
									<Box className="flex w-full justify-end px-6 gap-6 ">
										<ButtonComp
											style=""
											size="medium"
											content={IconEnum.PROFILE}
											externalClicked={{ state: externalClicked, setState: setExternalClicked }}
											onClick={() => {
												router.push(`/profile`);
											}}
										/>

										<ButtonComp
											style=""
											size="medium"
											externalClicked={{ state: externalSettingsClicked, setState: setExternalSettingsClicked }}
											content={IconEnum.SETTINGS}
											onClick={handleOpenModal}
										/>

										<ButtonComp
											style=""
											size="medium"
											content={IconEnum.LOGOUT}
											onClick={handleLogout}
										/>
									</Box>
								)}
							</Box>
						</Box>
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
										<Typography className="text-lg" sx={{ opacity: 0.95 }}>
											{value === "text_size-small" && "Malá"}
											{value === "text_size-medium" && "Střední"}
											{value === "text_size-large" && "Velká"}
										</Typography>
									</Box>
								)}
								MenuProps={{
									PaperProps: {
										sx: {
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
										key={item.value}
										value={item.value}
										className="px-3 py-1.5 hover:bg-[#2a2a2a] hover:cursor-pointer transition-colors duration-150">
										{item.label}
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
										<Typography  className="text-lg" sx={{ opacity: 0.95 }}>
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
											backgroundColor: "#1E1E1E", // stejné jako bg-secondary_color-neutral
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
									{ value: "gray", label: "Šedé" },
									{ value: "red", label: "Červené" },
									{ value: "blue", label: "Modré" },
									{ value: "green", label: "Zelené" },
								].map((item) => (
									<MenuItem
										key={item.value}
										value={item.value}
										className="px-3 py-1.5 hover:bg-[#2a2a2a] hover:cursor-pointer transition-colors duration-150">
										{item.label}
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

export default Header;
