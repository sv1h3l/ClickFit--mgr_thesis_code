import GeneralCard from "@/components/large/GeneralCard";
import ButtonComp from "@/components/small/ButtonComp";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { verifyEmailRequest } from "../api/residue/verifyEmailRequest";
import OneColumnPage from "@/components/large/OneColumnPage";

// HACK complete
const Verification = () => {
	const router = useRouter();
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [verified, setVerified] = useState(false);

	// Funkce pro ověření tokenu
	const verifyEmail = async (token: string) => {
		try {
			const res = await verifyEmailRequest(token);

			if (res.status === 200) setVerified(true);

			setStatusMessage(res.message);
		} catch (error) {
			setStatusMessage("Nastala neznámá chyba. Pokuste se ověření zopakovat.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!router.isReady) return;

		const { token } = router.query;

		if (token && typeof token === "string") {
			verifyEmail(token);
		} else {
			setStatusMessage("Chyba při ověřování tokenu.");
			setIsLoading(false);
		}
	}, [router.isReady, router.query]);

	return (
		<>
			<Head>
				<title>Verifikace - KlikFit</title>
			</Head>

			<OneColumnPage
				firstColumnWidth="w-full max-w-lg"
				firstColumnHeight="h-fit"
				firstColumnChildren={
					<GeneralCard
						centerFirstTitle
						prolog
						dontShowHr
						firstTitle="Ověření registrace"
						firstChildren={
							<Box className={`flex flex-col items-center ${""}`}>
								<Typography
									className="mt-2 mb-10">
									{isLoading ? "Načítání..." : statusMessage}
								</Typography>


								<ButtonComp
									disabled={isLoading}
									content={verified ? "Přihlásit se" : "Přejít na úvodní stránku"}
									size="medium"
									style="mb-4"
									justClick
									dontChangeOutline
									onClick={() => {
										if (verified) {
											router.push("/login");
										} else {
											router.push("/");
										}
									}}
								/>
							</Box>
						}
					/>
				}
			/>
		</>
	);
};

export default Verification;
