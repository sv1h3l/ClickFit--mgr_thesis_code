import { Box, Typography } from "@mui/material";
import TextFieldWithIcon from "./TextFieldWithIcon";

interface LabelAndValueProps {
	label?: string;
	value?: string;
	sideContent?: React.ReactNode;

	textFieldValue?: string;
	textFieldOnClick?: (value: string) => void;
	onClickForBlur?: boolean;
	onChangeCond?: (value: string) => boolean;
	placeHolder?: string;
	icon?: React.ReactNode;
	withoutIcon?: boolean;
	psw?: boolean;
	fontLight?: boolean;
	deleteValue?: boolean;
	onlyNumbers?: boolean;
	unit?: string;
	maxLength?: number;
	helperText?: string;
	textFieldStyle?: string;

	showArrow?: boolean;
	spaceBetween?: boolean;
	noPaddingTop?: boolean;
	noPaddingLeft?: boolean;

	notFilledIn?: boolean;
	isSelected?: boolean;

	mainStyle?: string;
	typographyStyle?: string;
	middleArrowStyle?: string;

	onClick?: () => void;
}

function LabelAndValue({
	label,
	value,
	textFieldValue,
	textFieldOnClick,
	placeHolder,
	icon,
	withoutIcon,
	psw,
	fontLight,
	deleteValue,
	onlyNumbers,
	unit,
	maxLength,
	helperText,
	textFieldStyle,
	spaceBetween,
	showArrow,
	noPaddingTop,
	noPaddingLeft,
	notFilledIn,
	isSelected,
	onClick,
	onClickForBlur,
	onChangeCond,
	mainStyle,
	typographyStyle,
	middleArrowStyle,
	sideContent,
}: LabelAndValueProps) {
	return (
		<Box
			className={`flex w-full relative items-center h-7 
						${mainStyle} ${!noPaddingLeft && "pl-2"}  ${!spaceBetween && "gap-3"} ${!noPaddingTop && "mt-4"} `}>
			<Box
				className={`relative flex items-center 
							${spaceBetween && "w-1/2"}`}>
				{isSelected && <Typography className="absolute -left-[1.3rem] txt-clr-neutral text-xs transition duration-150 ease-in-out ">⬤</Typography>}

				<Typography
					onClick={onClick}
					className={`${typographyStyle}  ${!isSelected && "font-light "} ${!spaceBetween && "text-nowrap"} ${onClick && "hover:text-[#b7a71d] cursor-pointer select-none"}`}>
					{label}
				</Typography>

				{sideContent}
			</Box>

			{!spaceBetween && (value || notFilledIn || textFieldOnClick || showArrow) && (
				<Typography
					className={`text-gray-400 font-light text-nowrap 
								${middleArrowStyle}`}>
					»
				</Typography>
			)}

			{textFieldOnClick ? (
				<TextFieldWithIcon
					psw={psw}
					canBeEmptyValue
					previousValue={textFieldValue}
					placeHolder={placeHolder || "Není vyplněno"}
					noPaddingY
					withoutIcon={withoutIcon}
					unit={unit}
					helperText={helperText}
					maxLength={maxLength}
					onlyNumbers={onlyNumbers}
					fontLight={fontLight}
					icon={icon}
					dontDeleteValue={!deleteValue}
					style={"flex-grow " + textFieldStyle}
					onClick={textFieldOnClick}
					onClickForBlur={onClickForBlur}
					onChangeCond={onChangeCond}
				/>
			) : (
				<Typography
					onClick={onClick}
					className={`${typographyStyle} ${!value && "text-gray-400 font-light"} ${spaceBetween && !isSelected && "font-light"} ${onClick && "hover:text-blue-600 cursor-pointer select-none"}`}>
					{value || (notFilledIn && "Není vyplněno")}
				</Typography>
			)}
		</Box>
	);
}

export default LabelAndValue;
