import GeneralCard from "@/components/large/GeneralCard";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { useAppContext } from "@/utilities/Context";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import router from "next/router";

import { useEffect, useState } from "react";

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

const TrainingPlan = () => {
	interface TrainingCategory {
		nthCategory: number;
		categoryName: string;
		exercises: TrainingPlanExercise[];
	}

	const context = useAppContext();

	const [trainingCategories, setTrainingCategories] = useState<TrainingCategory[]>([]);

	const [clickedExercise, setClickedExercise] = useState<string>("1-1");

	useEffect(() => {
		if (!context.trainingPlanExercises || !context.trainingPlan) router.push("/training-plans");

		const categoryMap = new Map<number, TrainingCategory>();

		context.trainingPlanExercises.forEach((exercise) => {
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
	}, [context.trainingPlanExercises, context.trainingPlan]);

	return (
		<>
			<Head>
				<title>Tréninkový plán - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-1/2"
				secondColumnWidth="w-1/2"
				firstColumnChildren={
					<GeneralCard
						height="h-full"
						firstTitle={context.trainingPlan?.name}
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
												className={`flex items-center gap-8 border-b-2 px-3  h-12
															${context.bgTertiaryColor}
															${clickedExercise === category.nthCategory + "-1" ? context.borderPrimaryColor : context.borderTertiaryColor}`}>
												<Box className="w-full h-full items-center flex">
													<Typography className="text-lg ">{category.categoryName}</Typography>
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

													<Box className={`flex  ${context.trainingPlan?.hasBurdenAndUnit ? "w-16" : "w-14"}`}>
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
													{context.trainingPlan?.hasBurdenAndUnit ? (
														<Box className=" w-[6.25rem] flex justify-center    ">
															{context.trainingPlan?.unitCode === 1 ? (
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
															) : context.trainingPlan?.unitCode === 2 ? (
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
															) : context.trainingPlan?.unitCode === 3 ? (
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
														onClick={() => setClickedExercise(exercise.nthCategory.toString() + "-" + exercise.nthExercise.toString())}>
														<Box className="flex w-full items-center h-full">
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

															<Box
																className={`flex items-center 
																		`}>
																<Typography className="text-right w-16">{exercise.series}</Typography>
																<Typography className="text-center w-6 font-light">x</Typography>
																<Typography className="w-12">{exercise.repetitions}</Typography>

																{context.trainingPlan?.hasBurdenAndUnit ? (
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
				secondColumnChildren={<></>}
			/>
		</>
	);
};

export default TrainingPlan;
