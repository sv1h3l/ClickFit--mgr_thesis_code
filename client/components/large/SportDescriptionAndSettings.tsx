import { changeSportDescReq } from "@/api/change/changeSportDescReq";
import { changeSportHasAutomaticPlanCreationReq } from "@/api/change/changeSportHasAutomaticPlanCreationReq";
import { changeSportHasCategoriesReq } from "@/api/change/changeSportHasCategoriesReq";
import { changeSportHasDifficultiesReq } from "@/api/change/changeSportHasDifficultiesReq";
import { changeSportHasRecommendedDifficultyValsReq } from "@/api/change/changeSportHasRecommendedDifficultyValsReq";
import { changeSportHasRecommendedValsReq } from "@/api/change/changeSportHasRecommendedValsReq";
import { changeSportNameReq } from "@/api/change/changeSportNameReq";
import { changeUnitCodeReq } from "@/api/change/changeUnitCodeReq";
import { createSportDifficultyReq } from "@/api/create/createSportDifficultyReq";
import { deleteSportDifficultyReq } from "@/api/delete/deleteSportDifficultyReq";
import { deleteSportReq } from "@/api/delete/deleteSportReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { Category } from "@/api/get/getCategoriesWithExercisesReq";
import { getDifficultiesReq } from "@/api/get/getDifficultiesReq";
import { Exercise } from "@/api/get/getExercisesReq";
import { Sport } from "@/api/get/getSportsReq";
import { moveSportDifficultyReq } from "@/api/move/moveSportDifficultyReq";
import { Unit } from "@/pages/training-plan";
import { useAppContext } from "@/utilities/Context";
import { StateAndSet, StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Box, FormControl, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import CustomModal from "../small/CustomModal";
import ItemsWindow from "../small/ItemsWindow";
import LabelAndValue from "../small/LabelAndValue";
import { RemarkEntitiesDescription } from "./DiaryAndGraphs";
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
	showFirstSection: StateAndSet<boolean>;
}

export interface SportDifficulty {
	sportDifficultyId: number;

	difficultyName: string;
	orderNumber: number;
}

