import { Box } from "@mui/material";
import { ReactNode } from "react";

interface TightTwoColumnsPageProps {
	firstColumnChildren: ReactNode;
	secondColumnChildren: ReactNode;
}

const TightTwoColumnsPage = ({ firstColumnChildren, secondColumnChildren }: TightTwoColumnsPageProps) => {
	return (
		<Box
			className="flex justify-center items-center h-content">
			<Box className={`w-1/3 h-full bg-white relative border-x-2 border-gray-200 `}>{firstColumnChildren}</Box>
			<Box className={`w-1/3 h-full bg-white rounded-br-3xl border-r-2 border-b-2 relative border-gray-200 `}>{secondColumnChildren}</Box>
		</Box>
	);
};

export default TightTwoColumnsPage;
