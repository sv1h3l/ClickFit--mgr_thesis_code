import { changeExerciseDescriptionRequest } from "@/api/changeExerciseDescriptionRequest";
import { changeYoutubeLinkRequest } from "@/api/changeYoutubeLinkRequest";
import { createExerciseInformationLabelRequest } from "@/api/createExerciseInformationLabelRequest";
import { createExerciseInformationValueRequest } from "@/api/createExerciseInformationValueRequest";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { Category } from "@/api/getCategoriesAndExercisesRequest";
import { Exercise } from "@/api/getExercisesRequest";
import { StateAndSet, StateAndSetFunction } from "@/utilities/generalInterfaces";
import CheckIcon from "@mui/icons-material/Check";
import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import GeneralCard from "./GeneralCard";
import LabelAndValue from "./LabelAndValue";
import TextFieldWithIcon from "./TextFieldWithPlus";

export interface ExerciseInformationLabel {
	exerciseInformationLabelId: number;

	label: string;
	orderNumber: number;
}

export interface ExerciseInformationValue {
	exerciseInformationLabelId: number;
	exerciseInformationValueId: number;

	value: string;
}

interface ExerciseInformationProps {
	sportId: number;
	categoryId: number;
	exerciseId: number;

	exerciseName: string;
	exerciseCategory: string;
	exerciseDescription: string;
	exerciseYoutubeLink: string;

	categoriesData: StateAndSetFunction<Category[]>;
	exercisesData: StateAndSetFunction<Exercise[]>;

	exerciseInformationLabelsData: StateAndSetFunction<ExerciseInformationLabel[]>;
	exerciseInformationValuesData: StateAndSetFunction<ExerciseInformationValue[]>;

	editing: StateAndSet<boolean>;
}

