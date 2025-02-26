import GeneralCard from "@/components/GeneralCard";
import SportData from "@/components/SportData";
import SportsAndExercises from "@/components/SportsAndExercises";
import TwoColumnsPage from "@/components/TwoColumnsPage";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import router from "next/router";
import { useState } from "react";
import { Exercise } from "./api/getExercisesRequest";
import { getSportsRequest, Sport } from "./api/getSportsRequest";

const cookie = require("cookie");

function TrainingsCreation({ sportsData }: { sportsData: Sport[] }) {
	const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
	const [selectedSportOrExercise, setSelectedSportOrExercise] = useState<Sport | Exercise | null>(null);

	return (
		<>
			<Head>
				<title>Tvorba tréninku - KlikFit</title>
			</Head>

			{
				<TwoColumnsPage
					firstColumnWidth="w-2/5"
					secondColumnWidth="w-3/5"
					firstColumnChildren={
						<SportsAndExercises
							props={{
								initialSportsData: sportsData,
								selectedSport: {
									state: selectedSport,
									setState: setSelectedSport,
								},
								selectedSportOrExercise: {
									state: selectedSportOrExercise,
									setState: setSelectedSportOrExercise,
								},
							}}
						/>
					}
					secondColumnChildren={
						<>
							<SportData />

							<GeneralCard
								height="h-1/6"
								firstChildren={
									<Box className="flex">
										<Box className="w-full flex flex-col items-center"> {/* FIXME w-1/2 */}
											<Button
												variant="contained"
												color="primary"
												onClick={() => {
													router.push("/training-plan-creation");
												}}>
												Manuální tvorba
											</Button>
											<Typography className="pt-4 font-light">Sportovní údaje, které je nutno vyplnit pro manuální tvorbu.</Typography>
										</Box>

										{/*<Box className="w-1/2 flex flex-col items-center">
											<Button
												variant="contained"
												color="primary"
												onClick={() => {
													router.push("/training-plan-creation");
												}}>
												Automatická tvorba
											</Button>
											<Typography className="pt-4 font-light">Sportovní údaje, které je nutno vyplnit pro automatickou tvorbu.</Typography>
										</Box>*/}
									</Box>
								}
							/>
						</>
					}
				/>
			}
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

export default TrainingsCreation;
