import { StateAndSet } from "@/utilities/generalInterfaces";
import { Box, CardContent, Typography } from "@mui/material";
import { ReactNode, useState } from "react";

interface GeneralCardProps {
	firstTitle?: string;

	border?: boolean;
	height?: string;
	width?: string;

	secondTitle?: string;

	firstSideContent?: ReactNode[];
	secondSideContent?: ReactNode[];

	removeJustifyBetween?: boolean;

	secondGeneralCard?: boolean;

	firstChildren: ReactNode;
	secondChildren?: ReactNode;

	showFirstSection?: StateAndSet<boolean>;
}

function GeneralCard({ firstTitle, secondTitle, height, width, secondGeneralCard, border, firstChildren, secondChildren, firstSideContent, secondSideContent, removeJustifyBetween, showFirstSection }: GeneralCardProps) {
	const [localShowFirstSection, setLocalShowFirstSection] = useState<boolean>(true);

	const isFirstSectionVisible = showFirstSection ? showFirstSection.state : localShowFirstSection;
	const setSectionVisibility = showFirstSection ? showFirstSection.setState : setLocalShowFirstSection;

	return (
		<Box className={`flex flex-col ${height} ${width} px-8 ${border && "border-r-2 border-b-2 rounded-br-3xl border-gray-200"} overflow-auto`}>
			{/* Header */}
			<Box
				className={`flex items-center pb-3 
			${!removeJustifyBetween && "justify-between"} ${secondGeneralCard ? "pt-11" : "pt-6"}`}>
				{/* První title */}
				<Typography
					className={`text-3xl ${secondTitle && "cursor-pointer"} select-none transition-all ${!isFirstSectionVisible && "text-gray-300"}`}
					onClick={() => setSectionVisibility(true)}>
					{firstTitle}
				</Typography>

				{/* Druhý title */}
				{secondTitle && (
					<Box className="flex">
						{secondSideContent && (
							<Box className="flex">
								{secondSideContent.map((content, index) => (
									<Box
										key={index}
										className="ml-2">
										{content}
									</Box>
								))}
							</Box>
						)}

						<Typography
							className={`text-3xl cursor-pointer transition-all select-none ${isFirstSectionVisible && "text-gray-300"}`}
							onClick={() => setSectionVisibility(false)}>
							{secondTitle}
						</Typography>
					</Box>
				)}

				{/* Doplňkový obsah */}
				{firstSideContent && (
					<Box className="flex">
						{firstSideContent.map((content, index) => (
							<Box
								key={index}
								className="ml-2">
								{content}
							</Box>
						))}
					</Box>
				)}
			</Box>

			{/* Content */}
			<CardContent className={`flex-grow pt-0 pl-3 pr-0 `}>{isFirstSectionVisible ? firstChildren : secondChildren}</CardContent>
		</Box>
	);
}

export default GeneralCard;
