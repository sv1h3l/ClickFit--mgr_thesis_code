import { categoryCreationRequest } from "@/api/categoryCreationRequest";
import { deleteCategoryRequest } from "@/api/deleteCategoryRequest";
import { deleteExerciseRequest } from "@/api/deleteExerciseRequest";
import { exerciseCreationRequest } from "@/api/exerciseCreationRequest";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { Category, getCategoriesAndExercisesRequest } from "@/api/getCategoriesAndExercisesRequest";
import { getExerciseInformationLabelsRequest } from "@/api/getExerciseInformationLabelsRequest";
import { getExerciseInformationValuesRequest } from "@/api/getExerciseInformationValuesRequest";
import { Exercise, getExercisesRequest } from "@/api/getExercisesRequest";
import { Sport } from "@/api/getSportsRequest";
import { moveCategoryRequest } from "@/api/moveCategoryRequest";
import { moveExerciseRequest } from "@/api/moveExerciseRequest";
import { createSportRequest } from "@/api/sportCreationRequest";
import { StateAndSet, StateAndSetFunction } from "@/utilities/generalInterfaces";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditButton from "./EditButton";
import { ExerciseInformationLabel, ExerciseInformationValue } from "./ExerciseInformations";
import GeneralCard from "./GeneralCard";
import LabelAndValue from "./LabelAndValue";
import TextFieldWithIcon from "./TextFieldWithPlus";
import Title from "./Title";

const cookie = require("cookie");

interface SportsProps {
	exercisesDatabase?: boolean;

	initialSportsData: Sport[];

	selectedSport: StateAndSet<Sport | null>;
	selectedSportOrExercise: StateAndSet<Sport | Exercise | null>;

	categoriesData: StateAndSetFunction<Category[]>;
	exercisesData: StateAndSetFunction<Exercise[]>;

	exerciseInformationLabelsData: StateAndSetFunction<ExerciseInformationLabel[]>;
	exerciseInformationValuesData: StateAndSetFunction<ExerciseInformationValue[]>;

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
	if (obj === null) {
		return false;
	}

	return (obj as Exercise)?.exerciseId !== undefined;
}

