import { changeSportDetailValReq } from "@/api/change/changeSportDetailValReq";
import { changeUserHealthReq } from "@/api/change/changeUserHealthReq";
import { createSportDetailLabReq } from "@/api/create/createSportDetailLabReq";
import { deleteSportDetailLabReq } from "@/api/delete/deleteSportDetailLabReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { User } from "@/api/get/getAllUserAtrsReq";
import { Sport } from "@/api/get/getSportsReq";
import { moveSportDetailLabelReq } from "@/api/move/moveSportDetailLabelReq";
import { useAppContext } from "@/utilities/Context";
import { StateAndSet } from "@/utilities/generalInterfaces";
import { Box, FormControl, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import CustomModal from "../small/CustomModal";
import LabelAndValue from "../small/LabelAndValue";
import TextFieldWithIcon from "../small/TextFieldWithIcon";
import Title from "../small/Title";
import { RemarkEntitiesDescription } from "./DiaryAndGraphs";
import GeneralCard from "./GeneralCard";
import { SportDifficulty } from "./SportDescriptionAndSettings";

export interface SportDetailLabAndVal {
	sportDetailLabId: number;
	sportDetailValId: number;

	label: string;
	value: string;
	orderNumber: number;
}

interface Props {
	sportDetails: { sportId: number; sportName: string; sportDetails: SportDetailLabAndVal[] }[];
	sportDifficulties: { sportId: number; sportDifficulties: SportDifficulty[] }[];
	sportsData: Sport[];
	user: User;

	cannotEdit?: boolean;

	editing: StateAndSet<boolean>;
}

const AllSportsAndHealthData = (props: Props) => {
	const context = useAppContext();

	const [sportDetailLabsAndVals, setSportDetailLabsAndVals] = useState<{ sportId: number; sportName: string; sportDetails: SportDetailLabAndVal[] }[]>(props.sportDetails);
	const [sportDifficulties, setSportDifficulties] = useState<{ sportId: number; sportDifficulties: SportDifficulty[] }[]>(props.sportDifficulties);
	const [sportsData, setSportsData] = useState<Sport[]>(props.sportsData);

	const [localHealth, setLocalHealth] = useState<string>(props.user.health || "");

	const handleChangeUserHealth = async () => {
		try {
			const response = await changeUserHealthReq({ health: localHealth });

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const moveSportDetailLabel = async (sportId: number, reorderSportDetailLabels: { sportDetailLabId: number; orderNumber: number }[]) => {
		try {
			const response = await moveSportDetailLabelReq({ sportId, reorderSportDetailLabels });

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleMoveSportDetailLabel = (sportId: number, orderNumber: number, direction: "up" | "down") => {
		if (direction === "up" && orderNumber === 1) return;
		else if (direction === "down" && orderNumber === sportDetailLabsAndVals.length) return;

		let sportDetailSwap: SportDetailLabAndVal;
		let reorderSportDetailLabels: { sportDetailLabId: number; orderNumber: number }[] = [];

		const newDetails = sportDetailLabsAndVals.map((detail) => {
			if (detail.sportId === sportId) {
				return {
					...detail,
					sportDetails: detail.sportDetails
						.map((label) => {
							if ((direction === "up" && label.orderNumber === orderNumber) || (label.orderNumber === orderNumber + 1 && direction === "down")) {
								reorderSportDetailLabels.push({ sportDetailLabId: label.sportDetailLabId, orderNumber: label.orderNumber - 1 });
								reorderSportDetailLabels.push({ sportDetailLabId: sportDetailSwap.sportDetailLabId, orderNumber: sportDetailSwap.orderNumber });

								return { ...label, orderNumber: label.orderNumber - 1 };
							} else if ((direction === "down" && label.orderNumber === orderNumber) || (label.orderNumber === orderNumber - 1 && direction === "up")) {
								sportDetailSwap = { ...label, orderNumber: label.orderNumber + 1 };
								return { ...label, orderNumber: label.orderNumber + 1 };
							} else {
								return label;
							}
						})
						.sort((a, b) => a.orderNumber - b.orderNumber),
				};
			}

			return detail;
		});

		setSportDetailLabsAndVals(newDetails);

		moveSportDetailLabel(sportId, reorderSportDetailLabels);

		return;
	};

	const deleteSportDetailLab = async (sportId: number, sportDetailLabId: number, reorderSportDetailLabs: { sportDetailLabId: number; orderNumber: number }[]) => {
		try {
			const response = await deleteSportDetailLabReq({ sportId, sportDetailLabId, reorderSportDetailLabs });

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleDeleteSportDetailLab = (sportId: number, sportDetailLabId: number, orderNumber: number) => {
		let reorderSportDetailLabels: { sportDetailLabId: number; orderNumber: number }[] = [];

		const updatedSportDetails = sportDetailLabsAndVals.map((detail) => {
			if (detail.sportId === sportId) {
				const updatedLabsAndVals = detail.sportDetails
					.filter((label) => label.orderNumber !== orderNumber)
					.map((label) => {
						if (label.orderNumber > orderNumber) {
							const higherDetails = { ...label, orderNumber: label.orderNumber - 1 };

							reorderSportDetailLabels.push({ sportDetailLabId: higherDetails.sportDetailLabId, orderNumber: higherDetails.orderNumber });

							return higherDetails;
						} else return label;
					});

				return { ...detail, sportDetails: updatedLabsAndVals };
			} else return detail;
		});

		setSportDetailLabsAndVals(updatedSportDetails);

		deleteSportDetailLab(sportId, sportDetailLabId, reorderSportDetailLabels);

		return;
	};

	const handleCreateSportDetailLab = async (sportDetailLab: string, sportId: number) => {
		const orderNumber = sportDetailLabsAndVals.find((detail) => detail.sportId === sportId)?.sportDetails.length! + 1;

		try {
			const response = await createSportDetailLabReq({ sportId, sportDetailLab, orderNumber });

			if (response.status === 200) {
				const newSportDetailLab = {
					sportDetailLabId: response.data?.sportDetailLabId!,
					sportDetailValId: response.data?.sportDetailValId!,
					label: sportDetailLab,
					value: "",
					orderNumber: orderNumber,
				} as SportDetailLabAndVal;

				setSportDetailLabsAndVals((prevDetails) => prevDetails.map((sportDetail) => (sportDetail.sportId === sportId ? { ...sportDetail, sportDetails: [...sportDetail.sportDetails, newSportDetailLab] } : sportDetail)));
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	/*const MoveAndDeleteButtons = ({ sportId, sportDetailLabId, orderNumber }: { sportId: number; sportDetailLabId: number; orderNumber: number }) => {
		const sport = sportDetailLabsAndVals.find((sport) => sportId === sport.sportId);

		const disableUpArrow = orderNumber === 1;
		const disableDownArrow = orderNumber == sport?.sportDetails.length;

		return (
			<Box className="ml-auto flex relative -mb-1">
				<Button
					disabled={disableUpArrow}
					onClick={() => handleMoveSportDetailLabel(sportId, orderNumber, "up")}
					size="small"
					className={`w-8 h-8 p-1 min-w-8 ml-3
								${disableUpArrow && "opacity-30"}`}>
					<ArrowUpward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					disabled={disableDownArrow}
					onClick={() => handleMoveSportDetailLabel(sportId, orderNumber, "down")}
					size="small"
					className={`w-8 h-8 p-1 min-w-8
								${disableDownArrow && "opacity-30"}`}>
					<ArrowDownward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					onClick={() => handleDeleteSportDetailLab(sportId, sportDetailLabId, orderNumber)}
					size="small"
					className={`w-8 h-8 p-1 min-w-8 ml-3`}>
					<CloseIcon
						className="text-red-400"
						fontSize="small"
					/>
				</Button>
			</Box>
		);
	};*/

	const MoveAndDeleteButtons = ({ sportId, sportDetailLabId, orderNumber }: { sportId: number; sportDetailLabId: number; orderNumber: number }) => {
		const sport = sportDetailLabsAndVals.find((sport) => sportId === sport.sportId);

		const disableUpArrow = orderNumber === 8;
		const disableDownArrow = orderNumber === sport?.sportDetails.length;

		return (
			<Box className="ml-auto flex gap-2">
				<ButtonComp
					contentStyle="-rotate-90"
					content={IconEnum.ARROW}
					justClick
					dontChangeOutline
					size="small"
					disabled={disableUpArrow}
					onClick={() =>
						setTimeout(() => {
							handleMoveSportDetailLabel(sportId, orderNumber, "up");
						}, 100)
					}
				/>
				<ButtonComp
					contentStyle="rotate-90"
					content={IconEnum.ARROW}
					justClick
					dontChangeOutline
					size="small"
					disabled={disableDownArrow}
					onClick={() =>
						setTimeout(() => {
							handleMoveSportDetailLabel(sportId, orderNumber, "down");
						}, 100)
					}
				/>
				<ButtonComp
					style="ml-2.5"
					content={IconEnum.CROSS}
					justClick
					dontChangeOutline
					size="small"
					onClick={() =>
						setTimeout(() => {
							handleDeleteSportDetailLab(sportId, sportDetailLabId, orderNumber);
						}, 100)
					}
				/>
			</Box>
		);
	};

	const handleChangeSportDetailVal = async (sportDetailVal: string, sportId: number, sportDetailValId: number) => {
		try {
			const response = await changeSportDetailValReq({ sportId, sportDetailVal, sportDetailValId });

			if (response.status === 200) {
				setSportDetailLabsAndVals((prevDetails) =>
					prevDetails.map((detail) => {
						if (detail.sportId === sportId) {
							return {
								...detail,
								sportDetails: detail.sportDetails.map((labAndVal) => (labAndVal.sportDetailValId === sportDetailValId ? { ...labAndVal, value: sportDetailVal } : labAndVal)),
							};
						}

						return detail;
					})
				);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	//
	//	#region Automatic Creation Details
	//
	interface AutomaticCreationDetailsProps {
		labAndVal: SportDetailLabAndVal;
		sportId: number;
	}

	const SelectComp = (localProps: AutomaticCreationDetailsProps) => {
		const [selectedItem, setSelectedItem] = useState<string>(localProps.labAndVal.value);
		const [open, setOpen] = useState(false);

		const handleOpen = () => {
			setOpen(true);
		};

		const handleClose = () => {
			setOpen(false);
		};

		const handleChange = (event: SelectChangeEvent<string>) => {
			const value = event.target.value;
			setSelectedItem(value);

			handleChangeSportDetailVal(value, localProps.sportId, localProps.labAndVal.sportDetailValId);

			handleClose();
		};

		let selectItems = sportDifficulties.find((sport) => sport.sportId === localProps.sportId)?.sportDifficulties.map((difficulty) => difficulty.difficultyName) || [];

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
					value={selectedItem || ""}
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
							<Typography sx={{ opacity: 0.95 }}>{value}</Typography>
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
					{selectItems.map((item, index) => (
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
							key={item}
							value={item}
							className={`px-3 py-1.5  hover:cursor-pointer transition-colors duration-150 w-full flex justify-center
								${context.bgSecondaryColor + context.bgHoverTertiaryColor}`}>
							<Typography sx={{ opacity: 0.95 }}>{item}</Typography>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	};

	const AutomaticCreationDetails = (localProps: AutomaticCreationDetailsProps) => {
		const LocalLabAndValVisual = ({ labAndVal }: { labAndVal: SportDetailLabAndVal }) => {
			return (
				<Box className="flex gap-3  ">
					<Typography className={`font-light text-nowrap 
											${labAndVal.orderNumber % 2 !== 0 && context.windowWidth < 540? "ml-1" : ""}`}>{labAndVal.orderNumber % 2 !== 0 ? "Minimální" : "Maximální"} počet</Typography>
					<Typography className={`opacity-50 font-light text-nowrap`}>»</Typography>

					{props.editing.state ? (
						<TextFieldWithIcon
							onlyNumbers
							cantBeZero
							previousValue={labAndVal!.value}
							maxLength={3}
							icon={IconEnum.CHECK}
							dontDeleteValue
							style="w-[4.5rem]"
							tfCenterValueAndPlaceholder
							maxValue={labAndVal!.orderNumber < 3 ? 14 : labAndVal!.orderNumber < 5 ? 20 : 30}
							onClick={async (value) => {
								try {
									await handleChangeSportDetailVal(value, localProps.sportId, labAndVal!.sportDetailValId);

									const pre = [1, 3, 5].includes(labAndVal!.orderNumber);
									setSportDetailLabsAndVals((prevDetails) =>
										prevDetails.map((detail) =>
											detail.sportId === localProps.sportId
												? {
														...detail,
														sportDetails: detail.sportDetails.map((mapLabAndVal) => {
															if (mapLabAndVal.orderNumber + (pre ? -1 : 1) === labAndVal!.orderNumber) {
																const newValue = pre ? (Number(mapLabAndVal.value) < Number(value) ? value : mapLabAndVal.value) : Number(mapLabAndVal.value) > Number(value) ? value : mapLabAndVal.value;

																if (newValue !== mapLabAndVal.value) {
																	const newLabAndVal = { ...mapLabAndVal, value: newValue };
																	handleChangeSportDetailVal(value, localProps.sportId, newLabAndVal.sportDetailValId);

																	return newLabAndVal;
																} else return mapLabAndVal;
															} else return mapLabAndVal;
														}),
												  }
												: detail
										)
									);
								} catch (error) {
									console.error("Error: ", error);
								}
							}}
						/>
					) : (
						<Typography className={`w-[4.5rem]`}>{labAndVal.value}</Typography>
					)}
				</Box>
			);
		};

		if (localProps.labAndVal.orderNumber % 2 !== 0) {
			return;
		}

		return (
			<Box className={`w-full pl-2 ${localProps.labAndVal.orderNumber === 2 ? "pb-4 pt-2" : "py-4"}`}>
				<Typography className="">
					{localProps.labAndVal.orderNumber === 2
						? "Počet tréninkových dní"
						: localProps.labAndVal.orderNumber === 4
						? "Počet kategorií pro jednotlivé dny"
						: localProps.labAndVal.orderNumber === 6
						? sportsData.find((sport) => sport.sportId === localProps.sportId)?.hasCategories
							? "Počet cviků pro jednotlivé kategorie"
							: "Počet cviků pro jednotlivé dny"
						: ""}
				</Typography>

				<Box className={`flex pt-3 pl-4 h-7  gap-20
								${context.windowWidth < 540 ? "flex-col gap-3 mb-9 items-start" : "flex-row items-center"}`}>
					<LocalLabAndValVisual
						labAndVal={sportDetailLabsAndVals.find((detail) => detail.sportId === localProps.sportId)?.sportDetails.find((labAndVal) => labAndVal.orderNumber === localProps.labAndVal.orderNumber - 1) || localProps.labAndVal}
					/>
					<LocalLabAndValVisual labAndVal={localProps.labAndVal} />
				</Box>

				{props.editing.state && localProps.labAndVal.orderNumber === 6 ? (
					<Box className={`mt-5 flex ${context.windowWidth < 540 ? "pt-5" : ""}`}>
						<Typography className={`opacity-60 font-light   mr-2`}>*</Typography>
						<Typography
							className={`opacity-60 font-light   mr-2
											`}>
							Počty ovlivňují automatickou tvorbu, pokud to povaha sportu dovoluje.
						</Typography>
					</Box>
				) : null}
			</Box>
		);
	};
	//	#endregion
	//

	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<GeneralCard
			height="h-full"
			showBackButton={context.isSmallDevice}
			backButtonClick={() => context.setActiveSection(1)}
			firstTitle={context.windowWidth < 485 ? "Sport" : "Sportovní údaje"}
			firstChildren={
				<Box className=" h-full ml-2 ">
					<Box className="flex justify-center w-full">
						{context.isSmallDevice && !props.cannotEdit ? (
							<ButtonComp
								content={"Úprava sportovních údajů"}
								secondContent={IconEnum.EDIT}
								size="medium"
								style="mb-3 mt-3"
								secondContentStyle="mr-1"
								externalClicked={{ state: props.editing.state, setState: props.editing.setState }}
								onClick={() => props.editing.setState(!props.editing.state)}
							/>
						) : null}
					</Box>

					{sportDetailLabsAndVals.map(
						(sportDetail, index) =>
							(sportDetail.sportDetails.length > 9 ||
								sportsData.find((sport) => sport.sportId === sportDetail.sportId)?.hasDifficulties ||
								sportsData.find((sport) => sport.sportId === sportDetail.sportId)?.hasAutomaticPlanCreation ||
								(props.editing.state && sportsData.find((sport) => sport.sportId === sportDetail.sportId)?.userId === props.user.userId)) && (
								<Box key={index}>
									<Title
										title={sportDetail.sportName}
										smallPaddingTop={index == 0}
									/>
									{sportDetail.sportDetails.map((labAndVal, index) => {
										return (
											<Box
												className="ml-2"
												key={index}>
												{labAndVal.orderNumber > 7 ? (
													<Box className={`flex py-2
														${context.windowWidth < 450 ? "flex-col gap-2 mb-3" : "flex-row"}`}>
														<LabelAndValue
															noPaddingTop
															mainStyle={`w-full  mr-5`}
															label={labAndVal.label}
															textFieldValue={labAndVal.value}
															value={labAndVal.value}
															notFilledIn={!labAndVal.value}
															textFieldOnClick={props.editing.state ? (value) => handleChangeSportDetailVal(value, sportDetail.sportId, labAndVal.sportDetailValId) : undefined}
															icon={IconEnum.CHECK}
														/>

														{props.editing.state && sportsData.find((sport) => sport.sportId === sportDetail.sportId)?.userId === props.user.userId ? (
															<MoveAndDeleteButtons
																sportDetailLabId={labAndVal.sportDetailLabId}
																sportId={sportDetail.sportId}
																orderNumber={labAndVal.orderNumber}
															/>
														) : null}
													</Box>
												) : labAndVal.orderNumber === 7 ? (
													!sportsData.find((sport) => sport.sportId === sportDetail.sportId)?.hasDifficulties ? null : (
														<Box className={` mb-1.5 ${sportsData.find((sport) => sport.sportId === sportDetail.sportId)?.hasAutomaticPlanCreation ? "mt-4" : "mt-1"} ${context.windowWidth < 450 ? "mb-4": ""}`}>
															<Box className={`flex  pl-2 h-7 items-center py-4`}>
																<Typography className="font-light text-nowrap ">{labAndVal.label}</Typography>
																<Typography className={`opacity-50 font-light text-nowrap ml-3 mr-2`}>»</Typography>
																{props.editing.state ? (
																	<SelectComp
																		sportId={sportDetail.sportId}
																		labAndVal={labAndVal}
																	/>
																) : (
																	<Typography className="">{labAndVal.value}</Typography>
																)}
															</Box>
															{props.editing.state ? (
																<Box className="flex mt-1">
																	<Typography className={`opacity-60 font-light  ml-2 mr-2`}>*</Typography>

																	<Box>
																		<Typography className={`opacity-60 font-light   mr-2`}>Obtížnost cviků ovlivňuje, jaké cviky mohou být použity během tvorby.</Typography>
																		<Typography className={`opacity-60 font-light   mr-2`}>Při volbě nižší obtížnosti nelze použít cviky vyšší obtížnosti.</Typography>
																		<Typography className={`opacity-60 font-light   mr-2 mb-6`}>Při volbě vyšší obtížnosti je možné použít i cviky nižší obtížnosti.</Typography>
																	</Box>
																</Box>
															) : null}
														</Box>
													)
												) : [3, 4].includes(labAndVal.orderNumber) && !sportsData.find((sport) => sport.sportId === sportDetail.sportId)?.hasCategories ? null : sportsData.find(
														(sport) => sport.sportId == sportDetail.sportId
												  )?.hasAutomaticPlanCreation ? (
													<AutomaticCreationDetails
														sportId={sportDetail.sportId}
														labAndVal={labAndVal}
													/>
												) : null}
											</Box>
										);
									})}

									{props.editing.state && sportsData.find((sport) => sport.sportId === sportDetail.sportId)?.userId === props.user.userId ? (
										<TextFieldWithIcon
											disableSaveAnimation
											placeHolder="Přidat sportovní údaj"
											style="w-full pr-2 ml-2 pt-2 "
											onClick={(value) => handleCreateSportDetailLab(value, sportDetail.sportId)}
										/>
									) : null}
								</Box>
							)
					)}
				</Box>
			}
			secondTitle={context.windowWidth < 485 ? "Zdraví" : "Zdravotní údaje"}
			secondChildren={
				<Box className="mt-3">
					<Box className="flex justify-center w-full">
						{context.isSmallDevice && !props.cannotEdit ? (
							<ButtonComp
								content={"Úprava zdravotních údajů"}
								secondContent={IconEnum.EDIT}
								size="medium"
								style="mb-6"
								secondContentStyle="mr-1"
								externalClicked={{ state: props.editing.state, setState: props.editing.setState }}
								onClick={() => props.editing.setState(!props.editing.state)}
							/>
						) : null}
					</Box>

					{props.editing.state ? (
						<Box className="relative">
							<TextField
								className="w-full"
								label="Zdravotní údaje"
								placeholder=" Zde je vhodné zaznamenat například omezení ovlivňující pohyb, absolvované operace či jiná relevantní zdravotní sdělení."
								multiline
								minRows={20}
								value={localHealth}
								onChange={(e) => setLocalHealth(e.target.value)}
								onBlur={() => handleChangeUserHealth()}
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
					) : localHealth.length < 1 ? (
						<Typography className="text-lg font-light ml-4">Zdravotní údaje nejsou zaznamenány.</Typography>
					) : (
						<span className="react-markdown break-words font-light mb-6">
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
								{localHealth || ""}
							</ReactMarkdown>
						</span>
					)}

					<CustomModal
						style="max-w-2xl w-full"
						isOpen={isModalOpen}
						paddingTop
						onClose={() => setIsModalOpen(false)}
						title="Podporované formátovací prvky"
						children={<RemarkEntitiesDescription />}
					/>
				</Box>
			}
		/>
	);
};

export default AllSportsAndHealthData;
