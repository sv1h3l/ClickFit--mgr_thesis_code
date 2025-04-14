import { changeGoalGraphValueReq } from "@/api/change/changeGoalGraphValueReq";
import { changeGraphValueReq } from "@/api/change/changeGraphValueReq";
import { createGraphValueReq } from "@/api/create/createGraphValueReq";
import { deleteGraphValueReq } from "@/api/delete/deleteGraphValueReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { Sport } from "@/api/get/getSportsReq";
import { moveGraphValueReq } from "@/api/move/moveGraphValueReq";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import DoubleValue from "../small/DoubleValue";
import LabelAndValue from "../small/LabelAndValue";
import Title from "../small/Title";
import { Graph, GraphValue } from "./DiaryAndGraphs";
import GeneralCard from "./GeneralCard";

interface Props {
	sportsData: StateAndSetFunction<Sport[]>;

	selectedSport: StateAndSetFunction<Sport | null>;
	selectedGraph: StateAndSetFunction<Graph | null>;

	isSelectedFirstSection: StateAndSetFunction<boolean>;
	isDisabledFirstSection: StateAndSetFunction<boolean>;
}

const SportsAndValues = (props: Props) => {
	const [edit, setEdit] = useState(false);

	const [firstValueErrorGoal, setFirstValueErrorGoal] = useState(false);
	const [secondValueErrorGoal, setSecondValueErrorGoal] = useState(false);

	const isValidDate = (date: string) => {
		const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
		return regex.test(date);
	};

	const handleCreateGraphValue = async (firstValue: string, secondValue: number, graphValueId: number, isGoal: boolean, isDefaultGraphValue: boolean) => {
		let error = false;

		if (!firstValue) {
			setFirstValueErrorGoal(true);
			error = true;
		} else if (props.selectedGraph.state?.hasDate && !isValidDate(firstValue)) {
			setFirstValueErrorGoal(true);
			error = true;
		} else {
			setFirstValueErrorGoal(false);
		}

		if (!secondValue) {
			setSecondValueErrorGoal(true);
			error = true;
		} else {
			setSecondValueErrorGoal(false);
		}

		if (error) return;

		try {
			const res = await createGraphValueReq({ graphId: props.selectedGraph.state?.graphId!, xAxisValue: firstValue, yAxisValue: secondValue, isGoal, isDefaultGraphValue });

			if (res.status === 200) {
				const newValue = {
					graphValueId: res.data?.graphValueId,
					xAxisValue: firstValue,
					yAxisValue: secondValue,

					orderNumber: res.data?.orderNumber,
					isGoal,
				} as GraphValue;

				props.selectedGraph.setState((prev) => {
					if (!prev) return prev;

					const existingValues = Array.isArray(prev.graphValues) ? prev.graphValues : [];

					return {
						...prev,
						graphValues: [...existingValues, newValue],
					};
				});
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeGraphValue = async (firstValue: string, secondValue: number, graphValueId: number, isGoal: boolean, isDefaultGraphValue: boolean) => {
		if (!firstValue || !secondValue) {
			return;
		}

		try {
			const res = await changeGraphValueReq({ graphValueId, xAxisValue: firstValue, yAxisValue: secondValue, isDefaultGraphValue });

			if (res.status === 200) {
				props.selectedGraph.setState((prev) => {
					if (!prev) return prev;

					const updatedGraphValues = prev.graphValues.map((val) => {
						if (val.graphValueId === graphValueId) {
							return {
								...val,
								xAxisValue: firstValue,
								yAxisValue: secondValue,
							};
						}
						return val;
					});

					return {
						...prev,
						graphValues: updatedGraphValues,
					};
				});
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleDeleteGraphValue = async (graphValueId: number, orderNumber: number) => {
		try {
			const res = await deleteGraphValueReq({
				graphId: props.selectedGraph.state?.graphId!,
				graphValueId,
				orderNumber,
			});

			if (res.status === 200) {
				props.selectedGraph.setState((prev) => {
					if (!prev) return prev;

					const filteredGraphValues = prev.graphValues.filter((value) => value.graphValueId !== graphValueId);

					return {
						...prev,
						graphValues: filteredGraphValues,
					};
				});
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeGoalGraphValue = async (graphValueId: number, isGoal: boolean) => {
		try {
			const res = await changeGoalGraphValueReq({ graphValueId, isGoal });

			if (res.status === 200) {
				props.selectedGraph.setState((prev) => {
					if (!prev) return prev;

					const updatedGraphValues = prev.graphValues.map((val) => (val.graphValueId === graphValueId ? { ...val, isGoal } : val));

					return {
						...prev,
						graphValues: updatedGraphValues,
					};
				});
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleMoveGraphValue = async (primaryGraphValueId: number, orderNumber: number, moveUp: boolean) => {
		if ((orderNumber === 1 && moveUp) || (orderNumber === props.selectedGraph.state?.graphValues.length && !moveUp)) return;

		let secondaryGraphValueId;

		if (moveUp) {
			secondaryGraphValueId = props.selectedGraph.state?.graphValues.find((value) => value.orderNumber + 1 === orderNumber)?.graphValueId || -1;
		} else {
			secondaryGraphValueId = props.selectedGraph.state?.graphValues.find((value) => value.orderNumber - 1 === orderNumber)?.graphValueId || -1;
		}

		try {
			const res = await moveGraphValueReq({ primaryGraphValueId, secondaryGraphValueId, moveUp });

			if (res.status === 200) {
				props.selectedGraph.setState((prev) => {
					if (!prev) return prev;

					const updatedGraphValues = prev.graphValues.map((val) => {
						if (val.graphValueId === primaryGraphValueId) return { ...val, orderNumber: moveUp ? orderNumber - 1 : orderNumber + 1 };
						else if (val.graphValueId === secondaryGraphValueId) return { ...val, orderNumber: orderNumber };
						else return val;
					});

					return {
						...prev,
						graphValues: updatedGraphValues,
					};
				});
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};
	useEffect(() => {
		if (props.selectedGraph.state?.graphValues?.length === 0 || !props.selectedGraph.state?.graphValues) {
			setEdit(false);
		}
	}, [props.selectedGraph.state?.graphValues]);

	const renderFormattedGraphValues = () => {
		let graphValues: GraphValue[] = props.selectedGraph.state?.graphValues || [];

		// Set pro uložení unikátních let a jejich hodnot boolean (false - vypíše se x, true - nevypíše se)
		const yearMap = new Map<number, boolean>();

		if (props.selectedGraph.state?.hasDate) {
			graphValues.sort((a, b) => {
				// Převeď xAxisValue na Date pro oba objekty a porovnej je
				const dateA = new Date(a.xAxisValue.split(".").reverse().join("-")); // Převede dd.mm.yyyy na yyyy-mm-dd
				const dateB = new Date(b.xAxisValue.split(".").reverse().join("-")); // Převede dd.mm.yyyy na yyyy-mm-dd

				// Seřadí od nejnovějšího po nejstarší
				return dateB.getTime() - dateA.getTime();
			});
		} else {
			graphValues.sort((a, b) => a.orderNumber - b.orderNumber);
			graphValues.reverse();
		}

		return graphValues.map((value) => {
			// Převeď xAxisValue na Date objekt
			const dateParts = value.xAxisValue.split("."); // předpokládáme formát dd.mm.yyyy
			const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`); // vytvoření data ve formátu yyyy-mm-dd

			// Získání roku a přidání do Mapy s hodnotou boolean
			const year = date.getFullYear();

			// Pokud ještě není rok v mapě, přidej ho s hodnotou false (to znamená, že se vypíše x)
			if (!yearMap.has(year)) {
				yearMap.set(year, false);
			}

			// Pokud rok již existuje, změníme hodnotu na true, aby se "x" nevypisovalo
			else {
				yearMap.set(year, true);
			}

			return (
				<Box
					className="flex flex-col w-full"
					key={value.graphValueId}>
					{props.selectedGraph.state?.hasDate ? yearMap.get(year) === false && <Typography className="mt-7 -mb-1 font-light">{year}</Typography> : null}

					<Box className="w-full pl-4">
						<DoubleValue
							checkOnClick={(firstValue, secondValue, graphValueId, isGoal, isDefaultGraphValue) => handleChangeGraphValue(firstValue, secondValue, graphValueId, isGoal, isDefaultGraphValue)}
							firstValuePlaceholder={props.selectedGraph.state?.xAxisLabel}
							secondValuePlaceholder={props.selectedGraph.state?.yAxisLabel}
							tfFirstValueMaxLength={12}
							tfSecondValueMaxLength={4}
							edit={edit}
							firstValue={value.xAxisValue}
							secondValue={value.yAxisValue.toString()}
							unit={props.selectedGraph.state?.unit}
							graphValueId={value.graphValueId}
							orderNumber={value.orderNumber}
							isDefaultGraphValue={props.selectedGraph.state?.defaultGraphOrderNumberId ? true : false}
							crossOnClick={(graphValueId, orderNumber) => handleDeleteGraphValue(graphValueId, orderNumber)}
							showCrossButton
							graphId={props.selectedGraph.state?.graphId!}
							hasDate={props.selectedGraph.state?.hasDate}
							showGoalButton={props.selectedGraph.state?.hasGoals}
							isGoal={value.isGoal}
							goalOnClick={(graphValueId, isGoal) => handleChangeGoalGraphValue(graphValueId, isGoal)}
							showMoveButtons={!props.selectedGraph.state?.hasDate}
							moveOnClick={(primaryGraphValueId, orderNumber, moveUp) => handleMoveGraphValue(primaryGraphValueId, orderNumber, moveUp)}
							highestOrderNumber={graphValues.length === value.orderNumber}
						/>
					</Box>
				</Box>
			);
		});
	};

	return (
		<GeneralCard
			height="h-full max-h-full"
			firstTitle="Sporty"
			showFirstSection={{ state: props.isSelectedFirstSection.state, setState: props.isSelectedFirstSection.setState }}
			disabled={props.isDisabledFirstSection.state}
			firstChildren={
				<Box className=" h-full ">
					<Title
						title="Sport"
						secondTitle="Autor"
						smallPaddingTop
					/>

					{props.sportsData.state.map((sport) => (
						<LabelAndValue
							disableSelection={props.isDisabledFirstSection.state}
							key={sport.sportId}
							spaceBetween
							label={sport.sportName}
							value={sport.userName}
							isSelected={sport.sportId == props.selectedSport.state?.sportId}
							onClick={() => {
								if (props.selectedSport.state?.sportId !== sport.sportId) {
									props.selectedGraph.setState(null);
								}
								props.selectedSport.setState(sport);
							}}
						/>
					))}
				</Box>
			}
			secondTitle={props.selectedGraph.state  ? "Záznamy" : ""}
			secondChildren={
				<Box className=" h-full ">
					<Box className="flex justify-center items-center pt-8 ">
						<Box className="w-fit pr-3 -ml-3 -mt-1">
							<ButtonComp
								disabled={!props.selectedGraph.state?.graphValues?.length}
								icon={IconEnum.EDIT}
								size="small"
								onClick={() => setEdit(!edit)}
							/>
						</Box>
						<Typography className="text-xl">{props.selectedGraph.state?.graphLabel}</Typography>
					</Box>
					<Typography className="mt-7 font-light  ">Nový záznam</Typography>
					<Box className="pl-4">
						<DoubleValue
							checkOnClick={(firstValue, secondValue, graphValueId, isGoal, isDefaultGraphValue) => handleCreateGraphValue(firstValue, secondValue, graphValueId, isGoal, isDefaultGraphValue)}
							firstValuePlaceholder={props.selectedGraph.state?.xAxisLabel}
							secondValuePlaceholder={props.selectedGraph.state?.yAxisLabel}
							tfFirstValueMaxLength={12}
							tfSecondValueMaxLength={4}
							edit={true}
							unit={props.selectedGraph.state?.unit}
							graphValueId={0}
							orderNumber={0}
							graphId={props.selectedGraph.state?.graphId!}
							isDefaultGraphValue={props.selectedGraph.state?.defaultGraphOrderNumberId ? true : false}
							firstValueError={{ state: firstValueErrorGoal, setState: setFirstValueErrorGoal }}
							secondValueError={{ state: secondValueErrorGoal, setState: setSecondValueErrorGoal }}
							hasDate={props.selectedGraph.state?.hasDate}
							showGoalButton={props.selectedGraph.state?.hasGoals}
							showCheckButttonAlways
						/>
					</Box>
					{props.selectedGraph.state?.hasDate || !props.selectedGraph.state?.graphValues ? null : <Typography className="mt-7 -mb-1 font-light">Záznamy</Typography>}{" "}
					{/* FIXME když smažu poslední záznam ta kzůstane "Záznámy" + když kliknu na save tak se úplně neschová tlačítko fajvky */}
					{props.selectedGraph.state?.graphValues && renderFormattedGraphValues()}
				</Box>
			}
		/>
	);
};

export default SportsAndValues;
