import { Sport } from "@/api/getSportsRequest";
import { Typography } from "@mui/material";
import GeneralCard from "./GeneralCard";

interface SportDescriptionProps {
	selectedSport: Sport | null;
}

function SportDescription({ props }: { props: SportDescriptionProps }) {
	return (
		<>
			<GeneralCard
				height="h-full"

				firstTitle="Popis"
				firstChildren={
					props.selectedSport && (
						<>
							<Typography className="whitespace-pre-wrap break-words font-light">{props.selectedSport.description}</Typography>
						</>
					)
				}
				
				secondTitle="Nastavení"></GeneralCard>
		</>
	);
}

export default SportDescription;
