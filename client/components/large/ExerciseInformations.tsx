import { changeCategoryReq } from "@/api/change/changeCategoryReq";
import { changeExerciseDescriptionReq } from "@/api/change/changeExerciseDescriptionReq";
import { changeExerciseDifficultyRecommendedValsReq } from "@/api/change/changeExerciseDifficultyRecommendedValsReq";
import { changeExerciseRecommendedValsReq } from "@/api/change/changeExerciseRecommendedValsReq";
import { changeExerciseUnitCodeReq } from "@/api/change/changeExerciseUnitCodeReq";
import { changeSportDifficultyReq } from "@/api/change/changeSportDifficultyReq";
import { changeYoutubeLinkReq } from "@/api/change/changeYoutubeLinkReq";
import { createExerciseDifficultyRecommendedValsReq } from "@/api/create/createExerciseDifficultyRecommendedValsReq";
import { createExerciseInformationsLabReq } from "@/api/create/createExerciseInformationsLabReq";
import { createExerciseInformationsValReq } from "@/api/create/createExerciseInformationsValReq";
import { deleteExerciseInformationLabReq } from "@/api/delete/deleteExerciseInformationLabReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { Category } from "@/api/get/getCategoriesWithExercisesReq";
import { getExerciseDifficultiesReq } from "@/api/get/getExerciseDifficultiesReq";
import { getExerciseInformationValsReq } from "@/api/get/getExerciseInformationValsReq";
import { Exercise } from "@/api/get/getExercisesReq";
import { Sport } from "@/api/get/getSportsReq";
import { moveExerciseInformationLabReq } from "@/api/move/moveExerciseInformationLabReq";
import { StateAndSet, StateAndSetFunction } from "@/utilities/generalInterfaces";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import LabelAndValue from "../small/LabelAndValue";
import TextFieldWithIcon from "../small/TextFieldWithIcon";
import Title from "../small/Title";
import GeneralCard from "./GeneralCard";
import { SportDifficulty } from "./SportDescriptionAndSettings";

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

export interface ExerciseDifficulty {
	exerciseDifficultyId: number;
	sportDifficultyId: number;
	exerciseId: number;

	series: number;
	repetitions: number;
	burden: number;

	orderNumber?: number;
}

interface ExerciseInformationProps {
	sportId: number;
	categoryId: number;
	exerciseId: number;
	difficultyId: number;

	exerciseName: string;
	exerciseCategory: string;
	exerciseDescription: string;
	exerciseYoutubeLink: string;
	exerciseOrderNumber: number;
	exerciseOrderNumberWithoutCategories: number;

	selectedSport: StateAndSet<Sport | null>;
	selectedExercise: StateAndSet<Exercise>;

	categoriesData: StateAndSetFunction<Category[]>;
	exercisesData: StateAndSetFunction<Exercise[]>;
	sportDifficultiesData: StateAndSetFunction<SportDifficulty[]>;

	exerciseInformationLabelsData: StateAndSetFunction<ExerciseInformationLabel[]>;

	editing: StateAndSet<boolean>;
}

