import { Box, Typography } from "@mui/material";
import GeneralCard from "./GeneralCard";
import KeyValueLine from "./KeyValueLine";

function ExerciseInformation() {
	return (
		<>
			<GeneralCard
				title="Informace o cviku"
				border
				height="h-2/3">
				<Box className="flex ">
					<Box className="flex flex-col gap-4 ">
						<KeyValueLine
							title="Název cviku"
							value="Přitahovaní olympijské osy v předklonu"
						/>
						<KeyValueLine
							title="Náročnost"
							value="střední"
						/>

						<KeyValueLine
							title="Typ cviku"
							value="komplexní"
						/>

						<KeyValueLine
							title="Primární zaměření"
							value="široký sval zádový"
						/>

						<KeyValueLine
							title="Sekundární zaměření"
							value="břicho, nohy, dvojhlavý sval pažní, předloktí "
						/>

						<KeyValueLine
							title="Doporučená váha"
							value="20 - 40 kg"
						/>

						<KeyValueLine
							title="Doporučený počet opakování"
							value="8 - 10"
						/>

						<KeyValueLine
							title="Doporučený počet sérií"
							value="3"
						/>

						<KeyValueLine
							title="Nutné vybavení"
							value="olympijská osa, závaží"
						/>

						<KeyValueLine
							title="Doporučené vybavení"
							value="brzdy na olympijskou osu"
						/>

						<KeyValueLine
							title="Nutná asistence"
							value="ne"
						/>

						<KeyValueLine
							title="Cvik je cílený na"
							value="sílu, hypertrofii"
						/>
					</Box>
				</Box>
			</GeneralCard>

			<GeneralCard
				title="Způsob provedení cviku"
				second
				border
				height="h-1/3">
				<Typography className="pl-3 font-light">
					Mírný předklon, mírné pokrčení kolen, pevný střed těla. Pohyb se provádí přítahováním osy ke spodní části hrudníku. Lokty by měly být v konečné fázi mírně nad tělem a tlačeny směrem k tělu. Pro lehčí variantu se může osa mezi
					opakováními pokládat na zem.
				</Typography>
				{/*<Typography className="pl-3 font-light">
					Začněte s osou na zemi, nohy na šířku ramen, chodidla mírně vytočená ven. Předkloníte se s rovnými zády a uchopíte osu nadhmatem nebo smíšeným úchopem (jedna ruka nadhmat, druhá podhmat). Střed těla zpevněný, lopatky
					zatažené. Pohyb začíná zvedáním osy směrem vzhůru pomocí tahu nohou a následně narovnáním trupu. Při návratu osu kontrolovaně spusťte zpět na zem. Záda udržujte rovná po celou dobu provedení cviku. Pro lehčí variantu lze
					použít trap bar.
				</Typography>*/}
			</GeneralCard>
		</>
	);
}

export default ExerciseInformation;
