import { Sport } from "@/api/get/getSportsReq";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Box } from "@mui/material";
import EditButton from "../small/EditButton";
import LabelAndValue from "../small/LabelAndValue";
import Title from "../small/Title";
import GeneralCard from "./GeneralCard";

interface Props {
	sportsData: StateAndSetFunction<Sport[]>;
	selectedSport: StateAndSetFunction<Sport | null>;
}

const Sports = (props: Props) => {
	return (
		<GeneralCard
			height="h-full max-h-full"
			border
			firstTitle="Sporty"
			firstChildren={
				<Box className=" h-full ">
					<Title
						title="Sport"
						secondTitle="Autor"
						smallPaddingTop
					/>

					{props.sportsData.state.map((sport) => (
						<LabelAndValue
							key={sport.sportId}
							spaceBetween
							label={sport.sportName}
							value={sport.userName}
							isSelected={sport.sportId == props.selectedSport.state?.sportId}
							onClick={() => {
								props.selectedSport.setState(sport);
							}}
						/>
					))}
				</Box>
			}
		/>
	);
};

export default Sports;
