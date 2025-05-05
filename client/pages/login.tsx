// pages/login.tsx
import GeneralCard from "@/components/large/GeneralCard";
import OneColumnPage from "@/components/large/OneColumnPage";
import ButtonComp, { IconEnum } from "@/components/small/ButtonComp";
import { Box, Button, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { emailVerificationRequest } from "../api/residue/emailVerificationRequest";
import { loginRequest } from "../api/residue/loginRequest";

function Login() {
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

			router.push("/training-plans");
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

			console.log("Sending confirmation email to:", email);
		} catch (error) {
			console.error("Error sending confirmation email:", error);
		}
	};

	const handleForgotPassword = () => {
		router.push("/forgotten-password");
	};

	return (
		<>
			<Head>
				<title>Přihlášení - KlikFit</title>
			</Head>

			<OneColumnPage
				firstColumnWidth="w-7/24 "
				firstColumnHeight="h-fit"
				firstColumnChildren={
					<GeneralCard
						centerFirstTitle
						style="relative"
						prolog
						dontShowHr
						firstTitle="Přihlášení"
						firstChildren={
							<Box className="flex flex-col items-center gap-2 pr-3">
								<TextField
									className="w-full mb-8 mt-4"
									placeholder="Email"
									variant="standard"
									value={email}
									size="small"
									onChange={(e) => setEmail(e.target.value)}
								/>

								<TextField
									className="w-full "
									placeholder="Heslo"
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

								<Typography className="h-6 text-red-icon">{errorEmailAndPassword}</Typography>

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
				}
			/>
		</>
	);
}

export default Login;
