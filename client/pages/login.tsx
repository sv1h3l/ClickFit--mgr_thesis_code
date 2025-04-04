// pages/login.tsx
import { Button, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Card from "../components/small/Card";
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

			<Card>
				<Typography
					variant="h5"
					component="h2"
					gutterBottom
					className="mb-0">
					Přihlášení
				</Typography>

				<TextField
					label="Email"
					fullWidth
					margin="normal"
					variant="standard"
					value={email}
					size="small"
					onChange={(e) => setEmail(e.target.value)}
				/>

				<TextField
					label="Heslo"
					type="password"
					fullWidth
					margin="normal"
					variant="standard"
					value={password}
					size="small"
					disabled={isAccountConfirmed}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<div className="flex justify-end mt-1">
					<Button
						variant="text"
						color="secondary"
						onClick={handleForgotPassword}
						className="relative bottom-3 ml-auto py-0 px-1 mb-1"
						disabled={isAccountConfirmed}>
						Zapomenuté heslo
					</Button>
				</div>

				<Typography
					variant="body2"
					component="p"
					className="h-6 text-red-600">
					{errorEmailAndPassword}
				</Typography>

				<Button
					variant="contained"
					color="primary"
					onClick={isAccountConfirmed ? sendConfirmationEmail : handleLogin}>
					{isAccountConfirmed ? "Zaslat potvrzovací email" : "Přihlásit"}
				</Button>
			</Card>
		</>
	);
}

export default Login;
