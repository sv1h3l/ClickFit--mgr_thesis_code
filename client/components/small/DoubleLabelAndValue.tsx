import { useAppContext } from "@/utilities/Context";
import { Box, Typography } from "@mui/material";

interface Props {
	firstLabel: string;
	firstValue: string;

	secondLabel: string;
	secondValue: string;

	goal?: string;
	style?: string;
	size?: string;
}

const DoubleLabelAndValue = (props: Props) => {
	const context = useAppContext();

	return (
		<>
			{props.goal ? <Typography className="w-full text-center text-lg">{props.goal}</Typography> : null}

			<Box
				className={`grid w-full px-1`}
				style={{ gridTemplateColumns: "fit-content(100%) min-content 1fr" }}>
				<Typography className={`font-light text-right ${props.size}`}>{props.firstLabel}</Typography>
				<Typography className={`text-gray-400 font-light text-center mx-3${props.size}`}>»</Typography>
				<Typography className={`text-left ${props.size}`}>{props.firstValue}</Typography>

				<Typography className={`font-light text-right ${props.size}`}>{props.secondLabel}</Typography>
				<Typography className={`text-gray-400 font-light text-center mx-3 ${props.size}`}>»</Typography>
				<Typography className={`text-left ${props.size}`}>{props.secondValue}</Typography>
			</Box>
		</>
	);
};

export default DoubleLabelAndValue;
