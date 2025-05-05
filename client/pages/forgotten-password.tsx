import GeneralCard from "@/components/large/GeneralCard";
import OneColumnPage from "@/components/large/OneColumnPage";
import ButtonComp, { IconEnum } from "@/components/small/ButtonComp";
import { Box, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { forgottenPasswordRequest } from "../api/residue/forgottenPasswordRequest";

function ForgotPassword() {
	const router = useRouter();
	const [email, setEmail] = useState("");

	const [errorEmail, setErrorEmail] = useState<string>("");
	const errorMessage = "Neplatná emailová adresa";

	const sendEmailWithNewPassword = async () => {
		const emailTemp = email;
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (!emailRegex.test(emailTemp)) {
			setErrorEmail(errorMessage);
			return;
		}

		try {
			await forgottenPasswordRequest({
				email,
			});

			router.push("/");
		} catch (error: any) {
			console.error("Error:", error.message, "\nStatus code:", error.status);

			if (error.status === 500) {
				alert(error.message);
			} else {
				setErrorEmail(error.message);
			}
		}
	};

	return (
		<>
			<Head>
				<title>Zapomenuté heslo - KlikFit</title>
				<meta
					name="description"
					content="Obnovte své zapomenuté heslo pro KlikFit."
				/>
			</Head>

			<OneColumnPage
				firstColumnWidth="w-7/24 "
				firstColumnHeight="h-fit"
				firstColumnChildren={
					<GeneralCard
						centerFirstTitle
						prolog
						dontShowHr
						style="relative"
						firstTitle="Zapomenuté heslo"
						firstChildren={
							<Box className="flex flex-col items-center gap-2 pr-3">
								<Typography className="text-center font-light">Na zadaný email bude odeslán odkaz pro vytvoření nového hesla.</Typography>

								<TextField
									className="w-full mt-4 mb-6 h-16"
									error={!!errorEmail}
									helperText={errorEmail}
									placeholder="Email"
									type="email"
									variant="standard"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onBlur={() => {
										const tempEmail = email;
										const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

										setErrorEmail(emailRegex.test(tempEmail) ? "" : errorMessage);
									}}
								/>

								<ButtonComp
									style="mb-4"
									dontChangeOutline
									justClick
									size="medium"
									content="Odeslat odkaz"
									onClick={sendEmailWithNewPassword}
								/>

								<ButtonComp
									content={IconEnum.BACK}
									justClick
									dontChangeOutline
									size="small"
									style="absolute left-3 top-3"
									onClick={() => {
										router.push("/login");
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

export default ForgotPassword;