const SportsAndExercises = ({ props }: { props: SportsProps }) => {
	const [sportsData, setSportsData] = useState<Sport[]>(props.initialSportsData);

	const [userEmail, setUserEmail] = useState<string>("");

	const [showFirstSection, setShowFirstSection] = useState(true);

	useEffect(() => {
		const cookies = cookie.parse(document.cookie || "");
		setUserEmail(cookies.userEmail || null);
	}, [setUserEmail]);

	useEffect(() => {
		props.editing.setState(showFirstSection);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showFirstSection]);

	const handleCreateSport = async (sportName: string) => {
		/*if (!sportsName) {
			setSportNameError("Název sportu nesmí být prázdný");
			return;
		} else {
			setSportNameError("");
		}*/

		try {
			const response = await createSportRequest({ sportName });

			switch (response.status) {
				case 201:
					if (response.data) {
						const { sportId, userName, userId, userEmail } = response.data;

						const newSport: Sport = {
							userId: userId,
							userEmail: userEmail,
							userName: userName,

							sportId: sportId,
							sportName: sportName,

							hasCategories: false,
							hasDifficulties: false,
							description: "",
						};

						setSportsData((prevSportsData) => [...prevSportsData, newSport]);

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
			const response = await getCategoriesAndExercisesRequest({ props: { sportId } });

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
			const response = await getExercisesRequest({ props: { sportId } });

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
			const response = await getExerciseInformationLabelsRequest(sportId);

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

	const getExerciseInformationValues = async (sportId: number, exerciseId: number) => {
		try {
			const response = await getExerciseInformationValuesRequest(sportId, exerciseId);

			if (response.status === 200 && response.data) {
				props.exerciseInformationValuesData.setState(response.data);
			}

			consoleLogPrint(response);
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
			const response = await categoryCreationRequest({ props: { sportId, categoryName } });

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

		let orderNumber = 0;

		if (categoryId !== -1) {
			const exercisesLength = props.categoriesData.state.find((category) => category.categoryId === categoryId)?.exercises.length;
			exercisesLength ? (orderNumber = exercisesLength + 1) : (orderNumber = 1);
		} else {
			orderNumber = props.exercisesData.state.length + 1;
		}

		if (orderNumber === 0) {
			console.error("Order number nesmí být nulový");
		}

		try {
			const response = await exerciseCreationRequest({ props: { sportId, exerciseName, categoryId, orderNumber } });

			switch (response.status) {
				case 201:
					if (response.data) {
						const newExercise: Exercise = {
							exerciseId: response.data.exerciseId,
							categoryId: categoryId,
							sportDifficultyId: -1,

							exerciseName: exerciseName,
							orderNumber: orderNumber,

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

	const handleDeleteExercise = async (exerciseId: number, reorderExercises: { exerciseId: number; orderNumber: number }[]) => {
		const sportId = props.selectedSport.state?.sportId;
		if (sportId === undefined) {
			return;
		}

		try {
			const response = await deleteExerciseRequest({ props: { sportId, exerciseId, reorderExercises } });

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
			const response = await deleteCategoryRequest({ props: { sportId, categoryId, exercisesOfCategory, reorderCategories } });

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
			const response = await moveCategoryRequest({ props: { sportId, reorderCategories } });

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
			const response = await moveExerciseRequest({ props: { sportId, reorderExercises } });

			if (response.status) {
				consoleLogPrint(response);
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	/** Move or delete selected exercise from category. If direction is not specified, than will be called remove fucntion. */
	const moveOrDeleteExerciseFromCategory = (exerciseId: number, selectedCategoryOrderNumber: number, selectedExerciseOrderNumber: number, direction?: "up" | "down") => {
		props.categoriesData.setState((prevCategories) =>
			prevCategories.map((category) => {
				if (category.orderNumber !== selectedCategoryOrderNumber) return category;

				const updatedExercises = direction ? moveExercise(selectedExerciseOrderNumber, direction, category.exercises) : deleteExercise(exerciseId, selectedExerciseOrderNumber, category.exercises);

				return { ...category, exercises: updatedExercises };
			})
		);
	};

	/** Delete selected exercise and reorder exercises with higher order number than selected exercise. */
	const deleteExercise = (exerciseId: number, selectedExerciseOrderNumber: number, exercisesOfCategory?: Exercise[]): Exercise[] => {
		const exercises = exercisesOfCategory ? exercisesOfCategory : props.exercisesData.state;

		let reorderExercises: { exerciseId: number; orderNumber: number }[] = [];

		const updatedExercises = exercises
			.filter((exercise) => exercise.orderNumber !== selectedExerciseOrderNumber)
			.map((exercise) => {
				if (exercise.orderNumber > selectedExerciseOrderNumber) {
					const updatedExercise = { ...exercise, orderNumber: exercise.orderNumber - 1 };

					reorderExercises.push({ exerciseId: updatedExercise.exerciseId, orderNumber: updatedExercise.orderNumber });

					return updatedExercise;
				}
				return exercise;
			});

		!exercisesOfCategory && props.exercisesData.setState(updatedExercises);

		handleDeleteExercise(exerciseId, reorderExercises);

		return updatedExercises;
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
	const moveExercise = (selectedExerciseOrderNumber: number, direction: "up" | "down", exercisesOfCategory?: Exercise[]): Exercise[] => {
		const exercises = exercisesOfCategory ? exercisesOfCategory : props.exercisesData.state;

		if (direction === "up" && selectedExerciseOrderNumber === 1) return exercises;
		else if (direction === "down" && selectedExerciseOrderNumber === exercises.length) return exercises;

		let updatedExercises: Exercise[] = [];
		let exerciseSwap: Exercise;
		let reorderExercises: { exerciseId: number; orderNumber: number }[] = [];

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
		});

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
		selectedCategoryOrExerciseId,
		selectedCategoryOrderNumber = -1,
		selectedExerciseOrderNumber = -1,
	}: {
		selectedCategoryOrExerciseId: number;
		selectedCategoryOrderNumber?: number;
		selectedExerciseOrderNumber?: number;
	}) => {
		return (
			<Box className="ml-auto flex relative ">
				{/*{nthCategory && !nthExercise && <Box className="border-t-2 border-r-2 border-gray-200 h-7 rounded-tr-xl absolute top-2 right-0 w-[6.8rem]" />}*/}

				<Button
					onClick={() =>
						selectedCategoryOrderNumber !== -1 && selectedExerciseOrderNumber !== -1
							? moveOrDeleteExerciseFromCategory(selectedCategoryOrExerciseId, selectedCategoryOrderNumber, selectedExerciseOrderNumber, "up")
							: selectedCategoryOrderNumber !== -1
							? moveCategory(selectedCategoryOrderNumber, "up")
							: moveExercise(selectedExerciseOrderNumber, "up")
					}
					size="small"
					className={`w-8 h-8 p-1 min-w-8 `}>
					<ArrowUpward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					onClick={() =>
						selectedCategoryOrderNumber !== -1 && selectedExerciseOrderNumber !== -1
							? moveOrDeleteExerciseFromCategory(selectedCategoryOrExerciseId, selectedCategoryOrderNumber, selectedExerciseOrderNumber, "down")
							: selectedCategoryOrderNumber !== -1
							? moveCategory(selectedCategoryOrderNumber, "down")
							: moveExercise(selectedExerciseOrderNumber, "down")
					}
					size="small"
					className={`w-8 h-8 p-1 min-w-8 `}>
					<ArrowDownward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					onClick={() =>
						selectedCategoryOrderNumber !== -1 && selectedExerciseOrderNumber !== -1
							? moveOrDeleteExerciseFromCategory(selectedCategoryOrExerciseId, selectedCategoryOrderNumber, selectedExerciseOrderNumber)
							: selectedCategoryOrderNumber !== -1
							? deleteCategory(selectedCategoryOrderNumber)
							: deleteExercise(selectedCategoryOrExerciseId, selectedExerciseOrderNumber)
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
			firstTitle="Seznam"
			secondTitle={props.exercisesDatabase ? "Přehled" : undefined}
			firstChildren={
				<Box className=" h-full ">
					<Title
						title="Sport"
						secondTitle="Autor"
						smallPaddingTop
					/>

					{sportsData.map((sport) => (
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
						sideContent={props.selectedSport.state?.userEmail == userEmail && <EditButton editing={{ state: props.editing.state, setState: props.editing.setState }} />}
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
												<Button
													className="w-8 h-8 p-1 min-w-8 "
													onClick={() => {
														props.categoriesData.setState((prevCategories) => prevCategories.map((cat) => (cat.categoryId === category.categoryId ? { ...cat, show: !cat.show } : cat)));
													}}>
													{category.show ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
												</Button>
											}
										/>

										{props.editing.state && category.orderNumber !== 0 && (
											<MoveAndDeleteButtons
												selectedCategoryOrExerciseId={category.categoryId}
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
																	label={exercise.exerciseName}
																	isSelected={isExercise(props.selectedSportOrExercise.state) && exercise.exerciseId === props.selectedSportOrExercise.state.exerciseId}
																	onClick={() => {
																		props.selectedSportOrExercise.setState(exercise);

																		if (props.selectedSport.state?.sportId) {
																			getExerciseInformationValues(props.selectedSport.state.sportId, exercise.exerciseId);
																		}
																	}}
																/>
																{props.editing.state && (
																	<MoveAndDeleteButtons
																		selectedCategoryOrExerciseId={exercise.exerciseId}
																		selectedCategoryOrderNumber={category.orderNumber}
																		selectedExerciseOrderNumber={exercise.orderNumber}
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
										selectedCategoryOrExerciseId={exercise.exerciseId}
										selectedExerciseOrderNumber={exercise.orderNumber}
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
