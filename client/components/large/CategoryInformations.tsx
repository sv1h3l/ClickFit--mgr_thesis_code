import { changeBlacklistReq } from "@/api/change/changeBlacklistReq";
import { changeDescReq } from "@/api/change/changeDescReq";
import { changeHasRepeatabilityReq } from "@/api/change/changeHasRepeatabilityReq";
import { changeLooseEntityReq } from "@/api/change/changeLooseEntityReq";
import { changePriorityPointsReq } from "@/api/change/changePriorityPointsReq";
import { changeRepeatabilityQuantityReq } from "@/api/change/changeRepeatabilityQuantityReq";
import { changeTightConnectionReq } from "@/api/change/changeTightConnectionReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { Category } from "@/api/get/getCategoriesWithExercisesReq";
import { Sport } from "@/api/get/getSportsReq";
import { useAppContext } from "@/utilities/Context";
import { StateAndSet, StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Autocomplete, Box, ClickAwayListener, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import LabelAndValue from "../small/LabelAndValue";
import TextFieldWithIcon from "../small/TextFieldWithIcon";
import Title from "../small/Title";

import { changeCategoryNameReq } from "@/api/change/changeCategoryNameReq";
import CustomModal from "../small/CustomModal";
import { RemarkEntitiesDescription } from "./DiaryAndGraphs";
import GeneralCard from "./GeneralCard";

interface Props {
	selectedSport: StateAndSet<Sport | null>;
	selectedCategory: StateAndSet<Category | null>;

	editing: StateAndSet<boolean>;

	categoriesData: StateAndSetFunction<Category[]>;

	isActiveFirstChildren: StateAndSet<boolean>;
}

const CategoryInformations = (props: Props) => {
	const context = useAppContext();

	//
	//	#region Description
	//
	const [descriptionValue, setDescriptionValue] = useState("");

	useEffect(() => {
		setDescriptionValue(props.selectedCategory.state?.description || "");
	}, [props.selectedCategory.state?.categoryId]);

	const handleChangeCategoryDesc = async () => {
		try {
			const response = await changeDescReq({ sportId: props.selectedSport.state?.sportId || -1, entityId: props.selectedCategory.state?.categoryId || -1, description: descriptionValue, changeExerciseDesc: false });

			if (response.status === 200) {
				props.categoriesData.setState((prev) => prev.map((category) => (category.categoryId === props.selectedCategory.state?.categoryId ? { ...category, description: descriptionValue } : category)));
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	//	#endregion
	//

	//
	//	#region Automatic Plan Creation
	//
	const [relatedCategories, setRelatedCategories] = useState<Category[]>([]);

	useEffect(() => {
		setRelatedCategories(props.categoriesData.state.filter((category) => category.categoryId !== props.selectedCategory.state?.categoryId));
	}, [props.selectedCategory.state?.categoryId]);

	const setNewCategory = (newCategory: Category) => {
		props.categoriesData.setState((prev) => prev.map((category) => (category.categoryId === props.selectedCategory.state?.categoryId ? newCategory : category)));

		props.selectedCategory.setState(newCategory);
	};

	// #region Has Repeatability
	const handleChangeHasRepeatability = async () => {
		const hasRepeatability = !props.selectedCategory.state?.hasRepeatability;

		try {
			const response = await changeHasRepeatabilityReq({ sportId: props.selectedSport.state?.sportId || -1, entityId: props.selectedCategory.state?.categoryId || -1, hasRepeatability: hasRepeatability, entityIsExercise: false });

			if (response.status === 200) {
				const newCategory = {
					...props.selectedCategory.state,
					hasRepeatability: hasRepeatability,
				} as Category;

				setNewCategory(newCategory);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	// #endregion

	// #region Repeatability Quantity
	const handleChangeRepeatabilityQuantity = async (value: string) => {
		const repeatabilityQuantity = Number(value);

		if (isNaN(repeatabilityQuantity)) return;

		try {
			const response = await changeRepeatabilityQuantityReq({ sportId: props.selectedSport.state?.sportId || -1, entityId: props.selectedCategory.state?.categoryId || -1, repeatabilityQuantity, entityIsExercise: false });

			if (response.status === 200) {
				const newCategory = {
					...props.selectedCategory.state,
					repeatabilityQuantity: repeatabilityQuantity,
				} as Category;

				setNewCategory(newCategory);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	// #endregion

	//	#region Loose Connections
	const [looseConnections, setLooseConnections] = useState<Category[]>([]);

	useEffect(() => {
		const newLooseConnections = [] as Category[];
		relatedCategories.map((category) => (props.selectedCategory.state?.looseConnection.includes(category.categoryId) ? newLooseConnections.push(category) : null));
		setLooseConnections(newLooseConnections);
	}, [relatedCategories]);

	const [looseConnectionsOpen, setLooseConnectionsOpen] = useState(false);
	const looseConnectionsAutocompleteRef = useRef(null);
	const looseConnectionInputRef = useRef<HTMLInputElement>(null);
	const [looseMounted, setLooseMounted] = useState(false);

	const [looseInputValue, setLooseInputValue] = useState<string[]>([]);

	useEffect(() => {
		setLooseMounted(false);

		let newRelatedCategories = props.categoriesData.state.filter((category) => category.categoryId !== props.selectedCategory.state?.categoryId);

		let looseInputValues: string[] = [];
		newRelatedCategories.map((category) => (props.selectedCategory.state?.looseConnection.includes(category.categoryId) ? looseInputValues.push(category.categoryName) : null));

		setLooseInputValue(looseInputValues);

		setTimeout(() => {
			setLooseMounted(true);
		}, 0);
	}, [props.selectedCategory.state?.categoryId]);

	useEffect(() => {
		if (!looseMounted) return;

		setTimeout(() => {
			looseConnectionInputRef.current?.focus();
		}, 50);
	}, [looseInputValue]);

	const handleChangeLooseConnections = async (categories: Category[]) => {
		const looseCategoriesIds = categories.map((category) => category.categoryId);

		try {
			const response = await changeLooseEntityReq({ sportId: props.selectedSport.state?.sportId!, entityId: props.selectedCategory.state?.categoryId || -1, entityIsExercise: false, looseEntitiesIds: looseCategoriesIds });

			if (response.status === 200) {
				const newcategory = {
					...props.selectedCategory.state,
					looseConnection: looseCategoriesIds,
				} as Category;

				setNewCategory(newcategory);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	//	#endregion

	//	#region Tight Connection
	const [tightConnection, setTightConnection] = useState<Category | undefined>();

	const [tightConnectionOpen, setTightConnectionOpen] = useState(false);
	const tightConnectionAutocompleteRef = useRef(null);
	const tightConnectionInputRef = useRef<HTMLInputElement>(null);
	const [tightInputValue, setTightInputValue] = useState<string>("");
	const [tightInputShow, setTightInputShow] = useState<string>(tightConnection?.categoryName ?? "");

	useEffect(() => {
		let newRelatedCategories = props.categoriesData.state.filter((category) => category.categoryId !== props.selectedCategory.state?.categoryId);

		const tightcategory = newRelatedCategories.find((category) => category.categoryId === props.selectedCategory.state?.tightConnection);
		setTightConnection(tightcategory);
		setTightInputShow(tightcategory?.categoryName || "");
	}, [props.selectedCategory.state?.categoryId]);

	const handleChangeTightConnection = async (category: Category | undefined) => {
		try {
			const response = await changeTightConnectionReq({
				sportId: props.selectedSport.state?.sportId!,
				entityId: props.selectedCategory.state?.categoryId || -1,
				entityIsExercise: false,
				tightConnectionEntityId: category ? category.categoryId : undefined,
			});

			if (response.status === 200) {
				const newCategory = {
					...props.selectedCategory.state,
					tightConnection: category ? category.categoryId : null,
				} as Category;

				setNewCategory(newCategory);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const getTightConnectionName = () => {
		let tightConnectionName = props.categoriesData.state.find((category) => category.categoryId === props.selectedCategory.state?.tightConnection)?.categoryName;

		return tightConnectionName;
	};
	//	#endregion

	//	#region Priority Points
	const handleChangePriorityPoints = (clickedPriorityPoint: number) => {
		setTimeout(async () => {
			const points: number[] = props.selectedCategory.state?.priorityPoints || [];

			const priorityPoints: number[] = props.selectedCategory.state?.priorityPoints.includes(clickedPriorityPoint)
				? props.selectedCategory.state?.priorityPoints.filter((point) => point !== clickedPriorityPoint)
				: [...points, clickedPriorityPoint];

			try {
				const response = await changePriorityPointsReq({
					sportId: props.selectedSport.state?.sportId!,
					entityId: props.selectedCategory.state?.categoryId || -1,
					entityIsExercise: false,
					priorityPoints: priorityPoints,
				});

				if (response.status === 200) {
					const newcategory = {
						...props.selectedCategory.state,
						priorityPoints: priorityPoints,
					} as Category;

					setNewCategory(newcategory);
				}

				consoleLogPrint(response);
			} catch (error) {
				console.error("Error: ", error);
			}
		}, 100);
	};

	const PriorityPointsButtons = () => {
		const [firstButtonClicked, setFirstButtonClicked] = useState<boolean>(props.selectedCategory.state?.priorityPoints.includes(1) || false);
		const [secondButtonClicked, setSecondButtonClicked] = useState<boolean>(props.selectedCategory.state?.priorityPoints.includes(2) || false);
		const [thirdButtonClicked, setThirdButtonClicked] = useState<boolean>(props.selectedCategory.state?.priorityPoints.includes(3) || false);

		return (
			<Box className="flex gap-6 ml-4 relative">
				<ButtonComp
					externalClicked={{ state: firstButtonClicked, setState: setFirstButtonClicked }}
					size="small"
					disabled={!props.editing.state && !firstButtonClicked}
					onClick={
						props.editing.state
							? () => {
									handleChangePriorityPoints(1);
							  }
							: undefined
					}
					content="1"
				/>

				<ButtonComp
					externalClicked={{ state: secondButtonClicked, setState: setSecondButtonClicked }}
					size="small"
					disabled={!props.editing.state && !secondButtonClicked}
					onClick={
						props.editing.state
							? () => {
									handleChangePriorityPoints(2);
							  }
							: undefined
					}
					content="2"
				/>

				<ButtonComp
					externalClicked={{ state: thirdButtonClicked, setState: setThirdButtonClicked }}
					size="small"
					disabled={!props.editing.state && !thirdButtonClicked}
					onClick={
						props.editing.state
							? () => {
									handleChangePriorityPoints(3);
							  }
							: undefined
					}
					content="3"
				/>
			</Box>
		);
	};

	const ConcreteExample = () => {
		const priorityPoints: number[] = props.selectedCategory.state?.priorityPoints || [];
		let message: string;

		if (priorityPoints.length === 0) {
			message = "Tato kategorie nemá žádné prioritní body, tím pádem nebude použit v automatické tvorbě tréninku.";
		} else if (priorityPoints.length === 3) {
			message = `Tato kategorie má všechny prioritní body, tím pádem se může nacházet na jakékoliv pozici dne.`;
		} else {
			const points = [1, 2].every((point) => priorityPoints.includes(point))
				? "body 1 a 2"
				: [2, 3].every((point) => priorityPoints.includes(point))
				? "body 2 a 3"
				: [1, 3].every((point) => priorityPoints.includes(point))
				? "body 1 a 3"
				: priorityPoints.includes(1)
				? "bod 1"
				: priorityPoints.includes(2)
				? "bod 2"
				: "bod 3";

			const secondPoints = [1, 2].every((point) => priorityPoints.includes(point))
				? "1. a 2."
				: [2, 3].every((point) => priorityPoints.includes(point))
				? "2. a 3."
				: [1, 3].every((point) => priorityPoints.includes(point))
				? "1. a 3."
				: priorityPoints.includes(1)
				? "1."
				: priorityPoints.includes(2)
				? "2."
				: "3.";

			message = `Vybraná kateogrie má prioritní ${points}, tím pádem se může nacházet v ${secondPoints} třetině dne.`;
		}

		return (
			<Box className="flex mt-6">
				<Typography className="mr-2 text-nowrap">Konkrétní příklad</Typography>
				<Typography className="mr-2 opacity-50 font-light">»</Typography>
				<Typography className="font-light">{message}</Typography>
			</Box>
		);
	};

	//	#endregion

	//	#region Blacklist
	const [blacklist, setBlacklist] = useState<Category[]>([]);

	const [blacklistOpen, setBlacklistOpen] = useState(false);
	const blacklistAutocompleteRef = useRef(null);
	const blacklistInputRef = useRef<HTMLInputElement>(null);

	const [blacklistInputValue, setBlacklistInputValue] = useState<string[]>([]);

	const [blacklistMounted, setBlacklistMounted] = useState(false);

	useEffect(() => {
		if (!blacklistMounted) return;

		setTimeout(() => {
			blacklistInputRef.current?.focus();
		}, 50);
	}, [blacklistInputValue]);

	useEffect(() => {
		const newBlacklist = [] as Category[];
		relatedCategories.map((category) => (props.selectedCategory.state?.blacklist.includes(category.categoryId) ? newBlacklist.push(category) : null));
		setBlacklist(newBlacklist);
	}, [relatedCategories]);

	useEffect(() => {
		setBlacklistMounted(false);

		let newRelatedCategories = props.categoriesData.state.filter((category) => category.categoryId !== props.selectedCategory.state?.categoryId);

		let blacklistInputValues: string[] = [];
		newRelatedCategories.map((category) => (props.selectedCategory.state?.blacklist.includes(category.categoryId) ? blacklistInputValues.push(category.categoryName) : null));

		setBlacklistInputValue(blacklistInputValues);

		setTimeout(() => {
			setBlacklistMounted(true);
		}, 0);
	}, [props.selectedCategory.state?.categoryId]);

	const handleChangeBlacklist = async (categories: Category[]) => {
		const blacklistCategoriesIds = categories.map((category) => category.categoryId);

		try {
			const response = await changeBlacklistReq({ sportId: props.selectedSport.state?.sportId!, entityId: props.selectedCategory.state?.categoryId || -1, entityIsExercise: false, blacklistEntitiesIds: blacklistCategoriesIds });

			if (response.status === 200) {
				const newcategory = {
					...props.selectedCategory.state,
					blacklist: blacklistCategoriesIds,
				} as Category;

				setNewCategory(newcategory);

				props.categoriesData.setState((prevCategories) => {
					const selectedId = props.selectedCategory.state?.categoryId || -1;
					const oldCategories = prevCategories;
					const categoryIds = categories.map((category) => category.categoryId);

					const deletedOldBlacklistIds: Category[] = oldCategories.map((category) =>
						category.blacklist.includes(selectedId) ? (!categoryIds.includes(category.categoryId) ? { ...category, blacklist: category.blacklist.filter((blacklist) => blacklist !== selectedId) } : category) : category
					);

					const addedNewBlacklistIds: Category[] = deletedOldBlacklistIds.map((category) =>
						!category.blacklist.includes(selectedId)
							? categoryIds.includes(category.categoryId)
								? {
										...category,
										blacklist: [...category.blacklist, selectedId],
										tightConnection: category.tightConnection === selectedId ? null : category.tightConnection,
										looseConnections: category.looseConnection.filter((loose) => loose !== selectedId),
								  }
								: category
							: category
					);

					return addedNewBlacklistIds;
				});
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	//	#endregion

	// #region Comp

	const AutomaticPlanCreationSettings = () => {
		return (
			<Box className="mt-4">
				<Title title="Údaje ovlivňující automatickou tvorbu" />

				<Box className="space-y-8 mt-3 ml-2">
					<Box className="space-y-2">
						<Typography className="text-lg">Opakovatelnost</Typography>
						<Box className="ml-4">
							<Typography className=" font-light">Určuje, zda a maximálně kolikrát se daná kategorie může v rámci tréninku opakovat.</Typography>
							<Box
								className={`flex  mt-3 h-10
											${context.windowWidth < 560 ? "flex-col gap-1" : "flex-row items-center"}`}>
								<Box className={`flex  gap-2 ${""}`}>
									<ButtonComp
										content={props.selectedCategory.state?.hasRepeatability ? IconEnum.CHECK : IconEnum.CROSS}
										size="small"
										onClick={
											props.editing.state
												? () => {
														handleChangeHasRepeatability();
												  }
												: undefined
										}
										externalClickedVal={props.selectedCategory.state?.hasRepeatability}
									/>
									<Typography>{props.selectedCategory.state?.hasRepeatability ? "Kategorie se může opakovat." : "Kategorie se nesmí opakovat."}</Typography>
								</Box>

								{props.editing.state && props.selectedCategory.state?.hasRepeatability ? (
									<Box className="ml-6 flex items-center">
										<LabelAndValue
											noPaddingTop
											label="Maximální počet opakování"
											showArrow
											disableSelection
											onClick={() => {
												console.log("");
											}}
										/>

										<TextFieldWithIcon
											dontDeleteValue
											tfCenterValueAndPlaceholder
											onlyNumbers
											cantBeZero
											style="w-16"
											icon={IconEnum.CHECK}
											maxLength={2}
											previousValue={props.selectedCategory.state?.repeatabilityQuantity.toString()}
											onClick={(value) => {
												handleChangeRepeatabilityQuantity(value);
											}}
										/>
									</Box>
								) : null}
							</Box>
						</Box>
					</Box>

					<Box className={`space-y-2 ${context.windowWidth < 560 ? "pt-3" : ""}`}>
						<Typography className="text-lg">Volná návaznost</Typography>
						<Box className="ml-4">
							<Typography className=" font-light">Zvyšuje pravděpodobnost, že po této kategorii budou následovat vybrané kategorie.</Typography>
							{!!props.selectedCategory.state?.tightConnection ? (
								<Box className=" mt-5">
									<Typography>Volnou návaznost nelze použít, když je aktivní pevná návaznost.</Typography>
								</Box>
							) : (
								<Box className=" mt-5">
									{props.editing.state ? (
										<Typography>Vybrané kategorie s volnou návazností:</Typography>
									) : props.selectedCategory.state!.looseConnection.length > 0 ? (
										<Typography>Vybrané kategorie s volnou návazností:</Typography>
									) : (
										<Typography>Nejsou vybrány kategorie pro volnou návaznost.</Typography>
									)}

									{props.editing.state ? (
										<ClickAwayListener onClickAway={() => setLooseConnectionsOpen(false)}>
											<Autocomplete
												ref={looseConnectionsAutocompleteRef}
												multiple
												options={relatedCategories.filter((category) => !blacklist.some((blacklist) => blacklist.categoryId === category.categoryId))}
												disableCloseOnSelect
												open={looseConnectionsOpen}
												disableClearable
												isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
												noOptionsText="Žádná vhodná kategorie nenalezena"
												onOpen={() => {
													setBlacklistOpen(false);
													setTightConnectionOpen(false);

													setLooseConnectionsOpen(true);

													setTimeout(() => {
														looseConnectionInputRef.current?.focus();
													}, 0);
												}}
												onClose={() => setLooseConnectionsOpen(false)}
												value={looseConnections}
												onChange={(event, newValue) => {
													setLooseConnections(newValue);
													handleChangeLooseConnections(newValue);

													setLooseInputValue(newValue.map((category) => category.categoryName));
												}}
												getOptionLabel={(option) => option.categoryName}
												renderOption={(props, option, { selected }) => (
													<li
														{...props}
														key={"op-" + option.categoryId}
														className={`px-3 py-1.5 hover:cursor-pointer  flex w-full duration-150 transition-all
         															${context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}
																	${selected && context.bgQuaternaryColor}`}>
														<Typography
															className={`    font-light
																${selected ? "w-2 opacity-50" : "opacity-0"}`}>
															{selected ? "»" : ""}
														</Typography>
														<Typography
															className={`w-full 
																${selected ? "translate-x-2" : ""}`}>
															{option.categoryName}
														</Typography>
													</li>
												)}
												renderTags={(tagValue, getTagProps) =>
													looseInputValue.map((option, index) => (
														<Box
															onClick={() => {
																setLooseConnectionsOpen(true);

																setTimeout(() => {
																	looseConnectionInputRef.current?.focus();
																}, 0);
															}}
															className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center mr-2
																	${context.borderTertiaryColor + context.bgTertiaryColor}`}>
															<Typography className=" text-base bg-transparent w-fit px-1.5 py-0.5">{option}</Typography>
														</Box>
													))
												}
												renderInput={(params) => (
													<Box className="flex items-end min-h-11">
														<TextField
															{...params}
															inputRef={looseConnectionInputRef}
															variant="standard"
															placeholder={looseConnections.length === 0 ? "Vyberte kategorie" : ""}
															sx={{
																"& .MuiInput-underline:after": {
																	borderBottom: "#B4B4B4", // zruší čáru při focusu
																},
															}}
														/>
													</Box>
												)}
												PaperComponent={(props) => (
													<Paper
														{...props}
														className={`text-[#E9E9E9] font-light border-2 rounded-xl mt-1
																${context.bgSecondaryColor} ${context.borderQuaternaryColor}`}
													/>
												)}
											/>
										</ClickAwayListener>
									) : (
										<Box>
											<Box className="flex mt-1 flex-wrap">
												{looseConnections.map((category, index) => (
													<Box
														key={index}
														className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center mr-2
															${context.borderTertiaryColor + context.bgTertiaryColor}`}>
														<Typography className=" text-base bg-transparent w-fit px-1.5 py-0.5">{category.categoryName}</Typography>
													</Box>
												))}
											</Box>
										</Box>
									)}
								</Box>
							)}
						</Box>
					</Box>

					<Box className="space-y-2">
						<Typography className="text-lg">Pevná návaznost</Typography>
						<Box className="ml-4">
							<Typography className=" font-light">
								Zajišťuje, že po této kategorii bude vždy následovat vybraná kategorie. Jestliže je vybrána kategorie pro pevnou návaznost, tak není možné vybírat kategorie pro volnou návaznost. Pokud by přidání vybrané kategorie
								s pevnou navázností bylo přes maximální hranici počtu kategorií, tak se nepřidá.
							</Typography>
							<Box
								className={`flex mt-3 h-10 gap-2 
											${context.windowWidth < 560 ? "flex-col mb-9" : "items-center"}`}>
								{props.editing.state ? (
									<Typography>Vybraná kategorie s pevnou návazností:</Typography>
								) : props.selectedCategory.state?.tightConnection ? (
									<Typography>Vybraná kategorie s pevnou návazností:</Typography>
								) : (
									<Typography>Není vybrána kategorie pro pevnou návaznost.</Typography>
								)}

								{props.selectedCategory.state?.tightConnection ? (
									props.editing.state ? (
										<Box
											onClick={() => {
												setTightConnectionOpen(true);

												setTimeout(() => {
													tightConnectionInputRef.current?.focus();
												}, 0);
											}}
											className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center 
																	${context.borderTertiaryColor + context.bgTertiaryColor}`}>
											<Typography className=" text-base bg-transparent w-fit px-1.5 py-0.5">{getTightConnectionName()}</Typography>
										</Box>
									) : (
										<Box
											className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center 
																	${context.borderTertiaryColor + context.bgTertiaryColor}`}>
											<Typography className=" text-base bg-transparent w-fit px-1.5 py-0.5">{getTightConnectionName()}</Typography>
										</Box>
									)
								) : null}
							</Box>

							{props.editing.state ? (
								<ClickAwayListener onClickAway={() => setTightConnectionOpen(false)}>
									<Autocomplete
										ref={tightConnectionAutocompleteRef}
										options={relatedCategories.filter((ex) => !blacklist.some((b) => b.categoryId === ex.categoryId))}
										disableClearable
										open={tightConnectionOpen} // řízené otevírání
										noOptionsText="Žádná vhodná kategorie nenalezena"
										isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
										onOpen={() => {
											setBlacklistOpen(false);
											setLooseConnectionsOpen(false);
											setTightConnectionOpen(true);
											setTimeout(() => tightConnectionInputRef.current?.focus(), 0);
										}}
										onClose={() => setTightConnectionOpen(false)}
										inputValue={tightInputValue} // řízený text
										onInputChange={(e, newVal) => {
											setTightInputValue(newVal);
											setTimeout(() => tightConnectionInputRef.current?.focus(), 0);
										}}
										clearOnBlur={false} // zamezí vyčištění při blur
										getOptionLabel={(option) => option.categoryName}
										renderOption={(props, option, { selected }) => {
											const handleOptionClick = () => {
												if (tightConnection?.categoryId === option.categoryId) {
													setTightConnection(undefined);
													handleChangeTightConnection(undefined);
												} else {
													setTightConnection(option);
													handleChangeTightConnection(option);
												}
												setTightConnectionOpen(false);
												setTightInputValue("");
												setTightInputShow(tightConnection?.categoryId === option.categoryId ? "" : option.categoryName);
											};
											return (
												<li
													{...props}
													onClick={handleOptionClick}
													key={"op-" + option.categoryId}
													className={`px-3 py-1.5 hover:cursor-pointer flex w-full
													${context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}
													${tightInputShow === option.categoryName && context.bgQuaternaryColor}`}>
													<Typography className={`font-light ${tightInputShow === option.categoryName ? "w-2 opacity-50" : "opacity-0"}`}>{tightInputShow === option.categoryName ? "»" : ""}</Typography>
													<Typography className={`w-full ${tightInputShow === option.categoryName ? "translate-x-2" : ""}`}>{option.categoryName}</Typography>
												</li>
											);
										}}
										renderInput={(params) => (
											<TextField
												{...params}
												inputRef={tightConnectionInputRef}
												variant="standard"
												placeholder={tightInputShow ? "Vyberte jinou kategorii" : "Vyberte kategorii"}
											/>
										)}
										PaperComponent={(props) => (
											<Paper
												{...props}
												className={`text-[#E9E9E9] font-light border-2 rounded-xl mt-1
																${context.bgSecondaryColor} ${context.borderQuaternaryColor}`}
											/>
										)}
									/>
								</ClickAwayListener>
							) : null}
						</Box>
					</Box>

					<Box className="space-y-2">
						<Typography className="text-lg">Prioritní body</Typography>
						<Box className="ml-4">
							<Typography className=" font-light">
								Této kategorii lze přiřadit prioritní body 1, 2 a 3. Tyto body určují, do jaké třetiny daného dne bude kategorie přiřazena. Kategorie může mít přiřazeno více piroritních bodů. Pokud kategorii není přiřazen žádný
								prioritní bod, tak nebude použita v automatické tvorbě tréninku.
							</Typography>

							<Box className="flex mt-6">
								<Typography>Prioritní body</Typography>

								<PriorityPointsButtons />
							</Box>

							<ConcreteExample />
						</Box>
					</Box>

					<Box className="space-y-2">
						<Typography className="text-lg">Blacklist</Typography>
						<Box className="ml-4">
							<Typography className=" font-light">Zvolené kategorie se nebudou v rámci daného dne vyskytovat společně s touto kategorií.</Typography>
							<Box className=" mt-5">
								{props.editing.state ? (
									<Typography>Kategorie zařazené do blacklistu:</Typography>
								) : props.selectedCategory.state!.blacklist.length > 0 ? (
									<Typography>Kategorie zařazené do blacklistu:</Typography>
								) : (
									<Typography>Žádná kategorie není zařazena do blacklistu.</Typography>
								)}

								{props.editing.state ? (
									<ClickAwayListener onClickAway={() => setBlacklistOpen(false)}>
										<Autocomplete
											ref={blacklistAutocompleteRef}
											multiple
											options={relatedCategories.filter((category) => category.categoryId !== tightConnection?.categoryId && !looseConnections.some((loose) => loose.categoryId === category.categoryId))}
											disableCloseOnSelect
											open={blacklistOpen}
											isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
											disableClearable
											noOptionsText="Žádná vhodná kategorie nenalezena"
											onOpen={() => {
												setLooseConnectionsOpen(false);
												setTightConnectionOpen(false);

												setBlacklistOpen(true);

												setTimeout(() => {
													blacklistInputRef.current?.focus();
												}, 0);
											}}
											onClose={() => setBlacklistOpen(false)}
											value={blacklist}
											onChange={(event, newValue) => {
												setBlacklist(newValue);
												handleChangeBlacklist(newValue);

												setBlacklistInputValue(newValue.map((category) => category.categoryName));
											}}
											getOptionLabel={(option) => option.categoryName}
											renderOption={(props, option, { selected }) => (
												<li
													{...props}
													key={"op-" + option.categoryId}
													className={`px-3 py-1.5 hover:cursor-pointer  flex w-full
         															${context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}
																	${selected && context.bgQuaternaryColor}`}>
													<Typography
														className={`    font-light
																${selected ? "w-2 opacity-50" : "opacity-0"}`}>
														{selected ? "»" : ""}
													</Typography>
													<Typography
														className={`w-full 
																${selected ? "translate-x-2" : ""}`}>
														{option.categoryName}
													</Typography>
												</li>
											)}
											renderTags={(tagValue, getTagProps) =>
												blacklistInputValue.map((option, index) => (
													<Box
														key={index}
														onClick={() => {
															setLooseConnectionsOpen(true);

															setTimeout(() => {
																looseConnectionInputRef.current?.focus();
															}, 0);
														}}
														className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center mr-2
																	${context.borderTertiaryColor + context.bgTertiaryColor}`}>
														<Typography className=" text-base bg-transparent w-fit px-1.5 py-0.5">{option}</Typography>
													</Box>
												))
											}
											renderInput={(params) => (
												<Box className="flex items-end min-h-11">
													<TextField
														{...params}
														inputRef={blacklistInputRef}
														variant="standard"
														placeholder={blacklist.length === 0 ? "Vyberte kategorie" : ""}
													/>
												</Box>
											)}
											PaperComponent={(props) => (
												<Paper
													{...props}
													className={`text-[#E9E9E9] font-light border-2 rounded-xl mt-1
																${context.bgSecondaryColor} ${context.borderQuaternaryColor}`}
												/>
											)}
										/>
									</ClickAwayListener>
								) : (
									<Box>
										<Box className="flex mt-1 flex-wrap">
											{blacklist.map((category, index) => (
												<Box
													key={index}
													className={`border-2 w-fit h-fit rounded-xl my-1 flex items-center mr-2
															${context.borderTertiaryColor + context.bgTertiaryColor}`}>
													<Typography className=" text-base bg-transparent w-fit px-1.5 py-0.5">{category.categoryName}</Typography>
												</Box>
											))}
										</Box>
									</Box>
								)}
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		);
	};
	// #endregion

	// #endregion
	//

	//
	//	#region Category Name
	//
	const [nameHelperText, setNameHelperText] = useState("");

	useEffect(() => {
		setNameHelperText("");
	}, [props.editing.state]);

	const handleChangeCategoryName = async (value: string) => {
		try {
			const res = await changeCategoryNameReq({ categoryName: value, sportId: props.selectedSport.state?.sportId!, categoryId: props.selectedCategory.state?.categoryId || -1 });

			if (res.status === 400 || res.status === 409) {
				setNameHelperText(res.message);
			} else if (res.status === 200) {
				const newCategory = {
					...props.selectedCategory.state,
					categoryName: value,
				} as Category;

				setNewCategory(newCategory);
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	//	#endregion
	//

	//
	//	#region Main Comp
	//
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<GeneralCard
				showBackButton={context.isSmallDevice}
				backButtonClick={() => context.setActiveSection(1)}
				showFirstSection={{ state: props.isActiveFirstChildren.state, setState: props.isActiveFirstChildren.setState }}
				secondTitle="Podrobnosti"
				firstTitle="Popis"
				height="h-full"
				secondChildren={
					<Box className="flex flex-col  mt-3">
						<Box className="flex justify-center w-full">
							{context.isSmallDevice ? (
								<ButtonComp
									content={"Úprava podrobností"}
									secondContent={IconEnum.EDIT}
									size="medium"
									style="mb-6"
									secondContentStyle="mr-1"
									externalClicked={{ state: props.editing.state, setState: props.editing.setState }}
									onClick={() => props.editing.setState(!props.editing.state)}
								/>
							) : null}
						</Box>

						{props.editing.state && props.selectedCategory.state?.orderNumber !== 0 ? (
							<Box className=" flex items-start mr-3">
								<LabelAndValue
									label="Název kategorie"
									noPaddingTop
									maxLength={40}
									mainStyle="w-full "
									textFieldValue={props.selectedCategory.state?.categoryName}
									textFieldOnClick={(value) => handleChangeCategoryName(value)}
									icon={IconEnum.CHECK}
									onChangeCond={(value) => {
										if (value === props.selectedCategory.state?.categoryName) {
											setNameHelperText("");
											return false;
										}

										let nameExists = false;

										props.categoriesData.state.map((category) => {
											if (category.categoryName === value) nameExists = true;
										});

										if (nameExists) {
											setNameHelperText("Kategorie s tímto názvem již existuje");
											return false;
										}

										if (value.length > 40) {
											setNameHelperText("Název může mít maximálně 40 znaků");
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
								noPaddingTop
								label="Název kategorie"
								value={props.selectedCategory.state?.categoryName}
							/>
						)}

						{props.selectedSport.state?.hasAutomaticPlanCreation ? <AutomaticPlanCreationSettings /> : <></>}
					</Box>
				}
				firstChildren={
					<Box className="h-full">
						<Box className="mt-3">
							<Box className="flex justify-center w-full">
								{context.isSmallDevice ? (
									<ButtonComp
										content={"Úprava popisu"}
										secondContent={IconEnum.EDIT}
										size="medium"
										style="mb-6"
										secondContentStyle="mr-1"
										externalClicked={{ state: props.editing.state, setState: props.editing.setState }}
										onClick={() => props.editing.setState(!props.editing.state)}
									/>
								) : null}
							</Box>

							{!props.editing.state && descriptionValue.length < 1 ? (
								<Typography className="text-lg font-light ml-4">Pro vybranou kategorii neexistuje popis.</Typography>
							) : props.editing.state ? (
								<Box className="relative">
									<TextField
										className="w-full"
										label="Popis kategorie"
										placeholder=" Popište například obecné informace o kategorii, čím je specifická nebo společné znaky cviků v této kategorii."
										multiline
										minRows={10}
										value={descriptionValue}
										onChange={(e) => setDescriptionValue(e.target.value)}
										onBlur={() => handleChangeCategoryDesc()}
										InputProps={{
											className: "font-light",
										}}
									/>
									<Box className="absolute bottom-2 right-2">
										<ButtonComp
											size="small"
											contentStyle="scale-[1.2]"
											content={IconEnum.QUESTION}
											externalClicked={{ state: isModalOpen, setState: setIsModalOpen }}
											onClick={() => setIsModalOpen(true)}
										/>
									</Box>
								</Box>
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
										{descriptionValue || ""}
									</ReactMarkdown>
								</Typography>
							)}
						</Box>

						<CustomModal
							style="max-w-2xl w-full"
							isOpen={isModalOpen}
							paddingTop
							onClose={() => setIsModalOpen(false)}
							title="Podporované formátovací prvky"
							children={<RemarkEntitiesDescription />}
						/>
					</Box>
				}></GeneralCard>
		</>
	);
	//	#endregion
};

export default CategoryInformations;
