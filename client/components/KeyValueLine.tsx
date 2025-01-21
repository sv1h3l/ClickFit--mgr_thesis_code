import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

function KeyValueLineComp({ title, value }: { title: ReactNode; value: ReactNode }) {
	return (
		<Box
			component="div"
			className="flex gap-3 w-full px-3 ">
			<Typography
				component="p"
				className="font-light text-nowrap">
				{title}
			</Typography>

			<Typography
				component="p"
				className="text-gray-400 font-light text-nowrap">
				»
			</Typography>

			<Typography
				component="p"
				className={` text-nowrap ${!value && "text-gray-400 font-light "}`}>
				{value ? value : "Není vyplněno"}
			</Typography>
		</Box>
	);
}

export default KeyValueLineComp;
