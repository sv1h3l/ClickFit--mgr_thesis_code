import { StateAndSet } from "@/utilities/generalInterfaces";
import FlagIcon from "@mui/icons-material/Flag";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import csLocale from "date-fns/locale/cs";
import { useEffect, useState } from "react";

import ButtonComp, { IconEnum } from "./ButtonComp";

interface Props {
	firstValue?: string;
	firstValuePlaceholder?: string;
	tfFirstValueMaxLength?: number;
	firstTypographyStyle?: string;
	firstValueError?: StateAndSet<boolean>;

	secondValue?: string;
	secondValuePlaceholder?: string;
	tfSecondValueMaxLength?: number;
	secondTypographyStyle?: string;
	secondValueError?: StateAndSet<boolean>;

	unit?: string;
	edit?: boolean;
	mainStyle?: string;
	isGoal?: boolean;
	hasDate?: boolean;

	showCheckButttonAlways?: boolean;
	showMoveButtons?: boolean;
	showCrossButton?: boolean;
	showGoalButton?: boolean;

	graphId: number;
	graphValueId: number;
	orderNumber: number;
	highestOrderNumber?: boolean;
	isDefaultGraphValue: boolean;

	checkOnClick: (firstValue: string, secondValue: number, graphValueId: number, isGoal: boolean, isDefaultGraphValue: boolean) => void;
	crossOnClick?: (graphValueId: number, orderNumber: number) => void;
	goalOnClick?: (graphValueId: number, isGoal: boolean) => void;
	moveOnClick?: (primaryGraphValueId: number, orderNumber: number, moveUp: boolean) => void;
}

