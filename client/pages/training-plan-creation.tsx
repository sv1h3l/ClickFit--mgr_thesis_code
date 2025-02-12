import GeneralCard from "@/components/GeneralCard";
import SingleColumnPage from "@/components/SingleColumnPage";
import { ArrowBack, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Box, Button, Paper, TextField, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";

const options = ["Záda", "Ramena", "Biceps", "Triceps", "Prsa"];
const exerciseOptions = ["Deadlift", "Bench Press", "Squat", "Pull-up", "Push-up", "Stahování horní kladky nadhmatem ve stoje"];

export interface Day {
	nthDay: number;
	categories: Category[];
}

interface Category {
	nthDay: number;
	nthCategory: number;
	categoryName: string;
	exercises: Exercise[];
}

interface Exercise {
	nthDay: number;
	nthCategory: number;
	nthExercise: number;

	categoryName: string;

	//exerciseId: number; TODO předělat na numberz databáze
	exerciseName: string;

	repetitions: number;
	series: number;
	weightTime: number;
	isWeight: boolean;

	boxHeight: number;
	isVisible?: boolean;
}

const ManualCreation = () => {
	const [days, setDays] = useState<Day[]>([]);
	const [showDeleteButtons, setShowDeleteButtons] = useState<boolean>(false); // TODO → doimplementovat ?
	const [showMoveButtons, setShowMoveButtons] = useState<boolean>(false);

	const [exerciseSearchInputValue, setExerciseSearchInputValue] = useState<{ [key: string]: string }>({});
	const [exerciseSearchValue, setExerciseSearchValue] = useState<{ [key: string]: string }>({});

	const [categorySearchInputValue, setCategorySearchInputValue] = useState<{ [key: string]: string }>({});
	const [categorySearchValue, setCategorySearchValue] = useState<{ [key: string]: string }>({});

	useEffect(() => {
		const storedDays = sessionStorage.getItem("categories");
		if (storedDays) {
			setDays(JSON.parse(storedDays));
		}
	}, []);

	// #region Day
	const addDay = () => {
		const newDay: Day = {
			nthDay: days.length > 0 ? days[days.length - 1].nthDay + 1 : 1,
			categories: [],
		};
		setDays([...days, newDay]);
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
								weightTime: 0,
								isWeight: true,
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
						weightTime: 0,
						isWeight: true,
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

	const updateBoxSize = (exercise: Exercise, element: HTMLElement) => {
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

	useEffect(() => {
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

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [days]);
	// #endregion

	const extractExercises = () => {
		console.log("Aktuální dny:", days);
		const allExercises = days.flatMap((day) => day.categories.flatMap((category) => category.exercises));
		console.log("Extrahovaná cvičení:", allExercises);
		return allExercises;
	};

	const handleSaveTrainingPlan = () => {
		const extractedExercises = extractExercises();

		if (extractedExercises === undefined || extractedExercises.length === 0) {
			console.error("Žádná cvičení nejsou k dispozici pro odeslání.");
		} else {
			console.log("Odesílám cvičení:", JSON.stringify(extractedExercises));
		}
	};

	const MoveAndDeleteButtons = ({ nthDay, nthCategory, nthExercise }: { nthDay: number; nthCategory?: number; nthExercise?: number }) => {
		return (
			<Box className="flex relative ">
				{/*{nthCategory && !nthExercise && <Box className="border-t-2 border-r-2 border-gray-200 h-7 rounded-tr-xl absolute top-2 right-0 w-[6.8rem]" />}*/}

				<Button
					onClick={nthCategory && nthExercise ? () => moveExerciseUp(nthDay, nthCategory, nthExercise) : nthCategory ? () => moveCategoryUp(nthDay, nthCategory) : () => moveDayUp(nthDay)}
					size="small"
					className={`w-auto h-auto p-1 min-w-8 `}>
					<ArrowUpward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					onClick={nthCategory && nthExercise ? () => moveExerciseDown(nthDay, nthCategory, nthExercise) : nthCategory ? () => moveCategoryDown(nthDay, nthCategory) : () => moveDayDown(nthDay)}
					size="small"
					className={`w-auto h-auto p-1 min-w-8 `}>
					<ArrowDownward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					onClick={nthCategory && nthExercise ? () => removeExercise(nthDay, nthCategory, nthExercise) : nthCategory ? () => removeCategory(nthDay, nthCategory) : () => removeDay(nthDay)}
					size="small"
					className={`w-auto h-auto p-1 min-w-8 ml-3 mr-2 `}>
					<CloseIcon
						className="text-red-400"
						fontSize="small"
					/>
				</Button>
			</Box>
		);
	};

	const insertValueFromTextField = (exercise: Exercise, component: React.FormEvent<HTMLDivElement>, isValueForRepetitions: boolean, isValueForSeries: boolean) => {
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
													weightTime: value,
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

	return (
		<>
			<Head>
				<title>Tvorba tréninku - KlikFit</title>
			</Head>

			<Layout>
				<SingleColumnPage>
					<Box className="flex h-full p-0 m-0">
						<GeneralCard
							width="w-full"
							height="h-full relative"
							title="Tvorba tréninku"
							border>
							<Box className="space-y-7">
								{days.map((day, index) => (
									<Box
										key={day.nthDay}
										className="flex flex-col mt-4">
										{index > 0 && <Box className="w-full border-t-2 border-gray-100 border-dashed absolute left-0" />}

										<Box className={`flex mr-[20.1rem] ${index + 1 > 1 && "pt-4"}`}>
											<Box className="flex items-center w-full">
												<Typography className="text-2xl w-full"> {`Den ${index + 1}.`} </Typography>

												<MoveAndDeleteButtons nthDay={day.nthDay} />
											</Box>
										</Box>

										<Box className="flex flex-col flex-wrap ">
											{day.categories.map((category) => (
												<Box
													key={category.nthDay}
													className="flex">
													<Box
														key={category.nthCategory}
														className={` mt-3 ${"pt-0"} flex flex-col w-full border-2 border-gray-100 rounded-xl mb-8 `}>
														<Box className="flex items-center gap-8 border-b-4 border-double  border-gray-100 h-[3.06rem] ">
															<Box className="w-full h-full items-center flex">
																<Typography className="text-lg pl-3">{category.categoryName}</Typography>
															</Box>

															<Box className="flex items-center gap-10  relative ">
																<Box className="flex mr-[3.15rem]">
																	<Image
																		src="/icons/cycle-mgr.svg"
																		width={28}
																		height={28}
																		alt=""
																	/>
																	<Typography className="w-6 mt-0.5 mx-3 text-center font-light">x</Typography>
																	<Image
																		src="/icons/sequence2.svg"
																		width={28}
																		height={28}
																		alt=""
																	/>
																</Box>

																<Box className="flex mr-[1.5rem] ">
																	<Image
																		src="/icons/weight.svg"
																		width={28}
																		height={28}
																		alt=""
																	/>
																	<Typography className="font-thin text-2xl mx-1.5 w-6">|</Typography>
																	<Image
																		src="/icons/stopwatch.svg"
																		width={28}
																		height={28}
																		alt=""
																	/>
																</Box>
															</Box>

															<MoveAndDeleteButtons
																nthDay={day.nthDay}
																nthCategory={category.nthCategory}
															/>
														</Box>

														<Box className="">
															{category.exercises.map((exercise) => (
																<Box
																	key={exercise.nthExercise}
																	id={`exercise-${exercise.nthDay}-${exercise.nthCategory}-${exercise.nthExercise}`}
																	className={`flex items-center pl-3 py-2   border-b-2 gap-8 border-gray-100  
																	${exercise.nthExercise % 2 !== 0 && "bg-gray-50"} 
																	transition-all duration-150 ease-in-out`} // Přidání přechodu
																	style={{
																		opacity: exercise.isVisible ? 1 : 0, // Postupné zobrazení pomocí opacity
																		transform: exercise.isVisible ? "translateY(0)" : "translateY(-10px)", // Jemný pohyb při zobrazení
																	}}>
																	<Typography className="font-light w-full">{exercise.exerciseName}</Typography>

																	<Box className="flex items-center gap-12">
																		<Box className="flex items-center">
																			<TextField
																				value={exercise.repetitions != 0 ? exercise.repetitions : ""}
																				variant="standard"
																				size="small"
																				className="w-[2.2rem] p-0"
																				InputProps={{
																					classes: { input: "p-1 text-right" },
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

																			<Typography className="w-6  text-center font-light">x</Typography>

																			<TextField
																				value={exercise.series || ""}
																				variant="standard"
																				size="small"
																				className="w-[2.2rem] p-0"
																				InputProps={{
																					classes: { input: "p-1  " },
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
																		</Box>

																		<Box className="flex items-center">
																			<TextField
																				value={exercise.weightTime || ""}
																				variant="standard"
																				size="small"
																				className="w-[2.2rem] p-0" // TODO kg 3rem, sec 2.8rem
																				InputProps={{
																					classes: { input: "p-1  text-right" },
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
																			<Typography className="ml-2 font-light w-6">{exercise.nthExercise % 2 !== 0 ? "kg" : "sec"}</Typography>
																		</Box>
																	</Box>

																	<MoveAndDeleteButtons
																		nthDay={day.nthDay}
																		nthCategory={category.nthCategory}
																		nthExercise={exercise.nthExercise}
																	/>
																</Box>
															))}
														</Box>

														<Box
															className={`flex py-2 items-center pl-3 rounded-b-xl 
  																	${category.exercises.length % 2 === 0 ? "bg-gray-50" : ""}`}>
															<Autocomplete
																className="w-full mr-2 font-bold"
																freeSolo
																disableClearable
																value={exerciseSearchValue[`${day.nthDay}-${category.nthCategory}`] || ""}
																onChange={(event, newValue) => handleExerciseSearchChange(event, newValue, day.nthDay, category.nthCategory)}
																inputValue={exerciseSearchInputValue[`${day.nthDay}-${category.nthCategory}`] || ""}
																onInputChange={(event, newInputValue) => handleExerciseInputChange(event, newInputValue, day.nthDay, category.nthCategory)}
																options={exerciseOptions}
																renderInput={(params) => (
																	<TextField
																		{...params}
																		variant="standard"
																		placeholder="Přidat cvik"
																		size="small"
																		sx={{
																			"& .MuiInputBase-input::placeholder": {
																				color: "gray",
																				opacity: 1,
																			},
																		}}
																		InputProps={{
																			...params.InputProps,
																			classes: { input: "text-black font-light" },
																		}}
																	/>
																)}
																PaperComponent={(props) => (
																	<Paper
																		{...props}
																		className="bg-white text-black font-light"
																	/>
																)}
															/>

															<Button
																onClick={() => addExercise(exerciseSearchInputValue[`${day.nthDay}-${category.nthCategory}`] || "", day.nthDay, category.nthCategory)}
																size="small"
																className={`w-auto h-auto p-1 min-w-8 mr-2 `}>
																<AddIcon
																	className="text-green-500"
																	fontSize="small"
																/>
															</Button>
														</Box>
													</Box>

													<Box
														key={"sec-" + category.nthCategory}
														className={`ml-8 flex flex-col border-2 border-gray-100 rounded-xl mb-8 mt-3 w-72 min-w-72 max-w-72`}>
														<Box className="flex items-center justify-end gap-8  h-[3.06rem] border-b-4 border-double w-full border-gray-100">
															<Box className="flex mr-[1.15rem] ">
																<Image
																	src="/icons/cycle-mgr.svg"
																	width={28}
																	height={28}
																	alt=""
																/>
																<Typography className="w-6 mt-0.5 mx-1 text-center font-light">x</Typography>
																<Image
																	src="/icons/sequence2.svg"
																	width={28}
																	height={28}
																	alt=""
																/>
															</Box>

															<Box className="flex  mr-[0.7rem]">
																<Image
																	src="/icons/weight.svg"
																	width={28}
																	height={28}
																	alt=""
																/>
																<Typography className="font-thin text-2xl mx-1.5">|</Typography>
																<Image
																	src="/icons/stopwatch.svg"
																	width={28}
																	height={28}
																	alt=""
																/>
															</Box>
														</Box>

														<Box className="">
															{category.exercises.map((exercise) => (
																<Box
																	key={`exercise-${exercise.nthExercise}`}
																	id={`exercise-${exercise.nthDay}-${exercise.nthCategory}-${exercise.nthExercise}`}
																	className={`flex items-center py-2 w-full border-b-2  border-gray-100  ${exercise.nthExercise % 2 !== 0 && "bg-gray-50"} transition-all duration-100 ease-in-out`} // Přechod na všechny vlastnosti
																	style={{
																		height: exercise.boxHeight,
																		opacity: exercise.isVisible ? 1 : 0, // Postupné zobrazování pomocí opacity
																		transform: exercise.isVisible ? "translateY(0)" : "translateY(-10px)", // Jemný pohyb při zobrazení
																	}}>
																	<Button
																		size="small"
																		className={`w-auto h-auto p-1 min-w-8 ml-1 mr-3 `}>
																		{/*${nthCategory && !nthExercise && "mt-3 top-0.5"} ${!nthCategory && " top-1"} */}
																		<ArrowBack
																			className="text-blue-300"
																			fontSize="small"
																		/>
																	</Button>
																	<Box className="flex items-center w-full justify-center gap-10">
																		<Box className="flex items-center">
																			<Typography className="w-[2.2rem] text-right">{exercise.repetitions}</Typography>
																			<Typography className="mx-2 font-light">x</Typography>
																			<Typography className="w-[2.2rem]">{exercise.series}</Typography>
																		</Box>
																		<Box className="flex items-center">
																			<Typography className="w-[2.2rem] text-right">{exercise.weightTime}</Typography>
																			<Typography className="ml-2 font-light w-6">{"sec"}</Typography>
																		</Box>
																	</Box>
																</Box>
															))}
														</Box>
													</Box>
												</Box>
											))}

											<Box className="mr-[20rem]">
												<Box className={` mt-3 ${"pt-0"} flex flex-col w-full border-x-2 border-t-2 border-gray-100 rounded-t-xl mb-8`}>
													<Box className="flex items-center gap-8 border-b-4 border-double  border-gray-100 h-[3.06rem] ">
														<Box className="w-full h-full items-center flex">
															<Autocomplete
																className="w-full mr-2 ml-3 mt-0.5 font-bold"
																freeSolo
																disableClearable
																value={categorySearchValue[`${day.nthDay}`] || ""}
																onChange={(event, newValue) => handleCategorySearchChange(event, newValue, day.nthDay)}
																inputValue={categorySearchInputValue[`${day.nthDay}`] || ""}
																onInputChange={(event, newInputValue) => handleCategoryInputChange(event, newInputValue, day.nthDay)}
																options={options} // Seznam kategorií
																renderInput={(params) => (
																	<TextField
																		{...params}
																		variant="standard"
																		placeholder="Přidat kategorii"
																		size="small"
																		sx={{
																			"& .MuiInputBase-input::placeholder": {
																				color: "gray",
																				opacity: 1,
																			},
																		}}
																		InputProps={{
																			...params.InputProps,
																			classes: { input: "text-black text-lg" },
																		}}
																	/>
																)}
																PaperComponent={(props) => (
																	<Paper
																		{...props}
																		className=" text-black text-lg"
																	/>
																)}
															/>

															<Button
																onClick={() => addCategory(categorySearchInputValue[`${day.nthDay}`] || "", day.nthDay)}
																size="small"
																className="w-auto h-auto p-1 min-w-8 mr-2">
																<AddIcon
																	className="text-green-500"
																	fontSize="small"
																/>
															</Button>
														</Box>
													</Box>
												</Box>
											</Box>
										</Box>
									</Box>
								))}

								<Box className="pt-1">
									{days.length > 0 && <Box className="w-full border-t-2 border-gray-100 border-dashed absolute left-0 -mt-1" />}

									<Button
										onClick={addDay}
										size="small"
										className="w-auto h-auto p-1 min-w-8 text-black normal-case text-2xl font-normal -ml-1 mt-2 tracking-[0.01em]">
										Den {days.length + 1}.
										<AddIcon
											className="ml-1 text-green-500"
											fontSize="small"
										/>
									</Button>

									<Box className="flex justify-between pt-12">
										<Box></Box>

										<Button
											variant="contained"
											color="primary"
											onClick={handleSaveTrainingPlan}
											className="">
											Uložit tréninkový plán
										</Button>
									</Box>
								</Box>
							</Box>
						</GeneralCard>
					</Box>
				</SingleColumnPage>
			</Layout>
		</>
	);
};

export default ManualCreation;
