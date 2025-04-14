import { Box, Typography } from "@mui/material";

interface Props {
	firstLabel: string;
	firstValue: string;

	secondLabel: string;
	secondValue: string;

	goal?: boolean;
}

const DoubleLabelAndValue = (props: Props) => {
	return (
		<Box className={`flex flex-col w-full items-center px-1`}>
			<Typography className={`font-bold`}>{props.goal ? "Cíl" : "Záznam"}</Typography>
			<Box className="flex gap-3">
				<Box className="text-right">
					<Typography className={`font-light `}>{props.firstLabel}</Typography>
					<Typography className={`font-light `}>{props.secondLabel}</Typography>
				</Box>

				<Box>
					<Typography className={`text-gray-400 font-light text-nowrap`}>»</Typography>
					<Typography className={`text-gray-400 font-light text-nowrap`}>»</Typography>
				</Box>

				<Box>
					<Typography>{props.firstValue}</Typography>
					<Typography>{props.secondValue}</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default DoubleLabelAndValue;
