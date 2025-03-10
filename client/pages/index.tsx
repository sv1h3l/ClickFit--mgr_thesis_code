import { Button, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import Card from "../components/Card";

function Index() {
	const router = useRouter();

	const handleLogin = () => {
		router.push("/login");
	};

	const handleSignIn = () => {
		router.push("/registration");
	};

	return (
		<>
			<Head>
				<title>KlikFit</title>
				<meta
					name="description"
					content="KlikFit je webová aplikace pro vytváření, zobrazování a správu tréninkových plánů."
				/>
			</Head>

			<Card>
				<Typography
					variant="h5"
					component="div"
					gutterBottom>
					Chcete si vytvořit komplexní tréninkový plán během pár kliknutí? <br />
					Jste zde správně!
				</Typography>

				<div className="mt-8">
					<Typography
						variant="body1"
						color="text.secondary"
						gutterBottom>
						KlikFit je webová aplikace pro vytváření, zobrazování a správu tréninkových plánů.
					</Typography>

					<Typography
						variant="body1"
						color="text.secondary"
						gutterBottom>
						Aplikace je vhodná pro trenéry i samostatné sportovce.
					</Typography>
				</div>

				<div className="mt-8">
					<Button
						variant="contained"
						color="primary"
						className="mr-14"
						onClick={handleLogin}>
						Přihlášení
					</Button>

					<Button
						variant="outlined"
						color="primary"
						onClick={handleSignIn}>
						Registrace
					</Button>
				</div>
			</Card>
		</>
	);
}

export default Index;
