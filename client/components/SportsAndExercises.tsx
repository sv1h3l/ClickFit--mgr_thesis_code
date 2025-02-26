import { categoryCreationRequest } from "@/pages/api/categoryCreationRequest";
import { consoleLogPrint } from "@/pages/api/GenericApiResponse";
import { Category, getCategoriesAndExercisesRequest } from "@/pages/api/getCategoriesAndExercisesRequest";
import { Exercise, getExercisesRequest } from "@/pages/api/getExercisesRequest";
import { Sport } from "@/pages/api/getSportsRequest";
import { createSportRequest } from "@/pages/api/sportCreationRequest";
import { StateAndSet } from "@/utilities/generalInterfaces";
import { Box, Typography } from "@mui/material";
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

	const handleCreateExercise = async (newSport: string) => {};

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
									<Title
										title={category.categoryName}
										smallPaddingTop={category.orderNumber == 1}
									/>

									{category.exercises.map((exercise) => (
										<LabelAndValue
											key={exercise.exerciseId}
											label={exercise.exerciseName}
											isSelected={isExercise(props.selectedSportOrExercise.state) && exercise.exerciseId === props.selectedSportOrExercise.state.exerciseId}
											onClick={() => {
												props.selectedSportOrExercise.setState(exercise);
											}}
										/>
									))}

									{props.selectedSport.state?.userEmail == userEmail && editing && <TextFieldWithPlus props={{ style: "ml-2 mt-1", placeHolder: "Název nového cviku", onClick: handleCreateExercise }} />}
								</Box>
							))}

							{props.selectedSport.state?.userEmail == userEmail && editing && <TextFieldWithPlus props={{ style: "mt-8", titleBorderWidth: "10.5rem", placeHolder: "Název nové kategorie", onClick: handleCreateCategory }} />}
						</>
					) : (
						exercisesData.map((exercise) => (
							<LabelAndValue
								key={exercise.exerciseId}
								label={exercise.exerciseName}
								isSelected={isExercise(props.selectedSportOrExercise.state) && exercise.exerciseId === props.selectedSportOrExercise.state.exerciseId}
								onClick={() => {
									props.selectedSportOrExercise.setState(exercise);
								}}
							/>
						))
					)}

					{props.selectedSport.state?.userEmail == userEmail && editing && !props.selectedSport.state?.hasCategories && (
						<TextFieldWithPlus props={{ style: "ml-2 mt-1", placeHolder: "Název nového cviku", onClick: handleCreateExercise }} />
					)}
				</>
			}></GeneralCard>
	);
};

export default SportsAndExercises;
