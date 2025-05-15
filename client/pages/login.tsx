// pages/login.tsx
import { getUserSettingsReq } from "@/api/get/getUserSettingsReq";
import GeneralCard from "@/components/large/GeneralCard";
import OneColumnPage from "@/components/large/OneColumnPage";
import ButtonComp, { IconEnum } from "@/components/small/ButtonComp";
import CustomModal from "@/components/small/CustomModal";
import { useAppContext } from "@/utilities/Context";
import { Box, Button, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { emailVerificationRequest } from "../api/residue/emailVerificationRequest";
import { loginRequest } from "../api/residue/loginRequest";

const cookie = require("cookie");

function Login() {
	const context = useAppContext();

	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorEmailAndPassword, setErrorEmailAndPassword] = useState<string>("");

	const errorMessage = "Neplatná emailová adresa nebo heslo";

	const [isAccountConfirmed, setIsAccountConfirmed] = useState(false);

	const handleLogin = async () => {
		const emailTemp = email;
		const passwordTemp = password;

		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (passwordTemp.length < 8 || !emailRegex.test(emailTemp)) {
			setErrorEmailAndPassword(errorMessage);
			return;
		}

		try {
			await loginRequest({
				email,
				password,
			});

			const cookies = cookie.parse(document.cookie);
			const authToken = cookies.authToken || null;

			const settings = await getUserSettingsReq({ authToken });

			if (settings.status === 200 && settings.data) {
				const textSizeCode = settings.data.textSizeCode;
				const colorSchemeCode = settings.data.colorSchemeCode;

				document.cookie = `text_size=${textSizeCode}; path=/; max-age=${60 * 60 * 24 * 90};`;
				document.cookie = `color_scheme=${colorSchemeCode}; path=/; max-age=${60 * 60 * 24 * 90};`;

				context.setTextSize(textSizeCode === 2 ? "text_size-small" : textSizeCode === 4 ? "text_size-large" : "text_size-medium");
				context.setColors(colorSchemeCode === 2 ? "red" : colorSchemeCode === 3 ? "blue" : colorSchemeCode === 4 ? "green" : "gray");
			}

			if (cookies.cc) router.push("/connection?cc=" + cookies.cc);
			else router.push("/training-plans");
		} catch (error: any) {
			console.error("Error:", error.message, "\nStatus code:", error.status);

			if (error.status === 401) {
				setErrorEmailAndPassword(error.message);
			} else if (error.status === 403) {
				setErrorEmailAndPassword(error.message);
				setIsAccountConfirmed(true);
			} else if (error.status === 500) {
				alert(error.message);
			}
		}
	};

	const sendConfirmationEmail = async () => {
		const emailTemp = email;
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (!emailRegex.test(emailTemp)) {
			setErrorEmailAndPassword(errorMessage); // TODO opravit nnávratovou hodnotu z API
			return;
		}

		try {
			await emailVerificationRequest({
				email,
			});

			setIsModalOpen(true);
		} catch (error) {
			console.error("Error sending confirmation email:", error);
		}
	};

	const handleForgotPassword = () => {
		router.push("/forgotten-password");
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

	useEffect(() => {
		const cookies = cookie.parse(document.cookie);

		const ccModOpened = cookies["cc-mod-opened"];

		if (cookies.cc && !ccModOpened) {
			document.cookie = cookie.serialize("cc-mod-opened", "1", {
				path: "/",
				maxAge: 60 * 60 * 24,
			});

			setIsConnectionModalOpen(true);
		}
	}, [router.query.cc]);

	return (
		<>
			<Head>
				<title>Přihlášení - KlikFit</title>
			</Head>

			<OneColumnPage
				firstColumnWidth="w-full max-w-lg"
				firstColumnHeight="h-fit"
				firstColumnChildren={
					<>
						<GeneralCard
							centerFirstTitle
							style="relative"
							prolog
							dontShowHr
							firstTitle="Přihlášení"
							firstChildren={
								<Box className="flex flex-col items-center gap-1 pr-3">
									<TextField
										className="w-full mb-8 "
										label="E-mail"
										variant="standard"
										value={email}
										size="small"
										onChange={(e) => setEmail(e.target.value)}
									/>

									<TextField
										className="w-full "
										label="Heslo"
										type="password"
										variant="standard"
										value={password}
										size="small"
										disabled={isAccountConfirmed}
										onChange={(e) => setPassword(e.target.value)}
									/>

									<Button
										disableRipple
										onClick={handleForgotPassword}
										className=" bottom-1 ml-auto py-0 px-1 mb-4 text-[#dCdCdC] normal-case"
										disabled={isAccountConfirmed}>
										Zapomenuté heslo
									</Button>

									<Typography className="h-6 mt-2 text-red-icon">{errorEmailAndPassword}</Typography>

									<ButtonComp
										style="mb-4"
										dontChangeOutline
										justClick
										size="medium"
										content={isAccountConfirmed ? "Zaslat potvrzovací email" : "Přihlásit se"}
										onClick={isAccountConfirmed ? sendConfirmationEmail : handleLogin}
									/>

									<ButtonComp
										content={IconEnum.BACK}
										justClick
										dontChangeOutline
										size="small"
										style="absolute left-3 top-3"
										onClick={() => {
											router.push("/");
										}}
									/>
								</Box>
							}
						/>

						<CustomModal
							isOpen={isModalOpen}
							title="Potvrzovací e-mail odeslán"
							hideBackButton
							style="w-full px-4 max-w-md"
							children={
								<Box className=" mb-4 ">
									<Typography className="">Na zadaný e-mail byl odeslán potvrzovací odkaz.</Typography>
									<Typography className="mt-3">Pro vstup do aplikace KlikFit je potřeba registraci potvrdit.</Typography>

									<ButtonComp
										style="mx-auto mt-9"
										size="medium"
										content={"Návrat na hlavní stránku"}
										onClick={() => {
											setIsModalOpen(false);
											router.push("/");
										}}
									/>
								</Box>
							}
						/>

						<CustomModal
							isOpen={isConnectionModalOpen}
							title="Navázání spojení"
							hideBackButton
							style="w-full px-4 max-w-md"
							children={
								<Box className=" mb-4 ">
									<Typography className="">Pro navázání nového spojení je nutné se přihlásit.</Typography>

									<ButtonComp
										style="mx-auto mt-9"
										size="medium"
										content={"Pokračovat"}
										onClick={() => {
											setIsConnectionModalOpen(false);
										}}
									/>
								</Box>
							}
						/>
					</>
				}
			/>
		</>
	);
}

export default Login;
