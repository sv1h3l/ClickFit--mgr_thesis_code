import { Button, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import GenericApiResponse from "./api/GenericApiResponse";
import { verifyEmailRequest } from "./api/verifyEmailRequest";

const Verification = () => {
	const router = useRouter();
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Funkce pro ověření tokenu
	const verifyEmail = async (token: string) => {
		try {
			const data: GenericApiResponse<null> = await verifyEmailRequest(token);

			setStatusMessage(data.message);
		} catch (error) {
			if (error instanceof Error) {
				setStatusMessage(error.message);
			} else {
				setStatusMessage("Nastala neznámá chyba.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Získání tokenu z URL
	useEffect(() => {
		const { token } = router.query;
		if (token) {
			verifyEmail(token as string);
		} else {
			setStatusMessage("Chyba při ověřování tokenu.");
			setIsLoading(false);
		}
	}, [router.query]);

	const routeToLogin = () => {
		router.push("/login");
	};

	return (
		<>
			<Head>
				<title>Verifikace - KlikFit</title>
			</Head>

			<Card>
				<Typography
					variant="h5"
					component="div"
					gutterBottom
					style={{ textAlign: "center" }}
					className="mb-4">
					Verifikace
				</Typography>

				<div className="max-w-sm">
					<Typography
						variant="body1"
						component="div"
						style={{ textAlign: "center" }}
						className="mb-4">
						{isLoading ? "Načítání..." : statusMessage}
					</Typography>

					<Button
						variant="contained"
						color="primary"
						onClick={routeToLogin}
						disabled={isLoading}>
						Přihlásit se
					</Button>
				</div>
			</Card>
		</>
	);
};

export default Verification;
