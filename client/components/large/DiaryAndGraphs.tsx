import { changeDiaryContentReq } from "@/api/change/changeDiaryContentReq";
import { createDefaultGraphReq } from "@/api/create/createDefaultGraphReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { getDiaryReq } from "@/api/get/getDiaryReq";
import { getGraphsReq } from "@/api/get/getGraphsReq";
import { Sport } from "@/api/get/getSportsReq";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Checkbox, FormControl, FormControlLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Brush, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import remarkBreaks from "remark-breaks";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import DoubleLabelAndValue from "../small/DoubleLabelAndValue";
import LabelAndValue from "../small/LabelAndValue";
import TextFieldWithIcon from "../small/TextFieldWithIcon";
import GeneralCard from "./GeneralCard";

interface Props {
	selectedSport: StateAndSetFunction<Sport | null>;
}

export interface Diary {
	diaryId: number;
	sportId: number;
	content: string;
}

interface GraphValue {
	graphValueId: number;

	firstValue: number;
	secondValue: string;
}

export interface Graph {
	graphId: number;

	graphLabel: string;
	orderNumber: number;
	hasDate?: boolean;
	defaultGraphOrderNumberId?: number;

	yAxisLabel: string;
	xAxisLabel: string;

	graphValue: GraphValue[];
}

