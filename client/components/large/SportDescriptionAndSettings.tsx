import { changeSportDescReq } from "@/api/change/changeSportDescReq";
import { changeSportHasAutomaticPlanCreationReq } from "@/api/change/changeSportHasAutomaticPlanCreationReq";
import { changeSportHasCategoriesReq } from "@/api/change/changeSportHasCategoriesReq";
import { changeSportHasDifficultiesReq } from "@/api/change/changeSportHasDifficultiesReq";
import { changeSportHasRecommendedDifficultyValsReq } from "@/api/change/changeSportHasRecommendedDifficultyValsReq";
import { changeSportHasRecommendedValsReq } from "@/api/change/changeSportHasRecommendedValsReq";
import { changeUnitCodeReq } from "@/api/change/changeUnitCodeReq";
import { createSportDifficultyReq } from "@/api/create/createSportDifficultyReq";
import { deleteSportDifficultyReq } from "@/api/delete/deleteSportDifficultyReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { Category } from "@/api/get/getCategoriesWithExercisesReq";
import { getDifficultiesReq } from "@/api/get/getDifficultiesReq";
import { Exercise } from "@/api/get/getExercisesReq";
import { Sport } from "@/api/get/getSportsReq";
import { moveSportDifficultyReq } from "@/api/move/moveSportDifficultyReq";
import { StateAndSet, StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Box, Checkbox, FormControl, FormControlLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import ItemsWindow from "../small/ItemsWindow";
import GeneralCard from "./GeneralCard";

interface SportDescriptionAndSettingsProps {
	sportsData: StateAndSetFunction<Sport[]>;
	sportDifficultiesData: StateAndSetFunction<SportDifficulty[]>;

	selectedSport: StateAndSet<Sport | null>;
	selectedSportOrExercise: StateAndSet<Sport | Exercise | null>;

	categoriesData: StateAndSetFunction<Category[]>;
	exercisesData: StateAndSetFunction<Exercise[]>;

	editing: StateAndSet<boolean>;

	sportName: string;

	isActiveFirstChildren: StateAndSet<boolean>;
}

export interface SportDifficulty {
	sportDifficultyId: number;

	difficultyName: string;
	orderNumber: number;
}

const SportDescriptionAndSettings = (props: SportDescriptionAndSettingsProps) => {
	const [descriptionValue, setDescriptionValue] = useState("");

	const [hasCategories, setHasCategories] = useState(false);
	const [hasDifficulties, setHasDifficulties] = useState(false);
	const [hasRecommendedValues, setHasRecommendedValues] = useState(false);
	const [hasRecommendedDifficultyValues, setHasRecommendedDifficultyValues] = useState(false);
	const [hasAutomaticPlanCreation, setHasAutomaticPlanCreation] = useState(false);

	//const [difficulties, setDifficulties] = useState<SportDifficulty[]>([]);
	const [newDifficulty, setNewDifficulty] = useState("");

	useEffect(() => {
		setDescriptionValue(props.selectedSport.state?.description || "");

		setHasCategories(props.selectedSport.state?.hasCategories || false);
		setHasDifficulties(props.selectedSport.state?.hasDifficulties || false);
		setHasRecommendedValues(props.selectedSport.state?.hasRecommendedValues || false);
		setHasRecommendedDifficultyValues(props.selectedSport.state?.hasRecommendedDifficultyValues || false);
		setHasAutomaticPlanCreation(props.selectedSport.state?.hasAutomaticPlanCreation || false);

		setUnitCodeValue(props.selectedSport.state?.unitCode || 0);

		getDifficulties();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.selectedSport.state]);

	const handleChangeSportHasCategories = async () => {
		try {
			const response = await changeSportHasCategoriesReq({ sportId: props.selectedSport.state!.sportId, hasCategories: !hasCategories });

			if (response.status === 200) {
				const newSport = {
					...props.selectedSport.state!,
					hasCategories: !hasCategories,
				};

				const newSportsData = props.sportsData.state.map((sport) => {
					if (sport.sportId === newSport.sportId) {
						return newSport;
					} else return sport;
				});

				props.sportsData.setState(newSportsData);
				props.selectedSport.setState(newSport);
				props.selectedSportOrExercise.setState(newSport);

				setHasCategories(!hasCategories);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeSportHasDifficulties = async () => {
		try {
			const response = await changeSportHasDifficultiesReq({ sportId: props.selectedSport.state!.sportId, hasDifficulties: !hasDifficulties });

			if (response.status === 200) {
				const newSport = {
					...props.selectedSport.state!,
					hasDifficulties: !hasDifficulties,
					hasRecommendedDifficultyValues: !hasDifficulties === false ? false : props.selectedSport.state?.hasRecommendedDifficultyValues!,
				};

				props.selectedSport.setState(newSport);
				props.selectedSportOrExercise.setState(newSport);

				props.sportsData.setState((prevSportsData) =>
					prevSportsData.map((sport) => {
						if (sport.sportId === newSport.sportId) {
							return newSport;
						} else {
							return sport;
						}
					})
				);

				setHasDifficulties(!hasDifficulties);
				if (hasRecommendedDifficultyValues && !hasDifficulties === false) {
					setHasRecommendedDifficultyValues(false);
				}

				/*if (!hasDifficulties === false && hasRecommendedDifficultyValues === true) {
					handleChangeSportHasRecommendedDifficultyValues();
				}*/
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeSportHasRecommendedValues = async () => {
		try {
			const response = await changeSportHasRecommendedValsReq({ sportId: props.selectedSport.state!.sportId, hasRecommendedValues: !hasRecommendedValues });

			if (response.status === 200) {
				const newSport = {
					...props.selectedSport.state!,
					hasRecommendedValues: !hasRecommendedValues,
					hasRecommendedDifficultyValues: !hasRecommendedValues === false ? false : props.selectedSport.state?.hasRecommendedDifficultyValues!,
				};

				props.selectedSport.setState(newSport);
				props.selectedSportOrExercise.setState(newSport);

				props.sportsData.setState((prevSportsData) =>
					prevSportsData.map((sport) => {
						if (sport.sportId === newSport.sportId) {
							return newSport;
						} else {
							return sport;
						}
					})
				);

				setHasRecommendedValues(!hasRecommendedValues);
				if (hasRecommendedDifficultyValues && !hasRecommendedValues === false) {
					setHasRecommendedDifficultyValues(false);
				}

				/*if (!hasRecommendedValues === false && hasRecommendedDifficultyValues === true) {
					handleChangeSportHasRecommendedDifficultyValues();
				}*/
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeSportHasRecommendedDifficultyValues = async () => {
		try {
			const response = await changeSportHasRecommendedDifficultyValsReq({ sportId: props.selectedSport.state!.sportId, hasRecommendedDifficultyValues: !hasRecommendedDifficultyValues });

			if (response.status === 200) {
				const newSport = {
					...props.selectedSport.state!,
					hasRecommendedDifficultyValues: !hasRecommendedDifficultyValues,
				};

				props.selectedSport.setState(newSport);
				props.selectedSportOrExercise.setState(newSport);

				props.sportsData.setState((prevSportsData) =>
					prevSportsData.map((sport) => {
						if (sport.sportId === newSport.sportId) {
							return newSport;
						} else {
							return sport;
						}
					})
				);

				setHasRecommendedDifficultyValues(!hasRecommendedDifficultyValues);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeSportHasAutomaticPlanCreation = async () => {
		try {
			const response = await changeSportHasAutomaticPlanCreationReq({ sportId: props.selectedSport.state!.sportId, hasAutomaticPlanCreation: !hasAutomaticPlanCreation });

			if (response.status === 200) {
				const newSport = {
					...props.selectedSport.state!,
					hasAutomaticPlanCreation: !hasAutomaticPlanCreation,
				};

				props.selectedSport.setState(newSport);
				props.selectedSportOrExercise.setState(newSport);

				props.sportsData.setState((prevSportsData) =>
					prevSportsData.map((sport) => {
						if (sport.sportId === newSport.sportId) {
							return newSport;
						} else {
							return sport;
						}
					})
				);

				setHasAutomaticPlanCreation(!hasAutomaticPlanCreation);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeSportDescription = async () => {
		try {
			const response = await changeSportDescReq({ sportId: props.selectedSport.state!.sportId, description: descriptionValue });

			if (response.status === 200) {
				const newSport = {
					...props.selectedSport.state!,
					description: descriptionValue,
				};

				props.selectedSport.setState(newSport);
				props.selectedSportOrExercise.setState(newSport);

				props.sportsData.setState((prevSportsData) =>
					prevSportsData.map((sport) => {
						if (sport.sportId === newSport.sportId) {
							return newSport;
						} else {
							return sport;
						}
					})
				);

				setDescriptionValue(descriptionValue);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const getDifficulties = async () => {
		try {
			const response = await getDifficultiesReq({ sportId: props.selectedSport.state!.sportId });

			if (response.status === 200 && response.data) {
				props.sportDifficultiesData.setState(response.data);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleCreateSportDifficulty = async () => {
		const orderNumber = props.sportDifficultiesData.state.length + 1;

		try {
			const response = await createSportDifficultyReq({ sportId: props.selectedSport.state!.sportId, difficultyName: newDifficulty, orderNumber });

			if (response.status === 200) {
				const newDifficultyForAdd = {
					sportDifficultyId: response.data,

					difficultyName: newDifficulty,
					orderNumber: orderNumber,
				} as SportDifficulty;

				props.sportDifficultiesData.setState((prevDifficulties) => [...prevDifficulties, newDifficultyForAdd]);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleMoveDifficulty = (orderNumber: number, direction: "up" | "down") => {
		if ((direction === "up" && orderNumber === 0) || (direction === "down" && orderNumber === props.sportDifficultiesData.state.length)) return;

		let difficultySwap: SportDifficulty;
		let updatedDifficulties: SportDifficulty[] = [];
		let reorderDifficulties: { difficultyId: number; orderNumber: number }[] = [];

		props.sportDifficultiesData.state.map((difficulty) => {
			if ((direction === "up" && difficulty.orderNumber === orderNumber) || (difficulty.orderNumber === orderNumber + 1 && direction === "down")) {
				reorderDifficulties.push({ difficultyId: difficulty.sportDifficultyId, orderNumber: difficulty.orderNumber - 1 });
				reorderDifficulties.push({ difficultyId: difficultySwap.sportDifficultyId, orderNumber: difficultySwap.orderNumber });

				updatedDifficulties.push({ ...difficulty, orderNumber: difficulty.orderNumber - 1 });
				updatedDifficulties.push(difficultySwap);
			} else if ((direction === "down" && difficulty.orderNumber === orderNumber) || (difficulty.orderNumber === orderNumber - 1 && direction === "up")) {
				difficultySwap = { ...difficulty, orderNumber: difficulty.orderNumber + 1 };
			} else {
				updatedDifficulties.push(difficulty);
			}
		});

		props.sportDifficultiesData.setState(updatedDifficulties);

		moveSportDifficulty(reorderDifficulties);
	};

	const moveSportDifficulty = async (reorderDifficulties: { difficultyId: number; orderNumber: number }[]) => {
		try {
			const response = await moveSportDifficultyReq({ sportId: props.selectedSport.state?.sportId!, reorderDifficulties });

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleDeleteDifficulty = (sportDifficultyId: number, orderNumber: number) => {
		const updatedExerciseInformations = props.sportDifficultiesData.state
			.filter((difficulty) => difficulty.sportDifficultyId !== sportDifficultyId)
			.map((difficulty) => {
				if (difficulty.orderNumber > orderNumber) {
					const updatedDifficulty = { ...difficulty, orderNumber: difficulty.orderNumber - 1 };

					return updatedDifficulty;
				}
				return difficulty;
			});

		deleteSportDifficulty(props.selectedSport.state?.sportId!, sportDifficultyId, orderNumber);

		props.sportDifficultiesData.setState(updatedExerciseInformations);
	};

	const deleteSportDifficulty = async (sportId: number, sportDifficultyId: number, orderNumber: number) => {
		try {
			const response = await deleteSportDifficultyReq({ sportId, sportDifficultyId, orderNumber });

			if (response.status === 200) {
				if (props.selectedSport.state?.hasCategories) {
					props.categoriesData.setState((prevCategories) =>
						prevCategories.map((category) => ({
							...category,
							exercises: category.exercises.map((exercise) => (exercise.sportDifficultyId === sportDifficultyId ? { ...exercise, sportDifficultyId: response.data! } : { ...exercise })),
						}))
					);
				} else {
					props.exercisesData.setState((prevExercises) => prevExercises.map((exercise) => (exercise.sportDifficultyId === sportDifficultyId ? { ...exercise, sportDifficultyId: response.data! } : { ...exercise })));
				}
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const [unitCodeValue, setUnitCodeValue] = useState(props.selectedSport.state?.unitCode);

	const handleChangeUnitCode = async (event: SelectChangeEvent<number>) => {
		const newUnitCode = event.target.value as number;

		if (unitCodeValue === newUnitCode) return;

		try {
			const response = await changeUnitCodeReq({ sportId: props.selectedSport.state?.sportId!, unitCode: newUnitCode });

			if (response.status === 200) {
				const newSport = {
					...props.selectedSport.state!,
					unitCode: newUnitCode,
				};

				props.selectedSport.setState(newSport);
				props.selectedSportOrExercise.setState(newSport);

				props.sportsData.setState((prevSportsData) =>
					prevSportsData.map((sport) => {
						if (sport.sportId === newSport.sportId) {
							return newSport;
						} else {
							return sport;
						}
					})
				);

				setUnitCodeValue(newUnitCode);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<>
			<GeneralCard
				height="h-full"
				showFirstSection={{ state: props.isActiveFirstChildren.state, setState: props.isActiveFirstChildren.setState }}
				firstTitle="Popis"
				firstChildren={
					props.selectedSport && (
						<>
							{props.editing.state ? (
								<>
									<TextField
										className="w-full"
										placeholder="Popis sportu"
										multiline
										minRows={20}
										value={descriptionValue}
										onChange={(e) => setDescriptionValue(e.target.value)}
										onBlur={() => handleChangeSportDescription()}
										InputProps={{
											className: "font-light",
										}}
									/>
								</>
							) : (
								<Typography className="react-markdown break-words font-light mb-6">
									<ReactMarkdown
										remarkPlugins={[remarkBreaks]}
										components={{
											p: ({ children }) => <p className="font-light ml-4">{children}</p>,
											ul: ({ children }) => <ul className="list-disc pl-8 mt-1 mb-0 space-y-1">{children}</ul>,
											ol: ({ children }) => <ol className="list-decimal pl-8 mt-1 mb-0 space-y-1">{children}</ol>,
											li: ({ children }) => <li className="mb-0 ml-4">{children}</li>,
											h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
											h2: ({ children }) => <h2 className="text-2xl font-semibold">{children}</h2>,
											h3: ({ children }) => <h3 className="text-xl font-medium">{children}</h3>,
										}}>
										{props.selectedSport.state?.description || ""}
									</ReactMarkdown>
								</Typography>
							)}
						</>
					)
				}
				secondTitle="Nastavení"
				secondChildren={
					props.selectedSport && (
						<Box className="flex flex-col items-start">
							<Typography className="pt-2 text-lg">Kategorie sportu</Typography>

							<Box className="flex flex-col p-4 pr-0 pt-2 pb-2 gap-4">
								<Typography className="font-light">
									Kategorie sportu slouží k rozdělení cviků do jednotlivých skupin podle jejich zaměření nebo typu. Tato struktura pomáhá uživatelům snadno najít cviky související s konkrétní částí těla nebo cvičební technikou.
								</Typography>

								<Typography className="font-light">
									Autor sportu může přidávat, přeuspořádávat a mazat kategorie podle potřeby. Cviky, které nejsou přiřazeny ke konkrétní kategorii, automaticky náleží do kategorie Ostatní.
								</Typography>
							</Box>

							<Box className="item-center h-10">
								{props.editing.state ? (
									<FormControlLabel
										className="pl-4"
										control={
											<Checkbox
												checked={hasCategories}
												onChange={() => {
													handleChangeSportHasCategories();
												}}
											/>
										}
										label={hasCategories ? "Sport má kategorie." : "Sport nemá kategorie."}
									/>
								) : props.selectedSport.state?.hasCategories ? (
									<Typography className="pl-4 py-2">Sport má kategorie.</Typography>
								) : (
									<Typography className="pl-4 py-2">Sport nemá kategorie.</Typography>
								)}
							</Box>

							<Typography className="pt-12 text-lg">Obtížnosti cviků</Typography>
							<Box className="flex flex-col p-4 pr-0 pt-2 pb-2 gap-4">
								<Typography className="font-light">Obtížnosti cviků umožňují uživatelům při tvorbě tréninkového plánu filtrovat cviky podle jejich náročnosti.</Typography>

								<Typography className="font-light">
									Pokud je tato funkce aktivní, uživatel si může vybrat, jaké cviky se mu budou při sestavování plánu zobrazovat. To mu umožňuje přizpůsobit tréninky jeho schopnostem a postupně zvyšovat náročnost cviků.
								</Typography>

								<Typography className=" font-light">
									Autor sportu může přidávat a seřazovat obtížnosti podle potřeby - od nejlehčích po nejtěžší. Číslo 1 označuje nejjednodušší obtížnost, zatímco nejvyšší číslo představuje nejnáročnější obtížnost. Každý cvik
									může mít jednu z dostupných obtížností, kterou přiřazuje autor daného sportu. Pokud cvik nemá přiřazenou obtížnost, tak se během tvorby tréninkového plánu nebude zobrazovat.
								</Typography>

								<Box>
									<Typography>Příklad</Typography>
									<Typography className=" font-light">
										Uživatel tvoří tréninkový plán pro sport, který obsahuje cviky s obtížnostmi 1 - jednoduchá, 2 - střední a 3 - náročná. Pokud si vybere obtížnost 2 - střední, zobrazí se mu pouze cviky s obtížností 1 -
										jednoduchá, 2 - střední a cviky, které nemají přiřazenou obtížnost. Cviky s obtížností 3 - náročná se nezobrazí.
									</Typography>
								</Box>
							</Box>

							<Box className="item-center h-10">
								{props.editing.state ? (
									<FormControlLabel
										className="pl-4"
										control={
											<Checkbox
												checked={hasDifficulties}
												onChange={() => {
													handleChangeSportHasDifficulties();
												}}
											/>
										}
										label={hasDifficulties ? "Cviky mají různé obtížnosti." : "Cviky nemají různé obtížnosti."}
									/>
								) : hasDifficulties ? (
									<Typography className="pl-4 py-2">Cviky mají různé obtížnosti.</Typography>
								) : (
									<Typography className="pl-4 py-2">Cviky nemají různé obtížnosti.</Typography>
								)}
							</Box>

							{(hasDifficulties || props.editing.state) && (
								<ItemsWindow
									editing={props.editing}
									showOrderNumbers
									handleMove={handleMoveDifficulty}
									handleDelete={handleDeleteDifficulty}
									isChecked={hasDifficulties}
									onToggleChange={setHasDifficulties}
									items={props.sportDifficultiesData.state}
									newItem={handleCreateSportDifficulty}
									value={newDifficulty}
									setValue={setNewDifficulty}
									label="Jednotlivé obtížnosti"
									button="Přidat obtížnost cviků"
									styles="w-1/2 min-h-80 ml-4 mt-3"
								/>
							)}

							<Box className="flex w-full items-end gap-3">
								<Typography className="pt-12 text-lg">Nejčastější jednotka zátěže</Typography>
								<Typography className="text-gray-400 font-light text-nowrap mb-1">»</Typography>
								<FormControl
									variant="standard"
									className="w-36 mb-0.5">
									<Select
										value={unitCodeValue}
										onChange={handleChangeUnitCode}
										sx={{
											"& .MuiSelect-select": {
												paddingBottom: 0,
												paddingLeft: 0.5,
											},
										}}>
										<MenuItem value="1">Kilogram</MenuItem>
										<MenuItem value="2">Sekunda</MenuItem>
										<MenuItem value="3">Minuta</MenuItem>
										<MenuItem value="4">Hodina</MenuItem>
										<MenuItem value="5">Metr</MenuItem>
										<MenuItem value="6">Kilometr</MenuItem>
										<MenuItem value="7">Bez jednotky</MenuItem>
									</Select>
								</FormControl>
							</Box>
							<Box className="flex flex-col p-4 pt-2 pr-0 pb-2 gap-4">
								<Typography className="font-light">Nejčastější jednotka zátěže bude automaticky předvybrána při tvorbě nových cviků.</Typography>
							</Box>

							<Typography className="pt-12 text-lg">Doporučené hodnoty</Typography>
							<Box className="flex flex-col p-4 pt-2 pr-0 pb-2 gap-4">
								<Typography className="font-light">
									Během tvorby tréninkového plánu se zobrazí doporučené hodnoty, které lze jednoduše použít pouhým kliknutím. To usnadní nastavování počtu opakování, sérií a zátěže cviků.
								</Typography>
								<Box className="item-center h-10 -mt-2">
									{props.editing.state ? (
										<FormControlLabel
											className=""
											control={
												<Checkbox
													checked={hasRecommendedValues}
													onChange={() => {
														handleChangeSportHasRecommendedValues();
													}}
												/>
											}
											label={hasRecommendedValues ? "Doporučené hodnoty jsou zobrazovány." : "Doporučené hodnoty nejsou zobrazovány."}
										/>
									) : hasRecommendedValues ? (
										<Typography className="py-2">Doporučené hodnoty jsou zobrazovány.</Typography>
									) : (
										<Typography className=" py-2">Doporučené hodnoty nejsou zobrazovány.</Typography>
									)}
								</Box>
							</Box>

							<Typography className="pt-12 text-lg">Doporučené hodnoty obtížností</Typography>
							<Box className="flex flex-col p-4 pt-2 pr-0 pb-2 gap-4 ">
								{(!hasDifficulties || !hasRecommendedValues) && props.editing.state && <Typography className="font-light">Pro aktivaci je nutné mít povolené obtížnosti cviků a zobrazování doporučených hodnot.</Typography>}

								<Typography className={`font-light ${(!hasDifficulties || !hasRecommendedValues) && props.editing.state && "opacity-50"}`}>
									U každého cviku se zobrazí doporučené hodnoty zvlášť pro jednotlivé obtížnosti, což umožní přesnější přizpůsobení tréninku pro různě pokročilé sportovce.
								</Typography>
								<Box>
									<Typography className={`${(!hasDifficulties || !hasRecommendedValues) && props.editing.state && "opacity-50"}`}>Příklad</Typography>
									<Typography className={`font-light ${(!hasDifficulties || !hasRecommendedValues) && props.editing.state && "opacity-50"}`}>
										Sport má obtížnosti 1 - jednoduchá, 2 - střední a 3 - náročná. Pokud má cvik nastavenou obtížnost 2 - střední, zobrazí se možnost zadat doporučené hodnoty nejen pro tuto obtížnost, ale i pro ty vyšší, jako
										je 3 - náročná. Nižší obtížnosti se do doporučených hodnot nezahrnují. Pokud pro vyšší obtížnosti nejsou hodnoty zadány, automaticky se použijí ty z nejbližší nižší obtížnosti.
									</Typography>
								</Box>
								<Typography className={`font-light ${(!hasDifficulties || !hasRecommendedValues) && props.editing.state && "opacity-50"}`}>
									Během tvorby tréninkového plánu se sportovcům s vyšší obtížností automaticky zobrazí příslušné doporučené hodnoty.
								</Typography>
								<Box className="item-center h-10 -mt-2">
									{props.editing.state ? (
										<FormControlLabel
											disabled={!props.selectedSport.state?.hasDifficulties || !props.selectedSport.state.hasRecommendedValues}
											className=""
											control={
												<Checkbox
													checked={hasRecommendedDifficultyValues}
													onChange={handleChangeSportHasRecommendedDifficultyValues}
												/>
											}
											label={hasRecommendedDifficultyValues ? "Cviky mají pro každou obtížnost odlišné doporučené hodnoty." : "Cviky nemají pro každou obtížnost odlišné doporučené hodnoty."}
										/>
									) : hasRecommendedDifficultyValues ? (
										<Typography className=" py-2">Cviky mají pro každou obtížnost jiné doporučené hodnoty.</Typography>
									) : (
										<Typography className="py-2">Cviky nemají pro každou obtížnost jiné doporučené hodnoty.</Typography>
									)}
								</Box>
							</Box>

							<Typography className="pt-12 text-lg">Automatická tvorba tréninku</Typography>
							<Box className="flex flex-col p-4 pt-2 pr-0 pb-2 gap-4">
								<Typography className="font-light">
									Aktivací bude umožněno v sekci Tréninky → Nový trénink automaticky vygenerovat základní strukturu tréninku na základě zadaných sportovních údajů. Pro využití automatické tvorby je nutné, aby uživatel před
									tvorbou tréninku vyplnil délku tréninku{props.selectedSport.state?.hasDifficulties ? ", obtížnost cviků" : ""} a počet tréninkových dní.
								</Typography>
								<Typography className="font-light">
									Po aktivaci je doporučeno, aby autor upravil údaje {props.selectedSport.state?.hasCategories ? "kategorií a " : ""}cviků, které ovlivňují způsob automatické tvorby tréninku.
								</Typography>

								<Box>
									<Typography>Údaje ovlivňující automatickou tvorbu:</Typography>
									<Box className="space-y-6 mt-2 ml-6">
										<Box className="flex">
											<Typography className="mr-2 text-nowrap">Opakovatelnost</Typography>
											<Typography className="mr-2 opacity-50 font-light">»</Typography>
											<Typography className=" font-light">Určuje, zda a kolikrát se daný cvik může v rámci tréninku opakovat.</Typography>
										</Box>

										{/* TODO TF pro zadávání min a max hranic pro den*/}
										<Box className="flex">
											<Typography className="mr-2 text-nowrap">Minimální a maximální počet</Typography>
											<Typography className="mr-2 opacity-50 font-light">»</Typography>
											<Typography className=" font-light">Nastavení hranic pro počet cviků v jednotlivých {props.selectedSport.state?.hasCategories ? "kategoriích" : "dnechs"}.</Typography>
										</Box>

										<Box className="flex">
											<Typography className="mr-2 text-nowrap">Volná návaznost</Typography>
											<Typography className="mr-2 opacity-50 font-light">»</Typography>
											<Typography className=" font-light">Zvyšuje pravděpodobnost, že po vybraném cviku budou následovat logicky navazující cviky.</Typography>
										</Box>

										<Box className="flex">
											<Typography className="mr-2 text-nowrap">Pevná návaznost</Typography>
											<Typography className="mr-2 opacity-50 font-light">»</Typography>
											<Typography className=" font-light">
												Zajišťuje, že po vybraném cviku bude vždy následovat konkrétní cvik. Jestliže je vybrán cvik pro pevnou návaznost, tak není možné přidat cviky do volné návaznosti. Pokud by přidání navazujícího
												cviku bylo přes maximální hranici počtu cviků, tak se nepřidá.
											</Typography>
										</Box>

										<Box className="flex">
											<Typography className="mr-2 text-nowrap">Prioritní body</Typography>
											<Typography className="mr-2 opacity-50 font-light">»</Typography>
											<Box>
												<Typography className=" font-light">
													Každému cviku lze přiřadit prioritní bod 1, 2 a 3. Tyto body určují, do jaké třetiny {props.selectedSport.state?.hasCategories ? "dané kategorie" : "daného dne"} bude cvik přiřazen. Cvik může
													obsahovat více piroritních bodů.
												</Typography>
												<Box className="flex mt-2">
													<Typography className="mr-2 text-nowrap">Příklad</Typography>
													<Typography className="mr-2 opacity-50 font-light">»</Typography>
													<Typography className=" font-light">
														Vybraný cvik má prioritní body 1 a 3. Maximální počet cviků {props.selectedSport.state?.hasCategories ? "kategorie" : "dne"} je 9. Vybraný cvik se tedy může nacházet buď na 1. až 3. nebo 7.
														až 9. pozici {props.selectedSport.state?.hasCategories ? "kategorie" : "dne"}.
													</Typography>
												</Box>
											</Box>
										</Box>

										<Box className="flex">
											<Typography className="mr-2 text-nowrap">Blacklist</Typography>
											<Typography className="mr-2 opacity-50 font-light">»</Typography>
											<Typography className=" font-light">Zvolené cviky se nebudou v rámci {props.selectedSport.state?.hasCategories ? "dané kategorie" : "daného dne"} vyskytovat pospolu.</Typography>
										</Box>
									</Box>
									{props.selectedSport.state?.hasCategories ? <Typography className="mt-6">Totožná pravidla a možnosti nastavení platí nejen pro cviky, ale i pro jednotlivé kategorie sportu.</Typography> : null}
								</Box>

								{props.editing.state ? (
									<FormControlLabel
										className=""
										control={
											<Checkbox
												checked={hasAutomaticPlanCreation}
												onChange={handleChangeSportHasAutomaticPlanCreation}
											/>
										}
										label={hasAutomaticPlanCreation ? "Sport má zaktivovanou automatickou tvorbu tréninku." : "Sport nemá zaktivovanou automatickou tvorbu tréninku."}
									/>
								) : hasAutomaticPlanCreation ? (
									<Typography className=" py-2">Sport má zaktivovanou automatickou tvorbu tréninku.</Typography>
								) : (
									<Typography className="py-2">Sport nemá zaktivovanou automatickou tvorbu tréninku.</Typography>
								)}
							</Box>

							<Typography className="pt-12 text-lg">Odstranění sportu</Typography>
							<Box className="flex flex-col p-4 pt-2 pb-2 pr-0 gap-4">
								<Typography className="font-light">Stisknutím tlačítka smažete sport {<span className="font-normal">{props.sportName}</span>}. Tato akce je nevratná!</Typography>
							</Box>
						</Box>
					)
				}></GeneralCard>
		</>
	);
};

export default SportDescriptionAndSettings;
