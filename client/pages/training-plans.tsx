import { consoleLogPrint } from "@/api/GenericApiResponse";
import { getAllUserAtrsReq, User } from "@/api/get/getAllUserAtrsReq";
import { getSportsReq, Sport } from "@/api/get/getSportsReq";
import { getTrainingPlanExercisesReq } from "@/api/get/getTrainingPlanExercisesReq";
import { getTrainingPlansReq } from "@/api/get/getTrainingPlansReq";
import { getVisitedUserSportsReq } from "@/api/get/getVisitedUserSportsReq";
import { getVisitedUserTrainingPlanExercisesReq } from "@/api/get/getVisitedUserTrainingPlanExercisesReq";
import { getVisitedUserTrainingPlansReq } from "@/api/get/getVisitedUserTrainingPlansReq";
import SportDetails from "@/components/large/SportDetails";
import TrainingPlanDaySelection from "@/components/large/TrainingPlanDaySelection";
import TrainingPlansAndCreation, { TrainingPlan } from "@/components/large/TrainingPlansAndCreation";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { Box } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { TrainingPlanExercise } from "./training-plan";

const cookie = require("cookie");

interface Props {
	userId: number;
	trainingPlans: TrainingPlan[];
	trainingPlanExercises: TrainingPlanExercise[];

	clickedTrainingPlanId: number;
	selectedSport: Sport;

	initialSportsData: Sport[];

	cannotEdit?: boolean;

	user: User | null;
}

