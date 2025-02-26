import GeneralCard from "@/components/GeneralCard";
import LabelAndValue from "@/components/LabelAndValue";
import SingleColumnPage from "@/components/SingleColumnPage";
import AddIcon from "@mui/icons-material/Add";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, FormControl, MenuItem, Select, TextField, Typography } from "@mui/material";
import Head from "next/head";
import router from "next/router";
import { useEffect, useRef, useState } from "react";

function ExercisesCreation() {
	const hasSportCategories = true;

	interface Category {
		categoryOrderNumber: number;
		categoryName: string;
		exercises: Exercise[];
	}

	interface Exercise {
		categoryOrderNumber: number;
		exerciseOrderNumber: number;

		categoryName: string;
		exerciseName: string;

		correctOrder: boolean;

		exerciseInformations: ExerciseInformation[];
	}

	interface ExerciseInformation {
		dbId?: number;
		exerciseInformationId: number;

		label: string;
		value: string;
	}

	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [categories, setCategories] = useState<Category[]>([
		{
			categoryName: "Nohy",
			categoryOrderNumber: 1,
			exercises: [
				{ categoryOrderNumber: 1, exerciseOrderNumber: 1, categoryName: "Nohy", exerciseName: "Dřepy", correctOrder: true, exerciseInformations: [] },
				{ categoryOrderNumber: 1, exerciseOrderNumber: 2, categoryName: "Nohy", exerciseName: "Výpady", correctOrder: true, exerciseInformations: [] },
			],
		},
		{ categoryName: "Záda", categoryOrderNumber: 2, exercises: [] },
		{ categoryName: "Prsa", categoryOrderNumber: 3, exercises: [] },
	]);
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

	const [newExerciseNames, setNewExerciseNames] = useState<{ [key: number]: string }>({});
	const [newExerciseName, setNewExerciseName] = useState<string>("");

	const moveExercise = (categoryOrderNumber: number, exerciseOrderNumber: number, direction: "up" | "down") => {
		setCategories((prevCategories) =>
			prevCategories.map((category) => {
				if (category.categoryOrderNumber !== categoryOrderNumber) return category;
				const newExercises = [...category.exercises];
				const index = newExercises.findIndex((ex) => ex.exerciseOrderNumber === exerciseOrderNumber);
				if (index === -1) return category;

				if (direction === "up" && index > 0) {
					[newExercises[index - 1], newExercises[index]] = [newExercises[index], newExercises[index - 1]];
				} else if (direction === "down" && index < newExercises.length - 1) {
					[newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
				}

				// Reassign order numbers based on the new positions
				newExercises.forEach((ex, idx) => {
					ex.exerciseOrderNumber = idx + 1;
				});
				return { ...category, exercises: newExercises };
			})
		);
	};

	// Helper: Delete an exercise from a category and clear selection if it's the one being deleted
	const deleteExercise = (categoryOrderNumber: number, exerciseOrderNumber: number) => {
		setCategories((prevCategories) =>
			prevCategories.map((category) => {
				if (category.categoryOrderNumber !== categoryOrderNumber) return category;
				const newExercises = category.exercises.filter((ex) => ex.exerciseOrderNumber !== exerciseOrderNumber);
				// Reassign order numbers after deletion
				newExercises.forEach((ex, idx) => {
					ex.exerciseOrderNumber = idx + 1;
				});
				return { ...category, exercises: newExercises };
			})
		);

		// Clear selected exercise if it was deleted
		if (selectedExercise && selectedExercise.categoryOrderNumber === categoryOrderNumber && selectedExercise.exerciseOrderNumber === exerciseOrderNumber) {
			setSelectedExercise(null);
		}
	};

	// New component for moving and deleting exercises.
	// Stop propagation so that clicking these buttons doesn't trigger the parent onClick.
	const MoveAndDeleteButtons = ({ nthCategory, nthExercise }: { nthCategory?: number; nthExercise?: number }) => {
		if (nthCategory === undefined || nthExercise === undefined) return null;
		return (
			<Box className="flex items-center">
				<Button
					onClick={(e) => {
						e.stopPropagation();
						moveExercise(nthCategory, nthExercise, "up");
					}}
					size="small"
					className="w-auto h-auto p-1 min-w-8">
					<ArrowUpward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					onClick={(e) => {
						e.stopPropagation();
						moveExercise(nthCategory, nthExercise, "down");
					}}
					size="small"
					className="w-auto h-auto p-1 min-w-8">
					<ArrowDownward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					onClick={(e) => {
						e.stopPropagation();
						deleteExercise(nthCategory, nthExercise);
					}}
					size="small"
					className="w-auto h-auto p-1 min-w-8 ml-3 mr-2">
					<CloseIcon
						className="text-red-400"
						fontSize="small"
					/>
				</Button>
			</Box>
		);
	};

	const handleAddExerciseToCategories = (categoryOrderNumber: number) => {
		const exerciseName = newExerciseNames[categoryOrderNumber]?.trim();
		if (!exerciseName) return;

		setCategories((prevCategories) =>
			prevCategories.map((category) =>
				category.categoryOrderNumber === categoryOrderNumber
					? {
							...category,
							exercises: [
								...category.exercises,
								{
									categoryOrderNumber,
									exerciseOrderNumber: category.exercises.length + 1,
									categoryName: category.categoryName,
									exerciseName,
									correctOrder: true,
									exerciseInformations: [],
								},
							],
					  }
					: category
			)
		);

		setNewExerciseNames((prevNames) => ({
			...prevNames,
			[categoryOrderNumber]: "",
		}));
	};

	const handleAddExerciseToExercises = () => {
		const exerciseName = newExerciseName.trim();
		if (!exerciseName) return;

		setExercises((prevExercises) => [
			...prevExercises,
			{
				categoryOrderNumber: 0,
				exerciseOrderNumber: prevExercises.length + 1,
				categoryName: "",
				exerciseName,
				correctOrder: true,
				exerciseInformations: [],
			},
		]);

		setNewExerciseName("");
	};

	const textFieldRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (textFieldRef.current) {
			textFieldRef.current.focus();
		}
	}, [selectedCategory]);

	const handleExerciseClick = (exercise: Exercise) => {
		setSelectedExercise(exercise);
	};

	return (
		<>
			<Head>
				<title>Tvorba cviků - KlikFit</title>
			</Head>

			<SingleColumnPage>
				<GeneralCard
					width="w-full"
					firstTitle="Tvorba cviků"
					firstSideContent={[
						<Button
							key={1}
							variant="contained"
							color="primary"
							onClick={() => {
								router.push("/sport-creation");
							}}>
							Uložit cviky
						</Button>,
					]}
					height="h-full">
					<Box className="flex h-full w-full py-8">
						<Box className="w-1/3 h-full">
							<Box className="mr-6 mt-1 border-2 rounded-xl flex flex-col h-full overflow-hidden">
								{/* Header */}
								<Box className={`px-2 pt-2 ${!hasSportCategories && "border-b-4 border-double border-gray-200 pb-2"}`}>
									<Typography className="text-lg">{"Seznam cviků" + (hasSportCategories ? " pro kategorii" : "")}</Typography>
								</Box>

								{/* Dropdown for selecting a category */}
								{hasSportCategories && (
									<Box className="pb-2 pt-1 px-2 border-b-4 border-double border-gray-200">
										<FormControl
											className="w-full"
											variant="standard">
											<Select
												value={selectedCategory || ""}
												onChange={(e) => setSelectedCategory(Number(e.target.value))}
												className="w-full text-lg"
												displayEmpty
												renderValue={(selected) => {
													if (!selected) {
														return <Typography className="text-gray-400 text-lg">Vyberte kategorii</Typography>;
													}
													const selectedCategoryName = categories.find((category) => category.categoryOrderNumber === selected)?.categoryName;
													return selectedCategoryName || "";
												}}>
												{categories.map((category) => (
													<MenuItem
														className="text-lg"
														key={category.categoryOrderNumber}
														value={category.categoryOrderNumber}>
														{category.categoryName}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Box>
								)}

								{/* Display exercises only for the selected category */}
								<Box className="flex-grow overflow-auto min-h-0">
									{hasSportCategories
										? categories
												.find((category) => category.categoryOrderNumber === selectedCategory)
												?.exercises.map((exercise) => (
													<Box
														key={exercise.exerciseOrderNumber}
														onClick={() => handleExerciseClick(exercise)}
														className={`flex items-center justify-between pl-3 py-2 border-b-2 border-gray-100 ${exercise.exerciseOrderNumber % 2 !== 0 && "bg-gray-50"}`}>
														<Typography className="font-light">{exercise.exerciseName}</Typography>
														{/* Include move and delete buttons */}
														<MoveAndDeleteButtons
															nthCategory={exercise.categoryOrderNumber}
															nthExercise={exercise.exerciseOrderNumber}
														/>
													</Box>
												))
										: exercises.map((exercise) => (
												<Box
													key={exercise.exerciseOrderNumber}
													className={`pl-3 py-2 border-b-2 border-gray-100 ${exercise.exerciseOrderNumber % 2 !== 0 && "bg-gray-50"}`}
													onClick={() => handleExerciseClick(exercise)}>
													<Typography className="font-light">{exercise.exerciseName}</Typography>
												</Box>
										  ))}
								</Box>

								{/* Input for adding an exercise to the selected category */}
								{hasSportCategories && selectedCategory && (
									<Box className="flex p-2 border-t-2 border-gray-300 flex-shrink-0">
										<TextField
											inputRef={textFieldRef}
											className="w-full"
											placeholder="Přidat cvik"
											variant="standard"
											value={newExerciseNames[selectedCategory] || ""}
											onChange={(e) =>
												setNewExerciseNames((prevNames) => ({
													...prevNames,
													[selectedCategory]: e.target.value,
												}))
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleAddExerciseToCategories(selectedCategory);
												}
											}}
										/>
										<Button
											onClick={() => handleAddExerciseToCategories(selectedCategory)}
											size="small"
											className="w-auto h-auto p-1 min-w-8 ml-2">
											<AddIcon
												className="text-green-500"
												fontSize="small"
											/>
										</Button>
									</Box>
								)}

								{/* Input for adding an exercise when categories are not used */}
								{!hasSportCategories && (
									<Box className="flex p-2 border-t-2 border-gray-300 flex-shrink-0">
										<TextField
											className="w-full"
											placeholder="Přidat cvik"
											variant="standard"
											value={newExerciseName}
											onChange={(e) => setNewExerciseName(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleAddExerciseToExercises();
												}
											}}
										/>
										<Button
											onClick={handleAddExerciseToExercises}
											size="small"
											className="w-auto h-auto p-1 min-w-8 ml-2">
											<AddIcon
												className="text-green-500"
												fontSize="small"
											/>
										</Button>
									</Box>
								)}
							</Box>
						</Box>

						{/* Right side: Exercise details */}
						<Box className="w-2/3 h-full">
							<Box className="ml-6 mr-3 mt-1 flex flex-col h-full overflow-hidden relative">
								<Box className="w-1/2  border-x-2 border-t-2 rounded-t-xl">
									<Box className="p-2 border-b-4 border-double border-gray-200 ">
										<Typography className="text-lg">Informace o cviku</Typography>
									</Box>
								</Box>
								<Box className="border-t-2 border-r-2 rounded-tr-xl absolute pr-36 h-6 w-1/2 right-0 top-12"></Box>
								<Box className="h-full border-x-2 border-b-2 rounded-b-xl rounded-r-xl">
									{selectedExercise && (
										<Box>
											<LabelAndValue
												label="Název cviku"
												value={selectedExercise.exerciseName}
											/>
											<LabelAndValue
												label="Kategorie cviku"
												value={selectedExercise.categoryName}
											/>
										</Box>
									)}
								</Box>
							</Box>
						</Box>
					</Box>
				</GeneralCard>
			</SingleColumnPage>
		</>
	);
}

export default ExercisesCreation;
