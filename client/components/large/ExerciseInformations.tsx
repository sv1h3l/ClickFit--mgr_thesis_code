import { changeBlacklistReq } from "@/api/change/changeBlacklistReq";
import { changeCategoryReq } from "@/api/change/changeCategoryReq";
import { changeDescReq } from "@/api/change/changeDescReq";
import { changeExerciseDifficultyRecommendedValsReq } from "@/api/change/changeExerciseDifficultyRecommendedValsReq";
import { changeExerciseRecommendedValsReq } from "@/api/change/changeExerciseRecommendedValsReq";
import { changeExerciseUnitCodeReq } from "@/api/change/changeExerciseUnitCodeReq";
import { changeHasRepeatabilityReq } from "@/api/change/changeHasRepeatabilityReq";
import { changeLooseEntityReq } from "@/api/change/changeLooseEntityReq";
import { changePriorityPointsReq } from "@/api/change/changePriorityPointsReq";
import { changeRepeatabilityQuantityReq } from "@/api/change/changeRepeatabilityQuantityReq";
import { changeSportDifficultyReq } from "@/api/change/changeSportDifficultyReq";
import { changeTightConnectionReq } from "@/api/change/changeTightConnectionReq";
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
import { useAppContext } from "@/utilities/Context";
import { StateAndSet, StateAndSetFunction } from "@/utilities/generalInterfaces";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Box, Button, Checkbox, ClickAwayListener, FormControl, FormControlLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
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

	isActiveFirstChildren: StateAndSet<boolean>;
}

