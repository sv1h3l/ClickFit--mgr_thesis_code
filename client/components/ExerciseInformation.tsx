import { Box, Typography } from "@mui/material";
import GeneralCard from "./GeneralCard";
import LabelAndValue from "./LabelAndValue";

function ExerciseInformation() {
    return (
        <>
            <GeneralCard
                title="Informace o cviku"
                border
                height="h-2/3"
            >
                <Box className="flex flex-col  ">
                    <LabelAndValue
                        noPaddingTop
                        label="Název cviku"
                        value="Přitahovaní olympijské osy v předklonu"
                    />
                    <LabelAndValue
                        label="Náročnost"
                        value="střední"
                    />

                    <LabelAndValue
                        label="Typ cviku"
                        value="komplexní"
                    />

                    <LabelAndValue
                        label="Primární zaměření"
                        value="široký sval zádový"
                    />

                    <LabelAndValue
                        label="Sekundární zaměření"
                        value="břicho, nohy, dvojhlavý sval pažní, předloktí "
                    />

                    <LabelAndValue
                        label="Doporučená váha"
                        value="20 - 40 kg"
                    />

                    <LabelAndValue
                        label="Doporučený počet opakování"
                        value="8 - 10"
                    />

                    <LabelAndValue
                        label="Doporučený počet sérií"
                        value="3"
                    />

                    <LabelAndValue
                        label="Nutné vybavení"
                        value="olympijská osa, závaží"
                    />

                    <LabelAndValue
                        label="Doporučené vybavení"
                        value="brzdy na olympijskou osu"
                    />

                    <LabelAndValue
                        label="Nutná asistence"
                        value="ne"
                    />

                    <LabelAndValue
                        label="Cvik je cílený na"
                        value="sílu, hypertrofii"
                    />
                </Box>
            </GeneralCard>

            <GeneralCard
                title="Způsob provedení cviku"
                second
                border
                height="h-1/3"
            >
                <Typography className="pl-3 font-light ">
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