function TrainingPlans(props: Props) {
	const [sportsData, setSportsData] = useState<Sport[]>(props.initialSportsData ?? []);

	const [selectedSport, setSelectedSport] = useState<Sport | null>(props.selectedSport);

	const [showFirstSection, setShowFirstSection] = useState<boolean>(true);
	const [showFirstSectionSignal, setShowFirstSectionSignal] = useState<boolean>(true);
	const [showFirstSectionTimeout, setShowFirstSectionTimeout] = useState<boolean | null>(true);
	const [showContent, setShowContent] = useState<boolean>(true);
	const [hasMounted, setHasMounted] = useState(false);

	const [clickedTrainingPlanId, setClickedTrainingPlanId] = useState(props.clickedTrainingPlanId);
	const [trainingPlanExercises, setTrainingPlanExercises] = useState(props.trainingPlanExercises);

	const [selectedTrainingPlan, setSelectedTrainingPlan] = useState<TrainingPlan | null>(null);
	const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>(props.trainingPlans);

	useEffect(() => {
		setSelectedTrainingPlan(trainingPlans?.find((trainingPlan) => trainingPlan.trainingPlanId === clickedTrainingPlanId) || null);

		if (!hasMounted) return;

		getTrainingPlanExercises();
	}, [clickedTrainingPlanId]);

	const getTrainingPlanExercises = async () => {
		const cookies = cookie.parse(document.cookie || "");
		const authToken = cookies.authToken || null;

		try {
			const res = props.cannotEdit
				? await getVisitedUserTrainingPlanExercisesReq({ authToken, trainingPlanId: clickedTrainingPlanId, visitedUserId: cookies.view_tmp ? Number(atob(cookies.view_tmp)) : -1 })
				: await getTrainingPlanExercisesReq({ authToken, trainingPlanId: clickedTrainingPlanId });

			if (res.status === 200) {
				setTrainingPlanExercises(res.data?.trainingPlanExercises || []);
			} else {
				setTrainingPlanExercises([]);
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	useEffect(() => {
		setHasMounted(true);

		document.cookie = "tpac_tmp=; path=/; max-age=0;";
	}, []);

	useEffect(() => {
		if (!hasMounted) return;

		setShowContent(false);

		const timeout1 = setTimeout(() => setShowFirstSectionTimeout(showFirstSectionSignal), 150);
		const timeout2 = setTimeout(() => setShowContent(true), 150);

		return () => {
			clearTimeout(timeout1);
			clearTimeout(timeout2);
		};
	}, [showFirstSectionSignal]);

	return (
		<>
			<Head>
				<title>Tréninkové plány - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-9/24"
				secondColumnWidth="w-15/24"
				firstColumnChildren={
					<TrainingPlansAndCreation
						cannotEdit={props.cannotEdit}
						trainingPlans={trainingPlans}
						selectedSport={{
							state: selectedSport,
							setState: setSelectedSport,
						}}
						sportsData={{
							state: sportsData,
							setState: setSportsData,
						}}
						showFirstSection={{
							state: showFirstSection,
							setState: setShowFirstSection,
						}}
						showFirstSectionSignal={{
							state: showFirstSectionSignal,
							setState: setShowFirstSectionSignal,
						}}
						clickedTrainingPlanId={{
							state: clickedTrainingPlanId,
							setState: setClickedTrainingPlanId,
						}}
					/>
				}
				secondColumnChildren={
					<Box className={`h-full transition-opacity duration-200 ease-in-out ${showContent ? "opacity-100" : "opacity-0"}`}>
						{showFirstSectionTimeout ? (
							<TrainingPlanDaySelection
								user={props.user}
								trainingPlanExercises={trainingPlanExercises}
								selectedTrainingPlan={{ state: selectedTrainingPlan, setState: setSelectedTrainingPlan }}
								trainingPlans={{ state: trainingPlans, setState: setTrainingPlans }}
							/>
						) : (
							<>
								<SportDetails
									selectedSport={{
										state: selectedSport,
										setState: setSelectedSport,
									}}
									cannotEdit={props.cannotEdit}
								/>
							</>
						)}
					</Box>
				}
			/>
		</>
	);
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	const handleError = (error: any) => {
		console.error("Error fetching sport plans data:", error);
		return { props: { trainingPlans: [], userId: -1, initialSportsData: [], clickedTrainingPlanId: -1, trainingPlanExercises: [], selectedSport: null, user: null } };
	};

	try {
		const cookies = cookie.parse(context.req.headers.cookie || "");
		const visitedUserId = cookies.view_tmp ? Number(atob(cookies.view_tmp)) : -1;
		const authToken = cookies.authToken || null;

		if (visitedUserId > 0) {
			//const resUser = await getAllVisitedUserAtrsReq({ authToken, visitedUserId });
			const resUser = await getAllUserAtrsReq({ authToken });

			const resTrainingPlans = await getVisitedUserTrainingPlansReq({ authToken, visitedUserId });

			const trainingPlans = resTrainingPlans.data?.trainingPlans || [];
			const clickedTrainingPlanId = trainingPlans.length > 0 ? trainingPlans[0].trainingPlanId : -1;

			let resTrainingPlanExercises;
			if (clickedTrainingPlanId !== -1) resTrainingPlanExercises = await getVisitedUserTrainingPlanExercisesReq({ authToken, trainingPlanId: clickedTrainingPlanId, visitedUserId });

			const resSports = await getVisitedUserSportsReq({ authToken, visitedUserId });

			const selectedSport = Array.isArray(resSports.data) && resSports.data.length > 0 ? resSports.data[0] : null;

			return {
				props: {
					trainingPlans: resTrainingPlans.data?.trainingPlans || [],
					userId: resTrainingPlans.data?.userId || -1,
					initialSportsData: resSports.data || [],
					clickedTrainingPlanId,
					selectedSport,
					trainingPlanExercises: resTrainingPlanExercises?.data?.trainingPlanExercises || [],

					user: resUser.data,
					cannotEdit: true,
				},
			};
		}

		const resTrainingPlans = await getTrainingPlansReq({ authToken });

		const resSports = await getSportsReq({ authToken });

		const trainingPlans = resTrainingPlans.data?.trainingPlans || [];
		const clickedTrainingPlanId = trainingPlans.length > 0 ? trainingPlans[0].trainingPlanId : -1;

		let resTrainingPlanExercises;
		if (clickedTrainingPlanId !== -1) resTrainingPlanExercises = await getTrainingPlanExercisesReq({ authToken, trainingPlanId: clickedTrainingPlanId });

		const selectedSport = Array.isArray(resSports.data) && resSports.data.length > 0 ? resSports.data[0] : null;

		const resUser = await getAllUserAtrsReq({ authToken });

		context.res.setHeader("Set-Cookie", ["tp_tmp=; path=/; max-age=0;", "tpc_edit=; path=/; max-age=0;", "tpac_tmp=; path=/; max-age=0;"]);

		if (resTrainingPlans.status !== 200 || resSports.status !== 200) {
			return handleError(resTrainingPlans.message);
		} else {
			return {
				props: {
					trainingPlans: resTrainingPlans.data?.trainingPlans || [],
					userId: resTrainingPlans.data?.userId || -1,
					initialSportsData: resSports.data || [],
					clickedTrainingPlanId,
					selectedSport,
					trainingPlanExercises: resTrainingPlanExercises?.data?.trainingPlanExercises || [],
					user: resUser.data,
				},
			};
		}
	} catch (error) {
		return handleError(error);
	}
};

export default TrainingPlans;
