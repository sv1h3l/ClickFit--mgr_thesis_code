import GeneralCard from "@/components/GeneralCard";
import TwoColumnsPage from "@/components/TwoColumnsPage";
import Head from "next/head";
import Layout from "../components/Layout";

function Communication() {
	return (
		<>
			<Head>
				<title>Komunikace - KlikFit</title>
			</Head>

			<Layout isWide>
				<TwoColumnsPage
					firstColumnWidth="w-1/3"
					secondColumnWidth="w-1/3"
					secondColumnHeight="h-1/2"
					firstColumnChildren={
						<GeneralCard
							title="Navázaná spojení"
							height="h-full"
							border>
							<></>
						</GeneralCard>
					}
					secondColumnChildren={
						<GeneralCard
							title="Nová spojení"
							height="h-full"
							>
							<></>
						</GeneralCard>
					}
				/>
				{/*<div className="flex justify-center items-center h-screen">
					<Connections>
						<Typography>Josef Štěpán</Typography>
						<Typography>Bronislav Sobotka</Typography>
						<Typography>Karel Nedvěd</Typography>
						<Typography>Karel Medvěd</Typography>
						<Typography>Petr Kam</Typography>
						<Typography>Ralph Lauren</Typography>
						<Typography>Jakub Vlček</Typography>
					</Connections>

					<QR />
				</div>*/}
			</Layout>
		</>
	);
}

export default Communication;
