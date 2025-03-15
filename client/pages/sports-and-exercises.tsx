import ExerciseInformation, { ExerciseInformationLabel, ExerciseInformationValue } from "@/components/ExerciseInformations";
import SportDescription from "@/components/SportDescription";
import SportsAndExercises, { isExercise, isSport } from "@/components/SportsAndExercises";
import TwoColumnsPage from "@/components/TwoColumnsPage";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { Category } from "../api/getCategoriesAndExercisesRequest";
import { Exercise } from "../api/getExercisesRequest";
import { Sport, getSportsRequest } from "../api/getSportsRequest";

const cookie = require("cookie");

//import * as cookie from "cookie";

function SportsAndExercisesPage({ sportsData }: { sportsData: Sport[] }) {
	const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
	const [selectedSportOrExercise, setSelectedSportOrExercise] = useState<Sport | Exercise | null>(null);

	const [exercisesData, setExercisesData] = useState<Exercise[]>([]);
	const [categoriesData, setCategoriesData] = useState<Category[]>([]);

	const [exerciseInformationLabelsData, setExerciseInformationLabelsData] = useState<ExerciseInformationLabel[]>([]);
	const [exerciseInformationValuesData, setExerciseInformationValuesData] = useState<ExerciseInformationValue[]>([]);

	const [editing, setEditing] = useState<boolean>(false);

	return (
		<>
			<Head>
				<title>Databáze cviků - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-2/5"
				secondColumnWidth="w-3/5"
				firstColumnChildren={
					<SportsAndExercises
						props={{
							exercisesDatabase: true,
							initialSportsData: sportsData,

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

							exerciseInformationLabelsData: {
								state: exerciseInformationLabelsData,
								setState: setExerciseInformationLabelsData,
							},
							exerciseInformationValuesData: {
								state: exerciseInformationValuesData,
								setState: setExerciseInformationValuesData,
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
						{isSport(selectedSportOrExercise) && <SportDescription props={{ selectedSport: selectedSport }} />}

						{isExercise(selectedSportOrExercise) && (
							<ExerciseInformation
								props={{
									exerciseCategory: selectedSport?.hasCategories ? categoriesData.find((category) => category.categoryId === selectedSportOrExercise.categoryId)?.categoryName || "" : "",
									exerciseName: selectedSportOrExercise.exerciseName,
									exerciseDescription: selectedSportOrExercise.description,
									exerciseYoutubeLink: selectedSportOrExercise.youtubeLink,

									sportId: selectedSport?.sportId || -1,
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
									exerciseInformationValuesData: {
										state: exerciseInformationValuesData,
										setState: setExerciseInformationValuesData,
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
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		// Fetching the sports data using the custom request function

		const cookies = cookie.parse(context.req.headers.cookie || "");
		const userEmail = cookies.userEmail || null; // Retrieve the userEmail cookie if available

		// Pass the userEmail to getSportsRequest as a query parameter or header
		const response = await getSportsRequest(userEmail || "");

		// Check if the request was successful
		if (response.status === 200) {
			return {
				props: {
					sportsData: response.data || [], // Pass the sports data to the component
				},
			};
		} else {
			console.error("Error fetching sports data:", response.message);
			return {
				props: {
					sportsData: [], // Empty array if there was an error
				},
			};
		}
	} catch (error) {
		console.error("Error fetching sports data:", error);
		return {
			props: {
				sportsData: [], // Provide an empty array in case of any error
			},
		};
	}
};

export default SportsAndExercisesPage;
