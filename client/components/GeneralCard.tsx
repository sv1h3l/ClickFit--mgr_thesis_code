import React, { isValidElement, ReactElement, ReactNode } from "react";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";

interface GeneralCardProps {
  title: string;
  children: ReactNode;
}

function GeneralCard({ title, children }: GeneralCardProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    /*<div className="flex justify-center items-center h-screen">*/
      <Card style={{ minWidth: 300, maxWidth: 1000}} className="mx-16">
        <Typography className="p-3 font-bold">{title}</Typography>

        <div className="border-t border-gray-300 w-full"></div>

        {children}
      </Card>
    /*</div>*/
  );
}

export default GeneralCard;
