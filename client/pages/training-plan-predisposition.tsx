import GeneralCard from "@/components/large/GeneralCard";
import SportDetails from "@/components/large/SportDetails";
import Sports from "@/components/large/Sports";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import router from "next/router";
import { useState } from "react";
import { getSportsReq, Sport } from "../api/get/getSportsReq";

const cookie = require("cookie");

function TrainingsCreation({ initialSportsData }: { initialSportsData: Sport[] }) {
	const [sportsData, setSportsData] = useState<Sport[]>(initialSportsData ?? []);

	const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

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
						<Sports
							selectedSport={{
								state: selectedSport,
								setState: setSelectedSport,
							}}
							sportsData={{
								state: sportsData,
								setState: setSportsData,
							}}
						/>
					}
					secondColumnChildren={
						<>
							<SportDetails
							
								selectedSport={{
									state: selectedSport,
									setState: setSelectedSport,
								}}
							/>

							<GeneralCard
								height="h-1/6"
								firstChildren={
									<Box className="">
										<Box className="flex gap-16  items-center">
											{/* FIXME w-1/2 */}
											<Button
												variant="contained"
												color="primary"
												onClick={() => {
													document.cookie = `selectedSport=; path=/; max-age=0;`;
													document.cookie = `tpc_tmp=${btoa(selectedSport?.sportId.toString()!)}; path=/; max-age=1200; `;

													router.push("/training-plan-creation");
												}}>
												Manuální tvorba
											</Button>
											<Typography className="pt-4 font-light">Sportovní údaje, které je nutno vyplnit pro manuální tvorbu.</Typography>
										</Box>

										<Box className=" flex gap-10 items-center">
											<Button
												variant="contained"
												color="primary"
												onClick={() => {
													router.push("/training-plan-creation");
												}}>
												Automatická tvorba
											</Button>
											<Typography className="pt-4 font-light">Sportovní údaje, které je nutno vyplnit pro automatickou tvorbu.</Typography>
										</Box>
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
		const authToken = cookies.authToken || null; // Retrieve the userEmail cookie if available

		// Pass the userEmail to getSportsRequest as a query parameter or header
		const response = await getSportsReq({ authToken });

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

export default TrainingsCreation;
