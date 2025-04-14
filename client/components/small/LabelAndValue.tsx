import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Box, Typography } from "@mui/material";
import TextFieldWithIcon from "./TextFieldWithIcon";

interface LabelAndValueProps {
	label?: string;
	value?: string;
	sideContent?: React.ReactNode;
	externalValue?: StateAndSetFunction<string>;

	textFieldValue?: string;
	textFieldOnClick?: (value: string) => void;
	disabledTextField?: boolean;
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
	customMargin?: string;

	showArrow?: boolean;
	spaceBetween?: boolean;
	noPaddingTop?: boolean;
	noPaddingLeft?: boolean;
	reverse?: boolean;
	italic?: boolean;

	notFilledIn?: boolean;
	isSelected?: boolean;
	disableSelection?: boolean;

	mainStyle?: string;
	firstTypographyStyle?: string;
	secondTypographyStyle?: string;
	middleArrowStyle?: string;

	onClick?: () => void;
}

function LabelAndValue({
	label,
	value,
	textFieldValue,
	textFieldOnClick,
	disabledTextField,
	placeHolder,
	icon,
	externalValue,
	withoutIcon,
	psw,
	fontLight,
	deleteValue,
	customMargin,
	onlyNumbers,
	unit,
	maxLength,
	helperText,
	textFieldStyle,
	spaceBetween,
	showArrow,
	noPaddingTop,
	reverse,
	italic,
	noPaddingLeft,
	notFilledIn,
	isSelected,
	disableSelection,
	onClick,
	onClickForBlur,
	onChangeCond,
	mainStyle,
	firstTypographyStyle,
	secondTypographyStyle,
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
					onClick={() => {
						!disableSelection && onClick?.();
					}}
					className={` ${reverse && "font-normal"} ${italic && "italic"} ${firstTypographyStyle}  ${!isSelected && "font-light "} ${!isSelected && onClick && "tracking-[0.02em] "} ${!spaceBetween && "text-nowrap"}
						${!disableSelection && onClick && "hover:text-[#b7a71d] cursor-pointer select-none"}`}>
					{label}
				</Typography>

				{sideContent}
			</Box>

			{!spaceBetween && (value || notFilledIn || textFieldOnClick || showArrow) && (
				<Typography
					className={`opacity-50 font-light text-nowrap  ${italic && "italic"}
								${middleArrowStyle}`}>
					{reverse ? "«" : "»"}
				</Typography>
			)}

			{textFieldOnClick ? (
				<TextFieldWithIcon
					psw={psw}
					externalValue={externalValue}
					canBeEmptyValue
					previousValue={textFieldValue}
					placeHolder={placeHolder || "Není vyplněno"}
					noPaddingY
					disabled={disabledTextField}
					withoutIcon={withoutIcon}
					unit={unit}
					customMargin={customMargin}
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
					onClick={() => {
						!disableSelection && onClick?.();
					}}
					className={`${reverse && "font-light"} ${italic && "italic"} ${secondTypographyStyle} ${!value && "opacity-60 font-light"} ${spaceBetween && !isSelected && "font-light"}
						${!disableSelection && onClick && "hover:text-blue-600 cursor-pointer select-none"}`}>
					{value || (notFilledIn && "Není vyplněno")}
				</Typography>
			)}
		</Box>
	);
}

export default LabelAndValue;
