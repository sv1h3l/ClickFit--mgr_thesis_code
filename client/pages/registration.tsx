import GeneralCard from "@/components/large/GeneralCard";
import OneColumnPage from "@/components/large/OneColumnPage";
import ButtonComp, { IconEnum } from "@/components/small/ButtonComp";
import { Box, TextField } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { registerRequest } from "../api/residue/registerRequest";

function Registration() {
	const router = useRouter();

	/**  Refs pro uchování hodnot formulářových polí */
	const nameRef = useRef<HTMLInputElement>(null);
	const surnameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);

	/** States pro zobrazování chyb ve formulářových polích */
	const [errorName, setErrorName] = useState<string>("");
	const [errorSurname, setErrorSurname] = useState<string>("");
	const [errorEmail, setErrorEmail] = useState<string>("");
	const [errorPassword, setErrorPassword] = useState<string>("");
	const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>("");

	/** Consts obsahující texty pro chybová hlášení formulářových polí */
	const errorNameText = "Jméno nesmí být prázdné";
	const errorSurnameText = "Příjmení nesmí být prázdné";
	const errorEmailText1 = "Emailová adresa nesmí být prázdná";
	const errorEmailText2 = "Neplatná emailová adresa";
	const errorPasswordText = "Heslo musí obsahovat alespoň 8 znaků";
	const errorConfirmPasswordText = "Hesla se neshodují";

	const handleRegistration = async () => {
		const name = nameRef.current?.value || "";
		const surname = surnameRef.current?.value || "";
		const email = emailRef.current?.value || "";
		const password = passwordRef.current?.value || "";
		const confirmPassword = confirmPasswordRef.current?.value || "";

		let dontFetch = false;

		if (!email) {
			setErrorEmail(errorEmailText1), (dontFetch = true);
		} else {
			const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			if (!emailRegex.test(email)) {
				setErrorEmail(errorEmailText2);
				dontFetch = true;
			} else {
				setErrorEmail("");
			}
		}

		!name && (setErrorName(errorNameText), (dontFetch = true));
		!surname && (setErrorSurname(errorSurnameText), (dontFetch = true));
		password.length < 8 && (setErrorPassword(errorPasswordText), (dontFetch = true));
		password !== confirmPassword && (setErrorConfirmPassword(errorConfirmPasswordText), (dontFetch = true));

		if (dontFetch) return;
		else {
			try {
				await registerRequest({
					name,
					surname,
					email,
					password,
					confirmPassword,
				});

				router.push("/");
			} catch (error: any) {
				console.error("Error:", error.message, "\nStatus code:", error.statusCode);

				if (error.statusCode === 400) {
					const { errors } = error;

					setErrorName(errors.name || "");
					setErrorSurname(errors.surname || "");
					setErrorEmail(errors.email || "");
					setErrorPassword(errors.password || "");
					setErrorConfirmPassword(errors.confirmPassword || "");
				} else if (error.statusCode === 500) {
					alert("Došlo k serverové chybě. Zkuste to znovu.");
				}
			}
		}
	};

	return (
		<>
			<Head>
				<title>Registrace - KlikFit</title>
			</Head>

			<OneColumnPage
				firstColumnWidth="w-7/24 "
				firstColumnHeight="h-fit"
				firstColumnChildren={
					<GeneralCard
						dontShowHr
						prolog
						centerFirstTitle
						style={`relative `}
						firstTitle="Registrace"
						firstChildren={
							<Box className="flex flex-col items-center gap-2 pr-3">
								<div className="max-w-sm">
									<div className="flex flex-no-wrap gap-10 mt-4">
										<TextField
											error={!!errorName}
											helperText={errorName}
											placeholder="Jméno"
											type=""
											variant="standard"
											size="small"
											fullWidth
											inputRef={nameRef}
											className="h-14 "
											inputProps={{ maxLength: 20 }}
											onKeyDown={(e) => {
												if (e.key === " ") {
													e.preventDefault(); // Zabránění vložení mezery
												}
											}}
											onBlur={() => {
												const name = nameRef.current?.value || "";
												setErrorName(!name ? errorNameText : "");
											}}
										/>

										<TextField
											error={!!errorSurname}
											helperText={errorSurname}
											placeholder="Přijmení"
											type=""
											variant="standard"
											size="small"
											fullWidth
											inputRef={surnameRef}
											className="h-14 mb-6"
											inputProps={{ maxLength: 20 }}
											onKeyDown={(e) => {
												if (e.key === " ") {
													e.preventDefault();
												}
											}}
											onBlur={() => {
												const surname = surnameRef.current?.value || "";
												setErrorSurname(!surname ? errorSurnameText : "");
											}}
										/>
									</div>

									<TextField
										error={!!errorEmail}
										helperText={errorEmail}
										placeholder="Email"
										type="email"
										fullWidth
										variant="standard"
										size="small"
										inputRef={emailRef}
										className="h-14 mb-6"
										inputProps={{ maxLength: 40 }}
										onKeyDown={(e) => {
											if (e.key === " ") {
												e.preventDefault();
											}
										}}
										onBlur={() => {
											const email = emailRef.current?.value || "";

											if (!email) {
												setErrorEmail(errorEmailText1);
											} else {
												const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
												if (!emailRegex.test(email)) {
													setErrorEmail(errorEmailText2);
												} else {
													setErrorEmail("");
												}
											}
										}}
									/>

									<TextField
										error={!!errorPassword}
										helperText={errorPassword}
										placeholder="Heslo"
										type="password"
										fullWidth
										variant="standard"
										size="small"
										inputRef={passwordRef}
										className="h-14 mb-6"
										inputProps={{ maxLength: 40 }}
										onBlur={() => {
											const password = passwordRef.current?.value || "";
											setErrorPassword(password.length < 8 ? errorPasswordText : "");

											const confirmPassword = confirmPasswordRef.current?.value || "";
											setErrorConfirmPassword(confirmPassword !== "" && password !== confirmPassword ? errorConfirmPasswordText : "");
										}}
									/>

									<TextField
										error={!!errorConfirmPassword}
										helperText={errorConfirmPassword}
										placeholder="Potvrzení hesla"
										type="password"
										fullWidth
										variant="standard"
										size="small"
										className="h-14 mb-8"
										inputRef={confirmPasswordRef}
										inputProps={{ maxLength: 40 }}
										onBlur={() => {
											const password = passwordRef.current?.value || "";
											const confirmPassword = confirmPasswordRef.current?.value || "";
											setErrorConfirmPassword(password !== confirmPassword ? errorConfirmPasswordText : "");
										}}
									/>
								</div>

								<ButtonComp
									style="mb-4"
									dontChangeOutline
									justClick
									size="medium"
									content="Registrovat se"
									onClick={handleRegistration}
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

export default Registration;
