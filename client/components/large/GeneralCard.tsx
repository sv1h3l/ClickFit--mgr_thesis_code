import { StateAndSet } from "@/utilities/generalInterfaces";
import { Box, CardContent, Typography } from "@mui/material";
import { ReactNode, useState } from "react";

interface GeneralCardProps {
	firstTitle?: string;

	border?: boolean;
	height?: string;
	width?: string;
	marginBottom?: boolean;

	secondTitle?: string;

	firstSideContent?: ReactNode[];
	secondSideContent?: ReactNode[];
	onlyRightContent?: ReactNode[];

	removeJustifyBetween?: boolean;

	secondGeneralCard?: boolean;

	firstChildren: ReactNode;
	secondChildren?: ReactNode;

	showFirstSection?: StateAndSet<boolean>;
}

function GeneralCard({ firstTitle, secondTitle, height, width, marginBottom, secondGeneralCard, border, firstChildren, secondChildren, firstSideContent, secondSideContent, onlyRightContent, removeJustifyBetween, showFirstSection }: GeneralCardProps) {
	const [localShowFirstSection, setLocalShowFirstSection] = useState<boolean>(true);

	const isFirstSectionVisible = showFirstSection ? showFirstSection.state : localShowFirstSection;
	const setSectionVisibility = showFirstSection ? showFirstSection.setState : setLocalShowFirstSection;

	return (
		<Box
			className={`flex flex-col bg-primary-color-neutral overflow-auto px-8 rounded-3xl border-[3px]  shadow-md
						${height} ${width} ${marginBottom && ""} `}>
			{/* Header */}
			<Box
				className={`flex items-center pb-3 
							${!removeJustifyBetween && "justify-between"} ${secondGeneralCard ? "pt-11" : "pt-6"}`}>
				{/* První title */}
				<Box className="flex">
					<Typography
						className={`text-3xl ${secondTitle && "cursor-pointer"}  select-none transition-all ${!isFirstSectionVisible && "opacity-40"} font-audiowide tracking-wide `}
						onClick={() => setSectionVisibility(true)}>
						{firstTitle}
					</Typography>

					{firstSideContent && localShowFirstSection && (
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

				{/* Druhý title */}
				{secondTitle && (
					<Box className="flex">
						{secondSideContent && !localShowFirstSection && (
							<Box className="flex">
								{secondSideContent.map((content, index) => (
									<Box
										key={index}
										className="mr-2">
										{content}
									</Box>
								))}
							</Box>
						)}

						<Typography
							className={`text-3xl cursor-pointer transition-all select-none ${isFirstSectionVisible && "opacity-40"} font-audiowide tracking-wide  `}
							onClick={() => setSectionVisibility(false)}>
							{secondTitle}
						</Typography>
					</Box>
				)}

				{onlyRightContent && (
					<Box className="flex">
						{onlyRightContent.map((content, index) => (
							<Box key={index}>{content}</Box>
						))}
					</Box>
				)}

				{/* Doplňkový obsah */}
			</Box>

			{/* Content */}
			<CardContent className={`flex-grow pt-0 pl-3 pr-0 `}>{isFirstSectionVisible ? firstChildren : secondChildren}</CardContent>
		</Box>
	);
}

export default GeneralCard;
