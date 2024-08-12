import React, { ReactNode } from "react";
import GeneralCard from "./GeneralCard";
import { Box, CardContent, Typography } from "@mui/material";
import KeyValueLine from "./KeyValueLine";
import Title from "./Title";
import TwoColumnCard from "./TwoColumnCard";

function Sports() {
  return (
    <Box component="div" className="flex flex-col items-center space-y-0">
      <Box component="div" className="my-6 w-full">
        <TwoColumnCard
          firstColumnTitle="Název sportu"
          secondColumnTitle="Autor"
        >
          <CardContent className="pt-0">
            <Box component="div" className="grid grid-cols-2">
              <Typography component="p" className="py-2 underline">
                Bodybuilding
              </Typography>
              <Typography component="p" className="pl-3 py-2">
                Jakub Švihel
              </Typography>

              <Typography component="p" className=" py-2">
                Powerlifting
              </Typography>
              <Typography component="p" className="pl-3 py-2">
                KlikFit
              </Typography>

              <Typography component="p" className=" py-2">
                Jóga
              </Typography>
              <Typography component="p" className="pl-3 py-2">
                Alfons Mucha
              </Typography>

              <Typography component="p" className=" py-2">
                Fotbal
              </Typography>
              <Typography component="p" className="pl-3 py-2">
                KlikFit
              </Typography>

              <Typography component="p" className=" py-2">
                Japonský šerm
              </Typography>
              <Typography component="p" className="pl-3 py-2">
                Jakub Švihel
              </Typography>
            </Box>
          </CardContent>
        </TwoColumnCard>
      </Box>
    </Box>
  );
}

export default Sports;
