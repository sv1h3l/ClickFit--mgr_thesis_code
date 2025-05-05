import { TrainingPlanExercise } from "@/pages/training-plan";
import { useAppContext } from "@/utilities/Context";
import { Box, Typography } from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";
import DoubleLabelAndValue from "../small/DoubleLabelAndValue";
import GeneralCard from "./GeneralCard";
import { TrainingPlan } from "./TrainingPlansAndCreation";

interface Props {
	trainingPlanExercises: TrainingPlanExercise[];
	selectedTrainingPlan?: TrainingPlan;
}

const TrainingPlanDaySelection = (props: Props) => {
	const context = useAppContext();

	const [hierarchy, setHirerarchy] = useState<Map<number, { nthValue: number; valueName: string }[]>>();

	useEffect(() => {
		let hasCategories = true;
		if (props.trainingPlanExercises.filter((exercise) => exercise.categoryName !== "").length === 0) hasCategories = false;

		const dayMap = new Map<number, { nthValue: number; valueName: string }[]>();

		props.trainingPlanExercises.forEach((exercise) => {
			if (exercise.categoryName !== "") {
				const key = exercise.nthDay;

				if (!dayMap.has(key)) {
					dayMap.set(key, []);
				}

				const currentCategories = dayMap.get(key)!;

				const alreadyExists = currentCategories.some((cat) => cat.nthValue === exercise.nthCategory && cat.valueName === exercise.categoryName);

				if (!alreadyExists) {
					currentCategories.push({
						nthValue: exercise.nthCategory,
						valueName: exercise.categoryName,
					});
				}
			}
		});

		setHirerarchy(dayMap);
	}, [props.trainingPlanExercises]);

	return (
		<GeneralCard
			disabled={props.selectedTrainingPlan === undefined || props.trainingPlanExercises.length < 1}
			height="h-full"
			firstTitle="Vybraný trénink"
			removeJustifyBetween
			firstChildren={
				props.selectedTrainingPlan === undefined || props.trainingPlanExercises.length < 1 ? null : (
					<Box className=" h-full ">
						<Box className="pt-2 flex justify-between">
							<DoubleLabelAndValue
								firstLabel="Název tréninku"
								firstValue={props.selectedTrainingPlan?.name || ""}
								secondLabel="Datum vytvoření"
								secondValue={props.selectedTrainingPlan?.dateOfCreation || ""}
							/>

							<DoubleLabelAndValue
								firstLabel="Sport"
								firstValue={props.selectedTrainingPlan?.sportName || ""}
								secondLabel="Autor"
								secondValue={props.selectedTrainingPlan?.authorName || ""}
							/>
						</Box>
						<Box className="mt-8 ml-2 space-y-4">
							{hierarchy &&
								Array.from(hierarchy.entries()).map(([nthDay, categories]) => (
									<Box
										key={nthDay}
										className={`flex items-center border-[0.125rem] cursor-pointer transition-all duration-200 ease-in-out px-2.5 py-1.5 rounded-xl
									${context.bgSecondaryColor + context.borderSecondaryColor + context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}`}
										onClick={() => {
											const trainingPlanExercises = props.trainingPlanExercises.filter((exercise) => exercise.nthDay === nthDay);
											context.setTrainingPlanExercises(trainingPlanExercises);

											context.setTrainingPlan(props.selectedTrainingPlan);

											router.push("/training-plan");
										}}>
										<Typography className="text-lg mr-4">DEN {nthDay}.</Typography>
										<Box className="flex ">
											{categories.map((cat, index) =>
												index === 10 ? (
													<Typography
														key={index}
														className="font-light">
														, ...
													</Typography>
												) : (
													<Typography
														key={index}
														className="font-light">
														{index !== 0 ? ", " : ""}
														{cat.valueName}
													</Typography>
												)
											)}
										</Box>
									</Box>
								))}
						</Box>
					</Box>
				)
			}
		/>
	);
};

export default TrainingPlanDaySelection;
