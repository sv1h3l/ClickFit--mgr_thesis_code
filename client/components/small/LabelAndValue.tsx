import { useAppContext } from "@/utilities/Context";
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
	icon?: string | number;
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
	canWrap?: boolean;
	noPaddingTop?: boolean;
	noPaddingLeft?: boolean;
	reverse?: boolean;
	italic?: boolean;

	notFilledIn?: boolean;
	notFilledInContent?: string;
	isSelected?: boolean;
	disableSelection?: boolean;

	mainStyle?: string;
	firstTypographyStyle?: string;
	secondTypographyStyle?: string;
	middleArrowStyle?: string;

	secondClick?: boolean;
	disableSaveAnimation?: boolean;

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
	canWrap,
	showArrow,
	noPaddingTop,
	reverse,
	italic,
	noPaddingLeft,
	notFilledIn,
	notFilledInContent,
	isSelected,
	disableSelection,
	secondClick,
	onClick,
	disableSaveAnimation,
	onClickForBlur,
	onChangeCond,
	mainStyle,
	firstTypographyStyle,
	secondTypographyStyle,
	middleArrowStyle,
	sideContent,
}: LabelAndValueProps) {
	const context = useAppContext();

	return (
		<Box
			className={`flex  relative  transition-all duration-200 ease-in-out
						${onClick && !disableSelection ? "items-center" : "items-start"}
						${mainStyle} ${!noPaddingLeft && "pl-2"}  ${!spaceBetween && "gap-3"} ${!noPaddingTop && "mt-4"} 
						${
							!disableSelection && onClick && isSelected
								? `border-[0.125rem] rounded-xl min-h-8  ${context.bgQuaternaryColor} ${context.borderQuaternaryColor} ${secondClick && "cursor-pointer"}`
								: !disableSelection && onClick
								? `cursor-pointer border-[0.125rem] rounded-xl min-h-8 ${context.bgSecondaryColor + context.borderSecondaryColor + context.bgHoverTertiaryColor + context.borderHoverTertiaryColor}`
								: `h-7`
						}`}
			onClick={() => {
				!disableSelection && onClick?.();
			}}>
			<Box
				className={`relative flex items-center 
							${spaceBetween && "w-1/2"}`}>
				<Typography
					className={` ${reverse && "font-normal"} ${italic && "italic"} ${firstTypographyStyle}  ${!isSelected && "font-light "} ${!isSelected && onClick && "tracking-[0.02em] "} ${!canWrap && !spaceBetween ? "text-nowrap" :""}
						${!disableSelection && onClick && " select-none"} ${!disableSelection && onClick && "py-1"}`}>
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
					disableSaveAnimation={disableSaveAnimation}
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
					className={`${reverse && "font-light"} ${italic && "italic"} ${secondTypographyStyle} ${!value && "opacity-60 font-light"} ${spaceBetween && !isSelected && "font-light"}
						${!disableSelection && onClick && " select-none"}`}>
					{value || (notFilledIn && (notFilledInContent || "Není vyplněno"))}
				</Typography>
			)}
		</Box>
	);
}

export default LabelAndValue;
