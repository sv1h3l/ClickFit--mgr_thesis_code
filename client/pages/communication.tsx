import GeneralCard from "@/components/large/GeneralCard";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import Head from "next/head";

function Communication() {
	return (
		<>
			<Head>
				<title>Komunikace - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-1/3"
				secondColumnWidth="w-1/3"
				secondColumnHeight="h-1/2"
				firstColumnChildren={
					<GeneralCard
						firstTitle="Navázaná spojení"
						height="h-full"
						border
						firstChildren={<></>}
					/>
				}
				secondColumnChildren={
					<GeneralCard
						firstTitle="Nová spojení"
						height="h-full"
						firstChildren={<></>}
					/>
				}
			/>
		</>
	);
}

export default Communication;
