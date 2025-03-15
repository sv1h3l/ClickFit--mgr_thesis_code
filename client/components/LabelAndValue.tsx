import { Box, Typography } from "@mui/material";
import TextFieldWithIcon from "./TextFieldWithPlus";

interface LabelAndValueProps {
	label?: string;
	value?: string;
	sideContent?: React.ReactNode;

	textFieldValue?: string;
	textFieldOnClick?: (value: string) => void;
	icon?: React.ReactNode;

	spaceBetween?: boolean;
	noPaddingTop?: boolean;
	noPaddingLeft?: boolean;

	notFilledIn?: boolean;
	isSelected?: boolean;

	mainStyle?: string;
	typographyStyle?: string;

	onClick?: () => void;
}

function LabelAndValue({ label, value, textFieldValue, textFieldOnClick, icon, spaceBetween, noPaddingTop, noPaddingLeft, notFilledIn, isSelected, onClick, mainStyle, typographyStyle, sideContent }: LabelAndValueProps) {
	return (
		<Box
			className={`flex w-full relative items-center
						${mainStyle} ${!noPaddingLeft && "pl-2"}  ${!spaceBetween && "gap-3"} ${!noPaddingTop && "mt-4"} `}>
			<Box
				className={`relative flex items-center
							${spaceBetween && "w-1/2"}`}>
				{isSelected && <Typography className="absolute -left-[1.15rem] text-blue-400 text-xs">⬤</Typography>}

				<Typography
					onClick={onClick}
					className={`${typographyStyle}  ${!isSelected && "font-light "} ${!spaceBetween && "text-nowrap"} ${onClick && "hover:text-blue-600 cursor-pointer select-none"}`}>
					{label}
				</Typography>

				{sideContent}
			</Box>

			{!spaceBetween && (value || notFilledIn || textFieldOnClick) && <Typography className="text-gray-400 font-light text-nowrap">»</Typography>}

			{textFieldOnClick ? (
				<TextFieldWithIcon
					previousValue={textFieldValue}
					placeHolder={"Není vyplněno"}
					noPaddingY
					icon={icon}
					dontDeleteValue
					style="flex-grow"
					onClick={textFieldOnClick}
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
