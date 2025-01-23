import { Box } from "@mui/material";
import GeneralCard from "./GeneralCard";
import KeyValueLine from "./KeyValueLine";
import Title from "./Title";

function SportData() {
	return (
		<GeneralCard title="Sportovní údaje">
			<Box className="flex flex-col gap-4 w-1/4 ">
				<Title title="Bodybuilding" />
				<KeyValueLine
					title="Sportu jsem se začal věnovat dne"
					value="17. 10. 2014"
				/>
				<KeyValueLine
					title="Somatotyp"
					value="Mesomorph"
				/>
				<KeyValueLine
					title="Délka tréninku"
					value="krátká"
				/>
				<KeyValueLine
					title="Maximální počet tréninkových dní"
					value=""
				/>

				<Title title="Powerlifting" />
				<KeyValueLine
					title="Sportu jsem se začal věnovat dne"
					value="23. 2. 2017"
				/>
				<KeyValueLine
					title="Somatotyp"
					value="Mesomorph"
				/>
				<KeyValueLine
					title="Délka tréninku"
					value="dlouhá"
				/>
				<KeyValueLine
					title="Maximální počet tréninkových dní"
					value="3"
				/>
				<KeyValueLine
					title="Maximální zvednutá váha - dřep"
					value="220 kg"
				/>
				<KeyValueLine
					title="Maximální zvednutá váha - bench press"
					value="150 kg"
				/>
				<KeyValueLine
					title="Maximální zvednutá váha - mrtvý tah"
					value="250 kg"
				/>

				<Title title="Japonský šerm" />
				<KeyValueLine
					title="100 suburi"
					value="náročné"
				/>
			</Box>
		</GeneralCard>
	);
}

export default SportData;
