import { Category, getCategoriesWithExercisesReq } from "@/api/get/getCategoriesWithExercisesReq";
import { getConcreteTrainingPlanDayReq } from "@/api/get/getConcreteTrainingPlanDayReq";
import { getDifficultiesReq } from "@/api/get/getDifficultiesReq";
import { getExerciseInformationLabsReq } from "@/api/get/getExerciseInformationLabsReq";
import { Exercise, getExercisesReq } from "@/api/get/getExercisesReq";
import { getSportReq } from "@/api/get/getSportReq";
import { Sport } from "@/api/get/getSportsReq";
import { getVisitedUserCategoriesWithExercisesReq } from "@/api/get/getVisitedUserCategoriesWithExercisesReq";
import { getVisitedUserConcreteTrainingPlanDayReq } from "@/api/get/getVisitedUserConcreteTrainingPlanDayReq";
import { getVisitedUserDifficultiesReq } from "@/api/get/getVisitedUserDifficultiesReq";
import { getVisitedUserExerciseInformationLabsReq } from "@/api/get/getVisitedUserExerciseInformationLabsReq";
import { getVisitedUserExercisesReq } from "@/api/get/getVisitedUserExercisesReq";
import { getVisitedUserSportReq } from "@/api/get/getVisitedUserSportReq";
import ExerciseInformations, { ExerciseInformationLabel } from "@/components/large/ExerciseInformations";
import GeneralCard from "@/components/large/GeneralCard";
import { SportDifficulty } from "@/components/large/SportDescriptionAndSettings";
import { TrainingPlan as TrainingPlanInterface } from "@/components/large/TrainingPlansAndCreation";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import ButtonComp, { IconEnum } from "@/components/small/ButtonComp";
import { useAppContext } from "@/utilities/Context";
import { Box, Typography } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import { useEffect, useState } from "react";

const cookie = require("cookie");

export interface TrainingPlanExercise {
	exerciseId: number;

	nthDay: number;
	nthCategory: number;
	nthExercise: number;

	categoryName: string;
	exerciseName: string;

	repetitions: number;
	series: number;
	burden: number;

	unitCode: number;
}

export enum Unit {
	KILOGRAM = 1,
	SECOND = 2,
	MINUTE = 3,
	HOUR = 4,
	METER = 5,
	KILOMETER = 6,
	WITHOUT_UNIT = 7,
}

// ➔ Samostatná mapa
export const UnitShortcuts: Record<number, string> = {
	[Unit.WITHOUT_UNIT]: "",
	[Unit.KILOGRAM]: "kg",
	[Unit.SECOND]: "s",
	[Unit.MINUTE]: "min",
	[Unit.HOUR]: "h",
	[Unit.METER]: "m",
	[Unit.KILOMETER]: "km",
};

interface Props {
	trainingPlanExercises: TrainingPlanExercise[];
	trainingPlan: TrainingPlanInterface | null;

	selectedSport: Sport;
	selectedExercise: Exercise;
	exercisesData: Exercise[];
	categoriesData: Category[];
	sportDifficultiesData: SportDifficulty[];
	exerciseInformationLabelsData: ExerciseInformationLabel[];

	concreteExerciseExists: boolean;
}

