import React, { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

function TitleComp({
  title,
  horizontalLine,
}: {
  title: ReactNode;
  horizontalLine: boolean;
}) {
  return (
    <Box className={horizontalLine ? "pt-2" : ""}>
      {horizontalLine && (
        <Box component="div" className="border-t border-gray-300 w-full absolute left-0" />
      )}
      <Typography className={`${horizontalLine ? "pt-2" : ""} font-bold text-lg text-nowrap`}>{title}</Typography>
    </Box>
  );
}

export default TitleComp;
