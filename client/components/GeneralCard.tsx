import { Box, CardContent, Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface GeneralCardProps {
	title?: string;
	second?: boolean;
	percentage?: number;
	border?: boolean;
	height?: string;
	width?: string;
	sideContent?: ReactNode[]; // Změna na pole ReactNode
	children: ReactNode;
}

function GeneralCard({ title, height, width, second, percentage, border, children, sideContent }: GeneralCardProps) {
	const childrenArray = React.Children.toArray(children);

	return (
		<>
			{second && <Box className={`h-1/5 absolute top-[${percentage ? percentage : "40"}%] -right-0 border-r-2 border-gray-200  `}></Box>}

			<Box className={`px-8 ${border && "border-r-2 border-b-2 rounded-br-3xl border-gray-200"} overflow-y-auto ${height} ${width}`}>
				<Box className={`flex items-center pb-3 justify-between  ${second ? "pt-11" : "pt-6"}`}>
					<Typography className="text-3xl">{title}</Typography>

					<Box className="flex ">
						{sideContent &&
							sideContent.map((content, index) => (
								<Box
									key={index}
									className="ml-2">
									{content}
								</Box>
							))}
					</Box>
				</Box>

				<CardContent className="pt-0 pl-3 pr-0">{children}</CardContent>
			</Box>
		</>
	);
}

export default GeneralCard;
