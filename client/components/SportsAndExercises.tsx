import { categoryCreationRequest } from "@/pages/api/categoryCreationRequest";
import { deleteExerciseRequest } from "@/pages/api/deleteExerciseRequest";
import { exerciseCreationRequest } from "@/pages/api/exerciseCreationRequest";
import { consoleLogPrint } from "@/pages/api/GenericApiResponse";
import { Category, getCategoriesAndExercisesRequest } from "@/pages/api/getCategoriesAndExercisesRequest";
import { Exercise, getExercisesRequest } from "@/pages/api/getExercisesRequest";
import { Sport } from "@/pages/api/getSportsRequest";
import { moveExerciseRequest } from "@/pages/api/moveExerciseRequest";
import { createSportRequest } from "@/pages/api/sportCreationRequest";
import { StateAndSet } from "@/utilities/generalInterfaces";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditButton from "./EditButton";
import GeneralCard from "./GeneralCard";
import LabelAndValue from "./LabelAndValue";
import TextFieldWithPlus from "./TextFieldWithPlus";
import Title from "./Title";

const cookie = require("cookie");

interface SportsProps {
	exercisesDatabase?: boolean;

	initialSportsData: Sport[];

	selectedSport: StateAndSet<Sport | null>;

	selectedSportOrExercise: StateAndSet<Sport | Exercise | null>;

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
	const [exercisesData, setExercisesData] = useState<Exercise[]>([]);
	const [categoriesData, setCategoriesData] = useState<Category[]>([]);

	const [userEmail, setUserEmail] = useState<string>("");

	const [showFirstSection, setShowFirstSection] = useState(true);

	const [editing, setEditing] = useState<boolean>(false);

	useEffect(() => {
		const cookies = cookie.parse(document.cookie || "");
		setUserEmail(cookies.userEmail || null);
	}, [setUserEmail]);

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
						setCategoriesData(response.data || []);

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
						setExercisesData(response.data || []);

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

