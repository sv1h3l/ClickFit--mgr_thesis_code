import { Box, Typography } from "@mui/material";

interface Props {
	firstLabel: string;
	firstValue: string;

	secondLabel: string;
	secondValue: string;

	goal?: string;
	style?: string;
}

const DoubleLabelAndValue = (props: Props) => {
	return (
		<Box
			className={`flex flex-col w-full  px-1
						${props.style}`}>
			<Typography className={`font-bold`}>{props.goal}</Typography>
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
