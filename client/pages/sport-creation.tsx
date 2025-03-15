import GeneralCard from "@/components/GeneralCard";
import ItemsWindow from "@/components/ItemsWindow";
import SingleColumnPage from "@/components/SingleColumnPage";
import { Box, Button, TextField, Typography } from "@mui/material";
import Head from "next/head";
import router from "next/router";
import { useState } from "react";
import { consoleLogPrint } from "../api/GenericApiResponse";
import { createSportRequest, Value } from "../api/sportCreationRequestSecond";

function TrainingPlans(creation?: boolean) {
	const [hasASportCategories, setHasASportCategories] = useState<boolean>(false); // "Spadají cviky do různých kategorií?"
	const [hasASportDifficulties, setHasASportDifficulties] = useState<boolean>(false); //  "Jsou cviky různě obtížné?"

	const [sportName, setSportName] = useState("");
	const [sportNameError, setSportNameError] = useState<string>("");

	const [sportDetails, setSportDetails] = useState<Value[]>([]);
	const [sportCategories, setSportCategories] = useState<Value[]>([]);
	const [sportDifficulties, setSportDifficulties] = useState<Value[]>([]);
	const [exerciseInformations, setExerciseInformations] = useState<Value[]>([]);
	const [sportDescription, setSportDescription] = useState("");

	const [newSportDetail, setNewSportDetail] = useState("");
	const [newCategory, setNewCategory] = useState("");
	const [newDifficulty, setNewDifficulty] = useState("");

	const createSport = async () => {
		const name = sportName;

		if (!name) {
			setSportNameError("Název sportu nesmí být prázdný");
			return;
		} else {
			setSportNameError("");
		}

		try {
			const response = await createSportRequest({
				sportName,
				sportDetails,
				hasASportCategories,
				sportCategories,
				hasASportDifficulties,
				sportDifficulties,
				exerciseInformations,
				sportDescription,
			});

			switch (response.status) {
				case 201:
					consoleLogPrint(response);
					router.push("/exercises-database");
					break;
				case 400:
					setSportNameError(response.message);
					consoleLogPrint(response);
					break;
				case 409:
					setSportNameError(response.message);
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

	return (
		<>
			<Head>
				<title>Tvorba sportu - KlikFit</title>
			</Head>

			<SingleColumnPage>
				<GeneralCard
					firstTitle="Tvorba sportu"
					firstSideContent={[
						<Button
							key={1}
							variant="contained"
							color="primary"
							onClick={() => {
								router.push("/exercises-creation");
							}}
							className="">
							Nastavit kategorie a obtížnosti
						</Button>,
						<Button
							key={2}
							variant="contained"
							color="primary"
							onClick={() => {
								router.push("/exercises-creation");
							}}
							className="">
							Tvorba cviků
						</Button>,
						<Button
							key={3}
							variant="contained"
							color="primary"
							onClick={createSport}
							className="">
							Uložit sport
						</Button>,
					]}
					height="h-full">
					<Box className="h-full min-h-0 mt-2 mx-0 ">
						<Box className="flex items-center ">
							<TextField
								error={!!sportNameError}
								helperText={sportNameError}
								className="w-full h-16 sm:w-1/2 lg:w-1/3 pr-16 pl-2"
								label="Název sportu"
								variant="standard"
								value={sportName}
								onChange={(e) => setSportName(e.target.value)}
								InputProps={{
									style: { fontSize: "1.5rem" }, // Zvětší písmo v inputu
								}}
								InputLabelProps={{
									style: { fontSize: "1.2rem", marginLeft: "0.5rem" }, // Zvětší písmo labelu
								}}
								onBlur={() => {
									const name = sportName;
									setSportNameError(!name ? "Název sportu nesmí být prázdný" : "");
								}}
							/>
						</Box>

						<Box className="flex w-full h-[45rem] mt-6 ">
							<ItemsWindow
								items={sportDetails}
								setItems={setSportDetails}
								value={newSportDetail}
								setValue={setNewSportDetail}
								label="Sportovní údaje"
								button="Přidat název sportovního údaje"
								styles="w-1/3 h-full "
							/>

							<Box className=" mt-1 flex flex-col min-h-0 rounded-xl h-[45rem] relative w-2/3 max-h-full pl-12">
								<Box>
									<Box className="border-t-2 border-x-2 rounded-t-xl w-1/2 bg-white relative ">
										<Box className="flex-shrink-0 flex justify-between w-full border-b-4 border-double border-gray-200">
											<Typography className="p-2 text-lg">Popis sportu</Typography>
										</Box>
									</Box>
									<Box className="border-t-2 border-r-2 rounded-tr-xl absolute pr-36 -mt-0.5 h-6 right-0 w-1/2  bg-white"></Box>
								</Box>

								<Box className="border-b-2 pb-2 border-l-2 border-r-2 rounded-b-xl rounded-tr-xl h-full overflow-auto flex flex-col">
									<TextField
										className="w-full h-full text-start"
										label="Popis sportu"
										multiline
										variant="filled"
										value={sportDescription}
										onChange={(e) => setSportDescription(e.target.value)}
										InputProps={{
											disableUnderline: true,
											style: { backgroundColor: "transparent" }, // Zarovnání textu vlevo
										}}
										sx={{
											height: "100%",
											"& .MuiInputBase-root": {
												backgroundColor: "transparent",
												border: "none",
												boxShadow: "none",
												height: "100%",
												overflow: "auto",
												alignItems: "start",
												paddingTop: "10px",
											},
											"& .MuiFilledInput-root": {
												backgroundColor: "transparent",
											},
											"& .MuiInputLabel-root": {
												display: "none",
											},
										}}
									/>
								</Box>
							</Box>
						</Box>

						<Box className=" mt-12">
							<Typography className={`text-3xl select-none -ml-3`}> Nastavení kategorií a obtížností</Typography>

							<Box className="flex w-full h-[45rem] mt-6 ">
								<ItemsWindow
									items={sportCategories}
									setItems={setSportCategories}
									value={newCategory}
									setValue={setNewCategory}
									label="Kategorie"
									button="Přidat kategorii"
									isChecked={hasASportCategories}
									onToggleChange={setHasASportCategories}
									styles="w-1/3 h-full mr-12"
								/>

								<ItemsWindow
									items={sportDifficulties}
									setItems={setSportDifficulties}
									value={newDifficulty}
									setValue={setNewDifficulty}
									label="Obtížnosti"
									button="Přidat obtížnost"
									isChecked={hasASportDifficulties}
									onToggleChange={setHasASportDifficulties}
									showOrderNumbers
									styles="w-1/3 h-full"
								/>
							</Box>
						</Box>

						<Box className="mt-12">
							<Typography className={`text-3xl select-none  -ml-3`}> Tvorba cviků</Typography>

							<Box className="flex w-full h-[45rem] mt-6 ">
								<ItemsWindow
									items={sportCategories}
									setItems={setSportCategories}
									value={newCategory}
									setValue={setNewCategory}
									label="Kategorie"
									button="Přidat kategorii"
									isChecked={hasASportCategories}
									onToggleChange={setHasASportCategories}
									styles="w-1/3 h-full mr-12"
								/>

								<ItemsWindow
									items={sportDifficulties}
									setItems={setSportDifficulties}
									value={newDifficulty}
									setValue={setNewDifficulty}
									label="Obtížnosti"
									button="Přidat obtížnost"
									isChecked={hasASportDifficulties}
									onToggleChange={setHasASportDifficulties}
									showOrderNumbers
									styles="w-1/3 h-full"
								/>
							</Box>
						</Box>

						<Box className="mt-12">
							<Typography className={`text-3xl select-none  -ml-3`}> Nastavení sportu pro automatickou tvorbu</Typography>

							<Box className="flex w-full h-[45rem] mt-6 ">
								<ItemsWindow
									items={sportCategories}
									setItems={setSportCategories}
									value={newCategory}
									setValue={setNewCategory}
									label="Kategorie"
									button="Přidat kategorii"
									isChecked={hasASportCategories}
									onToggleChange={setHasASportCategories}
									styles="w-1/3 h-full mr-12"
								/>

								<ItemsWindow
									items={sportDifficulties}
									setItems={setSportDifficulties}
									value={newDifficulty}
									setValue={setNewDifficulty}
									label="Obtížnosti"
									button="Přidat obtížnost"
									isChecked={hasASportDifficulties}
									onToggleChange={setHasASportDifficulties}
									showOrderNumbers
									styles="w-1/3 h-full"
								/>
							</Box>
						</Box>
					</Box>
				</GeneralCard>
			</SingleColumnPage>
		</>
	);
}

export default TrainingPlans;
