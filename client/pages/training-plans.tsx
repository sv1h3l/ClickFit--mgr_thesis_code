import { consoleLogPrint } from "@/api/GenericApiResponse";
import { getSportsReq, Sport } from "@/api/get/getSportsReq";
import { getTrainingPlanExercisesReq } from "@/api/get/getTrainingPlanExercisesReq";
import { getTrainingPlansReq } from "@/api/get/getTrainingPlansReq";
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

	const [selectedTrainingPlan, setSelectedTrainingPlan] = useState<TrainingPlan>();

	useEffect(() => {
		setSelectedTrainingPlan(props.trainingPlans.find((trainingPlan) => trainingPlan.trainingPlanId === clickedTrainingPlanId));

		if (!hasMounted) return;

		getTrainingPlanExercises();
	}, [clickedTrainingPlanId]);

	const getTrainingPlanExercises = async () => {
		const cookies = cookie.parse(document.cookie || "");
		const authToken = cookies.authToken || null;

		try {
			const res = await getTrainingPlanExercisesReq({ authToken, trainingPlanId: clickedTrainingPlanId });

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
						trainingPlans={props.trainingPlans}
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
								trainingPlanExercises={trainingPlanExercises}
								selectedTrainingPlan={selectedTrainingPlan}
							/>
						) : (
							<>
								<SportDetails
									selectedSport={{
										state: selectedSport,
										setState: setSelectedSport,
									}}
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
		return { props: { trainingPlans: [], userId: -1, initialSportsData: [], clickedTrainingPlanId: -1, trainingPlanExercises: [], selectedSport: null } };
	};

	try {
		const cookies = cookie.parse(context.req.headers.cookie || "");
		const authToken = cookies.authToken || null;

		const resTrainingPlans = await getTrainingPlansReq({ authToken });

		const resSports = await getSportsReq({ authToken });

		const trainingPlans = resTrainingPlans.data?.trainingPlans || [];
		const clickedTrainingPlanId = trainingPlans.length > 0 ? trainingPlans[0].trainingPlanId : -1;

		let resTrainingPlanExercises;
		if (clickedTrainingPlanId !== -1) resTrainingPlanExercises = await getTrainingPlanExercisesReq({ authToken, trainingPlanId: clickedTrainingPlanId });

		const selectedSport = Array.isArray(resSports.data) && resSports.data.length > 0 ? resSports.data[0] : null;

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
				},
			};
		}
	} catch (error) {
		return handleError(error);
	}
};

export default TrainingPlans;
