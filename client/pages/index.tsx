import GeneralCard from "@/components/large/GeneralCard";
import OneColumnPage from "@/components/large/OneColumnPage";
import ButtonComp from "@/components/small/ButtonComp";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";

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

			<OneColumnPage
				firstColumnWidth="w-5/12 "
				firstColumnHeight="h-fit"
				firstColumnChildren={
					<GeneralCard
					dontShowHr

						firstChildren={
							<Box className="flex flex-col items-center gap-2">
								<Typography className="font-light text-center">Chcete si vytvořit komplexní tréninkový plán během pár kliknutí?</Typography>
								<Typography className="mb-8 text-center text-lg">Jste zde správně!</Typography>

								<Typography className="font-light text-center">KlikFit je webová aplikace pro vytváření, zobrazování a správu tréninkových plánů.</Typography>

								<Typography className="font-light text-center">Aplikace je vhodná pro trenéry i samostatné sportovce.</Typography>

								<Box className="mt-10 flex gap-10 mb-4">
									<ButtonComp
										dontChangeOutline
										justClick
										content="Přihlášení"
										size="medium"
										onClick={() => {
											handleLogin();
										}}
									/>

									<ButtonComp
										dontChangeOutline
										justClick
										size="medium"
										content="Registrace"
										onClick={handleSignIn}
									/>
								</Box>
							</Box>
						}
					/>
				}
			/>
		</>
	);
}

export default Index;
