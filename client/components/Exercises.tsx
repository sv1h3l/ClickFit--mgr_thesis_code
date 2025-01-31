import { Box, Typography } from "@mui/material";
import GeneralCard from "./GeneralCard";
import Title from "./Title";
import LabelAndValue from "./LabelAndValue";

function Exercises() {
    return (
        <GeneralCard
            title="Cviky"
            height="h-2/3"
            border
            second
            percentage={25}
        >
            <Title
                title="Záda"
                smallPaddingTop
            />

            <LabelAndValue isSelected label="Přitahovaní olympijské osy v předklonu" />
            <LabelAndValue label="Stahování horní kladky nadhmatem ve stoje" />
            <LabelAndValue label="Mrtvý tah" />

            <Title title="Biceps" />
            <LabelAndValue label="21" />
            <LabelAndValue label="Bicepsové zdvihy s EZ osou" />
            <LabelAndValue label="Kladivové zdvihy jednoručky ve stoje" />
        </GeneralCard>
    );
}

export default Exercises;
