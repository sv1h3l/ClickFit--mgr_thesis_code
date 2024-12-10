import React, { ReactNode } from "react";
import GeneralCard from "./GeneralCard";
import { Box, CardContent, Typography } from "@mui/material";
import KeyValueLine from "./KeyValueLine";
import Title from "./Title";

function SportData() {
  return (
    <Box component="div" className="flex flex-col items-center space-y-0">
      <Box component="div" className="my-6 w-full">
        <GeneralCard title="Sportovní údaje">
          <CardContent className="pt-0 px-3">
            <Box component="div" className="flex pt-2">
              <Box component="div" className="flex flex-col gap-1 w-1/4 ">
                <Title horizontalLine={false} title="Bodybuilding" />
                <KeyValueLine
                  title="Sportu jsem se začal věnovat dne"
                  value="17. 10. 2014"
                />
                <KeyValueLine title="Somatotyp" value="Mesomorph" />
                <KeyValueLine title="Délka tréninku" value="krátká" />
                <KeyValueLine
                  title="Maximální počet tréninkových dní"
                  value=""
                />

                <Title horizontalLine={true} title="Powerlifting" />
                <KeyValueLine
                  title="Sportu jsem se začal věnovat dne"
                  value="23. 2. 2017"
                />
                <KeyValueLine title="Somatotyp" value="Mesomorph" />
                <KeyValueLine title="Délka tréninku" value="dlouhá" />
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

                <Title horizontalLine={true} title="Japonský šerm" />
                <KeyValueLine title="100 suburi" value="náročné" />
              </Box>
            </Box>
          </CardContent>
        </GeneralCard>
      </Box>
    </Box>
  );
}

export default SportData;
