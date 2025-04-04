import { getSportsReq, Sport } from "@/api/get/getSportsReq";
import DiaryAndGraphs from "@/components/large/DiaryAndGraphs";
import Sports from "@/components/large/Sports";
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

	return (
		<>
			<Head>
				<title>Deník - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-2/6"
				secondColumnWidth="w-4/6"
				firstColumnChildren={
					<Sports
						selectedSport={{
							state: selectedSport,
							setState: setSelectedSport,
						}}
						sportsData={{
							state: sportsData,
							setState: setSportsData,
						}}
					/>
				}
				secondColumnChildren={
					<DiaryAndGraphs
						selectedSport={{
							state: selectedSport,
							setState: setSelectedSport,
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
