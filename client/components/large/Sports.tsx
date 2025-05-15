import { Sport } from "@/api/get/getSportsReq";
import { useAppContext } from "@/utilities/Context";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Box, Typography } from "@mui/material";
import LabelAndValue from "../small/LabelAndValue";

interface Props {
	sportsData: StateAndSetFunction<Sport[]>;
	selectedSport: StateAndSetFunction<Sport | null>;
}

const Sports = (props: Props) => {
	const context = useAppContext();

	return (
		<Box className=" h-full ">
			<Box className="flex rounded-xl  overflow-hidden pt-1.5 px-2.5 ">
				<Typography className="w-1/2 font-light italic text-[0.9rem]">Sport</Typography>
				<Typography className="w-1/2 font-light italic text-[0.9rem] pl-2">Autor</Typography>
			</Box>

			{props.sportsData.state.map((sport) => (
				<LabelAndValue
					key={sport.sportId}
					spaceBetween
					label={sport.sportName}
					value={sport.userName}
					isSelected={sport.sportId == props.selectedSport.state?.sportId}
					onClick={() => {
						context.setActiveSection(2);
						props.selectedSport.setState(sport);
					}}
				/>
			))}
		</Box>
	);
};

export default Sports;
