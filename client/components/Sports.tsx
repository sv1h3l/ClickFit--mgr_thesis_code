import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import GeneralCard from "./GeneralCard";
import Title from "./Title";
import LabelAndValue from "./LabelAndValue";

const Sports = ({fullHeight} : {fullHeight?: boolean}) => {
    return (
        <GeneralCard
            title="Sporty"
            height={`${fullHeight ? "h-full" : "h-1/3"}`}
            border
        >
            <Title
                title="Název"
                secondTitle="Autor"
                smallPaddingTop
            ></Title>
            <LabelAndValue
                spaceBetween
                isSelected
                label="Bodybuilding"
                value="Jakub Švihel"
            ></LabelAndValue>
            <LabelAndValue
                spaceBetween
                label="Powerlifting"
                value="KlikFit"
            ></LabelAndValue>
            <LabelAndValue
                spaceBetween
                label="Jóga"
                value="Alfons Mucha"
            ></LabelAndValue>
            <LabelAndValue
                spaceBetween
                label="Fotbal"
                value="KlikFit"
            ></LabelAndValue>
            <LabelAndValue
                spaceBetween
                label="Japonský šerm"
                value="Jakub Švihel"
            ></LabelAndValue>
        </GeneralCard>
    );
};

export default Sports;
