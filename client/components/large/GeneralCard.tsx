import { useAppContext } from "@/utilities/Context";
import { StateAndSet } from "@/utilities/generalInterfaces";
import { Box, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";

interface GeneralCardProps {
	firstTitle?: string;
	centerFirstTitle?: boolean;
	prolog?: boolean;

	height?: string;
	width?: string;
	style?: string;
	marginBottom?: boolean;
	disabled?: boolean;
	zeroYPadding?: boolean;
	zeroXPadding?: boolean;

	secondTitle?: string;

	firstSideContent?: ReactNode[];
	secondSideContent?: ReactNode[];
	onlyRightContent?: ReactNode[];

	removeJustifyBetween?: boolean;

	secondGeneralCard?: boolean;

	firstChildren: ReactNode;
	secondChildren?: ReactNode;

	showFirstSection?: StateAndSet<boolean>;
	showFirstSectionSignal?: StateAndSet<boolean>;

	zeroChildrenPadding?: boolean;
	dontShowHr?: boolean;
	showBackButton?: boolean;
	backButtonClick?: () => void;
}

function GeneralCard({
	firstTitle,
	secondTitle,
	centerFirstTitle,
	prolog,
	height,
	width,
	style,
	marginBottom,
	zeroYPadding,
	zeroXPadding,
	disabled,
	secondGeneralCard,
	firstChildren,
	secondChildren,
	firstSideContent,
	secondSideContent,
	zeroChildrenPadding,
	onlyRightContent,
	removeJustifyBetween,
	showFirstSection,
	showFirstSectionSignal,
	dontShowHr,
	showBackButton,
	backButtonClick,
}: GeneralCardProps) {
	const [localShowFirstSection, setLocalShowFirstSection] = useState<boolean>(true);
	const [isVisible, setIsVisible] = useState<boolean>(true);

	const isFirstSectionVisible = showFirstSection ? showFirstSection.state : localShowFirstSection;
	const setSectionVisibility = showFirstSection ? showFirstSection.setState : setLocalShowFirstSection;

	const context = useAppContext();

	const handleSectionSwitch = (showFirst: boolean) => {
		if (showFirst === isFirstSectionVisible) return;

		setIsVisible(false);
		showFirstSectionSignal?.setState(showFirst);

		setTimeout(() => {
			setSectionVisibility(showFirst);
			setIsVisible(true);
		}, 150);
	};
	return (
		<Box
			sx={{
				overflowY: "auto",
				scrollbarGutter: "stable",
			}}
			className={`flex flex-col bg-primary-color-neutral overflow-auto  rounded-3xl border-[3px]  overflow-x-hidden gutter shadow-black shadow-md
						${context.bgPrimaryColor} ${context.borderPrimaryColor}
						${!zeroXPadding && "px-5"}
						${!zeroYPadding && "pb-6"}
						${height} ${width} ${style} ${disabled && "opacity-50"} ${marginBottom && ""} `}>
			{/* Header */}
			<Box
				className={`flex items-center 
							${!zeroYPadding && "pb-3 "}
							${!removeJustifyBetween && "justify-between"} ${!zeroYPadding && (secondGeneralCard ? "pt-11" : prolog ? "pt-10" : "pt-3")}`}>
				{/* První title */}
				<Box className={`flex items-center ${centerFirstTitle && "justify-center w-full"}`}>
					{showBackButton ? (
						<ButtonComp
							content={IconEnum.ARROW}
							color="text-white"
							style="mr-4"
							onClick={backButtonClick}
							contentStyle="rotate-180"
							size="small"
							justClick
							dontChangeOutline
						/>
					) : null}

					<Typography
						className={` text-[1.6rem] ${secondTitle && !disabled && "cursor-pointer"}  select-none transition-all ${!isFirstSectionVisible && "opacity-40"} font-audiowide tracking-wide `}
						onClick={disabled ? () => {} : () => handleSectionSwitch(true)}>
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
							className={`text-[1.6rem] ${!disabled && "cursor-pointer"} transition-all select-none ${isFirstSectionVisible && "opacity-40"} font-audiowide tracking-wide  `}
							onClick={disabled ? () => {} : () => handleSectionSwitch(false)}>
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

			{!dontShowHr ? (
				<Box className="relative w-full ">
					<Box
						className={`w-[110%] absolute  border-t-[3px] -left-5 
					 ${context.borderPrimaryColor}`}
					/>
				</Box>
			) : null}

			{/* Content */}
			<Box
				className={`flex-grow  pr-0 transition-opacity duration-300 ease-in-out
							${!zeroChildrenPadding && "pt-4"}
							${isVisible ? "opacity-100" : "opacity-0"}`}>
				{isFirstSectionVisible ? firstChildren : secondChildren}
			</Box>
		</Box>
	);
}

export default GeneralCard;
