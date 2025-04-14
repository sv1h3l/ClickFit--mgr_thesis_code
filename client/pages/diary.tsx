import { getSportsReq, Sport } from "@/api/get/getSportsReq";
import DiaryAndGraphs, { Graph } from "@/components/large/DiaryAndGraphs";
import SportsAndValues from "@/components/large/SportsAndValues";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";

const cookie = require("cookie");

interface Props {
	sports: Sport[];
}

const Diary = (props: Props) => {
	const [sportsData, setSportsData] = useState<Sport[]>(props.sports ?? []);

	const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
	const [selectedGraph, setSelectedGraph] = useState<Graph | null>(null);

	const [isSelectedFirstSection, setIsSelectedFirstSection] = useState(true);
	const [isDisabledFirstSection, setIsDisabledFirstSection] = useState(false);

	return (
		<>
			<Head>
				<title>Deník - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-9/24"
				secondColumnWidth="w-15/24"
				firstColumnChildren={
					<SportsAndValues
						isSelectedFirstSection={{ state: isSelectedFirstSection, setState: setIsSelectedFirstSection }}
						isDisabledFirstSection={{ state: isDisabledFirstSection, setState: setIsDisabledFirstSection }}

						selectedSport={{
							state: selectedSport,
							setState: setSelectedSport,
						}}
						sportsData={{
							state: sportsData,
							setState: setSportsData,
						}}
						selectedGraph={{
							state: selectedGraph,
							setState: setSelectedGraph,
						}}
					/>
				}
				secondColumnChildren={
					<DiaryAndGraphs
						isSelectedFirstSection={{ state: isSelectedFirstSection, setState: setIsSelectedFirstSection }}
						isDisabledFirstSection={{ state: isDisabledFirstSection, setState: setIsDisabledFirstSection }}
						selectedSport={{
							state: selectedSport,
							setState: setSelectedSport,
						}}
						selectedGraph={{
							state: selectedGraph,
							setState: setSelectedGraph,
						}}
					/>
				}
			/>
		</>
	);
};

export default Diary;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	const handleError = (error: any) => {
		console.error("Error fetching sports data:", error);
		return { props: { sports: [] } };
	};

	try {
		const cookies = cookie.parse(context.req.headers.cookie || "");
		const authToken = cookies.authToken || null;

		const response = await getSportsReq({ authToken });

		if (response.status === 200) {
			return { props: { sports: response.data } };
		} else {
			return { props: { sports: [] } };
		}
	} catch (error) {
		return handleError(error);
	}
};
