import { Box } from "@mui/material";
import GeneralCard from "./GeneralCard";
import LabelAndValue from "../small/LabelAndValue";
import Title from "../small/Title";

function SportData({ fullHeight }: { fullHeight?: boolean }) {
	return (
		<GeneralCard
			firstTitle="Sportovní údaje"
			border={!fullHeight}
			height={`${fullHeight ? "h-full" : "h-5/6"}`}
			firstChildren={
				<Box className="flex flex-col">
					<Title
						title="Bodybuilding"
						smallPaddingTop
					/>
					<LabelAndValue
						label="Sportu jsem se začal věnovat dne"
						value="17. 10. 2014"
					/>
					<LabelAndValue
						label="Somatotyp"
						value="Mesomorph"
					/>
					<LabelAndValue
						label="Délka tréninku"
						value="krátká"
					/>
					<LabelAndValue
						label="Maximální počet tréninkových dní"
						notFilledIn
					/>

					<Title title="Powerlifting" />
					<LabelAndValue
						label="Sportu jsem se začal věnovat dne"
						value="23. 2. 2017"
					/>
					<LabelAndValue
						label="Somatotyp"
						value="Mesomorph"
					/>
					<LabelAndValue
						label="Délka tréninku"
						value="dlouhá"
					/>
					<LabelAndValue
						label="Maximální počet tréninkových dní"
						value="3"
					/>
					<LabelAndValue
						label="Maximální zvednutá váha - dřep"
						value="220 kg"
					/>
					<LabelAndValue
						label="Maximální zvednutá váha - bench press"
						value="150 kg"
					/>
					<LabelAndValue
						label="Maximální zvednutá váha - mrtvý tah"
						value="250 kg"
					/>

					<Title title="Japonský šerm" />
					<LabelAndValue
						label="100 suburi"
						value="náročné"
					/>
				</Box>
			}
		/>
	);
}

export default SportData;
