import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface TitleProps {
	title: string;
	sideContent?: React.ReactNode;

	border?: boolean;

	secondTitle?: string;

	style?: string;
	smallPaddingTop?: boolean;
}

function Title(props: TitleProps) {
	const titleRef = useRef<HTMLDivElement>(null);
	const secondTitleRef = useRef<HTMLDivElement>(null);

	const [widthOfTitle, setWidthOfTitle] = useState<number | null>(null);
	const [widthOfSecondTitle, setWidthOfSecondTitle] = useState<number | null>(null);

	useEffect(() => {
		if (titleRef.current) {
			const typographyWidth = titleRef.current.getBoundingClientRect().width;
			setWidthOfTitle(typographyWidth + 12);
		}

		if (secondTitleRef.current) {
			const typographyWidth = secondTitleRef.current.getBoundingClientRect().width;
			setWidthOfSecondTitle(typographyWidth + 12);
		}
	}, []);

	return (
		<Box className={`${props.secondTitle && "flex"}`}>
			<Box
				className={`relative flex  items-center
                           ${props.style} ${props.smallPaddingTop ? "pt-2" : "pt-8"}  ${props.secondTitle && "w-1/2"}`}>
				{props.sideContent}

				{props.border && (
					<Box
						style={{ width: `${widthOfTitle}px` }}
						className="border-t-2 border-l-2 border-blue-300 h-6 rounded-tl-lg absolute -left-2.5 -mt-2"
					/>
				)}

				<Typography
					ref={titleRef}
					className={`pt-1  text-lg text-nowrap w-fit`}>
					{props.title}
				</Typography>
			</Box>

			{props.secondTitle && (
				<Box className={`relative ${props.smallPaddingTop ? "pt-2" : "pt-8"}`}>
					{props.border && (
						<Box
							style={{ width: `${widthOfSecondTitle}px` }}
							className="border-t-2 border-l-2 border-blue-300 h-6 rounded-tl-lg absolute -left-2.5"
						/>
					)}

					<Typography
						ref={secondTitleRef}
						className={`pt-1  text-lg text-nowrap w-fit`}>
						{props.secondTitle}
					</Typography>
				</Box>
			)}
		</Box>
	);
}

export default Title;
