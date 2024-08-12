import React, { ReactNode } from "react";
import GeneralCard from "./GeneralCard";
import { Box, CardContent, Typography } from "@mui/material";

type PersonalAndHealthDataProps = {
  children: ReactNode;
};

function PersonalAndHealthData({ children }: PersonalAndHealthDataProps) {
  return (
    <Box component="div" className="flex flex-col items-center space-y-0">
      <Box component="div" className="my-6 w-full">
        <GeneralCard title="Osobní údaje">
          <CardContent className="pt-0 px-3">
            <Box component="div" className="flex pt-2">
              <Box component="div" className="flex flex-col gap-1 w-1/4 ">
                <Typography className=" font-medium">Email</Typography>
                <Typography className=" font-medium">Jméno</Typography>
                <Typography className=" font-medium">Příjmení</Typography>
                <Typography className=" font-medium">Věk</Typography>
                <Typography className=" font-medium">Výška</Typography>
                <Typography className=" font-medium">Váha</Typography>
                <Typography className=" font-medium">Pohlaví</Typography>
              </Box>

              <Box component="div" className="flex flex-col gap-1">
                {children}
              </Box>
            </Box>
          </CardContent>
        </GeneralCard>
      </Box>

      <GeneralCard title="Zdravotní údaje">
        <CardContent className="py-0 px-3">
          <Box component="div" className="h-36">
            <Typography className="font-bold pt-2 pl-0 text-lg">
              Zdravotní problémy a omezení
            </Typography>
            <Typography className="px-3 pb-3">
              Výrazná bolest kolen při cvičení, mírná bolest levého kotníku
            </Typography>
          </Box>

          <div className="border-t border-gray-300 w-full absolute left-0" />

          <Box component="div" className="h-36">
            <Typography className="font-bold pt-2 text-lg">
              Uskutečněné operace
            </Typography>
            <Typography className="px-3">
              Operace rotátorové manžety, plastika křížových vazů
            </Typography>
          </Box>
        </CardContent>
      </GeneralCard>
    </Box>
  );
}

export default PersonalAndHealthData;