const SportDescriptionAndSettings = (props: SportDescriptionAndSettingsProps) => {
	const [descriptionValue, setDescriptionValue] = useState("");

	const context = useAppContext();

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

	const [unitCodeValue, setUnitCodeValue] = useState(props.selectedSport.state?.unitCode || 7);

	const handleChangeUnitCode = async (newUnitCode: number) => {
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

	const handleDeleteSport = async () => {
		try {
			const response = await deleteSportReq({ sportId: props.selectedSport.state?.sportId! });

			if (response.status === 200) {
				props.selectedSport.setState(null);
				props.selectedSportOrExercise.setState(null);

				props.sportsData.setState((prevSportsData) => prevSportsData.filter((sport) => sport.sportId !== props.selectedSport.state?.sportId!));
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	//
	//	#region Select Comp
	//

	const UnitNames: Record<number, string> = {
		[Unit.WITHOUT_UNIT]: "Bez jednotky",
		[Unit.KILOGRAM]: "Kilogram",
		[Unit.SECOND]: "Sekunda",
		[Unit.MINUTE]: "Minuta",
		[Unit.HOUR]: "Hodina",
		[Unit.METER]: "Metr",
		[Unit.KILOMETER]: "Kilometr",
	};

	const [unitNames, setUnitNames] = useState<{ unitCode: number; unitName: string }[]>([
		{ unitCode: Unit.KILOGRAM, unitName: UnitNames[Unit.KILOGRAM] },
		{ unitCode: Unit.SECOND, unitName: UnitNames[Unit.SECOND] },
		{ unitCode: Unit.MINUTE, unitName: UnitNames[Unit.MINUTE] },
		{ unitCode: Unit.HOUR, unitName: UnitNames[Unit.HOUR] },
		{ unitCode: Unit.METER, unitName: UnitNames[Unit.METER] },
		{ unitCode: Unit.KILOMETER, unitName: UnitNames[Unit.KILOMETER] },
		{ unitCode: Unit.WITHOUT_UNIT, unitName: UnitNames[Unit.WITHOUT_UNIT] },
	]);

	const SelectComp = () => {
		const [open, setOpen] = useState(false);

		const handleOpen = () => {
			setOpen(true);
		};

		const handleClose = () => {
			setOpen(false);
		};

		const handleChange = (event: SelectChangeEvent<string>) => {
			const value = Number(event.target.value);

			setUnitCodeValue(value);
			handleChangeUnitCode(value);

			handleClose();
		};

		return (
			<FormControl
				className=""
				variant="standard"
				sx={{
					"& .MuiSelect-select": {
						backgroundColor: "transparent !important",
					},
				}}>
				<Select
					open={open}
					onClose={handleClose}
					onOpen={handleOpen}
					value={unitCodeValue.toString()}
					onChange={handleChange}
					className=" h-[2rem]  "
					disableUnderline
					sx={{
						"& .MuiSelect-select": {
							display: "flex",
							alignItems: "center",

							backgroundColor: "transparent !important",
						},
					}}
					IconComponent={() => null}
					renderValue={(value) => (
						<Box className="flex items-center gap-2 ml-0.5 -mr-5 ">
							<ButtonComp
								content={open ? IconEnum.ARROW_DROP_UP : IconEnum.ARROW_DROP_DOWN}
								style="-mt-0.5  mr-1 "
								color="text-[#fff]"
								onClick={handleOpen}
								externalClicked={{ state: open, setState: setOpen }}
							/>
							<Typography sx={{ opacity: 1 }}>{UnitNames[Number(value)]}</Typography>
						</Box>
					)}
					MenuProps={{
						PaperProps: {
							sx: {
								marginTop: "-0.15rem",
								marginLeft: "0.3rem",
								backgroundColor: "#1E1E1E",
								borderRadius: "0.75rem",
								borderTopLeftRadius: "0.25rem",
								fontWeight: 300,
							},
						},
						anchorOrigin: {
							vertical: "bottom",
							horizontal: "left",
						},
						transformOrigin: {
							vertical: "top",
							horizontal: "left",
						},
					}}>
					{unitNames.map((item) => (
						<MenuItem
							sx={{
								opacity: 1,
								"&.Mui-selected": {
									backgroundColor: context.colorSchemeCode === "red" ? "#4e3939" : context.colorSchemeCode === "blue" ? "#313c49" : context.colorSchemeCode === "green" ? "#284437" : "#414141",
								},
								"&.Mui-selected:hover": {
									backgroundColor: context.colorSchemeCode === "red" ? "#4e3939" : context.colorSchemeCode === "blue" ? "#313c49" : context.colorSchemeCode === "green" ? "#284437" : "#414141",
								},
							}}
							key={item.unitCode}
							value={item.unitCode}
							className={`px-3 py-1.5  hover:cursor-pointer transition-colors duration-150 w-full flex justify-center
								${context.bgSecondaryColor + context.bgHoverTertiaryColor}`}>
							<Typography sx={{ opacity: 0.95 }}>{item.unitName}</Typography>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	};

	//	#endregion
	//

	//
	//	#region Sport Name
	//
	const [nameHelperText, setNameHelperText] = useState("");

	useEffect(() => {
		setNameHelperText("");
	}, [props.editing.state]);

	const handleChangeSportName = async (value: string) => {
		try {
			const res = await changeSportNameReq({ sportName: value, sportId: props.selectedSport.state?.sportId! });

			if (res.status === 400 || res.status === 409) {
				setNameHelperText(res.message);
			} else if (res.status === 200) {
				const newSport = {
					...props.selectedSport.state,
					sportName: value,
				} as Sport;

				props.selectedSport.setState(newSport);
				props.selectedSportOrExercise.setState(newSport);

				props.sportsData.setState((prev) => prev.map((sport) => (sport.sportId === newSport.sportId ? newSport : sport)));
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	//	#endregion
	//

	const [isModalOpened, setIsModalOpened] = useState(false);
	const [isDescriptionModalOpened, setIsDescriptionModalOpened] = useState(false);

	return (
		<>
			<GeneralCard
				height="h-full"
				showFirstSection={{ state: props.isActiveFirstChildren.state, setState: props.isActiveFirstChildren.setState }}
				firstTitle="Popis"
				firstChildren={
					props.selectedSport && (
						<Box className="mt-3">
							{props.editing.state ? (
								<Box className="relative">
									<TextField
										className="w-full"
										label="Popis sportu"
										placeholder=" Popište například základní charakteristiku sportu, jak ovlivňuje kondici a zdraví, pro koho je určený nebo proč si vybrat právě tento sport."
										multiline
										minRows={20}
										value={descriptionValue}
										onChange={(e) => setDescriptionValue(e.target.value)}
										onBlur={() => handleChangeSportDescription()}
										InputProps={{
											className: "font-light",
										}}
									/>
									<Box className="absolute bottom-2 right-2">
										<ButtonComp
											size="small"
											contentStyle="scale-[1.2]"
											content={IconEnum.QUESTION}
											externalClicked={{ state: isDescriptionModalOpened, setState: setIsDescriptionModalOpened }}
											onClick={() => setIsDescriptionModalOpened(true)}
										/>
									</Box>
								</Box>
							) : descriptionValue.length < 1 ? (
								<Typography className="text-lg font-light ml-4">Pro vybraný sport neexistuje popis.</Typography>
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

							<CustomModal
								style="max-w-2xl w-full"
								isOpen={isDescriptionModalOpened}
								paddingTop
								onClose={() => setIsDescriptionModalOpened(false)}
								title="Podporované formátovací prvky"
								children={<RemarkEntitiesDescription />}
							/>
						</Box>
					)
				}
				secondTitle="Nastavení"
				secondChildren={
					props.selectedSport && (
						<Box className="flex flex-col items-start ">
							{props.editing.state ? (
								<Box className=" flex items-start mr-3 mt-3 mb-8 w-1/2">
									<LabelAndValue
										label="Název sportu"
										noPaddingTop
										maxLength={25}
										mainStyle="w-full "
										textFieldValue={props.selectedSport.state?.sportName}
										textFieldOnClick={(value) => handleChangeSportName(value)}
										icon={IconEnum.CHECK}
										onChangeCond={(value) => {
											if (value === props.selectedSport.state?.sportName) {
												setNameHelperText("");
												return false;
											}

											let nameExists = false;

											props.sportsData.state.map((sport) => {
												if (sport.sportName === value && sport.userId === props.selectedSport.state?.userId) nameExists = true;
											});

											if (nameExists) {
												setNameHelperText("Sport s tímto názvem již existuje");
												return false;
											}

											if (value.length > 25) {
												setNameHelperText("Název může mít maximálně 25 znaků");
											}

											if (value !== "") {
												setNameHelperText("");

												return true;
											} else {
												setNameHelperText("Název nesmí být prázdný");

												return false;
											}
										}}
										helperText={nameHelperText}
									/>
								</Box>
							) : (
								<LabelAndValue
									mainStyle="mt-3 mb-8"
									noPaddingTop
									label="Název sportu"
									value={props.selectedSport.state?.sportName}
								/>
							)}

							<Box className="flex w-full items-end gap-3">
								<Typography className="pt-6 text-lg">Nejčastější jednotka zátěže</Typography>
								<Typography className="text-gray-400 font-light text-nowrap mb-[0.2rem]">»</Typography>

								{props.editing.state ? (
									<Box className="-mb-0.5">
										<SelectComp />
									</Box>
								) : (
									<Typography className="mb-[0.1rem] ">{UnitNames[unitCodeValue]}</Typography>
								)}
							</Box>
							<Box className="flex flex-col p-4 pt-2 pr-0  gap-4">
								<Typography className="font-light">Nejčastější jednotka zátěže bude automaticky předvybrána při tvorbě nových cviků.</Typography>
							</Box>

							<Typography className="pt-10 text-lg">Kategorie sportu</Typography>

							<Box className="flex flex-col p-4 pr-0 pt-2 pb-2 gap-4">
								<Typography className="font-light">
									Kategorie sportu slouží k rozdělení cviků do jednotlivých skupin podle jejich zaměření nebo typu. Tato struktura pomáhá uživatelům snadno najít cviky související s konkrétní částí těla nebo cvičební technikou.
								</Typography>

								<Typography className="font-light">
									Autor sportu může přidávat, přeuspořádávat a mazat kategorie podle potřeby. Cviky, které nejsou přiřazeny ke konkrétní kategorii, automaticky náleží do kategorie Ostatní.
								</Typography>
							</Box>

							<Box className="h-10">
								<Box className="flex items-center ml-4">
									<ButtonComp
										style="mb-0.5 mr-3"
										size="small"
										externalClicked={{ state: hasCategories, setState: setHasCategories }}
										content={props.selectedSport.state?.hasCategories ? IconEnum.CHECK : IconEnum.CROSS}
										onClick={
											props.editing.state
												? () => {
														handleChangeSportHasCategories();
												  }
												: undefined
										}
									/>
									<Typography
										onClick={
											props.editing.state
												? () => {
														handleChangeSportHasCategories();
												  }
												: undefined
										}
										className={`py-2 text-[1.1rem] ${props.editing.state && "underline underline-offset-4 decoration-[#ffffff60] cursor-pointer"}`}>
										{props.selectedSport.state?.hasCategories ? "Sport má kategorie." : "Sport nemá kategorie."}
									</Typography>
								</Box>
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

							<Box className="h-10">
								<Box className="flex items-center ml-4">
									<ButtonComp
										style="mb-0.5 mr-3"
										size="small"
										externalClicked={{ state: hasDifficulties, setState: setHasDifficulties }}
										content={props.selectedSport.state?.hasDifficulties ? IconEnum.CHECK : IconEnum.CROSS}
										onClick={
											props.editing.state
												? () => {
														handleChangeSportHasDifficulties();
												  }
												: undefined
										}
									/>
									<Typography
										onClick={
											props.editing.state
												? () => {
														handleChangeSportHasDifficulties();
												  }
												: undefined
										}
										className={`py-2 text-[1.1rem] ${props.editing.state && "underline underline-offset-4 decoration-[#ffffff60] cursor-pointer"}`}>
										{props.selectedSport.state?.hasDifficulties ? "Cviky mají různé obtížnosti." : "Cviky nemají různé obtížnosti."}
									</Typography>
								</Box>
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
									styles="w-1/2 ml-4 mt-3"
								/>
							)}

							<Typography className="pt-12 text-lg">Doporučené hodnoty</Typography>
							<Box className="flex flex-col p-4 pt-2 pr-0 pb-2 gap-4">
								<Typography className="font-light">
									Během tvorby tréninkového plánu se zobrazí doporučené hodnoty, které lze jednoduše použít pouhým kliknutím. To usnadní nastavování počtu opakování, sérií a zátěže cviků.
								</Typography>
							</Box>

							<Box className="h-10">
								<Box className="flex items-center ml-4">
									<ButtonComp
										style="mb-0.5 mr-3"
										size="small"
										externalClicked={{ state: hasRecommendedValues, setState: setHasRecommendedValues }}
										content={props.selectedSport.state?.hasRecommendedValues ? IconEnum.CHECK : IconEnum.CROSS}
										onClick={
											props.editing.state
												? () => {
														handleChangeSportHasRecommendedValues();
												  }
												: undefined
										}
									/>
									<Typography
										onClick={
											props.editing.state
												? () => {
														handleChangeSportHasRecommendedValues();
												  }
												: undefined
										}
										className={`py-2 text-[1.1rem] ${props.editing.state && "underline underline-offset-4 decoration-[#ffffff60] cursor-pointer"}`}>
										{props.selectedSport.state?.hasRecommendedValues ? "Doporučené hodnoty jsou zobrazovány." : "Doporučené hodnoty nejsou zobrazovány."}
									</Typography>
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
							</Box>

							<Box className="h-10">
								<Box className="flex items-center ml-4">
									<ButtonComp
										style="mb-0.5 mr-3"
										size="small"
										disabled={props.editing.state && (!props.selectedSport.state?.hasDifficulties || !props.selectedSport.state.hasRecommendedValues)}
										externalClicked={{ state: hasRecommendedDifficultyValues, setState: setHasRecommendedDifficultyValues }}
										content={props.selectedSport.state?.hasRecommendedDifficultyValues ? IconEnum.CHECK : IconEnum.CROSS}
										onClick={
											props.editing.state
												? () => {
														handleChangeSportHasRecommendedDifficultyValues();
												  }
												: undefined
										}
									/>
									<Typography
										onClick={
											props.editing.state && props.selectedSport.state?.hasDifficulties && props.selectedSport.state.hasRecommendedValues
												? () => {
														handleChangeSportHasRecommendedDifficultyValues();
												  }
												: undefined
										}
										className={`py-2 text-[1.1rem]
											${props.editing.state && "underline underline-offset-4 decoration-[#ffffff60]"}
											${props.editing.state && (!props.selectedSport.state?.hasDifficulties || !props.selectedSport.state.hasRecommendedValues) && "opacity-50"}
											${props.editing.state && props.selectedSport.state?.hasDifficulties && props.selectedSport.state.hasRecommendedValues && "cursor-pointer"}`}>
										{props.selectedSport.state?.hasRecommendedDifficultyValues ? "Cviky mají pro každou obtížnost jiné doporučené hodnoty." : "Cviky nemají pro každou obtížnost jiné doporučené hodnoty."}
									</Typography>
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
										<Box className="flex mt-4">
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
							</Box>

							<Box className="h-10">
								<Box className="flex items-center ml-4">
									<ButtonComp
										style="mb-0.5 mr-3"
										size="small"
										externalClicked={{ state: hasAutomaticPlanCreation, setState: setHasAutomaticPlanCreation }}
										content={props.selectedSport.state?.hasAutomaticPlanCreation ? IconEnum.CHECK : IconEnum.CROSS}
										onClick={
											props.editing.state
												? () => {
														handleChangeSportHasAutomaticPlanCreation();
												  }
												: undefined
										}
									/>
									<Typography
										onClick={
											props.editing.state
												? () => {
														handleChangeSportHasAutomaticPlanCreation();
												  }
												: undefined
										}
										className={`py-2 text-[1.1rem] ${props.editing.state && "underline underline-offset-4 decoration-[#ffffff60] cursor-pointer"}`}>
										{props.selectedSport.state?.hasAutomaticPlanCreation ? "Sport má zaktivovanou automatickou tvorbu tréninku." : "Sport nemá zaktivovanou automatickou tvorbu tréninku."}
									</Typography>
								</Box>
							</Box>

							<Typography className="pt-12 text-lg">Odstranění sportu</Typography>
							<Box className="flex mb-4 p-4 pt-2 pb-2 pr-0 gap-3">
								<Typography className="font-light">Tlačítko slouží k odstranění sportu {<span className="font-normal text-lg">{props.sportName}</span>}.</Typography>
								<ButtonComp
									size="medium"
									style="bg-red-900"
									justClick
									dontChangeOutline
									contentStyle="scale-[1.1]"
									content={IconEnum.TRASH}
									onClick={() => setIsModalOpened(true)}
								/>
							</Box>
						</Box>
					)
				}
			/>

			<CustomModal
				style="max-w-lg w-full"
				isOpen={isModalOpened}
				title="Odstranění sportu"
				hideBackButton
				children={
					<Box className="">
						<Typography className="">Odtraněním sportu se smažou veškeré cviky, kategorie, obtížnosti, grafy i tréninkové plány.</Typography>
						<Typography className="w-full text-center mt-8 text-red-icon">Odtraněním je nevratné!</Typography>

						<Box className="flex justify-between">
							<ButtonComp
								style="mx-auto mt-8"
								size="medium"
								content={"Zrušit"}
								onClick={() => {
									setIsModalOpened(false);
								}}
							/>
							<ButtonComp
								style="mx-auto mt-8 bg-red-900"
								size="medium"
								content={"Odstranit"}
								secondContent={IconEnum.TRASH}
								secondContentStyle="mr-1 scale-[1.1]"
								onClick={() => {
									handleDeleteSport();
									props.showFirstSection.setState(true);
									setIsModalOpened(false);
								}}
							/>
						</Box>
					</Box>
				}
			/>
		</>
	);
};

export default SportDescriptionAndSettings;
