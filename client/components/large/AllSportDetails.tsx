import { changeSportDetailValReq } from "@/api/change/changeSportDetailValReq";
import { createSportDetailLabReq } from "@/api/create/createSportDetailLabReq";
import { deleteSportDetailLabReq } from "@/api/delete/deleteSportDetailLabReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { moveSportDetailLabelReq } from "@/api/move/moveSportDetailLabelReq";
import { StateAndSet } from "@/utilities/generalInterfaces";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import LabelAndValue from "../small/LabelAndValue";
import TextFieldWithIcon from "../small/TextFieldWithIcon";
import Title from "../small/Title";
import GeneralCard from "./GeneralCard";

export interface SportDetailLabAndVal {
	sportDetailLabId: number;
	sportDetailValId: number;

	label: string;
	value: string;
	orderNumber: number;
}

interface Props {
	sports: { sportId: number; sportName: string; sportDetails: SportDetailLabAndVal[] }[];

	editing: StateAndSet<boolean>;
}

const Sports = (props: Props) => {
	const [sportDetailLabsAndVals, setSportDetailLabsAndVals] = useState<{ sportId: number; sportName: string; sportDetails: SportDetailLabAndVal[] }[]>(props.sports);

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

	const MoveAndDeleteButtons = ({ sportId, sportDetailLabId, orderNumber }: { sportId: number; sportDetailLabId: number; orderNumber: number }) => {
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

	return (
		<GeneralCard
			height="h-full"
			firstTitle="Sportovní údaje"
			firstChildren={
				<Box className=" h-full ">
					{sportDetailLabsAndVals.map(
						(sportDetail, index) =>
							(sportDetail.sportDetails.length > 0 || props.editing.state) && (
								<Box key={index}>
									<Title
										title={sportDetail.sportName}
										smallPaddingTop={index == 0}
									/>
									{sportDetail.sportDetails.map((labAndVal, index) =>
										props.editing.state ? (
											<Box
												key={index}
												className={` flex items-end ml-2  ${index === 0 && "mt-2"}`}>
												<LabelAndValue
													label={labAndVal.label}
													textFieldValue={labAndVal.value}
													fontLight
													noPaddingTop={index === 0}
													textFieldOnClick={(value) => handleChangeSportDetailVal(value, sportDetail.sportId, labAndVal.sportDetailValId)}
													icon={
														<CheckIcon
															fontSize="small"
															className="text-green-500"
														/>
													}
												/>

												<MoveAndDeleteButtons
													sportId={sportDetail.sportId}
													sportDetailLabId={labAndVal.sportDetailLabId}
													orderNumber={labAndVal.orderNumber}
												/>
											</Box>
										) : (
											<LabelAndValue
												mainStyle={`ml-2
															${index === 0 && "mt-2"} `}
												key={index}
												noPaddingTop={index === 0}
												label={labAndVal.label}
												value={labAndVal.value}
												notFilledIn={!labAndVal.value}
											/>
										)
									)}

									{props.editing.state && (
										<TextFieldWithIcon
											placeHolder="Přidat sportovní údaj"
											style="w-2/5 ml-4 pt-3 "
											onClick={(value) => handleCreateSportDetailLab(value, sportDetail.sportId)}
										/>
									)}
								</Box>
							)
					)}
				</Box>
			}
		/>
	);
};

export default Sports;
