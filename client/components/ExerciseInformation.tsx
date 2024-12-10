import React, { ReactNode } from "react";
import GeneralCard from "./GeneralCard";
import { Box, CardContent, Typography } from "@mui/material";
import KeyValueLine from "./KeyValueLine";
import Title from "./Title";

function ExerciseInformation() {
  return (
    <Box component="div" className="flex flex-col items-center space-y-0">
      <Box component="div" className="my-6 w-full">
        <GeneralCard title="Informace o cviku">
          <CardContent className="pt-0 px-3">
            <Box component="div" className="flex pt-2 pb-16">
              <Box component="div" className="flex flex-col gap-1 w-1/4 ">
                <KeyValueLine
                  title="Název cviku"
                  value="Přitahovaní olympijské osy v předklonu"
                />
                <KeyValueLine title="Náročnost" value="střední" />

                <KeyValueLine title="Typ cviku" value="komplexní" />

                <KeyValueLine
                  title="Primární zaměření"
                  value="široký sval zádový"
                />

                <KeyValueLine
                  title="Sekundární zaměření"
                  value="břicho, nohy, dvojhlavý sval pažní, předloktí "
                />

                <KeyValueLine title="Doporučená váha" value="20 - 40 kg" />

                <KeyValueLine
                  title="Doporučený počet opakování"
                  value="8 - 10"
                />

                <KeyValueLine title="Doporučený počet sérií" value="3" />

                <KeyValueLine
                  title="Nutné vybavení"
                  value="olympijská osa, závaží"
                />

                <KeyValueLine
                  title="Doporučené vybavení"
                  value="brzdy na olympijskou osu"
                />

                <KeyValueLine title="Nutná asistence" value="ne" />

                <KeyValueLine
                  title="Cvik je cílený na"
                  value="sílu, hypertrofii"
                />
              </Box>
            </Box>

            <Box
              component="div"
              className="border-t border-gray-300 w-full absolute left-0"
            />
            <Typography
              component="p"
              className="text-nowrap pt-3 pb-1 pl-3 font-medium"
            >
              Způsob provedení
            </Typography>
            <Typography component="p" className="pl-3">
              Mírný předklon, mírné pokrčení kolen, pevný střed těla. Pohyb se
              provádí přítahováním osy ke spodní části hrudníku. Lokty by měly
              být v konečné fázi mírně nad tělem a tlačeny směrem k tělu. Pro
              lehčí variantu se může osa mezi opakováními pokládat na zem.
            </Typography>
          </CardContent>
        </GeneralCard>
      </Box>
    </Box>
  );
}

export default ExerciseInformation;