const DiaryAndGraphs = (props: Props) => {
	useEffect(() => {
		if (props.selectedSport.state) {
			getDiary(props.selectedSport.state.sportId);

			getGraphs(props.selectedSport.state.sportId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.selectedSport.state]);

	// #region Diary

	const [diary, setDiary] = useState<Diary>({ diaryId: -1, sportId: -1, content: "" });
	const [diaryContent, setDiaryContent] = useState<string>("");

	const [diaryEditing, setDiaryEditing] = useState(false);

	useEffect(() => {
		setDiaryContent(diary.content);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [diaryEditing]);

	const getDiary = async (sportId: number) => {
		try {
			const res = await getDiaryReq({ sportId });

			if (res.status === 200 && res.data) {
				setDiary(res.data);
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
	const [actualGraph, setActualGraph] = useState<Graph>();

	const [graphEditing, setGraphEditing] = useState(false);
	const [sportGraphEditing, setSportGraphEditing] = useState(false);
	const [hasDate, setHasDate] = useState(false);

	const [reorderGraphs, setReorderGraphs] = useState(false);

	const [selectedValue, setSelectedValue] = useState("");

	const [menuItems, setMenuItems] = useState<{ value: string; label: string }[]>([]);

	const handleChange = (event: SelectChangeEvent) => {
		setSelectedValue(event.target.value);
	};

	useEffect(() => {
		if (selectedValue === "newGraph") {
			setSelectedValue("");
			setGraphEditing(true);
		} else if (selectedValue === "newDefaultGraph") {
			setSelectedValue("");
			createNewDefaultGraph();
			setSportGraphEditing(true);
		} else if (selectedValue === "reorderGraphs") {
			setSelectedValue("");
			setReorderGraphs(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedValue]);

	const getGraphs = async (sportId: number) => {
		try {
			const res = await getGraphsReq({ sportId });

			if (res.status === 200 && res.data) {
				setGraphsData(res.data);

				let newMenuItems: { value: string; label: string }[] = [];

				res.data.forEach((graph) => {
					newMenuItems.push({
						value: graph.defaultGraphOrderNumberId ? "D" + graph.defaultGraphOrderNumberId.toString() : graph.graphId.toString(),
						label: graph.graphLabel,
					});
				});

				setMenuItems(newMenuItems);

				console.log(menuItems);

				const selectedVal = newMenuItems.find((item) => item.value.match("1"));

				setSelectedValue(selectedVal?.value || "");
			} else {
				setMenuItems([]);
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const createNewDefaultGraph = async () => {
		try {
			const res = await createDefaultGraphReq({ sportId: props.selectedSport.state?.sportId! });

			if (res.status === 200 && res.data) {
				setActualGraph({
					graphId: res.data.grapId,

					graphLabel: res.data.graphLabel,
					orderNumber: 1,
					hasDate: false,

					yAxisLabel: "",
					xAxisLabel: "",

					graphValue: [],
				});
			}

			console.log(actualGraph);

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	// #endregion

	return (
		<GeneralCard
			height="h-full "
			firstTitle="Deník"
			firstSideContent={[
				<ButtonComp
					key={"edit"}
					style="ml-2 mt-1"
					size="medium"
					icon={IconEnum.EDIT}
					onClick={() => {
						setDiaryEditing(!diaryEditing);
					}}
				/>,
			]}
			firstChildren={
				<Box className=" h-full ">
					{diaryEditing ? (
						<TextField
							className="w-full"
							placeholder="Obsah deníku"
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
					) : (
						<span className="react-markdown break-words font-light">
							<ReactMarkdown
								remarkPlugins={[remarkBreaks]}
								components={{
									p: ({ children }) => <p className="font-light">{children}</p>,
									ul: ({ children }) => <ul className="list-disc pl-8 mt-1 space-y-1">{children}</ul>,
									ol: ({ children }) => <ol className="list-decimal pl-8 mt-1 space-y-1">{children}</ol>,
									li: ({ children }) => <li className="mb-0">{children}</li>,
									h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
									h2: ({ children }) => <h2 className="text-2xl font-semibold">{children}</h2>,
									h3: ({ children }) => <h3 className="text-xl font-medium">{children}</h3>,
								}}>
								{diary.content || ""}
							</ReactMarkdown>
						</span>
					)}
				</Box>
			}
			secondTitle="Grafy"
			secondChildren={
				<Box className="h-full mt-2 ">
					{graphEditing || sportGraphEditing ? (
						<Box className="h-full">
							<Box className="flex">
								<TextFieldWithIcon
									style="w-2/5  "
									placeHolder="Název grafu"
									onClick={() => {}}
									previousValue={actualGraph?.graphLabel}></TextFieldWithIcon>
							</Box>
							<Box className=" w-full ">
								<Box className="w-2/5 pl-2">
									<LabelAndValue
										noPaddingTop
										label="Osa Y"
										placeHolder="Název vertikální osy Y"
										textFieldOnClick={() => {}}
									/>
								</Box>

								<Box className="w-2/5 pl-2">
									<LabelAndValue
										label="Osa X"
										placeHolder="Název horizontální osy X"
										value="Datum"
										textFieldOnClick={(!hasDate && (() => {})) || undefined}
									/>

									<FormControlLabel
										className="w-full  ml-[4.3rem]"
										control={
											<Checkbox
												checked={hasDate}
												onChange={() => {
													setHasDate(!hasDate);
												}}
											/>
										}
										label={hasDate ? "Osa X je datum" : "Osa X není datum"}
									/>
								</Box>
							</Box>
						</Box>
					) : reorderGraphs ? (
						<Box className="h-full"></Box>
					) : (
						<Box className="h-full">
							<Box className="flex justify-end ">
								<FormControl
									className="mr-10 w-fit  "
									variant="standard"
									sx={{
										"& .MuiSelect-select": { backgroundColor: "transparent" }, // Průhlednost textového pole
									}}>
									<Select
										value={selectedValue}
										onChange={handleChange}
										placeholder="Vyberte si graf"
										className="text-lg h-[2rem] pr-1 "
										disableUnderline
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
										<MenuItem
											disabled
											className="bg-gray-400 p-0 pt-[0.1rem] "
										/>
										<MenuItem
											className=""
											value="newGraph">
											<Typography className="mr-2">Nový graf</Typography>
											<AddIcon
												className="text-green-500 ml-auto"
												fontSize="small"
											/>
										</MenuItem>
										<MenuItem
											className=""
											value="newDefaultGraph">
											<Typography className="mr-2">Nový výchozí graf</Typography>
											<AddIcon
												className="text-green-500 ml-auto"
												fontSize="small"
											/>
										</MenuItem>

										<MenuItem
											className=""
											value="reorderGraphs">
											<Typography className="mr-2">Přeuspořádat grafy</Typography>

											<EditIcon
												className={`text-blue-500 scale-60`}
												fontSize="small"
											/>
										</MenuItem>
									</Select>
								</FormControl>
							</Box>

							<Box className="h-[calc(100%-2rem)] flex justify-center items-center">
								<ResponsiveContainer
									height="98%"
									width="100%">
									<LineChart
										data={weightData}
										margin={{ top: 10, right: 50, bottom: 10, left: 25 }}>
										<CartesianGrid
											stroke="#e5e7eb"
											strokeDasharray="20 20"
										/>
										<XAxis
											dataKey="date"
											height={50}
										/>
										<YAxis
											domain={["auto", "auto"]}
											width={30}
										/>
										<Tooltip
											cursor={{ stroke: "#007bff" }}
											content={({ active, payload }) => {
												if (active && payload && payload.length) {
													return (
														<Box className="bg-white p-1 mt-3 border border-gray-400 shadow rounded ">
															<DoubleLabelAndValue
																firstLabel={"Date"}
																firstValue={payload[0].payload.date}
																secondLabel={"Weight"}
																secondValue={payload[0].value + "kg"}></DoubleLabelAndValue>
														</Box>
													);
												}
												return null;
											}}
										/>

										<Line
											type="monotone"
											dataKey="weight"
											stroke="#007bff"
											dot={{ r: 3 }}
										/>
										<Brush
											dataKey="date"
											height={20}
											stroke="#007bff"
										/>
									</LineChart>
								</ResponsiveContainer>
							</Box>
						</Box>
					)}
				</Box>
			}
		/>
	);
};

const weightData = [
	{ date: "10.1.", weight: 80 },
	{ date: "12.1.", weight: 110 },
	{ date: "13.1.", weight: 100 },
	{ date: "20.1.", weight: 130 },
	{ date: "5.5.", weight: 140 },
	{ date: "6.6.", weight: 145 },
	{ date: "7.7.", weight: 150 },
	{ date: "8.8.", weight: 155 },
	{ date: "9.9.", weight: 160 },
	{ date: "10.10.", weight: 165 },
	{ date: "11.11.", weight: 170 },
	{ date: "12.12.", weight: 175 },
	{ date: "13.1.", weight: 180 },
	{ date: "14.2.", weight: 185 },
	{ date: "15.3.", weight: 190 },
	{ date: "16.4.", weight: 195 },
	{ date: "17.5.", weight: 200 },
	{ date: "18.6.", weight: 205 },
	{ date: "19.7.", weight: 210 },
	{ date: "20.8.", weight: 215 },
	{ date: "21.9.", weight: 220 },
	{ date: "22.10.", weight: 225 },
	{ date: "23.11.", weight: 230 },
	{ date: "24.12.", weight: 235 },
];

export default DiaryAndGraphs;
