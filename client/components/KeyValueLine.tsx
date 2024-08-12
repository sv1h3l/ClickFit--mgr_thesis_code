import React, { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

function KeyValueLineComp({ title, value }: { title : ReactNode, value: ReactNode}) {
  return (
    <Box component="div" className="flex gap-4 w-full px-3">
      <Typography component="p" className="font-medium text-nowrap">
        {title}
      </Typography>

      <Typography component="p" className="text-nowrap">
        {value}
      </Typography>
    </Box>
  );
}

export default KeyValueLineComp;
