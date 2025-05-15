import { getSportsReq, Sport } from "@/api/get/getSportsReq";
import { getVisitedUserSportsReq } from "@/api/get/getVisitedUserSportsReq";
import DiaryAndGraphs, { Graph } from "@/components/large/DiaryAndGraphs";
import SportsAndValues from "@/components/large/SportsAndValues";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { useAppContext } from "@/utilities/Context";
import { Box } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

const cookie = require("cookie");

interface Props {
	sports: Sport[];

	selectedSport: Sport | null;

	cannotEdit?: boolean;
}

const Diary = (props: Props) => {
	const context = useAppContext();

	const [sportsData, setSportsData] = useState<Sport[]>(props.sports ?? []);

	const [selectedSport, setSelectedSport] = useState<Sport | null>(props.selectedSport);
	const [selectedGraph, setSelectedGraph] = useState<Graph | null>(null);

	const [isSelectedFirstSection, setIsSelectedFirstSection] = useState(true);
	const [isDisabledFirstSection, setIsDisabledFirstSection] = useState(false);

	const [isFirstSectionVisible, setIsFirstSectionVisible] = useState(true);
	const [firstSectionHasFullWidth, setFirstSectionHasFullWidth] = useState(true);
	const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(false);

	useEffect(() => {
		if (context.activeSection === 1 || context.activeSection === 3) {
			setIsSecondSectionVisible(false);
			setTimeout(() => setFirstSectionHasFullWidth(true), 200);
			setTimeout(() => setIsFirstSectionVisible(true), 250);
		} else {
			setIsFirstSectionVisible(false);
			setTimeout(() => setFirstSectionHasFullWidth(false), 200);
			setTimeout(() => setIsSecondSectionVisible(true), 250);
		}
	}, [context.activeSection]);

	return (
		<>
			<Head>
				<title>Deník - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth={context.isSmallDevice ? (firstSectionHasFullWidth ? "w-full" : "w-0") : "w-9/24"}
				secondColumnWidth={context.isSmallDevice ? (!firstSectionHasFullWidth ? "w-full" : "w-0") : "w-15/24"}
				firstColumnChildren={
					!context.isSmallDevice || firstSectionHasFullWidth ? (
						<Box
							className={`transition-all duration-200 h-full
										${isFirstSectionVisible || !context.isSmallDevice ? "opacity-100" : "opacity-0"}`}>
							<SportsAndValues
								cannotEdit={props.cannotEdit}
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
						</Box>
					) : (
						<></>
					)
				}
				secondColumnChildren={
					!context.isSmallDevice || !firstSectionHasFullWidth ? (
						<Box
							className={`transition-all duration-200 h-full
							${isSecondSectionVisible || !context.isSmallDevice ? "opacity-100" : "opacity-0"}`}>
							<DiaryAndGraphs
								cannotEdit={props.cannotEdit}
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
						</Box>
					) : (
						<></>
					)
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

		const visitedUserId = cookies.view_tmp ? Number(atob(cookies.view_tmp)) : -1;
		const authToken = cookies.authToken || null;

		if (visitedUserId > 0) {
			const resVisitedUser = await getVisitedUserSportsReq({ authToken, visitedUserId });
			const sports = resVisitedUser.data || [];

			const firstSport = sports.length > 0 ? sports[0] : null;

			return { props: { sports: resVisitedUser.data, selectedSport: firstSport, cannotEdit: true } };
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