const TrainingPlan = (props: Props) => {
	interface TrainingCategory {
		nthCategory: number;
		categoryName: string;
		exercises: TrainingPlanExercise[];
	}

	const context = useAppContext();

	const [trainingCategories, setTrainingCategories] = useState<TrainingCategory[]>([]);

	const [clickedExercise, setClickedExercise] = useState<string>("1-1");
	const [concreteExerciseExists, setConcreteExerciseExists] = useState<boolean>(props.concreteExerciseExists);
	const [showDescription, setShowDescription] = useState<boolean>(false);

	useEffect(() => {
		if (!props.trainingPlan || props.trainingPlanExercises.length === 0) {
			router.push("/training-plans");
			return;
		}

		const categoryMap = new Map<number, TrainingCategory>();

		props.trainingPlanExercises.forEach((exercise) => {
			if (!categoryMap.has(exercise.nthCategory)) {
				categoryMap.set(exercise.nthCategory, {
					nthCategory: exercise.nthCategory,
					categoryName: exercise.categoryName,
					exercises: [],
				});
			}

			categoryMap.get(exercise.nthCategory)!.exercises.push(exercise);
		});

		setTrainingCategories(Array.from(categoryMap.values()));
	}, [props.trainingPlanExercises, props.trainingPlan]);

	const [selectedExerciseCategoryName, setSelectedExerciseCategoryName] = useState<string>("");

	const [selectedSport, setSelectedSport] = useState<Sport | null>(props.selectedSport);
	const [selectedExercise, setSelectedExercise] = useState<Exercise>(props.selectedExercise);

	const [exercisesData, setExercisesData] = useState<Exercise[]>(props.exercisesData);
	const [categoriesData, setCategoriesData] = useState<Category[]>(props.categoriesData);
	const [sportDifficultiesData, setSportDifficultiesData] = useState<SportDifficulty[]>(props.sportDifficultiesData);

	const [exerciseInformationLabelsData, setExerciseInformationLabelsData] = useState<ExerciseInformationLabel[]>(props.exerciseInformationLabelsData);

	const [editing, setEditing] = useState<boolean>(false);

	const [isActiveFirstChildren, setIsActiveFirstChildren] = useState<boolean>(true);

	{
		/* HACK complete*/
	}

	return (
		<>
			<Head>
				<title>Tréninkový plán - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth={showDescription && !context.isSmallDevice ? "w-1/2" : !showDescription ? "max-w-[60rem] w-full" : "w-0"}
				secondColumnWidth={showDescription && !context.isSmallDevice ? "w-1/2" : showDescription && context.isSmallDevice ? "w-full" : "w-0"}
				firstColumnChildren={
					<GeneralCard
						showBackButton
						backButtonClick={() => router.push("/training-plans")}
						height="h-full"
						firstTitle={props.trainingPlan?.name}
						onlyRightContent={[
							<ButtonComp
								key={0}
								content={showDescription ? IconEnum.EYE : IconEnum.EYE_HIDDEN}
								size="medium"
								externalClicked={{ state: showDescription, setState: setShowDescription }}
								onClick={() => setShowDescription(!showDescription)}
							/>,
						]}
						firstChildren={
							<Box className="h-full space-y-4">
								{trainingCategories.map((category) => (
									<Box
										key={category.nthCategory}
										className="flex">
										<Box
											className={` mt-3  flex flex-col w-full border-2 bg-primary_border_color-neutral rounded-xl overflow-hidden h-fit
														${context.borderPrimaryColor}`}>
											<Box
												className={`flex   border-b-2 px-3  
															${context.bgTertiaryColor}
															${clickedExercise === category.nthCategory + "-1" ? context.borderPrimaryColor : context.borderTertiaryColor}
															${context.windowWidth < 550 ? "flex-col min-h-12 gap-2 py-2 items-end" : " items-center h-12 gap-8"}
															`}>
												<Box className="w-full h-full items-center flex">
													<Typography className="text-lg ">{category.categoryName.length > 0 ? category.categoryName : "Cviky"}</Typography>
												</Box>

												<Box className="flex items-center ">
													<Box className="flex w-16 justify-end ">
														<Image
															className="size-6 "
															src="/icons/sequence.svg"
															width={28}
															height={28}
															alt=""
															style={{
																filter: "drop-shadow(3px 3px 3px #00000060)",
															}}
														/>
													</Box>

													<Box className="flex w-6">
														<Typography className="w-6  text-center font-light">x</Typography>
													</Box>

													<Box className={`flex  ${props.trainingPlan?.hasBurdenAndUnit ? "w-16" : "w-14"}`}>
														<Image
															className="size-6 "
															src="/icons/cycle.svg"
															width={28}
															height={28}
															alt=""
															style={{
																filter: "drop-shadow(3px 3px 3px #00000060)",
															}}
														/>
													</Box>
													{props.trainingPlan?.hasBurdenAndUnit ? (
														<Box className=" w-[6.25rem] flex justify-center    ">
															{props.trainingPlan.unitCode === 1 ? (
																<Image
																	className="size-6 ml-3"
																	src="/icons/weight.svg"
																	width={28}
																	height={28}
																	alt=""
																	style={{
																		filter: "drop-shadow(3px 3px 3px #00000060)",
																	}}
																/>
															) : props.trainingPlan.unitCode === 2 ? (
																<Image
																	className="size-6 ml-3"
																	src="/icons/time.svg"
																	width={28}
																	height={28}
																	alt=""
																	style={{
																		filter: "drop-shadow(3px 3px 3px #00000060)",
																	}}
																/>
															) : props.trainingPlan.unitCode === 3 ? (
																<Image
																	className="size-6 ml-3"
																	src="/icons/meter.svg"
																	width={28}
																	height={28}
																	alt=""
																	style={{
																		filter: "drop-shadow(3px 3px 3px #00000060)",
																	}}
																/>
															) : null}
														</Box>
													) : null}
												</Box>
											</Box>

											<Box className="">
												{category.exercises.map((exercise, index) => (
													<Box
														key={exercise.nthExercise}
														id={`exercise-${exercise.nthDay}-${exercise.nthCategory}-${exercise.nthExercise}`}
														className={`flex items-center px-3 py-2 min-h-12 transition-all duration-200 
																
																	${
																		clickedExercise === exercise.nthCategory.toString() + "-" + exercise.nthExercise.toString() && exercise.nthExercise !== category.exercises.length
																			? context.bgQuaternaryColor + context.borderQuaternaryColor + "border-b-2"
																			: clickedExercise === exercise.nthCategory.toString() + "-" + exercise.nthExercise.toString()
																			? context.bgQuaternaryColor
																			: clickedExercise === exercise.nthCategory.toString() + "-" + (exercise.nthExercise + 1).toString()
																			? "cursor-pointer border-b-2" + context.bgHoverTertiaryColor + context.borderPrimaryColor + context.borderHoverTertiaryColor
																			: exercise.nthExercise !== category.exercises.length
																			? "border-b-2" + context.borderPrimaryColor + "cursor-pointer" + context.bgHoverTertiaryColor + context.borderHoverTertiaryColor
																			: "cursor-pointer" + context.bgHoverTertiaryColor + context.borderPrimaryColor + context.borderHoverTertiaryColor
																	} 
																	${exercise.nthExercise % 2 === 0 && clickedExercise !== exercise.nthCategory.toString() + "-" + exercise.nthExercise.toString() && context.bgSecondaryColor}
																	`}
														onClick={() => {
															setClickedExercise(exercise.nthCategory.toString() + "-" + exercise.nthExercise.toString());

															if (props.selectedSport?.hasCategories) {
																const concreteCategory = categoriesData.find((cat) => cat.categoryName === exercise.categoryName);

																if (concreteCategory) {
																	const concreteExercise = concreteCategory.exercises.find((ex) => ex.exerciseId === exercise.exerciseId);

																	if (concreteExercise) {
																		setSelectedExercise(concreteExercise);
																		setSelectedExerciseCategoryName(concreteCategory.categoryName);
																		setConcreteExerciseExists(true);
																	} else setConcreteExerciseExists(false);
																} else setConcreteExerciseExists(false);
															} else {
																const concreteExercise = exercisesData.find((ex) => ex.exerciseId === exercise.exerciseId);

																if (concreteExercise) {
																	setSelectedExercise(concreteExercise);
																	setConcreteExerciseExists(true);
																} else setConcreteExerciseExists(false);
															}
														}}>
														<Box
															className={`flex w-full  h-full
															${context.windowWidth < 550 ? "flex-col min-h-12 gap-2  items-end" : " items-center h-12 gap-8"}`}>
															<Box className="flex mr-auto">
																<Typography
																	className={`transition-all duration-300    font-light
																${clickedExercise === exercise.nthCategory.toString() + "-" + exercise.nthExercise.toString() ? "w-2 opacity-50" : "opacity-0"}`}>
																	{clickedExercise === exercise.nthCategory.toString() + "-" + exercise.nthExercise.toString() ? "»" : ""}
																</Typography>
																<Typography
																	className={` w-full transition-all duration-200
																					${clickedExercise === exercise.nthCategory.toString() + "-" + exercise.nthExercise.toString() ? "translate-x-2" : "font-light tracking-[0.02rem]"}`}>
																	{exercise.exerciseName}
																</Typography>
															</Box>

															<Box
																className={`flex items-center 
																		`}>
																<Typography className="text-right w-16">{exercise.series}</Typography>
																<Typography className="text-center w-6 font-light">x</Typography>
																<Typography className="w-12">{exercise.repetitions}</Typography>

																{props.trainingPlan?.hasBurdenAndUnit ? (
																	<>
																		<Typography className="text-right w-16">{exercise.burden}</Typography>
																		<Typography className="ml-2 w-9 font-light">{UnitShortcuts[exercise.unitCode]}</Typography>{" "}
																	</>
																) : null}

																<Typography
																	className={`transition-all duration-300    font-light w-2
																${clickedExercise === exercise.nthCategory.toString() + "-" + exercise.nthExercise.toString() ? " opacity-50" : "opacity-0"}`}>
																	{clickedExercise === exercise.nthCategory.toString() + "-" + exercise.nthExercise.toString() ? "«" : ""}
																</Typography>
															</Box>
														</Box>
													</Box>
												))}
											</Box>
										</Box>
									</Box>
								))}
							</Box>
						}
					/>
				}
				secondColumnChildren={
					showDescription ? (
						concreteExerciseExists ? (
							<ExerciseInformations
								props={{
									onClick: { state: showDescription, setState: setShowDescription },
									sportId: props.trainingPlan?.sportId || -1,
									exerciseId: selectedExercise?.exerciseId || -1,

									exerciseName: selectedExercise?.exerciseName || "",
									exerciseDescription: selectedExercise?.exerciseName || "",
									exerciseYoutubeLink: selectedExercise?.exerciseName || "",
									exerciseOrderNumber: 0,
									exerciseOrderNumberWithoutCategories: 0,
									exerciseCategory: selectedExerciseCategoryName,

									selectedSport: { state: selectedSport, setState: setSelectedSport },
									selectedExercise: { state: selectedExercise, setState: setSelectedExercise },

									exercisesData: {
										state: exercisesData,
										setState: setExercisesData,
									},
									categoriesData: {
										state: categoriesData,
										setState: setCategoriesData,
									},
									sportDifficultiesData: {
										state: sportDifficultiesData,
										setState: setSportDifficultiesData,
									},
									exerciseInformationLabelsData: {
										state: exerciseInformationLabelsData,
										setState: setExerciseInformationLabelsData,
									},

									editing: { state: editing, setState: setEditing },
									isActiveFirstChildren: { state: isActiveFirstChildren, setState: setIsActiveFirstChildren },

									categoryId: selectedExercise.categoryId,
									difficultyId: selectedExercise.sportDifficultyId,
								}}
							/>
						) : (
							<GeneralCard
								showBackButton={context.isSmallDevice}
								backButtonClick={() => {
									context.setActiveSection(1);
									setShowDescription(false);
								}}
								dontShowHr
								height="h-full"
								firstChildren={
									<Box className="h-1/3 w-full flex items-center justify-center">
										<Typography className=" text-xl font-light">Pro vybraný cvik neexistují podrobnosti ani popis.</Typography>
									</Box>
								}
							/>
						)
					) : null
				}
			/>
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	const handleError = (error: any) => {
		console.error("Error fetching sport plan:", error);

		return { props: { trainingPlan: null, trainingPlanExercises: [] } };
	};

	try {
		const cookies = cookie.parse(context.req.headers.cookie || "");

		const authToken = cookies.authToken || null;
		const trainingPlanId = cookies.tp_i || null;
		const dayOrderNumber = cookies.d_on || null;

		if ([authToken, trainingPlanId, dayOrderNumber].includes(null)) {
			return handleError("Missing required cookies");
		}

		const visitedUserId = cookies.view_tmp ? Number(atob(cookies.view_tmp)) : -1;

		if (visitedUserId > 0) {
			const resConcreteTrainingPlanDay = await getVisitedUserConcreteTrainingPlanDayReq({ authToken, trainingPlanId, dayOrderNumber, visitedUserId });

			if (resConcreteTrainingPlanDay.status === 200 && resConcreteTrainingPlanDay.data) {
				const sportId = resConcreteTrainingPlanDay.data.trainingPlan.sportId;

				const resSport = await getVisitedUserSportReq({ authToken, sportId, visitedUserId });

				const resSportData = resSport.data?.hasCategories
					? await getVisitedUserCategoriesWithExercisesReq({ props: { sportId, authToken, visitedUserId } })
					: await getVisitedUserExercisesReq({ props: { sportId, authToken, visitedUserId } });

				const resLabsAndVals = await getVisitedUserExerciseInformationLabsReq({ sportId, authToken, visitedUserId });

				const resDifficulties = await getVisitedUserDifficultiesReq({ sportId, authToken, visitedUserId });

				const firstTrainingPlanExercise = resConcreteTrainingPlanDay.data.trainingPlanExercises.find((exercise) => exercise.nthExercise === 1 && exercise.nthCategory === 1) || null;
				let firstExercise;

				if (resSport.data?.hasCategories) {
					const categories = resSportData.data as Category[];

					firstExercise = categories.find((category) => category.categoryName === firstTrainingPlanExercise?.categoryName)?.exercises.find((exercise) => exercise.exerciseId === firstTrainingPlanExercise?.exerciseId) || null;
				} else {
					const exercises = resSportData.data as Exercise[];

					firstExercise = exercises.find((exercise) => exercise.exerciseId === firstTrainingPlanExercise?.exerciseId) || null;
				}

				return {
					props: {
						trainingPlan: resConcreteTrainingPlanDay.data?.trainingPlan || null,
						trainingPlanExercises: resConcreteTrainingPlanDay.data?.trainingPlanExercises || [],

						selectedSport: resSport.data,
						selectedExercise: firstExercise || null,
						exercisesData: resSport.data?.hasCategories ? [] : resSportData.data,
						categoriesData: resSport.data?.hasCategories ? resSportData.data : [],
						sportDifficultiesData: resDifficulties.data,
						exerciseInformationLabelsData: resLabsAndVals.data,

						concreteExerciseExists: firstExercise !== null,
					},
				};
			}
		}

		//
		//
		//

		const resConcreteTrainingPlanDay = await getConcreteTrainingPlanDayReq({ authToken, trainingPlanId, dayOrderNumber });

		if (resConcreteTrainingPlanDay.status === 200 && resConcreteTrainingPlanDay.data) {
			const sportId = resConcreteTrainingPlanDay.data.trainingPlan.sportId;

			const resSport = await getSportReq({ authToken, sportId });

			const resSportData = resSport.data?.hasCategories ? await getCategoriesWithExercisesReq({ props: { sportId, authToken } }) : await getExercisesReq({ props: { sportId, authToken } });

			const resLabsAndVals = await getExerciseInformationLabsReq({ sportId, authToken });

			const resDifficulties = await getDifficultiesReq({ sportId, authToken });

			const firstTrainingPlanExercise = resConcreteTrainingPlanDay.data.trainingPlanExercises.find((exercise) => exercise.nthExercise === 1 && exercise.nthCategory === 1) || null;
			let firstExercise;

			if (resSport.data?.hasCategories) {
				const categories = resSportData.data as Category[];

				firstExercise = categories.find((category) => category.categoryName === firstTrainingPlanExercise?.categoryName)?.exercises.find((exercise) => exercise.exerciseId === firstTrainingPlanExercise?.exerciseId) || null;
			} else {
				const exercises = resSportData.data as Exercise[];

				firstExercise = exercises.find((exercise) => exercise.exerciseId === firstTrainingPlanExercise?.exerciseId) || null;
			}

			return {
				props: {
					trainingPlan: resConcreteTrainingPlanDay.data?.trainingPlan || null,
					trainingPlanExercises: resConcreteTrainingPlanDay.data?.trainingPlanExercises || [],

					selectedSport: resSport.data,
					selectedExercise: firstExercise || null,
					exercisesData: resSport.data?.hasCategories ? [] : resSportData.data,
					categoriesData: resSport.data?.hasCategories ? resSportData.data : [],
					sportDifficultiesData: resDifficulties.data,
					exerciseInformationLabelsData: resLabsAndVals.data,

					concreteExerciseExists: firstExercise !== null,
				},
			};
		} else {
			return handleError(resConcreteTrainingPlanDay.message);
		}
	} catch (error) {
		return handleError(error);
	}
};

export default TrainingPlan;
