import { Box, Typography } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

function TitleComp({ title, horizontalLine }: { title: ReactNode; horizontalLine: boolean }) {
	const typographyRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState<number | null>(null);

	useEffect(() => {
		if (typographyRef.current) {
			const typographyWidth = typographyRef.current.getBoundingClientRect().width;
			setWidth(typographyWidth+11);
		}
	}, []);

	return (
		<Box className="pt-3 relative">
			<Box
				style={{ width: `${width}px` }}
				className="border-t-2 border-l-2 border-gray-200 h-6 rounded-tl-xl absolute -left-3"
			/>

			<Typography
				ref={typographyRef}
				className={`pt-1  text-lg text-nowrap w-fit`}>
				{title}
			</Typography>
		</Box>
	);
}

export default TitleComp;