	const handleCreateCategory = async (categoryName: string) => {
		const sportId = props.selectedSport.state?.sportId;
		if (sportId === undefined) {
			return;
		}

		const orderNumber = categoriesData.length;

		try {
			const response = await categoryCreationRequest({ props: { sportId, categoryName, orderNumber } });

			switch (response.status) {
				case 201:
					if (response.data) {
						const newCategory: Category = {
							categoryId: response.data.categoryId,
							categoryName: categoryName,
							orderNumber: categoriesData.length,

							exercises: [],
						};

						setCategoriesData(() => [...categoriesData, newCategory]);

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

	const handleCreateExercise = async (exerciseName: string, categoryId?: number) => {
		const sportId = props.selectedSport.state?.sportId;
		if (sportId === undefined) {
			return;
		}

		const orderNumber = exercisesData.length + 1;

		let functionsCategoryId: number;

		if (categoryId) {
			functionsCategoryId = categoryId;
		} else {
			functionsCategoryId = -1;
		}

		try {
			const response = await exerciseCreationRequest({ props: { sportId, exerciseName, categoryId: functionsCategoryId, orderNumber } });

			switch (response.status) {
				case 201:
					if (response.data) {
						const newExercise: Exercise = {
							exerciseId: response.data.exerciseId,
							categoryId: functionsCategoryId,
							sportDifficultyId: -1,

							exerciseName: exerciseName,
							orderNumber: orderNumber,

							description: "",
							youtubeLink: "",
						};

						if (props.selectedSport.state?.hasCategories) {
							// Aktualizace categoriesData - přidání cviku do správné kategorie
							setCategoriesData((prevCategories) => prevCategories.map((category) => (category.categoryId === functionsCategoryId ? { ...category, exercises: [...category.exercises, newExercise] } : category)));
						} else {
							// Pokud sport nemá kategorie, přidáme jen do seznamu cviků
							setExercisesData((prevExercises) => [...prevExercises, newExercise]);
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

	// #region Move and delete

	/** Move or delete selected exercise from category. If direction is not specified, than will be called remove fucntion. */
	const moveOrDeleteExerciseFromCategory = (exerciseId: number, selectedCategoryOrderNumber: number, selectedExerciseOrderNumber: number, direction?: "up" | "down") => {
		setCategoriesData((prevCategories) =>
			prevCategories.map((category) => {
				if (category.orderNumber !== selectedCategoryOrderNumber) return category;

				const updatedExercises = direction ? moveExercise(selectedExerciseOrderNumber, direction, category.exercises) : deleteExercise(exerciseId, selectedExerciseOrderNumber, category.exercises);

				return { ...category, exercises: updatedExercises };
			})
		);
	};

	/** Delete selected exercise and reorder exercises with higher order number than selected exercise. */
	const deleteExercise = (exerciseId: number, selectedExerciseOrderNumber: number, exercisesOfCategory?: Exercise[]): Exercise[] => {
		const exercises = exercisesOfCategory ? exercisesOfCategory : exercisesData;

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

		!exercisesOfCategory && setExercisesData(updatedExercises);

		handleDeleteExercise(exerciseId, reorderExercises);

		return updatedExercises;
	};

	/** Delete selected category and reorder categories with higher order number than selected category. */
	const deleteCategory = (selectedCategoryOrderNumber: number) => {
		const updatedCategories = categoriesData
			.filter((category) => category.orderNumber !== selectedCategoryOrderNumber)
			.map((category) => (category.orderNumber > selectedCategoryOrderNumber ? { ...category, orderNumber: category.orderNumber - 1 } : category));

		setCategoriesData(updatedCategories);
	};

	/** Move selected exercise and reorder exercises with higher order number than selected exercise */
	const moveExercise = (selectedExerciseOrderNumber: number, direction: "up" | "down", exercisesOfCategory?: Exercise[]): Exercise[] => {
		const exercises = exercisesOfCategory ? exercisesOfCategory : exercisesData;

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

		!exercisesOfCategory && setExercisesData(updatedExercises);

		handleMoveExercise(reorderExercises);

		return updatedExercises;
	};

	/** Move selected category and reorder categories with higher order number than selected category. */
	const moveCategory = (selectedCategoryOrderNumber: number, direction: "up" | "down"): Category[] => {
		if (direction === "up" && selectedCategoryOrderNumber === 1) return categoriesData;
		else if (direction === "down" && selectedCategoryOrderNumber === categoriesData.length) return categoriesData;

		let updatedCategories: Category[] = [];
		let categorySwap: Category;

		categoriesData.map((category) => {
			if ((direction === "up" && category.orderNumber === selectedCategoryOrderNumber) || (category.orderNumber === selectedCategoryOrderNumber + 1 && direction === "down")) {
				updatedCategories.push({ ...category, orderNumber: category.orderNumber - 1 });
				updatedCategories.push(categorySwap);
			} else if ((direction === "down" && category.orderNumber === selectedCategoryOrderNumber) || (category.orderNumber === selectedCategoryOrderNumber - 1 && direction === "up")) {
				categorySwap = { ...category, orderNumber: category.orderNumber + 1 };
			} else {
				updatedCategories.push(category);
			}
		});

		setCategoriesData(updatedCategories);

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
			secondSideContent={
				props.selectedSport.state?.userEmail == userEmail
					? [
							<EditButton
								key={1}
								props={{
									disabled: showFirstSection,
									editing: {
										state: editing,
										setState: setEditing,
									},
								}}
							/>,
					  ]
					: []
			}
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

								{
									props.dontShow && setShowFirstSection(false); // XXX potom smazat!
								}
							}}
						/>
					))}

					{props.exercisesDatabase && <TextFieldWithPlus props={{ style: "mt-1 ml-2", placeHolder: "Název nového sportu", onClick: handleCreateSport }} />}
				</Box>
			}
			secondChildren={
				<>
					<Title
						title="Sport"
						secondTitle="Autor"
						smallPaddingTop
					/>

					<LabelAndValue
						style="mb-12"
						spaceBetween
						isSelected={isSport(props.selectedSportOrExercise.state) && props.selectedSportOrExercise.state === props.selectedSport.state}
						onClick={() => {
							props.selectedSportOrExercise.setState(props.selectedSport.state);
						}}
						label={props.selectedSport.state?.sportName}
						value={props.selectedSport.state?.userName}
					/>

					<Box className="flex w-full justify-center">
						<Typography className=" text-2xl  ">{props.selectedSport.state?.hasCategories ? "Kategorie a cviky" : "Cviky"}</Typography>
					</Box>

					{props.selectedSport.state?.hasCategories ? (
						<>
							{categoriesData.map((category) => (
								<Box key={category.categoryId}>
									<Box className="flex items-end ">
										<Title
											title={category.categoryName}
											smallPaddingTop={category.orderNumber == 1}
										/>

										{editing && (
											<MoveAndDeleteButtons
												selectedCategoryOrExerciseId={category.categoryId}
												selectedCategoryOrderNumber={category.orderNumber}
											/>
										)}
									</Box>

									{category.exercises.map((exercise) => (
										<Box
											key={exercise.exerciseId}
											className="flex items-end">
											<LabelAndValue
												label={exercise.exerciseName}
												isSelected={isExercise(props.selectedSportOrExercise.state) && exercise.exerciseId === props.selectedSportOrExercise.state.exerciseId}
												onClick={() => {
													props.selectedSportOrExercise.setState(exercise);
												}}
											/>
											{editing && (
												<MoveAndDeleteButtons
													selectedCategoryOrExerciseId={exercise.categoryId}
													selectedCategoryOrderNumber={category.orderNumber}
													selectedExerciseOrderNumber={exercise.orderNumber}
												/>
											)}
										</Box>
									))}

									{props.selectedSport.state?.userEmail == userEmail && editing && (
										<TextFieldWithPlus props={{ style: "ml-2 mt-1", placeHolder: "Název nového cviku", onClick: (exerciseName) => handleCreateExercise(exerciseName, category.categoryId) }} />
									)}
								</Box>
							))}

							{props.selectedSport.state?.userEmail == userEmail && editing && <TextFieldWithPlus props={{ style: "mt-8", titleBorderWidth: "10.5rem", placeHolder: "Název nové kategorie", onClick: handleCreateCategory }} />}
						</>
					) : (
						exercisesData.map((exercise) => (
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
								{editing && (
									<MoveAndDeleteButtons
										selectedCategoryOrExerciseId={exercise.exerciseId}
										selectedExerciseOrderNumber={exercise.orderNumber}
									/>
								)}
							</Box>
						))
					)}

					{props.selectedSport.state?.userEmail == userEmail && editing && !props.selectedSport.state?.hasCategories && (
						<TextFieldWithPlus props={{ style: "ml-2 mt-1", placeHolder: "Název nového cviku", onClick: (exerciseName) => handleCreateExercise(exerciseName) }} />
					)}
				</>
			}></GeneralCard>
	);
};

export default SportsAndExercises;
