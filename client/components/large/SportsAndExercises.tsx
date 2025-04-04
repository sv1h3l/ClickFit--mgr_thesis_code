import { createCategoryReq } from "@/api/create/createCategoryReq";
import { createExerciseReq } from "@/api/create/createExerciseReq";
import { createSportReq } from "@/api/create/createSportReq";
import { deleteCategoryReq } from "@/api/delete/deleteCategoryReq";
import { deleteExerciseReq } from "@/api/delete/deleteExerciseReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { Category, getCategoriesWithExercisesReq } from "@/api/get/getCategoriesWithExercisesReq";
import { getExerciseInformationLabsReq } from "@/api/get/getExerciseInformationLabsReq";
import { Exercise, getExercisesReq } from "@/api/get/getExercisesReq";
import { Sport } from "@/api/get/getSportsReq";
import { moveCategoryReq } from "@/api/move/moveCategoryReq";
import { moveExerciseReq } from "@/api/move/moveExerciseReq";
import { StateAndSet, StateAndSetFunction } from "@/utilities/generalInterfaces";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import LabelAndValue from "../small/LabelAndValue";
import TextFieldWithIcon from "../small/TextFieldWithIcon";
import Title from "../small/Title";
import { ExerciseInformationLabel } from "./ExerciseInformations";
import GeneralCard from "./GeneralCard";
import { SportDifficulty } from "./SportDescriptionAndSettings";

const cookie = require("cookie");

interface SportsProps {
	exercisesDatabase?: boolean;

	selectedSport: StateAndSet<Sport | null>;
	selectedSportOrExercise: StateAndSet<Sport | Exercise | null>;

	sportsData: StateAndSetFunction<Sport[]>;
	categoriesData: StateAndSetFunction<Category[]>;
	exercisesData: StateAndSetFunction<Exercise[]>;
	sportDifficultiesData: StateAndSetFunction<SportDifficulty[]>;

	exerciseInformationLabelsData: StateAndSetFunction<ExerciseInformationLabel[]>;

	editing: StateAndSet<boolean>;
	dontShow?: boolean;
}

export function isSport(obj: Sport | Exercise | null): obj is Sport {
	if (obj === null) {
		return false;
	}

	return (obj as Sport).sportName !== undefined;
}

export function isExercise(obj: Sport | Exercise | null): obj is Exercise {
	if (!obj || typeof obj !== "object") {
		return false;
	}

	return "exerciseId" in obj;
}

