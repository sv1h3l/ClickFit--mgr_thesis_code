import TightTwoColumnsPage from "@/components/TightTwoColumnsPage";
import Head from "next/head";
import Layout from "../components/Layout";

function Communication() {
	return (
		<>
			<Head>
				<title>Komunikace - KlikFit</title>
			</Head>

			<Layout isWide>
				<TightTwoColumnsPage
					firstColumnChildren={<span>první</span>}
					secondColumnChildren={<span> druhý sloupec</span>}
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
