import { changeUserAtrReq } from "@/api/change/changeUserAtrReq";
import { changeUserHealthReq } from "@/api/change/changeUserHealthReq";
import { changeUserPswReq } from "@/api/change/changeUserPswReq";
import { changeUserSexReq } from "@/api/change/changeUserSexReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { User } from "@/api/get/getAllUserAtrsReq";
import { useAppContext } from "@/utilities/Context";
import { StateAndSet } from "@/utilities/generalInterfaces";
import SaveIcon from "@mui/icons-material/Save";
import { Box, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import LabelAndValue from "../small/LabelAndValue";
import Title from "../small/Title";
import GeneralCard from "./GeneralCard";

interface Props {
	user: User;

	editing: StateAndSet<boolean>;

	cannotEdit?: boolean;
}

function PersonalData(props: Props) {
	const [user, setUser] = useState<User>(props.user);

	const context = useAppContext();

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
				setPassword("");
				setConfirmPassword("");
				setPasswordHelperTexts({ password: "", confirmPassword: "" });
				setShowSaveIcon(true);

				setTimeout(() => setShowSaveIcon(false), 1000);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	//
	//	#region Select Comp
	//
	const [userSex, setUserSex] = useState(props.user.sex);

	const handleChangeUserSex = async (value: "muž" | "žena" | "neuvedeno") => {
		try {
			const response = await changeUserSexReq({ value });

			if (response.status === 200) {
				setUserSex(value);
			}

			consoleLogPrint(response);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

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

			if (value === "muž" || value === "žena" || value === "neuvedeno") {
				handleChangeUserSex(value);
				setUserSex(value);
			}

			handleClose();
		};

		const selectItems = ["muž", "žena", "neuvedeno"];

		return (
			<FormControl
				className=" -mt-1 ml-2"
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
					value={userSex || ""}
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
							key={item}
							value={item}
							sx={{
								opacity: 1,
								"&.Mui-selected": {
									backgroundColor: context.colorSchemeCode === "red" ? "#4e3939" : context.colorSchemeCode === "blue" ? "#313c49" : context.colorSchemeCode === "green" ? "#284437" : "#414141",
								},
								"&.Mui-selected:hover": {
									backgroundColor: context.colorSchemeCode === "red" ? "#4e3939" : context.colorSchemeCode === "blue" ? "#313c49" : context.colorSchemeCode === "green" ? "#284437" : "#414141",
								},
							}}
							className={`px-3 py-1.5  hover:cursor-pointer transition-colors duration-150 w-full flex justify-center
								${context.bgSecondaryColor + context.bgHoverTertiaryColor}`}>
							<Typography sx={{ opacity: 0.95 }}>{item}</Typography>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	};
	//	#endregion
	//

	const [showSaveIcon, setShowSaveIcon] = useState(false);

	return (
		<Box className="h-full flex flex-col gap-4 ">
			<GeneralCard
				marginBottom
				firstTitle="Osobní údaje"
				height="h-full"
				showBackButton={props.cannotEdit}
				backButtonClick={() => {
					router.push(`/chat`);
				}}
				onlyRightContent={
					props.cannotEdit
						? []
						: [
								<ButtonComp
									key={"edit"}
									size="large"
									content={IconEnum.EDIT}
									onClick={() => {
										props.editing.setState(!props.editing.state);
									}}
								/>,
						  ]
				}
				firstChildren={
					<Box className="flex flex-col gap-6 w-full mt-2">
						{props.cannotEdit ? null : (
							<Box className="flex w-1/2">
								<LabelAndValue
									mainStyle=" "
									noPaddingTop
									label="Email"
									middleArrowStyle={context.isSmallDevice ? "ml-[1.1rem]" : "ml-[0.65rem]"}
									value={user.email}
								/>
							</Box>
						)}

						<Box className={`flex ${context.isSmallDevice ? "flex-col gap-5" : ""} `}>
							<Box className={`flex  ${context.isSmallDevice ? "w-full" : "w-1/2"}`}>
								{props.editing.state ? (
									<LabelAndValue
										middleArrowStyle={context.isSmallDevice ? "ml-2" : ""}
										label="Jméno"
										fontLight
										maxLength={20}
										textFieldStyle={`w-full pr-[6.5rem] ${""}`}
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
										icon={IconEnum.CHECK}
									/>
								) : (
									<LabelAndValue
									middleArrowStyle={context.isSmallDevice ? "ml-2" : ""}
										label="Jméno"
										value={user.firstName}
									/>
								)}
							</Box>
							<Box className={`flex  ${context.isSmallDevice ? "w-full" : "w-1/2"}`}>
								{props.editing.state ? (
									<LabelAndValue
										mainStyle=""
										label="Příjmení"
										fontLight
										textFieldStyle="w-full pr-[6.5rem]"
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
										icon={IconEnum.CHECK}
									/>
								) : (
									<LabelAndValue
										label="Příjmení"
										value={user.lastName}
									/>
								)}
							</Box>
						</Box>
						<Box className={`flex ${context.isSmallDevice ? "flex-col gap-5" : ""} `}>
							<Box className={`flex  ${context.isSmallDevice ? "w-full" : "w-1/2"}`}>
								{props.editing.state ? (
									<LabelAndValue
										mainStyle=" "
										middleArrowStyle={context.isSmallDevice ? "ml-[1rem]" : "ml-[0.5rem]"}
										label="Výška"
										fontLight
										placeHolder="Zadejte výšku"
										onlyNumbers
										textFieldStyle="w-full pr-[4.5rem]"
										unit="cm"
										maxLength={4}
										textFieldValue={user.height ? user.height.toString() : ""}
										textFieldOnClick={(value) => {
											changeUserAtr(value, ChangeUserAtrCodeEnum.HEIGHT);
										}}
										helperText={helperTexts[ChangeUserAtrCodeEnum.HEIGHT]}
										icon={IconEnum.CHECK}
									/>
								) : (
									<LabelAndValue
									middleArrowStyle={context.isSmallDevice ? "ml-[1rem]" : "ml-[0.5rem]"}
										label="Výška"
										notFilledIn={!user.height}
										value={user.height ? user.height + " cm" : ""}
									/>
								)}
							</Box>
							<Box className={`flex  ${context.isSmallDevice ? "w-full" : "w-1/2"}`}>
								{props.editing.state ? (
									<LabelAndValue
										middleArrowStyle="ml-[1.4rem]"
										label="Váha"
										textFieldStyle="w-full pr-[4.4rem]"
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
										icon={IconEnum.CHECK}
									/>
								) : (
									<LabelAndValue
										middleArrowStyle={"ml-[1.4rem]"}
										label="Váha"
										notFilledIn={!user.weight}
										value={user.weight ? user.weight + " kg" : ""}
									/>
								)}
							</Box>
						</Box>
						<Box className={`flex ${context.isSmallDevice ? "flex-col gap-5" : ""} `}>
							<Box className={`flex  ${context.isSmallDevice ? "w-full" : "w-1/2"}`}>
								{props.editing.state ? (
									<LabelAndValue
										middleArrowStyle={context.isSmallDevice ? "ml-[2rem]" : "ml-[1.5rem]"}
										label="Věk"
										fontLight
										placeHolder="Zadejte věk"
										onlyNumbers
										textFieldStyle="w-full pr-[4.5rem]"
										unit="let"
										maxLength={4}
										textFieldValue={user.age ? user.age.toString() : ""}
										textFieldOnClick={(value) => {
											changeUserAtr(value, ChangeUserAtrCodeEnum.AGE);
										}}
										helperText={helperTexts[ChangeUserAtrCodeEnum.AGE]}
										icon={IconEnum.CHECK}
									/>
								) : (
									<LabelAndValue
									middleArrowStyle={context.isSmallDevice ? "ml-[2rem]" : "ml-[1.5rem]"}
										label="Věk"
										notFilledIn={!user.age}
										value={user.age ? (user.age === 1 ? user.age + " rok" : user.age < 5 ? user.age + " roky" : user.age + " let") : ""}
									/>
								)}
							</Box>
							<Box className="flex w-1/2">
								{props.editing.state ? (
									<Box className="ml-[0.5rem] flex  mt-4">
										<Typography className="font-light text-nowrap mr-[1.15rem]">Pohlaví</Typography>
										<Typography className="font-light opacity-50 text-nowrap">»</Typography>
										<SelectComp />
									</Box>
								) : (
									<LabelAndValue
										middleArrowStyle="ml-[0.4rem]"
										label="Pohlaví"
										value={userSex}
									/>
								)}
							</Box>
						</Box>

						{props.editing.state && (
							<Box className="mt-6 w-full">
								<Title
									title="Nové heslo"
									smallPaddingTop
								/>
								<Box className="flex  w-full h-12 mt-4">
									<LabelAndValue
										label="Heslo"
										placeHolder="Zadejte nové heslo"
										textFieldValue={password}
										firstTypographyStyle="ml-[4.2rem]"
										mainStyle=" max-w-[30rem] w-full"
										noPaddingTop
										withoutIcon
										psw
										textFieldStyle={passwordHelperTexts.password ? "" : "mb-[0.45rem]"}
										fontLight
										helperText={passwordHelperTexts.password}
										maxLength={40}
										onClickForBlur
										textFieldOnClick={(value) => {
											setPassword(value);
										}}
										icon={IconEnum.CHECK}
									/>
								</Box>
								<Box className="flex h-12 w-full pt-3">
									<LabelAndValue
										noPaddingTop
										label="Potvrzení hesla"
										placeHolder="Zadejte heslo znovu"
										textFieldValue={confirmPassword}
										withoutIcon
										mainStyle="w-full max-w-[30rem]"
										psw
										onClickForBlur
										textFieldStyle={passwordHelperTexts.confirmPassword ? "" : "mb-[0.45rem]"}
										fontLight
										helperText={passwordHelperTexts.confirmPassword}
										maxLength={40}
										textFieldOnClick={(value) => {
											setConfirmPassword(value);
										}}
										icon={IconEnum.CHECK}
									/>
								</Box>
								<Box className={`flex items-end gap-3`}>
									<ButtonComp
										justClick
										dontChangeOutline
										size="small"
										style="ml-36 mt-6"
										onClick={changePassword}
										content={"Změnit heslo"}
									/>

									<SaveIcon
										className={`mb-0.5 text-blue-icon duration-300 transition-all
												${showSaveIcon ? "opacity-100" : "opacity-0"}`}
									/>
								</Box>
							</Box>
						)}

						{context.isSmallDevice ? (
							<Box className="absolute bottom-7 left-0 w-full flex justify-center">
								<ButtonComp
									content={"Zobrazit sportovní a zdravotní údaje"}
									size="medium"
									onClick={() => {
										context.setActiveSection(2);
									}}
								/>
							</Box>
						) : null}
					</Box>
				}
			/>
		</Box>
	);
}

export default PersonalData;
