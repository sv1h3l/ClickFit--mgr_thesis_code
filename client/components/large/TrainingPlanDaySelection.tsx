import { deleteTrainingPlanReq } from "@/api/delete/deleteTrainingPlanReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { User } from "@/api/get/getAllUserAtrsReq";
import { TrainingPlanExercise } from "@/pages/training-plan";
import { useAppContext } from "@/utilities/Context";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Box, Typography } from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import CustomModal from "../small/CustomModal";
import GeneralCard from "./GeneralCard";
import { TrainingPlan } from "./TrainingPlansAndCreation";

const cookie = require("cookie");

interface Props {
	trainingPlanExercises: TrainingPlanExercise[];
	selectedTrainingPlan: StateAndSetFunction<TrainingPlan | null>;
	trainingPlans: StateAndSetFunction<TrainingPlan[]>;

	user: User | null;
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
			} else {
				const key = exercise.nthDay;

				if (!dayMap.has(key)) {
					dayMap.set(key, []);
				}

				const currentExercises = dayMap.get(key)!;

				const alreadyExists = currentExercises.some((cat) => cat.nthValue === exercise.nthExercise && cat.valueName === exercise.exerciseName);

				if (!alreadyExists) {
					currentExercises.push({
						nthValue: exercise.nthExercise,
						valueName: exercise.exerciseName,
					});
				}
			}
		});

		setHirerarchy(dayMap);
	}, [props.trainingPlanExercises, props.selectedTrainingPlan?.state]);

	const handleDeleteTrainingPlan = async () => {
		try {
			const response = await deleteTrainingPlanReq({ trainingPlanId: props.selectedTrainingPlan.state?.trainingPlanId || -1, orderNumber: props.selectedTrainingPlan.state?.orderNumber || -1 });

			if (response.status === 200) {
				props.trainingPlans.setState((prevTrainingPlans) => prevTrainingPlans.filter((trainingPlan) => trainingPlan.trainingPlanId !== props.selectedTrainingPlan.state?.trainingPlanId));

				

				props.selectedTrainingPlan?.setState(null);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const [isModalOpened, setIsModalOpened] = useState(false);

	return (
		<GeneralCard
			disabled={props.selectedTrainingPlan?.state === null || props.trainingPlanExercises.length < 1}
			height="h-full"
			firstTitle="Vybraný trénink"
			firstSideContent={
				props.selectedTrainingPlan?.state?.authorId === props.user?.userId
					? [
							<ButtonComp
								key={1}
								content={IconEnum.EDIT}
								style="ml-3"
								size="medium"
								onClick={() => {
									document.cookie = `tpc_tmp=${btoa(props.selectedTrainingPlan?.state?.sportId.toString()!)}; path=/; max-age=1200; `;
									document.cookie = `tp_tmp=${btoa(props.selectedTrainingPlan?.state?.trainingPlanId.toString()!)}; path=/; max-age=1200; `;
									document.cookie = `tpc_edit=${true}; path=/; max-age=1200; `;

									router.push("/training-plan-creation");
								}}
								justClick
								dontChangeOutline
							/>,
					  ]
					: []
			}
			onlyRightContent={
				props.selectedTrainingPlan?.state?.ownerId === props.user?.userId || props.selectedTrainingPlan?.state?.authorId === props.user?.userId
					? [
							<ButtonComp
								key={2}
								content={IconEnum.TRASH}
								onClick={() => setIsModalOpened(true)}
								style="bg-red-900"
								size="medium"
							/>,
					  ]
					: []
			}
			firstChildren={
				<>
					{props.selectedTrainingPlan?.state === null || props.trainingPlanExercises.length < 1 ? null : (
						<Box className=" h-full ">
							<Box className="pt-2 flex justify-between">
								<Box className="w-full px-1">
									<Box className="flex w-full gap-6">
										<Box className="flex w-1/2 mb-5">
											<Typography className={`ml-[0.65rem] font-light text-right text-nowrap text-[1.1rem]`}>Název tréninku</Typography>
											<Typography className={`text-gray-400 font-light text-center mx-3 text-[1.1rem]`}>»</Typography>
											<Typography className={`text-left text-[1.1rem]`}>{props.selectedTrainingPlan?.state?.name || ""}</Typography>
										</Box>

										<Box className="flex w-1/2">
											<Typography className={`font-light text-right text-[1.1rem]`}>Sport</Typography>
											<Typography className={`text-gray-400 font-light text-center mx-3 text-[1.1rem]`}>»</Typography>
											<Typography className={`text-left text-[1.1rem]`}>{props.selectedTrainingPlan?.state?.sportName || ""}</Typography>
										</Box>
									</Box>

									<Box className="flex w-full gap-6">
										<Box className="flex w-1/2">
											<Typography className={`font-light text-right text-nowrap text-[1.1rem]`}>Datum vytvoření</Typography>
											<Typography className={`text-gray-400 font-light text-center mx-3 text-[1.1rem]`}>»</Typography>
											<Typography className={`text-left text-[1.1rem]`}>{props.selectedTrainingPlan?.state?.dateOfCreation || ""}</Typography>
										</Box>

										<Box className="flex w-1/2">
											<Typography className={`font-light text-right text-[1.1rem]`}>Autor</Typography>
											<Typography className={`text-gray-400 font-light text-center mx-3 text-[1.1rem]`}>»</Typography>
											<Typography className={`text-left text-[1.1rem]`}>{props.selectedTrainingPlan?.state?.authorName || ""}</Typography>
										</Box>
									</Box>
								</Box>

								{/*<DoubleLabelAndValue
								firstLabel="Název tréninku"
								firstValue={props.selectedTrainingPlan?.state.name || ""}
								secondLabel="Datum vytvoření"
								secondValue={props.selectedTrainingPlan?.state.dateOfCreation || ""}
							/>

							<DoubleLabelAndValue
								firstLabel="Sport"
								firstValue={props.selectedTrainingPlan?.state.sportName || ""}
								secondLabel="Autor"
								secondValue={props.selectedTrainingPlan?.state.authorName || ""}
							/>*/}
							</Box>
							<Box className="mt-7  space-y-4">
								{hierarchy &&
									Array.from(hierarchy.entries()).map(([nthDay, categories]) => (
										<Box
											key={nthDay}
											className={`flex items-center border-[0.125rem] cursor-pointer transition-all duration-200 ease-in-out px-2.5 py-1.5 rounded-xl
									${context.bgSecondaryColor + context.borderSecondaryColor + context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}`}
											onClick={() => {
												document.cookie = cookie.serialize("tp_i", props.selectedTrainingPlan?.state?.trainingPlanId, {
													path: "/",
													maxAge: 60 * 60 * 24,
												});

												document.cookie = cookie.serialize("d_on", nthDay, {
													path: "/",
													maxAge: 60 * 60 * 24,
												});
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
					)}

					<CustomModal
						style="max-w-lg w-full"
						isOpen={isModalOpened}
						title="Odstranění tréninkového plánu"
						hideBackButton
						children={
							<Box className="">
								<Typography className="">
									Opravdu chcete odstranit tréninkový plán <span className="font-medium">{props.selectedTrainingPlan?.state?.name}</span>?
								</Typography>
								<Typography className="w-full text-center mt-8 text-red-icon">Odtraněním je nevratné!</Typography>

								<Box className="flex justify-between">
									<ButtonComp
										style="mx-auto mt-8"
										size="medium"
										content={"Zrušit"}
										onClick={() => {
											setIsModalOpened(false);
										}}
									/>
									<ButtonComp
										style="mx-auto mt-8 bg-red-900"
										size="medium"
										content={"Odstranit"}
										secondContent={IconEnum.TRASH}
										secondContentStyle="mr-1 scale-[1.1]"
										onClick={() => {
											handleDeleteTrainingPlan();
											setIsModalOpened(false);
										}}
									/>
								</Box>
							</Box>
						}
					/>
				</>
			}
		/>
	);
};

export default TrainingPlanDaySelection;
