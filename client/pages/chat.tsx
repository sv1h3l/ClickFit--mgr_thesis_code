import { changeSharedSportReq } from "@/api/change/changeSharedSportReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { getAllUserAtrsReq } from "@/api/get/getAllUserAtrsReq";
import { getConnectedUserAndMessagesReq } from "@/api/get/getConnectedUserAndMessagesReq";
import { getOwnedSportsReq } from "@/api/get/getOwnedSportsReq";
import { getSharedSportsReq, SharedSport } from "@/api/get/getSharedSportsReq";
import { Sport } from "@/api/get/getSportsReq";
import GeneralCard from "@/components/large/GeneralCard";
import TwoColumnsPage from "@/components/large/TwoColumnsPage";
import ButtonComp, { IconEnum } from "@/components/small/ButtonComp";
import CustomModal from "@/components/small/CustomModal";
import LabelAndValue from "@/components/small/LabelAndValue";
import { useAppContext } from "@/utilities/Context";
import { Box, TextField, Typography } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ConnectedUser } from "./connection";

const cookie = require("cookie");

interface Props {
	userId: number;
	userName: string;

	connectedUser: ConnectedUser;

	messages: Message[];

	ownedSports: Sport[];
	sharedSports: SharedSport[];
}

export interface Message {
	messageId: number;
	connectionId: number;
	userId: number;

	message: string;
	imageUrl?: string;
	createdAt: string;
}

