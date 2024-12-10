import React, { ReactNode } from "react";
import { Box, Card, Typography } from "@mui/material";

interface GeneralCardProps {
  firstColumnTitle: string;
  secondColumnTitle: string;
  children: ReactNode;
}

function GeneralCard({
  firstColumnTitle,
  secondColumnTitle,
  children,
}: GeneralCardProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <Card style={{ minWidth: 300, maxWidth: 1000 }} className="mx-4 relative">
      <Box component="div" className="flex flex-wrap">
        <Typography className="p-3 font-bold text-xl w-1/2">
          {firstColumnTitle}
        </Typography>

        <Typography className="p-3 font-bold text-xl w-1/2">
          {secondColumnTitle}
        </Typography>
      </Box>

      <div className="border-t border-gray-300 w-full"></div>

      {children}
    </Card>
  );
}

export default GeneralCard;
