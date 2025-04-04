import { Button, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Card from "../components/small/Card";
import GenericApiResponse from "../api/GenericApiResponse";
import { newPasswordRequest } from "../api/residue/newPasswordRequest";

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
				const response: GenericApiResponse<null> = await newPasswordRequest({ token, password, confirmPassword });

				if (response.status === 200) {
					alert("Heslo bylo úspěšně změněno.");
					router.push("/login");
				}
			} catch (error: any) {
				console.error("Error:", error.message, "\nStatus code:", error.statusCode);

				if (error.statusCode === 400) {
					const { errors } = error;

					setErrorPassword(errors.password || "");
					setErrorConfirmPassword(errors.confirmPassword || "");
				} else if (error.statusCode === 500) {
					alert("Došlo k serverové chybě. Zkuste to znovu.");
				}
			}
		}
	};

	// Získání tokenu z URL
	useEffect(() => {
		const { token } = router.query;
		setToken(token as string);
	}, [router.query]);

	const routeToLogin = () => {
		router.push("/login");
	};

	return (
		<>
			<Head>
				<title>Nové heslo - KlikFit</title>
			</Head>

			<Card>
				<Typography
					variant="h5"
					component="div"
					gutterBottom
					style={{ textAlign: "center" }}
					className="mb-4">
					Změna hesla
				</Typography>

				<div className="max-w-sm">
					<TextField
						error={!!errorPassword}
						helperText={errorPassword}
						label="Nové heslo"
						type="password"
						fullWidth
						margin="normal"
						variant="standard"
						size="small"
						inputRef={passwordRef}
						className="h-14"
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
						fullWidth
						margin="normal"
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

					<Button
						variant="contained"
						color="primary"
						onClick={newPassword}>
						Změnit heslo
					</Button>
				</div>
			</Card>
		</>
	);
};

export default NewPassword;