const SportsAndExercises = ({ props }: { props: SportsProps }) => {
	const [userEmail, setUserEmail] = useState<string>("");

	const [showFirstSection, setShowFirstSection] = useState(true);

	useEffect(() => {
		const cookies = cookie.parse(document.cookie || "");
		setUserEmail(cookies.userEmail || null);
	}, [setUserEmail]);

	useEffect(() => {
		props.editing.setState(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showFirstSection]);

	useEffect(() => {
		{
			props.selectedSport.state && (props.selectedSport.state?.hasCategories ? getCategoriesAndExercises(props.selectedSport.state.sportId) : getExercises(props.selectedSport.state.sportId));
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.selectedSport.state?.hasCategories]);

	const handleCreateSport = async (sportName: string) => {
		/*if (!sportsName) {
			setSportNameError("Název sportu nesmí být prázdný");
			return;
		} else {
			setSportNameError("");
		}*/

		try {
			const response = await createSportReq({ sportName });

			switch (response.status) {
				case 201:
					if (response.data) {
						const { sportId, userName, userId, userEmail } = response.data;

						const newSport: Sport = {
							userId: userId,
							userEmail: userEmail,
							userName: userName,

							canUserEdit: true,

							sportId: sportId,
							sportName: sportName,

							hasCategories: false,
							hasDifficulties: false,

							hasRecommendedValues: false,
							hasRecommendedDifficultyValues: false,

							unitCode: 0,

							description: "",
						};

						props.sportsData.setState((prevSportsData) => [...prevSportsData, newSport]);

						consoleLogPrint(response);
					}
					break;
				case 400:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				case 409:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				default:
					consoleLogPrint(response);
					break;
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const getCategoriesAndExercises = async (sportId: number) => {
		try {
			const response = await getCategoriesWithExercisesReq({ props: { sportId } });

			switch (response.status) {
				case 200:
					if (response.data) {
						props.categoriesData.setState(response.data || []);

						consoleLogPrint(response);
					}
					break;
				case 400:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				case 409:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				default:
					consoleLogPrint(response);
					break;
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const getExercises = async (sportId: number) => {
		try {
			const response = await getExercisesReq({ props: { sportId } });

			switch (response.status) {
				case 200:
					if (response.data) {
						props.exercisesData.setState(response.data || []);

						consoleLogPrint(response);
					}
					break;
				case 400:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				case 409:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				default:
					consoleLogPrint(response);
					break;
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const getExerciseInformationLabels = async (sportId: number) => {
		try {
			const response = await getExerciseInformationLabsReq({ sportId });

			switch (response.status) {
				case 200:
					if (Array.isArray(response.data)) {
						props.exerciseInformationLabelsData.setState(response.data);
					} else {
						props.exerciseInformationLabelsData.setState([]);
					}

					consoleLogPrint(response);
					break;
				case 400:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				case 409:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				default:
					consoleLogPrint(response);
					break;
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleCreateCategory = async (categoryName: string) => {
		const sportId = props.selectedSport.state?.sportId;
		if (sportId === undefined) {
			return;
		}

		try {
			const response = await createCategoryReq({ props: { sportId, categoryName } });

			switch (response.status) {
				case 201:
					if (response.data) {
						const newCategory: Category = {
							categoryId: response.data.categoryId,
							categoryName: categoryName,
							orderNumber: 1,

							exercises: [],
						};

						const reorderedCategories: Category[] = [newCategory];

						props.categoriesData.state.forEach((category) => {
							if (category.orderNumber === 0) {
								reorderedCategories.push(category);
							} else {
								reorderedCategories.push({ ...category, orderNumber: category.orderNumber + 1 });
							}
						});

						props.categoriesData.setState(reorderedCategories);

						consoleLogPrint(response);
					}
					break;
				case 400:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				case 409:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				default:
					consoleLogPrint(response);
					break;
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleCreateExercise = async (exerciseName: string, categoryId: number) => {
		const sportId = props.selectedSport.state?.sportId;

		if (sportId === undefined) {
			return;
		}

		try {
			const response = await createExerciseReq({ props: { sportId, exerciseName, categoryId } });

			switch (response.status) {
				case 201:
					if (response.data) {
						const newExercise: Exercise = {
							exerciseId: response.data.exerciseId,
							categoryId: categoryId,
							sportDifficultyId: response.data.difficultyId,

							exerciseName: exerciseName,
							orderNumber: response.data.orderNumber,
							orderNumberWithoutCategories: response.data.orderNumberWithoutCategories,

							series: 0,
							repetitions: 0,
							burden: 0,
							unitCode: response.data.unitCode,

							description: "",
							youtubeLink: "",
						};

						if (props.selectedSport.state?.hasCategories) {
							// Aktualizace categoriesData - přidání cviku do správné kategorie
							props.categoriesData.setState((prevCategories) => prevCategories.map((category) => (category.categoryId === categoryId ? { ...category, exercises: [...category.exercises, newExercise] } : category)));
						} else {
							// Pokud sport nemá kategorie, přidáme jen do seznamu cviků
							props.exercisesData.setState((prevExercises) => [...prevExercises, newExercise]);
						}

						consoleLogPrint(response);
					}
					break;
				case 400:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				case 409:
					//setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				default:
					consoleLogPrint(response);
					break;
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	// #region Move and delete

	const handleDeleteExercise = async (exerciseId: number, categoryId: number, orderNumber: number, orderNumberWithoutCategories: number) => {
		const sportId = props.selectedSport.state?.sportId;
		if (sportId === undefined) {
			return;
		}

		try {
			const response = await deleteExerciseReq({ props: { sportId, categoryId, exerciseId, orderNumber, orderNumberWithoutCategories } });

			if (response.status) {
				consoleLogPrint(response);
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleDeleteCategory = async (categoryId: number, exercisesOfCategory: { exerciseId: number }[], reorderCategories: { categoryId: number; orderNumber: number }[]) => {
		const sportId = props.selectedSport.state?.sportId;
		if (sportId === undefined) {
			return 0;
		}

		try {
			const response = await deleteCategoryReq({ props: { sportId, categoryId, exercisesOfCategory, reorderCategories } });

			if (response.status) {
				consoleLogPrint(response);
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleMoveCategory = async (reorderCategories: { categoryId: number; orderNumber: number }[]) => {
		const sportId = props.selectedSport.state?.sportId;
		if (sportId === undefined) {
			return;
		}

		try {
			const response = await moveCategoryReq({ props: { sportId, reorderCategories } });

			if (response.status) {
				consoleLogPrint(response);
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleMoveExercise = async (reorderExercises: { exerciseId: number; orderNumber: number }[]) => {
		const sportId = props.selectedSport.state?.sportId;
		if (sportId === undefined) {
			return;
		}

		try {
			const response = await moveExerciseReq({ props: { sportId, hasCategories: props.selectedSport.state?.hasCategories!, reorderExercises } });

			if (response.status) {
				consoleLogPrint(response);
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	/** Move or delete selected exercise from category. If direction is not specified, than will be called remove fucntion. */
	const moveOrDeleteExerciseFromCategory = (exerciseId: number, categoryId: number, selectedCategoryOrderNumber: number, selectedExerciseOrderNumber: number, selectedExerciseOrderNumberWithoutCategories: number, direction?: "up" | "down") => {
		if (direction) {
			props.categoriesData.setState((prevCategories) =>
				prevCategories.map((category) => {
					if (category.orderNumber !== selectedCategoryOrderNumber) return category;

					const updatedExercises = moveExercise(selectedExerciseOrderNumber, selectedExerciseOrderNumberWithoutCategories, direction, category.exercises);

					return { ...category, exercises: updatedExercises };
				})
			);
		} else {
			deleteExercise(exerciseId, categoryId, selectedExerciseOrderNumber, selectedExerciseOrderNumberWithoutCategories, true);
		}
	};

	/** Delete selected exercise and reorder exercises with higher order number than selected exercise. */
	const deleteExercise = (exerciseId: number, categoryId: number, selectedExerciseOrderNumber: number, selectedExerciseOrderNumberWithoutCategories: number, hasCategories?: boolean) => {
		if (hasCategories) {
			const updatedCategories = props.categoriesData.state.map((category) => {
				const newExercises = category.exercises
					.filter((exercise) => exercise.orderNumberWithoutCategories !== selectedExerciseOrderNumberWithoutCategories)
					.map((exercise) => {
						const newExercise = { ...exercise };

						if (exercise.orderNumber > selectedExerciseOrderNumber && exercise.categoryId === categoryId) {
							newExercise.orderNumber = newExercise.orderNumber - 1;
						}

						if (exercise.orderNumberWithoutCategories > selectedExerciseOrderNumberWithoutCategories) {
							newExercise.orderNumberWithoutCategories = newExercise.orderNumberWithoutCategories - 1;
						}

						if (
							isExercise(props.selectedSportOrExercise.state) &&
							exercise.exerciseId === props.selectedSportOrExercise.state.exerciseId &&
							categoryId === props.selectedSportOrExercise.state.categoryId &&
							props.selectedSportOrExercise.state.orderNumber > selectedExerciseOrderNumber
						) {
							props.selectedSportOrExercise.setState({ ...props.selectedSportOrExercise.state, orderNumber: props.selectedSportOrExercise.state.orderNumber - 1 });
						}

						return newExercise;
					});

				return { ...category, exercises: newExercises };
			});

			props.categoriesData.setState(updatedCategories);
		} else {
			const updatedExercises = props.exercisesData.state
				.filter((exercise) => exercise.orderNumberWithoutCategories !== selectedExerciseOrderNumberWithoutCategories)
				.map((exercise) => {
					const newExercise = { ...exercise };

					if (exercise.orderNumber > selectedExerciseOrderNumber && exercise.categoryId === categoryId) {
						newExercise.orderNumber = newExercise.orderNumber - 1;
					}

					if (exercise.orderNumberWithoutCategories > selectedExerciseOrderNumberWithoutCategories) {
						newExercise.orderNumberWithoutCategories = newExercise.orderNumberWithoutCategories - 1;
					}

					return newExercise;
				});

			props.exercisesData.setState(updatedExercises);
		}

		handleDeleteExercise(exerciseId, categoryId, selectedExerciseOrderNumber, selectedExerciseOrderNumberWithoutCategories);
	};

	/** Delete selected category and reorder categories with higher order number than selected category. */
	const deleteCategory = (selectedCategoryOrderNumber: number) => {
		const categoryToDelete = props.categoriesData.state.find((category) => category.orderNumber === selectedCategoryOrderNumber);
		if (!categoryToDelete) return;

		const exercisesOfCategory = categoryToDelete.exercises.map((exercise) => ({ exerciseId: exercise.exerciseId }));

		const updatedCategories = props.categoriesData.state
			.filter((category) => category.orderNumber !== selectedCategoryOrderNumber)
			.map((category) => (category.orderNumber > selectedCategoryOrderNumber ? { ...category, orderNumber: category.orderNumber - 1 } : category));

		const reorderCategories = updatedCategories
			.filter((category) => category.orderNumber >= selectedCategoryOrderNumber)
			.map((category) => ({
				categoryId: category.categoryId,
				orderNumber: category.orderNumber,
			}));

		let residueCategoryId = -1;
		props.categoriesData.state
			.filter((category) => category.orderNumber === 0)
			.map((category) => {
				residueCategoryId = category.categoryId;
			});

		const filledResidueCategory = updatedCategories.map((category) => {
			if (category.orderNumber === 0) {
				let highestOrderNumber = category.exercises.length;

				for (const exercise of categoryToDelete.exercises) {
					category.exercises.push({ ...exercise, orderNumber: highestOrderNumber, categoryId: residueCategoryId });

					highestOrderNumber++;
				}
			}
			return category;
		});

		props.categoriesData.setState(filledResidueCategory);

		handleDeleteCategory(categoryToDelete.categoryId, exercisesOfCategory, reorderCategories);
	};

	/** Move selected exercise and reorder exercises with higher order number than selected exercise */
	const moveExercise = (selectedExerciseOrderNumber: number, selectedExerciseOrderNumberWithoutCategories: number, direction: "up" | "down", exercisesOfCategory?: Exercise[]): Exercise[] => {
		const exercises = exercisesOfCategory ? exercisesOfCategory : props.exercisesData.state;

		let updatedExercises: Exercise[] = [];
		let exerciseSwap: Exercise;
		let reorderExercises: { exerciseId: number; orderNumber: number }[] = [];

		if (props.selectedSport.state?.hasCategories) {
			if (direction === "up" && selectedExerciseOrderNumber === 1) return exercises;
			else if (direction === "down" && selectedExerciseOrderNumber === exercises.length) return exercises;

			exercises.map((exercise) => {
				if ((direction === "up" && exercise.orderNumber === selectedExerciseOrderNumber) || (exercise.orderNumber === selectedExerciseOrderNumber + 1 && direction === "down")) {
					reorderExercises.push({ exerciseId: exercise.exerciseId, orderNumber: exercise.orderNumber - 1 });
					reorderExercises.push({ exerciseId: exerciseSwap.exerciseId, orderNumber: exerciseSwap.orderNumber });

					updatedExercises.push({ ...exercise, orderNumber: exercise.orderNumber - 1 });
					updatedExercises.push(exerciseSwap);
				} else if ((direction === "down" && exercise.orderNumber === selectedExerciseOrderNumber) || (exercise.orderNumber === selectedExerciseOrderNumber - 1 && direction === "up")) {
					exerciseSwap = { ...exercise, orderNumber: exercise.orderNumber + 1 };
				} else {
					updatedExercises.push(exercise);
				}

				if (isExercise(props.selectedSportOrExercise.state) && exercise.exerciseId === props.selectedSportOrExercise.state.exerciseId) {
					let globalSelectedExerciseOrderNumber = props.selectedSportOrExercise.state.orderNumber;

					if (direction === "up" && globalSelectedExerciseOrderNumber === selectedExerciseOrderNumber) {
						props.selectedSportOrExercise.setState({ ...props.selectedSportOrExercise.state, orderNumber: globalSelectedExerciseOrderNumber - 1 });
					} else if (direction === "down" && globalSelectedExerciseOrderNumber === selectedExerciseOrderNumber) {
						props.selectedSportOrExercise.setState({ ...props.selectedSportOrExercise.state, orderNumber: globalSelectedExerciseOrderNumber + 1 });
					} else if ((direction === "down" && globalSelectedExerciseOrderNumber === selectedExerciseOrderNumber + 1) || (direction === "up" && globalSelectedExerciseOrderNumber === selectedExerciseOrderNumber - 1)) {
						props.selectedSportOrExercise.setState({ ...props.selectedSportOrExercise.state, orderNumber: selectedExerciseOrderNumber });
					}
				}
			});
		} else {
			if (direction === "up" && selectedExerciseOrderNumberWithoutCategories === 1) return exercises;
			else if (direction === "down" && selectedExerciseOrderNumberWithoutCategories === exercises.length) return exercises;

			exercises.map((exercise) => {
				if (
					(direction === "up" && exercise.orderNumberWithoutCategories === selectedExerciseOrderNumberWithoutCategories) ||
					(exercise.orderNumberWithoutCategories === selectedExerciseOrderNumberWithoutCategories + 1 && direction === "down")
				) {
					reorderExercises.push({ exerciseId: exercise.exerciseId, orderNumber: exercise.orderNumberWithoutCategories - 1 });
					reorderExercises.push({ exerciseId: exerciseSwap.exerciseId, orderNumber: exerciseSwap.orderNumberWithoutCategories });

					updatedExercises.push({ ...exercise, orderNumberWithoutCategories: exercise.orderNumberWithoutCategories - 1 });
					updatedExercises.push(exerciseSwap);
				} else if (
					(direction === "down" && exercise.orderNumberWithoutCategories === selectedExerciseOrderNumberWithoutCategories) ||
					(exercise.orderNumberWithoutCategories === selectedExerciseOrderNumberWithoutCategories - 1 && direction === "up")
				) {
					exerciseSwap = { ...exercise, orderNumberWithoutCategories: exercise.orderNumberWithoutCategories + 1 };
				} else {
					updatedExercises.push(exercise);
				}
			});
		}

		!exercisesOfCategory && props.exercisesData.setState(updatedExercises);

		handleMoveExercise(reorderExercises);

		return updatedExercises;
	};

	/** Move selected category and reorder categories with higher order number than selected category. */
	const moveCategory = (selectedCategoryOrderNumber: number, direction: "up" | "down"): Category[] => {
		if (direction === "up" && selectedCategoryOrderNumber === 1) return props.categoriesData.state;
		else if (direction === "down" && selectedCategoryOrderNumber === props.categoriesData.state.length - 1) return props.categoriesData.state;

		let updatedCategories: Category[] = [];
		let categorySwap: Category;

		let reorderCategories: { categoryId: number; orderNumber: number }[] = [];

		props.categoriesData.state.map((category) => {
			if ((direction === "up" && category.orderNumber === selectedCategoryOrderNumber) || (category.orderNumber === selectedCategoryOrderNumber + 1 && direction === "down")) {
				reorderCategories.push({ categoryId: category.categoryId, orderNumber: category.orderNumber - 1 });
				reorderCategories.push({ categoryId: categorySwap.categoryId, orderNumber: categorySwap.orderNumber });

				updatedCategories.push({ ...category, orderNumber: category.orderNumber - 1 });
				updatedCategories.push(categorySwap);
			} else if ((direction === "down" && category.orderNumber === selectedCategoryOrderNumber) || (category.orderNumber === selectedCategoryOrderNumber - 1 && direction === "up")) {
				categorySwap = { ...category, orderNumber: category.orderNumber + 1 };
			} else {
				updatedCategories.push(category);
			}
		});

		props.categoriesData.setState(updatedCategories);

		handleMoveCategory(reorderCategories);

		return updatedCategories;
	};

	const MoveAndDeleteButtons = ({
		selectedCategoryId,
		selectedExerciseId = -1,
		selectedCategoryOrderNumber = -1,
		selectedExerciseOrderNumber = -1,
		selectedExerciseOrderNumberWithoutCategories = -1,
	}: {
		selectedCategoryId: number;
		selectedExerciseId?: number;
		selectedCategoryOrderNumber?: number;
		selectedExerciseOrderNumber?: number;
		selectedExerciseOrderNumberWithoutCategories?: number;
	}) => {
		const disableUpArrow =
			(selectedExerciseId === -1 && selectedCategoryOrderNumber === 1) ||
			(props.selectedSport.state?.hasCategories && selectedExerciseOrderNumber === 1) ||
			(!props.selectedSport.state?.hasCategories && selectedExerciseOrderNumberWithoutCategories === 1);

		const getHighestOrderNumber = (categoryId: number): number => {
			let highestOrderNumber = 0;

			props.categoriesData.state
				.filter((category) => category.categoryId === categoryId)
				.map((category) =>
					category.exercises.map((exercise) => {
						exercise.orderNumber > highestOrderNumber && (highestOrderNumber = exercise.orderNumber);
					})
				);

			return highestOrderNumber;
		};

		const getHighestOrderNumberWithoutCategories = () => {
			let highestOrderNumber = 0;

			props.exercisesData.state.map((exercise) => exercise.orderNumberWithoutCategories > highestOrderNumber && (highestOrderNumber = exercise.orderNumberWithoutCategories));

			return highestOrderNumber;
		};

		const disableDownArrow =
			(selectedExerciseId === -1 && props.categoriesData.state.length === selectedCategoryOrderNumber + 1) ||
			(props.selectedSport.state?.hasCategories && selectedExerciseOrderNumber === getHighestOrderNumber(selectedCategoryId)) ||
			(!props.selectedSport.state?.hasCategories && selectedExerciseOrderNumberWithoutCategories === getHighestOrderNumberWithoutCategories());

		return (
			<Box className="ml-auto flex relative ">
				<Button
					disabled={disableUpArrow}
					onClick={() =>
						selectedExerciseId === -1
							? moveCategory(selectedCategoryOrderNumber, "up")
							: selectedCategoryOrderNumber !== -1
							? moveOrDeleteExerciseFromCategory(selectedExerciseId, selectedCategoryId, selectedCategoryOrderNumber, selectedExerciseOrderNumber, selectedExerciseOrderNumberWithoutCategories, "up")
							: moveExercise(selectedExerciseOrderNumber, selectedExerciseOrderNumberWithoutCategories, "up")
					}
					size="small"
					className={`w-8 h-8 p-1 min-w-8
								${disableUpArrow && "opacity-30"}`}>
					<ArrowUpward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>

				<Button
					disabled={disableDownArrow}
					onClick={() =>
						selectedExerciseId === -1
							? moveCategory(selectedCategoryOrderNumber, "down")
							: selectedCategoryOrderNumber !== -1
							? moveOrDeleteExerciseFromCategory(selectedExerciseId, selectedCategoryId, selectedCategoryOrderNumber, selectedExerciseOrderNumber, selectedExerciseOrderNumberWithoutCategories, "down")
							: moveExercise(selectedExerciseOrderNumber, selectedExerciseOrderNumberWithoutCategories, "down")
					}
					size="small"
					className={`w-8 h-8 p-1 min-w-8
								${disableDownArrow && "opacity-30"}`}>
					<ArrowDownward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					onClick={() =>
						selectedExerciseId === -1
							? deleteCategory(selectedCategoryOrderNumber)
							: selectedCategoryOrderNumber !== -1
							? moveOrDeleteExerciseFromCategory(selectedExerciseId, selectedCategoryId, selectedCategoryOrderNumber, selectedExerciseOrderNumber, selectedExerciseOrderNumberWithoutCategories)
							: deleteExercise(selectedExerciseId, selectedCategoryId, selectedExerciseOrderNumber, selectedExerciseOrderNumberWithoutCategories)
					}
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

	// #endregion

	return (
		<GeneralCard
			height="h-full max-h-full"
			border
			showFirstSection={{ state: showFirstSection, setState: setShowFirstSection }}
			firstTitle="Sporty"
			secondTitle={props.exercisesDatabase ? "Přehled" : undefined}
			firstChildren={
				<Box className=" h-full ">
					<Title
						title="Sport"
						secondTitle="Autor"
						smallPaddingTop
					/>

					{props.sportsData.state.map((sport) => (
						<LabelAndValue
							key={sport.sportId}
							spaceBetween
							label={sport.sportName}
							value={sport.userName}
							isSelected={sport.sportId == props.selectedSport.state?.sportId}
							onClick={() => {
								props.selectedSport.setState(sport);
								props.selectedSportOrExercise.setState(sport);

								if (sport.hasCategories) {
									getCategoriesAndExercises(sport.sportId);
								} else {
									getExercises(sport.sportId);
								}

								getExerciseInformationLabels(sport.sportId);

								{
									props.dontShow && setShowFirstSection(false); // XXX potom smazat!
								}
							}}
						/>
					))}

					{props.exercisesDatabase && (
						<TextFieldWithIcon
							style="mt-1 ml-2"
							placeHolder="Název nového sportu"
							onClick={handleCreateSport}
						/>
					)}
				</Box>
			}
			secondChildren={
				<>
					{/*<Title
						title="Sport"
						secondTitle="Autor"
						smallPaddingTop
					/>*/}

					<LabelAndValue
						noPaddingTop
						mainStyle="mb-6 mt-2 justify-center"
						typographyStyle=" text-3xl"
						isSelected={isSport(props.selectedSportOrExercise.state) && props.selectedSportOrExercise.state === props.selectedSport.state}
						onClick={() => {
							props.selectedSportOrExercise.setState(props.selectedSport.state);
						}}
						label={props.selectedSport.state?.sportName}
						sideContent={
							props.selectedSport.state?.canUserEdit && (
								<ButtonComp
									key={"edit"}
									style="ml-3"
									size="medium"
									icon={IconEnum.EDIT}
									onClick={() => {
										props.editing.setState(!props.editing.state);
									}}
								/>
							)
						}
					/>

					<Box className="flex w-full ">
						<Typography className={` text-xl -ml-3`}>{props.selectedSport.state?.hasCategories ? "Kategorie a cviky:" : "Cviky:"}</Typography>
					</Box>

					{props.selectedSport.state?.hasCategories ? (
						<Box className={`pl-1`}>
							{props.selectedSport.state?.userEmail == userEmail && props.editing.state && (
								<Box className="flex w-full items-center -ml-5">
									<ArrowDropDownIcon className="opacity-25" />
									<TextFieldWithIcon
										style=" mt-2  pt-1 pl-1 w-full pr-1"
										placeHolder="Název nové kategorie"
										onClick={handleCreateCategory}
									/>
								</Box>
							)}

							{props.categoriesData.state.map((category) => (
								<Box key={category.categoryId}>
									<Box className="flex items-end">
										<Title
											style={`-ml-6  ${!category.show ? "mb-3" : "mb-0"}`}
											//smallPaddingTop={categoriesData.length > 1 ? category.orderNumber === 1 : category.orderNumber === 0}
											smallPaddingTop
											title={category.categoryName}
											sideContent={
												<>
													{/*<Button
														className="w-8 h-8 p-1 min-w-8 "
														onClick={() => {
															props.categoriesData.setState((prevCategories) => prevCategories.map((cat) => (cat.categoryId === category.categoryId ? { ...cat, show: !cat.show } : cat)));
														}}>
														{category.show ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
													</Button>*/}

													<ButtonComp
														key={"edit"}
														style="ml-2 mr-3 "
														size="small"
														icon={category.show ? IconEnum.ARROW_DROP_UP : IconEnum.ARROW_DROP_DOWN}
														onClick={() => {
															props.categoriesData.setState((prevCategories) => prevCategories.map((cat) => (cat.categoryId === category.categoryId ? { ...cat, show: !cat.show } : cat)));
														}}
													/>
												</>
											}
										/>

										{props.editing.state && category.orderNumber !== 0 && (
											<MoveAndDeleteButtons
												selectedCategoryId={category.categoryId}
												selectedCategoryOrderNumber={category.orderNumber}
											/>
										)}
									</Box>

									<Box className={`${category.show ? "mb-2" : "mb-0"}`}>
										{category.show && (
											<>
												{category.exercises.length === 0 && !props.editing.state ? (
													<Typography className="pl-7 font-light mt-4">Kategorie neobsahuje žádné cviky</Typography>
												) : (
													<>
														{category.exercises.map((exercise) => (
															<Box
																key={exercise.exerciseId}
																className={`flex items-end pl-5 `}>
																<LabelAndValue
																	label={exercise.exerciseName + " - " + exercise.orderNumber}
																	isSelected={isExercise(props.selectedSportOrExercise.state) && exercise.exerciseId === props.selectedSportOrExercise.state.exerciseId}
																	onClick={() => {
																		props.selectedSportOrExercise.setState(exercise);
																	}}
																/>
																{props.editing.state && (
																	<MoveAndDeleteButtons
																		selectedExerciseId={exercise.exerciseId}
																		selectedCategoryId={exercise.categoryId}
																		selectedCategoryOrderNumber={category.orderNumber}
																		selectedExerciseOrderNumber={exercise.orderNumber}
																		selectedExerciseOrderNumberWithoutCategories={exercise.orderNumberWithoutCategories}
																	/>
																)}
															</Box>
														))}
													</>
												)}
												{props.selectedSport.state?.userEmail == userEmail && props.editing.state && (
													<TextFieldWithIcon
														style={category.exercises.length === 0 ? "pl-7" : "mt-1 pl-7"}
														placeHolder="Název nového cviku"
														onClick={(exerciseName) => handleCreateExercise(exerciseName, category.categoryId)}
													/>
												)}
											</>
										)}
									</Box>
								</Box>
							))}
						</Box>
					) : (
						props.exercisesData.state.map((exercise) => (
							<Box
								key={exercise.exerciseId}
								className="flex items-end">
								<LabelAndValue
									key={exercise.exerciseId}
									label={exercise.exerciseName}
									isSelected={isExercise(props.selectedSportOrExercise.state) && exercise.exerciseId === props.selectedSportOrExercise.state.exerciseId}
									onClick={() => {
										props.selectedSportOrExercise.setState(exercise);
									}}
								/>
								{props.editing.state && (
									<MoveAndDeleteButtons
										selectedExerciseId={exercise.exerciseId}
										selectedCategoryId={exercise.categoryId}
										selectedExerciseOrderNumber={exercise.orderNumber}
										selectedExerciseOrderNumberWithoutCategories={exercise.orderNumberWithoutCategories}
									/>
								)}
							</Box>
						))
					)}

					{props.selectedSport.state?.userEmail == userEmail && props.editing.state && !props.selectedSport.state?.hasCategories && (
						<TextFieldWithIcon
							style="ml-2 mt-1"
							placeHolder="Název nového cviku"
							onClick={(exerciseName) => handleCreateExercise(exerciseName, -1)}
						/>
					)}

					{!props.editing.state && !props.selectedSport.state?.hasCategories && props.exercisesData.state.length === 0 && <Typography className="pl-2 font-light mt-4">Sport neobsahuje žádné cviky</Typography>}
				</>
			}></GeneralCard>
	);
};

export default SportsAndExercises;
