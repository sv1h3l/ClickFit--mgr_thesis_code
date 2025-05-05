import { getSportsReq, Sport } from "@/api/get/getSportsReq";
import { getVisitedUserSportsReq } from "@/api/get/getVisitedUserSportsReq";
import DiaryAndGraphs, { Graph } from "@/components/large/DiaryAndGraphs";
import SportsAndValues from "@/components/large/SportsAndValues";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";

const cookie = require("cookie");

interface Props {
	sports: Sport[];

	selectedSport: Sport | null;
}

const Diary = (props: Props) => {
	const [sportsData, setSportsData] = useState<Sport[]>(props.sports ?? []);

	const [selectedSport, setSelectedSport] = useState<Sport | null>(props.selectedSport);
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

		const visitedUserId = cookies.dr_tmp ? Number(atob(cookies.dr_tmp)) : -1;
		const authToken = cookies.authToken || null;

		if (visitedUserId > 0) {
			const resVisitedUser = await getVisitedUserSportsReq({ authToken, visitedUserId });

			context.res.setHeader("Set-Cookie", "dr_tmp=; path=/; max-age=0;");

			return { props: { sports: resVisitedUser.data } };
		}

		const response = await getSportsReq({ authToken });

		const sports = response.data || [];
		const firstSport = sports.length > 0 ? sports[0] : null;

		if (response.status === 200) {
			return { props: { sports: response.data, selectedSport: firstSport } };
		} else {
			return { props: { sports: [], selectedSport: null } };
		}
	} catch (error) {
		return handleError(error);
	}
};
