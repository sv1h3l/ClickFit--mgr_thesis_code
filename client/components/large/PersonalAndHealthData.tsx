import { changeUserAtrReq } from "@/api/change/changeUserAtrReq";
import { changeUserHealthReq } from "@/api/change/changeUserHealthReq";
import { changeUserPswReq } from "@/api/change/changeUserPswReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { StateAndSet } from "@/utilities/generalInterfaces";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import LabelAndValue from "../small/LabelAndValue";
import Title from "../small/Title";
import GeneralCard from "./GeneralCard";

export interface User {
	userId: number;
	subscriptionId: number;

	email: string;

	firstName: string;
	lastName: string;

	height: number | null;
	weight: number | null;
	age: number | null;
	sex: "muž" | "žena" | "neuvedeno";

	health: string | null;
}

interface Props {
	user: User;

	editing: StateAndSet<boolean>;
}

function PersonalAndHealthData(props: Props) {
	const [user, setUser] = useState<User>(props.user);

	const [localHealth, setLocalHealth] = useState<string>(props.user.health || "");

	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	const [passwordHelperTexts, setPasswordHelperTexts] = useState<{ [key: string]: string }>({
		password: "",
		confirmPassword: "",
	});

	useEffect(() => {
		setPassword("");
		setConfirmPassword("");

		setPasswordHelperTexts({ password: "", confirmPassword: "" });
	}, [props.editing.state]);

	const handleChangeUserHealth = async () => {
		try {
			const response = await changeUserHealthReq({ health: localHealth });

			if (response.status === 200) {
				setUser((prevUser) => {
					return { ...prevUser, health: localHealth };
				});
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	enum ChangeUserAtrCodeEnum {
		FIRST_NAME = 1,
		LAST_NAME = 2,
		HEIGHT = 3,
		WEIGHT = 4,
		AGE = 5,
	}

	const [helperTexts, setHelperTexts] = useState<{ [key: string]: string }>({
		[ChangeUserAtrCodeEnum.FIRST_NAME]: "",
		[ChangeUserAtrCodeEnum.LAST_NAME]: "",
		[ChangeUserAtrCodeEnum.HEIGHT]: "",
		[ChangeUserAtrCodeEnum.WEIGHT]: "",
		[ChangeUserAtrCodeEnum.AGE]: "",
	});

	const changeUserAtr = async (value: string, userAtrCode: ChangeUserAtrCodeEnum) => {
		let newValue = value;
		if ([ChangeUserAtrCodeEnum.HEIGHT, ChangeUserAtrCodeEnum.WEIGHT, ChangeUserAtrCodeEnum.AGE].includes(userAtrCode) && newValue === "") newValue = "0";

		try {
			const response = await changeUserAtrReq({ value: newValue, userAtrCode });

			if (response.status === 400 || response.status === 422) {
				setHelperTexts((prev) => ({
					...prev,
					[userAtrCode]: response.message || "Neplatná hodnota",
				}));
			} else {
				let newUser = user;

				switch (userAtrCode) {
					case ChangeUserAtrCodeEnum.FIRST_NAME: {
						newUser = { ...user, firstName: value };

						break;
					}
					case ChangeUserAtrCodeEnum.LAST_NAME: {
						newUser = { ...user, lastName: value };

						break;
					}
					case ChangeUserAtrCodeEnum.HEIGHT: {
						const valueNumber = Number(value);
						newUser = { ...user, height: valueNumber };

						break;
					}
					case ChangeUserAtrCodeEnum.WEIGHT: {
						const valueNumber = Number(value);
						newUser = { ...user, weight: valueNumber };

						break;
					}
					case ChangeUserAtrCodeEnum.AGE: {
						const valueNumber = Number(value);
						newUser = { ...user, age: valueNumber };

						break;
					}
				}

				setHelperTexts((prev) => ({
					...prev,
					[userAtrCode]: "",
				}));

				setUser(newUser);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const changePassword = async () => {
		let error = false;

		if (password.length < 8) {
			setPasswordHelperTexts((prev) => {
				return { ...prev, password: "Heslo musí obsahovat alespoň 8 znaků" };
			});
			error = true;
		} else {
			setPasswordHelperTexts((prev) => {
				return { ...prev, password: "" };
			});
		}

		if ((confirmPassword === "" && password !== confirmPassword) || password !== confirmPassword) {
			setPasswordHelperTexts((prev) => {
				return { ...prev, confirmPassword: "Hesla se neshodují" };
			});
			error = true;
		} else {
			setPasswordHelperTexts((prev) => {
				return { ...prev, confirmPassword: "" };
			});
		}

		if (error) {
			return;
		}

		try {
			const response = await changeUserPswReq({ password, confirmPassword });

			if (response.status === 400) {
				setPasswordHelperTexts({ password: response.data?.passwordHelperText!, confirmPassword: response.data?.confirmPasswordHelperText! });
			} else if (response.status === 200) {
				setPasswordHelperTexts({ password: "", confirmPassword: "" });
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<Box className="h-full flex flex-col gap-4 ">
			<GeneralCard
				marginBottom
				firstTitle="Osobní údaje"
				height="h-1/2"
				onlyRightContent={[
					<ButtonComp
						key={"edit"}
						size="large"
						icon={IconEnum.EDIT}
						onClick={() => {
							props.editing.setState(!props.editing.state);
						}}
					/>,
				]}
				firstChildren={
					<Box className="flex flex-col gap-4 w-full ">
						<Box className="flex w-1/2">
							<LabelAndValue
								mainStyle=" mt-2"
								noPaddingTop
								label="Email"
								middleArrowStyle="ml-[0.65rem]"
								value={user.email}
							/>
						</Box>
						<Box className="flex ">
							<Box className="flex w-1/2 ">
								{props.editing.state ? (
									<LabelAndValue
										mainStyle="mr-6"
										label="Jméno"
										fontLight
										maxLength={20}
										placeHolder="Zadejte jméno"
										textFieldValue={user.firstName}
										textFieldOnClick={(value) => {
											changeUserAtr(value, ChangeUserAtrCodeEnum.FIRST_NAME);
										}}
										onChangeCond={(value) => {
											if (value !== "") {
												setHelperTexts((prev) => ({
													...prev,
													[ChangeUserAtrCodeEnum.FIRST_NAME]: "",
												}));

												return true;
											} else {
												setHelperTexts((prev) => ({
													...prev,
													[ChangeUserAtrCodeEnum.FIRST_NAME]: "Nesmí být prázdné",
												}));

												return false;
											}
										}}
										helperText={helperTexts[ChangeUserAtrCodeEnum.FIRST_NAME]}
										icon={
											<CheckIcon
												fontSize="small"
												className="text-green-500"
											/>
										}
									/>
								) : (
									<LabelAndValue
										label="Jméno"
										value={user.firstName}
									/>
								)}
							</Box>
							<Box className="flex w-1/2">
								{props.editing.state ? (
									<LabelAndValue
										mainStyle="mr-6"
										label="Příjmení"
										fontLight
										maxLength={20}
										placeHolder="Zadejte příjmení"
										textFieldValue={user.lastName}
										textFieldOnClick={(value) => {
											changeUserAtr(value, ChangeUserAtrCodeEnum.LAST_NAME);
										}}
										onChangeCond={(value) => {
											if (value !== "") {
												setHelperTexts((prev) => ({
													...prev,
													[ChangeUserAtrCodeEnum.LAST_NAME]: "",
												}));

												return true;
											} else {
												setHelperTexts((prev) => ({
													...prev,
													[ChangeUserAtrCodeEnum.LAST_NAME]: "Nesmí být prázdné",
												}));

												return false;
											}
										}}
										helperText={helperTexts[ChangeUserAtrCodeEnum.LAST_NAME]}
										icon={
											<CheckIcon
												fontSize="small"
												className="text-green-500"
											/>
										}
									/>
								) : (
									<LabelAndValue
										label="Příjmení"
										value={user.lastName}
									/>
								)}
							</Box>
						</Box>
						<Box className="flex">
							<Box className="flex w-1/2">
								{props.editing.state ? (
									<LabelAndValue
										mainStyle="mr-6 "
										middleArrowStyle="ml-[0.5rem]"
										label="Výška"
										fontLight
										placeHolder="Zadejte výšku"
										onlyNumbers
										unit="cm"
										maxLength={4}
										textFieldValue={user.height ? user.height.toString() : ""}
										textFieldOnClick={(value) => {
											changeUserAtr(value, ChangeUserAtrCodeEnum.HEIGHT);
										}}
										helperText={helperTexts[ChangeUserAtrCodeEnum.HEIGHT]}
										icon={
											<CheckIcon
												fontSize="small"
												className="text-green-500"
											/>
										}
									/>
								) : (
									<LabelAndValue
										middleArrowStyle="ml-[0.5rem]"
										label="Výška"
										notFilledIn={!user.height}
										value={user.height ? user.height + " cm" : ""}
									/>
								)}
							</Box>
							<Box className="flex w-1/2">
								{props.editing.state ? (
									<LabelAndValue
										mainStyle="mr-6 "
										middleArrowStyle="ml-[1.4rem]"
										label="Váha"
										fontLight
										placeHolder="Zadejte váhu"
										onlyNumbers
										maxLength={4}
										textFieldValue={user.weight ? user.weight.toString() : ""}
										textFieldOnClick={(value) => {
											changeUserAtr(value, ChangeUserAtrCodeEnum.WEIGHT);
										}}
										helperText={helperTexts[ChangeUserAtrCodeEnum.WEIGHT]}
										unit="kg"
										icon={
											<CheckIcon
												fontSize="small"
												className="text-green-500"
											/>
										}
									/>
								) : (
									<LabelAndValue
										middleArrowStyle="ml-[1.4rem]"
										label="Váha"
										notFilledIn={!user.weight}
										value={user.weight ? user.weight + " kg" : ""}
									/>
								)}
							</Box>
						</Box>
						<Box className="flex">
							<Box className="flex w-1/2">
								{props.editing.state ? (
									<LabelAndValue
										mainStyle="mr-6 "
										middleArrowStyle="ml-[1.5rem]"
										label="Věk"
										fontLight
										placeHolder="Zadejte věk"
										onlyNumbers
										unit="let"
										maxLength={4}
										textFieldValue={user.age ? user.age.toString() : ""}
										textFieldOnClick={(value) => {
											changeUserAtr(value, ChangeUserAtrCodeEnum.AGE);
										}}
										helperText={helperTexts[ChangeUserAtrCodeEnum.AGE]}
										icon={
											<CheckIcon
												fontSize="small"
												className="text-green-500"
											/>
										}
									/>
								) : (
									<LabelAndValue
										middleArrowStyle="ml-[1.5rem]"
										label="Věk"
										notFilledIn={!user.age}
										value={user.age ? (user.age === 1 ? user.age + " rok" : user.age < 5 ? user.age + " roky" : user.age + " let") : ""}
									/>
								)}
							</Box>
							<Box className="flex w-1/2">
								<LabelAndValue
									middleArrowStyle="ml-[0.4rem]"
									label="Pohlaví"
									value={user.sex}
								/>
							</Box>
						</Box>

						{props.editing.state && (
							<Box className="mt-4">
								<Title
									title="Nové heslo"
									smallPaddingTop
								/>
								<Box className="flex w-2/3 h-12">
									<LabelAndValue
										label="Heslo"
										placeHolder="Zadejte nové heslo"
										textFieldValue={password}
										mainStyle="ml-[4.2rem] mt-2"
										noPaddingTop
										withoutIcon
										psw
										textFieldStyle={passwordHelperTexts.password ? "" : "mb-[0.45rem]"}
										fontLight
										helperText={passwordHelperTexts.password}
										maxLength={40}
										textFieldOnClick={(value) => {
											setPassword(value);
										}}
										icon={
											<CheckIcon
												fontSize="small"
												className="text-green-500"
											/>
										}
									/>
								</Box>
								<Box className="flex w-2/3">
									<LabelAndValue
										label="Potvrzení hesla"
										placeHolder="Zadejte heslo znovu"
										textFieldValue={confirmPassword}
										withoutIcon
										psw
										textFieldStyle={passwordHelperTexts.confirmPassword ? "" : "mb-[0.45rem]"}
										fontLight
										helperText={passwordHelperTexts.confirmPassword}
										maxLength={40}
										textFieldOnClick={(value) => {
											setConfirmPassword(value);
										}}
										icon={
											<CheckIcon
												fontSize="small"
												className="text-green-500"
											/>
										}
									/>
								</Box>
								<Button
									variant="outlined"
									size="small"
									className="ml-36 mt-8"
									onClick={changePassword}>
									Změnit heslo
								</Button>
							</Box>
						)}
					</Box>
				}
			/>

			<GeneralCard
				firstTitle="Zdravotní údaje"
				height=" h-1/2"
				firstChildren={
					props.editing.state ? (
						<TextField
							className="w-full"
							placeholder="Popis sportu"
							multiline
							value={localHealth}
							onChange={(e) => setLocalHealth(e.target.value)}
							onBlur={() => handleChangeUserHealth()}
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
									ul: ({ children }) => <ul className="list-disc pl-8 mt-1 mb-0 space-y-1">{children}</ul>,
									ol: ({ children }) => <ol className="list-decimal pl-8 mt-1 mb-0 space-y-1">{children}</ol>,
									li: ({ children }) => <li className="mb-0">{children}</li>,
									h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
									h2: ({ children }) => <h2 className="text-2xl font-semibold">{children}</h2>,
									h3: ({ children }) => <h3 className="text-xl font-medium">{children}</h3>,
								}}>
								{localHealth || ""}
							</ReactMarkdown>
						</span>
					)
				}
			/>
		</Box>
	);
}

export default PersonalAndHealthData;
