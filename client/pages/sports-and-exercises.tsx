import ExerciseInformation from "@/components/ExerciseInformation";
import SportDescription from "@/components/SportDescription";
import SportsAndExercises, { isExercise, isSport } from "@/components/SportsAndExercises";
import TwoColumnsPage from "@/components/TwoColumnsPage";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { Exercise } from "./api/getExercisesRequest";
import { Sport, getSportsRequest } from "./api/getSportsRequest";

const cookie = require("cookie");

//import * as cookie from "cookie";

function SportsAndExercisesPage({ sportsData }: { sportsData: Sport[] }) {
	const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
	const [selectedSportOrExercise, setSelectedSportOrExercise] = useState<Sport | Exercise | null>(null);

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
							dontShow: true,
						}}
					/>
				}
				secondColumnChildren={
					<>
						{isSport(selectedSportOrExercise) && <SportDescription props={{ selectedSport: selectedSport }} />}

						{isExercise(selectedSportOrExercise) && <ExerciseInformation props={{ exerciseDescription: selectedSportOrExercise?.description, exerciseYoutubeLink: selectedSportOrExercise.youtubeLink }} />}
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
