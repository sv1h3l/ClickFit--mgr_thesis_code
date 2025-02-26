import { Box, Typography } from "@mui/material";

interface LabelAndValueProps {
	label?: string;
	value?: string;

	spaceBetween?: boolean;
	noPaddingTop?: boolean;
	noPaddingLeft?: boolean;

	notFilledIn?: boolean;
	isSelected?: boolean;

	style?: string;

	onClick?: () => void;
}

function LabelAndValue({ label, value, spaceBetween, noPaddingTop, noPaddingLeft, notFilledIn, isSelected, onClick, style }: LabelAndValueProps) {
	return (
		<Box
			onClick={onClick}
			className={`flex w-full relative  
						${style} ${!noPaddingLeft && "pl-2"}  ${!spaceBetween && "gap-3"} ${!noPaddingTop && "mt-4"} ${onClick && "hover:text-blue-600 cursor-pointer select-none"}`}>
			{isSelected && <Typography className="absolute -left-4 text-blue-400">⬤</Typography>}

			<Typography
				className={` 
                			${spaceBetween && "w-1/2"} ${!isSelected && "font-light "} ${!spaceBetween && "text-nowrap"}`}>
				{label}
			</Typography>

			{!spaceBetween && (value || notFilledIn) && <Typography className="text-gray-400 font-light text-nowrap">»</Typography>}

			<Typography
				className={`
                        	${!value && "text-gray-400 font-light"} ${spaceBetween && !isSelected && "font-light"}`}>
				{value || (notFilledIn && "Není vyplněno")}
			</Typography>
		</Box>
	);
}

export default LabelAndValue;
