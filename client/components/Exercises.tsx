import React, { ReactNode } from "react";
import GeneralCard from "./GeneralCard";
import { Box, CardContent, Typography } from "@mui/material";
import KeyValueLine from "./KeyValueLine";
import Title from "./Title";
import TwoColumnCard from "./TwoColumnCard";

function Exercises() {
  return (
    <Box component="div" className="flex flex-col items-center space-y-0">
      <Box component="div" className="my-6 w-full">
        <GeneralCard title="Cviky">
          <CardContent className="pt-0 px-3">
            <Box component="div" className="pt-2">
              <Title horizontalLine={false} title="Záda" />
              <Box component="div" className="px-3">
                <Typography component="p" className="py-1 underline">
                  Přitahovaní olympijské osy v předklonu
                </Typography>
                <Typography component="p" className="py-1">
                  Stahování horní kladky nadhmatem ve stoje
                </Typography>
                <Typography component="p" className="py-1">
                  Mrtvý tah
                </Typography>
              </Box>

              <Title horizontalLine={true} title="Biceps" />
              <Box component="div" className="px-3">
                <Typography component="p" className="py-1">
                  21
                </Typography>
                <Typography component="p" className="py-1">
                  Bicepsové zdvihy s EZ osou
                </Typography>
                <Typography component="p" className="py-1">
                  Kladivové zdvihy jednoručky ve stoje
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </GeneralCard>
      </Box>
    </Box>
  );
}

export default Exercises;