const ExerciseInformations = ({ props }: { props: ExerciseInformationProps }) => {
	const [exerciseInformationValuesData, setExerciseInformationValuesData] = useState<ExerciseInformationValue[]>([]);

	const [orderNumber, setOrderNumber] = useState<number>(props.exerciseOrderNumber);
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

	const getExerciseInformationValues = async (sportId: number, exerciseId: number) => {
		try {
			const response = await getExerciseInformationValsReq({ sportId, exerciseId });

			if (response.status === 200 && response.data) {
				setExerciseInformationValuesData(response.data);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleCreateExerciseInformationLabel = async (exerciseInformationLabel: string) => {
		const orderNumber = props.exerciseInformationLabelsData.state.length + 1;

		try {
			const response = await createExerciseInformationsLabReq({ sportId: props.sportId, exerciseInformationLabel, orderNumber });

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
			const response = await createExerciseInformationsValReq({ sportId: props.sportId, exerciseInformationLabelId, exerciseInformationValue, exerciseId: props.exerciseId });

			if (response.status === 200) {
				const newValuesData = exerciseInformationValuesData.map((item) => {
					if (item.exerciseInformationLabelId === exerciseInformationLabelId) {
						return { ...item, value: exerciseInformationValue };
					}

					return item;
				});

				setExerciseInformationValuesData(newValuesData);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

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
			const response = await changeExerciseDescriptionReq({ sportId, exerciseId, description: descriptionValue });

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
			const response = await changeYoutubeLinkReq({ sportId, exerciseId, youtubeLink: youtubeLinkValue });

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
		return exerciseInformationValuesData.find((value) => value.exerciseInformationLabelId === exerciseInformationLabelId)?.value;
	};

	const deleteExerciseInformationLabel = async (exerciseInformationLabelId: number, reorderExerciseInformationLabels: { exerciseInformationLabelId: number; orderNumber: number }[]) => {
		try {
			const response = await deleteExerciseInformationLabReq({ sportId: props.sportId, exerciseInformationLabelId, reorderExerciseInformationLabels });

			if (response.status) {
				consoleLogPrint(response);
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleDeleteExerciseInformationLabel = (exerciseInformationLabelId: number, orderNumber: number) => {
		let reorderExerciseInformationLabels: { exerciseInformationLabelId: number; orderNumber: number }[] = [];

		const updatedExerciseInformations = props.exerciseInformationLabelsData.state
			.filter((label) => label.orderNumber !== orderNumber)
			.map((label) => {
				if (label.orderNumber > orderNumber) {
					const updatedExerciseInformation = { ...label, orderNumber: label.orderNumber - 1 };

					reorderExerciseInformationLabels.push({ exerciseInformationLabelId: updatedExerciseInformation.exerciseInformationLabelId, orderNumber: updatedExerciseInformation.orderNumber });

					return updatedExerciseInformation;
				}
				return label;
			});

		props.exerciseInformationLabelsData.setState(updatedExerciseInformations);

		deleteExerciseInformationLabel(exerciseInformationLabelId, reorderExerciseInformationLabels);

		return updatedExerciseInformations;
	};

	const moveExerciseInformationLabel = async (reorderExerciseInformationLabels: { exerciseInformationLabelId: number; orderNumber: number }[]) => {
		try {
			const response = await moveExerciseInformationLabReq({ sportId: props.sportId, reorderExerciseInformationLabels });

			if (response.status) {
				consoleLogPrint(response);
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleMoveExerciseInformationLabel = (orderNumber: number, direction: "up" | "down") => {
		if (direction === "up" && orderNumber === 1) return;
		else if (direction === "down" && orderNumber === props.exerciseInformationLabelsData.state.length) return;

		let updatedExerciseInformations: ExerciseInformationLabel[] = [];
		let exerciseInformationSwap: ExerciseInformationLabel;
		let reorderExerciseInformationLabels: { exerciseInformationLabelId: number; orderNumber: number }[] = [];

		props.exerciseInformationLabelsData.state.map((label) => {
			if ((direction === "up" && label.orderNumber === orderNumber) || (label.orderNumber === orderNumber + 1 && direction === "down")) {
				reorderExerciseInformationLabels.push({ exerciseInformationLabelId: label.exerciseInformationLabelId, orderNumber: label.orderNumber - 1 });
				reorderExerciseInformationLabels.push({ exerciseInformationLabelId: exerciseInformationSwap.exerciseInformationLabelId, orderNumber: exerciseInformationSwap.orderNumber });

				updatedExerciseInformations.push({ ...label, orderNumber: label.orderNumber - 1 });
				updatedExerciseInformations.push(exerciseInformationSwap);
			} else if ((direction === "down" && label.orderNumber === orderNumber) || (label.orderNumber === orderNumber - 1 && direction === "up")) {
				exerciseInformationSwap = { ...label, orderNumber: label.orderNumber + 1 };
			} else {
				updatedExerciseInformations.push(label);
			}
		});

		props.exerciseInformationLabelsData.setState(updatedExerciseInformations);

		moveExerciseInformationLabel(reorderExerciseInformationLabels);

		return;
	};

	const MoveAndDeleteButtons = ({ exerciseInformationLabelId, orderNumber }: { exerciseInformationLabelId: number; orderNumber: number }) => {
		const disableUpArrow = orderNumber === 1;
		const disableDownArrow = orderNumber === props.exerciseInformationLabelsData.state.length;

		return (
			<Box className="ml-auto flex relative">
				<Button
					disabled={disableUpArrow}
					onClick={() => handleMoveExerciseInformationLabel(orderNumber, "up")}
					size="small"
					className={`w-8 h-8 p-1 min-w-8 ml-3
								${disableUpArrow && "opacity-30"}`}>
					<ArrowUpward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					disabled={disableDownArrow}
					onClick={() => handleMoveExerciseInformationLabel(orderNumber, "down")}
					size="small"
					className={`w-8 h-8 p-1 min-w-8
								${disableDownArrow && "opacity-30"}`}>
					<ArrowDownward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					onClick={() => handleDeleteExerciseInformationLabel(exerciseInformationLabelId, orderNumber)}
					size="small"
					className={`w-8 h-8 p-1 min-w-8 ml-3`}>
					<CloseIcon
						className="text-red-400"
						fontSize="small"
					/>
				</Button>
			</Box>
		);
	};

	const [categoryValue, setCategoryValue] = useState(props.categoryId);

	const handleChangeCategory = async (event: SelectChangeEvent<number>) => {
		const newCategoryId = event.target.value as number;
		const oldOrderNumber = props.selectedExercise.state.orderNumber;

		if (categoryValue === newCategoryId) return;

		try {
			const response = await changeCategoryReq({ sportId: props.sportId, exerciseId: props.exerciseId, categoryId: newCategoryId, oldCategoryId: categoryValue, oldOrderNumber });

			if (response.status === 200) {
				props.categoriesData.setState((prevCategories) =>
					prevCategories.map((category) => {
						if (category.categoryId === newCategoryId) {
							const newExercise = {
								exerciseId: props.exerciseId,
								categoryId: newCategoryId,
								sportDifficultyId: props.difficultyId,
								exerciseName: props.exerciseName,
								orderNumber: Math.max(0, ...category.exercises.map((ex) => ex.orderNumber)) + 1,
								orderNumberWithoutCategories: props.exerciseOrderNumberWithoutCategories,
							} as Exercise;

							props.selectedExercise.setState(newExercise);

							return {
								...category,
								exercises: [...category.exercises, newExercise],
							};
						}

						if (category.categoryId === categoryValue) {
							// Odstranění cvičení
							const updatedExercises = category.exercises
								.filter((exercise) => exercise.exerciseId !== props.exerciseId)
								.map((exercise) => {
									if (exercise.orderNumber > oldOrderNumber) return { ...exercise, orderNumber: exercise.orderNumber - 1 };
									else return { ...exercise };
								});

							return {
								...category,
								exercises: updatedExercises,
							};
						}

						return category;
					})
				);

				setCategoryValue(newCategoryId);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeDifficulty = async (event: SelectChangeEvent<number>) => {
		const newDifficultyId = event.target.value as number;

		if (difficultyValue === newDifficultyId) return;

		try {
			const response = await changeSportDifficultyReq({ sportId: props.sportId, exerciseId: props.exerciseId, sportDifficultyId: newDifficultyId });

			if (response.status === 200) {
				const newExercise = {
					exerciseId: props.exerciseId,
					categoryId: props.categoryId,
					sportDifficultyId: newDifficultyId,
					exerciseName: props.exerciseName,
					orderNumber: props.exerciseOrderNumber,
					orderNumberWithoutCategories: props.exerciseOrderNumberWithoutCategories,
				} as Exercise;

				props.selectedExercise.setState(newExercise);

				props.selectedSport.state?.hasCategories
					? props.categoriesData.setState((prevCategories) =>
							prevCategories.map((category) => {
								if (category.categoryId === props.categoryId) {
									const newExercises = category.exercises.map((exercise) => {
										if (exercise.exerciseId === props.exerciseId) {
											return { ...exercise, sportDifficultyId: newDifficultyId };
										} else return exercise;
									});

									return { ...category, exercises: newExercises };
								}
								return category;
							})
					  )
					: props.exercisesData.setState((prevExercises) =>
							prevExercises.map((exercise) => {
								if (exercise.exerciseId === props.exerciseId) {
									return { ...exercise, sportDifficultyId: newDifficultyId };
								} else return exercise;
							})
					  );

				setDifficultyValue(newDifficultyId);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const [menuCategories, setMenuCategories] = useState<{ categoryId: number; categoryName: string }[]>([]);
	const [menuDifficulties, setMenuDifficulties] = useState<{ difficultyId: number; difficultyName: string }[]>([]);

	const [difficultyValue, setDifficultyValue] = useState(props.difficultyId);

	const [unitCodeValue, setUnitCodeValue] = useState(props.selectedExercise.state.unitCode);

	const handleChangeExerciseUnitCode = async (event: SelectChangeEvent<number>) => {
		const newExerciseUnitCode = event.target.value as number;

		if (unitCodeValue === newExerciseUnitCode) return;

		try {
			const response = await changeExerciseUnitCodeReq({ sportId: props.selectedSport.state?.sportId!, exerciseId: props.exerciseId, unitCode: newExerciseUnitCode });

			if (response.status === 200) {
				const newExercise = {
					...props.selectedExercise.state!,
					unitCode: newExerciseUnitCode,
				};

				props.selectedExercise.setState(newExercise);

				if (props.selectedSport.state?.hasCategories) {
					props.categoriesData.setState((prevCategories) =>
						prevCategories.map((category) => {
							if (category.categoryId === props.categoryId) {
								const newExercises = category.exercises.map((exercise) => (exercise.exerciseId === props.exerciseId ? { ...exercise, unitCode: newExerciseUnitCode } : exercise));

								return {
									...category,
									exercises: newExercises,
								};
							}
							return category;
						})
					);
				} else {
					props.exercisesData.setState((prevExercises) =>
						prevExercises.map((exercise) => {
							if (exercise.exerciseId === props.exerciseId) {
								return { ...exercise, unitCode: newExerciseUnitCode };
							} else return exercise;
						})
					);
				}

				setUnitCodeValue(newExerciseUnitCode);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeExerciseRecommendedVals = async (value: string, seriesRepetitonsOrBurden: number) => {
		const newExerciseValue = value === "" ? 0 : parseInt(value, 10);

		if (isNaN(newExerciseValue)) {
			console.error("Zadaná hodnota není platné číslo.");
			return;
		}

		if (seriesRepetitonsOrBurden === 1 && props.selectedExercise.state.series === newExerciseValue) return;
		else if (seriesRepetitonsOrBurden === 2 && props.selectedExercise.state.repetitions === newExerciseValue) return;
		else if (seriesRepetitonsOrBurden === 3 && props.selectedExercise.state.burden === newExerciseValue) return;

		try {
			const response = await changeExerciseRecommendedValsReq({
				sportId: props.selectedSport.state?.sportId!,
				exerciseId: props.exerciseId,
				series: seriesRepetitonsOrBurden === 1 ? newExerciseValue : undefined,
				repetitions: seriesRepetitonsOrBurden === 2 ? newExerciseValue : undefined,
				burden: seriesRepetitonsOrBurden === 3 ? newExerciseValue : undefined,
				seriesRepetitonsOrBurden,
			});

			if (response.status === 200) {
				const newExercise = (
					seriesRepetitonsOrBurden === 1
						? {
								...props.selectedExercise.state!,
								series: newExerciseValue,
						  }
						: seriesRepetitonsOrBurden === 2
						? {
								...props.selectedExercise.state!,
								repetitions: newExerciseValue,
						  }
						: {
								...props.selectedExercise.state!,
								burden: newExerciseValue,
						  }
				) as Exercise;

				props.selectedExercise.setState(newExercise);

				if (props.selectedSport.state?.hasCategories) {
					props.categoriesData.setState((prevCategories) =>
						prevCategories.map((category) => {
							if (category.categoryId === props.categoryId) {
								const newExercises = category.exercises.map((exercise) => (exercise.exerciseId === props.exerciseId ? newExercise : exercise));

								return {
									...category,
									exercises: newExercises,
								};
							}
							return category;
						})
					);
				} else {
					props.exercisesData.setState((prevExercises) =>
						prevExercises.map((exercise) => {
							if (exercise.exerciseId === props.exerciseId) {
								return newExercise;
							} else return exercise;
						})
					);
				}
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeExerciseDifficultyRecommendedVals = async (value: string, seriesRepetitonsOrBurden: number, exerciseDifficultyId: number, actualValue: number) => {
		const newExerciseValue = value === "" ? 0 : parseInt(value, 10);

		if (isNaN(newExerciseValue)) {
			console.error("Zadaná hodnota není platné číslo.");
			return;
		}

		if (seriesRepetitonsOrBurden === 1 && actualValue === newExerciseValue) return;
		else if (seriesRepetitonsOrBurden === 2 && actualValue === newExerciseValue) return;
		else if (seriesRepetitonsOrBurden === 3 && actualValue === newExerciseValue) return;

		try {
			const response = await changeExerciseDifficultyRecommendedValsReq({
				sportId: props.selectedSport.state?.sportId!,
				exerciseId: props.exerciseId,
				series: seriesRepetitonsOrBurden === 1 ? newExerciseValue : undefined,
				repetitions: seriesRepetitonsOrBurden === 2 ? newExerciseValue : undefined,
				burden: seriesRepetitonsOrBurden === 3 ? newExerciseValue : undefined,
				seriesRepetitonsOrBurden,
				exerciseDifficultyId,
			});

			if (response.status === 200) {
				setExerciseDifficulties((prevExerciseDifficulties) =>
					prevExerciseDifficulties.map((exerciseDifficulty) => {
						if (exerciseDifficulty.exerciseDifficultyId === exerciseDifficultyId) {
							if (seriesRepetitonsOrBurden === 1) {
								return { ...exerciseDifficulty, series: newExerciseValue };
							} else if (seriesRepetitonsOrBurden === 2) {
								return { ...exerciseDifficulty, repetitions: newExerciseValue };
							} else {
								return { ...exerciseDifficulty, burden: newExerciseValue };
							}
						} else return exerciseDifficulty;
					})
				);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleCreateExerciseDifficultyRecommendedVals = async (value: string, seriesRepetitionsOrBurden: number, exerciseDifficulty: ExerciseDifficulty) => {
		const newExerciseValue = value === "" ? 0 : parseInt(value, 10);

		if (isNaN(newExerciseValue)) {
			console.error("Zadaná hodnota není platné číslo.");
			return;
		}

		const series = seriesRepetitionsOrBurden === 1 ? newExerciseValue : 0;
		const repetitions = seriesRepetitionsOrBurden === 2 ? newExerciseValue : 0;
		const burden = seriesRepetitionsOrBurden === 3 ? newExerciseValue : 0;

		try {
			const response = await createExerciseDifficultyRecommendedValsReq({
				sportId: props.sportId,
				exerciseId: exerciseDifficulty.exerciseId,
				sportDifficultyId: exerciseDifficulty.sportDifficultyId,
				series,
				repetitions,
				burden,
			});

			const newExerciseDifficulty = { ...exerciseDifficulty, exerciseDifficultyId: response.data, series, repetitions, burden } as ExerciseDifficulty;

			//exerciseDifficulties.push(newExerciseDifficulty);

			setExerciseDifficulties([...exerciseDifficulties, newExerciseDifficulty]);

			/*if (response.status === 200) {
				setExerciseDifficulties((prevExerciseDifficulties) =>
					prevExerciseDifficulties.map((exerciseDifficulty) => {
						if (exerciseDifficulty.exerciseDifficultyId === exerciseDifficultyId) {
							if (seriesRepetitionsOrBurden === 1) {
								return { ...exerciseDifficulty, series: newExerciseValue };
							} else if (seriesRepetitionsOrBurden === 2) {
								return { ...exerciseDifficulty, repetitions: newExerciseValue };
							} else {
								return { ...exerciseDifficulty, burden: newExerciseValue };
							}
						} else return exerciseDifficulty;
					})
				);
			}*/

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	useEffect(() => {
		getExerciseInformationValues(props.sportId, props.exerciseId);
		getExerciseDifficulties();

		setOrderNumber(props.exerciseOrderNumber);

		setCategoryValue(props.categoryId);
		const newMenuCategories = props.categoriesData.state.map((category) => {
			return { categoryId: category.categoryId, categoryName: category.categoryName };
		});
		setMenuCategories(newMenuCategories);

		setDifficultyValue(props.difficultyId);
		const newMenuDifficulties = props.sportDifficultiesData.state.map((difficulty) => {
			return { difficultyId: difficulty.sportDifficultyId, difficultyName: difficulty.difficultyName };
		});
		setMenuDifficulties(newMenuDifficulties);

		setUnitCodeValue(props.selectedExercise.state.unitCode);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.exerciseId]);

	const [exerciseDifficulties, setExerciseDifficulties] = useState<ExerciseDifficulty[]>([]);

	const getExerciseDifficulties = async () => {
		try {
			const response = await getExerciseDifficultiesReq({
				sportId: props.selectedSport.state?.sportId!,
				exerciseId: props.exerciseId,
			});

			if (response.status === 200) {
				setExerciseDifficulties(response.data || []);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const RecommendedDifficultyValues = () => {
		const sportDifficultyOrderNumber = props.sportDifficultiesData.state.find((sportDifficulty) => sportDifficulty.sportDifficultyId === props.selectedExercise.state.sportDifficultyId)?.orderNumber || -1;

		return (
			<>
				<Title title="Doporučené hodnoty obtížností" />

				{props.sportDifficultiesData.state
					.filter((sportDifficulty) => sportDifficulty.orderNumber >= sportDifficultyOrderNumber)
					.map((sportDifficulty, index) => {
						let concreteExerciseDifficulty =
							exerciseDifficulties.find((exerciseDifficulty) => exerciseDifficulty.sportDifficultyId === sportDifficulty.sportDifficultyId) ||
							({
								exerciseDifficultyId: -1,
								sportDifficultyId: sportDifficulty.sportDifficultyId,
								exerciseId: props.selectedExercise.state.exerciseId,

								series: 0,
								repetitions: 0,
								burden: 0,
							} as ExerciseDifficulty);

						return (
							(concreteExerciseDifficulty.series > 0 || concreteExerciseDifficulty.repetitions > 0 || concreteExerciseDifficulty.burden > 0 || props.editing.state) && (
								<Box
									key={index}
									className={`ml-4 mt-3 mb-5`}>
									{/* TODO flex */}

									<Typography>{sportDifficulty.difficultyName}</Typography>

									<Box className="ml-3">
										{props.editing.state ? (
											<Box className="flex items-center">
												<LabelAndValue
													noPaddingTop
													mainStyle="w-min mt-3"
													showArrow
													label="Počet sérií"
												/>
												<TextFieldWithIcon
													dontDeleteValue
													onlyNumbers
													canBeEmptyValue
													style="-mb-[1rem]"
													previousValue={concreteExerciseDifficulty.series > 0 ? concreteExerciseDifficulty.series.toString() : ""}
													placeHolder="Není vyplněno"
													onClick={(value) => {
														concreteExerciseDifficulty.exerciseDifficultyId === -1
															? handleCreateExerciseDifficultyRecommendedVals(value, 1, concreteExerciseDifficulty)
															: handleChangeExerciseDifficultyRecommendedVals(value, 1, concreteExerciseDifficulty.exerciseDifficultyId, concreteExerciseDifficulty.series);
													}}
												/>
											</Box>
										) : (
											concreteExerciseDifficulty.series > 0 && (
												<LabelAndValue
													noPaddingTop
													mainStyle="mt-3"
													label="Počet sérií"
													notFilledIn={concreteExerciseDifficulty.series < 1}
													value={concreteExerciseDifficulty.series > 0 ? concreteExerciseDifficulty.series.toString() : ""}
												/>
											)
										)}

										{props.editing.state ? (
											<Box className="flex items-center">
												<LabelAndValue
													mainStyle="w-min"
													showArrow
													label="Počet opakování"
												/>
												<TextFieldWithIcon
													dontDeleteValue
													onlyNumbers
													canBeEmptyValue
													style="-mb-[1.3rem]"
													previousValue={concreteExerciseDifficulty.repetitions > 0 ? concreteExerciseDifficulty.repetitions.toString() : ""}
													placeHolder="Není vyplněno"
													onClick={(value) => {
														concreteExerciseDifficulty.exerciseDifficultyId === -1
															? handleCreateExerciseDifficultyRecommendedVals(value, 2, concreteExerciseDifficulty)
															: handleChangeExerciseDifficultyRecommendedVals(value, 2, concreteExerciseDifficulty.exerciseDifficultyId, concreteExerciseDifficulty.repetitions);
													}}
												/>
											</Box>
										) : (
											concreteExerciseDifficulty.repetitions > 0 && (
												<LabelAndValue
													label="Počet opakování"
													notFilledIn={concreteExerciseDifficulty.repetitions < 1}
													value={concreteExerciseDifficulty.repetitions > 0 ? concreteExerciseDifficulty.repetitions.toString() : ""}
												/>
											)
										)}

										{props.editing.state ? (
											<Box className="flex items-center">
												<LabelAndValue
													mainStyle="w-min"
													showArrow
													label="Zátěž"
												/>
												<TextFieldWithIcon
													dontDeleteValue
													onlyNumbers
													canBeEmptyValue
													style="-mb-[1.25rem]"
													previousValue={concreteExerciseDifficulty.burden > 0 ? concreteExerciseDifficulty.burden.toString() : ""}
													placeHolder="Není vyplněno"
													onClick={(value) => {
														concreteExerciseDifficulty.exerciseDifficultyId === -1
															? handleCreateExerciseDifficultyRecommendedVals(value, 3, concreteExerciseDifficulty)
															: handleChangeExerciseDifficultyRecommendedVals(value, 3, concreteExerciseDifficulty.exerciseDifficultyId, concreteExerciseDifficulty.burden);
													}}
												/>
											</Box>
										) : (
											concreteExerciseDifficulty.burden > 0 && (
												<LabelAndValue
													label="Zátěž"
													notFilledIn={concreteExerciseDifficulty.burden < 1}
													value={concreteExerciseDifficulty.burden > 0 ? concreteExerciseDifficulty.burden.toString() : ""}
												/>
											)
										)}
									</Box>
								</Box>
							)
						);
					})}
			</>
		);
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
						{props.selectedSport.state?.hasCategories &&
							(props.editing.state ? (
								<Box className="flex">
									<LabelAndValue
										mainStyle="w-min"
										showArrow
										label="Kategorie"
									/>
									<FormControl
										variant="standard"
										className="w-1/3 mt-[0.8rem]">
										<Select
											value={categoryValue}
											onChange={handleChangeCategory}
											sx={{
												"& .MuiSelect-select": {
													paddingBottom: 0,
												},
												"&::before, &::after": {
													width: "calc(100% - 1.7rem)",
												},
											}}>
											{menuCategories.map((item) => (
												<MenuItem
													key={item.categoryId}
													value={item.categoryId}>
													{item.categoryName}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Box>
							) : (
								<LabelAndValue
									label="Kategorie"
									value={props.exerciseCategory}
								/>
							))}
						{props.selectedSport.state?.hasDifficulties &&
							(props.editing.state ? (
								<Box className="flex">
									<LabelAndValue
										mainStyle="w-min"
										showArrow
										label="Obtížnost"
									/>
									<FormControl
										variant="standard"
										className="w-1/3 mt-[0.8rem]">
										<Select
											value={difficultyValue}
											onChange={handleChangeDifficulty}
											sx={{
												"& .MuiSelect-select": {
													paddingBottom: 0,
												},
												"&::before, &::after": {
													width: "calc(100% - 1.7rem)",
												},
											}}>
											{menuDifficulties.map((item) => (
												<MenuItem
													key={item.difficultyId}
													value={item.difficultyId}>
													{item.difficultyName}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Box>
							) : (
								<LabelAndValue
									label="Obtížnost"
									value={props.sportDifficultiesData.state.find((difficulty) => difficulty.sportDifficultyId === props.difficultyId)?.difficultyName || "Nepřiřazena"}
								/>
							))}

						{props.editing.state ? (
							<Box className="flex items-center">
								<LabelAndValue
									mainStyle="w-min"
									showArrow
									label="Jednotka zátěže"
								/>
								<FormControl
									variant="standard"
									className="w-36 mt-[0.8rem]">
									{/* 0.75rem pro hasReccomendedValues */}
									<Select
										value={unitCodeValue}
										onChange={handleChangeExerciseUnitCode}
										sx={{
											"& .MuiSelect-select": {
												paddingBottom: 0,
											},
											"&::before, &::after": {
												width: "calc(100% - 1.7rem)",
											},
										}}>
										<MenuItem value="0">Bez jednotky</MenuItem>
										<MenuItem value="1">Kilogram</MenuItem>
										<MenuItem value="2">Sekunda</MenuItem>
									</Select>
								</FormControl>
							</Box>
						) : (
							<LabelAndValue
								label="Jednotka zátěže"
								value={unitCodeValue == 1 ? "Kilogram" : unitCodeValue == 2 ? "Sekunda" : "Bez jednotky"}
							/>
						)}

						{props.editing.state
							? props.exerciseInformationLabelsData.state.map((label) => {
									return (
										<Box
											className=" flex items-end"
											key={label.exerciseInformationLabelId}>
											<LabelAndValue
												label={label.label}
												textFieldValue={findValue(label.exerciseInformationLabelId)}
												textFieldOnClick={(value) => handleCreateExerciseInformationValue(value, label.exerciseInformationLabelId)}
												icon={
													<CheckIcon
														fontSize="small"
														className="text-green-500"
													/>
												}
											/>

											<MoveAndDeleteButtons
												exerciseInformationLabelId={label.exerciseInformationLabelId}
												orderNumber={label.orderNumber}
											/>
										</Box>
									);
							  })
							: exerciseInformationValuesData.map((value) => {
									if (value.value !== "") {
										return (
											<LabelAndValue
												key={value.exerciseInformationValueId}
												label={findLabel(value.exerciseInformationLabelId)}
												value={value.value}
											/>
										);
									} else {
										return null;
									}
							  })}

						{props.editing.state && (
							<TextFieldWithIcon
								placeHolder="Přidat informaci o cviku"
								style="w-2/5 ml-2 mt-2 "
								onClick={handleCreateExerciseInformationLabel}
							/>
						)}

						{props.selectedSport.state?.hasRecommendedValues && !props.selectedSport.state.hasRecommendedDifficultyValues ? (
							<>
								{props.selectedExercise.state.series > 0 || props.selectedExercise.state.repetitions > 0 || props.selectedExercise.state.burden > 0 || props.editing.state ? <Title title="Doporučené hodnoty" /> : <></>}

								{props.editing.state ? (
									<Box className="flex items-center">
										<LabelAndValue
											mainStyle="w-min"
											showArrow
											label="Počet sérií"
										/>
										<TextFieldWithIcon
											dontDeleteValue
											onlyNumbers
											canBeEmptyValue
											style="-mb-[1.3rem]"
											previousValue={props.selectedExercise.state.series > 0 ? props.selectedExercise.state.series.toString() : ""}
											placeHolder="Není vyplněno"
											onClick={(value) => handleChangeExerciseRecommendedVals(value, 1)}></TextFieldWithIcon>
									</Box>
								) : (
									props.selectedExercise.state.series > 0 && (
										<LabelAndValue
											label="Počet sérií"
											notFilledIn={props.selectedExercise.state.series < 1}
											value={props.selectedExercise.state.series > 0 ? props.selectedExercise.state.series.toString() : ""}
										/>
									)
								)}

								{props.editing.state ? (
									<Box className="flex items-center">
										<LabelAndValue
											mainStyle="w-min"
											showArrow
											label="Počet opakování"
										/>
										<TextFieldWithIcon
											dontDeleteValue
											onlyNumbers
											canBeEmptyValue
											style="-mb-[1.25rem]"
											previousValue={props.selectedExercise.state.repetitions > 0 ? props.selectedExercise.state.repetitions.toString() : ""}
											placeHolder="Není vyplněno"
											onClick={(value) => handleChangeExerciseRecommendedVals(value, 2)}></TextFieldWithIcon>
									</Box>
								) : (
									props.selectedExercise.state.repetitions > 0 && (
										<LabelAndValue
											label="Počet opakování"
											notFilledIn={props.selectedExercise.state.repetitions < 1}
											value={props.selectedExercise.state.repetitions > 0 ? props.selectedExercise.state.repetitions.toString() : ""}
										/>
									)
								)}

								{props.editing.state ? (
									<Box className="flex items-center">
										<LabelAndValue
											mainStyle="w-min"
											showArrow
											label="Zátěž"
										/>
										<TextFieldWithIcon
											dontDeleteValue
											onlyNumbers
											canBeEmptyValue
											style="-mb-[1.25rem]"
											previousValue={props.selectedExercise.state.burden > 0 ? props.selectedExercise.state.burden.toString() : ""}
											placeHolder="Není vyplněno"
											onClick={(value) => handleChangeExerciseRecommendedVals(value, 3)}></TextFieldWithIcon>
									</Box>
								) : (
									props.selectedExercise.state.burden > 0 && (
										<LabelAndValue
											label="Zátěž"
											notFilledIn={props.selectedExercise.state.burden < 1}
											value={props.selectedExercise.state.burden > 0 ? props.selectedExercise.state.burden.toString() : ""}
										/>
									)
								)}
							</>
						) : (exerciseDifficulties.length > 0 && props.selectedSport.state?.hasRecommendedDifficultyValues) || (props.selectedSport.state?.hasRecommendedDifficultyValues && props.editing.state) ? (
							<RecommendedDifficultyValues></RecommendedDifficultyValues>
						) : (
							<></>
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
										onBlur={() => handleChangeExerciseDescription(props.sportId, props.exerciseId, categoryValue)} // XXX ? změněno z props.categoryId na categoryValue
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
									onBlur={() => handleChangeYoutubeLink(props.sportId, props.exerciseId, categoryValue)} // XXX ? změněno z props.categoryId na categoryValue
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
};

export default ExerciseInformations;
