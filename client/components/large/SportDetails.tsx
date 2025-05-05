import { changeSportDetailValReq } from "@/api/change/changeSportDetailValReq";
import { createSportDetailLabReq } from "@/api/create/createSportDetailLabReq";
import { deleteSportDetailLabReq } from "@/api/delete/deleteSportDetailLabReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { getDifficultiesReq } from "@/api/get/getDifficultiesReq";
import { getSportDetailLabsAndValsReq } from "@/api/get/getSportDetailLabsAndValsReq";
import { Sport } from "@/api/get/getSportsReq";
import { moveSportDetailLabelReq } from "@/api/move/moveSportDetailLabelReq";
import { StateAndSet } from "@/utilities/generalInterfaces";
import { Box, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import LabelAndValue from "../small/LabelAndValue";
import TextFieldWithIcon from "../small/TextFieldWithIcon";
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
	selectedSport: StateAndSet<Sport | null>;
}

const Sports = (props: Props) => {
	const [sportDetailLabsAndVals, setSportDetailLabsAndVals] = useState<SportDetailLabAndVal[]>([]);
	const [sportDifficulties, setSportDifficulties] = useState<SportDifficulty[]>([]);

	const [editing, setEditing] = useState<boolean>(false);

	useEffect(() => {
		if (props.selectedSport.state) {
			getSportDetailLabs(props.selectedSport.state.sportId);

			if (props.selectedSport.state.hasDifficulties) getSportDifficulties(props.selectedSport.state.sportId);
		}
	}, [props.selectedSport.state]);

	const getSportDetailLabs = async (sportId: number) => {
		try {
			const response = await getSportDetailLabsAndValsReq({ sportId });

			if (response.status === 200) {
				setSportDetailLabsAndVals(response.data ?? []);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const getSportDifficulties = async (sportId: number) => {
		try {
			const response = await getDifficultiesReq({ sportId });

			if (response.status === 200) {
				setSportDifficulties(response.data ?? []);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const moveSportDetailLabel = async (reorderSportDetailLabels: { sportDetailLabId: number; orderNumber: number }[]) => {
		try {
			const response = await moveSportDetailLabelReq({ sportId: props.selectedSport.state?.sportId!, reorderSportDetailLabels });

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleMoveSportDetailLabel = (orderNumber: number, direction: "up" | "down") => {
		if (direction === "up" && orderNumber === 1) return;
		else if (direction === "down" && orderNumber === sportDetailLabsAndVals.length) return;

		let updatedSportDetails: SportDetailLabAndVal[] = [];
		let sportDetailSwap: SportDetailLabAndVal;
		let reorderSportDetailLabels: { sportDetailLabId: number; orderNumber: number }[] = [];

		sportDetailLabsAndVals.map((label) => {
			if ((direction === "up" && label.orderNumber === orderNumber) || (label.orderNumber === orderNumber + 1 && direction === "down")) {
				reorderSportDetailLabels.push({ sportDetailLabId: label.sportDetailLabId, orderNumber: label.orderNumber - 1 });
				reorderSportDetailLabels.push({ sportDetailLabId: sportDetailSwap.sportDetailLabId, orderNumber: sportDetailSwap.orderNumber });

				updatedSportDetails.push({ ...label, orderNumber: label.orderNumber - 1 });
				updatedSportDetails.push(sportDetailSwap);
			} else if ((direction === "down" && label.orderNumber === orderNumber) || (label.orderNumber === orderNumber - 1 && direction === "up")) {
				sportDetailSwap = { ...label, orderNumber: label.orderNumber + 1 };
			} else {
				updatedSportDetails.push(label);
			}
		});

		setSportDetailLabsAndVals(updatedSportDetails);

		moveSportDetailLabel(reorderSportDetailLabels);

		return;
	};

	const deleteSportDetailLab = async (sportDetailLabId: number, reorderSportDetailLabs: { sportDetailLabId: number; orderNumber: number }[]) => {
		try {
			const response = await deleteSportDetailLabReq({ sportId: props.selectedSport.state?.sportId!, sportDetailLabId, reorderSportDetailLabs });

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleDeleteSportDetailLab = (sportDetailLabId: number, orderNumber: number) => {
		let reorderSportDetailLabels: { sportDetailLabId: number; orderNumber: number }[] = [];

		const updatedExerciseInformations = sportDetailLabsAndVals
			.filter((label) => label.orderNumber !== orderNumber)
			.map((label) => {
				if (label.orderNumber > orderNumber) {
					const updatedExerciseInformation = { ...label, orderNumber: label.orderNumber - 1 };

					reorderSportDetailLabels.push({ sportDetailLabId: updatedExerciseInformation.sportDetailLabId, orderNumber: updatedExerciseInformation.orderNumber });

					return updatedExerciseInformation;
				}
				return label;
			});

		setSportDetailLabsAndVals(updatedExerciseInformations);

		deleteSportDetailLab(sportDetailLabId, reorderSportDetailLabels);

		return;
	};

	const handleCreateSportDetailLab = async (sportDetailLab: string) => {
		const orderNumber = sportDetailLabsAndVals.length + 1;

		try {
			const response = await createSportDetailLabReq({ sportId: props.selectedSport.state?.sportId!, sportDetailLab, orderNumber });

			if (response.status === 200) {
				const newSportDetailLab = {
					sportDetailLabId: response.data?.sportDetailLabId!,
					sportDetailValId: response.data?.sportDetailValId!,
					label: sportDetailLab,
					value: "",
					orderNumber: orderNumber,
				} as SportDetailLabAndVal;

				setSportDetailLabsAndVals([...sportDetailLabsAndVals, newSportDetailLab]);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const MoveAndDeleteButtons = ({ sportDetailLabId, orderNumber }: { sportDetailLabId: number; orderNumber: number }) => {
		const disableUpArrow = orderNumber === 4;
		const disableDownArrow = orderNumber === sportDetailLabsAndVals.length;

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
							handleMoveSportDetailLabel(orderNumber, "up");
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
							handleMoveSportDetailLabel(orderNumber, "down");
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
							handleDeleteSportDetailLab(sportDetailLabId, orderNumber);
						}, 100)
					}
				/>
			</Box>
		);
	};

	const handleChangeSportDetailVal = async (sportDetailVal: string, sportDetailValId: number) => {
		try {
			const response = await changeSportDetailValReq({ sportId: props.selectedSport.state?.sportId!, sportDetailVal, sportDetailValId });

			if (response.status === 200) {
				setSportDetailLabsAndVals((prevDetails) =>
					prevDetails.map((detail) => {
						if (detail.sportDetailValId === sportDetailValId) {
							return { ...detail, value: sportDetailVal };
						} else {
							return detail;
						}
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

			handleChangeSportDetailVal(value, localProps.labAndVal.sportDetailValId);

			handleClose();
		};

		let selectItems = sportDifficulties.map((difficulty) => difficulty.difficultyName);

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
								marginTop: "-0.25rem",
								marginLeft: "0.1rem",
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
							key={item}
							value={item}
							sx={{ opacity: 0.95 }}
							className={`py-1.5 hover:bg-[#2a2a2a] hover:cursor-pointer transition-colors duration-150 px-3 w-full ${localProps.labAndVal.orderNumber === 1 && "flex justify-center"} `}>
							<Typography sx={{ opacity: 0.95 }}>{item}</Typography>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	};

	const AutomaticCreationDetails = (localProps: AutomaticCreationDetailsProps) => {
		return localProps.labAndVal.orderNumber === 7 && !props.selectedSport.state?.hasDifficulties ? null : (
			<Box className={`flex  pl-2 h-7 items-center  ${localProps.labAndVal.orderNumber === 7 ? "gap-2" : "gap-3"}`}>
				<Typography className="font-light text-nowrap">
					{props.selectedSport.state?.hasCategories
						? localProps.labAndVal.label
						: localProps.labAndVal.orderNumber === 5
						? "Minimální počet cviků pro jednotlivé dny"
						: localProps.labAndVal.orderNumber === 6
						? "Maximální počet cviků pro jednotlivé dny"
						: localProps.labAndVal.label}
				</Typography>
				{localProps.labAndVal.orderNumber !== 7 ? <Typography className={`opacity-50 font-light text-nowrap`}>»</Typography> : null}

				{localProps.labAndVal.orderNumber === 7 ? (
					<SelectComp labAndVal={localProps.labAndVal} />
				) : props.selectedSport.state?.hasAutomaticPlanCreation ? (
					<TextFieldWithIcon
						onlyNumbers
						cantBeZero
						previousValue={localProps.labAndVal.value}
						maxLength={3}
						icon={IconEnum.CHECK}
						dontDeleteValue
						style="w-[4.5rem]"
						tfCenterValueAndPlaceholder
						maxValue={localProps.labAndVal.orderNumber < 3 ? 14 : localProps.labAndVal.orderNumber < 5 ? 20 : 30}
						onClick={async (value) => {
							try {
								await handleChangeSportDetailVal(value, localProps.labAndVal.sportDetailValId);

								const pre = [1, 3, 5].includes(localProps.labAndVal.orderNumber);
								setSportDetailLabsAndVals((prevDetails) =>
									prevDetails.map((detail) => {
										if (detail.orderNumber + (pre ? -1 : 1) === localProps.labAndVal.orderNumber) {
											const newValue = pre ? (Number(detail.value) < Number(value) ? value : detail.value) : Number(detail.value) > Number(value) ? value : detail.value;

											if (newValue !== detail.value) {
												const newDetail = { ...detail, value: newValue };
												handleChangeSportDetailVal(value, newDetail.sportDetailValId);

												return newDetail;
											} else return detail;
										} else return detail;
									})
								);
							} catch (error) {
								console.error("Error: ", error);
							}
						}}
					/>
				) : null}
			</Box>
		);
	};
	//	#endregion
	//

	return (
		<GeneralCard
			disabled={!props.selectedSport.state}
			height="h-full"
			firstTitle="Sportovní údaje"
			firstSideContent={
				!!props.selectedSport.state
					? [
							<ButtonComp
								style=" ml-3"
								size="medium"
								content={IconEnum.EDIT}
								externalClicked={{ state: editing, setState: setEditing }}
								onClick={() => setEditing(!editing)}
							/>,
					  ]
					: []
			}
			removeJustifyBetween
			firstChildren={
				<Box className=" h-full ">
					{editing
						? sportDetailLabsAndVals.map((labAndVal, index) => {
								return (
									<Box
										className={`flex  ${[3, 4].includes(labAndVal.orderNumber) && !props.selectedSport.state?.hasCategories ? "" : "py-2"}`}
										key={index}>
										{labAndVal.orderNumber > 7 ? (
											<>
												<LabelAndValue
													noPaddingTop
													mainStyle={`w-full ${labAndVal.orderNumber < 4 ? "mr-[7.35rem]" : "mr-5"}`}
													label={labAndVal.label}
													textFieldValue={labAndVal.value}
													textFieldOnClick={(value) => handleChangeSportDetailVal(value, labAndVal.sportDetailValId)}
													icon={IconEnum.CHECK}
												/>

												<MoveAndDeleteButtons
													sportDetailLabId={labAndVal.sportDetailLabId}
													orderNumber={labAndVal.orderNumber}
												/>
											</>
										) : [3, 4].includes(labAndVal.orderNumber) && !props.selectedSport.state?.hasCategories ? null : (
											<AutomaticCreationDetails labAndVal={labAndVal} />
										)}
									</Box>
								);
						  })
						: sportDetailLabsAndVals.map((labAndVal, index) => {
								return props.selectedSport.state?.hasCategories || ![3, 4].includes(labAndVal.orderNumber) ? (
									<Box className={`py-2 ${index === sportDetailLabsAndVals.length - 1 && "pb-12"}`}>
										<LabelAndValue
											key={index}
											noPaddingTop
											label={
												props.selectedSport.state?.hasCategories
													? labAndVal.label
													: labAndVal.orderNumber === 5
													? "Minimální počet cviků pro jednotlivé dny"
													: labAndVal.orderNumber === 6
													? "Maximální počet cviků pro jednotlivé dny"
													: labAndVal.label
											}
											value={labAndVal.value}
											notFilledIn={!labAndVal.value}
										/>
									</Box>
								) : null;
						  })}

					{editing && (
						<TextFieldWithIcon
							disableSaveAnimation
							placeHolder="Přidat sportovní údaj"
							style="w-2/5 ml-2 pt-4 "
							onClick={(value) => handleCreateSportDetailLab(value)}
						/>
					)}

					{!!props.selectedSport.state ? (
						<Box
							className={`absolute bottom-8 left-1 px-7  w-full flex  transition-all duration-200
										${props.selectedSport.state?.hasAutomaticPlanCreation ? "justify-between" : "justify-end"}
										${editing && "opacity-0"}`}>
							{props.selectedSport.state?.hasAutomaticPlanCreation ? (
								<ButtonComp
									disabled={editing}
									content="Automatická tvorba"
									size="large"
									justClick
									dontChangeOutline
									onClick={() => {
										document.cookie = `tpc_tmp=${btoa(props.selectedSport.state?.sportId.toString()!)}; path=/; max-age=1200; `;
										document.cookie = `tpac_tmp=${true}; path=/; max-age=1200; `;
										router.push("/training-plan-creation");
									}}
								/>
							) : null}

							<ButtonComp
								disabled={editing}
								content="Manuální tvorba"
								size="large"
								justClick
								dontChangeOutline
								onClick={() => {
									document.cookie = `tpc_tmp=${btoa(props.selectedSport.state?.sportId.toString()!)}; path=/; max-age=1200; `;
									router.push("/training-plan-creation");
								}}
							/>
						</Box>
					) : null}
				</Box>
			}
		/>
	);
};

export default Sports;
