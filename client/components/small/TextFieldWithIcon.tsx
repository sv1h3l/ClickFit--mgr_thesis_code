import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save"; // Import ikony uložení
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
	previousValue?: string;
	label?: string;
	placeHolder?: string;
	externalValue?: StateAndSetFunction<string>;

	onClick: (value: string) => void;
	onClickForBlur?: boolean;
	onChangeCond?: (value: string) => boolean;
	canBeEmptyValue?: boolean;
	icon?: React.ReactNode;
	dontDeleteValue?: boolean;
	onlyNumbers?: boolean;
	withoutIcon?: boolean;
	fontSize?: string;
	psw?: boolean;
	fontLight?: boolean;
	unit?: string;
	maxLength?: number;
	helperText?: string;
	disabled?: boolean;
	customMargin?: string;
	tfCenterValueAndPlaceholder?: boolean;

	border?: boolean;

	titleBorderWidth?: string;

	isChecked?: boolean;
	onToggleChange?: (isChecked: boolean) => void;

	style?: string;
	noPaddingY?: boolean;
}

const TextFieldWithIcon = ({
	previousValue,
	label,
	placeHolder,
	onClick,
	onClickForBlur,
	onChangeCond,
	icon,
	withoutIcon,
	fontSize,
	fontLight,
	customMargin,
	tfCenterValueAndPlaceholder,
	unit,
	maxLength,
	helperText,
	disabled,
	externalValue,
	canBeEmptyValue,
	dontDeleteValue,
	onlyNumbers,
	psw,
	border,
	titleBorderWidth,
	isChecked,
	onToggleChange,
	style,
	noPaddingY,
}: Props) => {
	const [value, setValue] = useState<string>(previousValue || "");
	const [savedValue, setSavedValue] = useState<string>(previousValue || "");

	const [showAnyIcon, setShowAnyIcon] = useState(true); // Stav pro zobrazení ikon
	const [showDefaultIcon, setShowDefaultIcon] = useState(true); // Stav pro zobrazení výchozí ikony
	const [showSaveIcon, setShowSaveIcon] = useState(false); // Stav pro zobrazení ikony uložení

	useEffect(() => {
		if (previousValue !== value) {
			setValue(previousValue || "");
			setSavedValue(previousValue || "");
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [previousValue]);

	

	const handleAction = () => {
		if (!canBeEmptyValue && value.trim() === "") return;
		if (savedValue === value) return;

		if (onClick) {
			onClick(value);
		}

		setSavedValue(value);

		!dontDeleteValue && setValue("");
		!dontDeleteValue && setSavedValue("");

		onlyNumbers && value === "0" && setValue("");
		onlyNumbers && value === "0" && setSavedValue("");

		if (externalValue) {
			!dontDeleteValue && externalValue.setState("");
			onlyNumbers && value === "0" && externalValue.setState("");
		}

		setTimeout(() => setShowDefaultIcon(false), 150);
		setTimeout(() => setShowSaveIcon(true), 150);

		setTimeout(() => setShowSaveIcon(false), 1000);
		setTimeout(() => setShowDefaultIcon(true), 1200);
	};

	return (
		<Box
			className={`flex flex-shrink-0 relative
						${customMargin ? customMargin : helperText && withoutIcon ? "mt-[1.25rem]" : helperText ? "mt-[1.2rem]" : withoutIcon ? "mt-0" : "mt-[0.42rem]"}
						${withoutIcon && "mr-8"}
						${!noPaddingY && "py-2"}s
						${border && "border-t-2 border-blue-300 "}
						${onToggleChange && !isChecked && "opacity-50"}
						${style}`}>
			{titleBorderWidth && (
				<Box
					style={{ width: titleBorderWidth }}
					className="border-t-2 border-l-2 border-blue-300 h-6 rounded-tl-lg absolute -left-2.5 -mt-1"
				/>
			)}

			<TextField
				disabled={disabled || (onToggleChange && !isChecked)}
				className={`w-full  `}
				placeholder={placeHolder}
				variant="standard"
				type={psw ? "password" : ""}
				label={label}
				inputProps={{
					style: {
						padding: 0,
						paddingBottom: 0.75,
						fontSize: fontSize,
						textAlign: tfCenterValueAndPlaceholder ? "center" : "left",
					},
					maxLength: maxLength || 50,
				}}
				helperText={helperText}
				FormHelperTextProps={{
					sx: {
						margin: 0,
					},
				}}
				value={value}
				InputProps={{
					sx: {
						"& input::placeholder": {
							fontWeight: fontLight ? "300" : "normal",
							textAlign: tfCenterValueAndPlaceholder ? "center" : "left",
						},
					},
					endAdornment: (
						<InputAdornment position="end">
							<Typography>{unit === "let" && value === "1" ? "rok" : unit === "let" && (value === "2" || value === "3" || value === "4") ? "roky" : unit}</Typography>
						</InputAdornment>
					),
				}}
				onBlur={onClickForBlur ? handleAction : () => {}}
				error={!!helperText}
				onChange={(e) => {
					const newValue = e.target.value;

					if (externalValue) {
						externalValue.setState(newValue);
					}

					onChangeCond && setShowAnyIcon(onChangeCond(newValue));

					if (onlyNumbers) {
						if (/^\d*$/.test(newValue)) {
							// Check if the value is a valid number or an empty string
							if (newValue === "") {
								setValue(""); // Allow empty string
							} else {
								let num = Number(newValue);

								if (unit === "let" && num > 120) num = 120;
								else if (unit === "kg" && num > 600) num = 600;
								else if (unit === "cm" && num > 300) num = 300;
								else if (num > 999) num = 999;

								setValue(num.toString());
							}
						}
					} else {
						setValue(newValue);
					}
				}}
				onKeyDown={(e) => {
					if (onChangeCond && onChangeCond(value)) {
						if (e.key === "Enter") {
							e.preventDefault();
							handleAction();
						}
					} else if (!onChangeCond) {
						if (e.key === "Enter") {
							e.preventDefault();
							handleAction();
						}
					}
				}}
			/>

			{!withoutIcon ? (
				<Button
					disabled={(onToggleChange && !isChecked) || value === savedValue || showSaveIcon || !showAnyIcon}
					onClick={handleAction}
					size="small"
					className={`min-h-8 max-h-8 max-w-8 min-w-8 p-1 ml-0 -mt-[0.1rem]
								transition-all duration-300 ease-in-out 
								${((!showSaveIcon && value === savedValue) || !showAnyIcon) && "opacity-0"}`}>
					{!showDefaultIcon ? (
						<SaveIcon
							className="text-blue-500 "
							fontSize="small"
						/>
					) : icon ? (
						icon
					) : (
						<AddIcon
							className="text-green-500"
							fontSize="small"
						/>
					)}
				</Button>
			) : null}
		</Box>
	);
};

export default TextFieldWithIcon;