function ExerciseInformations({ props }: { props: ExerciseInformationProps }) {
	const [youtubeLinkValue, setYoutubeLinkValue] = useState("");
	const [descriptionValue, setDescriptionValue] = useState("");

	useEffect(() => {
		setYoutubeLinkValue(props.exerciseYoutubeLink || "");
		setDescriptionValue(props.exerciseDescription || "");
	}, [props.exerciseDescription, props.exerciseYoutubeLink]);

	const extractWatchParams = (url: string) => {
		const match = url.match(/watch\?v=([^&]+)/);
		return match ? match[1] : "";
	};

	const handleCreateExerciseInformationLabel = async (exerciseInformationLabel: string) => {
		const orderNumber = props.exerciseInformationLabelsData.state.length + 1;

		try {
			const response = await createExerciseInformationLabelRequest({ sportId: props.sportId, exerciseInformationLabel, orderNumber });

			if (response.status === 200) {
				const newExerciseInformationLabel = {
					exerciseInformationLabelId: response.data || -1,
					label: exerciseInformationLabel,
					orderNumber: orderNumber,
				};

				const newExerciseInformationLabelsData = [...props.exerciseInformationLabelsData.state, newExerciseInformationLabel];
				props.exerciseInformationLabelsData.setState(newExerciseInformationLabelsData);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleCreateExerciseInformationValue = async (exerciseInformationValue: string, exerciseInformationLabelId: number) => {
		try {
			const response = await createExerciseInformationValueRequest({ sportId: props.sportId, exerciseInformationLabelId, exerciseInformationValue, exerciseId: props.exerciseId });

			if (response.status === 200) {
				const newValuesData = props.exerciseInformationValuesData.state.map((value) => {
					if (value.exerciseInformationValueId === exerciseInformationLabelId) {
						return { ...value, value: exerciseInformationValue };
					} else {
						return value;
					}
				});

				props.exerciseInformationValuesData.setState(newValuesData);

				/*const newExerciseInformationValue = {
					
				};

				const newExerciseInformationLabelsData = [...props.exerciseInformationLabelsData.state, newExerciseInformationLabel];
				props.exerciseInformationLabelsData.setState(newExerciseInformationLabelsData);*/
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	/*useEffect(() => {
		getExerciseInformationValues();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.exerciseId]);*/

	// #region Change
	const changeCategory = (categories: Category[], changeDesc: boolean, categoryId: number, exerciseId: number): Category[] => {
		const newCategories = categories.map((category) => {
			if (category.categoryId === categoryId) {
				return { ...category, exercises: changeExercise(category.exercises, changeDesc, exerciseId) };
			} else return category;
		});

		return newCategories;
	};

	const changeExercise = (exercises: Exercise[], changeDesc: boolean, exerciseId: number): Exercise[] => {
		const newExercises = exercises.map((exercise) => {
			if (exercise.exerciseId === exerciseId) {
				if (changeDesc) {
					return { ...exercise, description: descriptionValue };
				} else {
					return { ...exercise, youtubeLink: youtubeLinkValue };
				}
			} else return exercise;
		});

		return newExercises;
	};

	const handleChangeExerciseDescription = async (sportId: number, exerciseId: number, categoryId: number) => {
		try {
			const response = await changeExerciseDescriptionRequest({ sportId, exerciseId, description: descriptionValue });

			if (response.status === 200) {
				if (categoryId === -1) {
					props.exercisesData.setState(changeExercise(props.exercisesData.state, true, exerciseId));
				} else {
					props.categoriesData.setState(changeCategory(props.categoriesData.state, true, categoryId, exerciseId));
				}

				setDescriptionValue(descriptionValue);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeYoutubeLink = async (sportId: number, exerciseId: number, categoryId: number) => {
		try {
			const response = await changeYoutubeLinkRequest({ sportId, exerciseId, youtubeLink: youtubeLinkValue });

			if (response.status === 200) {
				if (categoryId === -1) {
					props.exercisesData.setState(changeExercise(props.exercisesData.state, false, exerciseId));
				} else {
					props.categoriesData.setState(changeCategory(props.categoriesData.state, false, categoryId, exerciseId));
				}

				setYoutubeLinkValue(youtubeLinkValue);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	// #endregion

	const findLabel = (exerciseInformationLabelId: number) => {
		return props.exerciseInformationLabelsData.state.find((label) => label.exerciseInformationLabelId === exerciseInformationLabelId)?.label ?? "";
	};

	const findValue = (exerciseInformationLabelId: number) => {
		return props.exerciseInformationValuesData.state.find((value) => value.exerciseInformationLabelId === exerciseInformationLabelId)?.value;
	};

	return (
		<>
			<GeneralCard
				key={props.exerciseId}
				firstTitle="Podrobnosti"
				secondTitle="Provedení"
				height="h-full"
				firstChildren={
					<Box className="flex flex-col  ">
						<LabelAndValue
							noPaddingTop
							label="Název cviku"
							value={props.exerciseName}
						/>

						<LabelAndValue
							label="Patří do kategorie"
							value={props.exerciseCategory}
						/>

						{props.editing.state
							? props.exerciseInformationLabelsData.state.map((label) => {
									return (
										<LabelAndValue
											key={label.exerciseInformationLabelId}
											label={label.label}
											textFieldValue={findValue(label.exerciseInformationLabelId)}
											textFieldOnClick={(value) => handleCreateExerciseInformationValue(value, label.exerciseInformationLabelId)}
											icon={<CheckIcon fontSize="small" />}
										/>
									);
							  })
							: props.exerciseInformationValuesData.state.map((value) => {
									return (
										<LabelAndValue
											key={value.exerciseInformationValueId}
											label={findLabel(value.exerciseInformationLabelId)}
											value={value.value}
										/>
									);
							  })}

						{props.editing.state && (
							<TextFieldWithIcon
								placeHolder="Přidat informaci o cviku"
								style="w-1/2 ml-2 mt-8"
								onClick={handleCreateExerciseInformationLabel}
							/>
						)}
					</Box>
				}
				secondChildren={
					<Box className="h-full">
						<Box className="pb-10 pt-4">
							{props.editing.state ? (
								<>
									<TextField
										className="w-full"
										label="Popis provedení cviku"
										multiline
										minRows={10}
										value={descriptionValue}
										onChange={(e) => setDescriptionValue(e.target.value)}
										onBlur={() => handleChangeExerciseDescription(props.sportId, props.exerciseId, props.categoryId)}
									/>
								</>
							) : (
								<Typography className=" font-light mx-2">{descriptionValue}</Typography>
							)}
						</Box>

						{props.editing.state ? (
							<>
								<TextField
									className="w-full"
									variant="standard"
									label="Odkaz na YouTube video"
									value={youtubeLinkValue}
									onChange={(e) => setYoutubeLinkValue(e.target.value)}
									onBlur={() => handleChangeYoutubeLink(props.sportId, props.exerciseId, props.categoryId)}
								/>
							</>
						) : (
							youtubeLinkValue && (
								<Box className="   w-full flex justify-center ">
									<iframe
										className=" h-auto w-full aspect-video rounded-3xl"
										width="854"
										height="480"
										src={"https://www.youtube.com/embed/" + extractWatchParams(youtubeLinkValue) + "?&mute=1&rel=0"}
										title="YouTube video player"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
								</Box>
							)
						)}
					</Box>
				}></GeneralCard>
		</>
	);
}

export default ExerciseInformations;