const Chat = (props: Props) => {
	const router = useRouter();
	const [messages, setMessages] = useState<Message[]>(props.messages);
	const [newMessage, setNewMessage] = useState("");
	const wsRef = useRef<WebSocket | null>(null);

	const [sharedSport, setSharedSport] = useState<SharedSport[]>(props.sharedSports);

	const [connectionId, setConnectionId] = useState<number | null>(null);

	useEffect(() => {
		const cookies = cookie.parse(document.cookie || "");
		const connId = Number(cookies.chat_ci);
		if (!isNaN(connId)) {
			setConnectionId(connId);
		}
	}, []);

	useEffect(() => {
		const ws = new WebSocket("ws://10.0.0.99:5000");
		wsRef.current = ws;

		ws.onopen = () => {
			console.log("WebSocket otevřen");
			ws.send(JSON.stringify({ type: "joinChat", chatId: connectionId, userId: props.userId }));
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === "receiveMessage") {
					setMessages((prev) => [...prev, data.message]);
				}
			} catch (e) {
				console.error("Chyba při zpracování zprávy:", e);
			}
		};

		ws.onclose = () => {
			console.log("WebSocket zavřen");
		};

		ws.onerror = (err) => {
			console.error("Chyba WebSocket:", err);
		};

		return () => {
			ws.close();
		};
	}, [connectionId]);

	const handleSend = () => {
		if (newMessage.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(
				JSON.stringify({
					type: "sendMessage",
					message: {
						chatId: connectionId,
						userId: props.userId,
						message: newMessage,
					},
				})
			);
			setNewMessage("");
		}
	};

	const context = useAppContext();

	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "auto" });
		}
	}, []);

	const handleShareSport = async (sportIsShared: boolean, sportId: number) => {
		try {
			const response = await changeSharedSportReq({
				sportId,
				sportIsShared,
				userId: props.connectedUser.connectedUserId,
			});

			if (response.status === 200) {
				if (sportIsShared) {
					setSharedSport((prev) => prev.filter((sport) => sport.sportId !== sportId));
				} else {
					const newSharedSport: SharedSport = {
						sharedSportId: response.data?.sharedSportId!,
						sportId: sportId,
						userId: props.connectedUser.connectionId,
						authorId: props.userId,
					};

					setSharedSport((prev) => [...prev, newSharedSport]);
				}
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const [isModalOpened, setIsModalOpened] = useState(false);

	return (
		<>
			<Head>
				<title>Chat - KlikFit</title>
			</Head>

			<TwoColumnsPage
				firstColumnWidth="w-full max-w-[60rem] items-center "
				firstColumnHeight="h-full"
				secondColumnWidth="w-0"
				firstColumnChildren={
					<Box className="h-full relative">
						<GeneralCard
							zeroYPadding
							zeroXPadding
							zeroChildrenPadding
							dontShowHr
							style={` mb-[0.5rem] w-full overflow-x-hidden
									${context.windowWidth < 768 ? "h-[5rem]" : "h-[3rem]"}`}
							firstChildren={
								context.windowWidth < 768 ? (
									<Box className="flex flex-col justify-center  items-center h-full">
										<Box className="flex justify-between w-full -mt-1">
											<Box className="ml-3 mr-auto">
												<ButtonComp
													size="small"
													color="text-[#eDeDeD]"
													justClick
													dontChangeOutline
													contentStyle="rotate-180 scale-[1.2]"
													content={IconEnum.ARROW}
													onClick={() => {
														router.push(`/connection`);
													}}
												/>
											</Box>
											<Box className="mr-3 ml-auto flex gap-4">
												{props.ownedSports.length > 0 ? (
													<ButtonComp
														size="small"
														justClick
														dontChangeOutline
														contentStyle="scale-[1.1]"
														content={IconEnum.SHARE}
														onClick={() => {
															setIsModalOpened(true);
														}}
													/>
												) : null}

												<ButtonComp
													size="small"
													justClick
													dontChangeOutline
													contentStyle="scale-[1.1]"
													content={IconEnum.TRAININGS}
													onClick={() => {
														document.cookie = `view_tmp=${btoa(props.connectedUser.connectedUserId.toString()!)}; path=/; max-age=1200; `;
														router.push("/training-plans");
													}}
												/>
												<ButtonComp
													size="small"
													justClick
													dontChangeOutline
													contentStyle="scale-[1.1]"
													content={IconEnum.CHART}
													onClick={() => {
														document.cookie = `view_tmp=${btoa(props.connectedUser.connectedUserId.toString()!)}; path=/; max-age=1200; `;
														router.push("/diary");
													}}
												/>
												<ButtonComp
													size="small"
													justClick
													dontChangeOutline
													contentStyle="scale-[1.1]"
													content={IconEnum.PROFILE}
													onClick={() => {
														document.cookie = `view_tmp=${btoa(props.connectedUser.connectedUserId.toString()!)}; path=/; max-age=1200; `;
														router.push("/profile");
													}}
												/>
											</Box>
										</Box>

										<Typography className="-mb-2 mt-2 text-xl font-audiowide">{props.connectedUser.connectedUserFirstName + " " + props.connectedUser.connectedUserLastName}</Typography>
									</Box>
								) : (
									<Box className="flex justify-between  items-center h-full">
										<Box className="ml-5 mr-auto">
											<ButtonComp
												size="small"
												color="text-[#eDeDeD]"
												justClick
												dontChangeOutline
												contentStyle="rotate-180 scale-[1.2]"
												content={IconEnum.ARROW}
												onClick={() => {
													router.push(`/connection`);
												}}
											/>
										</Box>
										<Typography className="ml-28 text-xl font-audiowide">{props.connectedUser.connectedUserFirstName + " " + props.connectedUser.connectedUserLastName}</Typography>
										<Box className="mr-5 ml-auto flex gap-4">
											{props.ownedSports.length > 0 ? (
												<ButtonComp
													size="small"
													justClick
													dontChangeOutline
													contentStyle="scale-[1.1]"
													content={IconEnum.SHARE}
													onClick={() => {
														setIsModalOpened(true);
													}}
												/>
											) : null}

											<ButtonComp
												size="small"
												justClick
												dontChangeOutline
												contentStyle="scale-[1.1]"
												content={IconEnum.TRAININGS}
												onClick={() => {
													document.cookie = `view_tmp=${btoa(props.connectedUser.connectedUserId.toString()!)}; path=/; max-age=1200; `;
													router.push("/training-plans");
												}}
											/>
											<ButtonComp
												size="small"
												justClick
												dontChangeOutline
												contentStyle="scale-[1.1]"
												content={IconEnum.CHART}
												onClick={() => {
													document.cookie = `view_tmp=${btoa(props.connectedUser.connectedUserId.toString()!)}; path=/; max-age=1200; `;
													router.push("/diary");
												}}
											/>
											<ButtonComp
												size="small"
												justClick
												dontChangeOutline
												contentStyle="scale-[1.1]"
												content={IconEnum.PROFILE}
												onClick={() => {
													document.cookie = `view_tmp=${btoa(props.connectedUser.connectedUserId.toString()!)}; path=/; max-age=1200; `;
													router.push("/profile");
												}}
											/>
										</Box>
									</Box>
								)
							}
						/>

						<GeneralCard
							style={` mb-[0.5rem] w-full overflow-x-hidden py-2 px-1 ${context.windowWidth < 768 ? "h-[calc(100%-13.25rem)]" : "h-[calc(100%-11.25rem)]"}`}
							zeroYPadding
							zeroXPadding
							zeroChildrenPadding
							dontShowHr
							firstChildren={
								<Box
									className="min-h-0 overflow-y-auto w-full "
									ref={messagesContainerRef}>
									{messages.map((msg, index) => {
										const prevMsg = index > 0 ? messages[index - 1] : null;
										const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;

										const currentDate = new Date(msg.createdAt);
										const prevDate = prevMsg ? new Date(prevMsg.createdAt) : null;
										const nextDate = nextMsg ? new Date(nextMsg.createdAt) : null;

										const timeDiffPrev = prevDate ? (currentDate.getTime() - prevDate.getTime()) / 1000 : Infinity;
										const timeDiffNext = nextDate ? (nextDate.getTime() - currentDate.getTime()) / 1000 : Infinity;

										const isDifferentDayThanPrev = !prevDate || currentDate.getDate() !== prevDate.getDate() || currentDate.getMonth() !== prevDate.getMonth() || currentDate.getFullYear() !== prevDate.getFullYear();

										const isDifferentDayThanNext = !nextDate || currentDate.getDate() !== nextDate.getDate() || currentDate.getMonth() !== nextDate.getMonth() || currentDate.getFullYear() !== nextDate.getFullYear();

										const shouldShowTime = timeDiffPrev > 15 * 60 || isDifferentDayThanPrev;
										const nextWillShowTime = timeDiffNext > 15 * 60 || isDifferentDayThanNext;

										const isSameUserAsPrev = prevMsg && msg.userId === prevMsg.userId;
										const isSameUserAsNext = nextMsg && msg.userId === nextMsg.userId;

										const roundedTop = !isSameUserAsPrev || shouldShowTime;
										const roundedBottom = !isSameUserAsNext || nextWillShowTime;

										return (
											<>
												{isDifferentDayThanPrev && (
													<Typography className={`text-center text-sm text-gray-400 mb-0.5 ${index === 0 ? "mt-2" : "mt-12"}`}>
														{`${currentDate.toLocaleDateString("cs-CZ", {
															weekday: "long",
														})} ${currentDate.getDate()}. ${currentDate.getMonth() + 1}. ${currentDate.getFullYear()}`}
													</Typography>
												)}

												{shouldShowTime && (
													<Typography className={`text-center text-sm text-gray-400 -mb-1 ${!isDifferentDayThanPrev && "mt-6"}`}>
														{currentDate.toLocaleTimeString("cs-CZ", {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</Typography>
												)}

												<Box
													key={index}
													className={`max-w-[75%] w-fit border-2 bg-navigation-color-neutral break-words btn-message-shadow 

																${msg.userId === props.userId ? `${context.bgTertiaryColor} ${context.borderTertiaryColor}` : `${context.bgSecondaryColor} ${context.borderSecondaryColor}`}

																${roundedTop ? "rounded-t-xl" : msg.userId === props.userId ? "rounded-tl-xl" : "rounded-tr-xl"}
																${roundedBottom ? "rounded-b-xl" : msg.userId === props.userId ? "rounded-bl-xl" : "rounded-br-xl"}

																${isSameUserAsPrev && !shouldShowTime ? "mt-0.5 mb-0.5" : "mt-2"}
																${msg.userId === props.userId ? "ml-auto" : ""}`}>
													<Typography className="px-2 py-1 text-left break-words whitespace-pre-wrap">{msg.message}</Typography>
												</Box>
											</>
										);
									})}

									<div ref={messagesEndRef} />
								</Box>
							}
						/>

						{/*<Box className="absolute bottom-[5.75rem] left-1/2 -ml-5">
							<ButtonComp
								color="text-[#eDeDeD]"
								size="small"
								iconStyle="rotate-90 scale-[1.1]"
								content={IconEnum.ARROW}
								onClick={() => {
									if (messagesEndRef.current) {
										messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
									}
								}}
							/>
						</Box>*/}

						<GeneralCard
							style="h-[7.25rem] w-full overflow-x-hidden py-2 px-2"
							zeroYPadding
							zeroXPadding
							dontShowHr
							zeroChildrenPadding
							firstChildren={
								<Box className="flex w-full items-center pl-1 pr-3 ">
									<TextField
										variant="standard"
										multiline
										minRows={3}
										maxRows={3}
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
										className="flex-1 border px-2 py-1 mr-2"
										placeholder="Zpráva"
									/>
									<ButtonComp
										style="mt-1"
										contentStyle="pl-[0.1rem]"
										justClick
										dontChangeOutline
										content={IconEnum.SEND}
										onClick={handleSend}
										size="medium"
									/>
								</Box>
							}
						/>

						<CustomModal
							isOpen={isModalOpened}
							title="Sdílení sportu"
							style="w-full px-4 max-w-md"
							paddingTop
							onClose={() => setIsModalOpened(false)}
							children={
								<Box className=" mb-4  ">
									<Typography className="mb-6">{`S uživatelem ${props.connectedUser.connectedUserFirstName + " " + props.connectedUser.connectedUserLastName} je možné sdílet následující sporty.`}</Typography>

									{props.ownedSports.map((sport) => {
										const sportIsShared = sharedSport.filter((filterSport) => filterSport.sportId === sport.sportId).length > 0;

										return (
											<Box className="flex items-center gap-3 mt-3">
												<ButtonComp
													content={sportIsShared ? IconEnum.CHECK : IconEnum.CROSS}
													externalClickedVal={sportIsShared}
													onClick={() => handleShareSport(sportIsShared, sport.sportId)}
													style="-mt-1"
												/>

												<LabelAndValue
													noPaddingTop
													reverse
													key={sport.sportId}
													spaceBetween
													label={sport.sportName}
												/>
											</Box>
										);
									})}
								</Box>
							}
						/>
					</Box>
				}
				secondColumnChildren={<></>}
			/>
		</>
	);
};

export default Chat;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const cookies = cookie.parse(context.req.headers.cookie || "");
		const authToken = cookies.authToken || null;

		const connectionId = Number(cookies.chat_ci) || 0;

		const resUser = await getAllUserAtrsReq({ authToken });

		const resConnectedUser = await getConnectedUserAndMessagesReq({ authToken, connectionId });
		const messages = resConnectedUser.data?.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

		if (resConnectedUser.status === 200) {
			const ownedSports = await getOwnedSportsReq({ authToken });
			const sharedSports = await getSharedSportsReq({ authToken, userId: resConnectedUser.data?.userId! });

			return {
				props: {
					ownedSports: ownedSports.data,
					sharedSports: sharedSports.data,
					connectedUser: resConnectedUser.data?.connectedUser,
					userId: resConnectedUser.data?.userId,
					userName: resUser.data?.firstName + " " + resUser.data?.lastName,
					messages,
				},
			};
		} else {
			return {
				props: {
					ownedSports: [],
					connectedUser: null,
					userId: -1,
					userName: "",
					messages: [],
				},
			};
		}
	} catch (error) {
		return {
			props: {
				ownedSports: [],
				connectedUser: null,
				userId: -1,
				userName: "",
				messages: [],
			},
		};
	}
};
