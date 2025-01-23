import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import GeneralCard from "./GeneralCard";
import Title from "./Title";

const Sports = () => {
	const firstTypographyRef = useRef<HTMLDivElement>(null); // TODO později předělat na useState (až bude tlačítko)
	const secondTypographyRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState<number | null>(null);

	useEffect(() => {
		if (firstTypographyRef.current && secondTypographyRef.current) {
			const typographyWidth = firstTypographyRef.current.getBoundingClientRect().width + secondTypographyRef.current.getBoundingClientRect().width;
			setWidth(typographyWidth + 16);
		}
	}, []);

	return (
		<GeneralCard
			title="Sporty"
			height="h-1/3"
			border>
			<Box className=" flex flex-col gap-3">
				<Box className="flex ">
					<Box className="w-1/2">
						<Title title="Název"></Title>
					</Box>
					<Box>
						<Title title="Autor"></Title>
					</Box>
				</Box>

				<Box className="flex relative pl-3">
					{/*<Box
						style={{ width: `${width}px` }}
						className="border-b-2 border-x-2 border-gray-200 h-2 rounded-br-xl rounded-bl-xl  absolute top-4 -left-2"
					/>*/}
					<Typography className="absolute -left-4   text-gray-200">⬤</Typography>

					<Typography
						ref={firstTypographyRef}
						className="w-1/2">
						Bodybuilding
					</Typography>
					<Typography
						ref={secondTypographyRef}
						className="">
						Jakub Švihel
					</Typography>
				</Box>

				<Box className="flex">
					<Typography className="w-1/2 font-light">Powerlifting</Typography>
					<Typography className="font-light">KlikFit</Typography>
				</Box>

				<Box className="flex">
					<Typography className="w-1/2 font-light">Jóga</Typography>
					<Typography className="font-light">Alfons Mucha</Typography>
				</Box>

				<Box className="flex">
					<Typography className="w-1/2 font-light">Fotbal</Typography>
					<Typography className="font-light">KlikFit</Typography>
				</Box>

				<Box className="flex">
					<Typography className="w-1/2 font-light">Japonský šerm</Typography>
					<Typography className="font-light">Jakub Švihel</Typography>
				</Box>
			</Box>
		</GeneralCard>
	);
};

export default Sports;
