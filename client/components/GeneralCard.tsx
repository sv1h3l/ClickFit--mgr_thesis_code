import { Box, CardContent, Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface GeneralCardProps {
	title: string;
	second?: boolean;
	percentage?: number;
	border?: boolean;
	height?: string;
	children: ReactNode;
}

function GeneralCard({ title, height, second, percentage, border, children }: GeneralCardProps) {
	const childrenArray = React.Children.toArray(children);

	return (
		<>
			{second && <Box className={`h-1/5 absolute top-[${percentage ? percentage : "40"}%] -right-0 border-r-2 border-gray-200  `}></Box>}

			<Box className={`px-8 ${border && "border-r-2 border-b-2 rounded-br-3xl border-gray-200"} overflow-y-auto ${height}`}>
				<Typography
					variant="h2"
					className={` text-3xl pb-3   ${second ? "pt-11" : "pt-6"}`}>
					{title}
				</Typography>

				<CardContent className="pt-0 pl-3">{children}</CardContent>
			</Box>
		</>
	);
}

export default GeneralCard;
