import checkLoggedUser from "@/components/CheckLoggedUser";
import { Button, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Card from "../components/Card";
import { forgottenPasswordRequest } from "./api/forgottenPasswordRequest";

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

			<Card>
				<Typography
					variant="h5"
					component="h2"
					gutterBottom
					style={{ textAlign: "center" }}
					className="mb-0">
					Zapomenuté heslo
				</Typography>

				<Typography
					variant="body2"
					component="p"
					gutterBottom
					style={{ textAlign: "center" }}
					color="text.secondary"
					className="mb-0">
					Na email bude zaslán odkaz pro vytvoření nového hesla.
				</Typography>

				<TextField
					error={!!errorEmail}
					helperText={errorEmail}
					label="Email"
					type="email"
					fullWidth
					margin="normal"
					variant="standard"
					value={email}
					className="mb-6 h-16"
					onChange={(e) => setEmail(e.target.value)}
					onBlur={() => {
						const tempEmail = email;
						const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

						setErrorEmail(emailRegex.test(tempEmail) ? "" : errorMessage);
					}}
				/>

				<Button
					variant="contained"
					color="primary"
					onClick={sendEmailWithNewPassword}>
					Odeslat
				</Button>
			</Card>
		</>
	);
}

export default checkLoggedUser(ForgotPassword);