const ExerciseInformations = ({ props }: { props: ExerciseInformationProps }) => {
	const context = useAppContext();

	const [exerciseInformationValuesData, setExerciseInformationValuesData] = useState<ExerciseInformationValue[]>([]);

	const [orderNumber, setOrderNumber] = useState<number>(props.exerciseOrderNumber);
	const [youtubeLinkValue, setYoutubeLinkValue] = useState("");
	const [descriptionValue, setDescriptionValue] = useState("");

	useEffect(() => {
		setYoutubeLinkValue(props.selectedExercise.state.youtubeLink || "");
		setDescriptionValue(props.selectedExercise.state.description || "");
	}, [props.selectedExercise.state.exerciseId]);

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
			const response = await changeDescReq({ sportId, entityId: exerciseId, description: descriptionValue, changeExerciseDesc: true });

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
								...props.selectedExercise.state,
								categoryId: newCategoryId,
								orderNumber: Math.max(0, ...category.exercises.map((ex) => ex.orderNumber)) + 1,
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
					...props.selectedExercise.state,
					sportDifficultyId: newDifficultyId,
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
													onClickForBlur
													withoutIcon
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
													onClickForBlur
													withoutIcon
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
													onClickForBlur
													withoutIcon
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

	//
	//	#region Automatic Plan Creation
	//
	const [relatedExercises, setRelatedExercises] = useState<Exercise[]>([]);

	useEffect(() => {
		let newRelatedExercises = [] as Exercise[];
		props.selectedSport.state?.hasCategories
			? props.categoriesData.state.map((category) => (category.categoryId === props.categoryId ? (newRelatedExercises = category.exercises.filter((exercise) => exercise !== props.selectedExercise.state)) : null))
			: (newRelatedExercises = props.exercisesData.state.filter((exercise) => exercise !== props.selectedExercise.state));
		setRelatedExercises(newRelatedExercises);
	}, [props.exerciseId]);

	const setNewExercise = (newExercise: Exercise) => {
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

		setRelatedExercises((prev) => prev.map((exercise) => (exercise.exerciseId === newExercise.exerciseId ? newExercise : exercise)));
		setLooseConnections((prev) => prev.map((exercise) => (exercise.exerciseId === newExercise.exerciseId ? newExercise : exercise)));
		setTightConnection((prev) => (prev?.exerciseId === newExercise.exerciseId ? newExercise : prev));
		setBlacklist((prev) => prev.map((exercise) => (exercise.exerciseId === newExercise.exerciseId ? newExercise : exercise)));
	};

	// #region Has Repeatability
	const handleChangeExerciseHasRepeatability = async () => {
		const hasRepeatability = !props.selectedExercise.state.hasRepeatability;

		try {
			const response = await changeHasRepeatabilityReq({ sportId: props.selectedSport.state?.sportId!, entityId: props.selectedExercise.state.exerciseId, hasRepeatability: hasRepeatability, entityIsExercise: true });

			if (response.status === 200) {
				const newExercise = {
					...props.selectedExercise.state,
					hasRepeatability: hasRepeatability,
				};

				setNewExercise(newExercise);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	// #endregion

	// #region Repeatability Quantity
	const handleChangeExerciseRepeatabilityQuantity = async (value: string) => {
		const repeatabilityQuantity = Number(value);

		if (isNaN(repeatabilityQuantity)) return;

		try {
			const response = await changeRepeatabilityQuantityReq({ sportId: props.selectedSport.state?.sportId || -1, entityId: props.selectedExercise.state.exerciseId, repeatabilityQuantity, entityIsExercise: true });

			if (response.status === 200) {
				const newExercise = {
					...props.selectedExercise.state,
					repeatabilityQuantity: repeatabilityQuantity,
				} as Exercise;

				setNewExercise(newExercise);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	// #endregion

	//	#region Loose Exercises
	const [looseConnections, setLooseConnections] = useState<Exercise[]>([]);

	useEffect(() => {
		const newLooseConnections = [] as Exercise[];
		relatedExercises.map((exercise) => (props.selectedExercise.state.looseConnection.includes(exercise.exerciseId) ? newLooseConnections.push(exercise) : null));
		setLooseConnections(newLooseConnections);
	}, [relatedExercises]);

	const [looseConnectionsOpen, setLooseConnectionsOpen] = useState(false);
	const looseConnectionsAutocompleteRef = useRef(null);
	const looseConnectionInputRef = useRef<HTMLInputElement>(null);
	const [looseMounted, setLooseMounted] = useState(false);

	const [looseInputValue, setLooseInputValue] = useState<string[]>([]);

	useEffect(() => {
		setLooseMounted(false);

		let newRelatedExercises = [] as Exercise[];
		props.selectedSport.state?.hasCategories
			? props.categoriesData.state.map((category) => (category.categoryId === props.categoryId ? (newRelatedExercises = category.exercises.filter((exercise) => exercise !== props.selectedExercise.state)) : null))
			: (newRelatedExercises = props.exercisesData.state.filter((exercise) => exercise !== props.selectedExercise.state));

		let looseInputValues: string[] = [];
		newRelatedExercises.map((exercise) => (props.selectedExercise.state.looseConnection.includes(exercise.exerciseId) ? looseInputValues.push(exercise.exerciseName) : null));

		setLooseInputValue(looseInputValues);

		setTimeout(() => {
			setLooseMounted(true);
		}, 0);
	}, [props.exerciseId]);

	useEffect(() => {
		if (!looseMounted) return;

		setTimeout(() => {
			looseConnectionInputRef.current?.focus();
		}, 50);
	}, [looseInputValue]);

	const handleChangeLooseConnections = async (exercises: Exercise[]) => {
		const looseExercisesIds = exercises.map((exercise) => exercise.exerciseId);

		try {
			const response = await changeLooseEntityReq({ sportId: props.selectedSport.state?.sportId!, entityId: props.selectedExercise.state.exerciseId, entityIsExercise: true, looseEntitiesIds: looseExercisesIds });

			if (response.status === 200) {
				const newExercise = {
					...props.selectedExercise.state,
					looseConnection: looseExercisesIds,
				} as Exercise;

				setNewExercise(newExercise);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	//	#endregion

	//	#region Tight Exercises
	const [tightConnection, setTightConnection] = useState<Exercise | undefined>();

	const [tightConnectionOpen, setTightConnectionOpen] = useState(false);
	const tightConnectionAutocompleteRef = useRef(null);
	const tightConnectionInputRef = useRef<HTMLInputElement>(null);
	const [tightInputValue, setTightInputValue] = useState<string>("");
	const [tightInputShow, setTightInputShow] = useState<string>(tightConnection?.exerciseName ?? "");

	useEffect(() => {
		let newRelatedExercises = [] as Exercise[];
		props.selectedSport.state?.hasCategories
			? props.categoriesData.state.map((category) => (category.categoryId === props.categoryId ? (newRelatedExercises = category.exercises.filter((exercise) => exercise !== props.selectedExercise.state)) : null))
			: (newRelatedExercises = props.exercisesData.state.filter((exercise) => exercise !== props.selectedExercise.state));

		const tightExercise = newRelatedExercises.find((exercise) => exercise.exerciseId === props.selectedExercise.state.tightConnection);
		setTightConnection(tightExercise);
		setTightInputShow(tightExercise?.exerciseName || "");
	}, []);

	const handleChangeTightConnection = async (exercise: Exercise | undefined) => {
		try {
			const response = await changeTightConnectionReq({
				sportId: props.selectedSport.state?.sportId!,
				entityId: props.selectedExercise.state.exerciseId,
				entityIsExercise: true,
				tightConnectionEntityId: exercise ? exercise.exerciseId : undefined,
			});

			if (response.status === 200) {
				const newExercise = {
					...props.selectedExercise.state,
					tightConnection: exercise ? exercise.exerciseId : null,
				} as Exercise;

				setNewExercise(newExercise);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const getTightConnectionName = () => {
		let tightConnectionName;

		if (props.selectedExercise.state.tightConnection)
			props.selectedSport.state?.hasCategories
				? (tightConnectionName = props.categoriesData.state
						.find((category) => props.selectedExercise.state.categoryId === category.categoryId)
						?.exercises.find((exercise) => exercise.exerciseId === props.selectedExercise.state.tightConnection)?.exerciseName)
				: (tightConnectionName = props.exercisesData.state.find((exercise) => exercise.exerciseId === props.selectedExercise.state.tightConnection)?.exerciseName);

		return tightConnectionName;
	};
	//	#endregion

	//	#region Priority Points
	const handleChangePriorityPoints = (clickedPriorityPoint: number) => {
		setTimeout(async () => {
			const priorityPoints: number[] = props.selectedExercise.state.priorityPoints.includes(clickedPriorityPoint)
				? props.selectedExercise.state.priorityPoints.filter((point) => point !== clickedPriorityPoint)
				: [...props.selectedExercise.state.priorityPoints, clickedPriorityPoint];

			try {
				const response = await changePriorityPointsReq({
					sportId: props.selectedSport.state?.sportId!,
					entityId: props.selectedExercise.state.exerciseId,
					entityIsExercise: true,
					priorityPoints: priorityPoints,
				});

				if (response.status === 200) {
					const newExercise = {
						...props.selectedExercise.state,
						priorityPoints: priorityPoints,
					} as Exercise;

					setNewExercise(newExercise);
				}

				consoleLogPrint(response);
			} catch (error) {
				console.error("Error: ", error);
			}
		}, 100);
	};

	const PriorityPointsButtons = () => {
		const [firstButtonClicked, setFirstButtonClicked] = useState<boolean>(props.selectedExercise.state.priorityPoints.includes(1));
		const [secondButtonClicked, setSecondButtonClicked] = useState<boolean>(props.selectedExercise.state.priorityPoints.includes(2));
		const [thirdButtonClicked, setThirdButtonClicked] = useState<boolean>(props.selectedExercise.state.priorityPoints.includes(3));

		return (
			<Box className="flex gap-6 ml-4 relative">
				<ButtonComp
					externalClicked={{ state: firstButtonClicked, setState: setFirstButtonClicked }}
					size="small"
					disabled={!props.editing.state && !firstButtonClicked}
					onClick={
						props.editing.state
							? () => {
									handleChangePriorityPoints(1);
							  }
							: undefined
					}
					content="1"
				/>

				<ButtonComp
					externalClicked={{ state: secondButtonClicked, setState: setSecondButtonClicked }}
					size="small"
					disabled={!props.editing.state && !secondButtonClicked}
					onClick={
						props.editing.state
							? () => {
									handleChangePriorityPoints(2);
							  }
							: undefined
					}
					content="2"
				/>

				<ButtonComp
					externalClicked={{ state: thirdButtonClicked, setState: setThirdButtonClicked }}
					size="small"
					disabled={!props.editing.state && !thirdButtonClicked}
					onClick={
						props.editing.state
							? () => {
									handleChangePriorityPoints(3);
							  }
							: undefined
					}
					content="3"
				/>
			</Box>
		);
	};

	const ConcreteExample = () => {
		const priorityPoints = props.selectedExercise.state.priorityPoints;
		let message: string;

		if (priorityPoints.length === 0) {
			message = "Tento cvik nemá žádné prioritní body, tím pádem nebude použit v automatické tvorbě tréninku.";
		} else if (priorityPoints.length === 3) {
			message = `Tento cvik má všechny prioritní body, tím pádem se může nacházet v jakékoliv třetině ${props.selectedSport.state?.hasCategories ? "kategorie" : "dne"}.`;
		} else {
			const points = [1, 2].every((point) => priorityPoints.includes(point))
				? "body 1 a 2"
				: [2, 3].every((point) => priorityPoints.includes(point))
				? "body 2 a 3"
				: [1, 3].every((point) => priorityPoints.includes(point))
				? "body 1 a 3"
				: priorityPoints.includes(1)
				? "bod 1"
				: priorityPoints.includes(2)
				? "bod 2"
				: "bod 3";

			const secondPoints = [1, 2].every((point) => priorityPoints.includes(point))
				? "1. a 2."
				: [2, 3].every((point) => priorityPoints.includes(point))
				? "2. a 3."
				: [1, 3].every((point) => priorityPoints.includes(point))
				? "1. a 3."
				: priorityPoints.includes(1)
				? "1."
				: priorityPoints.includes(2)
				? "2."
				: "3.";

			message = `Vybraný cvik má prioritní ${points}, tím pádem se může nacházet v ${secondPoints} třetině ${props.selectedSport.state?.hasCategories ? "kategorie" : "dne"}.`;
		}

		return (
			<Box className="flex mt-6">
				<Typography className="mr-2 text-nowrap">Konkrétní příklad</Typography>
				<Typography className="mr-2 opacity-50 font-light">»</Typography>
				<Typography className="font-light">{message}</Typography>
			</Box>
		);
	};

	//	#endregion

	//	#region Blacklist
	const [blacklist, setBlacklist] = useState<Exercise[]>([]);

	const [blacklistOpen, setBlacklistOpen] = useState(false);
	const blacklistAutocompleteRef = useRef(null);
	const blacklistInputRef = useRef<HTMLInputElement>(null);

	const [blacklistInputValue, setBlacklistInputValue] = useState<string[]>([]);

	const [blacklistMounted, setBlacklistMounted] = useState(false);

	useEffect(() => {
		if (!blacklistMounted) return;

		setTimeout(() => {
			blacklistInputRef.current?.focus();
		}, 50);
	}, [blacklistInputValue]);

	useEffect(() => {
		const newBlacklist = [] as Exercise[];
		relatedExercises.map((exercise) => (props.selectedExercise.state.blacklist.includes(exercise.exerciseId) ? newBlacklist.push(exercise) : null));
		setBlacklist(newBlacklist);
	}, [relatedExercises]);

	useEffect(() => {
		setBlacklistMounted(false);

		let newRelatedExercises = [] as Exercise[];
		props.selectedSport.state?.hasCategories
			? props.categoriesData.state.map((category) => (category.categoryId === props.categoryId ? (newRelatedExercises = category.exercises.filter((exercise) => exercise !== props.selectedExercise.state)) : null))
			: (newRelatedExercises = props.exercisesData.state.filter((exercise) => exercise !== props.selectedExercise.state));

		let blacklistInputValues: string[] = [];
		newRelatedExercises.map((exercise) => (props.selectedExercise.state.blacklist.includes(exercise.exerciseId) ? blacklistInputValues.push(exercise.exerciseName) : null));

		setBlacklistInputValue(blacklistInputValues);

		setTimeout(() => {
			setBlacklistMounted(true);
		}, 0);
	}, [props.exerciseId]);

	const handleChangeBlacklist = async (exercises: Exercise[]) => {
		const blacklistExercisesIds = exercises.map((exercise) => exercise.exerciseId);

		try {
			const response = await changeBlacklistReq({ sportId: props.selectedSport.state?.sportId!, entityId: props.selectedExercise.state.exerciseId, entityIsExercise: true, blacklistEntitiesIds: blacklistExercisesIds });

			if (response.status === 200) {
				const newExercise = {
					...props.selectedExercise.state,
					blacklist: blacklistExercisesIds,
				} as Exercise;

				setNewExercise(newExercise);

				if (props.selectedSport.state?.hasCategories) {
					props.categoriesData.setState((prevCategories) =>
						prevCategories.map((category) => {
							if (category.categoryId === props.categoryId) {
								const selectedId = props.selectedExercise.state.exerciseId;
								const oldExercises = category.exercises;
								const exerciseIds = exercises.map((exercise) => exercise.exerciseId);

								const deletedOldBlacklistIds: Exercise[] = oldExercises.map((exercise) =>
									exercise.blacklist.includes(selectedId) ? (!exerciseIds.includes(exercise.exerciseId) ? { ...exercise, blacklist: exercise.blacklist.filter((blacklist) => blacklist !== selectedId) } : exercise) : exercise
								);

								const addedNewBlacklistIds: Exercise[] = deletedOldBlacklistIds.map((exercise) =>
									!exercise.blacklist.includes(selectedId)
										? exerciseIds.includes(exercise.exerciseId)
											? {
													...exercise,
													blacklist: [...exercise.blacklist, selectedId],
													tightConnection: exercise.tightConnection === selectedId ? null : exercise.tightConnection,
													looseConnection: exercise.looseConnection.filter((loose) => loose !== selectedId),
											  }
											: exercise
										: exercise
								);

								return {
									...category,
									exercises: addedNewBlacklistIds,
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
	//	#endregion

	// #region Comp

	useEffect(() => {
		if ([blacklistOpen, looseConnectionsOpen, tightConnectionOpen].includes(true)) setOverflowHidden(true);
		else setOverflowHidden(false);
	}, [blacklistOpen, looseConnectionsOpen, tightConnectionOpen]);

	const AutomaticPlanCreationSettings = () => {
		return (
			<Box className="mt-4">
				<Title title="Údaje ovlivňující automatickou tvorbu" />

				<Box className="space-y-8 mt-3 ml-2">
					<Box className="space-y-2">
						<Typography className="text-lg">Opakovatelnost</Typography>
						<Box className="ml-4">
							<Typography className=" font-light">Určuje, zda a maximálně kolikrát se daný cvik může v rámci tréninku opakovat.</Typography>
							<Box className="flex items-center mt-3">
								{props.editing.state ? (
									<FormControlLabel
										className=""
										control={
											<Checkbox
												checked={props.selectedExercise.state.hasRepeatability}
												onChange={handleChangeExerciseHasRepeatability}
											/>
										}
										label={props.selectedExercise.state.hasRepeatability ? "Cvik se může opakovat." : "Cvik se nesmí opakovat."}
									/>
								) : props.selectedExercise.state.hasRepeatability ? (
									<Typography className=" py-2">Cvik se může opakovat maximálně {props.selectedExercise.state.repeatabilityQuantity} krát.</Typography>
								) : (
									<Typography className="py-2">Cvik se nesmí opakovat.</Typography>
								)}

								{props.editing.state && props.selectedExercise.state.hasRepeatability ? (
									<Box className="ml-6 flex items-center">
										<LabelAndValue
											noPaddingTop
											label="Maximální počet opakování"
											showArrow
											disableSelection
											onClick={() => {
												console.log("");
											}}
										/>

										<TextFieldWithIcon
											dontDeleteValue
											tfCenterValueAndPlaceholder
											onlyNumbers
											onClickForBlur
											withoutIcon
											cantBeZero
											style="w-16"
											icon={IconEnum.CHECK}
											maxLength={2}
											previousValue={props.selectedExercise.state.repeatabilityQuantity.toString()}
											onClick={(value) => {
												handleChangeExerciseRepeatabilityQuantity(value);
											}}
										/>
									</Box>
								) : null}
							</Box>
						</Box>
					</Box>

					<Box className="space-y-2">
						<Typography className="text-lg">Volná návaznost</Typography>
						<Box className="ml-4">
							<Typography className=" font-light">Zvyšuje pravděpodobnost, že po tomto cviku budou následovat vybrané cviky.</Typography>
							{!!props.selectedExercise.state.tightConnection ? (
								<Box className=" mt-5">
									<Typography>Volnou návaznost nelze použít, když je aktivní pevná návaznost.</Typography>
								</Box>
							) : (
								<Box className=" mt-5">
									{props.editing.state ? (
										<Typography>Vybrané cviky s volnou návazností:</Typography>
									) : props.selectedExercise.state.looseConnection.length > 0 ? (
										<Typography>Vybrané cviky s volnou návazností:</Typography>
									) : (
										<Typography>Nejsou vybrány cviky pro volnou návaznost.</Typography>
									)}

									{props.editing.state ? (
										<ClickAwayListener onClickAway={() => setLooseConnectionsOpen(false)}>
											<Autocomplete
												ref={looseConnectionsAutocompleteRef}
												multiple
												options={relatedExercises.filter((exercise) => !blacklist.some((blacklist) => blacklist.exerciseId === exercise.exerciseId))}
												disableCloseOnSelect
												open={looseConnectionsOpen}
												disableClearable
												noOptionsText="Žádný vhodný cvik nenalezen"
												onOpen={() => {
													setBlacklistOpen(false);
													setTightConnectionOpen(false);
													setLooseConnectionsOpen(true);

													setTimeout(() => {
														looseConnectionInputRef.current?.focus();
													}, 0);
												}}
												onClose={() => setLooseConnectionsOpen(false)}
												value={looseConnections}
												onChange={(event, newValue) => {
													setLooseConnections(newValue);
													handleChangeLooseConnections(newValue);

													setLooseInputValue(newValue.map((exercise) => exercise.exerciseName));
												}}
												getOptionLabel={(option) => option.exerciseName}
												renderOption={(props, option, { selected }) => (
													<li
														{...props}
														key={"op-" + option.exerciseId}
														className={`px-3 py-1.5 hover:cursor-pointer  flex w-full duration-150 transition-all
         															${context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}
																	${selected && context.bgQuaternaryColor}`}>
														<Typography
														
															className={`    font-light
																${selected ? "w-2 opacity-50" : "opacity-0"}`}>
															{selected ? "»" : ""}
														</Typography>
														<Typography
														
															className={`w-full 
																${selected ? "translate-x-2" : ""}`}>
															{option.exerciseName}
														</Typography>
													</li>
												)}
												renderTags={(tagValue, getTagProps) =>
													looseInputValue.map((option, index) => (
														<Box
															key={index}
															onClick={() => {
																setLooseConnectionsOpen(true);

																setTimeout(() => {
																	looseConnectionInputRef.current?.focus();
																}, 0);
															}}
															className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center mr-2
																	${context.borderTertiaryColor + context.bgTertiaryColor}`}>
															<Typography className=" text-base bg-transparent w-fit px-1.5 py-0.5">{option}</Typography>
														</Box>
													))
												}
												renderInput={(params) => (
													<Box className="flex items-end min-h-11">
														<TextField
															{...params}
															inputRef={looseConnectionInputRef}
															variant="standard"
															placeholder={looseConnections.length === 0 ? "Vyberte cviky" : ""}
															sx={{
																"& .MuiInput-underline:after": {
																	borderBottom: "#B4B4B4", // zruší čáru při focusu
																},
															}}
														/>
													</Box>
												)}
												PaperComponent={(props) => (
													<Paper
														{...props}
														className={`text-[#E9E9E9] font-light border-2 rounded-xl mt-1
																${context.bgSecondaryColor} ${context.borderQuaternaryColor}`}
													/>
												)}
											/>
										</ClickAwayListener>
									) : (
										<Box>
											<Box className="flex mt-1 flex-wrap">
												{looseConnections.map((exercise, index) => (
													<Box
														key={index}
														className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center mr-2
															${context.borderTertiaryColor + context.bgTertiaryColor}`}>
														<Typography className=" text-base bg-transparent w-fit px-1.5 py-0.5">{exercise.exerciseName}</Typography>
													</Box>
												))}
											</Box>
										</Box>
									)}
								</Box>
							)}
						</Box>
					</Box>

					<Box className="space-y-2">
						<Typography className="text-lg">Pevná návaznost</Typography>
						<Box className="ml-4">
							<Typography className=" font-light">
								Zajišťuje, že po tomto cviku bude vždy následovat vybraný cvik. Jestliže je vybrán cvik pro pevnou návaznost, tak není možné vybírat cviky pro volnou návaznost. Pokud by přidání vybraného cviku s pevnou navázností
								bylo přes maximální hranici počtu cviků, tak se nepřidá.
							</Typography>
							<Box className="flex mt-3 h-10 gap-2 items-center">
								{props.editing.state ? (
									<Typography>Vybraný cvik s pevnou návazností:</Typography>
								) : props.selectedExercise.state.tightConnection ? (
									<Typography>Vybraný cvik s pevnou návazností:</Typography>
								) : (
									<Typography>Není vybrán cvik pro pevnou návaznost.</Typography>
								)}

								{props.selectedExercise.state.tightConnection ? (
									props.editing.state ? (
										<Box
											onClick={() => {
												setTightConnectionOpen(true);

												setTimeout(() => {
													tightConnectionInputRef.current?.focus();
												}, 0);
											}}
											className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center 
																	${context.borderTertiaryColor + context.bgTertiaryColor}`}>
											<Typography className=" text-base bg-transparent w-fit px-1.5 py-0.5">{getTightConnectionName()}</Typography>
										</Box>
									) : (
										<Box
											className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center 
																	${context.borderTertiaryColor + context.bgTertiaryColor}`}>
											<Typography className=" text-base bg-transparent w-fit px-1.5 py-0.5">{getTightConnectionName()}</Typography>
										</Box>
									)
								) : null}
							</Box>

							{props.editing.state ? (
								<ClickAwayListener onClickAway={() => setTightConnectionOpen(false)}>
									<Autocomplete
										ref={tightConnectionAutocompleteRef}
										options={relatedExercises.filter((ex) => !blacklist.some((b) => b.exerciseId === ex.exerciseId))}
										disableClearable
										open={tightConnectionOpen} // řízené otevírání
										noOptionsText="Žádný vhodný cvik nenalezen"
										onOpen={() => {
											setBlacklistOpen(false);
											setLooseConnectionsOpen(false);
											setTightConnectionOpen(true);
											setTimeout(() => tightConnectionInputRef.current?.focus(), 0);
										}}
										onClose={() => setTightConnectionOpen(false)}
										inputValue={tightInputValue} // řízený text
										onInputChange={(e, newVal) => {
											setTightInputValue(newVal);
											setTimeout(() => tightConnectionInputRef.current?.focus(), 0);
										}}
										clearOnBlur={false} // zamezí vyčištění při blur
										getOptionLabel={(option) => option.exerciseName}
										renderOption={(props, option, { selected }) => {
											const handleOptionClick = () => {
												if (tightConnection?.exerciseId === option.exerciseId) {
													setTightConnection(undefined);
													handleChangeTightConnection(undefined);
												} else {
													setTightConnection(option);
													handleChangeTightConnection(option);
												}
												setTightConnectionOpen(false);
												setTightInputValue("");
												setTightInputShow(tightConnection?.exerciseId === option.exerciseId ? "" : option.exerciseName);
											};
											return (
												<li
													{...props}
													onClick={handleOptionClick}
													key={"op-" + option.exerciseId}
													className={`px-3 py-1.5 hover:cursor-pointer flex w-full
													${context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}
													${tightInputShow === option.exerciseName && context.bgQuaternaryColor}`}>
													<Typography className={`font-light ${tightInputShow === option.exerciseName ? "w-2 opacity-50" : "opacity-0"}`}>{tightInputShow === option.exerciseName ? "»" : ""}</Typography>
													<Typography className={`w-full ${tightInputShow === option.exerciseName ? "translate-x-2" : ""}`}>{option.exerciseName}</Typography>
												</li>
											);
										}}
										renderInput={(params) => (
											<TextField
												{...params}
												inputRef={tightConnectionInputRef}
												variant="standard"
												placeholder={tightInputShow ? "Vyberte jiný cvik" : "Vyberte cvik"}
											/>
										)}
										PaperComponent={(props) => (
											<Paper
												{...props}
												className={`text-[#E9E9E9] font-light border-2 rounded-xl mt-1
																${context.bgSecondaryColor} ${context.borderQuaternaryColor}`}
											/>
										)}
									/>
								</ClickAwayListener>
							) : null}
						</Box>
					</Box>

					<Box className="space-y-2">
						<Typography className="text-lg">Prioritní body</Typography>
						<Box className="ml-4">
							<Typography className=" font-light">
								Tomuto cviku lze přiřadit prioritní body 1, 2 a 3. Tyto body určují, do jaké třetiny {props.selectedSport.state?.hasCategories ? "dané kategorie" : "daného dne"} bude cvik přiřazen. Cvik může mít přiřazeno více
								piroritních bodů. Pokud cvik nemá přiřazen žádný prioritní bod, tak nebude použit v automatické tvorbě tréninku.
							</Typography>

							<Box className="flex mt-6">
								<Typography>Prioritní body</Typography>

								<PriorityPointsButtons />
							</Box>

							<ConcreteExample />
						</Box>
					</Box>

					<Box className="space-y-2">
						<Typography className="text-lg">Blacklist</Typography>
						<Box className="ml-4">
							<Typography className=" font-light">Zvolené cviky se nebudou v rámci {props.selectedSport.state?.hasCategories ? "dané kategorie" : "daného dne"} vyskytovat společně s tímto cvikem.</Typography>
							<Box className=" mt-5">
								{props.editing.state ? (
									<Typography>Cviky zařazené do blacklistu:</Typography>
								) : props.selectedExercise.state.blacklist.length > 0 ? (
									<Typography>Cviky zařazené do blacklistu:</Typography>
								) : (
									<Typography>Nejsou zařazeny cviky do blacklistu.</Typography>
								)}

								{props.editing.state ? (
									<ClickAwayListener onClickAway={() => setBlacklistOpen(false)}>
										<Autocomplete
											ref={blacklistAutocompleteRef}
											multiple
											options={relatedExercises.filter((exercise) => exercise.exerciseId !== tightConnection?.exerciseId && !looseConnections.some((loose) => loose.exerciseId === exercise.exerciseId))}
											disableCloseOnSelect
											open={blacklistOpen}
											disableClearable
											noOptionsText="Žádný vhodný cvik nenalezen"
											onOpen={() => {
												setLooseConnectionsOpen(false);
												setTightConnectionOpen(false);

												setBlacklistOpen(true);

												setTimeout(() => {
													blacklistInputRef.current?.focus();
												}, 0);
											}}
											onClose={() => setBlacklistOpen(false)}
											value={blacklist}
											onChange={(event, newValue) => {
												setBlacklist(newValue);
												handleChangeBlacklist(newValue);

												setBlacklistInputValue(newValue.map((exercise) => exercise.exerciseName));
											}}
											getOptionLabel={(option) => option.exerciseName}
											renderOption={(props, option, { selected }) => (
												<li
													{...props}
													key={"op-" + option.exerciseId}
													className={`px-3 py-1.5 hover:cursor-pointer  flex w-full
         															${context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}
																	${selected && context.bgQuaternaryColor}`}>
													<Typography
														className={`    font-light
																${selected ? "w-2 opacity-50" : "opacity-0"}`}>
														{selected ? "»" : ""}
													</Typography>
													<Typography
														className={`w-full 
																${selected ? "translate-x-2" : ""}`}>
														{option.exerciseName}
													</Typography>
												</li>
											)}
											renderTags={(tagValue, getTagProps) =>
												blacklistInputValue.map((option, index) => (
													<Box
														key={index}
														onClick={() => {
															setLooseConnectionsOpen(true);

															setTimeout(() => {
																looseConnectionInputRef.current?.focus();
															}, 0);
														}}
														className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center mr-2
																	${context.borderTertiaryColor + context.bgTertiaryColor}`}>
														<Typography   className=" text-base bg-transparent w-fit px-1.5 py-0.5">{option}</Typography>
													</Box>
												))
											}
											renderInput={(params) => (
												<Box className="flex items-end min-h-11">
													<TextField
														{...params}
														inputRef={blacklistInputRef}
														variant="standard"
														placeholder={blacklist.length === 0 ? "Vyberte cviky" : ""}
													/>
												</Box>
											)}
											PaperComponent={(props) => (
												<Paper
													{...props}
													className={`text-[#E9E9E9] font-light border-2 rounded-xl mt-1
																${context.bgSecondaryColor} ${context.borderQuaternaryColor}`}
												/>
											)}
										/>
									</ClickAwayListener>
								) : (
									<Box>
										<Box className="flex mt-1 flex-wrap">
											{blacklist.map((exercise, index) => (
												<Box
													key={index}
													className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center mr-2 
															${context.borderTertiaryColor + context.bgTertiaryColor}`}>
													<Typography className=" text-base bg-transparent  w-fit px-1.5 py-0.5">{exercise.exerciseName}</Typography>
												</Box>
											))}
										</Box>
									</Box>
								)}
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		);
	};
	// #endregion

	// #endregion
	//

	//
	//	#region Main Comp
	//
	const [overflowHidden, setOverflowHidden] = useState(false);

	return (
		<>
			<GeneralCard
				key={props.exerciseId}
				showFirstSection={{ state: props.isActiveFirstChildren.state, setState: props.isActiveFirstChildren.setState }}
				secondTitle="Podrobnosti"
				firstTitle="Popis"
				height="h-full"
				style={overflowHidden ? "overflow-hidden" : ""}
				secondChildren={
					<Box className="flex flex-col  ">
						<LabelAndValue
							noPaddingTop
							label="Název cviku"
							value={props.exerciseName}
						/>
						{props.selectedSport.state?.hasCategories ? (
							props.editing.state ? (
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
							)
						) : (
							<></>
						)}

						{props.selectedSport.state?.hasDifficulties ? (
							props.editing.state ? (
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
							)
						) : null}

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
										<MenuItem value="1">Kilogram</MenuItem>
										<MenuItem value="2">Sekunda</MenuItem>
										<MenuItem value="3">Minuta</MenuItem>
										<MenuItem value="4">Hodina</MenuItem>
										<MenuItem value="5">Metr</MenuItem>
										<MenuItem value="6">Kilometr</MenuItem>
										<MenuItem value="7">Bez jednotky</MenuItem>
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
												onClickForBlur={true}
												withoutIcon
												textFieldValue={findValue(label.exerciseInformationLabelId)}
												textFieldOnClick={(value) => handleCreateExerciseInformationValue(value, label.exerciseInformationLabelId)}
												icon={IconEnum.CHECK}
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
								style="w-2/5 ml-2 pt-4 "
								onClick={handleCreateExerciseInformationLabel}
							/>
						)}

						{props.selectedSport.state?.hasRecommendedValues && !props.selectedSport.state.hasRecommendedDifficultyValues ? (
							<Box className="mt-4">
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
											onClickForBlur
											withoutIcon
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
											onClickForBlur
											withoutIcon
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
											onClickForBlur
											withoutIcon
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
							</Box>
						) : (exerciseDifficulties.length > 0 && props.selectedSport.state?.hasRecommendedDifficultyValues) || (props.selectedSport.state?.hasRecommendedDifficultyValues && props.editing.state) ? (
							<RecommendedDifficultyValues />
						) : (
							<></>
						)}

						{props.selectedSport.state?.hasAutomaticPlanCreation ? <AutomaticPlanCreationSettings /> : <></>}
					</Box>
				}
				firstChildren={
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
	//	#endregion
};

export default ExerciseInformations;
