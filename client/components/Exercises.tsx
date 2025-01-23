import { Box, Typography } from "@mui/material";
import GeneralCard from "./GeneralCard";
import Title from "./Title";

function Exercises() {
	return (
		<GeneralCard
			title="Cviky"
			height="h-2/3"
			border
			second
			percentage={25}>
			<Title title="Záda" />
			<Box className="pl-3 relative">
				<Typography className="absolute -left-4   text-gray-200">⬤</Typography>

				<Typography className="">Přitahovaní olympijské osy v předklonu</Typography>
				<Typography className="font-light">Stahování horní kladky nadhmatem ve stoje</Typography>
				<Typography className="font-light">Mrtvý tah</Typography>
			</Box>

			<Title title="Biceps" />
			<Box className="pl-3 ">
				<Typography className="font-light">21</Typography>
				<Typography className="font-light">Bicepsové zdvihy s EZ osou</Typography>
				<Typography className="font-light">Kladivové zdvihy jednoručky ve stoje</Typography>
			</Box>
		</GeneralCard>
	);
}

export default Exercises;
