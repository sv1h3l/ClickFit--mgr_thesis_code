import ExerciseInformation, { ExerciseInformationLabel } from "@/components/large/ExerciseInformations";
import SportDescriptionAndSettings, { SportDifficulty } from "@/components/large/SportDescriptionAndSettings";
import SportsAndExercises, { isExercise, isSport } from "@/components/large/SportsAndExercises";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { Category } from "../api/get/getCategoriesWithExercisesReq";
import { Exercise } from "../api/get/getExercisesReq";
import { Sport, getSportsReq } from "../api/get/getSportsReq";

const cookie = require("cookie");

//import * as cookie from "cookie";

const SportsAndExercisesPage = ({ initialSportsData }: { initialSportsData: Sport[] }) => {
	const [sportsData, setSportsData] = useState<Sport[]>(initialSportsData ?? []);

	const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
	const [selectedSportOrExercise, setSelectedSportOrExercise] = useState<Sport | Exercise | null>(null);

	const [exercisesData, setExercisesData] = useState<Exercise[]>([]);
	const [categoriesData, setCategoriesData] = useState<Category[]>([]);
	const [sportDifficultiesData, setSportDifficultiesData] = useState<SportDifficulty[]>([]);

	const [exerciseInformationLabelsData, setExerciseInformationLabelsData] = useState<ExerciseInformationLabel[]>([]);

	const [editing, setEditing] = useState<boolean>(false);

	return (
		<>
			<Head>
				<title>Databáze cviků - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-2/6"
				secondColumnWidth="w-4/6"
				firstColumnChildren={
					<SportsAndExercises
						props={{
							exercisesDatabase: true,
							sportsData: {
								state: sportsData,
								setState: setSportsData,
							},

							selectedSport: {
								state: selectedSport,
								setState: setSelectedSport,
							},
							selectedSportOrExercise: {
								state: selectedSportOrExercise,
								setState: setSelectedSportOrExercise,
							},

							exercisesData: {
								state: exercisesData,
								setState: setExercisesData,
							},
							categoriesData: {
								state: categoriesData,
								setState: setCategoriesData,
							},
							sportDifficultiesData: {
								state: sportDifficultiesData,
								setState: setSportDifficultiesData,
							},

							exerciseInformationLabelsData: {
								state: exerciseInformationLabelsData,
								setState: setExerciseInformationLabelsData,
							},

							editing: {
								state: editing,
								setState: setEditing,
							},
							dontShow: true,
						}}
					/>
				}
				secondColumnChildren={
					<>
						{isSport(selectedSportOrExercise) && (
							<SportDescriptionAndSettings
								sportsData={{
									state: sportsData,
									setState: setSportsData,
								}}
								sportDifficultiesData={{
									state: sportDifficultiesData,
									setState: setSportDifficultiesData,
								}}
								selectedSport={{
									state: selectedSport,
									setState: setSelectedSport,
								}}
								selectedSportOrExercise={{
									state: selectedSportOrExercise,
									setState: setSelectedSportOrExercise,
								}}
								exercisesData={{
									state: exercisesData,
									setState: setExercisesData,
								}}
								categoriesData={{
									state: categoriesData,
									setState: setCategoriesData,
								}}
								editing={{
									state: editing,
									setState: setEditing,
								}}
								sportName={selectedSport?.sportName || ""}
							/>
						)}

						{isExercise(selectedSportOrExercise) && (
							<ExerciseInformation
								props={{
									exerciseCategory: selectedSport?.hasCategories ? categoriesData.find((category) => category.categoryId === selectedSportOrExercise.categoryId)?.categoryName || "" : "",
									exerciseName: selectedSportOrExercise.exerciseName,
									exerciseDescription: selectedSportOrExercise.description,
									exerciseYoutubeLink: selectedSportOrExercise.youtubeLink,

									selectedSport: {
										state: selectedSport,
										setState: setSelectedSport,
									},

									selectedExercise: {
										state: selectedSportOrExercise,
										setState: setSelectedSportOrExercise,
									},

									sportDifficultiesData: {
										state: sportDifficultiesData,
										setState: setSportDifficultiesData,
									},

									exerciseOrderNumberWithoutCategories: selectedSportOrExercise.orderNumberWithoutCategories,
									exerciseOrderNumber: selectedSportOrExercise.orderNumber,
									sportId: selectedSport?.sportId || -1,
									difficultyId: selectedSport?.hasDifficulties ? selectedSportOrExercise.sportDifficultyId : -1,
									categoryId: selectedSport?.hasCategories ? selectedSportOrExercise.categoryId : -1,
									exerciseId: selectedSportOrExercise.exerciseId,

									exercisesData: {
										state: exercisesData,
										setState: setExercisesData,
									},
									categoriesData: {
										state: categoriesData,
										setState: setCategoriesData,
									},

									exerciseInformationLabelsData: {
										state: exerciseInformationLabelsData,
										setState: setExerciseInformationLabelsData,
									},

									editing: {
										state: editing,
										setState: setEditing,
									},
								}}
							/>
						)}
					</>
				}
			/>
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		// Fetching the sports data using the custom request function

		const cookies = cookie.parse(context.req.headers.cookie || "");
		const authToken = cookies.authToken || null; // Retrieve the userEmail cookie if available

		// Pass the userEmail to getSportsRequest as a query parameter or header
		const response = await getSportsReq({ authToken });

		//console.log("XXXXXXXX" + JSON.stringify(response.data, null, 2))

		// Check if the request was successful
		if (response.status === 200) {
			return {
				props: {
					initialSportsData: response.data || [], // Pass the sports data to the component
				},
			};
		} else {
			console.error("Error fetching sports data:", response.message);
			return {
				props: {
					initialSportsData: [], // Empty array if there was an error
				},
			};
		}
	} catch (error) {
		console.error("Error fetching sports data:", error);
		return {
			props: {
				initialSportsData: [], // Provide an empty array in case of any error
			},
		};
	}
};

export default SportsAndExercisesPage;
