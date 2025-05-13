import { Box } from "@mui/material";
import { ReactNode } from "react";

interface TwoColumnsPageProps {
	firstColumnWidth?: string;
	firstColumnHeight?: string;
	firstColumnChildren: ReactNode;
}

const OneColumnPage = ({ firstColumnWidth, firstColumnHeight, firstColumnChildren }: TwoColumnsPageProps) => {
	return (
		<Box className="flex justify-center  h-content-prelog pt-7 px-1 w-full">
			<Box
				className={`${firstColumnWidth || "w-1/2"} ${firstColumnHeight || "h-full "} rounded-3xl pb-1    mt-4
						    `}>
				{firstColumnChildren}
			</Box>
		</Box>
	);
};

export default OneColumnPage;