const DoubleValue = (props: Props) => {
	const [hasValueChanged, setHasValueChanged] = useState(false);
	const [firstValueDate, setFirstValueDate] = useState<Date | null>(props.firstValue ? new Date(props.firstValue.split(".").reverse().join("-")) : null);
	const [firstValue, setFirstValue] = useState<string>(props.firstValue || "");

	const [firstValueError, setFirstValueError] = useState(props.firstValueError?.state || false);

	const [isValidDateState, setIsValidDateState] = useState(true);

	useEffect(() => {
		if (props.firstValueError) setFirstValueError(props.firstValueError.state);
	}, [props.firstValueError?.state]);

	useEffect(() => {
		setFirstValueDate(props.firstValue ? new Date(props.firstValue.split(".").reverse().join("-")) : null);
		setFirstValue(props.firstValue || "");
		setSecondValue(props.secondValue || "");
		setHasValueChanged(false);
		
	}, [props.edit, props.graphId]);

	const [initialSecondValue, setInitialSecondValue] = useState(props.secondValue || "");
	const [secondValue, setSecondValue] = useState(initialSecondValue);

	const [isGoal, setIsGoal] = useState<boolean>(props.isGoal || false);

	const formatDate = (date: Date | null): string => {
		if (!date) return "";
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		return `${day}.${month}.${year}`;
	};

	const isValidDate = (date: string) => {
		const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
		return regex.test(date);
	};

	const handleCheckButton = () => {
		let formattedDate = "";
		if (props.hasDate) {
			formattedDate = formatDate(firstValueDate);
		}

		const numberValue = parseInt(secondValue, 10);
		const newIsGoal = isGoal;

		if (props.hasDate && !isValidDate(formattedDate)) {
			setFirstValueError(true);
			return;
		}

		if (props.hasDate) props.checkOnClick(formattedDate, numberValue, props.graphValueId, newIsGoal, props.isDefaultGraphValue);
		else props.checkOnClick(firstValue, numberValue, props.graphValueId, newIsGoal, props.isDefaultGraphValue);

		if (props.graphValueId === 0) {
			if (props.hasDate && isValidDate(formattedDate)) {
				setIsGoal(false);
				setFirstValueDate(null);
				setSecondValue("");
			} else {
				setFirstValue("");
				setSecondValue("");
			}
		}

		setHasValueChanged(false);
		setInitialSecondValue(secondValue);
	};

	return (
		<Box
			className={`flex w-full items-center  min-h-7 h-11  py-[2.5rem] relative
						${props.mainStyle}`}>
			{isGoal ? (
				<FlagIcon
					className="text-[#dDdDdD] size-[1rem] absolute -ml-[1.4rem]"
					style={{
						filter: "drop-shadow(3px 3px 3px #00000040)",
					}}
				/>
			) : (
				<Typography className=" text-sm absolute -ml-[1.15rem] -mt-0.5">●</Typography>
			)}

			<Typography className="font-light opacity-20 text-3xl mr-3 -mt-1">{"{"}</Typography>

			<Box className="flex flex-col gap-2">
				{props.edit ? (
					<Box className=" flex justify-start ">
						{props.hasDate ? (
							<LocalizationProvider
								dateAdapter={AdapterDateFns}
								adapterLocale={csLocale}>
								<DesktopDatePicker
									value={firstValueDate}
									onChange={(newDate) => {
										setHasValueChanged(true);
										setFirstValueError(false);
										setIsValidDateState(isValidDate(formatDate(newDate)));

										setFirstValueDate(newDate);
									}}
									slotProps={{
										popper: {
											sx: {
												"& .MuiPickersPopper-paper": {
													backgroundColor: "#383838",
													borderRadius: "1.25rem",
													borderTopLeftRadius: "0.25rem",
													marginTop: "0.25rem",
												},
												"& .MuiTypography-root": {
													color: "#ffffff80",
												},
												"& .MuiPickersCalendarHeader-root": {
													color: "#D9D9D9",
												},
												"& .MuiPickersDay-root": {
													color: "#D9D9D9",
												},
												"& .MuiPickersDay-today": {
													borderColor: "#ffffff68", // Barva pozadí pro aktuální den
													color: "#D9D9D9", // Barva textu pro aktuální den
												},
												"& .MuiIconButton-root": {
													color: "#D9D9D9", // Ikony na bílo (šipky)
												},
												"& .MuiPickersYear-root": {
													color: "#D9D9D9", // Default color for year
												},
												"& .MuiPickersYear-yearButton.Mui-selected": {
													color: "#000", // Default color for year
													backgroundColor: "#D9D9D8",
												},
											},
										},

										day: {
											sx: {
												"&.MuiPickersDay-root.Mui-selected": {
													backgroundColor: "#D9D9D9", // Nastavte požadovanou barvu pozadí
													color: "#000", // Nastavte požadovanou barvu textu
												},
											},
										},
										textField: {
											className: `w-[10rem]  ${props.firstTypographyStyle}`,
											variant: "standard",
											fullWidth: true,
											error: firstValueError || !isValidDateState,
											placeholder: props.firstValuePlaceholder,
											InputProps: {
												sx: {
													"& input::placeholder": {
														fontWeight: "300",
													},
													"& input": {
														fontWeight: "300",
													},
												},
											},
											inputProps: {
												style: {
													padding: 0,
													paddingBottom: 0.75,
												},
												maxLength: props.tfFirstValueMaxLength || 10,
											},
										},
										openPickerIcon: {
											sx: { color: "#CDCDCD", scale: 0.8 },
										},
									}}
								/>
							</LocalizationProvider>
						) : (
							<TextField
								className={`w-[10rem] ${props.firstTypographyStyle}`}
								variant="standard"
								fullWidth
								value={firstValue}
								onChange={(e) => {
									const value = e.target.value;

									if (value) {
										setFirstValueError(false);
									} else {
										setFirstValueError(true);
									}

									setHasValueChanged(true);

									setFirstValue(value);
								}}
								error={firstValueError}
								placeholder={props.firstValuePlaceholder}
								InputProps={{
									sx: {
										"& input::placeholder": {
											fontWeight: "300",
										},
										"& input": {
											fontWeight: "300",
										},
									},
								}}
								inputProps={{
									style: {
										padding: 0,
										paddingBottom: 0.75,
									},
									maxLength: props.tfFirstValueMaxLength || 12,
								}}
							/>
						)}
					</Box>
				) : (
					<Typography className={`font-light break-words ${props.firstTypographyStyle}`}>
						{props.hasDate
							? props.firstValue &&
							  `${props.firstValue
									.split(".")
									.slice(0, 1)
									.map((part) => parseInt(part, 10))}. 
							${props.firstValue
								.split(".")
								.slice(1, 2)
								.map((part) => parseInt(part, 10))}.`
							: props.firstValue}
					</Typography>
				)}

				{props.edit ? (
					<Box className=" flex justify-start ">
						<TextField
							className={`w-[10rem] ${props.secondTypographyStyle}`}
							fullWidth
							variant="standard"
							value={secondValue}
							type="number"
							error={props.secondValueError ? props.secondValueError.state : secondValue === ""}
							onChange={(e) => {
								const value = e.target.value;
								if (/^\d{0,4}$/.test(value)) {
									setHasValueChanged(true);
									setSecondValue(value);
								}
							}}
							onKeyDown={(e) => {
								const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
								if (
									!/^\d$/.test(e.key) && // nepovolí jiné znaky než čísla
									!allowedKeys.includes(e.key)
								) {
									e.preventDefault();
								}
							}}
							placeholder={props.secondValuePlaceholder}
							InputProps={{
								endAdornment: props.unit ? (
									<InputAdornment position="end">
										<Typography>{props.unit}</Typography>
									</InputAdornment>
								) : null,
								inputProps: {
									min: 0,
									max: 9999,
									style: {
										padding: 0,
										paddingBottom: 0.75,
										appearance: "textfield",
										MozAppearance: "textfield",
									},
								},
								sx: {
									"& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
										display: "none",
									},
								},
							}}
						/>
					</Box>
				) : (
					<Typography className={` break-words ${props.secondTypographyStyle}`}>{props.secondValue + (props.unit ? " " + props.unit : "")}</Typography>
				)}
			</Box>

			{props.edit ? (
				<Box className="flex gap-10 ml-8 ">
					<ButtonComp
						saveAnimation
						justClick
						dontChangeOutline
						disabled={(!props.showCheckButttonAlways && !hasValueChanged) || !secondValue || (!firstValueDate && !firstValue) || firstValueError || !isValidDateState}
						icon={IconEnum.CHECK}
						size="small"
						onClick={handleCheckButton}
					/>

					{props.showGoalButton ? (
						<ButtonComp
							externalClicked={{ state: isGoal, setState: setIsGoal }}
							icon={IconEnum.FLAG}
							size="small"
							onClick={() => {
								const newIsGoal = !isGoal;
								setIsGoal(newIsGoal);

								props.goalOnClick?.(props.graphValueId, newIsGoal);
							}}
						/>
					) : null}

					{props.showMoveButtons && (
						<Box className="flex gap-4">
							<ButtonComp
								justClick
								dontChangeOutline
								disabled={props.highestOrderNumber}
								icon={IconEnum.ARROW}
								iconStyle="-rotate-90"
								size="small"
								onClick={() => props.moveOnClick?.(props.graphValueId, props.orderNumber, false)}
							/>

							<ButtonComp
								justClick
								dontChangeOutline
								disabled={props.orderNumber === 1}
								icon={IconEnum.ARROW}
								iconStyle="rotate-90"
								size="small"
								onClick={() => props.moveOnClick?.(props.graphValueId, props.orderNumber, true)}
							/>
						</Box>
					)}

					{props.showCrossButton && (
						<ButtonComp
							icon={IconEnum.CROSS}
							justClick
							dontChangeOutline
							size="small"
							onClick={() => props.crossOnClick?.(props.graphValueId, props.orderNumber)}
						/>
					)}
				</Box>
			) : null}
		</Box>
	);
};

export default DoubleValue;
