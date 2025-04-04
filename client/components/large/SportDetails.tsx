import { changeSportDetailValReq } from "@/api/change/changeSportDetailValReq";
import { createSportDetailLabReq } from "@/api/create/createSportDetailLabReq";
import { deleteSportDetailLabReq } from "@/api/delete/deleteSportDetailLabReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { getSportDetailLabsAndValsReq } from "@/api/get/getSportDetailLabsAndValsReq";
import { Sport } from "@/api/get/getSportsReq";
import { moveSportDetailLabelReq } from "@/api/move/moveSportDetailLabelReq";
import { StateAndSet } from "@/utilities/generalInterfaces";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import EditButton from "../small/EditButton";
import LabelAndValue from "../small/LabelAndValue";
import TextFieldWithIcon from "../small/TextFieldWithIcon";
import GeneralCard from "./GeneralCard";

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

	const [editing, setEditing] = useState<boolean>(false);

	useEffect(() => {
		if (props.selectedSport.state) {
			getSportDetailLabs(props.selectedSport.state.sportId);
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
		const disableUpArrow = orderNumber === 1;
		const disableDownArrow = orderNumber === sportDetailLabsAndVals.length;

		return (
			<Box className="ml-auto flex relative">
				<Button
					disabled={disableUpArrow}
					onClick={() => handleMoveSportDetailLabel(orderNumber, "up")}
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
					onClick={() => handleMoveSportDetailLabel(orderNumber, "down")}
					size="small"
					className={`w-8 h-8 p-1 min-w-8
								${disableDownArrow && "opacity-30"}`}>
					<ArrowDownward
						className="text-blue-300"
						fontSize="small"
					/>
				</Button>
				<Button
					onClick={() => handleDeleteSportDetailLab(sportDetailLabId, orderNumber)}
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

	return (
		<Box className="h-5/6 pb-4">
			<GeneralCard
				height="h-full"
				border
				firstTitle="Sportovní údaje"
				firstSideContent={[
					<EditButton
						key={"edit"}
						editing={{ state: editing, setState: setEditing }}
					/>,
				]}
				removeJustifyBetween
				firstChildren={
					<Box className=" h-full">
						{editing
							? sportDetailLabsAndVals.map((labAndVal, index) => {
									return (
										<Box
											className=" flex items-end "
											key={index}>
											<LabelAndValue
												label={labAndVal.label}
												textFieldValue={labAndVal.value}
												textFieldOnClick={(value) => handleChangeSportDetailVal(value, labAndVal.sportDetailValId)}
												icon={
													<CheckIcon
														fontSize="small"
														className="text-green-500"
													/>
												}
											/>

											<MoveAndDeleteButtons
												sportDetailLabId={labAndVal.sportDetailLabId}
												orderNumber={labAndVal.orderNumber}
											/>
										</Box>
									);
							  })
							: sportDetailLabsAndVals.map((labAndVal, index) => {
									return (
										<LabelAndValue
											key={index}
											label={labAndVal.label}
											value={labAndVal.value}
											notFilledIn={!labAndVal.value}
										/>
									);
							  })}

						{editing && (
							<TextFieldWithIcon
								placeHolder="Přidat sportovní údaj"
								style="w-2/5 ml-2 mt-2 "
								onClick={handleCreateSportDetailLab}
							/>
						)}
					</Box>
				}
			/>
		</Box>
	);
};

export default Sports;
