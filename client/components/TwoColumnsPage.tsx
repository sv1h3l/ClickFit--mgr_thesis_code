import { Box } from "@mui/material";
import { ReactNode } from "react";

interface TwoColumnsPageProps {
	firstColumnWidth?: string;
	secondColumnWidth?: string;
	firstColumnHeight?: string;
	secondColumnHeight?: string;
	firstColumnChildren: ReactNode;
	secondColumnChildren: ReactNode;
}

const TwoColumnsPage = ({ firstColumnWidth, secondColumnWidth, firstColumnHeight, secondColumnHeight, firstColumnChildren, secondColumnChildren }: TwoColumnsPageProps) => {
	return (
		<Box className="flex justify-center h-content">
			<Box
				className={`${firstColumnWidth || "w-1/2"} ${firstColumnHeight || "h-full "}  ${secondColumnHeight && "rounded-br-3xl"} 
						bg-white relative  border-l-2 border-gray-200 `}>
				{firstColumnChildren}
			</Box>
			<Box
				className={`${secondColumnWidth || "w-1/2"} ${secondColumnHeight || "h-full"}
						bg-white rounded-br-3xl border-r-2 border-b-2 relative border-gray-200 `}>
				{secondColumnChildren}
			</Box>
		</Box>
	);
};

export default TwoColumnsPage;
