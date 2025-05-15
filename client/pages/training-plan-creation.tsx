import { changeTrainingPlanReq } from "@/api/change/changeTrainingPlanReq";
import { createTrainingPlanReq } from "@/api/create/createTrainingPlanReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { Category } from "@/api/get/getCategoriesWithExercisesReq";
import { getDifficultiesReq } from "@/api/get/getDifficultiesReq";
import { Exercise } from "@/api/get/getExercisesReq";
import { getSportDetailLabsAndValsReq } from "@/api/get/getSportDetailLabsAndValsReq";
import { Sport } from "@/api/get/getSportsReq";
import { getTrainingPlanCreationPropsReq } from "@/api/get/getTrainingPlanCreationPropsReq";
import { getTrainingPlanExercisesReq } from "@/api/get/getTrainingPlanExercisesReq";
import { getTrainingPlansReq } from "@/api/get/getTrainingPlansReq";
import { getVisitedUserDifficultiesReq } from "@/api/get/getVisitedUserDifficultiesReq";
import { getVisitedUserSportDetailLabsAndValsReq } from "@/api/get/getVisitedUserSportDetailLabsAndValsReq";
import { getVisitedUserTrainingPlanCreationPropsReq } from "@/api/get/getVisitedUserTrainingPlanCreationPropsReq";
import { getVisitedUserTrainingPlanExercisesReq } from "@/api/get/getVisitedUserTrainingPlanExercisesReq";
import { getVisitedUserTrainingPlansReq } from "@/api/get/getVisitedUserTrainingPlansReq";
import { ExerciseDifficulty } from "@/components/large/ExerciseInformations";
import GeneralCard from "@/components/large/GeneralCard";
import { SportDifficulty } from "@/components/large/SportDescriptionAndSettings";
import { SportDetailLabAndVal } from "@/components/large/SportDetails";
import { TrainingPlan } from "@/components/large/TrainingPlansAndCreation";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import ButtonComp, { IconEnum } from "@/components/small/ButtonComp";
import TextFieldWithIcon from "@/components/small/TextFieldWithIcon";
import { useAppContext } from "@/utilities/Context";
import { Autocomplete, Box, FormControl, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { TrainingPlanExercise, UnitShortcuts } from "./training-plan";

const cookie = require("cookie");

export interface LocalDay {
	nthDay: number;
	categories: LocalCategory[];
}

interface LocalCategory {
	nthDay: number;
	nthCategory: number;
	categoryName: string;
	exercises: LocalExercise[];
}

interface LocalExercise {
	nthDay: number;
	nthCategory: number;
	nthExercise: number;

	categoryName: string;

	exerciseName: string;
	exerciseId: number;

	repetitions: number;
	series: number;
	burden: number;
	unitCode: number;

	boxHeight?: number;
	isVisible?: boolean;
}

interface Props {
	selectedSport: Sport;

	automaticCreationDays?: LocalDay[];

	categoriesData: Category[];
	exercisesData: Exercise[];
	recommendedDifficultiesData: ExerciseDifficulty[];

	labsAndVals: SportDetailLabAndVal[];
	difficulties: SportDifficulty[];

	edit?: boolean;
	trainingPlan?: TrainingPlan;
	trainingPlanExercises?: TrainingPlanExercise[];
}

const ManualCreation = (props: Props) => {
	const context = useAppContext();

	const [days, setDays] = useState<LocalDay[]>(props.automaticCreationDays || []);
	const [showMoveAndDeleteButtons, setShowMoveAndDeleteButtons] = useState<boolean>(false); // TODO → doimplementovat ?
	const [showRecommendeValues, setShowRecommendeValues] = useState<boolean>(false);

	const [exerciseSearchInputValue, setExerciseSearchInputValue] = useState<{ [key: string]: string }>({});
	const [exerciseSearchValue, setExerciseSearchValue] = useState<{ [key: string]: string }>({});

	const [categorySearchInputValue, setCategorySearchInputValue] = useState<{ [key: string]: string }>({});
	const [categorySearchValue, setCategorySearchValue] = useState<{ [key: string]: string }>({});

	const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
	const [exerciseOptions, setExerciseOptions] = useState<{ category: string; exercises: string[] }[]>([]);
	const [exerciseOptionsWithoutCategory, setExerciseOptionsWithoutCategory] = useState<string[]>([]);
	//const [exerciseIds, setExerciseIds] = useState<{ exerciseName: string; exerciseId: number }[]>([]);

	const concreteDifficulty = props.difficulties.find((diff) => diff.difficultyName === props.labsAndVals.find((labAndVal) => labAndVal.orderNumber === 7)?.value);

	useEffect(() => {
		if (props.categoriesData) {
			setCategoryOptions(props.categoriesData.map((category) => category.categoryName));
		}

		const possibleDifficultiesIds = props.difficulties.filter((diff) => diff.orderNumber <= concreteDifficulty?.orderNumber!).map((diff) => diff.sportDifficultyId);

		//let exerciseIds: { exerciseName: string; exerciseId: number }[] = [];

		if (props.selectedSport.hasCategories) {
			const newCategoryWithExercises = props.categoriesData.map((category) => {
				const exercisesExplorer = props.selectedSport.hasDifficulties ? category.exercises.filter((exercise) => possibleDifficultiesIds.includes(exercise.sportDifficultyId)) : category.exercises;

				const exercises = exercisesExplorer.map((exercise) => exercise.exerciseName);

				/*category.exercises.map((exercise) => {
					exerciseIds.push({ exerciseName: exercise.exerciseName, exerciseId: exercise.exerciseId });
				});*/

				return {
					category: category.categoryName,
					exercises: exercises,
				};
			});
			setExerciseOptions(newCategoryWithExercises);
		} else {
			const exercisesExplorer = props.selectedSport.hasDifficulties ? props.exercisesData.filter((exercise) => possibleDifficultiesIds.includes(exercise.sportDifficultyId)) : props.exercisesData;

			const newExercisesOptions = exercisesExplorer.map((exercise) => {
				//exerciseIds.push({ exerciseName: exercise.exerciseName, exerciseId: exercise.exerciseId });
				return exercise.exerciseName;
			});

			setExerciseOptionsWithoutCategory(newExercisesOptions);
		}

		//setExerciseIds(exerciseIds);
	}, [props]);

	useEffect(() => {
		if (props.edit && props.trainingPlanExercises) {
			const dayMap = new Map<number, LocalDay>();

			for (const ex of props.trainingPlanExercises) {
				if (!dayMap.has(ex.nthDay)) {
					dayMap.set(ex.nthDay, {
						nthDay: ex.nthDay,
						categories: [],
					});
				}
				const day = dayMap.get(ex.nthDay)!;

				let category = day.categories.find((c) => c.nthCategory === ex.nthCategory);
				if (!category) {
					category = {
						nthDay: ex.nthDay,
						nthCategory: ex.nthCategory,
						categoryName: ex.categoryName,
						exercises: [],
					};
					day.categories.push(category);
				}

				category.exercises.push({
					exerciseId: ex.exerciseId,

					nthDay: ex.nthDay,
					nthCategory: ex.nthCategory,
					nthExercise: ex.nthExercise,

					categoryName: ex.categoryName,
					exerciseName: ex.exerciseName,

					repetitions: ex.repetitions,
					series: ex.series,
					burden: ex.burden,

					unitCode: ex.unitCode,

					isVisible: true,
				});
			}

			setDays(Array.from(dayMap.values()));

			if (props.trainingPlan) {
				setTrainingPlanName(props.trainingPlan.name);
				setTrainingPlanHasBurdenAndUnit(props.trainingPlan.hasBurdenAndUnit);
				setTrainingPlanUnitCode(props.trainingPlan.unitCode);
			}
		}
	}, [props]);

	// #region Day
	const [justAddedDay, setJustAddedDay] = useState<number | null>(null);

	const addDay = () => {
		let emptyCategory;
		if (!props.selectedSport.hasCategories) {
			emptyCategory = {
				nthDay: days.length > 0 ? days[days.length - 1].nthDay + 1 : 1,
				nthCategory: 1,
				categoryName: "",
				exercises: [],
			} as LocalCategory;
		}

		const newDay = {
			nthDay: days.length > 0 ? days[days.length - 1].nthDay + 1 : 1,
			categories: props.selectedSport.hasCategories ? [] : [emptyCategory],
		} as LocalDay;
		setDays([...days, newDay]);

		setJustAddedDay(newDay.nthDay);

		// Po 500ms zrušíme zvýraznění
		setTimeout(() => setJustAddedDay(null), 20);
	};

	const removeDay = (dayId: number) => {
		const newDays = days
			.filter((day) => day.nthDay !== dayId)
			.map((day) => {
				if (day.nthDay > dayId) {
					return {
						...day,
						nthDay: day.nthDay - 1,
						categories: day.categories.map((category) => ({
							...category,
							nthDay: day.nthDay - 1,
							exercises: category.exercises.map((exercise) => ({
								...exercise,
								nthDay: day.nthDay - 1,
							})),
						})),
					};
				}
				return day;
			});

		setDays(newDays);
	};

	const moveDayUp = (dayId: number) => {
		setDays((prevDays) => {
			const updatedDays = [...prevDays];
			const index = updatedDays.findIndex((day) => day.nthDay === dayId);

			if (index > 0) {
				// Prohodíme den s předchozím dnem
				[updatedDays[index - 1], updatedDays[index]] = [updatedDays[index], updatedDays[index - 1]];

				// Aktualizujeme nthDay pro oba dny
				updatedDays[index - 1].nthDay = index;
				updatedDays[index].nthDay = index + 1;

				// Aktualizujeme nthDay pro kategorie a cviky v obou dnech
				updatedDays[index - 1].categories = updatedDays[index - 1].categories.map((category) => ({
					...category,
					nthDay: index,
					exercises: category.exercises.map((exercise) => ({
						...exercise,
						nthDay: index,
					})),
				}));
				updatedDays[index].categories = updatedDays[index].categories.map((category) => ({
					...category,
					nthDay: index + 1,
					exercises: category.exercises.map((exercise) => ({
						...exercise,
						nthDay: index + 1,
					})),
				}));
			}

			return updatedDays;
		});
	};

	const moveDayDown = (dayId: number) => {
		setDays((prevDays) => {
			const updatedDays = [...prevDays];
			const index = updatedDays.findIndex((day) => day.nthDay === dayId);

			if (index < updatedDays.length - 1) {
				// Prohodíme den s následujícím dnem
				[updatedDays[index], updatedDays[index + 1]] = [updatedDays[index + 1], updatedDays[index]];

				// Aktualizujeme nthDay pro oba dny
				updatedDays[index].nthDay = index + 1;
				updatedDays[index + 1].nthDay = index + 2;

				// Aktualizujeme nthDay pro kategorie a cviky v obou dnech
				updatedDays[index].categories = updatedDays[index].categories.map((category) => ({
					...category,
					nthDay: index + 1,
					exercises: category.exercises.map((exercise) => ({
						...exercise,
						nthDay: index + 1,
					})),
				}));
				updatedDays[index + 1].categories = updatedDays[index + 1].categories.map((category) => ({
					...category,
					nthDay: index + 2,
					exercises: category.exercises.map((exercise) => ({
						...exercise,
						nthDay: index + 2,
					})),
				}));
			}

			return updatedDays;
		});
	};
	// #endregion

	// #region Category
	const addCategory = (categoryName: string, dayId: number) => {
		if (!categoryName) return;

		setDays((prevDays) =>
			prevDays.map((day) =>
				day.nthDay === dayId
					? {
							...day,
							categories: [...day.categories, { nthDay: dayId, nthCategory: day.categories.length + 1, categoryName, exercises: [] }],
					  }
					: day
			)
		);

		// Reset vstupního pole pro daný den
		const key = `${dayId}`;
		setCategorySearchInputValue((prev) => ({ ...prev, [key]: "" }));
		setCategorySearchValue((prev) => ({ ...prev, [key]: "" }));
	};

	const removeCategory = (dayId: number, categoryId: number) => {
		setDays((prevDays) => {
			const updatedDays = prevDays.map((day) => {
				if (day.nthDay === dayId) {
					const updatedCategories = day.categories
						.filter((category) => category.nthCategory !== categoryId)
						.map((category) => {
							if (category.nthCategory > categoryId) {
								return {
									...category,
									nthCategory: category.nthCategory - 1,
									exercises: category.exercises.map((exercise) => ({
										...exercise,
										nthCategory: category.nthCategory - 1,
									})),
								};
							}
							return category;
						});
					return { ...day, categories: updatedCategories };
				}
				return day;
			});
			return updatedDays;
		});
	};

	const moveCategoryUp = (dayId: number, categoryId: number) => {
		setDays((prevDays) => {
			const updatedDays = [...prevDays];
			const dayIndex = updatedDays.findIndex((day) => day.nthDay === dayId);
			const categoryIndex = updatedDays[dayIndex].categories.findIndex((category) => category.nthCategory === categoryId);

			if (categoryIndex === 0 && dayIndex > 0) {
				// Přesun kategorie do předchozího dne (na konec)
				const categoryToMove = updatedDays[dayIndex].categories[categoryIndex];
				updatedDays[dayIndex].categories.splice(categoryIndex, 1); // Odstranění kategorie z aktuálního dne
				updatedDays[dayIndex - 1].categories.push({
					...categoryToMove,
					nthDay: updatedDays[dayIndex - 1].nthDay,
					nthCategory: updatedDays[dayIndex - 1].categories.length + 1,
					exercises: categoryToMove.exercises.map((exercise) => ({
						...exercise,
						nthDay: updatedDays[dayIndex - 1].nthDay,
						nthCategory: updatedDays[dayIndex - 1].categories.length + 1,
					})),
				});

				// Aktualizace nthCategory v původním dni
				updatedDays[dayIndex].categories = updatedDays[dayIndex].categories.map((category, index) => ({
					...category,
					nthCategory: index + 1,
					exercises: category.exercises.map((exercise) => ({
						...exercise,
						nthCategory: index + 1,
					})),
				}));
			} else if (categoryIndex > 0) {
				// Přesun kategorie nahoru v rámci dne
				const temp = updatedDays[dayIndex].categories[categoryIndex - 1];
				updatedDays[dayIndex].categories[categoryIndex - 1] = updatedDays[dayIndex].categories[categoryIndex];
				updatedDays[dayIndex].categories[categoryIndex] = temp;

				// Aktualizace nthCategory pro obě kategorie
				updatedDays[dayIndex].categories[categoryIndex - 1].nthCategory = categoryIndex;
				updatedDays[dayIndex].categories[categoryIndex].nthCategory = categoryIndex + 1;

				// Aktualizace nthCategory pro cviky v obou kategoriích
				updatedDays[dayIndex].categories[categoryIndex - 1].exercises = updatedDays[dayIndex].categories[categoryIndex - 1].exercises.map((exercise) => ({
					...exercise,
					nthCategory: categoryIndex,
				}));
				updatedDays[dayIndex].categories[categoryIndex].exercises = updatedDays[dayIndex].categories[categoryIndex].exercises.map((exercise) => ({
					...exercise,
					nthCategory: categoryIndex + 1,
				}));
			}

			return updatedDays;
		});
	};

	const moveCategoryDown = (dayId: number, categoryId: number) => {
		setDays((prevDays) => {
			const updatedDays = [...prevDays];
			const dayIndex = updatedDays.findIndex((day) => day.nthDay === dayId);
			const categoryIndex = updatedDays[dayIndex].categories.findIndex((category) => category.nthCategory === categoryId);

			if (categoryIndex === updatedDays[dayIndex].categories.length - 1 && dayIndex < updatedDays.length - 1) {
				// Přesun kategorie do dalšího dne (na začátek)
				const categoryToMove = updatedDays[dayIndex].categories[categoryIndex];
				updatedDays[dayIndex].categories.splice(categoryIndex, 1); // Odstranění kategorie z aktuálního dne
				updatedDays[dayIndex + 1].categories.unshift({
					...categoryToMove,
					nthDay: updatedDays[dayIndex + 1].nthDay,
					nthCategory: 1,
					exercises: categoryToMove.exercises.map((exercise) => ({
						...exercise,
						nthDay: updatedDays[dayIndex + 1].nthDay,
						nthCategory: 1,
					})),
				});

				// Aktualizace nthCategory v cílovém dni
				updatedDays[dayIndex + 1].categories = updatedDays[dayIndex + 1].categories.map((category, index) => ({
					...category,
					nthCategory: index + 1,
					exercises: category.exercises.map((exercise) => ({
						...exercise,
						nthCategory: index + 1,
					})),
				}));
			} else if (categoryIndex < updatedDays[dayIndex].categories.length - 1) {
				// Přesun kategorie dolů v rámci dne
				const temp = updatedDays[dayIndex].categories[categoryIndex + 1];
				updatedDays[dayIndex].categories[categoryIndex + 1] = updatedDays[dayIndex].categories[categoryIndex];
				updatedDays[dayIndex].categories[categoryIndex] = temp;

				// Aktualizace nthCategory pro obě kategorie
				updatedDays[dayIndex].categories[categoryIndex].nthCategory = categoryIndex + 1;
				updatedDays[dayIndex].categories[categoryIndex + 1].nthCategory = categoryIndex + 2;

				// Aktualizace nthCategory pro cviky v obou kategoriích
				updatedDays[dayIndex].categories[categoryIndex].exercises = updatedDays[dayIndex].categories[categoryIndex].exercises.map((exercise) => ({
					...exercise,
					nthCategory: categoryIndex + 1,
				}));
				updatedDays[dayIndex].categories[categoryIndex + 1].exercises = updatedDays[dayIndex].categories[categoryIndex + 1].exercises.map((exercise) => ({
					...exercise,
					nthCategory: categoryIndex + 2,
				}));
			}

			return updatedDays;
		});
	};

	const handleCategoryInputChange = (event: React.SyntheticEvent, newInputValue: string, dayId: number) => {
		const key = `${dayId}`;
		setCategorySearchInputValue((prev) => ({
			...prev,
			[key]: newInputValue,
		}));
	};

	const handleCategorySearchChange = (event: React.SyntheticEvent, newValue: string, dayId: number) => {
		const key = `${dayId}`;
		setCategorySearchValue((prev) => ({
			...prev,
			[key]: newValue,
		}));
		addCategory(newValue, dayId);
	};
	// #endregion

	// #region Exercise
	const addExercise = (exerciseName: string, dayId: number, categoryId: number) => {
		if (!exerciseName) return;

		let exerciseId: number;
		let categoryName: string;

		const idAndUnitCode = findIdAndUnitCode(exerciseName, categoryId, dayId);

		setDays((prevDays) =>
			prevDays.map((day) => {
				if (day.nthDay === dayId) {
					const updatedCategories = day.categories.map((category) => {
						if (category.nthCategory === categoryId) {
							const newExercise = {
								nthDay: dayId,
								nthCategory: categoryId,
								nthExercise: category.exercises.length + 1,
								categoryName: category.categoryName,
								exerciseName: exerciseName,
								repetitions: 0,
								series: 0,
								burden: 0,
								unitCode: idAndUnitCode.unitCode,
								exerciseId: idAndUnitCode.exerciseId,
								boxHeight: 0,
								isVisible: false, // Nový stav pro viditelnost
							};

							exerciseId = category.exercises.length + 1;
							categoryName = category.categoryName;

							const updatedExercises = [...category.exercises, newExercise];
							return { ...category, exercises: updatedExercises };
						}
						return category;
					});
					return { ...day, categories: updatedCategories };
				}
				return day;
			})
		);

		const key = `${dayId}-${categoryId}`;
		setExerciseSearchInputValue((prev) => ({
			...prev,
			[key]: "",
		}));
		setExerciseSearchValue((prev) => ({
			...prev,
			[key]: "",
		}));

		setTimeout(() => {
			const element = document.getElementById(`exercise-${dayId}-${categoryId}-${exerciseId}`);
			if (element) {
				updateBoxSize(
					{
						nthDay: dayId,
						nthCategory: categoryId,
						nthExercise: exerciseId,
						categoryName: categoryName,
						exerciseName: exerciseName,
						repetitions: 0,
						series: 0,
						burden: 0,
						unitCode: idAndUnitCode.unitCode,
						exerciseId: idAndUnitCode.exerciseId,
						boxHeight: 0,
					},
					element
				);

				// Nastavení viditelnosti boxu po aktualizaci velikosti
				setDays((prevDays) =>
					prevDays.map((day) => {
						if (day.nthDay === dayId) {
							return {
								...day,
								categories: day.categories.map((category) => {
									if (category.nthCategory === categoryId) {
										return {
											...category,
											exercises: category.exercises.map((exercise) => {
												if (exercise.nthExercise === exerciseId) {
													return { ...exercise, isVisible: true };
												}
												return exercise;
											}),
										};
									}
									return category;
								}),
							};
						}
						return day;
					})
				);
			}
		}, 0);
	};

	const removeExercise = (dayId: number, categoryId: number, exerciseId: number) => {
		setDays((prevDays) => {
			const updatedDays = prevDays.map((day) => {
				if (day.nthDay === dayId) {
					const updatedCategories = day.categories.map((category) => {
						if (category.nthCategory === categoryId) {
							const updatedExercises = category.exercises
								.filter((exercise) => exercise.nthExercise !== exerciseId)
								.map((exercise) => {
									if (exercise.nthExercise > exerciseId) {
										return {
											...exercise,
											nthExercise: exercise.nthExercise - 1,
										};
									}
									return exercise;
								});
							return { ...category, exercises: updatedExercises };
						}
						return category;
					});
					return { ...day, categories: updatedCategories };
				}
				return day;
			});
			return updatedDays;
		});
	};

	const moveExerciseUp = (dayId: number, categoryId: number, exerciseId: number) => {
		setDays((prevDays) => {
			const updatedDays = [...prevDays];
			const dayIndex = updatedDays.findIndex((day) => day.nthDay === dayId);
			const categoryIndex = updatedDays[dayIndex].categories.findIndex((category) => category.nthCategory === categoryId);
			const exerciseIndex = updatedDays[dayIndex].categories[categoryIndex].exercises.findIndex((exercise) => exercise.nthExercise === exerciseId);

			if (exerciseIndex === 0) {
				// Hledáme předchozí kategorii se stejným názvem (v libovolném dni)
				let targetDayIndex = -1;
				let targetCategoryIndex = -1;

				// Prohledáme všechny dny a kategorie
				for (let i = dayIndex; i >= 0; i--) {
					for (let j = i === dayIndex ? categoryIndex - 1 : updatedDays[i].categories.length - 1; j >= 0; j--) {
						if (updatedDays[i].categories[j].categoryName === updatedDays[dayIndex].categories[categoryIndex].categoryName) {
							targetDayIndex = i;
							targetCategoryIndex = j;
							break;
						}
					}
					if (targetDayIndex !== -1) break;
				}

				// Pokud jsme našli cílovou kategorii
				if (targetDayIndex !== -1 && targetCategoryIndex !== -1) {
					// Přesun cviku do cílové kategorie (na konec)
					const exerciseToMove = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex];
					updatedDays[dayIndex].categories[categoryIndex].exercises.splice(exerciseIndex, 1); // Odstranění cviku z aktuální kategorie

					// Aktualizace nthDay, nthCategory a nthExercise pro přesunutý cvik
					const targetCategory = updatedDays[targetDayIndex].categories[targetCategoryIndex];
					exerciseToMove.nthDay = targetCategory.nthDay;
					exerciseToMove.nthCategory = targetCategory.nthCategory;
					exerciseToMove.nthExercise = targetCategory.exercises.length + 1;

					// Přidání cviku do cílové kategorie
					targetCategory.exercises.push(exerciseToMove);

					// Aktualizace nthExercise v původní kategorii
					updatedDays[dayIndex].categories[categoryIndex].exercises = updatedDays[dayIndex].categories[categoryIndex].exercises.map((exercise, index) => ({
						...exercise,
						nthExercise: index + 1,
					}));
				}
			} else if (exerciseIndex > 0) {
				// Přesun cviku nahoru v rámci kategorie
				const temp = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex - 1];
				updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex - 1] = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex];
				updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex] = temp;

				// Aktualizace nthExercise pro oba cviky
				updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex - 1].nthExercise = exerciseIndex;
				updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex].nthExercise = exerciseIndex + 1;
			}

			return updatedDays;
		});
	};

	const moveExerciseDown = (dayId: number, categoryId: number, exerciseId: number) => {
		setDays((prevDays) => {
			const updatedDays = [...prevDays];
			const dayIndex = updatedDays.findIndex((day) => day.nthDay === dayId);
			const categoryIndex = updatedDays[dayIndex].categories.findIndex((category) => category.nthCategory === categoryId);
			const exerciseIndex = updatedDays[dayIndex].categories[categoryIndex].exercises.findIndex((exercise) => exercise.nthExercise === exerciseId);

			if (exerciseIndex === updatedDays[dayIndex].categories[categoryIndex].exercises.length - 1) {
				// Hledáme další kategorii se stejným názvem (v libovolném dni)
				let targetDayIndex = -1;
				let targetCategoryIndex = -1;

				// Prohledáme všechny dny a kategorie
				for (let i = dayIndex; i < updatedDays.length; i++) {
					for (let j = i === dayIndex ? categoryIndex + 1 : 0; j < updatedDays[i].categories.length; j++) {
						if (updatedDays[i].categories[j].categoryName === updatedDays[dayIndex].categories[categoryIndex].categoryName) {
							targetDayIndex = i;
							targetCategoryIndex = j;
							break;
						}
					}
					if (targetDayIndex !== -1) break;
				}

				// Pokud jsme našli cílovou kategorii
				if (targetDayIndex !== -1 && targetCategoryIndex !== -1) {
					// Přesun cviku do cílové kategorie (na začátek)
					const exerciseToMove = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex];
					updatedDays[dayIndex].categories[categoryIndex].exercises.splice(exerciseIndex, 1); // Odstranění cviku z aktuální kategorie

					// Aktualizace nthDay, nthCategory a nthExercise pro přesunutý cvik
					const targetCategory = updatedDays[targetDayIndex].categories[targetCategoryIndex];
					exerciseToMove.nthDay = targetCategory.nthDay;
					exerciseToMove.nthCategory = targetCategory.nthCategory;
					exerciseToMove.nthExercise = 1; // Přidáme na začátek, takže nthExercise = 1

					// Přidání cviku do cílové kategorie
					targetCategory.exercises.unshift(exerciseToMove);

					// Aktualizace nthExercise v cílové kategorii
					targetCategory.exercises = targetCategory.exercises.map((exercise, index) => ({
						...exercise,
						nthExercise: index + 1,
					}));
				}
			} else if (exerciseIndex < updatedDays[dayIndex].categories[categoryIndex].exercises.length - 1) {
				// Přesun cviku dolů v rámci kategorie
				const temp = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex + 1];
				updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex + 1] = updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex];
				updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex] = temp;

				// Aktualizace nthExercise pro oba cviky
				updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex].nthExercise = exerciseIndex + 1;
				updatedDays[dayIndex].categories[categoryIndex].exercises[exerciseIndex + 1].nthExercise = exerciseIndex + 2;
			}

			return updatedDays;
		});
	};

	const handleExerciseInputChange = (event: React.ChangeEvent<{}>, newInputValue: string, nthDay: number, nthCategory: number) => {
		const key = `${nthDay}-${nthCategory}`;
		setExerciseSearchInputValue((prev) => ({
			...prev,
			[key]: newInputValue,
		}));
	};

	const handleExerciseSearchChange = (event: React.SyntheticEvent<Element, Event>, newValue: string, nthDay: number, nthCategory: number) => {
		const key = `${nthDay}-${nthCategory}`;
		setExerciseSearchValue((prev) => ({
			...prev,
			[key]: newValue,
		}));
		addExercise(newValue, nthDay, nthCategory);
	};

	const updateBoxSize = (exercise: LocalExercise, element: HTMLElement) => {
		const { height } = element.getBoundingClientRect();
		setDays((prevDays) =>
			prevDays.map((day) => {
				if (day.nthDay === exercise.nthDay) {
					return {
						...day,
						categories: day.categories.map((category) => {
							if (category.nthCategory === exercise.nthCategory) {
								return {
									...category,
									exercises: category.exercises.map((ex) => {
										if (ex.nthExercise === exercise.nthExercise) {
											return {
												...ex,
												boxHeight: height,
											};
										}
										return ex;
									}),
								};
							}
							return category;
						}),
					};
				}
				return day;
			})
		);
	};

	const handleResize = () => {
		days.forEach((day) => {
			day.categories.forEach((category) => {
				category.exercises.forEach((exercise) => {
					const element = document.getElementById(`exercise-${exercise.nthDay}-${exercise.nthCategory}-${exercise.nthExercise}`);
					if (element) {
						updateBoxSize(exercise, element);
					}
				});
			});
		});
	};

	useEffect(() => {
		setTimeout(() => {
			handleResize();
		}, 150);
	}, [showRecommendeValues, context.textSize]);

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [days]);
	// #endregion

	const extractExercises = (): TrainingPlanExercise[] => {
		return days.flatMap((day) => day.categories.flatMap((category) => category.exercises.map(({ boxHeight, isVisible, ...rest }) => rest)));
	};

	const handleSaveTrainingPlan = async () => {
		const trainingPlanExercises = extractExercises();

		const cookies = cookie.parse(document.cookie);
		const visitedUserId = cookies.view_tmp ? Number(atob(cookies.view_tmp)) : -1;

		if (trainingPlanExercises === undefined || trainingPlanExercises.length === 0 || trainingPlanName.length < 1) {
			console.error("Nevalidní data pro odeslání.");
		} else {
			try {
				const response = props.edit
					? await changeTrainingPlanReq({
							trainingPlanId: props.trainingPlan?.trainingPlanId! || -1,
							canOwnerEdit: false,
							trainingPlanName,
							trainingPlanExercises,
							hasBurdenAndUnit: trainingPlanHasBurdenAndUnit,
							unitCode: trainingPlanUnitCode,
					  })
					: await createTrainingPlanReq({
							ownerId: visitedUserId,
							canOwnerEdit: false,
							trainingPlanName,
							sportId: props.selectedSport.sportId,
							trainingPlanExercises,
							hasBurdenAndUnit: trainingPlanHasBurdenAndUnit,
							unitCode: trainingPlanUnitCode,
					  });

				consoleLogPrint(response);

				if (response.status === 200) {
					router.push("/training-plans");
				}
			} catch (error) {
				console.error("Error: ", error);
			}
		}
	};

	const getLastDay = (days: LocalDay[]): LocalDay | undefined => {
		if (days.length === 0) return undefined;
		return days[days.length - 1];
	};

	const getLastCategory = (days: LocalDay[]): LocalCategory | undefined => {
		const lastDay = getLastDay(days);
		if (!lastDay || lastDay.categories.length === 0) return undefined;
		return lastDay.categories[lastDay.categories.length - 1];
	};

	const getLastExercise = (days: LocalDay[]): LocalExercise | undefined => {
		const lastCategory = getLastCategory(days);
		if (!lastCategory || lastCategory.exercises.length === 0) return undefined;
		return lastCategory.exercises[lastCategory.exercises.length - 1];
	};

	const getCategoryName = (nthDay: number, nthCategory: number): string | undefined => {
		const day = days.find((d) => d.nthDay === nthDay);
		if (!day) return undefined;

		const category = day.categories.find((c) => c.nthCategory === nthCategory);
		return category?.categoryName;
	};

	const hasPreviousCategoryWithSameName = (nthDay: number, nthCategory: number): boolean => {
		const day = days.find((d) => d.nthDay === nthDay);
		if (!day) return false;

		const categoryName = getCategoryName(nthDay, nthCategory);
		if (!categoryName) return false;

		for (let i = 0; i < day.categories.length; i++) {
			const current = day.categories[i];
			if (current.nthCategory === nthCategory) {
				for (let j = i - 1; j >= 0; j--) {
					if (day.categories[j].categoryName === categoryName) {
						return true;
					}
				}
				break;
			}
		}

		return false;
	};

	const hasNextCategoryWithSameName = (nthDay: number, nthCategory: number): boolean => {
		const day = days.find((d) => d.nthDay === nthDay);
		if (!day) return false;

		const categoryName = getCategoryName(nthDay, nthCategory);
		if (!categoryName) return false;

		for (let i = 0; i < day.categories.length; i++) {
			const current = day.categories[i];
			if (current.nthCategory === nthCategory) {
				for (let j = i + 1; j < day.categories.length; j++) {
					if (day.categories[j].categoryName === categoryName) {
						return true;
					}
				}
				break;
			}
		}

		return false;
	};

	const isLastExerciseInCategory = (nthDay: number, nthCategory: number, nthExercise: number): boolean => {
		const day = days.find((d) => d.nthDay === nthDay);
		if (!day) return false;

		const category = day.categories.find((c) => c.nthCategory === nthCategory);
		if (!category) return false;

		const maxNthExercise = Math.max(...category.exercises.map((e) => e.nthExercise));

		return nthExercise === maxNthExercise;
	};

	const MoveAndDeleteButtons = ({
		nthDay,
		nthCategory,
		nthExercise,
		disable,
		onlyMoveButtons,
		onlyUpButton,
	}: {
		nthDay: number;
		nthCategory?: number;
		nthExercise?: number;
		disable?: boolean;
		onlyMoveButtons?: boolean;
		onlyUpButton?: boolean;
	}) => {
		const disableMoveUpCauseItsFirstEntity =
			(nthExercise === 1 && nthCategory === 1 && nthDay === 1) || (nthExercise === undefined && nthCategory === 1 && nthDay === 1) || (nthExercise === undefined && nthCategory === undefined && nthDay === 1);

		const lastDay = getLastDay(days);
		const lastCategory = getLastCategory(days);
		const lastExcercise = getLastExercise(days);
		const disableMoveDownCauseItsLastEntity =
			(nthExercise === lastExcercise?.nthExercise && nthCategory === lastCategory?.nthCategory && nthDay === lastDay?.nthDay) ||
			(nthExercise === undefined && nthCategory === lastCategory?.nthCategory && nthDay === lastDay?.nthDay) ||
			(nthExercise === undefined && nthCategory === undefined && nthDay === lastDay?.nthDay);

		const isSameAbove = nthExercise === 1 && nthCategory ? hasPreviousCategoryWithSameName(nthDay, nthCategory) : true;
		const isSameBelow = nthExercise && nthCategory && isLastExerciseInCategory(nthDay, nthCategory, nthExercise) ? hasNextCategoryWithSameName(nthDay, nthCategory) : true;

		return (
			<Box className="flex  gap-2 mr-3">
				{/*{nthCategory && !nthExercise && <Box className="border-t-2 border-r-2 border-gray-200 h-7 rounded-tr-xl absolute top-2 right-0 w-[6.8rem]" />}*/}

				{context.windowWidth < 850 && !onlyMoveButtons ? (
					<ButtonComp
						style=""
						disabled={disable}
						content={IconEnum.CROSS}
						color="text-red-icon"
						contentStyle="-rotate-90"
						dontChangeOutline
						justClick
						size="small"
						onClick={() => {
							setTimeout(() => {
								if (nthCategory && nthExercise) {
									removeExercise(nthDay, nthCategory, nthExercise);
								} else if (nthCategory) {
									removeCategory(nthDay, nthCategory);
								} else {
									removeDay(nthDay);
								}
							}, 100);
						}}
					/>
				) : null}

				{context.windowWidth >= 850 || (context.windowWidth < 850 && onlyMoveButtons) ? (
					<>
						{!onlyUpButton && context.windowWidth < 850 ? null : (
							<ButtonComp
								disabled={disableMoveUpCauseItsFirstEntity || !isSameAbove || disable}
								content={IconEnum.ARROW}
								color="text-blue-icon"
								dontChangeOutline
								justClick
								style={`${context.windowWidth < 850 && "-mb-2"}`}
								contentStyle="-rotate-90 mr-[0.01rem] "
								size="small"
								onClick={() => {
									setTimeout(() => {
										if (nthCategory && nthExercise) {
											moveExerciseUp(nthDay, nthCategory, nthExercise);
										} else if (nthCategory) {
											moveCategoryUp(nthDay, nthCategory);
										} else {
											moveDayUp(nthDay);
										}
									}, 100);
								}}
							/>
						)}

						{onlyUpButton && context.windowWidth < 850 ? null : (
							<ButtonComp
								disabled={disableMoveDownCauseItsLastEntity || !isSameBelow || disable}
								content={IconEnum.ARROW}
								color="text-blue-icon"
								dontChangeOutline
								justClick
								style={`${context.windowWidth < 850 && "-mb-1"}`}
								contentStyle="rotate-90"
								size="small"
								onClick={() => {
									setTimeout(() => {
										if (nthCategory && nthExercise) {
											moveExerciseDown(nthDay, nthCategory, nthExercise);
										} else if (nthCategory) {
											moveCategoryDown(nthDay, nthCategory);
										} else {
											moveDayDown(nthDay);
										}
									}, 100);
								}}
							/>
						)}
					</>
				) : null}

				{context.windowWidth >= 850 ? (
					<ButtonComp
						style="ml-2.5"
						disabled={disable}
						content={IconEnum.CROSS}
						color="text-red-icon"
						contentStyle="-rotate-90"
						dontChangeOutline
						justClick
						size="small"
						onClick={() => {
							setTimeout(() => {
								if (nthCategory && nthExercise) {
									removeExercise(nthDay, nthCategory, nthExercise);
								} else if (nthCategory) {
									removeCategory(nthDay, nthCategory);
								} else {
									removeDay(nthDay);
								}
							}, 100);
						}}
					/>
				) : null}
			</Box>
		);
	};

	const insertValueFromTextField = (exercise: LocalExercise, component: React.FormEvent<HTMLDivElement>, isValueForRepetitions: boolean, isValueForSeries: boolean) => {
		const input = component.target as HTMLInputElement;

		const value = parseInt(input.value, 10) || 0; // Převedení na číslo, pokud je prázdné, tak 0
		setDays((prevDays) =>
			prevDays.map((day) => {
				if (day.nthDay === exercise.nthDay) {
					return {
						...day,
						categories: day.categories.map((category) => {
							if (category.nthCategory === exercise.nthCategory) {
								return {
									...category,
									exercises: category.exercises.map((ex) => {
										if (ex.nthExercise === exercise.nthExercise) {
											if (isValueForRepetitions) {
												return {
													...ex,
													repetitions: value,
												};
											} else if (isValueForSeries) {
												return {
													...ex,
													series: value,
												};
											} else {
												return {
													...ex,
													burden: value,
												};
											}
										}
										return ex;
									}),
								};
							}
							return category;
						}),
					};
				}
				return day;
			})
		);
	};

	const findIdAndUnitCode = (exerciseName: string, categoryId: number, dayId: number): { exerciseId: number; unitCode: number } => {
		const unitCode = props.categoriesData.flatMap((category) => category.exercises).find((exercise) => exercise.exerciseName === exerciseName)?.unitCode || 0;

		let exerciseId = 0;
		if (props.selectedSport.hasCategories) {
			const categoryName = getCategoryName(dayId, categoryId);
			exerciseId = props.categoriesData.find((category) => category.categoryName === categoryName)?.exercises.find((exercise) => exercise.exerciseName === exerciseName)?.exerciseId || 0;
		} else {
			exerciseId = props.exercisesData.find((exercise) => exercise.exerciseName === exerciseName)?.exerciseId || 0;
		}

		const returnVal = { exerciseId, unitCode };

		return returnVal;
	};

	const findRecommendedDifficultyVal = (exerciseId: number, categoryName: string) => {
		let series = 0;
		let repetitions = 0;
		let burden = 0;

		if (props.selectedSport.hasRecommendedDifficultyValues) {
			const exerciseDiff = props.recommendedDifficultiesData.find((diff) => diff.sportDifficultyId === concreteDifficulty?.sportDifficultyId && diff.exerciseId === exerciseId);
			series = exerciseDiff?.series || 0;
			repetitions = exerciseDiff?.repetitions || 0;
			burden = exerciseDiff?.burden || 0;

			for (let i = (concreteDifficulty?.orderNumber || 0) - 1 || 0; i > 0; i--) {
				if (![burden, repetitions, series].includes(0)) break;

				const newConcreteDiff = props.difficulties.find((diff) => diff.orderNumber === i);

				const exerciseDiff = props.recommendedDifficultiesData.find((diff) => diff.sportDifficultyId === newConcreteDiff?.sportDifficultyId && diff.exerciseId === exerciseId);

				series = series !== 0 ? series : exerciseDiff?.series || 0;
				repetitions = repetitions !== 0 ? repetitions : exerciseDiff?.repetitions || 0;
				burden = burden !== 0 ? burden : exerciseDiff?.burden || 0;
			}
		} else {
			let foundExercise;

			if (props.selectedSport.hasCategories) {
				foundExercise = props.categoriesData.find((category) => category.categoryName === categoryName)?.exercises.find((exercise) => exercise.exerciseId === exerciseId);
			} else {
				foundExercise = props.exercisesData.find((exercise) => exercise.exerciseId === exerciseId);
			}

			series = foundExercise?.series || 0;
			repetitions = foundExercise?.repetitions || 0;
			burden = foundExercise?.burden || 0;
		}

		return { series, repetitions, burden };
	};

	const findUnitCodeVal = (exerciseId: number, categoryName: string) => {
		let unitCodeVal: number;
		if (props.selectedSport.hasCategories) {
			unitCodeVal = props.categoriesData.find((category) => category.categoryName === categoryName)?.exercises.find((exercise) => exercise.exerciseId === exerciseId)?.unitCode || 0;
		} else {
			unitCodeVal = props.exercisesData.find((exercise) => exercise.exerciseId === exerciseId)?.unitCode || 0;
		}

		return unitCodeVal;
	};

	const executeRecommendedDifficultyValsForExercise = (nthDay: number, nthCategory: number, nthExercise: number, series: number, repetitions: number, burden: number, unitCode: number) => {
		const newDays = days.map((day) => {
			if (day.nthDay === nthDay) {
				return {
					...day,
					categories: day.categories.map((category) => {
						if (category.nthCategory === nthCategory) {
							return {
								...category,
								exercises: category.exercises.map((exercise) => {
									if (exercise.nthExercise === nthExercise) {
										return {
											...exercise,
											series: series > 0 ? series : exercise.series,
											repetitions: repetitions > 0 ? repetitions : exercise.repetitions,
											burden: burden > 0 ? burden : exercise.burden,
											unitCode: unitCode !== 0 ? unitCode : exercise.unitCode,
										};
									} else {
										return exercise;
									}
								}),
							};
						} else {
							return category;
						}
					}),
				};
			} else {
				return day;
			}
		});

		setDays(newDays);

		return;
	};

	const executeRecommendedDifficultyValsForCategories = (nthDay: number, nthCategory: number) => {
		const newDays = days.map((day) => {
			if (day.nthDay === nthDay) {
				return {
					...day,
					categories: day.categories.map((category) => {
						if (category.nthCategory === nthCategory) {
							return {
								...category,
								exercises: category.exercises.map((exercise) => {
									const recommendedVals: { series: number; repetitions: number; burden: number } = findRecommendedDifficultyVal(exercise.exerciseId, category.categoryName);
									const unitCodeVal: number = findUnitCodeVal(exercise.exerciseId, category.categoryName);

									return {
										...exercise,
										series: recommendedVals.series ? recommendedVals.series : exercise.series,
										repetitions: recommendedVals.repetitions ? recommendedVals.repetitions : exercise.repetitions,
										burden: recommendedVals.burden ? recommendedVals.burden : exercise.burden,
										unitCode: unitCodeVal ? unitCodeVal : exercise.unitCode,
									};
								}),
							};
						} else {
							return category;
						}
					}),
				};
			} else {
				return day;
			}
		});

		setDays(newDays);

		return;
	};
	const executeRecommendedDifficultyValsForDays = (nthDay: number) => {
		const newDays = days.map((day) => {
			if (day.nthDay !== nthDay) return day;

			return {
				...day,
				categories: day.categories.map((category) => ({
					...category,
					exercises: category.exercises.map((exercise) => {
						const recommendedVals = findRecommendedDifficultyVal(exercise.exerciseId, category.categoryName);
						const unitCodeVal = findUnitCodeVal(exercise.exerciseId, category.categoryName);

						return {
							...exercise,
							series: recommendedVals.series ?? exercise.series,
							repetitions: recommendedVals.repetitions ?? exercise.repetitions,
							burden: recommendedVals.burden ?? exercise.burden,
							unitCode: unitCodeVal ?? exercise.unitCode,
						};
					}),
				})),
			};
		});

		setDays(newDays);
	};

	const changeUnitCode = (nthDay: number, nthCategory: number, nthExercise: number, event: SelectChangeEvent<number>) => {
		const unitCode = event.target.value as number;
		const newDays = days.map((day) => {
			if (day.nthDay === nthDay) {
				return {
					...day,
					categories: day.categories.map((category) => {
						if (category.nthCategory === nthCategory) {
							return {
								...category,
								exercises: category.exercises.map((exercise) => {
									if (exercise.nthExercise === nthExercise) {
										return {
											...exercise,
											unitCode: unitCode,
										};
									} else {
										return exercise;
									}
								}),
							};
						} else {
							return category;
						}
					}),
				};
			} else {
				return day;
			}
		});

		console.log(unitCode);

		setDays(newDays);
	};

	const checkIfPlanHasAtLeastOneExercise = (): boolean => {
		return !days.some((day) => day.categories.some((category) => category.exercises.length > 0));
	};

	const [trainingPlanName, setTrainingPlanName] = useState<string>("");
	const [trainingPlanHasBurdenAndUnit, setTrainingPlanHasBurdenAndUnit] = useState<boolean>(props.selectedSport.unitCode === 7 ? false : true);
	const [trainingPlanUnitCode, setTrainingPlanUnitCode] = useState<number>(props.selectedSport.unitCode === 1 ? 1 : [2, 3, 4].includes(props.selectedSport.unitCode) ? 2 : [5, 6].includes(props.selectedSport.unitCode) ? 3 : 1);

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (event: SelectChangeEvent<number>) => {
		const value = Number(event.target.value);
		setTrainingPlanUnitCode(value);
		handleClose();
	};

	const [exerciseUnitCodeOpened, setExerciseUnitCodeOpened] = useState<string[]>([]);

	const [overflowHidden, setOverflowHidden] = useState<string[]>([]);

	const inputRef = useRef<HTMLInputElement>(null);

	/*useEffect(() => {
		// Zamez focusu při mountu
		if (inputRef.current) {
			inputRef.current.blur(); // zajistí že nebude autofokus
		}
	}, []);*/

	return (
		<>
			<Head>
				<title>Tvorba tréninku - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-full"
				secondColumnWidth="w-0"
				secondColumnChildren={<></>}
				firstColumnChildren={
					<Box className="flex h-full p-0 m-0">
						<GeneralCard
							width="w-full"
							height="h-full relative"
							style={overflowHidden.length > 0 ? "overflow-hidden" : ""}
							firstTitle="Tvorba tréninku"
							firstChildren={
								<Box className="space-y-7">
									<Box className="space-y-3 pb-3">
										<Box className="flex ml-3 mt-2 gap-4  items-center">
											<TextFieldWithIcon
												externalValue={{ state: trainingPlanName, setState: setTrainingPlanName }}
												previousValue={trainingPlanName}
												onClick={() => {}}
												withoutIcon
												fontSize="1.4rem"
												placeHolder="Název tréninku"
												style="max-w-[32.5rem] w-full"
												dontDeleteValue
											/>
										</Box>

										<Box
											className={`flex  ml-3  w-full 
														${context.windowWidth < 450 ? "flex-col pb-3" : "flex-row gap-8 items-center pb-0"}`}>
											<Box className="flex items-start mt-4 pb-4">
												<ButtonComp
													style="mb-0.5 mr-3"
													size="small"
													externalClicked={{ state: trainingPlanHasBurdenAndUnit, setState: setTrainingPlanHasBurdenAndUnit }}
													content={trainingPlanHasBurdenAndUnit ? IconEnum.CHECK : IconEnum.CROSS}
													onClick={() => setTrainingPlanHasBurdenAndUnit(!trainingPlanHasBurdenAndUnit)}
												/>
												<Typography>{trainingPlanHasBurdenAndUnit ? "Cviky mají zátěž a jednotku." : "Cviky nemají zátěž a jednotku."}</Typography>
											</Box>

											{trainingPlanHasBurdenAndUnit ? (
												<Box
													className={`flex  h-full items-center  
														${context.windowWidth < 450 ? "ml-9 -mt-2" : "ml-4 mt-0"}`}>
													<Typography className="font-light text-nowrap"> Ikona jednotky</Typography>
													<Typography className={`opacity-50 font-light text-nowrap ml-3 mr-2`}>»</Typography>

													<FormControl
														className="mt-1"
														variant="standard"
														sx={{
															"& .MuiSelect-select": {
																backgroundColor: "transparent !important",
															},
														}}>
														<Select
															open={open}
															onClose={handleClose}
															onOpen={handleOpen}
															onChange={handleChange}
															value={trainingPlanUnitCode || ""}
															className=" h-[2rem]  "
															disableUnderline
															sx={{
																"& .MuiSelect-select": {
																	display: "flex",
																	alignItems: "center",

																	backgroundColor: "transparent !important",
																},
															}}
															IconComponent={() => null}
															renderValue={(value) => (
																<Box className="flex items-end gap-2 ml-0.5 -mr-5 mb-2 ">
																	<ButtonComp
																		content={open ? IconEnum.ARROW_DROP_UP : IconEnum.ARROW_DROP_DOWN}
																		style="mt-0.5 ml-1  mr-1 "
																		color="text-[#fff]"
																		onClick={handleOpen}
																		externalClicked={{ state: open, setState: setOpen }}
																	/>
																	<Image
																		className="size-6 "
																		src={value === 1 ? "/icons/weight.svg" : value === 2 ? "/icons/time.svg" : "/icons/meter.svg"}
																		width={28}
																		height={28}
																		alt=""
																		style={{
																			filter: "drop-shadow(3px 3px 3px #00000060)",
																		}}
																	/>
																</Box>
															)}
															MenuProps={{
																PaperProps: {
																	sx: {
																		marginTop: "-0.25rem",
																		marginLeft: "0.3rem",
																		backgroundColor: "#1E1E1E",
																		borderRadius: "0.75rem",
																		borderTopLeftRadius: "0.25rem",
																		fontWeight: 300,
																	},
																},
																anchorOrigin: {
																	vertical: "bottom",
																	horizontal: "left",
																},
																transformOrigin: {
																	vertical: "top",
																	horizontal: "left",
																},
															}}>
															{["/icons/weight.svg", "/icons/time.svg", "/icons/meter.svg"].map((item, index) => (
																<MenuItem
																	key={index}
																	value={index + 1}
																	sx={{ opacity: 0.95 }}
																	className={`py-1.5 hover:bg-[#2a2a2a] hover:cursor-pointer transition-colors duration-150 px-3 w-full flex items-center justify-center`}>
																	<Image
																		className="size-6 "
																		src={item}
																		width={28}
																		height={28}
																		alt=""
																		style={{
																			filter: "drop-shadow(3px 3px 3px #00000060)",
																		}}
																	/>
																</MenuItem>
															))}
														</Select>
													</FormControl>
												</Box>
											) : null}
										</Box>

										<Box
											className={`flex  gap-6  w-full 
														${context.windowWidth < 850 ? "flex-col items-end " : "flex-row items-center"}`}>
											{context.windowWidth < 850 ? (
												<Box className="flex items-center justify-center ">
													<ButtonComp
														content={
															showMoveAndDeleteButtons
																? props.selectedSport.hasRecommendedValues
																	? "Skrýt mazání, přesouvání a doporučené hodnoty"
																	: "Skrýt mazání a přesouvání"
																: props.selectedSport.hasRecommendedValues
																? "Zobrazit mazání, přesouvání a doporučené hodnoty"
																: "Zobrazit mazání a přesouvání"
														}
														size="medium"
														onClick={() => {
															setShowMoveAndDeleteButtons(!showMoveAndDeleteButtons);
															setShowRecommendeValues(!showRecommendeValues);
														}}
													/>
												</Box>
											) : (
												<Box className="flex ml-2 gap-6  w-full">
													<Box className="flex items-center justify-center w-[16rem]">
														<ButtonComp
															content={showMoveAndDeleteButtons ? "Skrýt mazání a přesouvání" : "Zobrazit mazání a přesouvání"}
															size="medium"
															onClick={() => {
																setShowMoveAndDeleteButtons(!showMoveAndDeleteButtons);
															}}
														/>
													</Box>
													{props.selectedSport.hasRecommendedValues ? (
														<Box className="flex items-center justify-center w-[16rem]">
															<ButtonComp
																content={showRecommendeValues ? "Skrýt doporučené hodnoty" : "Zobrazit doporučené hodnoty"}
																size="medium"
																onClick={() => {
																	setShowRecommendeValues(!showRecommendeValues);
																}}
															/>
														</Box>
													) : null}
												</Box>
											)}
										</Box>
									</Box>

									{days.map((day, index) => (
										<Box
											key={day.nthDay}
											className={`flex flex-col mt-4 items-center
														transition-opacity duration-500
														${justAddedDay === day.nthDay ? "opacity-0 animate-fade-in" : "opacity-100"}`}>
											{index > 0 && (
												<Box
													className={`w-full border-t-2 border-dashed absolute left-0
																${context.borderQuaternaryColor}`}
												/>
											)}

											<Box
												className={`flex w-full 
													${index + 1 > 1 && "pt-5"}`}>
												{/* ${showRecommendeValues && trainingPlanHasBurdenAndUnit ? "mr-[20.1rem]" : showRecommendeValues && !trainingPlanHasBurdenAndUnit ? "mr-[13.25rem]" : ""} */}
												<Box
													className={`flex items-center justify-center w-full 
																${context.windowWidth < 850 ? "min-h-12 mt-3" : "h-12"}`}>
													<Box
														className={` flex   w-full mr-1 -mt-4 ${!showRecommendeValues && "-mr-0.5"}
															${context.windowWidth < 850 ? "flex-col items-start" : "flex-row items-center"}
															${
																props.selectedSport.hasCategories && showRecommendeValues && !trainingPlanHasBurdenAndUnit && context.windowWidth >= 850
																	? ""
																	: props.selectedSport.hasCategories && showRecommendeValues && trainingPlanHasBurdenAndUnit && context.windowWidth >= 850
																	? ""
																	: ""
															}
																	${!trainingPlanHasBurdenAndUnit && showRecommendeValues ? "max-w-[60rem]" : "max-w-[60rem]"}`}>
														<Box className="flex items-center ">
															{showMoveAndDeleteButtons && context.windowWidth < 850 && (
																<Box className={`mr-0.5 mt-2.5 ml-3.5  `}>
																	<MoveAndDeleteButtons nthDay={day.nthDay} />
																</Box>
															)}

															<Typography
																className={`text-[1.245rem] font-medium uppercase w-full -mb-2 mt-1
																					${showMoveAndDeleteButtons && context.windowWidth < 850 ? "ml-0" : "ml-3"}`}>
																{`Den ${index + 1}.`}{" "}
															</Typography>
														</Box>

														{props.selectedSport.hasCategories && showMoveAndDeleteButtons && context.windowWidth < 850 ? (
															<Box className={`ml-3.5 mt-5  mb-2.5 `}>
																<MoveAndDeleteButtons
																	onlyMoveButtons
																	onlyUpButton
																	nthDay={day.nthDay}
																/>
															</Box>
														) : null}

														{!props.selectedSport.hasCategories ? (
															<Box
																className={`flex items-center h-full w-full justify-end mt-4 ${trainingPlanHasBurdenAndUnit && "pr-9"}
																			${context.windowWidth < 850 ? "pb-2 ml-0.5" : ""} `}>
																{showMoveAndDeleteButtons && context.windowWidth < 850 && (
																	<Box className={`ml-3 mt-1  mr-auto  `}>
																		<MoveAndDeleteButtons
																			onlyMoveButtons
																			onlyUpButton
																			nthDay={day.nthDay}
																		/>
																	</Box>
																)}

																<Box className="flex w-16 justify-end  ">
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

																<Box className={`flex  ${trainingPlanHasBurdenAndUnit ? "w-16" : "w-[3.3rem]"}`}>
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

																{trainingPlanHasBurdenAndUnit ? (
																	<Box className=" w-[6.5rem] flex justify-center    ">
																		{trainingPlanUnitCode === 1 ? (
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
																		) : trainingPlanUnitCode === 2 ? (
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
																		) : trainingPlanUnitCode === 3 ? (
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
														) : null}

														{showMoveAndDeleteButtons && context.windowWidth < 850 && (
															<Box className={`flex justify-end w-full mt-1 mb-3 `}>
																<Box className={`ml-3.5 mt-1 mr-auto  `}>
																	<MoveAndDeleteButtons
																		onlyMoveButtons
																		nthDay={day.nthDay}
																	/>
																</Box>

																<ButtonComp
																	justClick
																	dontChangeOutline
																	content={"Použít doporučené hodnoty dne"}
																	secondContent={IconEnum.ARROW}
																	secondContentStyle="rotate-90 mr-1"
																	color="text-white"
																	style=" mr-2.5"
																	size="small"
																	onClick={() => executeRecommendedDifficultyValsForDays(day.nthDay)}
																/>
															</Box>
														)}

														{showMoveAndDeleteButtons && context.windowWidth >= 850 && (
															<Box className={`mr-0.5 mt-3  `}>
																<MoveAndDeleteButtons nthDay={day.nthDay} />
															</Box>
														)}
													</Box>

													{showRecommendeValues && !props.selectedSport.hasCategories && context.windowWidth >= 850 ? (
														<Box className={`flex items-center justify-start h-[3.05rem]  ml-7  -mt-2 ${trainingPlanHasBurdenAndUnit ? "w-72 min-w-72 max-w-72 pl-0.5" : "w-44  min-w-44 max-w-44 pl-0.5"}`}>
															<ButtonComp
																justClick
																dontChangeOutline
																content={IconEnum.ARROW}
																contentStyle="rotate-180"
																color="text-blue-icon"
																style="ml-2"
																size="small"
																onClick={() => executeRecommendedDifficultyValsForDays(day.nthDay)}
															/>
															<Box className="flex items-center h-full w-full justify-end ">
																<Box className="flex w-16 justify-end  ">
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

																<Box className="flex w-16">
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

																{trainingPlanHasBurdenAndUnit ? (
																	<Box className=" w-[6.25rem] flex justify-center    ">
																		{trainingPlanUnitCode === 1 ? (
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
																		) : trainingPlanUnitCode === 2 ? (
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
																		) : trainingPlanUnitCode === 3 ? (
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
													) : showRecommendeValues && props.selectedSport.hasCategories && context.windowWidth >= 850 ? (
														<Box className={`pl-[1.8rem] 
																		${trainingPlanHasBurdenAndUnit ? "w-72 min-w-72 max-w-72 mr-7" : "w-44  min-w-44 max-w-44 mr-7"}`}>
															<ButtonComp
																justClick
																dontChangeOutline
																content={IconEnum.ARROW}
																contentStyle="rotate-180"
																color="text-white"
																style="ml-2"
																size="small"
																onClick={() => executeRecommendedDifficultyValsForDays(day.nthDay)}
															/>
														</Box>
													) : null}
												</Box>
											</Box>

											<Box className="flex flex-col flex-wrap space-y-4  w-full items-center  -mt-3">
												{day.categories.map((category, index) => (
													<Box
														key={index} // category.nthDay
														className="flex  w-full justify-center">
														<Box
															className={` mt-3  flex flex-col w-full border-2  rounded-xl overflow-hidden h-fit  max-w-[60rem] 
																		${context.bgPrimaryColor} ${context.borderPrimaryColor} `}>
															{props.selectedSport.hasCategories ? (
																<Box
																	className={`flex  items-center  border-b-2 
																				${context.windowWidth < 850 ? "flex-col h-21" : "flex-row h-12"}
																				${context.bgTertiaryColor} ${context.borderTertiaryColor}`}>
																	<Box
																		className={`w-full  flex 
																					${context.windowWidth < 850 ? "h-10 items-end mt-1" : "h-full items-center"}`}>
																		{context.windowWidth < 850 && showMoveAndDeleteButtons ? (
																			<Box className=" ml-3 mb-1">
																				<MoveAndDeleteButtons
																					nthDay={day.nthDay}
																					nthCategory={category.nthCategory}
																				/>
																			</Box>
																		) : null}

																		<Typography
																			className={`text-lg 
																								${context.windowWidth < 850 && showMoveAndDeleteButtons ? "pl-0" : "pl-3"}`}>
																			{category.categoryName}
																		</Typography>
																	</Box>

																	<Box
																		className={`flex items-center h-10 w-full justify-end 
																					${context.windowWidth < 850 ? "mt-1" : "h-full items-center"}
																					${trainingPlanHasBurdenAndUnit && "pr-9"}`}>
																		{context.windowWidth < 850 && showMoveAndDeleteButtons ? (
																			<Box className="mr-auto ml-3 mt-0.5 ">
																				<MoveAndDeleteButtons
																					nthDay={day.nthDay}
																					onlyMoveButtons
																					onlyUpButton
																					nthCategory={category.nthCategory}
																				/>
																			</Box>
																		) : null}

																		<Box className="flex w-16 justify-end  ">
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

																		<Box className={`flex  ${trainingPlanHasBurdenAndUnit ? "w-16" : "w-[3.3rem]"}`}>
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

																		{trainingPlanHasBurdenAndUnit ? (
																			<Box className=" w-[6.5rem] flex justify-center    ">
																				{trainingPlanUnitCode === 1 ? (
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
																				) : trainingPlanUnitCode === 2 ? (
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
																				) : trainingPlanUnitCode === 3 ? (
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

																	{context.windowWidth < 850 && showMoveAndDeleteButtons ? (
																		<Box className="flex justify-between w-full  pr-3 pb-3.5 pt-1">
																			<Box className="ml-3 mt-1">
																				<MoveAndDeleteButtons
																					nthDay={day.nthDay}
																					onlyMoveButtons
																					nthCategory={category.nthCategory}
																				/>
																			</Box>

																			<ButtonComp
																				justClick
																				dontChangeOutline
																				content={"Použít doporučené hodnoty kategorie"}
																				secondContent={IconEnum.ARROW}
																				secondContentStyle="rotate-90 mr-1"
																				color="text-white"
																				style=""
																				size="small"
																				onClick={() => executeRecommendedDifficultyValsForCategories(category.nthDay, category.nthCategory)}
																			/>
																		</Box>
																	) : null}

																	{showMoveAndDeleteButtons && context.windowWidth >= 850 && (
																		<MoveAndDeleteButtons
																			nthDay={day.nthDay}
																			onlyMoveButtons
																			nthCategory={category.nthCategory}
																		/>
																	)}
																</Box>
															) : (
																<></>
															)}

															<Box className="">
																{category.exercises.map((exercise, index) => {
																	const recommendedVals: { series: number; repetitions: number; burden: number } = findRecommendedDifficultyVal(exercise.exerciseId, category.categoryName);
																	const unitCodeVal: number = findUnitCodeVal(exercise.exerciseId, category.categoryName);

																	return (
																		<Box
																			key={exercise.nthExercise}
																			id={`exercise-${exercise.nthDay}-${exercise.nthCategory}-${exercise.nthExercise}`}
																			className={`flex  pl-3 py-2 border-b-2 min-h-[3.15rem]
																				${context.windowWidth < 850 ? "flex-col items-end" : "flex-row items-center"}
																					${context.borderPrimaryColor}
																					${exercise.nthExercise % 2 === 0 && context.bgSecondaryColor} 
																					transition-all duration-150 ease-in-out`}
																			style={{
																				opacity: exercise.isVisible ? 1 : 0,
																				transform: exercise.isVisible ? "translateY(0)" : "translateY(-10px)",
																			}}>
																			<Box
																				className={`w-full  flex 
																					${context.windowWidth < 850 ? " items-start mb-3 mt-2" : "h-full items-center"}`}>
																				{showMoveAndDeleteButtons && context.windowWidth < 850 && (
																					<Box className=" ">
																						<MoveAndDeleteButtons
																							nthDay={day.nthDay}
																							nthCategory={category.nthCategory}
																							nthExercise={exercise.nthExercise}
																						/>
																					</Box>
																				)}
																				<Typography className="font-light w-full">{exercise.exerciseName}</Typography>
																			</Box>

																			<Box
																				className={`flex items-center pr-2.5 justify-end
																							${showMoveAndDeleteButtons && "w-full "}`}>
																				{showMoveAndDeleteButtons && context.windowWidth < 850 && (
																					<Box className="mr-auto">
																						<MoveAndDeleteButtons
																							nthDay={day.nthDay}
																							onlyUpButton
																							nthCategory={category.nthCategory}
																							nthExercise={exercise.nthExercise}
																							onlyMoveButtons
																						/>
																					</Box>
																				)}
																				<Box
																					className={`flex items-center w-[9.5rem]  mb-1
																								${trainingPlanHasBurdenAndUnit ? "justify-center" : "justify-end pr-2 pb-1"}`}>
																					<TextField
																						value={exercise.series || ""}
																						variant="standard"
																						size="small"
																						type="number"
																						className="w-[2.2rem] p-0 -mt-1"
																						InputProps={{
																							classes: { input: "p-1 text-right pb-[0.08rem]" },
																							inputProps: { min: 1, max: 999, step: 1 },
																						}}
																						onInput={(e) => {
																							const input = e.target as HTMLInputElement;
																							let value = input.value.replace(/[^0-9]/g, ""); // Odstranění nečíselných znaků
																							if (value) {
																								const numericValue = parseInt(value, 10);
																								if (numericValue < 1) value = "1";
																								if (numericValue > 999) value = "999";
																							}
																							input.value = value;

																							insertValueFromTextField(exercise, e, false, true);
																						}}
																					/>

																					<Typography className="w-6 text-center font-light">x</Typography>

																					<TextField
																						value={exercise.repetitions || ""}
																						variant="standard"
																						size="small"
																						type="number"
																						className="w-[2.2rem] p-0 -mt-1"
																						InputProps={{
																							classes: { input: "p-1  pb-[0.08rem]" },
																							inputProps: { min: 1, max: 999, step: 1 },
																						}}
																						onInput={(e) => {
																							const input = e.target as HTMLInputElement;
																							let value = input.value.replace(/[^0-9]/g, ""); // Odstranění nečíselných znaků
																							if (value) {
																								const numericValue = parseInt(value, 10);
																								if (numericValue < 1) value = "1";
																								if (numericValue > 999) value = "999";
																							}
																							input.value = value;

																							insertValueFromTextField(exercise, e, true, false);
																						}}
																					/>
																				</Box>

																				{trainingPlanHasBurdenAndUnit ? (
																					<Box className="flex items-center justify-end w-[8.15rem]">
																						<TextField
																							value={exercise.burden || ""}
																							variant="standard"
																							size="small"
																							type="number"
																							className="w-[2.2rem] p-0 -mt-2 " // TODO kg 3rem, sec 2.8rem
																							InputProps={{
																								classes: { input: "p-1  text-right pb-[0.08rem]" },
																								inputProps: { min: 1, max: 999, step: 1 },
																							}}
																							onInput={(e) => {
																								const input = e.target as HTMLInputElement;
																								let value = input.value.replace(/[^0-9]/g, ""); // Odstranění nečíselných znaků
																								if (value) {
																									const numericValue = parseInt(value, 10);
																									if (numericValue < 1) value = "1";
																									if (numericValue > 999) value = "999";
																								}
																								input.value = value;

																								insertValueFromTextField(exercise, e, false, false);
																							}}
																						/>

																						<Box className=" w-[4.8rem] flex ">
																							<FormControl
																								className=" ml-2"
																								variant="standard"
																								sx={{
																									"& .MuiSelect-select": {
																										backgroundColor: "transparent !important",
																									},
																								}}>
																								<Select
																									open={exerciseUnitCodeOpened.includes("D" + exercise.nthDay + "-C" + exercise.nthCategory + "-E" + exercise.nthExercise)}
																									onOpen={() => setExerciseUnitCodeOpened((prev) => [...prev, "D" + exercise.nthDay + "-C" + exercise.nthCategory + "-E" + exercise.nthExercise])}
																									onClose={() =>
																										setExerciseUnitCodeOpened((prev) =>
																											prev.filter((val) => val !== "D" + exercise.nthDay + "-C" + exercise.nthCategory + "-E" + exercise.nthExercise)
																										)
																									}
																									onChange={(event) => {
																										changeUnitCode(exercise.nthDay, exercise.nthCategory, exercise.nthExercise, event);
																									}}
																									value={exercise.unitCode || ""}
																									className=" h-[2rem]  "
																									disableUnderline
																									sx={{
																										"& .MuiSelect-select": {
																											display: "flex",
																											alignItems: "center",

																											backgroundColor: "transparent !important",
																										},
																									}}
																									IconComponent={() => null}
																									renderValue={(value) => (
																										<Box
																											className="flex items-center gap-2 ml-0.5 -mr-5  justify-between
																									 h-full">
																											<Typography className="w-[1.7rem] mb-1">{UnitShortcuts[value]}</Typography>
																											<ButtonComp
																												content={
																													exerciseUnitCodeOpened.includes("D" + exercise.nthDay + "-C" + exercise.nthCategory + "-E" + exercise.nthExercise)
																														? IconEnum.ARROW_DROP_UP
																														: IconEnum.ARROW_DROP_DOWN
																												}
																												style=" ml-0.5 mr-0 mt-0 mb-1"
																												size="small"
																												color="text-[#fff]"
																												externalClickedVal={exerciseUnitCodeOpened.includes(
																													"D" + exercise.nthDay + "-C" + exercise.nthCategory + "-E" + exercise.nthExercise
																												)}
																											/>
																										</Box>
																									)}
																									MenuProps={{
																										PaperProps: {
																											sx: {
																												marginLeft: "0.1rem",
																												borderRadius: "0.75rem",
																												borderTopLeftRadius: "0.25rem",
																												fontWeight: 300,
																											},
																											className: `text-[#E9E9E9] font-light border-2 rounded-xl  ${context.bgSecondaryColor} ${context.borderQuaternaryColor}`,
																										},
																										anchorOrigin: {
																											vertical: "bottom",
																											horizontal: "right",
																										},
																										transformOrigin: {
																											vertical: "top",
																											horizontal: "right",
																										},
																									}}>
																									{[
																										{ key: 1, value: "kg" },
																										{ key: -1, value: "" },
																										{ key: 2, value: "s" },
																										{ key: 3, value: "min" },
																										{ key: 4, value: "h" },
																										{ key: -2, value: "" },
																										{ key: 5, value: "m" },
																										{ key: 6, value: "km" },
																										{ key: -3, value: "" },
																										{ key: 7, value: "bez jednotky" },
																									].map((item, index) => (
																										<MenuItem
																											key={index}
																											value={item.key}
																											disabled={item.key < 0}
																											sx={{
																												opacity: 1,
																												"&.Mui-selected": {
																													backgroundColor:
																														context.colorSchemeCode === "red"
																															? "#4e3939"
																															: context.colorSchemeCode === "blue"
																															? "#313c49"
																															: context.colorSchemeCode === "green"
																															? "#284437"
																															: "#414141",
																												},
																												"&.Mui-selected:hover": {
																													backgroundColor:
																														context.colorSchemeCode === "red"
																															? "#4e3939"
																															: context.colorSchemeCode === "blue"
																															? "#313c49"
																															: context.colorSchemeCode === "green"
																															? "#284437"
																															: "#414141",
																												},
																											}}
																											className={`px-3 py-1.5 h-2 hover:cursor-pointer transition-colors duration-150 w-full flex justify-center
																												${context.bgSecondaryColor + context.bgHoverTertiaryColor}`}>
																											<Typography >{item.value}</Typography>
																										</MenuItem>
																									))}
																								</Select>
																							</FormControl>
																						</Box>
																					</Box>
																				) : null}
																			</Box>

																			{showRecommendeValues && context.windowWidth < 850 ? (
																				<Box className="flex pt-3 pb-1.5 w-full">
																					{showMoveAndDeleteButtons && context.windowWidth < 850 && (
																						<Box className="mr-auto">
																							<MoveAndDeleteButtons
																								nthDay={day.nthDay}
																								nthCategory={category.nthCategory}
																								nthExercise={exercise.nthExercise}
																								onlyMoveButtons
																							/>
																						</Box>
																					)}

																					{!trainingPlanHasBurdenAndUnit ? (
																						<ButtonComp
																							justClick
																							dontChangeOutline
																							disabled={recommendedVals.series < 1 && recommendedVals.repetitions < 1 && recommendedVals.burden < 1 && exercise.unitCode === 0}
																							content={IconEnum.ARROW}
																							contentStyle=""
																							color="text-white"
																							style="mr-3"
																							size="small"
																							onClick={() =>
																								executeRecommendedDifficultyValsForExercise(
																									exercise.nthDay,
																									exercise.nthCategory,
																									exercise.nthExercise,
																									recommendedVals.series,
																									recommendedVals.repetitions,
																									recommendedVals.burden,
																									unitCodeVal
																								)
																							}
																						/>
																					) : null}

																					<Box className="flex items-center  justify-end ">
																						<Box className={`flex items-center w-full  ${trainingPlanHasBurdenAndUnit ? "mr-1" : ""}`}>
																							<Typography className="w-8 text-right mr-[0.3rem]">{recommendedVals.series > 0 ? recommendedVals.series : ""}</Typography>
																							<Typography className="w-6 font-light text-center">x</Typography>
																							<Typography className="w-12 ml-1">{recommendedVals.repetitions > 0 ? recommendedVals.repetitions : ""}</Typography>
																						</Box>
																						{trainingPlanHasBurdenAndUnit ? (
																							<Box className="flex items-center  w-fit mr-0.5">
																								<Typography className="w-14 mr-[0.6rem] text-right">{recommendedVals.burden > 0 ? recommendedVals.burden : ""}</Typography>
																								<Typography className=" ml-2 font-light w-9">{UnitShortcuts[unitCodeVal]}</Typography>
																							</Box>
																						) : null}
																					</Box>

																					{trainingPlanHasBurdenAndUnit ? (
																						<ButtonComp
																							justClick
																							dontChangeOutline
																							disabled={recommendedVals.series < 1 && recommendedVals.repetitions < 1 && recommendedVals.burden < 1 && exercise.unitCode === 0}
																							content={IconEnum.ARROW}
																							contentStyle="-rotate-180"
																							color="text-white"
																							style="mr-3"
																							size="small"
																							onClick={() =>
																								executeRecommendedDifficultyValsForExercise(
																									exercise.nthDay,
																									exercise.nthCategory,
																									exercise.nthExercise,
																									recommendedVals.series,
																									recommendedVals.repetitions,
																									recommendedVals.burden,
																									unitCodeVal
																								)
																							}
																						/>
																					) : null}
																				</Box>
																			) : null}

																			{showMoveAndDeleteButtons && context.windowWidth >= 850 && (
																				<Box className="mr-auto mb-1">
																					<MoveAndDeleteButtons
																						nthDay={day.nthDay}
																						nthCategory={category.nthCategory}
																						nthExercise={exercise.nthExercise}
																					/>
																				</Box>
																			)}
																		</Box>
																	);
																})}
															</Box>

															<Box
																className={`flex   pl-3 rounded-b-lg min-h-[3.15rem]
																	${category.exercises.length % 2 !== 0 && context.bgSecondaryColor}
																	${context.windowWidth < 850 ? "flex-col h-21 py-2" : "flex-row items-center"}
																	
																`}>
																<Box
																	className={`flex  w-full
																				${context.windowWidth < 850 && "mt-1 pr-3"}`}>
																	<Autocomplete
																		renderOption={(props, option, index) => (
																			<li
																				{...props}
																				className={`px-3 py-2.5 text-[1.1rem] hover:cursor-pointer transition-colors duration-150 
																						${context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}`}>
																				{option}
																			</li>
																		)}
																		className="w-full mr-2 font-bold"
																		freeSolo
																		onOpen={() => {
																			setOverflowHidden((prev) => [...prev, `Cat-${category.nthCategory}`]);
																		}}
																		onClose={() => {
																			setOverflowHidden((prev) => prev.filter((entity) => entity !== `Cat-${category.nthCategory}`));
																		}}
																		disableClearable
																		value={exerciseSearchValue[`${day.nthDay}-${category.nthCategory}`] || ""}
																		onChange={(event, newValue) => handleExerciseSearchChange(event, newValue, day.nthDay, category.nthCategory)}
																		inputValue={exerciseSearchInputValue[`${day.nthDay}-${category.nthCategory}`] || ""}
																		onInputChange={(event, newInputValue) => handleExerciseInputChange(event, newInputValue, day.nthDay, category.nthCategory)}
																		options={
																			props.selectedSport.hasCategories
																				? exerciseOptions
																						.filter((categoryWithExercises) => categoryWithExercises.category === category.categoryName) // Filtrujeme podle názvu kategorie
																						.map((categoryWithExercises) => categoryWithExercises.exercises) // Mapujeme cvičení do pole
																						.flat() // Sloučíme všechny cvičení do jednoho pole
																				: exerciseOptionsWithoutCategory
																		}
																		renderInput={(params) => (
																			<TextField
																				{...params}
																				inputRef={inputRef}
																				variant="standard"
																				placeholder="Přidat cvik"
																				size="small"
																				type="search"
																				sx={{
																					"& .MuiInputBase-input::placeholder": {
																						color: "#969696",
																						opacity: 1,
																					},
																					"& .MuiInputBase-root::-webkit-search-cancel-button": {
																						display: "none", // Skrýt křížek
																					},
																				}}
																				InputProps={{
																					...params.InputProps,
																					classes: { input: "text-[#E9E9E9] " },
																				}}
																			/>
																		)}
																		PaperComponent={(props) => (
																			<Paper
																				{...props}
																				className={`text-[#E9E9E9] font-light border-2 rounded-xl mt-1 min-h-6
																					${context.bgSecondaryColor} ${context.borderQuaternaryColor}`}
																			/>
																		)}
																	/>

																	<ButtonComp
																		justClick
																		dontChangeOutline
																		content={IconEnum.PLUS}
																		color="text-green-icon"
																		style=" ml-1"
																		size="small"
																		onClick={() => addExercise(exerciseSearchInputValue[`${day.nthDay}-${category.nthCategory}`] || "", day.nthDay, category.nthCategory)}
																	/>
																</Box>

																<Box
																	className={`flex items-center pr-2.5 opacity-50 pb-1 pt-0.5
																				${context.windowWidth < 850 ? "justify-end mt-2" : "flex-row h-12"}`}>
																	<Box className={`flex items-center  ${trainingPlanHasBurdenAndUnit ? " w-[9.5rem] justify-center" : "w-[8rem] justify-end pr-2 pb-2"}`}>
																		<TextField
																			disabled
																			value={""}
																			variant="standard"
																			size="small"
																			className="w-[2.2rem] p-0 -mt-1"
																			InputProps={{
																				classes: { input: "p-1 text-right pb-[0.08rem]" },
																				inputProps: { min: 1, max: 999, step: 1 },
																				disableUnderline: false,
																				sx: {
																					"&:before": {
																						borderBottom: "1px solid rgba(255,255,255,0.7) !important", // ✅ celistvá čára i při disabled
																					},
																					"&:hover:not(.Mui-disabled):before": {
																						borderBottom: "2px solid rgba(255,255,255,0.9)", // (volitelné, hover efekt)
																					},
																					"&.Mui-disabled:before": {
																						borderBottom: "1px solid rgba(255,255,255,0.5) !important", // ✅ override dashed
																					},
																				},
																			}}
																		/>

																		<Typography className="w-6 text-center font-light">x</Typography>

																		<TextField
																			disabled
																			value={""}
																			variant="standard"
																			size="small"
																			className="w-[2.2rem] p-0 -mt-1"
																			InputProps={{
																				classes: { input: "p-1 text-right pb-[0.08rem]" },
																				inputProps: { min: 1, max: 999, step: 1 },
																				disableUnderline: false,
																				sx: {
																					"&:before": {
																						borderBottom: "1px solid rgba(255,255,255,0.7) !important", // ✅ celistvá čára i při disabled
																					},
																					"&:hover:not(.Mui-disabled):before": {
																						borderBottom: "2px solid rgba(255,255,255,0.9)", // (volitelné, hover efekt)
																					},
																					"&.Mui-disabled:before": {
																						borderBottom: "1px solid rgba(255,255,255,0.5) !important", // ✅ override dashed
																					},
																				},
																			}}
																		/>
																	</Box>

																	{trainingPlanHasBurdenAndUnit ? (
																		<Box className="flex items-center justify-end w-[8.15rem]">
																			<TextField
																				disabled
																				value={""}
																				variant="standard"
																				size="small"
																				className="w-[2.2rem] p-0 -mt-1 "
																				InputProps={{
																					classes: { input: "p-1 text-right pb-[0.08rem]" },
																					inputProps: { min: 1, max: 999, step: 1 },
																					disableUnderline: false,
																					sx: {
																						"&:before": {
																							borderBottom: "1px solid rgba(255,255,255,0.7) !important", // ✅ celistvá čára i při disabled
																						},
																						"&:hover:not(.Mui-disabled):before": {
																							borderBottom: "2px solid rgba(255,255,255,0.9)", // (volitelné, hover efekt)
																						},
																						"&.Mui-disabled:before": {
																							borderBottom: "1px solid rgba(255,255,255,0.5) !important", // ✅ override dashed
																						},
																					},
																				}}
																			/>

																			<Box className=" w-[4.8rem] flex ">
																				<FormControl
																					className=" ml-2"
																					variant="standard"
																					sx={{
																						"& .MuiSelect-select": {
																							backgroundColor: "transparent !important",
																						},
																					}}>
																					<Select
																						disabled
																						value={"minn"}
																						className=" h-[2rem]  "
																						disableUnderline
																						sx={{
																							"& .MuiSelect-select": {
																								display: "flex",
																								alignItems: "center",
																								backgroundColor: "transparent !important",
																							},
																							"& .MuiSelect-select.Mui-disabled": {
																								color: "#fff !important", // ✅ bílý text i při disabled
																								WebkitTextFillColor: "#fff !important", // 🔥 fix pro některé prohlížeče jako Safari
																								opacity: 1, // (volitelně, odstraní šedivost)
																							},
																						}}
																						IconComponent={() => null}
																						renderValue={(value) => (
																							<Box
																								className="flex items-center gap-2 ml-0.5 -mr-5  justify-between
																									 h-full">
																								<Typography className="w-[1.7rem] ">{UnitShortcuts[props.selectedSport.unitCode]}</Typography>
																								<ButtonComp
																									content={IconEnum.ARROW_DROP_DOWN}
																									style="mb-2 mt-2 ml-0.5   "
																									color="text-[#fff]"
																									size="small"
																								/>
																							</Box>
																						)}
																						MenuProps={{
																							PaperProps: {
																								sx: {
																									marginLeft: "0.1rem",
																									borderRadius: "0.75rem",
																									borderTopLeftRadius: "0.25rem",
																									fontWeight: 300,
																								},
																								className: `text-[#E9E9E9] font-light border-2 rounded-xl  ${context.bgSecondaryColor} ${context.borderQuaternaryColor}`,
																							},
																							anchorOrigin: {
																								vertical: "bottom",
																								horizontal: "right",
																							},
																							transformOrigin: {
																								vertical: "top",
																								horizontal: "right",
																							},
																						}}></Select>
																				</FormControl>
																			</Box>
																		</Box>
																	) : null}
																</Box>

																{showMoveAndDeleteButtons && context.windowWidth >= 850 && (
																	<MoveAndDeleteButtons
																		nthDay={0}
																		nthCategory={0}
																		nthExercise={0}
																		disable
																	/>
																)}
															</Box>
														</Box>

														{showRecommendeValues && context.windowWidth >= 850 && (
															<Box
																key={"sec-" + category.nthCategory}
																className={`ml-8 flex flex-col mt-3  overflow-hidden
																	${trainingPlanHasBurdenAndUnit ? "w-72 min-w-72 max-w-72" : "w-44  min-w-44 max-w-44"}
																		${context.borderPrimaryColor}
																		${category.exercises.length == 0 ? "border-x-2  rounded-t-xl mb-[3.2rem]" : "mb-[3.15rem] border-2 rounded-xl"}
																		${category.exercises.length == 0 && props.selectedSport.hasCategories && "border-t-2"}`}>
																{props.selectedSport.hasCategories ? (
																	<Box
																		className={`flex items-center justify-start h-[3.05rem] border-b-2 w-full
																					${context.borderTertiaryColor} ${context.bgTertiaryColor}`}>
																		<ButtonComp
																			justClick
																			dontChangeOutline
																			content={IconEnum.ARROW}
																			contentStyle="rotate-180"
																			color="text-white"
																			style="ml-2"
																			size="small"
																			onClick={() => executeRecommendedDifficultyValsForCategories(category.nthDay, category.nthCategory)}
																		/>
																		<Box className="flex items-center h-full w-full justify-end ">
																			<Box className="flex w-16 justify-end  ">
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

																			<Box className="flex w-16">
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

																			{trainingPlanHasBurdenAndUnit ? (
																				<Box className=" w-[6.25rem] flex justify-center    ">
																					{trainingPlanUnitCode === 1 ? (
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
																					) : trainingPlanUnitCode === 2 ? (
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
																					) : trainingPlanUnitCode === 3 ? (
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
																) : (
																	<></>
																)}

																<Box className="">
																	{category.exercises.map((exercise, index) => {
																		const recommendedVals: { series: number; repetitions: number; burden: number } = findRecommendedDifficultyVal(exercise.exerciseId, category.categoryName);
																		const unitCodeVal: number = findUnitCodeVal(exercise.exerciseId, category.categoryName);

																		return (
																			<Box
																				key={`exercise-${exercise.nthExercise}`}
																				id={`exercise-${exercise.nthDay}-${exercise.nthCategory}-${exercise.nthExercise}`}
																				className={`flex items-center py-2 w-full 
																			${exercise.nthExercise % 2 === 0 && context.bgSecondaryColor} ${category.exercises.length - 1 !== index ? "border-b-2" + context.borderPrimaryColor : !props.selectedSport.hasCategories ? "rounded-b-lg" : ""}
																			transition-all duration-100 ease-in-out`} // Přechod na všechny vlastnosti
																				style={{
																					height: exercise.boxHeight,
																					opacity: exercise.isVisible ? 1 : 0, // Postupné zobrazování pomocí opacity
																					transform: exercise.isVisible ? "translateY(0)" : "translateY(-10px)", // Jemný pohyb při zobrazení
																				}}>
																				{exercise.exerciseId > 0 ? (
																					<>
																						<ButtonComp
																							justClick
																							dontChangeOutline
																							disabled={recommendedVals.series < 1 && recommendedVals.repetitions < 1 && recommendedVals.burden < 1 && exercise.unitCode === 0}
																							content={IconEnum.ARROW}
																							contentStyle="rotate-180"
																							color="text-white"
																							style="ml-2"
																							size="small"
																							onClick={() =>
																								executeRecommendedDifficultyValsForExercise(
																									exercise.nthDay,
																									exercise.nthCategory,
																									exercise.nthExercise,
																									recommendedVals.series,
																									recommendedVals.repetitions,
																									recommendedVals.burden,
																									unitCodeVal
																								)
																							}
																						/>
																						<Box className="flex items-center w-full justify-end ">
																							<Box className="flex items-center w-full">
																								<Typography className="w-16 text-right">{recommendedVals.series > 0 ? recommendedVals.series : ""}</Typography>
																								<Typography className="w-6 font-light text-center">x</Typography>
																								<Typography className="w-12">{recommendedVals.repetitions > 0 ? recommendedVals.repetitions : ""}</Typography>
																							</Box>
																							{trainingPlanHasBurdenAndUnit ? (
																								<Box className="flex items-center  w-fit">
																									<Typography className="w-16 text-right">{recommendedVals.burden > 0 ? recommendedVals.burden : ""}</Typography>
																									<Typography className=" ml-2 font-light w-9">{UnitShortcuts[unitCodeVal]}</Typography>
																								</Box>
																							) : null}
																						</Box>
																					</>
																				) : (
																					<ButtonComp
																						justClick
																						disabled
																						dontChangeOutline
																						content={IconEnum.ARROW}
																						contentStyle="rotate-180"
																						color="text-white"
																						style="ml-2"
																						size="small"
																						onClick={() => {}}
																					/>
																				)}
																			</Box>
																		);
																	})}
																</Box>
															</Box>
														)}
													</Box>
												))}

												{props.selectedSport.hasCategories ? (
													<Box className="flex w-full justify-center">
														<Box className={` w-full max-w-[60rem]`}>
															<Box
																className={` mt-3 flex flex-col w-full border-x-2  border-t-2  rounded-t-xl mb-2
																			${context.borderPrimaryColor} ${context.bgTertiaryColor}`}>
																<Box
																	className={`flex items-center  border-b-2 min-h-[3.15rem]

																				${context.borderTertiaryColor}`}>
																	{props.selectedSport.hasCategories && (
																		<Box
																			className={`w-full h-full  flex 
																						${context.windowWidth < 850 ? "flex-col h-21" : " items-center flex-row h-12"}`}>
																			<Box
																				className={`flex  w-full
																				${context.windowWidth < 850 ? "mt-2  items-center h-10" : ""}`}>
																				<Autocomplete
																					disablePortal
																					renderOption={(props, option) => (
																						<li
																							{...props}
																							className={`px-3 py-2.5 text-[1.1rem] hover:cursor-pointer transition-colors duration-150
																							${context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}`}>
																							{option}
																						</li>
																					)}
																					className="w-full mr-2 ml-3 mt-0.5 font-bold"
																					freeSolo
																					onOpen={() => {
																						setOverflowHidden((prev) => [...prev, `Day-${day.nthDay}`]);
																					}}
																					onClose={() => {
																						setOverflowHidden((prev) => prev.filter((entity) => entity !== `Day-${day.nthDay}`));
																					}}
																					disableClearable
																					noOptionsText="Žádná vhodná kategorie nenalezena"
																					value={categorySearchValue[`${day.nthDay}`] || ""}
																					onChange={(event, newValue, reason) => handleCategorySearchChange(event, newValue, day.nthDay)}
																					inputValue={categorySearchInputValue[`${day.nthDay}`] || ""}
																					onInputChange={(event, newInputValue) => handleCategoryInputChange(event, newInputValue, day.nthDay)}
																					options={categoryOptions} // Seznam kategorií
																					renderInput={(params) => (
																						<TextField
																							{...params}
																							inputRef={inputRef}
																							variant="standard"
																							type="search"
																							placeholder="Přidat kategorii"
																							size="small"
																							sx={{
																								"& .MuiInputBase-input::placeholder": {
																									color: "#a6a6a6",
																									opacity: 1,
																								},
																							}}
																							InputProps={{
																								...params.InputProps,
																								classes: { input: "text-[#E9E9E9] text-lg" },
																							}}
																						/>
																					)}
																					PaperComponent={(props) => (
																						<Paper
																							{...props}
																							className={`text-[#E9E9E9] font-light border-2 rounded-xl mt-1 min-h-6 
																								${context.bgSecondaryColor} ${context.borderQuaternaryColor}`}
																						/>
																					)}
																				/>

																				<ButtonComp
																					justClick
																					dontChangeOutline
																					content={IconEnum.PLUS}
																					color="text-green-icon"
																					style="mr-3 ml-1"
																					size="small"
																					onClick={() => addCategory(categorySearchInputValue[`${day.nthDay}`] || "", day.nthDay)}
																				/>
																			</Box>

																			<Box
																				className={`flex items-center   justify-end opacity-50 
																							${context.windowWidth < 850 ? "h-21 py-2 mt-1" : "h-full"}
																							${trainingPlanHasBurdenAndUnit && "pr-9"}`}>
																				<Box className={`flex justify-end  ${trainingPlanHasBurdenAndUnit ? "w-[3.25rem]" : "w-[3.05rem]"}`}>
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

																				<Box className={`flex w-16 ${trainingPlanHasBurdenAndUnit ? "w-16" : "w-[3.3rem]"}`}>
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

																				{trainingPlanHasBurdenAndUnit ? (
																					<Box className=" w-[6.5rem] flex justify-center    ">
																						{trainingPlanUnitCode === 1 ? (
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
																						) : trainingPlanUnitCode === 2 ? (
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
																						) : trainingPlanUnitCode === 3 ? (
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
																			{showMoveAndDeleteButtons && context.windowWidth >= 850 && (
																				<MoveAndDeleteButtons
																					nthDay={0}
																					nthCategory={0}
																					nthExercise={0}
																					disable
																				/>
																			)}
																		</Box>
																	)}
																</Box>
															</Box>
														</Box>

														{showRecommendeValues && context.windowWidth >= 850 ? (
															<Box
																className={` ml-8 mt-3 rounded-t-xl overflow-hidden flex items-center justify-start gap-8  h-[3.1rem]  border-t-2 border-x-2 
																			${trainingPlanHasBurdenAndUnit ? "w-72 min-w-72 max-w-72" : "w-44  min-w-44 max-w-44"}
																			${context.bgTertiaryColor + context.borderPrimaryColor} `}>
																<Box
																	className={` rounded-t-xl  w-full h-full border-b-2
																			${context.borderTertiaryColor}`}>
																	<Box className="flex items-center h-full w-full">
																		<ButtonComp
																			style="ml-2"
																			content={IconEnum.ARROW}
																			color="text-white"
																			contentStyle="rotate-180"
																			size="small"
																			disabled
																		/>

																		<Box className="flex items-center h-full w-full justify-end opacity-50">
																			<Box className="flex w-16 justify-end  ">
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

																			<Box className="flex w-16">
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

																			{trainingPlanHasBurdenAndUnit ? (
																				<Box className=" w-[6.25rem] flex justify-center    ">
																					{trainingPlanUnitCode === 1 ? (
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
																					) : trainingPlanUnitCode === 2 ? (
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
																					) : trainingPlanUnitCode === 3 ? (
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
																</Box>
															</Box>
														) : null}
													</Box>
												) : (
													<></>
												)}
											</Box>
										</Box>
									))}

									<Box className="pt-1">
										{days.length > 0 && (
											<Box
												className={`w-full border-t-2 border-dashed absolute left-0 -mt-1
															${context.borderQuaternaryColor}`}
											/>
										)}

										<Box className="flex  h-[4rem] w-full justify-center mt-2">
											<Box
												className={`w-full 
															${showRecommendeValues && trainingPlanHasBurdenAndUnit ? "max-w-[80rem]" : showRecommendeValues && !trainingPlanHasBurdenAndUnit ? "max-w-[73.25rem]" : "max-w-[60rem]"}`}>
												<ButtonComp
													onClick={addDay}
													content={"DEN " + (days.length + 1) + "."}
													secondContent={IconEnum.PLUS}
													justClick
													dontChangeOutline
													style={`ml-[0.35rem] 
														${days.length == 0 ? "-mt-[0.4rem]" : "mt-[0.85rem]"}`}
													contentStyle="scale-[1.05] font-medium"
													secondContentStyle="scale-[0.8]"
													size="large"
												/>
											</Box>
										</Box>

										<Box className="flex flex-col w-full items-end gap-2 mb-4">
											<ButtonComp
												justClick
												dontChangeOutline
												disabled={checkIfPlanHasAtLeastOneExercise() || trainingPlanName.length < 1}
												onClick={handleSaveTrainingPlan}
												content={"Uložit tréninkový plán"}
												secondContent={IconEnum.SAVE}
												color="text-blue-icon"
												style={`mr-1  ${days.length == 0 ? "-mt-[0.4rem]" : "mt-[0.85rem]"}`}
												secondContentStyle="scale-[0.9] mr-1 mb-0.5"
												size="large"
											/>

											{trainingPlanName.length < 1 ? <Typography className="font-light text-red-icon">Je nutné zadat název tréninku.</Typography> : null}
											{checkIfPlanHasAtLeastOneExercise() ? <Typography className="font-light text-red-icon">Trénink musí mít minimálně 1 cvik.</Typography> : null}
										</Box>
									</Box>
								</Box>
							}
						/>
					</Box>
				}></TwoColumnsPage>
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	interface CreateTrainingPlanProps {
		sport: Sport;
		categoriesWithExercises?: Category[];
		exercises?: Exercise[];
		recommendedDifficultyVals?: ExerciseDifficulty[];

		labsAndVals: SportDetailLabAndVal[];

		difficulties: SportDifficulty[];
	}

	const getRandomCategory = (categories: Category[]): Category => {
		const randomIndex = Math.floor(Math.random() * categories.length);
		return categories[randomIndex];
	};

	const getRandomExercise = (exercises: Exercise[]): Exercise => {
		const randomIndex = Math.floor(Math.random() * exercises.length);
		return exercises[randomIndex];
	};

	const splitIntoThirds = (maxDaysQuantity: number) => {
		const base = Math.floor(maxDaysQuantity / 3);
		const remainder = maxDaysQuantity % 3;

		const third1 = base + (remainder > 0 ? 1 : 0);
		const third2 = base + (remainder > 1 ? 1 : 0);

		const pb1Range = third1;
		const pb2Range = third1 + third2;
		const pb3Range = maxDaysQuantity;

		return { pb1Range, pb2Range, pb3Range };
	};

	const createTrainingPlan = (localProps: CreateTrainingPlanProps): LocalDay[] => {
		const sport: Sport = localProps.sport;

		const concreteDifficulty = localProps.difficulties.find((diff) => diff.difficultyName === localProps.labsAndVals.find((labAndVal) => labAndVal.orderNumber === 7)?.value);
		const possibleDifficultiesIds = localProps.difficulties.filter((diff) => diff.orderNumber <= concreteDifficulty?.orderNumber!).map((diff) => diff.sportDifficultyId);

		const categoriesWithExercises: Category[] = localProps.categoriesWithExercises
			? localProps.categoriesWithExercises.map((category) => ({
					...category,
					exercises: category.exercises.filter((exercise) => possibleDifficultiesIds.includes(exercise.sportDifficultyId)),
			  }))
			: [];

		const exercises: Exercise[] = localProps.exercises ? localProps.exercises.filter((exercise) => possibleDifficultiesIds.includes(exercise.sportDifficultyId)) : [];
		const recommendedDifficultyVals: ExerciseDifficulty[] = localProps.recommendedDifficultyVals || [];

		const days: LocalDay[] = [];

		const minDaysQuantity = Number(localProps.labsAndVals.find((labAndVal) => labAndVal.orderNumber === 1)?.value);
		const maxDaysQuantity = Number(localProps.labsAndVals.find((labAndVal) => labAndVal.orderNumber === 2)?.value);

		const minCategoriesQuantity = Number(localProps.labsAndVals.find((labAndVal) => labAndVal.orderNumber === 3)?.value);
		const maxCategoriesQuantity = Number(localProps.labsAndVals.find((labAndVal) => labAndVal.orderNumber === 4)?.value);

		const minExerciseQuantity = Number(localProps.labsAndVals.find((labAndVal) => labAndVal.orderNumber === 5)?.value);
		const maxExerciseQuantity = Number(localProps.labsAndVals.find((labAndVal) => labAndVal.orderNumber === 6)?.value);

		const findRecommendedDifficultyVal = (exerciseId: number, categoryName: string) => {
			let series = 0;
			let repetitions = 0;
			let burden = 0;

			if (sport.hasRecommendedDifficultyValues) {
				const exerciseDiff = recommendedDifficultyVals.find((diff) => diff.sportDifficultyId === concreteDifficulty?.sportDifficultyId && diff.exerciseId === exerciseId);
				series = exerciseDiff?.series || 0;
				repetitions = exerciseDiff?.repetitions || 0;
				burden = exerciseDiff?.burden || 0;

				for (let i = (concreteDifficulty?.orderNumber || 0) - 1 || 0; i > 0; i--) {
					if (![burden, repetitions, series].includes(0)) break;

					const newConcreteDiff = localProps.difficulties.find((diff) => diff.orderNumber === i);

					const exerciseDiff = recommendedDifficultyVals.find((diff) => diff.sportDifficultyId === newConcreteDiff?.sportDifficultyId && diff.exerciseId === exerciseId);

					series = series !== 0 ? series : exerciseDiff?.series || 0;
					repetitions = repetitions !== 0 ? repetitions : exerciseDiff?.repetitions || 0;
					burden = burden !== 0 ? burden : exerciseDiff?.burden || 0;
				}
			} else {
				let foundExercise;

				if (sport.hasCategories) {
					foundExercise = categoriesWithExercises.find((category) => category.categoryName === categoryName)?.exercises.find((exercise) => exercise.exerciseId === exerciseId);
				} else {
					foundExercise = exercises.find((exercise) => exercise.exerciseId === exerciseId);
				}

				series = foundExercise?.series || 0;
				repetitions = foundExercise?.repetitions || 0;
				burden = foundExercise?.burden || 0;
			}

			return { series, repetitions, burden };
		};

		for (let i = 1; i <= maxDaysQuantity; i++) {
			if (i > minDaysQuantity) {
				const shouldContinue = Math.random() < 0.5;

				if (!shouldContinue) break;
			}

			days.push({
				nthDay: i,
				categories: localProps.sport.hasCategories
					? []
					: [
							{
								nthDay: i,
								nthCategory: 1,
								categoryName: "",
								exercises: [],
							} as LocalCategory,
					  ],
			});
		}

		if (localProps.sport.hasCategories && !!categoriesWithExercises) {
			const dayThirds = splitIntoThirds(maxCategoriesQuantity);
			let updatedCategoriesForAllDays = categoriesWithExercises;

			for (const day of days) {
				let updatedCategories = updatedCategoriesForAllDays.filter((category) => category.priorityPoints.includes(1));
				let previousCategory: Category | undefined = undefined;
				let tightConnectionStarter: Category | undefined = undefined;
				let blacklist: number[] = [];
				let actualDayThird = 1;

				for (let i = 1; day.categories.length < maxCategoriesQuantity && !(updatedCategories.length === 0 && actualDayThird === 3) && i <= 100; i++) {
					if (day.categories.length + 1 > dayThirds.pb1Range || (updatedCategories.length === 0 && day.categories.length + 1 <= dayThirds.pb1Range && actualDayThird === 1)) {
						actualDayThird = 2;
						updatedCategories = updatedCategoriesForAllDays.filter((category) => category.priorityPoints.includes(2) && !blacklist.includes(category.categoryId));
					} else if (day.categories.length + 1 > dayThirds.pb2Range || (updatedCategories.length === 0 && day.categories.length + 1 <= dayThirds.pb2Range && actualDayThird === 2)) {
						actualDayThird = 3;
						updatedCategories = updatedCategoriesForAllDays.filter((category) => category.priorityPoints.includes(3) && !blacklist.includes(category.categoryId));
					}

					let newCategory: Category | undefined;

					if (previousCategory && previousCategory.tightConnection !== null) {
						newCategory = updatedCategoriesForAllDays.find((category) => category.categoryId === previousCategory?.tightConnection && !blacklist.includes(category.categoryId));

						if (newCategory !== undefined && tightConnectionStarter === newCategory) continue;
						else if (!tightConnectionStarter) tightConnectionStarter = newCategory;
					} else if (previousCategory && previousCategory.looseConnection.length > 0) {
						const shouldUseLooseConnection = Math.random() < 0.5;

						if (shouldUseLooseConnection)
							newCategory = getRandomCategory(
								updatedCategoriesForAllDays.filter((category) => category.categoryId !== previousCategory?.categoryId && previousCategory?.looseConnection.includes(category.categoryId) && !blacklist.includes(category.categoryId))
							);
					}

					if (!newCategory) newCategory = getRandomCategory(updatedCategories.filter((category) => category.categoryId !== previousCategory?.categoryId));
					if (!newCategory) continue;

					let categoryAlreadyExists = day.categories.find((category) => category.categoryName === newCategory.categoryName);
					if (categoryAlreadyExists) {
						continue;
					}

					const newLocalCategory: LocalCategory = { nthDay: day.nthDay, nthCategory: day.categories.length + 1, categoryName: newCategory.categoryName, exercises: [] };
					day.categories.push(newLocalCategory);
					previousCategory = newCategory;

					if (!newCategory.hasRepeatability || newCategory.repeatabilityQuantity < 0) {
						updatedCategories = updatedCategories.filter((category) => category.categoryId !== newCategory.categoryId);
						updatedCategoriesForAllDays = updatedCategoriesForAllDays.filter((category) => category.categoryId !== newCategory.categoryId);
					} else {
						updatedCategories = updatedCategories.map((category) => (category.categoryId === newCategory.categoryId ? { ...category, repeatabilityQuantity: category.repeatabilityQuantity - 1 } : category));
						updatedCategoriesForAllDays = updatedCategoriesForAllDays.map((category) => (category.categoryId === newCategory.categoryId ? { ...category, repeatabilityQuantity: category.repeatabilityQuantity - 1 } : category));
					}

					blacklist = Array.from(new Set([...blacklist, ...newCategory.blacklist]));
					updatedCategories = updatedCategories.filter((category) => !blacklist.includes(category.categoryId));

					if (day.categories.length > minCategoriesQuantity) {
						const shouldContinue = Math.random() < 0.5;

						if (!shouldContinue) break;
					}
				}
			}
		}

		const categoryThirds = splitIntoThirds(maxExerciseQuantity);
		for (const day of days) {
			for (const category of day.categories) {
				let allExercisesOfCategory = sport.hasCategories ? categoriesWithExercises.find((cat) => category.categoryName === cat.categoryName)?.exercises || [] : exercises;

				let updatedExercises = allExercisesOfCategory.filter((exercise) => exercise.priorityPoints.includes(1));
				let previousExercise: Exercise | undefined = undefined;
				let tightConnectionStarter: Exercise | undefined = undefined;
				let blacklist: number[] = [];
				let actualDayThird = 1;

				for (let i = 1; category.exercises.length < maxExerciseQuantity && !(updatedExercises.length === 0 && actualDayThird === 3) && i <= 100; i++) {
					if (category.exercises.length + 1 > categoryThirds.pb1Range || (updatedExercises.length === 0 && category.exercises.length + 1 <= categoryThirds.pb1Range && actualDayThird === 1)) {
						actualDayThird = 2;
						updatedExercises = allExercisesOfCategory.filter((exercise) => exercise.priorityPoints.includes(2) && !blacklist.includes(exercise.exerciseId));
					} else if (category.exercises.length + 1 > categoryThirds.pb2Range || (updatedExercises.length === 0 && category.exercises.length + 1 <= categoryThirds.pb2Range && actualDayThird === 2)) {
						actualDayThird = 3;
						updatedExercises = allExercisesOfCategory.filter((exercise) => exercise.priorityPoints.includes(3) && !blacklist.includes(exercise.exerciseId));
					}

					let newExercise: Exercise | undefined;

					if (previousExercise && previousExercise.tightConnection !== null) {
						newExercise = updatedExercises.find((exercise) => exercise.categoryId === previousExercise?.tightConnection);

						if (newExercise !== undefined && tightConnectionStarter === newExercise) continue;
						else if (!tightConnectionStarter) tightConnectionStarter = newExercise;
					} else if (previousExercise && previousExercise.looseConnection.length > 0) {
						const shouldUseLooseConnection = Math.random() < 0.5;

						if (shouldUseLooseConnection)
							newExercise = getRandomExercise(updatedExercises.filter((exercise) => exercise.exerciseId !== previousExercise?.exerciseId && previousExercise?.looseConnection.includes(exercise.exerciseId)));
					}

					if (!newExercise) newExercise = getRandomExercise(updatedExercises.filter((exercise) => exercise.exerciseId !== previousExercise?.exerciseId));
					if (!newExercise) continue;

					const diffVals = newExercise ? findRecommendedDifficultyVal(newExercise.exerciseId, category.categoryName) : undefined;

					const newLocalExercise: LocalExercise = {
						nthDay: day.nthDay,
						nthCategory: category.nthCategory,
						categoryName: category.categoryName,
						exerciseName: newExercise.exerciseName,
						exerciseId: newExercise.exerciseId,
						nthExercise: category.exercises.length + 1,
						unitCode: newExercise.unitCode,
						isVisible: true,
						series: diffVals ? diffVals.series : 0,
						repetitions: diffVals ? diffVals.repetitions : 0,
						burden: diffVals ? diffVals.burden : 0,
					};
					category.exercises.push(newLocalExercise);
					previousExercise = newExercise;

					if (!newExercise.hasRepeatability || newExercise.repeatabilityQuantity < 0) {
						updatedExercises = updatedExercises.filter((exercise) => exercise.exerciseId !== newExercise.exerciseId);
						allExercisesOfCategory = allExercisesOfCategory.filter((exercise) => exercise.exerciseId !== newExercise.exerciseId);
					} else {
						updatedExercises = updatedExercises.map((exercise) => (exercise.exerciseId === newExercise.exerciseId ? { ...exercise, repeatabilityQuantity: exercise.repeatabilityQuantity - 1 } : exercise));
						allExercisesOfCategory = allExercisesOfCategory.map((exercise) => (exercise.exerciseId === newExercise.exerciseId ? { ...exercise, repeatabilityQuantity: exercise.repeatabilityQuantity - 1 } : exercise));
					}

					blacklist = Array.from(new Set([...blacklist, ...newExercise.blacklist]));
					updatedExercises = updatedExercises.filter((exercise) => !blacklist.includes(exercise.exerciseId));

					if (category.exercises.length > minExerciseQuantity) {
						const shouldContinue = Math.random() < 0.5;

						if (!shouldContinue) break;
					}
				}
			}
		}

		return days;
	};

	try {
		const cookies = cookie.parse(context.req.headers.cookie || "");
		const authToken = cookies.authToken || null;
		const sportId = cookies.tpc_tmp ? Number(atob(cookies.tpc_tmp)) : -1;

		//console.log("Sport ID → " + sportId);
		//context.res.setHeader("Set-Cookie", "tpc_tmp=; path=/; max-age=0;"); // TODO Možná smazat až po vytvořenní tréninku. Kdybych zaktualizoval stránku, tka nevím, jaký sport začít dělat.

		const visitedUserId = cookies.view_tmp ? Number(atob(cookies.view_tmp)) : -1;
		if (visitedUserId > 0) {
			const response = await getVisitedUserTrainingPlanCreationPropsReq({ sportId, authToken, visitedUserId });

			if (response.status === 200 && response.data) {
				const automaticCreation = cookies.tpac_tmp ? Boolean(cookies.tpac_tmp) : false;

				const labsAndVals = await getVisitedUserSportDetailLabsAndValsReq({ authToken, sportId, visitedUserId });
				const difficulties = await getVisitedUserDifficultiesReq({ sportId, authToken, visitedUserId });

				const edit = cookies.tpc_edit || false;
				const trainingPlanId = cookies.tp_tmp ? Number(atob(cookies.tp_tmp)) : -1;

				if (edit && trainingPlanId !== -1) {
					const resTrainingPlans = await getVisitedUserTrainingPlansReq({ authToken, visitedUserId });
					const resTrainingPlanExercises = await getVisitedUserTrainingPlanExercisesReq({ authToken, trainingPlanId, visitedUserId });

					if (resTrainingPlans.status === 200 && resTrainingPlans.data && resTrainingPlanExercises.status === 200 && resTrainingPlanExercises.data) {
						const trainingPlan = resTrainingPlans.data.trainingPlans.find((trainingPlan) => trainingPlan.trainingPlanId === trainingPlanId);

						return {
							props: {
								sportsData: response.data || [],
								selectedSport: response.data.sport,
								categoriesData: response.data.categoriesWithExercises || [],
								exercisesData: response.data.exercises || [],
								recommendedDifficultiesData: response.data.recommendedDifficultyVals || [],
								automaticCreationDays: [],
								labsAndVals: labsAndVals.data || [],
								difficulties: difficulties.data || [],
								edit: true,
								trainingPlan: trainingPlan,
								trainingPlanExercises: resTrainingPlanExercises.data.trainingPlanExercises,
							},
						};
					}
				}

				const days =
					automaticCreation && labsAndVals?.data && difficulties?.data
						? createTrainingPlan({
								sport: response.data.sport,
								categoriesWithExercises: response.data.categoriesWithExercises,
								exercises: response.data.exercises, // pokud má response.data.exercises nějaká data
								recommendedDifficultyVals: response.data.recommendedDifficultyVals, // pokud má response.data.recommendedDifficultyVals
								labsAndVals: labsAndVals.data, // správné použití parametru
								difficulties: difficulties.data,
						  })
						: undefined;

				return {
					props: {
						sportsData: response.data || [],
						selectedSport: response.data.sport,
						categoriesData: response.data.categoriesWithExercises || [],
						exercisesData: response.data.exercises || [],
						recommendedDifficultiesData: response.data.recommendedDifficultyVals || [],
						automaticCreationDays: days || [],
						labsAndVals: labsAndVals.data || [],
						difficulties: difficulties.data || [],
					},
				};
			}
		}

		//
		//
		//

		const response = await getTrainingPlanCreationPropsReq({ sportId, authToken });

		if (response.status === 200 && response.data) {
			const automaticCreation = cookies.tpac_tmp ? Boolean(cookies.tpac_tmp) : false;

			const labsAndVals = await getSportDetailLabsAndValsReq({ authToken, sportId });

			const difficulties = await getDifficultiesReq({ sportId, authToken });

			const edit = cookies.tpc_edit || false;
			const trainingPlanId = cookies.tp_tmp ? Number(atob(cookies.tp_tmp)) : -1;

			if (edit && trainingPlanId !== -1) {
				const resTrainingPlans = await getTrainingPlansReq({ authToken });
				const resTrainingPlanExercises = await getTrainingPlanExercisesReq({ authToken, trainingPlanId });

				if (resTrainingPlans.status === 200 && resTrainingPlans.data && resTrainingPlanExercises.status === 200 && resTrainingPlanExercises.data) {
					const trainingPlan = resTrainingPlans.data.trainingPlans.find((trainingPlan) => trainingPlan.trainingPlanId === trainingPlanId);

					return {
						props: {
							sportsData: response.data || [],
							selectedSport: response.data.sport,
							categoriesData: response.data.categoriesWithExercises || [],
							exercisesData: response.data.exercises || [],
							recommendedDifficultiesData: response.data.recommendedDifficultyVals || [],
							automaticCreationDays: [],
							labsAndVals: labsAndVals.data || [],
							difficulties: difficulties.data || [],
							edit: true,
							trainingPlan: trainingPlan,
							trainingPlanExercises: resTrainingPlanExercises.data.trainingPlanExercises,
						},
					};
				}
			}

			const days =
				automaticCreation && labsAndVals?.data && difficulties?.data
					? createTrainingPlan({
							sport: response.data.sport,
							categoriesWithExercises: response.data.categoriesWithExercises,
							exercises: response.data.exercises, // pokud má response.data.exercises nějaká data
							recommendedDifficultyVals: response.data.recommendedDifficultyVals, // pokud má response.data.recommendedDifficultyVals
							labsAndVals: labsAndVals.data, // správné použití parametru
							difficulties: difficulties.data,
					  })
					: undefined;

			return {
				props: {
					sportsData: response.data || [],
					selectedSport: response.data.sport,
					categoriesData: response.data.categoriesWithExercises || [],
					exercisesData: response.data.exercises || [],
					recommendedDifficultiesData: response.data.recommendedDifficultyVals || [],
					automaticCreationDays: days || [],
					labsAndVals: labsAndVals.data || [],
					difficulties: difficulties.data || [],
				},
			};
		} else {
			console.error("Error fetching sports data:", response.message);
			return {
				redirect: {
					destination: "/training-plans",
					permanent: false,
				},
			};
		}
	} catch (error) {
		console.error("Caught error:", error instanceof Error ? error.message : error);

		return {
			redirect: {
				destination: "/training-plans",
				permanent: false,
			},
		};
	}
};

export default ManualCreation;
