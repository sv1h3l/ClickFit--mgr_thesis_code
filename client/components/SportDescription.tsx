import { Sport } from "@/pages/api/getSportsRequest";
import { Typography } from "@mui/material";
import GeneralCard from "./GeneralCard";

interface SportDescriptionProps {
	selectedSport: Sport | null;
}

function SportDescription({ props }: { props: SportDescriptionProps }) {
	return (
		<>
			<GeneralCard
				firstTitle="Popis sportu"
				height="h-full"
				firstChildren={
					props.selectedSport && (
						<>
							<Typography className="whitespace-pre-wrap break-words font-light">{props.selectedSport.description}</Typography>
						</>
					)
				}></GeneralCard>
		</>
	);
}

export default SportDescription;
