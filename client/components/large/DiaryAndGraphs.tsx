import { changeDiaryContentReq } from "@/api/change/changeDiaryContentReq";
import { changeGraphReq } from "@/api/change/changeGraphReq";
import { createGraphReq } from "@/api/create/createGraphReq";
import { deleteGraphReq } from "@/api/delete/deleteGraphReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { getDiaryReq } from "@/api/get/getDiaryReq";
import { getGraphsReq } from "@/api/get/getGraphsReq";
import { getGraphValuesReq } from "@/api/get/getGraphValuesReq";
import { Sport } from "@/api/get/getSportsReq";
import { getVisitedUserGraphsReq } from "@/api/get/getVisitedUserGraphsReq";
import { getVisitedUserGraphValuesReq } from "@/api/get/getVisitedUserGraphValuesReq";
import { hideDefGraphReq } from "@/api/move/hideDefGraphReq";
import { moveGraphReq } from "@/api/move/moveGraphReq";
import { showDefGraphReq } from "@/api/move/showDefGraphReq";
import { useAppContext } from "@/utilities/Context";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Checkbox, FormControl, FormControlLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { CartesianGrid, Customized, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import remarkBreaks from "remark-breaks";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import CustomModal from "../small/CustomModal";
import DoubleLabelAndValue from "../small/DoubleLabelAndValue";
import LabelAndValue from "../small/LabelAndValue";
import TextFieldWithIcon from "../small/TextFieldWithIcon";
import GeneralCard from "./GeneralCard";

interface Props {
	selectedSport: StateAndSetFunction<Sport | null>;
	selectedGraph: StateAndSetFunction<Graph | null>;

	isSelectedFirstSection: StateAndSetFunction<boolean>;
	isDisabledFirstSection: StateAndSetFunction<boolean>;

	cannotEdit?: boolean;
}

export interface Diary {
	diaryId: number;
	sportId: number;
	content: string;
}

export interface GraphValue {
	graphValueId: number;

	yAxisValue: number;
	xAxisValue: string;

	isGoal: boolean;

	orderNumber: number;
}

export interface Graph {
	graphId: number;

	graphLabel: string;
	orderNumber: number;
	unit: string;

	hasDate: boolean;
	hasGoals: boolean;

	defaultGraphOrderNumberId?: number;

	yAxisLabel: string;
	xAxisLabel: string;

	graphValues: GraphValue[];
}

//
//	#region Markdown Comp
//
const MarkdownComp = ({ value }: { value: string }) => {
	return (
		<span className="react-markdown break-words font-light w-1/2">
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
				{value}
			</ReactMarkdown>
		</span>
	);
};

export const RemarkEntitiesDescription = () => {
	const context = useAppContext();

	return (
		<Box className="w-full flex flex-col gap-8 mb-4 ">
			<Box className="flex items-center  w-full gap-8">
				<Typography className=" text-right w-1/2 font-light"># Nadpis 1</Typography>
				<Typography className="font-light opacity-50">»</Typography>
				<MarkdownComp value="# Nadpis 1" />
			</Box>

			<Box className="flex items-center  w-full gap-8">
				<Typography className=" text-right w-1/2 font-light">## Nadpis 2</Typography>
				<Typography className="font-light opacity-50">»</Typography>
				<MarkdownComp value="## Nadpis 2" />
			</Box>

			<Box className="flex items-center w-full gap-8">
				<Typography className=" text-right w-1/2 font-light">### Nadpis 3</Typography>
				<Typography className="font-light opacity-50">»</Typography>
				<MarkdownComp value="### Nadpis 3" />
			</Box>

			<Box className="flex items-center w-full gap-8">
				<Typography className=" text-right w-1/2 font-light">základní text</Typography>
				<Typography className="font-light opacity-50">»</Typography>
				<MarkdownComp value="základní text" />
			</Box>

			<Box className="flex items-center w-full gap-8">
				<Typography className=" text-right w-1/2 font-light">*kurzíva*</Typography>
				<Typography className="font-light opacity-50">»</Typography>
				<MarkdownComp value="*kurzíva*" />
			</Box>

			<Box className="flex items-center w-full gap-8">
				<Typography className=" text-right w-1/2 font-light">**tučný text**</Typography>
				<Typography className="font-light opacity-50">»</Typography>
				<MarkdownComp value="**tučný text**" />
			</Box>

			<Box className="flex items-center w-full gap-8 ">
				<Box className={`flex w-1/2 justify-end`}>
					<Typography className=" text-right font-light opacity-50 mr-2">(oddělovací čára)</Typography>
					<Typography className=" text-right font-light">-</Typography>
					<Typography className=" text-right font-light mx-0.5">-</Typography>
					<Typography className=" text-right font-light">-</Typography>
				</Box>
				<Typography className="font-light opacity-50">»</Typography>
				<MarkdownComp value="---" />
			</Box>

			<Box
				className={`flex items-center w-full gap-8
							${context.windowWidth < 450 ? "flex-col mt-2" : "-mt-2"}`}>
				<Box
					className={`flex flex-col  -mt-4
								${context.windowWidth < 450 ? "w-full" : "w-1/2"}`}>
					<Typography className={`font-light ${context.windowWidth < 450 ? "text-center " : "text-right "}`}>- položka seznamu</Typography>
					<Typography className={`font-light ${context.windowWidth < 450 ? "text-center " : "text-right "}`}>- položka seznamu</Typography>
					<Typography className={`font-light ${context.windowWidth < 450 ? "text-center " : "text-right "}`}>- položka seznamu</Typography>
				</Box>
				<Typography
					className={`font-light opacity-50 -mt-4 
								${context.windowWidth < 450 ? "rotate-90 -mb-4" : ""}`}>
					»
				</Typography>
				<Box className={` -mt-1 ${context.windowWidth < 450 ? "-ml-10  " : "w-1/2"}`}>
					<MarkdownComp value={`- položka seznamu\n- položka seznamu\n- položka seznamu`} />
				</Box>
			</Box>

			<Box
				className={`flex items-center w-full gap-8
							${context.windowWidth < 450 ? "flex-col mt-2" : "-mt-2"}`}>
				<Box
					className={`flex flex-col  -mt-4 
								${context.windowWidth < 450 ? "w-full " : "w-1/2"}`}>
					<Typography className={`font-light ${context.windowWidth < 450 ? "text-center " : "text-right "}`}>1. položka seznamu</Typography>
					<Typography className={`font-light ${context.windowWidth < 450 ? "text-center " : "text-right "}`}>2. položka seznamu</Typography>
					<Typography className={`font-light ${context.windowWidth < 450 ? "text-center " : "text-right "}`}>3. položka seznamu</Typography>
				</Box>
				<Typography
					className={`font-light opacity-50 -mt-4 
								${context.windowWidth < 450 ? "rotate-90 -mb-4" : ""}`}>
					»
				</Typography>
				<Box className={`${context.windowWidth < 450 ? "-ml-10 -mt-1" : " w-1/2"}`}>
					<MarkdownComp value={`1. položka seznamu\n2. položka seznamu\n3. položka seznamu`} />
				</Box>
			</Box>
		</Box>
	);
};
//	#endregion
//

const DiaryAndGraphs = (props: Props) => {
	const context = useAppContext();

	useEffect(() => {
		if (props.selectedSport.state) {
			getDiary(props.selectedSport.state.sportId);
			getGraphs(props.selectedSport.state.sportId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.selectedSport.state]);

	useEffect(() => {
		if (props.selectedGraph.state?.graphValues) {
			setGraphsData((prevGraphsData) => {
				// Vrátíme nové pole s upravenými grafy
				return prevGraphsData.map((graph) => {
					// Pokud graphId odpovídá, přidáme nové graphValues, jinak je necháme beze změny
					if (graph.graphId === props.selectedGraph.state?.graphId) {
						return {
							...graph,
							graphValues: props.selectedGraph.state.graphValues, // Nahradíme graphValues novými
						};
					}
					return graph;
				});
			});
		}
	}, [props.selectedGraph.state?.graphValues]);

	// #region Diary

	const [diary, setDiary] = useState<Diary>({ diaryId: -1, sportId: -1, content: "" });
	const [diaryContent, setDiaryContent] = useState<string>("");

	const [diaryEditing, setDiaryEditing] = useState(false);

	useEffect(() => {
		setDiaryContent(diary.content);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [diaryEditing, props.selectedSport.state?.sportId]);

	const getDiary = async (sportId: number) => {
		try {
			const res = await getDiaryReq({ sportId });

			if (res.status === 200 && res.data) {
				setDiary(res.data);
				setDiaryContent(res.data.content);
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const changeDiaryContent = async (diaryId: number) => {
		try {
			const res = await changeDiaryContentReq({ diaryId, content: diaryContent });

			if (res.status === 200) {
				setDiary({ ...diary, content: diaryContent });
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	// #endregion

	// #region Graphs

	const [graphsData, setGraphsData] = useState<Graph[]>([]);

	const [newGraph, setNewGraph] = useState(false);
	const [newDefaultGraph, setNewDefaultGraph] = useState(false);

	const [editGraph, setEditGraph] = useState<Graph | null>(null);

	const [reorderGraphs, setReorderGraphs] = useState(false);

	const [selectedValue, setSelectedValue] = useState("");
	const [previousSelectedValue, setPreviousSelectedValue] = useState("");

	const [menuItems, setMenuItems] = useState<{ value: string; label: string }[]>([]);

	const [highestOrderNumber, setHighestOrderNumber] = useState(0);

	/*const handleChange = (event: SelectChangeEvent) => {
		setSelectedValue(event.target.value);
	};*/

	useEffect(() => {
		if (selectedValue === "newGraph" || selectedValue === "newDefaultGraph" || selectedValue === "reorderGraphs") {
			props.isSelectedFirstSection.setState(true);
			props.isDisabledFirstSection.setState(true);
			props.selectedGraph.setState(null);
			setSelectedValue("");

			if (selectedValue === "reorderGraphs") {
				setReorderGraphs(true);
			} else {
				setGraphLabel("");

				setHasDate(true);
				setYAxisLabel("");
				setXAxisLabel("");

				setUnit("");

				setHasGoals(false);

				if (selectedValue === "newGraph") setNewGraph(true);
				else if (selectedValue === "newDefaultGraph") setNewDefaultGraph(true);
			}
		} else {
			const orderNumber = parseInt(selectedValue, 10);

			getValues(orderNumber);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedValue]);

	const editGraphPrerequisites = (graph: Graph) => {
		props.isSelectedFirstSection.setState(true);
		props.isDisabledFirstSection.setState(true);

		setGraphLabel(graph.graphLabel);

		setHasDate(graph.hasDate);
		setYAxisLabel(graph.yAxisLabel);
		setXAxisLabel(graph.hasDate ? "" : graph.xAxisLabel);

		setUnit(graph.unit);

		setHasGoals(graph.hasGoals);

		setHelperTexts(emptyHelperTexts);

		setEditGraph(graph);
	};

	const getValues = async (orderNumber: number) => {
		let selectedGraph = graphsData.find((graph) => graph.orderNumber === orderNumber);

		if (selectedGraph && !selectedGraph?.graphValues) {
			try {
				const res = props.cannotEdit
					? await getVisitedUserGraphValuesReq({ graphId: selectedGraph.graphId, defaultGraph: selectedGraph.defaultGraphOrderNumberId ? true : false })
					: await getGraphValuesReq({ graphId: selectedGraph.graphId, defaultGraph: selectedGraph.defaultGraphOrderNumberId ? true : false });

				if (res.status === 200 && res.data) {
					selectedGraph.graphValues = res.data;
				}

				consoleLogPrint(res);
			} catch (error) {
				console.error("Error: ", error);
			}
		}

		props.selectedGraph.setState(selectedGraph || null);
	};

	const getGraphs = async (sportId: number) => {
		try {
			const res = props.cannotEdit ? await getVisitedUserGraphsReq({ sportId }) : await getGraphsReq({ sportId });

			if (res.status === 200 && res.data) {
				setGraphsData(res.data);

				let newMenuItems: { value: string; label: string }[] = [];

				res.data.forEach((graph) => {
					if (graph.orderNumber !== 0) {
						newMenuItems.push({
							value: graph.orderNumber.toString(),
							label: graph.graphLabel,
						});
					}
				});

				setMenuItems(newMenuItems);

				const selectedVal = newMenuItems[0];

				setSelectedValue(selectedVal?.value || "");

				//const filtredGraphs =

				const newHighestOrderNumber = res.data.filter((graph) => graph.orderNumber !== 0).length;

				setHighestOrderNumber(newHighestOrderNumber);
			} else {
				setMenuItems([]);
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (event: SelectChangeEvent<string>) => {
		setPreviousSelectedValue(selectedValue);
		setSelectedValue(event.target.value);
		handleClose();
	};

	const [graphLabel, setGraphLabel] = useState("");

	const [hasDate, setHasDate] = useState(true);
	const [yAxisLabel, setYAxisLabel] = useState("");
	const [xAxisLabel, setXAxisLabel] = useState("");

	const [unit, setUnit] = useState("");

	const [hasGoals, setHasGoals] = useState(false);

	useEffect(() => {
		if (!hasDate) {
			setHasGoals(false);
		}
	}, [hasDate]);

	enum HelperTextCodeEnum {
		GRAPH_LABEL = 1,
		Y_AXIS_LABEL = 2,
		X_AXIS_LABEL = 3,
		Y_AXIS_GOAL = 4,
		X_AXIS_GOAL = 5,
		UNIT = 6,
	}

	const emptyHelperTexts: { [key: string]: string } = {
		[HelperTextCodeEnum.GRAPH_LABEL]: "",
		[HelperTextCodeEnum.Y_AXIS_LABEL]: "",
		[HelperTextCodeEnum.X_AXIS_LABEL]: "",
		[HelperTextCodeEnum.UNIT]: "",
	};

	const [helperTexts, setHelperTexts] = useState<{ [key: string]: string }>(emptyHelperTexts);

	const checkTextFieldValidity = (): boolean => {
		setHelperTexts(emptyHelperTexts);

		let error = false;

		if (graphLabel.length < 1) {
			setHelperTexts((prev) => ({
				...prev,
				[HelperTextCodeEnum.GRAPH_LABEL]: "Název grafu nesmí být prázdný",
			}));
			error = true;
		} else if (graphLabel.length > 50) {
			setHelperTexts((prev) => ({
				...prev,
				[HelperTextCodeEnum.GRAPH_LABEL]: "Název grafu nesmí mít více než 50 znaků",
			}));
			error = true;
		}

		if (yAxisLabel.length < 1) {
			setHelperTexts((prev) => ({
				...prev,
				[HelperTextCodeEnum.Y_AXIS_LABEL]: "Název osy Y nesmí být prázdný",
			}));
			error = true;
		} else if (yAxisLabel.length > 20) {
			setHelperTexts((prev) => ({
				...prev,
				[HelperTextCodeEnum.Y_AXIS_LABEL]: "Název osy Y nesmí mít více než 20 znaků",
			}));
			error = true;
		}

		if (!hasDate && xAxisLabel.length < 1) {
			setHelperTexts((prev) => ({
				...prev,
				[HelperTextCodeEnum.X_AXIS_LABEL]: "Název osy X nesmí být prázdný",
			}));
			error = true;
		} else if (!hasDate && xAxisLabel.length > 20) {
			setHelperTexts((prev) => ({
				...prev,
				[HelperTextCodeEnum.X_AXIS_LABEL]: "Název osy X nesmí mít více než 20 znaků",
			}));
			error = true;
		}

		if (unit.length > 5) {
			setHelperTexts((prev) => ({
				...prev,
				[HelperTextCodeEnum.UNIT]: "Jednotka nesmí mít více než 5 znaků",
			}));
			error = true;
		}

		return error;
	};

	const handleCreateGraph = async () => {
		if (checkTextFieldValidity()) return;

		try {
			const res = await createGraphReq({ sportId: props.selectedSport.state?.sportId!, graphLabel, hasDate, xAxisLabel: hasDate ? "Datum" : xAxisLabel, yAxisLabel, unit, hasGoals, createDefGraph: newDefaultGraph });

			if (res.status === 400 && res.data) {
				setHelperTexts(res.data.helperTexts);
			} else if (res.status === 200 && res.data) {
				const newGraph = {
					graphId: res.data.graphId,

					graphLabel,
					orderNumber: res.data.orderNumber,
					hasDate,
					hasGoals,

					yAxisLabel,
					xAxisLabel: hasDate ? "Datum" : xAxisLabel,

					defaultGraphOrderNumberId: res.data.defaultGraphOnId,

					unit,

					graphValues: [],
				} as Graph;

				setGraphsData((prev) => [newGraph, ...prev]);

				props.selectedGraph.setState(newGraph);

				const newMenuItems: { value: string; label: string }[] = [
					{
						value: res.data.orderNumber.toString(),
						label: graphLabel,
					},
					...menuItems,
				];

				setMenuItems(newMenuItems);
				setSelectedValue(res.data.orderNumber.toString());

				setNewGraph(false);
				setNewDefaultGraph(false);
				props.isDisabledFirstSection.setState(false);
				props.isSelectedFirstSection.setState(false);

				setHighestOrderNumber(highestOrderNumber + 1);
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleChangeGraph = async () => {
		if (checkTextFieldValidity()) return;

		try {
			const res = await changeGraphReq({
				graphId: editGraph?.graphId!,
				graphLabel,
				hasDate,
				xAxisLabel: hasDate ? "Datum" : xAxisLabel,
				yAxisLabel,
				unit,
				hasGoals,
				isDefGraph: !!editGraph?.defaultGraphOrderNumberId,
				changedHasDate: !editGraph?.hasDate && hasDate,
			});

			if (res.status === 400 && res.data) {
				setHelperTexts(res.data.helperTexts);
			} else if (res.status === 200) {
				setGraphsData((prev) =>
					prev.map((graph) => {
						if (graph.graphId === editGraph?.graphId && graph.defaultGraphOrderNumberId === editGraph.defaultGraphOrderNumberId) {
							return { ...graph, graphLabel, hasDate, xAxisLabel: hasDate ? "Datum" : xAxisLabel, yAxisLabel, unit, hasGoals, graphValues: [] };
						} else return graph;
					})
				);

				setMenuItems((prev) =>
					prev.map((menuItem) => {
						if (menuItem.value === editGraph?.orderNumber.toString()) {
							return { ...menuItem, label: graphLabel };
						} else return menuItem;
					})
				);

				setEditGraph(null);
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleDeleteGraph = async () => {
		try {
			const res = await deleteGraphReq({
				graphId: editGraph?.graphId!,
				isDefGraph: !!editGraph?.defaultGraphOrderNumberId,
				orderNumber: editGraph?.orderNumber!,
				sportId: props.selectedSport.state?.sportId!,
			});

			if (res.status === 200) {
				const newGraphData = graphsData
					.filter((graph) => !(graph.graphId === editGraph?.graphId && !!graph.defaultGraphOrderNumberId === !!editGraph?.defaultGraphOrderNumberId))
					.map((graph) => {
						if (graph.orderNumber > editGraph?.orderNumber!) return { ...graph, orderNumber: graph.orderNumber - 1 };
						else return graph;
					});

				setGraphsData(newGraphData);

				let newMenuItems: { value: string; label: string }[] = [];

				newGraphData.forEach((graph) => {
					if (graph.orderNumber !== 0) {
						newMenuItems.push({
							value: graph.orderNumber.toString(),
							label: graph.graphLabel,
						});
					}
				});

				setMenuItems(newMenuItems);

				if (editGraph?.orderNumber !== 0) setHighestOrderNumber(highestOrderNumber - 1);
				setEditGraph(null);
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const cartesianStroke = "#3A3A3A";
	const lineStroke = "#939393";

	// #endregion

	let formattedData: any[] = [];
	let minTimestamp = 0;
	let maxTimestamp = 0;
	let minWeight = 0;
	let maxWeight = 0;
	let dateTicks: number[] = [];
	let goalValues: any[] = [];
	let nonGoalValues: any[] = [];
	const tickLastYearRef = useRef<number | null>(null);

	if (props.selectedGraph.state?.hasDate && props.selectedGraph.state?.graphValues?.length > 1) {
		formattedData = [];
		minTimestamp = 0;
		maxTimestamp = 0;
		minWeight = 0;
		maxWeight = 0;
		dateTicks = [];
		goalValues = [];
		nonGoalValues = [];

		const graphValues = props.selectedGraph.state.graphValues;

		minWeight = Math.min(...graphValues.map((entry) => entry.yAxisValue));
		maxWeight = Math.max(...graphValues.map((entry) => entry.yAxisValue));

		const tickCount = 10;

		formattedData = graphValues.map((entry) => ({
			...entry,
			originalDate: entry.xAxisValue,
			date: new Date(entry.xAxisValue.split(".").reverse().join("-")).getTime(),
		}));

		minTimestamp = Math.min(...formattedData.map((entry) => entry.date));
		maxTimestamp = Math.max(...formattedData.map((entry) => entry.date));

		dateTicks = [];
		for (let i = 0; i < tickCount; i++) {
			dateTicks.push(minTimestamp + ((maxTimestamp - minTimestamp) / (tickCount - 1)) * i);
		}

		goalValues = formattedData.filter((entry) => entry.isGoal);
		nonGoalValues = formattedData.filter((entry) => !entry.isGoal);
	}

	const generateTicks = (values: number[]) => {
		if (!values || values.length === 0) return [];

		const min = Math.min(...values);
		const max = Math.max(...values);
		const count = 10;

		const step = (max - min) / (count - 1);
		const ticks = [];

		for (let i = 0; i < count; i++) {
			ticks.push(Math.round(min + i * step));
		}

		return Array.from(new Set(ticks));
	};

	const FlagSVG = () => (
		<svg
			version="1.2"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 317"
			width="15"
			height="15"
			style={{
				filter: "drop-shadow(3px 3px 3px #00000060)",
			}}>
			<defs>
				<image
					width="13"
					height="13"
					id="img1"
					href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMcAAADiCAMAAADNuiNxAAAAAXNSR0IB2cksfwAAAHVQTFRFEhISNTU1WVlZR0dHWVlZR0dHTU1NiIiImpqarKyso6Oja2tr////4eHhWFhYTU1NxMTEgYGBzMzMIyMjl5eX6urqg4ODSEhI1dXVdnZ2aGhoMDAwjY2NWFhY0dHRbm5u6Ojo5ubmSEhIpqams7OzwcHBurq6liNwZQAAACd0Uk5TAABAEAAAAL7u//9w//8AIP+r/wDm/7EA/45oAMw9/3j//xH/////OkI+agAABWBJREFUeJztnW9P2zAQxm3oQO3o2KC8QEwT3/9ToWl7A2P/B5TSdm3TtEns2BfHdz6seyQ0ap7G/iW5BtJnPa2U1qomvdz8s1A2IZoPreYXmFkf6cZs2+fDlhZqHvzzLa00gzj0Ur/VViOy9B9zaPygRqr8etxitHE0zYk41OGv5khtF+vhg1Kj9ddv69MNM08OvRzBOTbmVByzaXOksrSyNtby1kdhTsUx+Nkc2S+tiuHl2JpTcZiFvltaDcPHUZpTcZgFUi6tjuHh2JnZcTQw3Bx7czIOo9CLS8JjA8N5/aiYk3EYhb7ZxfvrBuB1t2pOxmEU+nppleuGn6NmTsZhFMhqac3aWKu1PupmThw2jFaOhjkdR7PQ9cCG0cbRNOsPsyir6q6jH/XHZ9+tNvuwMaonTzEWFaDh/UHt8dx6ONTAerYZ5nQcalTfpy0c7x7O783R18cxUMoCwoljPq2dWO0cFhBOHCe3UA4ThBNHo9BdHAYIJ45GgTg5miCsOMZ31UdujgYIK475c/V3CQ9H/fcpVhwntxeVndx6/Sh/pz13mVNyDLU6nO8eWW4xrnW8/7bdfPI1JUc8zabCwUnCwUvCwUsZcXw0bny/QmV0PHLhSHb/Kqbmk0w4cjkewsFKwsFLq7/0s+BYPOXBkc15JRysJBy8JBy8JBy8JBy8JBy8tOJIlpOJqZd87l8JByMJBy8JBy8JBy8JBy8JBy8JBy8JBy8JBy9JToaXMuLI4/6V5GRYSTh4STh4SXIyvJTNeSUcrCQcvCQcvCQcvCQcvCQcvCQ5GV7K6D6ccDCScPCScPCScPCScPCScPCScPCScPBSRhySk2GkjDjyuH8lORlWcnMMLGMHR8bQ0bNS9iIrzfPHkMV1kJPD0vvFbN2z/dxPd3+c40Prj+MpgKO5pOLjS91dIc4eglYHV38OUHekK8snZUeVMycD4YB1R1qcIxeIMydj5wjpjnQ5+xthsQ71PK+g3ZEW2IXejwPeHQm70HtxdOiOhF3ofTi6dEdafPoWsjywenB06o60vMAt9HCObt2R5siFHszRtTsScqEHcIR1R0Iu9MDj0b070uUT6hU9jCOgOxLyFT2II6Q7EvIVPYQjrDsSbqEHcAR2R8ItdGdO5uLGMhjcHen6zuaIJGdOZvL5wBwM7o703n7I4sh5H244/mwOBndHOn7TeXVwuTnuLwANjwr5uyOdzo0fx5OH4wDQ8KiQvzvSldHoNaJ8HICGR4UA3ZHG9mdGkZfD3/CoEKA7Emah+zm8DY8KAbojYRY6gMPX8KgQsDtSofLl/PqmOrrsZfZzeBoeFQJ2R8IzuzkADY8KAbsj4ZkBx6N2tvj2WioziKOyBf9sacwwjv0WALMlMQM5dluAzJbCDOUotwCaLYEZzLHdAmw2ejOco3gBB85GboZcP6ov4N5X+UTmDsdjc0yhe43a7MjJmByrLcBnozV3Oh6rLdzCZyM1d+RQp/b7N9bZKM393ufcvd9pv3lEaO6dA9gMDj3vD+KbY3Dope99TnxzBI71hcnzvhq+uT/H5voKXRqamSQnQ2GmyMkQmElyMgRmkpwMgZkkJ0NgpsnJ4JtpcjL4ZpqcDL6ZJieDb6bJyeCbiXIy6GainAy6mSgng24mysmgm4lyMuhmqpwMtpkqJ4NtJsvJIJvJcjLIZrKcDLKZLCeDbCbLySCb6XIyuGa6nAyumS4ng2tOkZPBMEtOpibJyUQyS06mdTbJyfQwS07GNZvkZELNkpOpSXIykcySk/HPJjkZycnYvJKToTdnk5M5nRgfdVP8Bbn4MgVtYGNOn5NRxkf2lP+1F7QBLjmZ/6xtHOV+qpEuAAAAAElFTkSuQmCC"
				/>
			</defs>
			<use
				href="#img1"
				x="0"
				y="0"
			/>
		</svg>
	);

	const renderGoalDot = (props: any) => {
		const { cx, cy } = props;

		return (
			<g transform={`translate(${cx - 1.5}, ${cy})`}>
				<FlagSVG />
			</g>
		);
	};

	const handleMoveGraph = async (primaryGraphId: number, orderNumber: number, moveUp: boolean, isPrimaryGraphDef: boolean) => {
		if ((orderNumber === 1 && moveUp) || (orderNumber === highestOrderNumber && !moveUp)) return;

		const secondaryGraph = graphsData.find((graph) => graph.orderNumber + (moveUp ? 1 : -1) === orderNumber);
		const isSecondaryGraphDef = !!secondaryGraph?.defaultGraphOrderNumberId;
		const secondaryGraphId = secondaryGraph?.defaultGraphOrderNumberId || secondaryGraph?.graphId || -1;

		try {
			const res = await moveGraphReq({ primaryGraphId, secondaryGraphId, moveUp, isPrimaryGraphDef, isSecondaryGraphDef });

			if (res.status === 200) {
				setGraphsData((prev) => {
					const updatedGraphs = prev.map((graph) => {
						if ((!isPrimaryGraphDef && graph.graphId === primaryGraphId && graph.defaultGraphOrderNumberId === undefined) || (isPrimaryGraphDef && graph.defaultGraphOrderNumberId === primaryGraphId))
							return { ...graph, orderNumber: moveUp ? orderNumber - 1 : orderNumber + 1 };
						else if ((!isSecondaryGraphDef && graph.graphId === secondaryGraphId && graph.defaultGraphOrderNumberId === undefined) || (isSecondaryGraphDef && graph.defaultGraphOrderNumberId === secondaryGraphId))
							return { ...graph, orderNumber: orderNumber };
						else return graph;
					});

					updatedGraphs.sort((a, b) => b.orderNumber - a.orderNumber);

					let newMenuItems: { value: string; label: string }[] = [];

					updatedGraphs.forEach((graph) => {
						if (graph.orderNumber !== 0) {
							newMenuItems.push({
								value: graph.orderNumber.toString(),
								label: graph.graphLabel,
							});
						}
					});

					setMenuItems(newMenuItems);

					return updatedGraphs;
				});
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleHideDefGraph = async (defGraphId: number, orderNumber: number) => {
		try {
			const res = await hideDefGraphReq({ defGraphId, sportId: props.selectedSport.state?.sportId!, orderNumber });

			if (res.status === 200) {
				setGraphsData((prev) => {
					const updatedGraphs = prev.map((graph) => {
						if (graph.defaultGraphOrderNumberId === defGraphId) return { ...graph, orderNumber: 0 };
						else if (graph.orderNumber > orderNumber) return { ...graph, orderNumber: graph.orderNumber - 1 };
						else return graph;
					});

					updatedGraphs.sort((a, b) => a.orderNumber - b.orderNumber);

					let newMenuItems: { value: string; label: string }[] = [];

					updatedGraphs.forEach((graph) => {
						if (graph.orderNumber !== 0) {
							newMenuItems.push({
								value: graph.orderNumber.toString(),
								label: graph.graphLabel,
							});
						}
					});

					setMenuItems(newMenuItems);

					return updatedGraphs;
				});

				setHighestOrderNumber(highestOrderNumber - 1);
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleShowDefGraph = async (defGraphId: number) => {
		try {
			const res = await showDefGraphReq({ defGraphId, orderNumber: highestOrderNumber + 1 });

			if (res.status === 200) {
				let graphLabel;

				setGraphsData((prev) => {
					const updatedGraphs = prev.map((graph) => {
						if (graph.defaultGraphOrderNumberId === defGraphId) {
							graphLabel = graph.graphLabel;
							return { ...graph, orderNumber: highestOrderNumber + 1 };
						} else return graph;
					});

					updatedGraphs.sort((a, b) => a.orderNumber - b.orderNumber);

					return updatedGraphs;
				});

				setMenuItems([...menuItems, { value: (highestOrderNumber + 1).toString(), label: graphLabel || "" }]);

				setHighestOrderNumber(highestOrderNumber + 1);
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	//
	//	#region Select Comp
	//

	const SelectComp = () => {
		const [open, setOpen] = useState(false);

		const handleOpen = () => {
			setOpen(true);
		};

		const handleClose = () => {
			setOpen(false);
		};

		const handleChange = (event: SelectChangeEvent<string>) => {
			const value = event.target.value;

			setSelectedValue(value);

			handleClose();
		};

		return (
			<FormControl
				className=" -mt-1 mr-8"
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
					value={selectedValue || ""}
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
						<Box className="flex items-center gap-2 ml-0.5 -mr-6 ">
							<Typography
								className="text-lg"
								sx={{ opacity: 1 }}>
								{menuItems.find((item) => item.value === selectedValue)?.label}
							</Typography>
							<ButtonComp
								content={open ? IconEnum.ARROW_DROP_UP : IconEnum.ARROW_DROP_DOWN}
								style="-mt-0.5  mr-1 "
								color="text-[#fff]"
								size="small"
								onClick={handleOpen}
								externalClicked={{ state: open, setState: setOpen }}
							/>
						</Box>
					)}
					MenuProps={{
						PaperProps: {
							sx: {
								marginTop: "-0.15rem",
								marginLeft: "-0.3rem",
								backgroundColor: "#1E1E1E",
								borderRadius: "0.75rem",
								borderTopRightRadius: "0.25rem",
								fontWeight: 300,
							},
						},
						anchorOrigin: {
							vertical: "bottom",
							horizontal: "right",
						},
						transformOrigin: {
							vertical: "top",
							horizontal: "right",
						},
					}}>
					{menuItems.map((item) => (
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
							key={item.value}
							className={`py-1.5 hover:cursor-pointer transition-colors duration-150 w-full
								${context.bgSecondaryColor + context.bgHoverTertiaryColor}`}
							value={item.value}>
							{item.label}
						</MenuItem>
					))}
					{menuItems.length > 0 && !props.cannotEdit ? (
						<MenuItem
							disabled
							className="bg-gray-400 p-0 pt-[0.1rem] "
						/>
					) : null}

					{!props.cannotEdit ? (
						<MenuItem
							className={`py-1.5 hover:cursor-pointer transition-colors duration-150 w-full
							${context.bgSecondaryColor + context.bgHoverTertiaryColor}`}
							sx={{
								opacity: 1,
								"&.Mui-selected": {
									backgroundColor: context.colorSchemeCode === "red" ? "#4e3939" : context.colorSchemeCode === "blue" ? "#313c49" : context.colorSchemeCode === "green" ? "#284437" : "#414141",
								},
								"&.Mui-selected:hover": {
									backgroundColor: context.colorSchemeCode === "red" ? "#4e3939" : context.colorSchemeCode === "blue" ? "#313c49" : context.colorSchemeCode === "green" ? "#284437" : "#414141",
								},
							}}
							value="newGraph">
							<AddIcon
								className="text-green-500 scale-[1.15] -ml-2"
								fontSize="small"
								style={{
									filter: "drop-shadow(3px 3px 3px #00000060)",
								}}
							/>
							<Typography className="ml-2">Nový graf</Typography>
						</MenuItem>
					) : null}

					{props.selectedSport.state?.canUserEdit && !props.cannotEdit ? (
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
							className={`py-1.5 hover:cursor-pointer transition-colors duration-150 w-full
								${context.bgSecondaryColor + context.bgHoverTertiaryColor}`}
							value="newDefaultGraph">
							<AddIcon
								className="text-green-500 scale-[1.15] -ml-2"
								fontSize="small"
								style={{
									filter: "drop-shadow(3px 3px 3px #00000060)",
								}}
							/>
							<Typography className="ml-2">Nový výchozí graf</Typography>
						</MenuItem>
					) : null}

					{menuItems.length > 0 && !props.cannotEdit ? (
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
							className={`py-1.5 hover:cursor-pointer transition-colors duration-150 w-full
								${context.bgSecondaryColor + context.bgHoverTertiaryColor}`}
							value="reorderGraphs">
							<EditIcon
								className={`text-blue-500 scale-[0.9] -ml-2`}
								fontSize="small"
								style={{
									filter: "drop-shadow(3px 3px 3px #00000060)",
								}}
							/>
							<Typography className="ml-2">Úprava grafů</Typography>
						</MenuItem>
					) : null}
				</Select>
			</FormControl>
		);
	};
	//	#endregion
	//

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [showFirstSection, setShowFirstSection] = useState(props.cannotEdit ? false : true);

	return (
		<GeneralCard
			height="h-full "
			showBackButton={context.isSmallDevice}
			backButtonClick={() => context.setActiveSection(1)}
			disabled={!props.selectedSport.state}
			showFirstSection={{ state: showFirstSection, setState: setShowFirstSection }}
			firstTitle={props.cannotEdit ? "" : "Deník"}
			firstSideContent={
				props.selectedSport.state && !props.cannotEdit && showFirstSection
					? [
							<ButtonComp
								key={"edit"}
								style="ml-2 -mt-0.5"
								size="small"
								content={IconEnum.EDIT}
								onClick={() => {
									setDiaryEditing(!diaryEditing);
								}}
							/>,
					  ]
					: []
			}
			firstChildren={
				<Box className=" h-full mt-3">
					{diaryEditing ? (
						<Box className="relative">
							<TextField
								className="w-full"
								label="Obsah deníku"
								placeholder=" Zde je vhodné zaznamenat průběh tréninků, pocity během cvičení, dosažené výkony nebo poznámky k technice a regeneraci."
								multiline
								minRows={20}
								value={diaryContent}
								onChange={(e) => setDiaryContent(e.target.value)}
								onBlur={() => {
									changeDiaryContent(diary.diaryId);
								}}
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
					) : diaryContent.length > 1 ? (
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
								{diary.content || ""}
							</ReactMarkdown>
						</span>
					) : (
						<Typography className=" ml-2 text-lg font-light">Deník je prázdný.</Typography>
					)}

					{/*<Box className=" h-full flex gap-6">
						<ButtonComp
							content={IconEnum.PLUS}
							size="medium"
						/>

						<ButtonComp
							content={IconEnum.CHECK}
							size="medium"
						/>

						<ButtonComp
							content={IconEnum.EDIT}
							size="medium"
						/>

						<Box className="flex gap-2">
							<ButtonComp
								content={IconEnum.ARROW}
								size="medium"
								contentStyle="-rotate-90"
							/>
							<ButtonComp
								content={IconEnum.ARROW}
								size="medium"
								contentStyle="rotate-90"
							/>
						</Box>

						<Box className="flex gap-2">
							<ButtonComp
								content={IconEnum.CROSS}
								size="medium"
							/>
							<ButtonComp
								content={IconEnum.TRASH}
								size="medium"
							/>
						</Box>

						<Box className="flex gap-2">
							<ButtonComp
								content={IconEnum.ARROW_DROP_DOWN}
								size="medium"
							/>
							<ButtonComp
								content={IconEnum.ARROW_DROP_UP}
								size="medium"
							/>
						</Box>

						<Box className="flex gap-2">
							<ButtonComp
								content={IconEnum.EYE}
								size="medium"
							/>
							<ButtonComp
								content={IconEnum.EYE_HIDDEN}
								size="medium"
							/>
						</Box>

						<Box className="flex gap-2">
							<ButtonComp
								content={IconEnum.ARROW}
								contentStyle="-rotate-180"
								color="text-white"
								size="medium"
							/>
							<ButtonComp
								content={IconEnum.FLAG}
								size="medium"
							/>
							<ButtonComp
								content={IconEnum.CHART}
								size="medium"
							/>
							<ButtonComp
								content={IconEnum.PROFILE}
								size="medium"
							/>
							<ButtonComp
								content={IconEnum.SETTINGS}
								size="medium"
							/>
							<ButtonComp
								content={IconEnum.LOGOUT}
								size="medium"
							/>
						</Box>
					</Box>*/}

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
			secondTitle="Grafy"
			secondChildren={
				<Box className="h-full mt-2 ">
					{newGraph || newDefaultGraph || editGraph ? (
						<Box className="h-full w-full flex justify-center ">
							<Box className="w-2/3 ">
								<Box className="flex w-full pr-7 mb-6 mt-3 ">
									<ButtonComp
										contentStyle="scale-90"
										content={IconEnum.BACK}
										size="small"
										justClick
										onClick={() => {
											setNewGraph(false);
											setEditGraph(null);
											setNewDefaultGraph(false);
											setSelectedValue(previousSelectedValue);
										}}
									/>

									<Box className={`flex justify-center w-full -mt-1`}>
										<TextFieldWithIcon
											style="w-full ml-14 pr-6 h-6 "
											fontLight
											withoutIcon
											placeHolder={newDefaultGraph ? "Název výchozího grafu" : "Název grafu"}
											tfCenterValueAndPlaceholder
											fontSize="1.25rem"
											onClick={() => {}}
											previousValue={graphLabel}
											maxLength={50}
											helperText={helperTexts[HelperTextCodeEnum.GRAPH_LABEL]}
											dontDeleteValue
											customMargin="-mt-0"
											externalValue={{ state: graphLabel, setState: setGraphLabel }}
										/>
									</Box>

									<ButtonComp
										justClick
										content={IconEnum.CHECK}
										size="small"
										onClick={() => {
											if (editGraph) handleChangeGraph();
											else handleCreateGraph();
										}}
									/>
								</Box>

								{newDefaultGraph || !!editGraph?.defaultGraphOrderNumberId ? (
									<Typography className="mb-10  font-light pr-7 ">Vytváříš výchozí graf pro všechny uživatele tohoto sportu. Každý si do něj bude moct zaznamenávat své hodnoty a sledovat vlastní pokrok.</Typography>
								) : (
									<Typography className="mb-10  font-light pr-7 ">Navrhni si graf, který roste s tebou a sleduj, jak se mění tvé výsledky. Každá zaznamenaná hodnota tě posouvá blíž k cíli.</Typography>
								)}

								<Box className=" ">
									<Box className=" w-full  ">
										<Box className="w-full mt-8">
											<LabelAndValue
												mainStyle=""
												noPaddingLeft
												fontLight
												withoutIcon
												label="Osa X"
												placeHolder="Název horizontální osy X"
												value={hasDate ? "Datum" : xAxisLabel}
												textFieldValue={xAxisLabel}
												textFieldOnClick={(!hasDate && (() => {})) || undefined}
												maxLength={20}
												helperText={helperTexts[HelperTextCodeEnum.X_AXIS_LABEL]}
												externalValue={{ state: xAxisLabel, setState: setXAxisLabel }}
											/>

											<FormControlLabel
												className="ml-[3.9rem] mt-3"
												control={
													<Checkbox
														checked={!!hasDate}
														onChange={() => {
															setHasDate(!hasDate);
														}}
													/>
												}
												label={hasDate ? "Osa X je datum" : "Osa X není datum"}
											/>

											{!editGraph?.hasDate && hasDate && editGraph ? (
												<Box>
													<Typography className="font-light mt-3 ">
														Jelikož jste změnil osu X na datum, tak hodnoty osy X všech existujících záznamů budou nastaveny na dnešní datum, které lze po úpravě grafu změnit.
													</Typography>
													<Typography className="font-light mt-3 text-[#FF7667]">Po uložení je navrácení původního hodnot nemožné!</Typography>
												</Box>
											) : null}
										</Box>
										<Box className="w-full mt-10">
											<LabelAndValue
												textFieldValue={yAxisLabel}
												withoutIcon
												noPaddingLeft
												fontLight
												noPaddingTop
												label="Osa Y"
												placeHolder="Název vertikální osy Y"
												textFieldOnClick={() => {}}
												maxLength={20}
												helperText={helperTexts[HelperTextCodeEnum.Y_AXIS_LABEL]}
												externalValue={{ state: yAxisLabel, setState: setYAxisLabel }}
											/>
											<Typography className="font-light ml-[4.6rem] mt-4">Hodnoty osy Y musí být číselné.</Typography>
										</Box>
										<Box className="w-full mt-10">
											<LabelAndValue
												value={unit}
												textFieldValue={unit}
												withoutIcon
												noPaddingLeft
												fontLight
												noPaddingTop
												label="Jednotka"
												placeHolder="Zkratka jednotky hodnot osy Y"
												textFieldOnClick={() => {}}
												maxLength={5}
												externalValue={{ state: unit, setState: setUnit }}
											/>
										</Box>
									</Box>

									<Box className=" w-full mt-12 ">
										<Box className={`w-full `}>
											{!hasDate && <Typography className="font-light   mb-0 pr-7">Pro aktivaci je nutné mít nastavenou osu X na datum.</Typography>}

											<FormControlLabel
												disabled={!hasDate}
												control={
													<Checkbox
														checked={!!hasGoals}
														onChange={() => {
															setHasGoals(!hasGoals);
														}}
													/>
												}
												label={hasGoals ? "Nastavování cílů zapnuto" : "Nastavování cílů vypnuto"}
											/>

											<Typography
												className={`font-light  mb-2 pr-7
														${!hasDate && "opacity-30"}`}>
												Zaškrtnutím povolíte možnost nastavení cílů pro váš graf, které vám pomůžou sledovat váš pokrok. Cíl je označen vlajkou.
											</Typography>
										</Box>
									</Box>

									{editGraph ? (
										<Box className="mt-12 flex items-center  gap-4">
											<ButtonComp
												contentStyle="scale-[1.1]"
												content={IconEnum.TRASH}
												onClick={handleDeleteGraph}
												size="small"
											/>

											<Typography className="font-light  text-[#FF7667]">Odstranění grafu je nevratné!</Typography>
										</Box>
									) : null}
								</Box>
							</Box>
						</Box>
					) : reorderGraphs ? (
						<Box className="h-full w-full flex justify-center ">
							<Box className="w-2/3 ">
								<Box className="flex  justify-center items-center w-full  mb-4 -ml-6">
									<ButtonComp
										contentStyle="scale-90"
										content={IconEnum.BACK}
										size="small"
										justClick
										onClick={() => {
											setReorderGraphs(false);

											if (menuItems.length > 0) setSelectedValue(menuItems[0].value);
											props.isDisabledFirstSection.setState(false);
										}}
									/>

									<Typography className=" ml-4 mt-1 text-[1.5rem] ">Úprava grafů</Typography>
								</Box>

								<Typography className="mb-3 font-light  ">
									Nastavte si pořadí vlastních i výchozích grafů tak, jak vám to nejvíce vyhovuje. Výchozí grafy, které nepotřebujete, můžete jednoduše skrýt. Skryté grafy nezmizí úplně, můžete je kdykoli znovu zobrazit.
								</Typography>
								<Typography className="mb-2 font-light  ">Kromě toho můžete upravit i základní vlastnosti jednotlivých grafů, které jste zvolili při jejich vytváření.</Typography>

								{graphsData

									.filter((graph) => graph.orderNumber !== 0)
									.map((graph) => {
										return (
											<Box
												key={graph.defaultGraphOrderNumberId ? "D" + graph.graphId : graph.graphId}
												className="py-4 px-4">
												<Box className="flex items-center">
													{graph.defaultGraphOrderNumberId && !props.selectedSport.state?.canUserEdit ? null : (
														<ButtonComp
															style="mr-4 "
															content={IconEnum.EDIT}
															size="small"
															onClick={() => {
																editGraphPrerequisites(graph);
															}}
														/>
													)}

													<Typography className={`mr-4 ${graph.defaultGraphOrderNumberId && !props.selectedSport.state?.canUserEdit && "ml-[2.6rem]"}`}>{graph.graphLabel}</Typography>
													<Box className="ml-auto flex gap-4">
														{graph.defaultGraphOrderNumberId ? (
															<ButtonComp
																style="mr-4 "
																justClick
																dontChangeOutline
																hidden={graph.defaultGraphOrderNumberId ? false : true}
																disabled={graph.defaultGraphOrderNumberId ? false : true}
																content={IconEnum.EYE}
																size="small"
																onClick={() => handleHideDefGraph(graph.defaultGraphOrderNumberId!, graph.orderNumber)}
															/>
														) : null}

														<ButtonComp
															justClick
															dontChangeOutline
															disabled={graph.orderNumber === highestOrderNumber}
															content={IconEnum.ARROW}
															contentStyle="-rotate-90 scale-[1.16]"
															size="small"
															onClick={() => handleMoveGraph(graph.defaultGraphOrderNumberId || graph.graphId, graph.orderNumber, false, !!graph.defaultGraphOrderNumberId)}
														/>

														<ButtonComp
															justClick
															dontChangeOutline
															content={IconEnum.ARROW}
															contentStyle="rotate-90 scale-[1.16]"
															disabled={graph.orderNumber === 1}
															size="small"
															onClick={() => handleMoveGraph(graph.defaultGraphOrderNumberId || graph.graphId, graph.orderNumber, true, !!graph.defaultGraphOrderNumberId)}
														/>
													</Box>
												</Box>
											</Box>
										);
									})}

								{graphsData.filter((graph) => graph.orderNumber === 0).length > 0 ? <Typography className="font-light text-xl mt-12">Skryté výchozí grafy</Typography> : null}

								{graphsData
									.filter((graph) => graph.orderNumber === 0)
									.map((graph) => {
										return (
											<Box
												key={"D" + graph.graphId}
												className="py-4 px-5">
												<Box className="flex">
													{graph.defaultGraphOrderNumberId && !props.selectedSport.state?.canUserEdit ? null : (
														<ButtonComp
															style="mr-4 "
															content={IconEnum.EDIT}
															size="small"
															onClick={() => {
																editGraphPrerequisites(graph);
															}}
														/>
													)}

													<Typography className="mr-auto">{graph.graphLabel}</Typography>
													<ButtonComp
														style="ml-4 mr-4"
														justClick
														dontChangeOutline
														hidden={graph.defaultGraphOrderNumberId ? false : true}
														disabled={graph.defaultGraphOrderNumberId ? false : true}
														content={IconEnum.EYE_HIDDEN}
														size="small"
														onClick={() => handleShowDefGraph(graph.defaultGraphOrderNumberId!)}
													/>
												</Box>
											</Box>
										);
									})}
							</Box>
						</Box>
					) : (
						<Box className="h-full">
							<Box>
								{menuItems.length > 0 ? (
									/*
									<FormControl
										className="mr-10 w-fit  "
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
											value={selectedValue || ""}
											onChange={handleChange}
											displayEmpty
											//placeholder="Vyberte graf"
											className="text-lg h-[2rem] pr-1 "
											disableUnderline
											sx={{
												"& .MuiSelect-select": {
													backgroundColor: "transparent !important",
												},
											}}
											IconComponent={() => (
												<ButtonComp
													content={open ? IconEnum.ARROW_DROP_UP : IconEnum.ARROW_DROP_DOWN}
													style=" min-w-7 max-w-7 -ml-5 -mt-1 "
													size="medium"
													color="text-[#fff]"
													onClick={handleOpen}
													externalClicked={{ state: open, setState: setOpen }}
												/>
											)}
											MenuProps={{
												anchorOrigin: {
													vertical: "bottom",
													horizontal: "right",
												},
												transformOrigin: {
													vertical: "top",
													horizontal: "right",
												},
											}}>
											{menuItems.map((item) => (
												<MenuItem
													key={item.value}
													value={item.value}>
													{item.label}
												</MenuItem>
											))}
											{menuItems.length > 0 && !props.cannotEdit ? (
												<MenuItem
													disabled
													className="bg-gray-400 p-0 pt-[0.1rem] "
												/>
											) : null}

											{!props.cannotEdit ? (
												<MenuItem
													className=""
													value="newGraph">
													<AddIcon
														className="text-green-500 scale-[1.15] -ml-2"
														fontSize="small"
														style={{
															filter: "drop-shadow(3px 3px 3px #00000060)",
														}}
													/>
													<Typography className="ml-2">Nový graf</Typography>
												</MenuItem>
											) : null}

											{props.selectedSport.state?.canUserEdit && !props.cannotEdit ? (
												<MenuItem
													className=""
													value="newDefaultGraph">
													<AddIcon
														className="text-green-500 scale-[1.15] -ml-2"
														fontSize="small"
														style={{
															filter: "drop-shadow(3px 3px 3px #00000060)",
														}}
													/>
													<Typography className="ml-2">Nový výchozí graf</Typography>
												</MenuItem>
											) : null}

											{menuItems.length > 0 && !props.cannotEdit ? (
												<MenuItem
													className=""
													value="reorderGraphs">
													<EditIcon
														className={`text-blue-500 scale-[0.9] -ml-2`}
														fontSize="small"
														style={{
															filter: "drop-shadow(3px 3px 3px #00000060)",
														}}
													/>
													<Typography className="ml-2">Úprava grafů</Typography>
												</MenuItem>
											) : null}
										</Select>
									</FormControl>*/
									<Box className={`flex ${context.isSmallDevice && menuItems.length > 0 ? "justify-between" : "justify-end"}`}>
										{context.isSmallDevice ? (
											<ButtonComp
												content={"Upravit záznamy"}
												justClick
												dontChangeOutline
												onClick={() => context.setActiveSection(3)}
												size="medium"
											/>
										) : null}

										<SelectComp />
									</Box>
								) : !props.cannotEdit ? (
									<Box className="flex justify-end gap-4">
										<ButtonComp
											content={"Nový graf"}
											size="medium"
											secondContent={IconEnum.PLUS}
											onClick={() => {
												setPreviousSelectedValue(selectedValue);
												setSelectedValue("newGraph");
											}}
											secondContentStyle="mr-1"
										/>
										{props.selectedSport.state?.canUserEdit ? (
											<ButtonComp
												size="medium"
												secondContent={IconEnum.PLUS}
												content={"Nový výchozí graf"}
												onClick={() => {
													setPreviousSelectedValue(selectedValue);
													setSelectedValue("newDefaultGraph");
												}}
												secondContentStyle="mr-1"
											/>
										) : null}
									</Box>
								) : null}
							</Box>

							<Box className="h-[calc(100%-2rem)] flex justify-center items-center">
								{props.selectedGraph.state?.graphValues && props.selectedGraph.state?.graphValues.length > 1 ? (
									props.selectedGraph.state.hasDate ? (
										<ResponsiveContainer
										className={`pt-4`}
											height="98%"
											width="100%">
											<LineChart
												data={formattedData}
												margin={{ top: 10, right: 30, bottom: 10, left: 25 }}>
												<CartesianGrid
													stroke={cartesianStroke}
													strokeDasharray="10 25"
												/>
												<XAxis
													dataKey="date"
													type="number"
													domain={[minTimestamp, maxTimestamp]}
													ticks={dateTicks}
													stroke={lineStroke}
													tick={{ dy: 10 }}
													tickFormatter={(tick) => {
														const date = new Date(tick);
														const day = date.getDate();
														const month = date.getMonth() + 1;
														const year = date.getFullYear();

														const showYear = tickLastYearRef.current !== year;
														tickLastYearRef.current = year;

														const formatted = `${day}.${month}${showYear ? "." + year : ""}`;
														return formatted;
													}}
												/>
												<YAxis
													stroke={lineStroke}
													domain={[minWeight, maxWeight]}
													ticks={generateTicks(props.selectedGraph.state?.graphValues.map((entry) => entry.yAxisValue))}
													width={30}
													tick={{ dx: -10 }}
												/>
												<Tooltip
													content={({ active, payload }) => {
														if (active && payload && payload.length) {
															const dataPoint = payload[0].payload;
															const originalDate = dataPoint.originalDate;
															const isGoal = dataPoint.isGoal;

															const [day, month, year] = originalDate.split(".");
															const formattedDay = day.startsWith("0") ? day[1] : day;
															const formattedMonth = month.startsWith("0") ? month[1] : month;
															const formattedDate = `${formattedDay}. ${formattedMonth}. ${year}`;

															return (
																<Box className={`bg-navigation-color-neutral p-1 mt-3 border-2 shadow rounded ${context.bgTertiaryColor + context.borderTertiaryColor} ${""}`}>
																	<DoubleLabelAndValue
																		style="items-center"
																		goal={isGoal ? "Cíl" : "Záznam"}
																		firstLabel={props.selectedGraph.state?.yAxisLabel || ""}
																		firstValue={payload[0].value + (props.selectedGraph.state?.unit ? " " + props.selectedGraph.state?.unit : "")}
																		secondLabel={props.selectedGraph.state?.xAxisLabel || ""}
																		secondValue={formattedDate}
																	/>
																</Box>
															);
														}
														return null;
													}}
												/>
												<Line
													type="monotone"
													dataKey="yAxisValue"
													data={nonGoalValues}
													stroke={lineStroke}
												/>
												{goalValues.length > 0 && (
													<Line
														type="monotone"
														dataKey="yAxisValue"
														data={goalValues}
														stroke="#ffffff00" // Například průhledná čára
														dot={<Customized component={renderGoalDot} />} // Použití vlastní komponenty pro tvar bodu
														activeDot={false}
													/>
												)}
											</LineChart>
										</ResponsiveContainer>
									) : (
										<ResponsiveContainer
										className={`pt-4`}
											height="98%"
											width="100%">
											<LineChart
												data={props.selectedGraph.state?.graphValues || []}
												margin={{ top: 10, right: 30, bottom: 10, left: 25 }}>
												<CartesianGrid
													stroke={cartesianStroke}
													strokeDasharray="10 25"
												/>
												<XAxis
													dataKey="xAxisValue"
													stroke={lineStroke}
													tick={{
														dy: 10,
													}}
												/>
												<YAxis
													type="number"
													stroke={lineStroke}
													tick={{ dx: -6 }}
													width={30}
													ticks={generateTicks(props.selectedGraph.state?.graphValues.map((entry) => entry.yAxisValue))}
													domain={["dataMin", "dataMax"]}
													allowDecimals={false}
												/>

												<Tooltip
													content={({ active, payload }) => {
														if (active && payload && payload.length) {
															const dataPoint = payload[0].payload;

															return (
																<Box className="bg-navigation-color-neutral p-1 mt-3 border-2 shadow rounded">
																	<DoubleLabelAndValue
																		goal={"Záznam"}
																		style="items-center"
																		firstLabel={props.selectedGraph.state?.yAxisLabel || ""}
																		firstValue={payload[0].value + (props.selectedGraph.state?.unit ? " " + props.selectedGraph.state.unit : "")}
																		secondLabel={props.selectedGraph.state?.xAxisLabel || ""}
																		secondValue={`${dataPoint.xAxisValue}`}
																	/>
																</Box>
															);
														}
														return null;
													}}
												/>
												<Line
													type="monotone"
													dataKey="yAxisValue"
													stroke={lineStroke}
													dot={true}
												/>
											</LineChart>
										</ResponsiveContainer>
									)
								) : menuItems.length > 0 ? (
									!props.cannotEdit ? (
										<Box className=" h-1/3 ">
											<Typography className="font-light text-2xl -ml-8	">↖</Typography>

											<Typography className="font-light text-xl">Pro zobrazení grafu přidejte alespoň 2 záznamy.</Typography>
										</Box>
									) : (
										<Box className=" h-1/3 ">
											<Typography className="font-light text-xl">Pro vybraný graf uživatel nemá alespoň 2 záznamy.</Typography>
										</Box>
									)
								) : !props.cannotEdit ? (
									<Box className=" h-1/3  flex flex-col items-center">
										<Typography className="font-light text-2xl -mt-2 pb-2 ml-8	">↗</Typography>

										<Typography className="font-light text-xl">Pro sledování pokroku je nutné si vytvořit nový graf.</Typography>
									</Box>
								) : (
									<Box className=" h-1/3 ">
										<Typography className="font-light text-xl">Uživatel nemá žádné grafy.</Typography>
									</Box>
								)}
							</Box>
						</Box>
					)}
				</Box>
			}
		/>
	);
};

export default DiaryAndGraphs;
