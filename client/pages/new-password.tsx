import { consoleLogPrint } from "@/api/GenericApiResponse";
import { newPasswordReq } from "@/api/residue/newPasswordReq";
import GeneralCard from "@/components/large/GeneralCard";
import OneColumnPage from "@/components/large/OneColumnPage";
import ButtonComp, { IconEnum } from "@/components/small/ButtonComp";
import CustomModal from "@/components/small/CustomModal";
import { Box, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const NewPassword = () => {
	const router = useRouter();

	const [token, setToken] = useState<string>("");

	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);

	const [errorPassword, setErrorPassword] = useState<string>("");
	const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>("");

	const errorPasswordText = "Heslo musí obsahovat alespoň 8 znaků";
	const errorConfirmPasswordText = "Hesla se neshodují";

	// Funkce pro ověření tokenu
	const newPassword = async () => {
		const password = passwordRef.current?.value || "";
		const confirmPassword = confirmPasswordRef.current?.value || "";

		let dontFetch = false;
		password.length < 8 && (setErrorPassword(errorPasswordText), (dontFetch = true));
		password !== confirmPassword && (setErrorConfirmPassword(errorConfirmPasswordText), (dontFetch = true));

		if (dontFetch) return;
		else {
			try {
				const response = await newPasswordReq({ token, password, confirmPassword });

				if (response.status === 200) {
					setIsModalOpen(true);
				} else {
					if (response.data?.tokenHelperText !== "") {
						setErrorPassword(response.data?.tokenHelperText || "");
					} else {
						setErrorPassword(response.data?.passwordHelperText || "");
						setErrorConfirmPassword(response.data?.confirmPasswordHelperText || "");
					}
				}

				consoleLogPrint(response);
			} catch (error) {
				console.error("Error: ", error);
			}
		}
	};

	// Získání tokenu z URL
	useEffect(() => {
		const { token } = router.query;
		setToken(token as string);
	}, [router.query]);


	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Head>
				<title>Nové heslo - KlikFit</title>
			</Head>

			<OneColumnPage
				firstColumnWidth="w-7/24 "
				firstColumnHeight="h-fit"
				firstColumnChildren={
					<>
						<GeneralCard
							dontShowHr
							prolog
							centerFirstTitle
							style="relative "
							firstTitle="Změna hesla"
							firstChildren={
								<Box className="flex flex-col items-center gap-1 pr-3 -mt-1">
									<TextField
										className="h-14 w-full  mb-5"
										error={!!errorPassword}
										helperText={errorPassword}
										label="Nové heslo"
										type="password"
										variant="standard"
										size="small"
										inputRef={passwordRef}
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
										label="Potvrzení nového hesla"
										type="password"
										variant="standard"
										size="small"
										className="h-14 mb-8 w-full"
										inputRef={confirmPasswordRef}
										inputProps={{ maxLength: 40 }}
										onBlur={() => {
											const password = passwordRef.current?.value || "";
											const confirmPassword = confirmPasswordRef.current?.value || "";
											setErrorConfirmPassword(password !== confirmPassword ? errorConfirmPasswordText : "");
										}}
									/>

									<ButtonComp
										style="mb-4"
										dontChangeOutline
										justClick
										size="medium"
										content="Změnit heslo"
										onClick={newPassword}
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
							title="Heslo bylo změněno"
							hideBackButton
							children={
								<Box className=" mb-4 max-w-md">
									<Typography className="">Nové heslo bylo úspěšně nastaveno.</Typography>
									<Typography className="mt-3">Nyní se můžete přihlásit ke svému účtu.</Typography>

									<ButtonComp
										style="mx-auto mt-9"
										size="medium"
										content={"Přejít k přihlášení"}
										onClick={() => {
											setIsModalOpen(false);
											router.push("/login");
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
};

export default NewPassword;
